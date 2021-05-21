import { resolve } from 'path'
import delay from 'delay'
import fs from 'fs-extra'
import executeCommand from '@/utils/instagram/command'
import getPathFolder from '@/utils/instagram/paths'

const downloadHighlights = async (
  profile: string,
  altAccount: boolean,
  full: boolean
) => {
  const folder = getPathFolder()

  const commandParts: string[] = [
    `instaloader ${profile} --dirname-pattern="{profile}\\highlight\\{target}" --no-profile-pic --no-posts --highlights --no-captions --no-video-thumbnails --request-timeout=300`,
  ]

  if (altAccount) {
    commandParts.push(
      `--login ${process.env.INSTAGRAM_USER_ALT} --password=${process.env.INSTAGRAM_PASSWORD_ALT}`
    )
  } else {
    commandParts.push(
      `--login ${process.env.INSTAGRAM_USER} --password=${process.env.INSTAGRAM_PASSWORD}`
    )
  }

  if (!full) {
    commandParts.push('--fast-update')
  }

  await executeCommand(folder, commandParts.join(' '))

  if (fs.pathExistsSync(resolve(folder, profile, 'highlight', profile))) {
    fs.readdirSync(resolve(folder, profile, 'highlight', profile)).forEach(
      (file) => {
        fs.moveSync(
          resolve(folder, profile, 'highlight', profile, file),
          resolve(folder, profile, 'highlight', file),
          { overwrite: true }
        )
      }
    )

    fs.removeSync(resolve(folder, profile, 'highlight', profile))
  }

  await delay(5 * 60 * 1000)
}

export default downloadHighlights
