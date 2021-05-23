import { resolve } from 'path'
import { getUnixTime } from 'date-fns'
import * as fs from 'fs-extra'
import sanitize from 'sanitize-filename'
import { TypePost } from '@/interfaces/tiktok'

export const getFolderPath = (): string => {
  let path = resolve(__dirname, '..', 'db', 'tiktok')

  if (process.env.TIKTOK_FOLDER) {
    path = resolve(process.env.TIKTOK_FOLDER)
  }

  fs.ensureDirSync(path)

  return path
}

export const getProfileFolderPath = (profile: string): string => {
  const path = resolve(getFolderPath(), sanitize(profile))

  fs.ensureDirSync(path)

  return path
}

export const getProfileTrashFolderPath = (profile: string): string => {
  const path = resolve(getProfileFolderPath(profile), 'trash')

  fs.ensureDirSync(path)

  return path
}

export const getImageFilePath = (profile: string, fileName: string): string =>
  resolve(getProfileFolderPath(profile), sanitize(fileName))

export const getVideoFileName = (idPost: string, type: TypePost): string => {
  if (type === 'advanceplus') {
    return `${idPost}_advanceplus`
  }

  if (type === 'advance') {
    return `${idPost}_advance`
  }

  return `${idPost}`
}

export const getVideoFilePath = (
  profile: string,
  idPost: string,
  type: TypePost
): string =>
  resolve(
    getProfileFolderPath(profile),
    `${getVideoFileName(idPost, type)}.mp4`
  )

export const getVideoTempFilePath = (
  profile: string,
  idPost: string,
  type: TypePost
): string =>
  resolve(
    getProfileFolderPath(profile),
    `${getVideoFileName(idPost, type)}_temp.mp4`
  )

export const getVideoTrashFilePath = (
  profile: string,
  idPost: string,
  type: TypePost,
  reasonSize = false
): string =>
  resolve(
    getProfileTrashFolderPath(profile),
    `${getVideoFileName(idPost, type)}_${
      reasonSize ? 'size_' : ''
    }${getUnixTime(new Date())}.mp4`
  )

export const getDataFilePath = (profile: string): string =>
  resolve(getProfileFolderPath(profile), 'data.json')

export const existsVideoFile = (
  profile: string,
  idPost: string,
  type: TypePost
): boolean => fs.existsSync(getVideoFilePath(profile, idPost, type))

export const existsDataFile = (profile: string): boolean =>
  fs.existsSync(getDataFilePath(profile))
