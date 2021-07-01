import { resolve } from 'path';
import * as fs from 'fs-extra';
import sanitize from 'sanitize-filename';
import { Album, Photo } from '@/interfaces/facebook';

export const getFolderPath = (): string => {
  if (process.env.FACEBOOK_FOLDER) {
    return process.env.FACEBOOK_FOLDER;
  }

  return resolve(__dirname, '..', 'db', 'facebook');
};

export const getProfileFolderPath = (accountName: string): string => {
  const path = resolve(getFolderPath(), sanitize(accountName));

  fs.ensureDirSync(path);

  return path;
};

export const getPhotoAlbumsFolderPath = (accountName: string): string => {
  const path = resolve(getProfileFolderPath(accountName), 'albums');

  fs.ensureDirSync(path);

  return path;
};

export const getPhotoAlbumFolderPath = (
  accountName: string,
  album: Album
): string => {
  const path = resolve(
    getPhotoAlbumsFolderPath(accountName),
    `[${album.id}] ${sanitize(album.name)}`
  );

  fs.ensureDirSync(path);

  return path;
};

export const getPhotoFilePath = (
  profileName: string,
  album: Album,
  photo: Photo
): string => {
  const photoName = new URL(photo.url).pathname!.split('/').pop() as string;

  return resolve(
    getPhotoAlbumFolderPath(profileName, album),
    sanitize(photoName)
  );
};

export const getDataFilePath = (profile: string): string =>
  resolve(getProfileFolderPath(profile), 'data.json');

export const existsDataFile = (profile: string): boolean =>
  fs.existsSync(getDataFilePath(profile));
