/* eslint-disable no-param-reassign */
import { resolve } from 'path'
import { URL } from 'url'
import fs from 'fs-extra'
import { ListrTask } from 'listr2'
import { isNil } from 'lodash'
import downloadFile from '@/utils/facebookMobile/downloadFile'
import getAlbumsList from '@/utils/facebookMobile/functions/profile/photos/getAlbumsList'
import getPhoto from '@/utils/facebookMobile/functions/profile/photos/getPhoto'
import getPhotosViewer from '@/utils/facebookMobile/functions/profile/photos/getPhotosViewer'
import { Context, PhotoViewer } from '@/utils/facebookMobile/interfaces'
import log from '@/utils/facebookMobile/logger'
import {
  getPathFolderPhotoAlbum,
  getPathFolderPhotoAlbums,
  getPathPhoto,
} from '@/utils/facebookMobile/paths'

const downloadPhoto = (browser, profileUrl: string): ListrTask<Context> => ({
  title: profileUrl,
  task: async (ctx, task) => {
    const page = await browser.newPage()

    await page.goto(profileUrl)
    await page.waitForTimeout(ctx.waitTime)
    await page.waitForSelector('h3')

    task.output = 'Getting name of profile'

    let profileName = profileUrl.replace('https://m.facebook.com/', '')
    if (profileUrl.indexOf('profile.php?id=') !== -1) {
      profileName = new URL(profileUrl).searchParams.get('id') as string
    }

    log(profileName, `Name found: ${profileName}`)
    fs.ensureDirSync(getPathFolderPhotoAlbums(profileName))

    task.output = 'Getting albums of photos'

    let albumsList = await getAlbumsList(
      page,
      profileUrl,
      profileName,
      ctx.waitTime
    )
    albumsList = albumsList.sort(() => Math.random() - 0.5)

    for (const album of albumsList) {
      fs.ensureDirSync(getPathFolderPhotoAlbum(profileName, album))
    }

    let albumLoaded = 1
    for (const album of albumsList) {
      task.output = `Loading albums: ${albumLoaded}/${albumsList.length} - ${album.name}`

      const PATH_JSON_PHOTOS_VIEWER_DOWNLOADED = resolve(
        getPathFolderPhotoAlbum(profileName, album),
        'photos-viewer-downloaded.json'
      )

      fs.ensureDirSync(getPathFolderPhotoAlbum(profileName, album))

      let photosViewerDownloaded: PhotoViewer[] = []

      if (fs.existsSync(PATH_JSON_PHOTOS_VIEWER_DOWNLOADED)) {
        photosViewerDownloaded = JSON.parse(
          fs.readFileSync(PATH_JSON_PHOTOS_VIEWER_DOWNLOADED).toString()
        ) as PhotoViewer[]
      }

      task.output = `Getting photos viewers of album ${album.name}`

      const photosViewer = await getPhotosViewer(
        page,
        album,
        profileName,
        ctx.waitTime
      )

      task.output = `${photosViewer.length} photos found`

      let photoViewerLoaded = 1
      for (const photoViewer of photosViewer) {
        task.output = `Loading photo viewer: ${photoViewerLoaded}/${photosViewer.length}`

        const PHOTOS_VIEWER_ALREADY_DOWNLOADED =
          photosViewerDownloaded.find(
            (photoViewerDownloaded) =>
              photoViewerDownloaded.url === photoViewer.url
          ) !== undefined

        if (PHOTOS_VIEWER_ALREADY_DOWNLOADED) {
          photoViewerLoaded += 1
          continue
        }

        const photo = await getPhoto(
          page,
          profileName,
          photoViewer,
          ctx.waitTime
        )
        if (isNil(photo)) {
          continue
        }

        await page.waitForTimeout(ctx.waitTime)
        await downloadFile(photo.url, getPathPhoto(profileName, album, photo))

        photosViewerDownloaded.push(photoViewer)

        fs.writeFileSync(
          PATH_JSON_PHOTOS_VIEWER_DOWNLOADED,
          JSON.stringify(photosViewerDownloaded)
        )
        photoViewerLoaded += 1
      }

      albumLoaded += 1
    }

    await page.close()
  },
})

export default downloadPhoto
