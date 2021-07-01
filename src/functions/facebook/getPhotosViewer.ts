import { isNil } from 'lodash';
import { Page } from 'puppeteer';
import { addPhotoViewer, getAlbum } from '@/functions/facebook/dataManager';
import { Album, Data, PhotoViewer } from '@/interfaces/facebook';

const getPhotosViewer = async (
  page: Page,
  accountName: string,
  accountData: Readonly<Data>,
  album: Readonly<Album>,
  waitTime: number
): Promise<PhotoViewer[]> => {
  let newAccountData = { ...accountData };

  await page.waitForTimeout(waitTime);
  await page.goto(album.url, {
    timeout: 120000,
  });
  await page.waitForTimeout(waitTime);
  await page.waitForSelector('div[role="main"]', {
    timeout: 120000,
  });

  let moreDiv = await page.$('#m_more_photos');
  while (moreDiv !== null) {
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await page.waitForTimeout(waitTime);

    moreDiv = await page.$('#m_more_photos');
  }

  const photosViewerUrlNodes = await page.$$(
    'div[role="main"] a[href^="/photo.php?"]'
  );

  for (const photosViewerUrlNode of photosViewerUrlNodes) {
    const photosViewerUrl = await photosViewerUrlNode.evaluate((el) =>
      el.getAttribute('href')
    );

    if (isNil(photosViewerUrl)) {
      continue;
    }

    newAccountData = addPhotoViewer(accountName, accountData, album, {
      url: `https://m.facebook.com${photosViewerUrl}`,
      photo: { url: '', downloaded: false },
    });
  }

  const albumUpdateData = getAlbum(newAccountData, album.id);
  if (albumUpdateData === null) {
    return [];
  }

  return albumUpdateData.data.photoViewers;
};

export default getPhotosViewer;
