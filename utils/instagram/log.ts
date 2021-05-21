import { resolve } from 'path'
import fs from 'fs-extra'
import getPathFolder from '@/utils/instagram/paths'

const log = (text: string, error = true): void => {
  fs.ensureDirSync(getPathFolder())

  if (error) {
    fs.appendFileSync(resolve(getPathFolder(), 'stderr.log'), `${text}\r\n`)
  } else {
    fs.appendFileSync(resolve(getPathFolder(), 'stdout.log'), `${text}\r\n`)
  }
}

export default log
