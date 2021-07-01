import puppeteer from 'puppeteer';

const getVideoUrlOfSnaptik = async (
  accountName: string,
  videoId: string
): Promise<string> => {
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 120000,
  });

  const page = await browser.newPage();
  await page.goto('https://snaptik.app/');
  await page.waitForTimeout(5000);

  const linkInput = await page.waitForSelector('input#url');
  const sendButton = await page.waitForSelector('button#submiturl');

  if (linkInput === null) {
    throw new Error("The response of the query 'input#url' is empty");
  }

  if (sendButton === null) {
    throw new Error("The response of the query 'button#submiturl' is empty");
  }

  await linkInput.type(
    `https://www.tiktok.com/@${accountName}/video/${videoId}`
  );

  await sendButton.click();

  await page.waitForTimeout(10000);

  await page.waitForSelector('#download-block a');
  const linkANodes = await page.$$('#download-block a');

  if (linkANodes.length === 0) {
    throw new Error("The response of the query '#download-block a' is empty");
  }

  const linkANode = linkANodes[0];

  let videoUrl = await linkANode.evaluate((el) => el.getAttribute('href'));

  if (videoUrl === null) {
    throw new Error("No 'href' attribute in tag 'a'");
  }

  if (videoUrl.startsWith('/file/')) {
    videoUrl = `https://snaptik.app/${videoUrl}`;
  }

  await browser.close();

  return videoUrl;
};

export default getVideoUrlOfSnaptik;
