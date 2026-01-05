/**
 * Basic Functionality Test
 * 
 * Tests that the demo loads and basic functionality works
 * Updated to use architecture-aware container routes and component names
 */

import { test, expect, getBaseURL } from './fixtures';
import { TestRoutes, TestComponents, testid } from './test-constants';

test.describe('Basic Demo Functionality', () => {
  
  test('should load the landing page successfully', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.landing}`);
    
    // Check that the landing page loads with correct title (be specific to avoid multiple h1 matches)
    await expect(page.locator('h1').nth(1)).toContainText('AI-Controllable');
    
    // Check that navigation is present
    await expect(page.locator(testid(TestComponents.nav.demo))).toBeVisible();
  });

  test('should load the demo/simple page successfully', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    
    // Check that the demo page container is present
    await expect(page.locator(testid(TestComponents.demo.container))).toBeVisible();
    
    // Check that key demo elements exist
    await expect(page.locator(testid(TestComponents.demo.openMainMenu))).toBeVisible();
  });

  test('should have required demo UI elements with data-testid attributes', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    
    // Check for key elements using architecture-defined component names
    const requiredElements = [
      TestComponents.demo.openMainMenu,
      TestComponents.demo.featureToggle,
      TestComponents.demo.notificationToggle,
    ];

    for (const testId of requiredElements) {
      await expect(page.locator(testid(testId))).toBeVisible();
    }
  });

  test('should be able to execute safe actions', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    
    // Minimize chat bubble first
    const minimizeButton = page.locator(testid(TestComponents.chat.minimizeButton));
    if (await minimizeButton.isVisible({ timeout: 500 }).catch(() => false)) {
      await minimizeButton.click();
    }
    
    // Test opening menu (safe action)
    await page.locator(testid(TestComponents.demo.openMainMenu)).dispatchEvent('click');
    await page.waitForTimeout(200);
    
    // Test closing menu
    await page.locator(testid(TestComponents.demo.closeMainMenu)).dispatchEvent('click');
    await page.waitForTimeout(200);
  });

  test('should navigate between pages using header nav', async ({ page }) => {
    // Start at landing page
    await page.goto(`${getBaseURL()}${TestRoutes.landing}`);
    await page.waitForLoadState('networkidle');
    
    // Navigate to examples
    await page.locator(testid(TestComponents.nav.examples)).click();
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the examples page
    await expect(page).toHaveURL(new RegExp(TestRoutes.examples));
  });
});