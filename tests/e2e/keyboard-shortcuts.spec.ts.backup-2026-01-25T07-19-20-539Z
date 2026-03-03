import { test, expect } from '@playwright/test';

test.describe('Chat keyboard shortcuts', () => {
  test('pressing Escape should close expanded chat', async ({ page }) => {
    await page.goto('http://localhost:3011/');

    // Wait for chat bubble to be visible
    const chatBubble = page.locator('[data-testid="chat-bubble"]');
    await expect(chatBubble).toBeVisible();

    // Chat should start expanded (per recent change)
    const chatPanel = page.locator('[data-testid="chat-messages"]').locator('..');
    await expect(chatPanel).toBeVisible();

    // Press Escape key
    await page.keyboard.press('Escape');

    // Chat panel should now be hidden
    await expect(chatPanel).not.toBeVisible();
  });

  test('pressing / should reopen closed chat', async ({ page }) => {
    // Clear localStorage to ensure clean state
    await page.goto('http://localhost:3011/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Wait for chat bubble
    const chatBubble = page.locator('[data-testid="chat-bubble"]');
    await expect(chatBubble).toBeVisible();

    // Chat should start closed
    const chatPanel = page.locator('[data-testid="chat-messages"]').locator('..');

    // Wait a bit for any initial state to settle
    await page.waitForTimeout(500);

    // Press / key to open
    await page.keyboard.press('/');

    // Wait and check if it opened
    await page.waitForTimeout(500);

    // Chat should now be visible
    await expect(chatPanel).toBeVisible({ timeout: 2000 });
  });

  test('Cmd+/ should open chat', async ({ page }) => {
    await page.goto('http://localhost:3011/');

    // Close chat first
    await page.keyboard.press('Escape');

    const chatPanel = page.locator('[data-testid="chat-messages"]').locator('..');
    await expect(chatPanel).not.toBeVisible();

    // Press Cmd+/ (or Ctrl+/ on Windows/Linux)
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
    await page.keyboard.press(`${modifier}+/`);

    // Chat should open
    await expect(chatPanel).toBeVisible();
  });
});
