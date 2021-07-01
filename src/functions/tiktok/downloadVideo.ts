import axios from 'axios';
import * as fs from 'fs-extra';
import { Headers } from 'tiktok-scraper';
import { TypePost } from '@/interfaces/tiktok';
import {
  existsVideoFile,
  getVideoFilePath,
  getVideoTempFilePath,
  getVideoTrashFilePath,
} from '@/paths/tiktok';

const downloadVideo = async (
  profile: string,
  url: string,
  headers: Headers,
  postId: string,
  type: TypePost
): Promise<'successfull' | 'zero-size'> => {
  const destination = getVideoTempFilePath(profile, postId, type);

  if (fs.existsSync(destination)) {
    fs.moveSync(
      destination,
      getVideoTrashFilePath(profile, postId, type, true)
    );
  }

  if (fs.existsSync(destination)) {
    fs.moveSync(
      destination,
      getVideoTrashFilePath(profile, postId, type, true)
    );
  }

  const { data: dataResponse, headers: headersResponse } = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    timeout: 1000 * 60 * 3,
    headers,
  });

  if (headersResponse['content-length'] === '0') {
    return new Promise((resolve) => resolve('zero-size'));
  }

  const writer = fs.createWriteStream(destination);
  dataResponse.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      if (
        type === 'advanceplus' &&
        existsVideoFile(profile, postId, 'advance')
      ) {
        fs.moveSync(
          getVideoFilePath(profile, postId, 'advance'),
          getVideoTrashFilePath(profile, postId, 'advance')
        );
      } else if (
        type === 'advanceplus' &&
        existsVideoFile(profile, postId, 'normal')
      ) {
        fs.moveSync(
          getVideoFilePath(profile, postId, 'normal'),
          getVideoTrashFilePath(profile, postId, 'normal')
        );
      } else if (
        type === 'advance' &&
        existsVideoFile(profile, postId, 'normal')
      ) {
        fs.moveSync(
          getVideoFilePath(profile, postId, 'normal'),
          getVideoTrashFilePath(profile, postId, 'normal')
        );
      }

      if (fs.existsSync(destination)) {
        fs.renameSync(destination, getVideoFilePath(profile, postId, type));
      }

      return resolve('successfull');
    });

    writer.on('error', reject);
  });
};

export default downloadVideo;
