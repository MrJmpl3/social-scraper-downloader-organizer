import stream from 'stream';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import got from 'got';
import { VideoType } from '@/interfaces/tiktok';
import {
  existsVideoFile,
  getVideoFilePath,
  getVideoTempFilePath,
  getVideoTrashFilePath,
} from '@/paths/tiktok';

const pipeline = promisify(stream.pipeline);

const downloadVideo = async (
  accountName: string,
  videoUrl: string,
  videoId: string,
  videoType: VideoType
): Promise<void> => {
  const destination = getVideoTempFilePath(accountName, videoId, videoType);

  if (fs.existsSync(destination)) {
    fs.moveSync(
      destination,
      getVideoTrashFilePath(accountName, videoId, videoType)
    );
  }

  await pipeline(
    got.stream(videoUrl, {
      method: 'GET',
      timeout: 1000 * 60 * 3,
    }),
    fs.createWriteStream(destination)
  );

  if (fs.existsSync(destination) && fs.statSync(destination).size !== 0) {
    if (
      videoType === 'advanceplus' &&
      existsVideoFile(accountName, videoId, 'advance')
    ) {
      fs.moveSync(
        getVideoFilePath(accountName, videoId, 'advance'),
        getVideoTrashFilePath(accountName, videoId, 'advance')
      );
    } else if (
      videoType === 'advanceplus' &&
      existsVideoFile(accountName, videoId, 'normal')
    ) {
      fs.moveSync(
        getVideoFilePath(accountName, videoId, 'normal'),
        getVideoTrashFilePath(accountName, videoId, 'normal')
      );
    } else if (
      videoType === 'advance' &&
      existsVideoFile(accountName, videoId, 'normal')
    ) {
      fs.moveSync(
        getVideoFilePath(accountName, videoId, 'normal'),
        getVideoTrashFilePath(accountName, videoId, 'normal')
      );
    }

    fs.renameSync(
      destination,
      getVideoFilePath(accountName, videoId, videoType)
    );
  } else {
    throw new Error(
      'Error when download video or the video download with zero size'
    );
  }
};

export default downloadVideo;
