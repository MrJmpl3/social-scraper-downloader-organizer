import { resolve } from 'path'
import fs from 'fs-extra'
import getPathFolder from '@/utils/instagram/paths'

const log = (fileName: string, text: string, newLine = true): void => {
  fs.ensureDirSync(getPathFolder())
  fs.appendFileSync(
    resolve(getPathFolder(), fileName),
    `${text}${newLine ? '\r\n' : ''}`
  )
}

export default log
