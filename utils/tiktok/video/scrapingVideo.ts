import getVideosByType from '@/utils/tiktok/video/getVideosByType'

const scrapingVideo = async (video: string, session: string) => {
  await getVideosByType(video, session, 'advanceplus')
  await getVideosByType(video, session, 'advance')
  await getVideosByType(video, session, 'normal')
}

export default scrapingVideo
