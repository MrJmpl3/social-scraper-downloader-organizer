import axios from 'axios'
import * as fs from 'fs-extra'
import { ListrTask } from 'listr2'
import { Context } from '@/interfaces/tiktok'
import { getImageFilePath } from '@/paths/tiktok'

const downloadImage = (
  profile: string,
  url: string,
  fileName: string
): ListrTask<Context> => ({
  title: `Download image of profile ${profile}`,
  task: async () => {
    const destination = getImageFilePath(profile, fileName)

    const { data: dataResponse } = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 1000 * 60 * 3,
    })

    const writer = fs.createWriteStream(destination)
    dataResponse.pipe(writer)

    return new Promise((resolve3, reject) => {
      writer.on('finish', resolve3)
      writer.on('error', reject)
    })
  },
})

export default downloadImage
