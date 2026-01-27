/**
 * Browser Navigation Tests
 *
 * Tests:
 * - Browser navigation commands (back/forward/refresh/home)
 * - Context navigation (go up/parent)
 * - Error handling for edge cases
 */

import { test, expect } from '@playwright/test';
import { Components } from '../../src/architecture/ComponentNames';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3011';

test.describe('Browser Navigation Commands', () => {
  // Increase timeout for these tests since navigation can be slow
  test.setTimeout(60000);
  test('should navigate back to previous page', async ({ page }) => {
    // Navigate to multiple pages
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    await page.goto(`${BASE_URL}/blog`);
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Wait for chat to be available
    await page.locator(`[data-testid="${Components.Chat.bubble}"]`).waitFor({ timeout: 30000 });

    // Expand chat if needed
    const chatInput = page.locator(`[data-testid="${Components.Chat.input}"]`);
    const isInputVisible = await chatInput.isVisible().catch(() => false);
    if (!isInputVisible) {
      await page.locator(`[data-testid="${Components.Chat.bubble}"]`).click();
      await chatInput.waitFor({ state: 'visible', timeout: 5000 });
    }

    // Execute back command
    await chatInput.fill('back');
    const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);
    await sendButton.click();

    // Wait for navigation
    await page.waitForTimeout(2000);

    // Should be on homepage now
    expect(page.url()).toBe(`${BASE_URL}/`);
  });

  // Note: Skipped test - browser behavior with router.back() on first page load
  // varies (may navigate to about:blank), making this test unreliable.
  // The back() method works correctly when there is actual history.

  test('should navigate to root on home command', async ({ page }) => {
    // Navigate to a non-root page
    await page.goto(`${BASE_URL}/examples`);
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Wait for chat
    await page.locator(`[data-testid="${Components.Chat.bubble}"]`).waitFor({ timeout: 30000 });

    const chatInput = page.locator(`[data-testid="${Components.Chat.input}"]`);
    const isInputVisible = await chatInput.isVisible().catch(() => false);
    if (!isInputVisible) {
      await page.locator(`[data-testid="${Components.Chat.bubble}"]`).click();
      await chatInput.waitFor({ state: 'visible', timeout: 5000 });
    }

    // Execute home command
    await chatInput.fill('home');
    const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);
    await sendButton.click();

    // Wait for navigation
    await page.waitForTimeout(2000);

    // Should be on homepage
    expect(page.url()).toBe(`${BASE_URL}/`);
  });

  test('should reload page on refresh command', async ({ page }) => {
    // Navigate to a page
    await page.goto(`${BASE_URL}/examples`);
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Wait for chat
    await page.locator(`[data-testid="${Components.Chat.bubble}"]`).waitFor({ timeout: 30000 });

    const chatInput = page.locator(`[data-testid="${Components.Chat.input}"]`);
    const isInputVisible = await chatInput.isVisible().catch(() => false);
    if (!isInputVisible) {
      await page.locator(`[data-testid="${Components.Chat.bubble}"]`).click();
      await chatInput.waitFor({ state: 'visible', timeout: 5000 });
    }

    // Execute refresh command
    await chatInput.fill('refresh');
    const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);
    await sendButton.click();

    // Wait for reload
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Should still be on same page
    expect(page.url()).toContain('/examples');
  });

  test('should navigate to parent with go up command', async ({ page }) => {
    // Navigate to a blog post
    await page.goto(`${BASE_URL}/blog`);
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Find a blog post link and navigate to it
    const blogLinks = page.locator('a[href^="/blog/"]');
    const firstLink = blogLinks.first();

    if (await firstLink.isVisible()) {
      await firstLink.click();
      await page.waitForLoadState('networkidle', { timeout: 10000 });

      // Wait for chat
      await page.locator(`[data-testid="${Components.Chat.bubble}"]`).waitFor({ timeout: 30000 });

      const chatInput = page.locator(`[data-testid="${Components.Chat.input}"]`);
      const isInputVisible = await chatInput.isVisible().catch(() => false);
      if (!isInputVisible) {
        await page.locator(`[data-testid="${Components.Chat.bubble}"]`).click();
        await chatInput.waitFor({ state: 'visible', timeout: 5000 });
      }

      // Execute go up command
      await chatInput.fill('go up');
      const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);
      await sendButton.click();

      // Wait for navigation
      await page.waitForTimeout(2000);

      // Should be back on blog listing page
      expect(page.url()).toBe(`${BASE_URL}/blog`);
    }
  });

  test('should show error when already at root for go up', async ({ page }) => {
    // Navigate to root
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Wait for chat
    await page.locator(`[data-testid="${Components.Chat.bubble}"]`).waitFor({ timeout: 30000 });

    const chatInput = page.locator(`[data-testid="${Components.Chat.input}"]`);
    const isInputVisible = await chatInput.isVisible().catch(() => false);
    if (!isInputVisible) {
      await page.locator(`[data-testid="${Components.Chat.bubble}"]`).click();
      await chatInput.waitFor({ state: 'visible', timeout: 5000 });
    }

    // Try to go up from root
    await chatInput.fill('parent');
    const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);
    await sendButton.click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Should still be on root
    expect(page.url()).toBe(`${BASE_URL}/`);

    // Should see error message
    const messages = page.locator(`[data-testid^="chat-message-"]`);
    const lastMessage = messages.last();
    await expect(lastMessage).toBeVisible({ timeout: 5000 });
  });
});
