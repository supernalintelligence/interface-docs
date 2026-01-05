import { test } from '@playwright/test';

test('debug page state', async ({ page }) => {
  await page.goto(getBaseURL());
  await page.waitForLoadState('networkidle');
  
  console.log('Page title:', await page.title());
  
  const html = await page.content();
  const testids = html.match(/data-testid="[^"]+"/g) || [];
  console.log('Found testids (first 15):', testids.slice(0, 15));
  
  const openMenu = page.locator('[data-testid="open-main-menu"]');
  const count = await openMenu.count();
  console.log('open-main-menu count:', count);
  
  if (count > 0) {
    const visible = await openMenu.isVisible();
    console.log('Is visible:', visible);
    const boundingBox = await openMenu.boundingBox();
    console.log('Bounding box:', boundingBox);
  }
  
  await page.screenshot({ path: 'test-results/debug-page.png', fullPage: true });
  console.log('Screenshot saved');
});
