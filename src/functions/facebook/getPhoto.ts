import { isNil } from 'lodash'
import { Page } from 'puppeteer'
import { addPhoto } from '@/functions/facebook/dataManager'
import { Album, Data, Photo, PhotoViewer } from '@/interfaces/facebook'

const getPhoto = async (
  page: Page,
  accountName: string,
  accountData: Readonly<Data>,
  album: Readonly<Album>,
  photoViewer: Readonly<PhotoViewer>,
  waitTime: number
): Promise<Photo> => {
  await page.waitForTimeout(waitTime)
  await page.goto(
    photoViewer.url.replace(
      'https://m.facebook.com/',
      'https://www.facebook.com/'
    )
  )
  await page.waitForTimeout(waitTime)
  await page.waitForSelector('div[data-pagelet="MediaViewerPhoto"]')

  const photoNode = await page.$('div[data-pagelet="MediaViewerPhoto"] img')
  if (isNil(photoNode)) {
    throw new Error('Cannot get photoNode')
  }

  const photoUrl = await photoNode.evaluate((el) => el.getAttribute('src'))
  if (isNil(photoUrl)) {
    throw new Error('Cannot get photoUrl')
  }

  const photo = {
    url: photoUrl,
    downloaded: false,
  }

  addPhoto(accountName, accountData, album, photoViewer, photo)

  return photo
}

export default getPhoto
