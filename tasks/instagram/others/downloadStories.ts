import { ListrTask } from 'listr2'
import executeCommand from '@/utils/instagram/command'
import { Context } from '@/utils/instagram/interfaces'
import getPathFolder from '@/utils/instagram/paths'

const downloadStories = (): ListrTask<Context> => ({
  title: 'Download stories',
  task: async (ctx) => {
    const folder = getPathFolder()

    const commandParts: string[] = [
      'instaloader :stories --dirname-pattern="{profile}\\stories" --no-captions --no-video-thumbnails --request-timeout=300',
    ]

    if (ctx.altAccount) {
      commandParts.push(
        `--login ${process.env.INSTAGRAM_USER_ALT} --password=${process.env.INSTAGRAM_PASSWORD_ALT}`
      )
    } else {
      commandParts.push(
        `--login ${process.env.INSTAGRAM_USER} --password=${process.env.INSTAGRAM_PASSWORD}`
      )
    }

    if (!ctx.full) {
      commandParts.push('--fast-update')
    }

    await executeCommand(folder, commandParts.join(' '))
  },
})

export default downloadStories
