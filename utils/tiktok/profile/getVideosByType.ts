import chalk from 'chalk'
import { isNil } from 'lodash'
import { scrapePosts } from '@/utils/tiktok/api'
import { downloadVideo } from '@/utils/tiktok/common/download'
import { TypePost } from '@/utils/tiktok/interfaces'
import { existsFileVideo } from '@/utils/tiktok/paths'

const getVideosByType = async (
  profile: string,
  session: string,
  type: TypePost
) => {
  console.log(chalk.gray(`[${profile}] Scraping videos of type ${type}`))

  const posts = await scrapePosts(profile, type, session)

  if (posts === null) {
    console.log(chalk.red(`[${profile}] Error to scrape posts`))
    return
  }

  if (posts.collector.length === 0) {
    console.log(chalk.red(`[${profile}] Empty profile`))
    return
  }

  for (const post of posts.collector) {
    try {
      let responseDownload: 'successfull' | 'zero-size' | 'same-size' | null =
        null

      if (type === 'advanceplus') {
        if (!isNil(post.videoUrlNoWaterMark)) {
          console.log(
            chalk.gray(`[${profile}] Downloading post with ID ${post.id}`)
          )

          responseDownload = await downloadVideo(
            profile,
            post.videoUrlNoWaterMark,
            posts.headers,
            post.id,
            type
          )
        } else {
          console.log(
            chalk.yellow(`[${profile}] Skip post by empty url from tiktok`)
          )
        }
      } else if (type === 'advance') {
        if (!existsFileVideo(profile, post.id, 'advanceplus')) {
          console.log(
            chalk.gray(`[${profile}] Downloading post with ID ${post.id}`)
          )

          responseDownload = await downloadVideo(
            profile,
            post.videoUrl,
            posts.headers,
            post.id,
            type
          )
        } else {
          console.log(chalk.yellow(`[${profile}] Skip post by mayor version`))
        }
      } else if (type === 'normal') {
        if (
          !existsFileVideo(profile, post.id, 'advanceplus') &&
          !existsFileVideo(profile, post.id, 'advance')
        ) {
          console.log(
            chalk.gray(`[${profile}] Downloading post with ID ${post.id}`)
          )

          responseDownload = await downloadVideo(
            profile,
            post.videoUrl,
            posts.headers,
            post.id,
            type
          )
        } else {
          console.log(chalk.yellow(`[${profile}] Skip post by mayor version`))
        }
      }

      if (responseDownload !== null) {
        if (responseDownload === 'zero-size') {
          console.log(
            chalk.yellow(`[${profile}] Skip post with ID ${post.id} by 0 size`)
          )
        } else if (responseDownload === 'same-size') {
          console.log(
            chalk.yellow(
              `[${profile}] Skip post with ID ${post.id} by same size`
            )
          )
        } else if (responseDownload === 'successfull') {
          console.log(
            chalk.green(`[${profile}] Post with ID ${post.id} was downloaded`)
          )
        }
      }
    } catch {
      console.log(chalk.red(`[${profile}] Error in post with ID ${post.id}`))
    }
  }
}

export default getVideosByType
