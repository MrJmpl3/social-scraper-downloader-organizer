import { resolve } from 'path';
import fs from 'fs-extra';

const log = (
  folder: string,
  fileName: string,
  text: string,
  newLine = true
): void => {
  fs.ensureDirSync(folder);
  fs.appendFileSync(
    resolve(folder, fileName),
    `${text}${newLine ? '\r\n' : ''}`
  );
};

export default log;
