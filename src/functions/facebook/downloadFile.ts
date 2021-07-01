import axios from 'axios';
import fs from 'fs-extra';

const downloadFile = async (
  url: string,
  dest: string
): Promise<unknown | 'zero-size' | 'skip'> => {
  const { data } = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    timeout: 1000 * 60 * 5,
  });

  const writer = fs.createWriteStream(dest);
  data.pipe(writer);

  return new Promise((resolve3, reject) => {
    writer.on('finish', resolve3);
    writer.on('error', reject);
  });
};

export default downloadFile;
