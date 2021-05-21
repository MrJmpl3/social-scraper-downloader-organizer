import { resolve } from 'path'
import fs from 'fs-extra'
import getPathFolder from '@/utils/instagram/paths'
import executeCommand from '@/utils/shared/executeCommand'

const downloadHighlights = async (
  profile: string,
  altAccount: boolean,
  full: boolean
): Promise<void> => {
  const date = new Date()
  const folder = getPathFolder()

  const instaloaderArgs: string[] = [
    profile,
    '--dirname-pattern={profile}\\highlight\\{target}',
    '--no-profile-pic',
    '--no-posts',
    '--highlights',
    '--no-captions',
    '--no-video-thumbnails',
    '--quiet',
    '--request-timeout=300',
    '--abort-on=302,400,429',
  ]

  if (altAccount) {
    instaloaderArgs.push(
      `--login=${process.env.INSTAGRAM_USER_ALT}`,
      `--password=${process.env.INSTAGRAM_PASSWORD_ALT}`
    )
  } else {
    instaloaderArgs.push(
      `--login=${process.env.INSTAGRAM_USER}`,
      `--password=${process.env.INSTAGRAM_PASSWORD}`
    )
  }

  if (!full) {
    instaloaderArgs.push('--fast-update')
  }

  await executeCommand('instaloader', instaloaderArgs, folder, date)

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
}

export default downloadHighlights
