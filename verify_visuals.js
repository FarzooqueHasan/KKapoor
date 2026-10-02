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

  // 1. Hover on the vintage pencil
  await page.hover('#scrapbook-pencil');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(__dirname, 'pencil_hover.png') });
  console.log('Pencil hover state captured');

  // 2. Click the pencil to activate Doodle Mode
  await page.click('#scrapbook-pencil');
  await page.waitForTimeout(600);

  // 3. Draw a cute curly underline / doodle on the scrapbook canvas
  const canvasBox = await page.locator('#doodle-canvas').boundingBox();
  if (canvasBox) {
    // Start drawing with 2B Graphite near the notepad checklist
    await page.mouse.move(canvasBox.x + 680, canvasBox.y + 360);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 720, canvasBox.y + 370, { steps: 5 });
    await page.mouse.move(canvasBox.x + 780, canvasBox.y + 355, { steps: 5 });
    await page.mouse.move(canvasBox.x + 850, canvasBox.y + 375, { steps: 5 });
    await page.mouse.move(canvasBox.x + 920, canvasBox.y + 360, { steps: 5 });
    await page.mouse.up();

    // Draw a small star doodle
    await page.mouse.move(canvasBox.x + 630, canvasBox.y + 260);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 645, canvasBox.y + 290, { steps: 3 });
    await page.mouse.move(canvasBox.x + 615, canvasBox.y + 270, { steps: 3 });
    await page.mouse.move(canvasBox.x + 655, canvasBox.y + 270, { steps: 3 });
    await page.mouse.move(canvasBox.x + 625, canvasBox.y + 290, { steps: 3 });
    await page.mouse.move(canvasBox.x + 630, canvasBox.y + 260, { steps: 3 });
    await page.mouse.up();

    // Select Gold Highlighter
    await page.click('.doodle-color-btn[data-color="#D4A034"]');
    await page.waitForTimeout(200);

    // Highlight over a note
    await page.mouse.move(canvasBox.x + 600, canvasBox.y + 490);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 880, canvasBox.y + 490, { steps: 8 });
    await page.mouse.up();
  }

  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(__dirname, 'pencil_doodle_active.png') });
  console.log('Doodle active mode with floating toolbar and doodles captured');

  // 4. Click 'Put Down Pencil'
  await page.click('#doodle-done-btn');
  await page.waitForTimeout(500);

  // Take updated hero screenshot with doodles visible on paper
  await page.screenshot({ path: path.join(__dirname, 'hero_desktop.png') });
  console.log('Hero desktop captured with doodles on paper');

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
