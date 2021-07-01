import * as fs from 'fs-extra';
import { isNil } from 'lodash';
import { Album, Data, Photo, PhotoViewer } from '@/interfaces/facebook';
import { getDataFilePath } from '@/paths/facebook';

export const loadData = (accountName: string): Readonly<Data> =>
  JSON.parse(fs.readFileSync(getDataFilePath(accountName)).toString()) as Data;

export const saveData = (
  accountName: string,
  accountData: Data
): Readonly<Data> => {
  fs.writeFileSync(getDataFilePath(accountName), JSON.stringify(accountData));

  return accountData;
};

export const getAlbum = (
  accountData: Readonly<Data>,
  albumId: string
): { data: Album; index: number } | null => {
  const albumFoundIndex = accountData.albums.findIndex(
    (albumIterator) => albumIterator.id === albumId
  );

  if (albumFoundIndex === -1) {
    return null;
  }

  return { index: albumFoundIndex, data: accountData.albums[albumFoundIndex] };
};

export const getPhotoViewer = (
  accountData: Readonly<Data>,
  albumId: string,
  photoViewerUrl: string
): null | {
  data: PhotoViewer;
  index: number;
} => {
  const albumFoundIndex = accountData.albums.findIndex(
    (albumIterator) => albumIterator.id === albumId
  );

  if (albumFoundIndex === -1) {
    return null;
  }

  const photoViewerFoundIndex = accountData.albums[
    albumFoundIndex
  ].photoViewers.findIndex(
    (photoViewersIterator) => photoViewersIterator.url === photoViewerUrl
  );

  if (photoViewerFoundIndex === -1) {
    return null;
  }

  return {
    index: photoViewerFoundIndex,
    data: accountData.albums[albumFoundIndex].photoViewers[
      photoViewerFoundIndex
    ],
  };
};

export const getPhoto = (
  accountData: Readonly<Data>,
  albumId: string,
  photoViewerUrl: string,
  photoUrl: string
): null | {
  data: Photo;
  index: number;
} => {
  const albumFoundIndex = accountData.albums.findIndex(
    (albumIterator) => albumIterator.id === albumId
  );

  if (albumFoundIndex === -1) {
    return null;
  }

  const photoViewerFoundIndex = accountData.albums[
    albumFoundIndex
  ].photoViewers.findIndex(
    (photoViewersIterator) => photoViewersIterator.url === photoViewerUrl
  );

  if (photoViewerFoundIndex === -1) {
    return null;
  }

  const photoFound =
    accountData.albums[albumFoundIndex].photoViewers[photoViewerFoundIndex]
      .photo.url === photoUrl;

  if (!photoFound) {
    return null;
  }

  return {
    index: photoViewerFoundIndex,
    data: accountData.albums[albumFoundIndex].photoViewers[
      photoViewerFoundIndex
    ].photo,
  };
};

export const addAlbum = (
  accountName: string,
  accountData: Readonly<Data>,
  album: Readonly<Album>
): Readonly<Data> => {
  const newData = { ...accountData };

  const albumFound = getAlbum(accountData, album.id);

  if (isNil(albumFound)) {
    newData.albums.push(album);
  }

  saveData(accountName, newData);

  return newData;
};

export const addPhotoViewer = (
  accountName: string,
  accountData: Readonly<Data>,
  album: Readonly<Album>,
  photoViewer: Readonly<PhotoViewer>
): Readonly<Data> => {
  const newData = { ...accountData };

  const albumFound = getAlbum(accountData, album.id);

  if (isNil(albumFound)) {
    throw new Error('Album not exists');
  }

  const photoViewerFound = getPhotoViewer(
    accountData,
    album.id,
    photoViewer.url
  );

  if (isNil(photoViewerFound)) {
    newData.albums[albumFound.index].photoViewers.push(photoViewer);
  }

  saveData(accountName, newData);

  return newData;
};

export const addPhoto = (
  accountName: string,
  accountData: Readonly<Data>,
  album: Readonly<Album>,
  photoViewer: Readonly<PhotoViewer>,
  photo: Readonly<Photo>
): Readonly<Data> => {
  const newData = { ...accountData };

  const albumFound = getAlbum(accountData, album.id);
  if (isNil(albumFound)) {
    throw new Error('Album not exists');
  }

  const photoViewerFound = getPhotoViewer(
    accountData,
    album.id,
    photoViewer.url
  );

  if (isNil(photoViewerFound)) {
    throw new Error('PhotoViewer not exists');
  }

  const photoFound = getPhoto(
    accountData,
    album.id,
    photoViewer.url,
    photo.url
  );

  if (isNil(photoFound)) {
    newData.albums[albumFound.index].photoViewers[
      photoViewerFound.index
    ].photo = photo;
  }

  saveData(accountName, newData);

  return newData;
};

export const setPhoto = (
  accountName: string,
  accountData: Readonly<Data>,
  album: Readonly<Album>,
  photoViewer: Readonly<PhotoViewer>,
  photo: Readonly<Photo>
): Readonly<Data> => {
  const newData = { ...accountData };

  const albumFound = getAlbum(accountData, album.id);
  if (isNil(albumFound)) {
    throw new Error('Album not exists');
  }

  const photoViewerFound = getPhotoViewer(
    accountData,
    album.id,
    photoViewer.url
  );

  if (isNil(photoViewerFound)) {
    throw new Error('PhotoViewer not exists');
  }

  newData.albums[albumFound.index].photoViewers[photoViewerFound.index].photo =
    photo;

  saveData(accountName, newData);

  return newData;
};

export const checkPhotoViewerWasDownloaded = (
  accountData: Readonly<Data>,
  album: Readonly<Album>,
  photoViewer: Readonly<PhotoViewer>
): boolean => {
  const albumFound = getAlbum(accountData, album.id);
  if (isNil(albumFound)) {
    throw new Error('Album not exists');
  }

  const photoViewerFound = getPhotoViewer(
    accountData,
    album.id,
    photoViewer.url
  );

  if (isNil(photoViewerFound)) {
    throw new Error('PhotoViewer not exists');
  }

  return accountData.albums[albumFound.index].photoViewers[
    photoViewerFound.index
  ].photo.downloaded;
};
