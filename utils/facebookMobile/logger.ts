import { resolve } from 'path'
import fs from 'fs-extra'
import { getPathFolderProfile } from './paths'

const log = (profileName: string, text: string): void => {
  fs.ensureDirSync(getPathFolderProfile(profileName))
  fs.appendFileSync(
    resolve(getPathFolderProfile(profileName), 'log.log'),
    `${text}\r\n`
  )
}

export default log
