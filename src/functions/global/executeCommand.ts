import { getUnixTime } from 'date-fns'
import execa from 'execa'
import fs from 'fs-extra'
import log from '@/functions/global/log'

const executeCommand = async (
  command: string,
  args: string[],
  folder: string,
  date: Date
): Promise<void> => {
  fs.ensureDirSync(folder)

  const child = execa(command, args, {
    cwd: folder,
  })

  child.stdout?.on('data', (data) => {
    log(folder, `stdout_${getUnixTime(date)}.log`, data.toString(), false)
  })

  child.stderr?.on('data', (data) => {
    log(folder, `stderr_${getUnixTime(date)}.log`, data.toString(), false)
  })

  await child
}

export default executeCommand
