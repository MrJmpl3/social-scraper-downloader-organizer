import { getDate, getMonth, getYear, subDays } from 'date-fns'
import { ListrTask } from 'listr2'
import executeCommand from '@/utils/instagram/command'
import { Context } from '@/utils/instagram/interfaces'
import getPathFolder from '@/utils/instagram/paths'

const downloadFeed = (): ListrTask<Context> => ({
  title: 'Download feed',
  task: async (ctx) => {
    const folder = getPathFolder()

    const date = subDays(new Date(), 3)
    const dateFilter = `${getYear(date)}, ${getMonth(date) + 1}, ${getDate(
      date
    )}`

    const commandParts: string[] = [
      `instaloader :feed --dirname-pattern="{profile}\\posts" --post-filter="date_utc >= datetime(${dateFilter})" --no-captions --no-video-thumbnails --request-timeout=300`,
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

    await executeCommand(folder, commandParts.join(' '))
  },
})

export default downloadFeed
