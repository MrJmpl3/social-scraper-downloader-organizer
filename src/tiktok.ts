import { cac } from 'cac'
import dotenv from 'dotenv'
import scrapingProfile from '@/utils/tiktok/profile/scrapingProfile'
import scrapingVideo from '@/utils/tiktok/video/scrapingVideo'

dotenv.config()

const parsed = cac().parse()
const optionSession = parsed.options.session
const optionVideo = parsed.options.video

;(async () => {
  for (const value of parsed.args) {
    console.log(
      '======================================================================================'
    )
    console.log(value)
    console.log(
      '======================================================================================'
    )

    if (optionVideo) {
      await scrapingVideo(value, optionSession)
    } else {
      await scrapingProfile(value, optionSession)
    }
  }
})()
