import {
  getUserProfileInfo,
  getVideoMeta,
  Result,
  user,
  UserMetadata,
} from 'tiktok-scraper'
import { TypePost } from '@/utils/tiktok/interfaces'

export const scrapeProfile = async (
  name: string,
  session: string
): Promise<UserMetadata | null> => {
  try {
    return await getUserProfileInfo(name, {
      sessionList: [session],
    })
  } catch {
    return null
  }
}

export const scrapePosts = async (
  name: string,
  type: TypePost,
  session: string
): Promise<Result | null> => {
  try {
    if (type === 'advanceplus') {
      return await user(name, {
        number: 9999,
        hdVideo: true,
        noWaterMark: true,
        sessionList: [session],
      })
    }

    if (type === 'advance') {
      return await user(name, {
        number: 9999,
        hdVideo: true,
        sessionList: [session],
      })
    }

    return await user(name, {
      number: 9999,
      sessionList: [session],
    })
  } catch {
    return null
  }
}

export const scrapeVideo = async (
  url: string,
  type: TypePost,
  session: string
) => {
  try {
    if (type === 'advanceplus') {
      return await getVideoMeta(url, {
        sessionList: [session],
        hdVideo: true,
        noWaterMark: true,
      })
    }

    if (type === 'advance') {
      return await getVideoMeta(url, {
        sessionList: [session],
        hdVideo: true,
      })
    }

    return await getVideoMeta(url, {
      sessionList: [session],
    })
  } catch {
    return null
  }
}
