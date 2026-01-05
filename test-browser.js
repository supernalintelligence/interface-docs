const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  await page.goto('http://localhost:3011');
  console.log('Navigated to page');
  
  await page.waitForTimeout(3000);
  
  const html = await page.content();
  const hasError = html.includes('Runtime Error') || html.includes('Error:');
  console.log('Has error overlay:', hasError);
  
  if (!hasError) {
    const testids = await page.$$('[data-testid]');
    console.log('Found testids:', testids.length);
    
    if (testids.length > 0) {
      for (let i = 0; i < Math.min(5, testids.length); i++) {
        const id = await testids[i].getAttribute('data-testid');
        console.log(`  - ${id}`);
      }
    }
  }
  
  await page.screenshot({ path: '/tmp/real-browser-test.png' });
  console.log('Screenshot saved');
  
  // Don't close so we can see
  // await browser.close();
})();
