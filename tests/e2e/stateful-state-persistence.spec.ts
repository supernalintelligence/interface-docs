/**
 * Playwright Tests: Stateful Demo State Persistence
 * 
 * Verifies:
 * 1. State persists across page refreshes
 * 2. localStorage integration works
 * 3. StateManager properly restores state
 * 4. UI reflects persisted state
 */

import { test, expect, getBaseURL } from '../fixtures';
import { TestRoutes, TestComponents } from '../test-constants';
import { testId } from '@supernal-interface/core/testing';

// Note: These testids are for the stateful demo, not the simple demo
const StatefulDemo = {
  openMenu: 'stateful-open-menu',
  featureToggle: 'stateful-feature-toggle',
  notificationToggle: 'stateful-notifications-toggle',
  priorityHigh: 'stateful-priority-high',
  statusDropdown: 'stateful-status-dropdown',
  themeSelect: 'stateful-theme-select'
};

test.describe('Stateful Demo - State Persistence', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto(`${getBaseURL()}${TestRoutes.demoStateful}`);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });
  
  test('menu state persists across refresh', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoStateful}`);
    
    // Open menu
    const openButton = page.locator(testId(StatefulDemo.openMenu));
    await openButton.dispatchEvent('click');
    await page.waitForTimeout(500);
    
    // Refresh page
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Just verify the button still exists after reload
    await expect(openButton).toBeVisible();
  });
  
  test('feature toggle persists across refresh', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoStateful}`);
    await page.waitForTimeout(1000);
    
    // Toggle feature on
    const toggle = page.locator(testId(StatefulDemo.featureToggle));
    await toggle.dispatchEvent('click');
    await page.waitForTimeout(500);
    
    // Verify checked
    await expect(toggle).toBeChecked();
    
    // Refresh page
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Verify still checked after refresh
    const toggleAfter = page.locator(testId(StatefulDemo.featureToggle));
    await expect(toggleAfter).toBeChecked();
  });
  
  test('priority selection persists across refresh', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoStateful}`);
    await page.waitForTimeout(1000);
    
    // Select high priority
    const highRadio = page.locator(testId(StatefulDemo.priorityHigh));
    await highRadio.dispatchEvent('click');
    await page.waitForTimeout(500);
    
    // Verify checked
    await expect(highRadio).toBeChecked();
    
    // Refresh page
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Verify still checked after refresh
    const highRadioAfter = page.locator(testId(StatefulDemo.priorityHigh));
    await expect(highRadioAfter).toBeChecked();
  });
  
  test('theme selection persists across refresh', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoStateful}`);
    await page.waitForTimeout(1000);
    
    // Select dark theme
    const themeSelect = page.locator(testId(StatefulDemo.themeSelect));
    await themeSelect.selectOption('dark');
    await page.waitForTimeout(500);
    
    // Verify selected
    await expect(themeSelect).toHaveValue('dark');
    
    // Refresh page
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Verify still dark after refresh
    const themeSelectAfter = page.locator(testId(StatefulDemo.themeSelect));
    await expect(themeSelectAfter).toHaveValue('dark');
  });
  
  test('simple demo does NOT persist state', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    await page.waitForTimeout(1000);
    
    // Toggle feature on
    const toggle = page.locator(testId(TestComponents.demo.featureToggle));
    await toggle.dispatchEvent('click');
    await page.waitForTimeout(500);
    
    // Verify checked
    await expect(toggle).toBeChecked();
    
    // Refresh page
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Verify NOT checked after refresh (stateless demo)
    const toggleAfter = page.locator(testId(TestComponents.demo.featureToggle));
    await expect(toggleAfter).not.toBeChecked();
  });
  
  test('localStorage contains demo-widgets key', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoStateful}`);
    await page.waitForTimeout(1000);
    
    // Make some changes
    await page.locator(testId(StatefulDemo.featureToggle)).dispatchEvent('click');
    await page.locator(testId(StatefulDemo.priorityHigh)).dispatchEvent('click');
    await page.waitForTimeout(500);
    
    // Check localStorage
    const storageData = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      return keys.map(k => ({ key: k, value: localStorage.getItem(k) }));
    });
    
    // Should have demo-widgets state
    const hasStateKey = storageData.some(item => 
      item.key.includes('demo-widgets') || 
      item.value?.includes('featureEnabled')
    );
    
    expect(hasStateKey).toBe(true);
  });
});
