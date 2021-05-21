import { exec } from 'child_process'
import util from 'util'
import fs from 'fs-extra'
import log from '@/utils/instagram/log'

const executeCommand = async (folder: string, command: string) => {
  fs.ensureDirSync(folder)

  const { stdout, stderr } = await util.promisify(exec)(command, {
    cwd: folder,
  })

  log(stdout, false)
  log(stderr, true)
}

export default executeCommand
