import { resolve } from 'path';
import { getUnixTime } from 'date-fns';
import * as fs from 'fs-extra';
import sanitize from 'sanitize-filename';
import { VideoType } from '@/interfaces/tiktok';

export const getFolderPath = (): string => {
  let path = resolve(__dirname, '..', 'db', 'tiktok');

  if (process.env.TIKTOK_FOLDER) {
    path = resolve(process.env.TIKTOK_FOLDER);
  }

  fs.ensureDirSync(path);

  return path;
};

export const getAccountFolderPath = (accountName: string): string => {
  const path = resolve(getFolderPath(), sanitize(accountName));

  fs.ensureDirSync(path);

  return path;
};

export const getAccountTrashFolderPath = (accountName: string): string => {
  const path = resolve(getAccountFolderPath(accountName), 'trash');

  fs.ensureDirSync(path);

  return path;
};

export const getImageFilePath = (
  accountName: string,
  fileName: string
): string => resolve(getAccountFolderPath(accountName), sanitize(fileName));

export const getVideoFileName = (
  videoId: string,
  videoType: VideoType
): string => {
  if (videoType === 'advanceplus') {
    return `${videoId}_advanceplus`;
  }

  if (videoType === 'advance') {
    return `${videoId}_advance`;
  }

  return `${videoId}`;
};

export const getVideoFilePath = (
  accountName: string,
  videoId: string,
  videoType: VideoType
): string =>
  resolve(
    getAccountFolderPath(accountName),
    `${getVideoFileName(videoId, videoType)}.mp4`
  );

export const getVideoTempFilePath = (
  accountName: string,
  videoId: string,
  videoType: VideoType
): string =>
  resolve(
    getAccountFolderPath(accountName),
    `${getVideoFileName(videoId, videoType)}_temp.mp4`
  );

export const getVideoTrashFilePath = (
  accountName: string,
  videoId: string,
  videoType: VideoType
): string =>
  resolve(
    getAccountTrashFolderPath(accountName),
    `${getVideoFileName(videoId, videoType)}_${getUnixTime(new Date())}.mp4`
  );

export const getDataFilePath = (accountName: string): string =>
  resolve(getAccountFolderPath(accountName), 'data.json');

export const existsVideoFile = (
  accountName: string,
  videoId: string,
  videoType: VideoType
): boolean => fs.existsSync(getVideoFilePath(accountName, videoId, videoType));

export const existsDataFile = (accountName: string): boolean =>
  fs.existsSync(getDataFilePath(accountName));
