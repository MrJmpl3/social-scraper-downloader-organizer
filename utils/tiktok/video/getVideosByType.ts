import { resolve } from 'path'
import chalk from 'chalk'
import fs from 'fs-extra'
import { scrapeVideo } from '@/utils/tiktok/api'
import { downloadVideo } from '@/utils/tiktok/common/download'
import { TypePost } from '@/utils/tiktok/interfaces'
import { existsFileVideo, getPathFolderProfile } from '@/utils/tiktok/paths'
import { isNil } from 'lodash'

const getVideosByType = async (
  video: string,
  session: string,
  type: TypePost
) => {
  console.log(chalk.gray(`[${video}] Scraping video`))

  const scrapeVideoResponse = await scrapeVideo(video, type, session)
  if (scrapeVideoResponse === null) {
    console.log(chalk.red(`[${video}] Error to scrape video!`))
    return
  }

  if (scrapeVideoResponse.collector.length === 0) {
    console.log(chalk.red(`[${video}] Empty video!`))
    return
  }

  const videoTiktok = scrapeVideoResponse.collector[0]

  const pathId = resolve(
    getPathFolderProfile(videoTiktok.authorMeta.name),
    'ID'
  )
  if (!fs.existsSync(pathId)) {
    console.log(chalk.green(`[${video}] ID of profile saved!`))
    fs.writeFileSync(pathId, videoTiktok.authorMeta.id)
  }

  let responseDownload: 'successfull' | 'zero-size' | 'same-size' | null = null

  if (type === 'advanceplus') {
    if (!isNil(videoTiktok.videoUrlNoWaterMark)) {
      console.log(chalk.gray(`[${video}] Downloading post`))

      responseDownload = await downloadVideo(
        videoTiktok.authorMeta.name,
        videoTiktok.videoUrlNoWaterMark,
        scrapeVideoResponse.headers,
        videoTiktok.id,
        'advanceplus'
      )
    } else {
      console.log(chalk.yellow(`[${video}] Skip post by mayor version`))
    }
  } else if (type === 'advance') {
    if (
      !existsFileVideo(
        videoTiktok.authorMeta.name,
        videoTiktok.id,
        'advanceplus'
      )
    ) {
      console.log(chalk.gray(`[${video}] Downloading post`))

      responseDownload = await downloadVideo(
        videoTiktok.authorMeta.name,
        videoTiktok.videoUrl,
        scrapeVideoResponse.headers,
        videoTiktok.id,
        'advance'
      )
    } else {
      console.log(chalk.yellow(`[${video}] Skip post by mayor version`))
    }
  } else if (type === 'normal') {
    if (
      !existsFileVideo(
        videoTiktok.authorMeta.name,
        videoTiktok.id,
        'advanceplus'
      ) &&
      !existsFileVideo(videoTiktok.authorMeta.name, videoTiktok.id, 'advance')
    ) {
      console.log(chalk.gray(`[${video}] Downloading post`))

      responseDownload = await downloadVideo(
        videoTiktok.authorMeta.name,
        videoTiktok.videoUrl,
        scrapeVideoResponse.headers,
        videoTiktok.id,
        'normal'
      )
    } else {
      console.log(chalk.yellow(`[${video}] Skip post by mayor version`))
    }
  }

  if (responseDownload !== null) {
    if (responseDownload === 'zero-size') {
      console.log(chalk.yellow(`[${video}] Skip post by 0 size`))
    } else if (responseDownload === 'same-size') {
      console.log(chalk.yellow(`[${video}] Skip post by same size`))
    } else if (responseDownload === 'successfull') {
      console.log(chalk.green(`[${video}] Post was downloaded`))
    }
  }
}

export default getVideosByType
