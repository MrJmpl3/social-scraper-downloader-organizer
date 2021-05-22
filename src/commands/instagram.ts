import { cac } from 'cac'
import dotenv from 'dotenv'
import { Listr } from 'listr2'
import { Context } from '@/interfaces/instagram'
import downloadFeed from '@/tasks/instagram/downloadFeed'
import downloadProfile from '@/tasks/instagram/downloadProfile'
import downloadStories from '@/tasks/instagram/downloadStories'

dotenv.config()

const parsed = cac().parse()

const optionStories = !!parsed.options.stories
const optionFeed = !!parsed.options.feed
const optionFull = !!parsed.options.full
const optionAltAccount = !!parsed.options.altAccount

const optionNotStories = !!parsed.options.notStories
const optionNotHighlights = !!parsed.options.notHighlights
const optionNotTagged = !!parsed.options.notTagged
const optionNotIgtv = !!parsed.options.notIgtv

;(async () => {
  const context: Context = {
    full: optionFull,
    altAccount: optionAltAccount,
    notHighlights: optionNotHighlights,
    notIgtv: optionNotIgtv,
    notStories: optionNotStories,
    notTagged: optionNotTagged,
  }

  const tasks = new Listr<Context>([], {
    rendererOptions: {
      showSubtasks: true,
    },
    ctx: context,
    concurrent: false,
  })

  if (optionStories) {
    tasks.add(downloadStories())
  } else if (optionFeed) {
    tasks.add(downloadFeed())
  } else {
    tasks.add({
      title: `Download profiles`,
      task: (_ctx, task) => {
        const taskProfiles = task.newListr([], {
          rendererOptions: { showSubtasks: true },
          ctx: context,
          concurrent: false,
        })

        parsed.args.forEach((value) => {
          taskProfiles.add(downloadProfile(value))
        })

        return taskProfiles
      },
    })
  }

  await tasks.run()
})()
