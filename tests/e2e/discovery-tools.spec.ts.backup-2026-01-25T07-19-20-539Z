/**
 * Tool Discovery Tests
 *
 * Tests:
 * - /list command shows context-aware tools
 * - /help command shows general and specific help
 * - /where am I command shows current context
 * - Fuzzy matching for tool names
 */

import { test, expect } from '@playwright/test';
import { Components } from '../../src/architecture/DemoComponentNames';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3011';

test.describe('Tool Discovery Commands', () => {
  // Increase timeout for these tests
  test.setTimeout(60000);

  test('should list context-aware tools on blog page', async ({ page }) => {
    // Navigate to blog page
    await page.goto(`${BASE_URL}/blog`);
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Wait for chat
    await page.locator(`[data-testid="${Components.Chat.bubble}"]`).waitFor({ timeout: 30000 });

    const chatInput = page.locator(`[data-testid="${Components.Chat.input}"]`);
    const isInputVisible = await chatInput.isVisible().catch(() => false);
    if (!isInputVisible) {
      await page.locator(`[data-testid="${Components.Chat.bubble}"]`).click();
      await chatInput.waitFor({ state: 'visible', timeout: 5000 });
    }

    // Execute /list command
    await chatInput.fill('/list');
    const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);
    await sendButton.click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Should see message with tool list
    const messages = page.locator(`[data-testid^="chat-message-"]`);
    const lastMessage = messages.last();
    await expect(lastMessage).toBeVisible({ timeout: 5000 });

    // Check for expected content
    const messageText = await lastMessage.textContent();
    expect(messageText).toContain('Available Tools');
    expect(messageText).toContain('Global Tools');
  });

  test('should show general help with /help command', async ({ page }) => {
    // Navigate to any page
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

    // Execute /help command
    await chatInput.fill('/help');
    const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);
    await sendButton.click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Should see general help message
    const messages = page.locator(`[data-testid^="chat-message-"]`);
    const lastMessage = messages.last();
    await expect(lastMessage).toBeVisible({ timeout: 5000 });

    const messageText = await lastMessage.textContent();
    expect(messageText).toContain('Supernal Interface Help');
    expect(messageText).toContain('Discovery Commands');
    expect(messageText).toContain('Browser Navigation');
  });

  test('should show tool details with /help {tool}', async ({ page }) => {
    // Navigate to any page
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

    // Execute /help back command
    await chatInput.fill('/help back');
    const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);
    await sendButton.click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Should see tool details
    const messages = page.locator(`[data-testid^="chat-message-"]`);
    const lastMessage = messages.last();
    await expect(lastMessage).toBeVisible({ timeout: 5000 });

    const messageText = await lastMessage.textContent();
    // Should contain tool description or examples
    expect(messageText).toMatch(/back|previous|navigate/i);
  });

  test('should show current context with /where am I', async ({ page }) => {
    // Navigate to examples page
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

    // Execute /where am I command
    await chatInput.fill('/where am I');
    const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);
    await sendButton.click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Should see location info
    const messages = page.locator(`[data-testid^="chat-message-"]`);
    const lastMessage = messages.last();
    await expect(lastMessage).toBeVisible({ timeout: 5000 });

    const messageText = await lastMessage.textContent();
    expect(messageText).toContain('Current Location');
    expect(messageText).toContain('/examples');
  });

  test('should handle natural language variations', async ({ page }) => {
    // Navigate to any page
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

    // Try natural language versions
    await chatInput.fill('what tools are available');
    const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);
    await sendButton.click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Should see tool list
    const messages = page.locator(`[data-testid^="chat-message-"]`);
    const lastMessage = messages.last();
    await expect(lastMessage).toBeVisible({ timeout: 5000 });

    const messageText = await lastMessage.textContent();
    expect(messageText).toContain('Available Tools');
  });
});
