/**
 * Examples Page E2E Tests
 * 
 * Tests:
 * - Examples page loads
 * - Copy to chat button inserts command into chat input
 * - Widgets and tools work
 */

import { test, expect } from '@playwright/test';
import { testId } from '@supernal/interface/testing';
import { Chat, Examples } from '../../src/architecture/Components';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3011';

test.describe('Examples Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/examples`);
    
    // Wait for page to load
    await page.waitForSelector(testId(Chat.bubble), { state: 'visible', timeout: 10000 });
  });

  test('should load examples page', async ({ page }) => {
    // Check that page loaded
    await expect(page).toHaveTitle(/Examples.*Supernal Interface/);
    
    // Check that chat is visible
    await expect(page.locator(testId(Chat.bubble))).toBeVisible();
    
    // Check that expand all button exists
    await expect(page.locator(testId(Examples.expandAllButton))).toBeVisible();
  });

  test('should copy command to chat input', async ({ page }) => {
    // Find first example card with "Copy to Chat" button
    const copyToChatButton = page.locator(testId(Examples.copyToChatButton)).first();
    
    // Get the command text before clicking
    const commandElement = page.locator('code.text-green-400').first();
    const commandText = await commandElement.textContent();
    const cleanCommand = commandText?.replace(/"/g, '').trim() || '';
    
    // Click copy to chat
    await copyToChatButton.click();
    
    // Wait a bit for the insertion
    await page.waitForTimeout(200);
    
    // Check that chat input has the command
    const chatInput = page.locator(testId(Chat.input));
    const inputValue = await chatInput.inputValue();
    
    expect(inputValue).toBe(cleanCommand);
    
    // Verify chat expanded (if it wasn't already)
    await expect(chatInput).toBeVisible();
  });

  test('should execute example tool command', async ({ page }) => {
    // Click copy to chat for first command (should be "increment the counter")
    const copyToChatButton = page.locator(testId(Examples.copyToChatButton)).first();
    await copyToChatButton.click();
    
    await page.waitForTimeout(200);
    
    // Ensure chat is expanded by checking if input is visible, if not click bubble
    const chatInput = page.locator(testId(Chat.input));
    const isInputVisible = await chatInput.isVisible().catch(() => false);
    if (!isInputVisible) {
      await page.locator(testId(Chat.bubble)).click();
      await page.waitForTimeout(200);
    }
    
    // Verify the command was inserted
    const inputValue = await chatInput.inputValue();
    expect(inputValue).toContain('increment');
    
    // Send the message
    const sendButton = page.locator(testId(Chat.sendButton));
    await sendButton.click();
    
    // Wait for response - just verify no error by checking input cleared
    await page.waitForTimeout(1000);
    const newInputValue = await chatInput.inputValue();
    expect(newInputValue).toBe(''); // Input should be cleared after sending
  });

  test('should expand and collapse example cards', async ({ page }) => {
    // Find an example card
    const firstCard = page.locator('[data-example-id]').first();
    await expect(firstCard).toBeVisible();
    
    // Click to expand (should already be expanded based on default)
    const expandButton = firstCard.locator('button').first();
    await expandButton.click();
    
    // Wait for animation
    await page.waitForTimeout(500);
    
    // Click again to collapse
    await expandButton.click();
    
    // Wait for animation
    await page.waitForTimeout(500);
  });
});

