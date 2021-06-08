import cac from 'cac'
import chalk from 'chalk'
import dotenv from 'dotenv'
import { Listr } from 'listr2'
import puppeteer from 'puppeteer'
import { Context } from '@/interfaces/facebook'
import downloadPhotos from '@/tasks/facebook/downloadPhotos'
import login from '@/tasks/facebook/login'

dotenv.config()

const parsed = cac().parse()
const optionDev = !!parsed.options.dev
const optionWaitTime = parsed.options.waitTime ?? 10 * 1000

try {
  ;(async () => {
    const context: Context = {
      waitTime: optionWaitTime,
    }

    const browser = await puppeteer.launch({
      headless: !optionDev,
    })

    const tasks = new Listr<Context>([login(browser)], {
      rendererOptions: {
        showSubtasks: true,
        collapseErrors: false,
      },
      ctx: context,
      concurrent: false,
      exitOnError: false,
    })

    parsed.args.forEach((value) => {
      tasks.add(
        downloadPhotos(
          browser,
          value.replace('https://www.facebook.com/', 'https://m.facebook.com/')
        )
      )
    })

    await tasks.run()

    if (!optionDev) {
      await browser.close()
    }
  })()
} catch (e) {
  console.log(chalk.red(e))
}
