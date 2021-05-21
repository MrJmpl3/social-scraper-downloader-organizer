import { resolve } from 'path'
import { URL } from 'url'
import chalk from 'chalk'
import fs from 'fs-extra'
import { UserMetadata } from 'tiktok-scraper'
import { scrapeProfile } from '@/utils/tiktok/api'
import { downloadImage } from '@/utils/tiktok/common/download'
import { getPathFolderProfile } from '@/utils/tiktok/paths'
import getVideosByType from '@/utils/tiktok/profile/getVideosByType'

const normalScraping = async (
  profile: string,
  session: string,
  profileTiktok: UserMetadata
) => {
  const pathId = resolve(getPathFolderProfile(profile), 'ID')
  if (!fs.existsSync(pathId)) {
    console.log(chalk.green(`[${profile}] ID of profile saved!`))
    fs.writeFileSync(pathId, profileTiktok.user.id)
  }

  if (profileTiktok.user.avatarLarger !== '') {
    try {
      await downloadImage(
        profile,
        profileTiktok.user.avatarLarger,
        new URL(profileTiktok.user.avatarLarger).pathname
          .split('/')
          .pop() as string
      )

      console.log(
        chalk.green(`[${profile}] Download image of profile correct!`)
      )
    } catch {
      console.log(
        chalk.red(`[${profile}] Error when download image of profile!`)
      )
    }
  }

  await getVideosByType(profile, session, 'advanceplus')
  await getVideosByType(profile, session, 'advance')
  await getVideosByType(profile, session, 'normal')
}

const scrapingProfile = async (profile: string, session: string) => {
  console.log(chalk.gray(`[${profile}] Scraping image of profile`))

  const profileTiktok = await scrapeProfile(profile, session)
  if (profileTiktok === null) {
    console.log(
      chalk.red(`[${profile}] Sorry, but this function is in progress!`)
    )
    // TODO: Get id of the profile from folder already downloaded, scrape profile by id, rename the folder profile, scrape posts and image.
  } else {
    await normalScraping(profile, session, profileTiktok)
  }
}

export default scrapingProfile
