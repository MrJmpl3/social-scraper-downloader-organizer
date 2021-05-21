import axios from 'axios'
import fs from 'fs-extra'

const downloadFile = async (
  url: string,
  dest: string,
  sizeComparasion: number | null = null
): Promise<unknown | 'zero-size' | 'skip'> => {
  const { data, headers } = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    timeout: 1000 * 60 * 5,
  })

  if (headers['content-length'] === '0') {
    return new Promise((resolve1) => {
      resolve1('zero-size')
    })
  }

  if (sizeComparasion !== null) {
    if (headers['content-length'] === sizeComparasion.toString()) {
      return new Promise((resolve2) => {
        resolve2('skip')
      })
    }
  }

  const writer = fs.createWriteStream(dest)
  data.pipe(writer)

  return new Promise((resolve3, reject) => {
    writer.on('finish', resolve3)
    writer.on('error', reject)
  })
}

export default downloadFile
