import { resolve } from 'path';

const getFolderPath = (): string => {
  if (process.env.INSTAGRAM_FOLDER) {
    return process.env.INSTAGRAM_FOLDER;
  }

  return resolve(__dirname, '..', 'db', 'instagram');
};

export default getFolderPath;
