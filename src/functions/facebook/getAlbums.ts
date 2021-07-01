import { Page } from 'puppeteer';
import { addAlbum } from '@/functions/facebook/dataManager';
import { Album, Data } from '@/interfaces/facebook';
import { isNil } from 'lodash';

const getAlbums = async (
  page: Page,
  accountUrl: string,
  accountName: string,
  accountData: Readonly<Data>,
  waitTime: number
): Promise<Album[]> => {
  let newAccountData = { ...accountData };

  await page.waitForTimeout(waitTime);

  await page.goto(`${accountUrl}/photos`, {
    timeout: 120000,
  });

  await page.waitForTimeout(waitTime);
  await page.waitForSelector('.timeline.albums', {
    timeout: 120000,
  });

  let moreButton = await page.$('#m_more_albums a');
  while (moreButton !== null) {
    await moreButton.focus();
    await moreButton.click();

    await page.waitForTimeout(waitTime);

    moreButton = await page.$('#m_more_albums a');
  }

  await page.waitForSelector('.timeline.albums a', {
    timeout: 120000,
  });

  const albumNodes = await page.$$('.timeline.albums a');

  for (const albumNode of albumNodes) {
    const albumSplitUrl = await albumNode.evaluate((el) =>
      el.getAttribute('href')
    );
    if (isNil(albumSplitUrl)) {
      continue;
    }

    const albumTitleNode = await albumNode.$('.title strong');
    if (isNil(albumTitleNode)) {
      continue;
    }

    const albumTitle = await albumTitleNode.evaluate((el) => el.innerHTML);
    if (isNil(albumTitle)) {
      continue;
    }

    let albumId = '?';
    if (albumSplitUrl.includes('album=')) {
      albumId = new URL(`${accountUrl}${albumSplitUrl}`).searchParams.get(
        'album'
      ) as string;
    } else if (albumSplitUrl.includes('/albums/')) {
      albumId = albumSplitUrl
        .substring(albumSplitUrl.length - 1, 1)
        .split('/')
        .pop() as string;
    }

    newAccountData = addAlbum(accountName, accountData, {
      name: albumTitle,
      url: `https://m.facebook.com${albumSplitUrl}`,
      id: albumId,
      photoViewers: [],
    });
  }

  return newAccountData.albums;
};

export default getAlbums;
