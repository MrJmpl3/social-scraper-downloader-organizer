import stream from 'stream';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import got from 'got';
import { getImageFilePath } from '@/paths/tiktok';

const pipeline = promisify(stream.pipeline);

const downloadImage = async (
  accountName: string,
  imageUrl: string,
  imageName: string
): Promise<void> => {
  const destination = getImageFilePath(accountName, imageName);

  await pipeline(
    got.stream(imageUrl, {
      method: 'GET',
      timeout: 1000 * 60 * 3,
    }),
    fs.createWriteStream(destination)
  );
};

export default downloadImage;
