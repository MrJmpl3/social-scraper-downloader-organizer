import { getUnixTime } from 'date-fns'
import execa from 'execa'
import fs from 'fs-extra'
import log from '@/utils/shared/log'

const executeCommand = async (
  command: string,
  args: string[],
  folder: string,
  date: Date
) => {
  fs.ensureDirSync(folder)

  const child = execa(command, args, {
    cwd: folder,
  })

  child.stdout?.on('data', (data) => {
    log(`stdout_${getUnixTime(date)}.log`, data.toString(), false)
  })

  child.stderr?.on('data', (data) => {
    log(`stderr_${getUnixTime(date)}.log`, data.toString(), false)
  })

  await child
}

export default executeCommand
