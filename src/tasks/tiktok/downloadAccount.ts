import { resolve } from 'path';
import delay from 'delay';
import * as fs from 'fs-extra';
import { ListrTask } from 'listr2';
import { isNil } from 'lodash';
import { scrapeAccount, scrapePosts } from '@/functions/tiktok/api';
import {
  addInVideoDownloaded,
  existsInVideoDownloaded,
  syncVideoDownloaded,
} from '@/functions/tiktok/dataManager';
import downloadImage from '@/functions/tiktok/downloadImage';
import downloadVideo from '@/functions/tiktok/downloadVideo';
import getVideoUrlOfSnaptik from '@/functions/tiktok/getVideoUrlOfSnaptik';
import { Data } from '@/interfaces/tiktok';
import {
  existsDataFile,
  getAccountFolderPath,
  getDataFilePath,
} from '@/paths/tiktok';

const ensureExistsDataFile = (accountName: string, accountId: string) => {
  if (!existsDataFile(accountName)) {
    const defaultData: Data = {
      id: accountId,
      version: 1,
      videos: [],
    };

    fs.writeFileSync(getDataFilePath(accountName), JSON.stringify(defaultData));
  }
};

const ensureRemoveObsoleteIdFile = (accountName: string) => {
  const pathId = resolve(getAccountFolderPath(accountName), 'ID');
  if (fs.existsSync(pathId)) {
    fs.removeSync(pathId);
  }
};

const downloadAccount = (accountName: string): ListrTask => ({
  title: accountName,
  task: async (ctx, task) => {
    task.output = 'Scraping account info';
    const profileTiktok = await scrapeAccount(accountName, ctx.session);

    if (profileTiktok === null) {
      // TODO: Get id of the profile from folder already downloaded, scrape profile by id, rename the folder profile, scrape posts and image.
      throw new Error('Sorry, but this function is in progress!');
    } else {
      task.output = 'Ensure exists data file';
      ensureExistsDataFile(accountName, profileTiktok.user.id);

      task.output = 'Ensure remove obsolete ID file';
      ensureRemoveObsoleteIdFile(accountName);

      if (profileTiktok.user.avatarLarger !== '') {
        try {
          task.output = 'Download image of account';
          await downloadImage(
            accountName,
            profileTiktok.user.avatarLarger,
            new URL(profileTiktok.user.avatarLarger).pathname
              .split('/')
              .pop() as string
          );
        } catch {
          // TODO: Log this error
        }
      }

      task.output = 'Scraping posts account';
      const posts = await scrapePosts(accountName, 'advanceplus', ctx.session);
      task.output =
        'Scraping posts account successfull - Wait 1 minute to prevent rate limit';
      await delay(60 * 1000);

      if (posts === null) {
        throw new Error(`Error to scrape posts`);
      }

      if (posts.collector.length === 0) {
        throw new Error(`Empty profile`);
      }

      let videoWithError = 0;

      let videoDownloadedData = JSON.parse(
        fs.readFileSync(getDataFilePath(accountName)).toString()
      ) as Data;

      // eslint-disable-next-line no-restricted-syntax
      for (const post of posts.collector) {
        videoDownloadedData = syncVideoDownloaded(
          videoDownloadedData,
          accountName,
          post.id
        );

        fs.writeFileSync(
          getDataFilePath(accountName),
          JSON.stringify(videoDownloadedData)
        );

        if (
          !isNil(post.videoUrlNoWaterMark) &&
          !existsInVideoDownloaded(videoDownloadedData, post.id, 'advanceplus')
        ) {
          try {
            task.output = `Getting video url with id ${post.id} from snaptik`;

            const videoUrlNoWaterMark = await getVideoUrlOfSnaptik(
              accountName,
              post.id
            );

            task.output = `Download video with id ${post.id} from snaptik`;
            // eslint-disable-next-line no-await-in-loop
            await downloadVideo(
              accountName,
              videoUrlNoWaterMark,
              post.id,
              'advanceplus'
            );

            videoDownloadedData = addInVideoDownloaded(
              videoDownloadedData,
              post.id,
              'advanceplus'
            );

            fs.writeFileSync(
              getDataFilePath(accountName),
              JSON.stringify(videoDownloadedData)
            );

            task.output = `Download video with id ${post.id} from snaptik successfull - Wait 10 seconds to prevent rate limit`;
            await delay(10 * 1000);
          } catch {
            task.output = `Download video with id ${post.id} from snaptik failed - Wait 10 seconds to prevent rate limit`;
            await delay(10 * 1000);

            videoWithError += 1;
          }
        }
      }

      task.output = `Scraping account ${accountName} successfull ${
        videoWithError > 0 ? `but with error in ${videoWithError} video(s)` : ''
      } - Wait 2 minutes to prevent rate limit`;
      await delay(2 * 60 * 1000);
    }
  },
});

export default downloadAccount;
