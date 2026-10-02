const { chromium } = require('C:/Users/dpset/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');

async function testConsole() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:3456', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  const guestbookNotes = await page.$$('.sticky-note');
  console.log('Guestbook notes found:', guestbookNotes.length);

  const polaroids = await page.$$('.polaroid');
  console.log('Polaroids found:', polaroids.length);

  await browser.close();
}

testConsole().catch(console.error);
