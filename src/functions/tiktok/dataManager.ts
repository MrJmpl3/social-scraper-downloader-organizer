import { Data, TypePost } from '@/interfaces/tiktok';
import { existsVideoFile } from '@/paths/tiktok';

export const existsInVideoDownloaded = (
  data: Data,
  id: string,
  type: TypePost
): boolean =>
  data.videos.find((video) => video.id === id && video.type === type) !==
  undefined;

export const addInVideoDownloaded = (
  data: Data,
  id: string,
  type: TypePost
): Data => {
  const newData = { ...data };

  if (type === 'advanceplus') {
    let foundIndex = newData.videos.findIndex(
      (video) => video.id === id && video.type === 'normal'
    );

    if (foundIndex === -1) {
      foundIndex = newData.videos.findIndex(
        (video) => video.id === id && video.type === 'advance'
      );

      if (foundIndex === -1) {
        foundIndex = newData.videos.findIndex(
          (video) => video.id === id && video.type === 'advanceplus'
        );

        if (foundIndex === -1) {
          newData.videos.push({
            id,
            type,
          });
        }
      } else {
        newData.videos[foundIndex].type = 'advanceplus';
      }
    } else {
      newData.videos[foundIndex].type = 'advanceplus';
    }
  } else if (type === 'advance') {
    let foundIndex = newData.videos.findIndex(
      (video) => video.id === id && video.type === 'normal'
    );

    if (foundIndex === -1) {
      foundIndex = newData.videos.findIndex(
        (video) => video.id === id && video.type === 'advance'
      );

      if (foundIndex === -1) {
        newData.videos.push({
          id,
          type,
        });
      }
    } else {
      newData.videos[foundIndex].type = 'advance';
    }
  } else if (type === 'normal') {
    const foundIndex = newData.videos.findIndex(
      (video) => video.id === id && video.type === 'normal'
    );

    if (foundIndex === -1) {
      newData.videos.push({
        id,
        type,
      });
    }
  }

  return newData;
};

/**
 * Sync video downloaded data (only add data, not delete)
 *
 * @param data
 * @param profile
 * @param id
 */
export const syncVideoDownloaded = (
  data: Data,
  profile: string,
  id: string
): Data => {
  let newData = { ...data };

  if (
    existsVideoFile(profile, id, 'advanceplus') &&
    !existsInVideoDownloaded(newData, id, 'advanceplus')
  ) {
    newData = addInVideoDownloaded(newData, id, 'advanceplus');
  } else if (
    existsVideoFile(profile, id, 'advance') &&
    !existsInVideoDownloaded(newData, id, 'advance')
  ) {
    newData = addInVideoDownloaded(newData, id, 'advance');
  } else if (
    existsVideoFile(profile, id, 'normal') &&
    !existsInVideoDownloaded(newData, id, 'normal')
  ) {
    newData = addInVideoDownloaded(newData, id, 'normal');
  }

  return newData;
};
