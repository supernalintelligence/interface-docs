/**
 * Test that command processing works on all demo routes
 */

import { test, expect, getBaseURL } from '../fixtures';

test('Simple demo - "open menu" command works', async ({ page }) => {
  await page.goto(`${getBaseURL()}/demo/simple`);
  
  // Wait for page to load
  await page.waitForSelector('[data-testid="simple-open-main-menu"]');
  
  // Find chat input and send command
  const chatInput = page.locator('textarea[placeholder*="Type a command"]').first();
  await expect(chatInput).toBeVisible();
  
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
  
  // Wait for page to load
  await page.waitForSelector('[data-testid="stateful-notification-toggle"]');
  
  // Find chat input and send command
  const chatInput = page.locator('textarea[placeholder*="Type a command"]').first();
  await expect(chatInput).toBeVisible();
  
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
  
  // Wait for page to load
  await page.waitForSelector('[data-testid="simple-theme-select"]');
  
  // Find chat input and send command
  const chatInput = page.locator('textarea[placeholder*="Type a command"]').first();
  await expect(chatInput).toBeVisible();
  
  await chatInput.fill('set theme dark');
  await chatInput.press('Enter');
  
  // Wait for command to process
  await page.waitForTimeout(1000);
  
  // Check that the chat shows the command was executed
  const chatMessages = page.locator('.flex.flex-col.space-y-3 > div');
  const lastMessage = chatMessages.last();
  await expect(lastMessage).toContainText('Theme');
});

