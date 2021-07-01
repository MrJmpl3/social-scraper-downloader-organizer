import { ListrTask } from 'listr2';
import { Browser } from 'puppeteer';
import {
  checkPhotoViewerWasDownloaded,
  loadData,
  saveData,
  setPhoto,
} from '@/functions/facebook/dataManager';
import downloadFile from '@/functions/facebook/downloadFile';
import getAlbums from '@/functions/facebook/getAlbums';
import getPhoto from '@/functions/facebook/getPhoto';
import getPhotosViewer from '@/functions/facebook/getPhotosViewer';
import { Context } from '@/interfaces/facebook';
import { existsDataFile, getPhotoFilePath } from '@/paths/facebook';

const downloadPhotos = (
  browserInstance: Browser,
  accountUrl: string
): ListrTask<Context> => ({
  title: `Download profile ${accountUrl}`,
  task: async (ctx, task) => {
    const page = await browserInstance.newPage();

    // Move to url profile
    await page.goto(accountUrl, {
      timeout: 120000,
    });
    task.output = `Go to: ${accountUrl}`;

    // Wait to prevent block of Facebook
    await page.waitForTimeout(ctx.waitTime);
    // The h3 selector is the profile name if that is loaded, all page is loaded
    await page.waitForSelector('h3', {
      timeout: 120000,
    });

    task.output = 'Getting name of account';

    // Getting the account name of the url, that works with numeric name or alfabetic name
    let accountName = accountUrl.replace('https://m.facebook.com/', '');
    if (accountUrl.indexOf('profile.php?id=') !== -1) {
      accountName = new URL(accountUrl).searchParams.get('id') as string;
    }

    // Ensure exists Data file
    if (!existsDataFile(accountName)) {
      saveData(accountName, {
        version: 1,
        url: accountUrl,
        albums: [],
      });
    }

    // Load Data file
    const accountData = loadData(accountName);

    // Getting the list of albums
    let albumsList = await getAlbums(
      page,
      accountUrl,
      accountName,
      accountData,
      ctx.waitTime
    );
    // Sort random the albums to improve the scraping when restart
    albumsList = albumsList.sort(() => Math.random() - 0.5);

    let albumDownloaded = 1;
    for (const album of albumsList) {
      task.output = `Loading albums: ${albumDownloaded}/${albumsList.length} - ${album.name}`;

      const photosViewer = await getPhotosViewer(
        page,
        accountName,
        accountData,
        album,
        ctx.waitTime
      );

      task.output = `Album ${album.name} - ${photosViewer.length} photos found`;

      let photoViewerDownloaded = 1;
      for (const photoViewer of photosViewer) {
        task.output = `Album ${album.name} - Downloading ${photoViewerDownloaded}/${photosViewer.length}`;

        if (checkPhotoViewerWasDownloaded(accountData, album, photoViewer)) {
          continue;
        }

        const photo = await getPhoto(
          page,
          accountName,
          accountData,
          album,
          photoViewer,
          ctx.waitTime
        );

        await page.waitForTimeout(ctx.waitTime);
        await downloadFile(
          photo.url,
          getPhotoFilePath(accountName, album, photo)
        );

        setPhoto(accountName, accountData, album, photoViewer, {
          ...photo,
          downloaded: true,
        });

        photoViewerDownloaded += 1;
      }

      albumDownloaded += 1;
    }

    await page.close();
  },
});

export default downloadPhotos;
