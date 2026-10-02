const { chromium } = require('C:/Users/dpset/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
const path = require('path');

async function captureScreenshots() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 }
  });

  await page.goto('http://localhost:3456', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Take hero screenshot
  await page.screenshot({ path: path.join(__dirname, 'hero_desktop.png') });
  console.log('Hero desktop captured');

  // Trigger birthday celebration
  await page.click('.trigger-bday');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(__dirname, 'birthday_modal.png') });
  console.log('Birthday modal captured');

  // Close modal
  await page.click('#bday-modal-close');
  await page.waitForTimeout(400);

  // Scroll down smoothly through all spreads to trigger reveal
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  await page.waitForTimeout(1000);

  // Capture full page screenshot
  await page.screenshot({ path: path.join(__dirname, 'full_page.png'), fullPage: true });
  console.log('Full page captured');

  await browser.close();
  console.log('Finished capturing screenshots');
}

captureScreenshots().catch(console.error);
