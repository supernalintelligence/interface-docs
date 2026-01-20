/**
 * Playwright Test Fixtures
 *
 * Shared fixtures and utilities for all tests
 */

import { test as base, Page } from '@playwright/test';
import { Components } from '../src/architecture/Components';

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
  const chatInput = page.locator(`[data-testid="${Components.ChatInput}"]`);
  await chatInput.waitFor({ state: 'visible', timeout });
}

// Extend base test with custom fixtures if needed in the future
export const test = base.extend({
  // Example: Could add custom fixtures here
  // baseURL: async ({}, use) => {
  //   await use(getBaseURL());
  // },
});

export { expect } from '@playwright/test';

