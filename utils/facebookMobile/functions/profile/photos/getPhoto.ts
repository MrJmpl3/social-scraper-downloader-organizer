import { isNil } from 'lodash'
import { Photo, PhotoViewer } from '@/utils/facebookMobile/interfaces'
import log from '@/utils/facebookMobile/logger'

const getPhoto = async (
  page,
  profileName: string,
  photoViewer: PhotoViewer,
  waitTime: number
): Promise<Photo | null> => {
  await page.waitForTimeout(waitTime)
  log(profileName, `Go to: https://m.facebook.com${photoViewer.url}`)
  await page.goto(`https://m.facebook.com${photoViewer.url}`)
  await page.waitForTimeout(waitTime)
  await page.waitForSelector('div[role="main"]')

  const photoNode = await page.$(
    '.attachment a[href^="/photo/view_full_size/"]'
  )

  if (!isNil(photoNode)) {
    const photoHref = await photoNode.evaluate((el) => el.getAttribute('href'))

    if (isNil(photoHref)) {
      return null
    }

    log(profileName, `Go to: https://m.facebook.com${photoHref}`)
    await page.goto(`https://m.facebook.com${photoHref}`, {
      waitUntil: 'load',
    })

    return { url: page.url(), type: 'original' }
  }

  const photoAltNode = await page.$('i[data-sigil="photo-image"]')

  if (isNil(photoAltNode)) {
    return null
  }

  const photoAltHref = await page.evaluate(
    (obj) => obj.getAttribute('data-store'),
    photoAltNode
  )

  if (isNil(photoAltHref)) {
    log(profileName, `Alt url not found`)
    return null
  }

  const altUrl = JSON.parse(photoAltHref).imgsrc
  log(profileName, `Alt url found: ${altUrl}`)

  return { url: altUrl, type: 'alt' }
}

export default getPhoto
