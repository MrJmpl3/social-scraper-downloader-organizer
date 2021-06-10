import delay from 'delay'
import { ListrTask } from 'listr2'
import downloadHighlights from '@/functions/instagram/downloadHighlights'
import downloadIgtv from '@/functions/instagram/downloadIgtv'
import downloadPosts from '@/functions/instagram/downloadPosts'
import downloadStories from '@/functions/instagram/downloadStories'
import downloadTagged from '@/functions/instagram/downloadTagged'
import { ContextProfiles } from '@/interfaces/instagram'

const downloadProfile = (profile: string): ListrTask<ContextProfiles> => ({
  title: profile,
  task: async (ctx, task) => {
    if (ctx.stories) {
      task.output = 'Downloading stories'
      await downloadStories(profile, ctx.altAccount, ctx.full)
      task.output = 'Finished stories - Waiting 4 minutes'

      // Wait 2 minutes before to execute the next scraper to prevent temp block of Instagram
      // Why 2 minutes? Because scraping requests made to Instagram is minimal to stories
      await delay(2 * 60 * 1000)
    }

    if (ctx.highlights) {
      task.output = 'Downloading highlights'
      await downloadHighlights(profile, ctx.altAccount, ctx.full)
      task.output = 'Finished highlights - Waiting 4 minutes'

      // Wait 4 minutes before to execute the next scraper to prevent temp block of Instagram
      // Why 4 minutes? Because scraping requests made to Instagram is medium to highlights
      await delay(4 * 60 * 1000)
    }

    if (ctx.tagged) {
      task.output = 'Downloading tagged'
      await downloadTagged(profile, ctx.altAccount, ctx.full)
      task.output = 'Finished tagged - Waiting 5 minutes'

      // Wait 5 minutes before to execute the next scraper to prevent temp block of Instagram
      // Why 5 minutes? Because scraping requests made to Instagram is big to highlights
      await delay(5 * 60 * 1000)
    }

    if (ctx.igtv) {
      task.output = 'Downloading Igtv'
      await downloadIgtv(profile, ctx.altAccount, ctx.full)
      task.output = 'Finished Igtv - Waiting 2 minutes'

      // Wait 2 minutes before to execute the next scraper to prevent temp block of Instagram
      // Why 2 minutes? Because scraping requests made to Instagram is minimal to stories
      await delay(2 * 60 * 1000)
    }

    task.output = 'Downloading posts'
    await downloadPosts(profile, ctx.altAccount, ctx.full)
    task.output = 'Finished posts - Waiting 5 minutes'

    // Wait 5 minutes before to execute the next scraper to prevent temp block of Instagram
    // Why 5 minutes? Because scraping requests made to Instagram is big to highlights
    await delay(5 * 60 * 1000)
  },
})

export default downloadProfile
