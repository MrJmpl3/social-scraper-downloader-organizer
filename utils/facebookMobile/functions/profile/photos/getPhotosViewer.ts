import { resolve } from 'path'
import fs from 'fs-extra'
import { isNil } from 'lodash'
import { Album, PhotoViewer } from '@/utils/facebookMobile/interfaces'
import log from '@/utils/facebookMobile/logger'
import { getPathFolderPhotoAlbum } from '@/utils/facebookMobile/paths'

const getPhotosViewer = async (
  page,
  album: Album,
  profileName: string,
  waitTime: number
) => {
  try {
    const PATH_JSON_PHOTOS_VIEWER = resolve(
      getPathFolderPhotoAlbum(profileName, album),
      'photos-viewer.json'
    )

    const PHOTO_VIEWERS: PhotoViewer[] = []

    await page.waitForTimeout(waitTime)
    log(profileName, `Go to: https://m.facebook.com${album.url}`)
    await page.goto(`https://m.facebook.com${album.url}`)
    await page.waitForTimeout(waitTime)
    await page.waitForSelector('div[role="main"]')

    // Bucle en Ver Más
    let moreDiv = await page.$('#m_more_photos')
    while (moreDiv !== null) {
      log(profileName, `Scroll to Bottom`)
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
      await page.waitForTimeout(waitTime)

      moreDiv = await page.$('#m_more_photos')
    }

    const urlPhotosViewerNode = await page.$$(
      'div[role="main"] a[href^="/photo.php?"]'
    )

    for (const urlPhotoViewerNode of urlPhotosViewerNode) {
      const urlPhotoViewer = await urlPhotoViewerNode.evaluate((el) =>
        el.getAttribute('href')
      )

      if (!isNil(urlPhotoViewer)) {
        PHOTO_VIEWERS.push({ url: urlPhotoViewer })
      }
    }

    fs.writeFileSync(PATH_JSON_PHOTOS_VIEWER, JSON.stringify(PHOTO_VIEWERS))

    return PHOTO_VIEWERS
  } catch (e) {
    return []
  }
}

export default getPhotosViewer
