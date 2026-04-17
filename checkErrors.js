import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(`Console Error: ${msg.text()}`);
      }
    });
    page.on('pageerror', err => {
      errors.push(`Page Error: ${err.toString()}`);
    });

    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Check if React rendered anything or if there's a vite overlay
    const rootHtml = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root ? root.innerHTML.slice(0, 500) : 'No root element';
    });

    const viteError = await page.evaluate(() => {
      const overlay = document.querySelector('vite-error-overlay');
      return overlay ? overlay.shadowRoot.innerHTML : null;
    });

    console.log('Errors:', errors);
    console.log('Root HTML snippet:', rootHtml);
    if (viteError) {
      console.log('Vite Error Overlay found!');
    }
    
    await browser.close();
  } catch (err) {
    console.error('Script Error:', err);
  }
})();
