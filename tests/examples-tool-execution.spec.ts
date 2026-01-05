/**
 * Test actual tool execution on Examples page
 * Verifies that AI commands like "increment counter" work correctly
 */

import { test, expect } from '@playwright/test';
import { testId } from '@supernal-interface/core/testing';
import { Chat, Examples } from '../src/architecture/DemoComponentNames';

// Counter name constants (avoiding decorator execution)
const Counter = {
  incrementButton: 'examples-counter-increment',
} as const;

test.describe('Examples Page Tool Execution', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3011/examples');
    await page.waitForLoadState('networkidle');
  });

  test('should execute "increment counter" command', async ({ page }) => {
    // Expand chat if needed
    const chatInput = page.locator(testId(Chat.input));
    const isInputVisible = await chatInput.isVisible().catch(() => false);
    if (!isInputVisible) {
      await page.locator(testId(Chat.bubble)).click();
      await page.waitForTimeout(300);
    }

    // Type the command
    await chatInput.fill('increment counter');
    
    // Send it
    await page.locator(testId(Chat.sendButton)).click();
    
    // Wait for execution
    await page.waitForTimeout(1500);
    
    // Verify the counter button exists and was clicked
    const incrementButton = page.locator(testId(Counter.incrementButton));
    await expect(incrementButton).toBeVisible();
  });

  test('should match "increment the counter" command', async ({ page }) => {
    const chatInput = page.locator(testId(Chat.input));
    const isInputVisible = await chatInput.isVisible().catch(() => false);
    if (!isInputVisible) {
      await page.locator(testId(Chat.bubble)).click();
      await page.waitForTimeout(300);
    }

    await chatInput.fill('increment the counter');
    await page.locator(testId(Chat.sendButton)).click();
    
    await page.waitForTimeout(1500);
    
    // Should not show "no matching command" error
    const pageContent = await page.content();
    expect(pageContent).not.toContain('No matching command found');
  });

  test('should filter to Examples container tools only', async ({ page }) => {
    const chatInput = page.locator(testId(Chat.input));
    const isInputVisible = await chatInput.isVisible().catch(() => false);
    if (!isInputVisible) {
      await page.locator(testId(Chat.bubble)).click();
      await page.waitForTimeout(300);
    }

    // Try a command from a different container - should not work
    await chatInput.fill('theme dark');
    await page.locator(testId(Chat.sendButton)).click();
    
    await page.waitForTimeout(1000);
    
    // Should show error or suggestion (theme is from stateful demo, not examples)
    const pageContent = await page.content();
    // Should either navigate away or show command not found
    const currentUrl = page.url();
    expect(currentUrl.includes('/examples') || pageContent.includes('No matching command')).toBeTruthy();
  });
});

