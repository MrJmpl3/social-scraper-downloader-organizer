import getPathFolder from '@/utils/instagram/paths'
import executeCommand from '@/utils/shared/executeCommand'

const downloadPosts = async (
  profile: string,
  altAccount: boolean,
  full: boolean
): Promise<void> => {
  const date = new Date()
  const folder = getPathFolder()

  const instaloaderArgs: string[] = [
    profile,
    '--dirname-pattern={profile}\\posts',
    '--no-captions',
    '--no-video-thumbnails',
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
};

export default downloadPosts;
