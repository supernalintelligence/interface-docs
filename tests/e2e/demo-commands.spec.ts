/**
 * Test that command processing works on all demo routes
 */

import { test, expect, getBaseURL, expandChatBubble } from '../fixtures';
import { Demo, Chat } from '../../src/architecture/DemoComponentNames';

test('Simple demo - "open menu" command works', async ({ page }) => {
  await page.goto(`${getBaseURL()}/demo/simple`);

  // Wait for page to load using DemoComponentNames contract
  await page.waitForSelector(`[data-testid="${Demo.openMainMenu}"]`);

  // Expand chat bubble to access input
  await expandChatBubble(page);

  // Find chat input using DemoComponentNames contract (should be visible after expandChatBubble)
  const chatInput = page.locator(`[data-testid="${Chat.input}"]`);
  await expect(chatInput).toBeVisible({ timeout: 5000 });
  
  await chatInput.fill('open menu');
  await chatInput.press('Enter');
  
  // Wait for command to process and response to appear
  await page.waitForTimeout(2000);

  // Check that the chat shows the command was executed
  // The success message should appear in the chat
  await expect(page.locator('text=✅ Clicked OpenMainMenu')).toBeVisible({ timeout: 5000 });
});

test('Advanced demo - "toggle notifications" command works', async ({ page }) => {
  await page.goto(`${getBaseURL()}/demo/stateful`);

  // Wait for page to load using DemoComponentNames contract
  await page.waitForSelector(`[data-testid="${Demo.notificationToggle}"]`);

  // Expand chat bubble to access input
  await expandChatBubble(page);

  // Find chat input using DemoComponentNames contract (should be visible after expandChatBubble)
  const chatInput = page.locator(`[data-testid="${Chat.input}"]`);
  await expect(chatInput).toBeVisible({ timeout: 5000 });
  
  await chatInput.fill('toggle notifications');
  await chatInput.press('Enter');

  // Wait for command to process and response to appear
  await page.waitForTimeout(2000);

  // Check that the chat shows a response
  // Count system messages - there should be more after the command
  const systemMessages = page.locator('[data-testid="chat-message-system"]');
  const countBefore = 6; // Welcome messages
  const countAfter = await systemMessages.count();
  expect(countAfter).toBeGreaterThan(countBefore);
});

test('Simple demo - "set theme dark" command works', async ({ page }) => {
  await page.goto(`${getBaseURL()}/demo/simple`);

  // Wait for page to load using DemoComponentNames contract
  await page.waitForSelector(`[data-testid="${Demo.themeToggle}"]`);

  // Expand chat bubble to access input
  await expandChatBubble(page);

  // Find chat input using DemoComponentNames contract (should be visible after expandChatBubble)
  const chatInput = page.locator(`[data-testid="${Chat.input}"]`);
  await expect(chatInput).toBeVisible({ timeout: 5000 });
  
  await chatInput.fill('set theme dark');
  await chatInput.press('Enter');

  // Wait for command to process and response to appear
  await page.waitForTimeout(2000);

  // Check that the chat shows a response
  // Count system messages - there should be more after the command
  const systemMessages = page.locator('[data-testid="chat-message-system"]');
  const countBefore = 6; // Welcome messages
  const countAfter = await systemMessages.count();
  expect(countAfter).toBeGreaterThan(countBefore);
});

