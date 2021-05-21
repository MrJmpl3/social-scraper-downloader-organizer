import { resolve } from 'path'
import { URL } from 'url'
import fs from 'fs-extra'
import { Album } from '@/utils/facebookMobile/interfaces'
import log from '@/utils/facebookMobile/logger'
import { getPathFolderProfile } from '@/utils/facebookMobile/paths'

const getAlbumsList = async (
  page,
  profileUrl: string,
  profileName: string,
  waitTime: number
) => {
  const PATH_JSON_ALBUMS_LIST = resolve(
    getPathFolderProfile(profileName),
    'albums',
    'albums.json'
  )

  await page.waitForTimeout(waitTime)
  log(profileName, `Go to: ${profileUrl}/photos`)
  await page.goto(`${profileUrl}/photos`)
  await page.waitForTimeout(waitTime)
  await page.waitForSelector('.timeline.albums')

  let moreButton = await page.$('#m_more_albums a')
  while (moreButton !== null) {
    await moreButton.focus()
    log(profileName, `Click in more button`)
    await moreButton.click()

    await page.waitForTimeout(waitTime)

    moreButton = await page.$('#m_more_albums a')
  }

  await page.waitForSelector('.timeline.albums a')

  const albums: Album[] = []
  const albumsNode = await page.$$('.timeline.albums a')

  for (const albumNode of albumsNode) {
    const albumUrl = await albumNode.evaluate((el) => el.getAttribute('href'))
    if (albumUrl === null) {
      continue
    }

    const albumTitleNode = await albumNode.$('.title strong')
    if (albumTitleNode === null) {
      continue
    }

    const albumTitle = await albumTitleNode.evaluate((el) => el.innerHTML)
    if (albumTitle === null) {
      continue
    }

    let albumId = '?'
    if (albumUrl.includes('album=')) {
      albumId = new URL(`${profileUrl}${albumUrl}`).searchParams.get(
        'album'
      ) as string
    } else if (albumUrl.includes('/albums/')) {
      albumId = albumUrl
        .substring(albumUrl.length - 1, 1)
        .split('/')
        .pop() as string
    }

    const newAlbum: Album = { name: albumTitle, url: albumUrl, id: albumId }
    albums.push(newAlbum)
  }

  fs.writeFileSync(PATH_JSON_ALBUMS_LIST, JSON.stringify(albums))

  return albums
}

export default getAlbumsList
