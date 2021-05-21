import { resolve } from 'path'
import { getUnixTime } from 'date-fns'
import * as fs from 'fs-extra'
import sanitize from 'sanitize-filename'
import { TypePost } from '@/utils/tiktok/interfaces'

export const pathFolder = () => {
  let path = resolve(__dirname, '..', 'db', 'tiktok')

  if (process.env.TIKTOK_FOLDER) {
    path = resolve(process.env.TIKTOK_FOLDER)
  }

  fs.ensureDirSync(path)

  return path
}

export const getPathFolderProfile = (profile: string) => {
  const path = resolve(pathFolder(), sanitize(profile))

  fs.ensureDirSync(path)

  return path
}

export const getPathFolderProfileTrash = (profile: string) => {
  const path = resolve(getPathFolderProfile(profile), 'trash')

  fs.ensureDirSync(path)

  return path
}

export const getPathFileImage = (profile: string, fileName: string) =>
  resolve(getPathFolderProfile(profile), sanitize(fileName))

export const fileVideoName = (idPost: string, type: TypePost) => {
  if (type === 'advanceplus') {
    return `${idPost}_advanceplus`
  }

  if (type === 'advance') {
    return `${idPost}_advance`
  }

  return `${idPost}`
}

export const getPathFileVideo = (
  profile: string,
  idPost: string,
  type: TypePost
) =>
  resolve(getPathFolderProfile(profile), `${fileVideoName(idPost, type)}.mp4`)

export const getPathFileVideoTrash = (
  profile: string,
  idPost: string,
  type: TypePost,
  reasonSize = false
) =>
  resolve(
    getPathFolderProfileTrash(profile),
    `${fileVideoName(idPost, type)}_${reasonSize ? 'size_' : ''}${getUnixTime(
      new Date()
    )}.mp4`
  )

export const existsFileVideo = (
  profile: string,
  idPost: string,
  type: TypePost
) => fs.existsSync(getPathFileVideo(profile, idPost, type))
