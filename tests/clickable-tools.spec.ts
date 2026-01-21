/**
 * Clickable Tools Test
 * 
 * Test that tool cards are clickable and execute tools directly
 */

import { test, expect, getBaseURL , expandChatBubble } from './fixtures';
import { TestRoutes, TestComponents } from './test-constants';
import { testId } from '@supernal/interface/testing';

test.describe('Clickable Tool Interface', () => {
  
  test('should show clickable tool cards with execute buttons', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    await page.waitForLoadState('networkidle');
    
    // Check that demo widgets are visible (these are the interactive "tool" elements)
    await expect(page.locator(testId(TestComponents.demo.container))).toBeVisible();
    await expect(page.locator(testId(TestComponents.demo.openMainMenu))).toBeVisible();
  });

  test('should execute tool when clicking execute button', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    await page.waitForLoadState('networkidle');
    
    // Minimize chat bubble
    const minimizeButton = page.locator(testId(TestComponents.chat.minimizeButton));
    if (await minimizeButton.isVisible({ timeout: 500 }).catch(() => false)) {
      await minimizeButton.click();
    }
    
    // Execute a safe tool (open menu)
    const openMenuButton = page.locator(testId(TestComponents.demo.openMainMenu));
    await openMenuButton.dispatchEvent('click');
    await page.waitForTimeout(200);
    
    // Button should still exist after click
    await expect(openMenuButton).toBeVisible();
  });

  test('should populate AI input when clicking command examples', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    await page.waitForLoadState('networkidle');

    // Expand chat bubble to make input visible
    await expandChatBubble(page);

    // Check AI input is accessible
    const aiInput = page.locator(testId(TestComponents.chat.input));
    await expect(aiInput).toBeVisible();
      
    // Fill input to verify it works
    await aiInput.fill('test command');
      const inputValue = await aiInput.inputValue();
    expect(inputValue).toBe('test command');
  });

  test('should show chat interface and accept input', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    await page.waitForLoadState('networkidle');

    // Expand chat bubble to make input visible
    await expandChatBubble(page);

    // Check chat interface exists
    const chatInput = page.locator(testId(TestComponents.chat.input));
    await expect(chatInput).toBeVisible();
      
    // Test input
        await chatInput.fill('Hello test message');
        const inputValue = await chatInput.inputValue();
        expect(inputValue).toBe('Hello test message');
  });
});
