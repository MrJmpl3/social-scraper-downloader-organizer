import { cac } from 'cac'
import dotenv from 'dotenv'
import { Listr, ListrBaseClassOptions } from 'listr2'
import isNumeric from 'validator/lib/isNumeric'
import {
  ContextFeeds,
  ContextProfiles,
  ContextStories,
} from '@/interfaces/instagram'
import downloadFeed from '@/tasks/instagram/downloadFeed'
import downloadProfile from '@/tasks/instagram/downloadProfile'
import downloadStories from '@/tasks/instagram/downloadStories'

dotenv.config()

const cli = cac()

const listrDefaultOptions: ListrBaseClassOptions = {
  rendererOptions: {
    showSubtasks: true,
  },
  concurrent: false,
}

cli
  .command('stories')
  .option('--alt-account', 'Use alt account')
  .option('--full', 'Download full data')
  .action(async (options) => {
    const context: ContextStories = {
      altAccount: options.altAccount,
      full: options.full,
    }

    const tasks = new Listr<ContextStories>([], {
      ...listrDefaultOptions,
      ctx: context,
    })

    tasks.add(downloadStories())

    await tasks.run()
  })

cli
  .command('feed')
  .option('--alt-account', 'Use alt account')
  .option('--full', 'Download full data')
  .option('--days [days]', 'Days to feed', { default: 5 })
  .action(async (options) => {
    if (!isNumeric(options.days.toString())) {
      throw new Error('Days option is not numeric')
    }

    const context: ContextFeeds = {
      altAccount: options.altAccount,
      full: options.full,
      feedDays: options.days,
    }

    const tasks = new Listr<ContextFeeds>([], {
      ...listrDefaultOptions,
      ctx: context,
    })

    tasks.add(downloadFeed())

    await tasks.run()
  })

cli
  .command('[...profiles]', 'Download profiles')
  .option('--no-stories', 'Ignore stories')
  .option('--no-highlights', 'Ignore highlights')
  .option('--no-tagged', 'Ignore tagged')
  .option('--no-igtv', 'Ignore igtv')
  .option('--alt-account', 'Use alt account')
  .option('--full', 'Download full data')
  .action(async (profiles, options) => {
    const context: ContextProfiles = {
      full: options.full,
      altAccount: options.altAccount,
      highlights: options.highlights,
      igtv: options.igtv,
      stories: options.stories,
      tagged: options.tagged,
    }

    const tasks = new Listr<ContextProfiles>([], {
      ...listrDefaultOptions,
      ctx: context,
    })

    tasks.add({
      title: 'Download profiles',
      task: (_ctx, task) => {
        const taskProfiles = task.newListr([], {
          rendererOptions: { showSubtasks: true },
          ctx: context,
          concurrent: false,
        })

        profiles.forEach((value) => {
          taskProfiles.add(downloadProfile(value))
        })

        return taskProfiles
      },
    })

    await tasks.run()
  })

cli.parse()
