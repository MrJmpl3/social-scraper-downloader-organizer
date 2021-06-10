import delay from 'delay'
import fs from 'fs-extra'
import { ListrTask } from 'listr2'
import { isNil } from 'lodash'
import { scrapePosts } from '@/functions/tiktok/api'
import {
  addInVideoDownloaded,
  existsInVideoDownloaded,
  syncVideoDownloaded,
} from '@/functions/tiktok/dataManager'
import downloadVideo from '@/functions/tiktok/downloadVideo'
import { Context, TypePost, Data } from '@/interfaces/tiktok'
import { getDataFilePath } from '@/paths/tiktok'

const downloadVideosByType = (
  profile: string,
  type: TypePost
): ListrTask<Context> => ({
  title: `Download profile ${profile} by type ${type}`,
  task: async (ctx, task) => {
    let videoWithError = 0

    const posts = await scrapePosts(profile, type, ctx.session)

    // Wait 1 minute after request to prevent temp block of Tiktok
    await delay(60 * 1000)

    if (posts === null) {
      throw new Error(`Error to scrape posts`)
    }

    if (posts.collector.length === 0) {
      throw new Error(`Empty profile`)
    }

    let videoDownloadedData = JSON.parse(
      fs.readFileSync(getDataFilePath(profile)).toString()
    ) as Data

    // eslint-disable-next-line no-restricted-syntax
    for (const post of posts.collector) {
      videoDownloadedData = syncVideoDownloaded(
        videoDownloadedData,
        profile,
        post.id
      )

      fs.writeFileSync(
        getDataFilePath(profile),
        JSON.stringify(videoDownloadedData)
      )

      if (
        type === 'advanceplus' &&
        !isNil(post.videoUrlNoWaterMark) &&
        !existsInVideoDownloaded(videoDownloadedData, post.id, 'advanceplus')
      ) {
        try {
          task.output = `Downloading video with id ${post.id}`
          // eslint-disable-next-line no-await-in-loop
          await downloadVideo(
            profile,
            post.videoUrlNoWaterMark,
            posts.headers,
            post.id,
            type
          )

          videoDownloadedData = addInVideoDownloaded(
            videoDownloadedData,
            post.id,
            'advanceplus'
          )
        } catch {
          videoWithError += 1
        }
      } else if (
        type === 'advance' &&
        !existsInVideoDownloaded(videoDownloadedData, post.id, 'advanceplus') &&
        !existsInVideoDownloaded(videoDownloadedData, post.id, 'advance')
      ) {
        try {
          task.output = `Downloading video with id ${post.id}`
          // eslint-disable-next-line no-await-in-loop
          await downloadVideo(
            profile,
            post.videoUrl,
            posts.headers,
            post.id,
            type
          )

          videoDownloadedData = addInVideoDownloaded(
            videoDownloadedData,
            post.id,
            'advance'
          )
        } catch {
          videoWithError += 1
        }
      } else if (
        type === 'normal' &&
        !existsInVideoDownloaded(videoDownloadedData, post.id, 'advanceplus') &&
        !existsInVideoDownloaded(videoDownloadedData, post.id, 'advance') &&
        !existsInVideoDownloaded(videoDownloadedData, post.id, 'normal')
      ) {
        try {
          task.output = `Downloading video with id ${post.id}`
          // eslint-disable-next-line no-await-in-loop
          await downloadVideo(
            profile,
            post.videoUrl,
            posts.headers,
            post.id,
            type
          )

          videoDownloadedData = addInVideoDownloaded(
            videoDownloadedData,
            post.id,
            'normal'
          )
        } catch {
          videoWithError += 1
        }
      }

      fs.writeFileSync(
        getDataFilePath(profile),
        JSON.stringify(videoDownloadedData)
      )

      // Wait 1 minute after download to prevent temp block of Tiktok
      await delay(60 * 1000)

      if (videoWithError > 0) {
        throw new Error('Error when download some videos of this profile')
      }
    }

    // Wait 3 minutes after to scrapings and downloads to prevent temp block of Tiktok
    await delay(3 * 60 * 1000)
  },
})

export default downloadVideosByType
