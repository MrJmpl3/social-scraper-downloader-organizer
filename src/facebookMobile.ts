import { cac } from 'cac'
import dotenv from 'dotenv'
import { Listr } from 'listr2'
import puppeteer from 'puppeteer'
import login from '@/tasks/facebookMobile/login'
import downloadPhotos from '@/tasks/facebookMobile/profile/downloadPhotos'
import { Context } from '@/utils/facebookMobile/interfaces'

dotenv.config()

const parsed = cac().parse()
const optionDev = !!parsed.options.dev
const optionVideos = !!parsed.options.videos
const optionPage = !!parsed.options.page
const optionWaitTime = parsed.options.waitTime ?? 60 * 1000

;(async () => {
  const context: Context = {
    waitTime: optionWaitTime,
  }

  const browser = await puppeteer.launch({
    headless: !optionDev,
  })

  const tasks = new Listr([login(browser)], {
    rendererOptions: {
      collapse: false,
      collapseErrors: false,
      collapseSkips: false,
    },
    ctx: context,
  })

  if (optionPage) {
    if (optionVideos) {
      //
    } else {
      //
    }
  } else if (optionVideos) {
    //
  } else {
    tasks.add({
      title: 'Download photos',
      task: (ctx, task) => {
        const tasksProfile = task.newListr([], {
          rendererOptions: { showSubtasks: true },
          ctx,
          concurrent: false,
          exitOnError: false,
        })

        parsed.args.forEach((value) => {
          const profileUrlConvert = value.replace(
            'https://www.facebook.com/',
            'https://m.facebook.com/'
          )

          tasksProfile.add(downloadPhotos(browser, profileUrlConvert))
        })

        return tasksProfile
      },
    })
  }

  await tasks.run()

  if (!optionDev) {
    await browser.close()
  }
})()
