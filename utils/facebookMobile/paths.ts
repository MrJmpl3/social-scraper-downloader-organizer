import { resolve } from 'path'
import { URL } from 'url'
import { ensureDirSync } from 'fs-extra'
import sanitize from 'sanitize-filename'
import { Album, Photo } from '@/utils/facebookMobile/interfaces'

export const getPathFolder = (): string => {
  if (process.env.FACEBOOK_MOBILE_FOLDER) {
    return process.env.FACEBOOK_MOBILE_FOLDER
  }

  return resolve(__dirname, '..', 'db', 'facebookMobile')
}

export const getPathFolderProfile = (profileName: string) =>
  resolve(getPathFolder(), sanitize(profileName))

export const getPathFolderPhotoAlbums = (profileName: string) =>
  resolve(getPathFolderProfile(profileName), 'albums')

export const getPathFolderPhotoAlbum = (profileName: string, album: Album) => {
  return resolve(
    getPathFolderProfile(profileName),
    'albums',
    `[${album.id}] ${sanitize(album.name)}`
  )
}

export const getPathAltsFolder = (profileName: string, album: Album) => {
  const path = resolve(getPathFolderPhotoAlbum(profileName, album), 'alts')

  ensureDirSync(path)

  return path
}

export const getPathPhoto = (
  profileName: string,
  album: Album,
  photo: Photo
) => {
  const photoName = new URL(photo.url).pathname!.split('/').pop() as string

  if (photo.type === 'alt') {
    return resolve(getPathAltsFolder(profileName, album), sanitize(photoName))
  }

  return resolve(
    getPathFolderPhotoAlbum(profileName, album),
    sanitize(photoName)
  )
}

export const getPathFolderVideo = (profileName: string) =>
  resolve(getPathFolderProfile(profileName), 'videos')
