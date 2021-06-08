import fs from 'fs-extra'
import { ListrTask } from 'listr2'
import { isNil } from 'lodash'
import { Browser } from 'puppeteer'
import { Context } from '@/interfaces/facebook'
import { getFolderPath } from '@/paths/facebook'

const login = (browser: Browser): ListrTask<Context> => ({
  title: 'Login',
  task: async (ctx, task) => {
    task.output = 'Ensure path folder exists'

    fs.ensureDirSync(getFolderPath())

    const page = await browser.newPage()

    task.output = 'Go to Facebook and logging'

    await page.goto('https://m.facebook.com/')
    await page.waitForTimeout(ctx.waitTime)

    const moreButton = await page.$('#accept-cookie-banner-label')
    if (!isNil(moreButton)) {
      await moreButton.click()
    }

    const emailInput = await page.waitForSelector('#m_login_email')
    const passInput = await page.waitForSelector('#m_login_password')
    const loginButton = await page.waitForSelector('button[name="login"]')

    await emailInput!.type(process.env.FACEBOOK_USER!)
    await passInput!.type(process.env.FACEBOOK_PASSWORD!)
    await loginButton!.click()

    await page.waitForNavigation({ waitUntil: 'networkidle2' })
    await page.waitForTimeout(ctx.waitTime)
    await page.close()
  },
})

export default login
