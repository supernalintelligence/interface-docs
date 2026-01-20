/**
 * Check localStorage for chat state
 */

import { test, getBaseURL } from '../fixtures';

test('Check localStorage for chat state', async ({ page }) => {
  await page.goto(`${getBaseURL()}/demo/simple`);

  await page.waitForTimeout(2000);

  // Check localStorage
  const storage = await page.evaluate(() => {
    const keys = Object.keys(localStorage);
    const data: Record<string, string> = {};
    for (const key of keys) {
      data[key] = localStorage.getItem(key) || '';
    }
    return data;
  });

  console.log('LocalStorage keys:', Object.keys(storage));
  console.log('LocalStorage data:', JSON.stringify(storage, null, 2));

  // Check for chat-related keys
  const chatKeys = Object.keys(storage).filter(k => k.toLowerCase().includes('chat') || k.toLowerCase().includes('expand'));
  console.log('\nChat-related keys:', chatKeys);
  for (const key of chatKeys) {
    console.log(`  ${key} =`, storage[key]);
  }
});
