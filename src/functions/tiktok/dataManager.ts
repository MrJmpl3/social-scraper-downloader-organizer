import { Data, VideoType } from '@/interfaces/tiktok';
import { existsVideoFile } from '@/paths/tiktok';

export const existsInVideoDownloaded = (
  data: Data,
  videoId: string,
  videoType: VideoType
): boolean =>
  data.videos.find(
    (video) => video.id === videoId && video.type === videoType
  ) !== undefined;

export const addInVideoDownloaded = (
  data: Data,
  videoId: string,
  videoType: VideoType
): Data => {
  const newData = { ...data };

  if (videoType === 'advanceplus') {
    let foundIndex = newData.videos.findIndex(
      (video) => video.id === videoId && video.type === 'normal'
    );

    if (foundIndex === -1) {
      foundIndex = newData.videos.findIndex(
        (video) => video.id === videoId && video.type === 'advance'
      );

      if (foundIndex === -1) {
        foundIndex = newData.videos.findIndex(
          (video) => video.id === videoId && video.type === 'advanceplus'
        );

        if (foundIndex === -1) {
          newData.videos.push({
            id: videoId,
            type: videoType,
          });
        }
      } else {
        newData.videos[foundIndex].type = 'advanceplus';
      }
    } else {
      newData.videos[foundIndex].type = 'advanceplus';
    }
  } else if (videoType === 'advance') {
    let foundIndex = newData.videos.findIndex(
      (video) => video.id === videoId && video.type === 'normal'
    );

    if (foundIndex === -1) {
      foundIndex = newData.videos.findIndex(
        (video) => video.id === videoId && video.type === 'advance'
      );

      if (foundIndex === -1) {
        newData.videos.push({
          id: videoId,
          type: videoType,
        });
      }
    } else {
      newData.videos[foundIndex].type = 'advance';
    }
  } else if (videoType === 'normal') {
    const foundIndex = newData.videos.findIndex(
      (video) => video.id === videoId && video.type === 'normal'
    );

    if (foundIndex === -1) {
      newData.videos.push({
        id: videoId,
        type: videoType,
      });
    }
  }

  return newData;
};

/**
 * Sync video downloaded data (only add data, not delete)
 *
 * @param data
 * @param accountName
 * @param videoId
 */
export const syncVideoDownloaded = (
  data: Data,
  accountName: string,
  videoId: string
): Data => {
  let newData = { ...data };

  if (
    existsVideoFile(accountName, videoId, 'advanceplus') &&
    !existsInVideoDownloaded(newData, videoId, 'advanceplus')
  ) {
    newData = addInVideoDownloaded(newData, videoId, 'advanceplus');
  } else if (
    existsVideoFile(accountName, videoId, 'advance') &&
    !existsInVideoDownloaded(newData, videoId, 'advance')
  ) {
    newData = addInVideoDownloaded(newData, videoId, 'advance');
  } else if (
    existsVideoFile(accountName, videoId, 'normal') &&
    !existsInVideoDownloaded(newData, videoId, 'normal')
  ) {
    newData = addInVideoDownloaded(newData, videoId, 'normal');
  }

  return newData;
};
