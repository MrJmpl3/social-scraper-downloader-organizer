/* eslint-disable no-param-reassign */
import { ListrTask } from 'listr2'
import downloadHighlights from '@/utils/instagram/functions/profile/downloadHighlights'
import downloadIgtv from '@/utils/instagram/functions/profile/downloadIgtv'
import downloadPosts from '@/utils/instagram/functions/profile/downloadPosts'
import downloadStories from '@/utils/instagram/functions/profile/downloadStories'
import downloadTagged from '@/utils/instagram/functions/profile/downloadTagged'
import { Context } from '@/utils/instagram/interfaces'

const downloadProfile = (profile: string): ListrTask<Context> => ({
  title: profile,
  task: async (ctx, task) => {
    if (!ctx.notStories) {
      task.output = 'Downloading stories'
      await downloadStories(profile, ctx.altAccount, ctx.full)
    }

    if (!ctx.notHighlights) {
      task.output = 'Downloading highlights'
      await downloadHighlights(profile, ctx.altAccount, ctx.full)
    }

    if (!ctx.notTagged) {
      task.output = 'Downloading tagged'
      await downloadTagged(profile, ctx.altAccount, ctx.full)
    }

    if (!ctx.notIgtv) {
      task.output = 'Downloading Igtv'
      await downloadIgtv(profile, ctx.altAccount, ctx.full)
    }

    task.output = 'Downloading posts'
    await downloadPosts(profile, ctx.altAccount, ctx.full)
  },
})

export default downloadProfile
