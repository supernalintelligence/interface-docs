import { test, expect, getBaseURL } from '../fixtures';
import { TestRoutes, TestComponents } from '../test-constants';
import { testId } from '@supernal-interface/core/testing';

/**
 * Test cross-container tool execution
 * When on Dashboard, typing "open menu" should:
 * 1. Navigate to Demo page (where the tool exists)
 * 2. Execute the "open menu" tool
 */

test.describe('Cross-Container Navigation', () => {
  
  test('Navigate from Dashboard to Demo and execute tool', async ({ page }) => {
    await page.goto(getBaseURL());
    await page.waitForLoadState('networkidle');
    
    // Navigate to Dashboard
    await page.locator(testId(TestComponents.nav.dashboard)).click();
    await page.waitForLoadState('networkidle');
    
    // Verify we're on Dashboard
    await expect(page.locator(testId(TestComponents.dashboard.title))).toBeVisible();
    
    // Now type "open menu" - should navigate to Demo and execute
    const input = page.locator(testId(TestComponents.chat.input));
    await input.fill('open menu');
    await page.locator(testId(TestComponents.chat.sendButton)).click();
    
    // Wait for navigation and execution
    await page.waitForTimeout(3000);
    
    // Check we're now on Demo page
    await expect(page.locator(testId(TestComponents.demo.container))).toBeVisible({ timeout: 10000 });
    
    // Check menu opened (close button should be enabled)
    const closeButton = page.locator(testId(TestComponents.demo.closeMainMenu));
    await expect(closeButton).toBeEnabled();
  });
  
  test('Direct navigation command works', async ({ page }) => {
    await page.goto(getBaseURL());
    await page.waitForLoadState('networkidle');
    
    // Start on Dashboard
    await page.locator(testId(TestComponents.nav.dashboard)).click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator(testId(TestComponents.dashboard.title))).toBeVisible();
    
    // Type "demo" to navigate back
    const input = page.locator(testId(TestComponents.chat.input));
    await input.fill('demo');
    await page.locator(testId(TestComponents.chat.sendButton)).click();
    await page.waitForTimeout(3000);
    
    // Should be back on Demo
    await expect(page.locator(testId(TestComponents.demo.container))).toBeVisible({ timeout: 10000 });
  });
});
