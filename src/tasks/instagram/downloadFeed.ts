import { getDate, getMonth, getYear, subDays } from 'date-fns';
import delay from 'delay';
import { ListrTask } from 'listr2';
import executeCommand from '@/functions/global/executeCommand';
import { ContextFeeds } from '@/interfaces/instagram';
import getFolderPath from '@/paths/instagram';

const downloadFeed = (): ListrTask<ContextFeeds> => ({
  title: 'Download feed',
  task: async (ctx) => {
    const date = new Date();
    const folder = getFolderPath();

    const dateLimit = subDays(new Date(), ctx.feedDays);
    const dateFilter = `${getYear(dateLimit)}, ${
      getMonth(dateLimit) + 1
    }, ${getDate(dateLimit)}`;

    const instaloaderArgs: string[] = [
      ':feed',
      '--dirname-pattern={profile}\\posts',
      `--post-filter="date_utc >= datetime(${dateFilter})"`,
      '--no-captions',
      '--no-video-thumbnails',
      '--request-timeout=300',
    ];

    if (ctx.altAccount) {
      instaloaderArgs.push(
        `--login=${process.env.INSTAGRAM_USER_ALT}`,
        `--password=${process.env.INSTAGRAM_PASSWORD_ALT}`
      );
    } else {
      instaloaderArgs.push(
        `--login=${process.env.INSTAGRAM_USER}`,
        `--password=${process.env.INSTAGRAM_PASSWORD}`
      );
    }

    if (!ctx.full) {
      instaloaderArgs.push('--fast-update');
    }

    // Wait 1 minute before to execute the scraper to prevent temp block of Instagram
    await delay(60 * 1000);

    await executeCommand('instaloader', instaloaderArgs, folder, date);
  },
});

export default downloadFeed;
