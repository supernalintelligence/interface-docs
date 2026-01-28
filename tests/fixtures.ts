/**
 * Playwright Test Fixtures
 *
 * Shared fixtures and utilities for all tests
 */

import { test as base, Page } from '@playwright/test';
import { Chat } from '../src/architecture/ComponentNames';

// Get the dynamic base URL
const getDevPort = require('../scripts/get-port');
const testConfig = require('../test.config');

export const getBaseURL = () => {
  return testConfig.getBaseURL(getDevPort());
};

/**
 * Expands the chat bubble if it's collapsed, making the chat input accessible.
 * This is required before trying to access chat input in tests since ChatBubble is minimized by default.
 *
 * @param page - Playwright Page object
 * @param timeout - Optional timeout in ms (default: 5000)
 */
export async function expandChatBubble(page: Page, timeout: number = 5000) {
  // WORKAROUND: Since clicking doesn't work reliably in tests, set localStorage before page loads
  // This makes the chat start expanded instead of trying to expand it with clicks
  await page.evaluate(() => {
    localStorage.setItem('supernal-chat-expanded', 'true');
  });

  // Reload to apply the localStorage setting
  await page.reload({ waitUntil: 'networkidle' });

  // Wait for chat input to be visible (should be expanded now)
  const chatInput = page.locator(`[data-testid="${Chat.input}"]`);
  await chatInput.waitFor({ state: 'visible', timeout });
}

/**
 * Check if dev server is running
 */
async function checkDevServer(baseURL: string): Promise<void> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(baseURL);
      if (response.ok || response.status === 404) {
        // 404 is fine - server is running, just no route at /
        return;
      }
    } catch (error) {
      lastError = error as Error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw new Error(
    `Dev server not running at ${baseURL}. Please start it with: cd docs-site && npm run dev\n` +
    `Last error: ${lastError?.message}`
  );
}

// Extend base test with server health check and auto-expanded chat
export const test = base.extend({
  page: async ({ page }, use) => {
    // Check dev server before each test
    const baseURL = getBaseURL();
    await checkDevServer(baseURL);

    // Auto-expand chat bubble on every page load via init script.
    // This complements the storageState in playwright.config.ts and ensures
    // the chat stays expanded even after navigations within a test.
    await page.addInitScript(() => {
      localStorage.setItem('supernal-chat-expanded', 'true');
    });

    await use(page);
  },
});

export { expect } from '@playwright/test';

