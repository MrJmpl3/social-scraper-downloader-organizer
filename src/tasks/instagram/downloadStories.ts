import { ListrTask } from 'listr2'
import executeCommand from '@/functions/global/executeCommand'
import { ContextStories } from '@/interfaces/instagram'
import getFolderPath from '@/paths/instagram'

const downloadStories = (): ListrTask<ContextStories> => ({
  title: 'Download stories',
  task: async (ctx) => {
    const date = new Date()
    const folder = getFolderPath()

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
