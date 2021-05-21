import { resolve } from 'path'

const getPathFolder = () => {
  if (process.env.INSTAGRAM_FOLDER) {
    return process.env.INSTAGRAM_FOLDER
  }

  return resolve(__dirname, '..', 'db', 'instagram')
}

export default getPathFolder
