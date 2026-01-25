/**
 * Debug test to check NavigationGraph context
 */

import { test, expect, getBaseURL } from '../fixtures';

test('Simple demo page sets correct context', async ({ page }) => {
  // Enable console logging
  const logs: string[] = [];
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[Container]') || text.includes('[AI]') || text.includes('context')) {
      logs.push(text);
    }
  });

  await page.goto(`${getBaseURL()}/demo/simple`);

  // Wait for page to be ready
  await page.waitForSelector('button:has-text("Open Menu")');
  await page.waitForTimeout(1000);

  // Check console logs for context
  console.log('Console logs:', logs);

  // Should see "Registered: DemoSimple"
  const hasRegistration = logs.some(log => log.includes('Registered: DemoSimple'));
  console.log('Has DemoSimple registration:', hasRegistration);
  expect(hasRegistration).toBe(true);

  // Check NavigationGraph state via window object
  const context = await page.evaluate(() => {
    // @ts-ignore
    const navGraph = window.__navigationGraph__;
    if (!navGraph) return null;

    return {
      // @ts-ignore
      currentContainer: navGraph.currentContainer,
      // @ts-ignore
      currentContext: navGraph.currentContext
    };
  });

  console.log('NavigationGraph context:', context);
});
