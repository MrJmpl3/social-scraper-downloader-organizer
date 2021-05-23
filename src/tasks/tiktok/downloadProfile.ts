/* eslint-disable no-param-reassign */

import { resolve } from 'path'
import { URL } from 'url'
import * as fs from 'fs-extra'
import { Listr, ListrTask } from 'listr2'
import { scrapeProfile } from '@/functions/tiktok/api'
import { Context, Data } from '@/interfaces/tiktok'
import {
  existsDataFile,
  getProfileFolderPath,
  getDataFilePath,
} from '@/paths/tiktok'
import downloadImage from '@/subtasks/tiktok/downloadProfile/downloadImage'
import downloadVideosByType from '@/subtasks/tiktok/downloadProfile/downloadVideosByType'

const downloadProfile = (profile: string): ListrTask<Context> => ({
  title: `Download profile ${profile}`,
  task: async (ctx) => {
    const subTask = new Listr([], {
      ctx,
      exitOnError: false,
      rendererOptions: { collapseErrors: false },
    })

    const profileTiktok = await scrapeProfile(profile, ctx.session)

    if (profileTiktok === null) {
      // TODO: Get id of the profile from folder already downloaded, scrape profile by id, rename the folder profile, scrape posts and image.
      throw new Error('Sorry, but this function is in progress!')
    } else {
      if (!existsDataFile(profile)) {
        const defaultData: Data = {
          id: profileTiktok.user.id,
          version: 1,
          videos: [],
        }

        fs.writeFileSync(getDataFilePath(profile), JSON.stringify(defaultData))
      }

      // Remove ID file
      const pathId = resolve(getProfileFolderPath(profile), 'ID')
      if (fs.existsSync(pathId)) {
        fs.removeSync(pathId)
      }

      if (profileTiktok.user.avatarLarger !== '') {
        subTask.add(
          downloadImage(
            profile,
            profileTiktok.user.avatarLarger,
            new URL(profileTiktok.user.avatarLarger).pathname
              .split('/')
              .pop() as string
          )
        )
      }
    }

    // subTask.add(downloadVideosByType(profile, "advanceplus"));
    subTask.add(downloadVideosByType(profile, 'advance'))
    // subTask.add(downloadVideosByType(profile, "normal"));

    return subTask
  },
})

export default downloadProfile
