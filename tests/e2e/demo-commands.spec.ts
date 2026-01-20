/**
 * Test that command processing works on all demo routes
 */

import { test, expect, getBaseURL, expandChatBubble } from '../fixtures';
import { Components } from '../../src/architecture/Components';

test('Simple demo - "open menu" command works', async ({ page }) => {
  await page.goto(`${getBaseURL()}/demo/simple`);

  // Wait for page to load using Components contract
  await page.waitForSelector(`[data-testid="${Components.OpenMenuButton}"]`);

  // Expand chat bubble to access input
  await expandChatBubble(page);

  // Find chat input using Components contract (should be visible after expandChatBubble)
  const chatInput = page.locator(`[data-testid="${Components.ChatInput}"]`);
  await expect(chatInput).toBeVisible({ timeout: 5000 });
  
  await chatInput.fill('open menu');
  await chatInput.press('Enter');
  
  // Wait for command to process and check for success
  await page.waitForTimeout(1000);
  
  // Check that the chat shows the command was executed
  const chatMessages = page.locator('.flex.flex-col.space-y-3 > div');
  const lastMessage = chatMessages.last();
  await expect(lastMessage).toContainText('Menu');
});

test('Advanced demo - "toggle notifications" command works', async ({ page }) => {
  await page.goto(`${getBaseURL()}/demo/stateful`);

  // Wait for page to load using Components contract
  await page.waitForSelector(`[data-testid="${Components.NotificationsToggle}"]`);

  // Expand chat bubble to access input
  await expandChatBubble(page);

  // Find chat input using Components contract (should be visible after expandChatBubble)
  const chatInput = page.locator(`[data-testid="${Components.ChatInput}"]`);
  await expect(chatInput).toBeVisible({ timeout: 5000 });
  
  await chatInput.fill('toggle notifications');
  await chatInput.press('Enter');
  
  // Wait for command to process
  await page.waitForTimeout(1000);
  
  // Check that the chat shows the command was executed
  const chatMessages = page.locator('.flex.flex-col.space-y-3 > div');
  const lastMessage = chatMessages.last();
  await expect(lastMessage).toContainText('notification');
});

test('Simple demo - "set theme dark" command works', async ({ page }) => {
  await page.goto(`${getBaseURL()}/demo/simple`);

  // Wait for page to load using Components contract
  await page.waitForSelector(`[data-testid="${Components.ThemeSelect}"]`);

  // Expand chat bubble to access input
  await expandChatBubble(page);

  // Find chat input using Components contract (should be visible after expandChatBubble)
  const chatInput = page.locator(`[data-testid="${Components.ChatInput}"]`);
  await expect(chatInput).toBeVisible({ timeout: 5000 });
  
  await chatInput.fill('set theme dark');
  await chatInput.press('Enter');
  
  // Wait for command to process
  await page.waitForTimeout(1000);
  
  // Check that the chat shows the command was executed
  const chatMessages = page.locator('.flex.flex-col.space-y-3 > div');
  const lastMessage = chatMessages.last();
  await expect(lastMessage).toContainText('Theme');
});

