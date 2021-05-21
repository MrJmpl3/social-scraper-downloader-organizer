import delay from 'delay'
import executeCommand from '@/utils/instagram/command'
import getPathFolder from '@/utils/instagram/paths'

const downloadTagged = async (
  profile: string,
  altAccount: boolean,
  full: boolean
) => {
  const folder = getPathFolder()

  const commandParts: string[] = [
    `instaloader ${profile} --dirname-pattern="${profile}\\tagged" --no-profile-pic --no-posts --tagged --no-captions --no-video-thumbnails --request-timeout=300`,
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
  await delay(5 * 60 * 1000)
}

export default downloadTagged
