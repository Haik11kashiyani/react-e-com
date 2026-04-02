import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
    // Scroll down a bit to see the carousel
    await page.evaluate(() => {
      window.scrollBy(0, 800);
    });
    // Wait for a second for animations
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'frontend_screenshot.png' });
    await browser.close();
    console.log('Screenshot saved as frontend_screenshot.png');
  } catch (err) {
    console.error('Error:', err);
  }
})();
