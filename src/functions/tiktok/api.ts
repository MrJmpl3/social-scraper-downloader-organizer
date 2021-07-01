import {
  getUserProfileInfo,
  getVideoMeta,
  Result,
  user,
  UserMetadata,
} from 'tiktok-scraper';
import { VideoType } from '@/interfaces/tiktok';

export const scrapeAccount = async (
  name: string,
  session: string
): Promise<UserMetadata | null> => {
  try {
    const optionalApiParams: {
      sessionList?: string[];
    } = {};

    if (session) {
      optionalApiParams.sessionList = [session];
    }

    return await getUserProfileInfo(name, {
      ...optionalApiParams,
    });
  } catch {
    return null;
  }
};

export const scrapePosts = async (
  name: string,
  type: VideoType,
  session: string
): Promise<Result | null> => {
  try {
    const optionalApiParams: {
      sessionList?: string[];
    } = {};

    if (session) {
      optionalApiParams.sessionList = [session];
    }

    if (type === 'advanceplus') {
      return await user(name, {
        number: 9999,
        hdVideo: true,
        noWaterMark: true,
        ...optionalApiParams,
      });
    }

    if (type === 'advance') {
      return await user(name, {
        number: 9999,
        hdVideo: true,
        ...optionalApiParams,
      });
    }

    return await user(name, {
      number: 9999,
      ...optionalApiParams,
    });
  } catch {
    return null;
  }
};

export const scrapeVideo = async (
  url: string,
  type: VideoType,
  session: string
): Promise<Result | null> => {
  try {
    const optionalApiParams: {
      sessionList?: string[];
    } = {};

    if (session) {
      optionalApiParams.sessionList = [session];
    }

    if (type === 'advanceplus') {
      return await getVideoMeta(url, {
        hdVideo: true,
        noWaterMark: true,
        ...optionalApiParams,
      });
    }

    if (type === 'advance') {
      return await getVideoMeta(url, {
        hdVideo: true,
        ...optionalApiParams,
      });
    }

    return await getVideoMeta(url, {
      ...optionalApiParams,
    });
  } catch {
    return null;
  }
};
