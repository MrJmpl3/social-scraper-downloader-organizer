import { ListrTask } from 'listr2'
import { Context } from '@/utils/instagram/interfaces'
import getPathFolder from '@/utils/instagram/paths'
import executeCommand from '@/utils/shared/executeCommand'

const downloadStories = (): ListrTask<Context> => ({
  title: 'Download stories',
  task: async (ctx) => {
    const date = new Date()
    const folder = getPathFolder()

    const instaloaderArgs: string[] = [
      ':stories',
      '--dirname-pattern={profile}\\stories',
      '--no-captions',
      '--no-video-thumbnails',
      '--request-timeout=300',
    ]

    if (ctx.altAccount) {
      instaloaderArgs.push(
        `--login=${process.env.INSTAGRAM_USER_ALT}`,
        `--password=${process.env.INSTAGRAM_PASSWORD_ALT}`
      )
    } else {
      instaloaderArgs.push(
        `--login=${process.env.INSTAGRAM_USER}`,
        `--password=${process.env.INSTAGRAM_PASSWORD}`
      )
    }

    if (!ctx.full) {
      instaloaderArgs.push('--fast-update')
    }

    await executeCommand('instaloader', instaloaderArgs, folder, date)
  },
})

export default downloadStories
