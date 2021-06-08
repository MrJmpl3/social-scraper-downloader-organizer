import { cac } from 'cac'
import dotenv from 'dotenv'
import { Listr } from 'listr2'
import { Context } from '@/interfaces/tiktok'
import downloadProfile from '@/tasks/tiktok/downloadProfile'

dotenv.config()

const parsed = cac().parse()
const optionSession = parsed.options.session
const optionVideo = parsed.options.video

;(async () => {
  const context: Context = {
    session: optionSession,
  }

  const tasks = new Listr<Context>([], {
    rendererOptions: {
      showSubtasks: true,
      collapseErrors: false,
    },
    ctx: context,
    concurrent: false,
    exitOnError: false,
  })

  parsed.args.forEach((value) => {
    if (!optionVideo) {
      tasks.add(downloadProfile(value))
    }
  })

  await tasks.run()
})()
