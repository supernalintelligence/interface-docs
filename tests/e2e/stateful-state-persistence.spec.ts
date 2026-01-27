/**
 * Playwright Tests: Demo Page State Persistence
 *
 * Verifies:
 * 1. State persists across page refreshes for Level 3 (Advanced) widgets
 * 2. localStorage integration works correctly
 * 3. StateManager properly restores state from localStorage
 * 4. UI reflects persisted state after page reload
 *
 * Note: Tests the InteractiveWidgets component on /demo page (Level 3: Advanced Shared State)
 */

import { test, expect, getBaseURL } from '../fixtures';
import { TestRoutes, TestComponents } from '../test-constants';
import { Page } from '@playwright/test';

/**
 * Helper: Navigate to demo page and scroll to Advanced section
 */
async function navigateToAdvancedSection(page: Page) {
  await page.goto(`${getBaseURL()}${TestRoutes.demo}`);
  await page.waitForLoadState('networkidle');

  // Scroll to the Advanced section (Level 3) to make widgets visible
  await page.evaluate(() => {
    const advancedSection = document.querySelector('#advanced');
    if (advancedSection) {
      advancedSection.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });
  await page.waitForTimeout(300);
}

test.describe('Demo Page - State Persistence (Level 3: Advanced Widgets)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    // Navigate with cleared localStorage to start fresh
    await page.goto(`${getBaseURL()}${TestRoutes.demo}`);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => localStorage.clear());
  });

  test('menu button exists and is clickable', async ({ page }) => {
    await navigateToAdvancedSection(page);

    // Find the "Open Menu" button using actual testid
    const openButton = page.locator(`[data-testid="${TestComponents.demo.openMainMenu}"]`);

    // Verify button exists and is visible
    await expect(openButton).toBeVisible();

    // Click it
    await openButton.click();
    await page.waitForTimeout(500);

    // Refresh page and scroll again
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => {
      document.querySelector('#advanced')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(300);

    // Verify button still exists after reload
    await expect(openButton).toBeVisible();
  });

  test('feature toggle persists across refresh', async ({ page }) => {
    await navigateToAdvancedSection(page);

    // Find the feature toggle using actual testid
    const toggle = page.locator(`[data-testid="${TestComponents.demo.featureToggle}"]`);
    await expect(toggle).toBeVisible();

    // Get initial state
    const initialChecked = await toggle.isChecked();

    // Toggle it
    await toggle.click();
    await page.waitForTimeout(500);

    // Verify it changed
    const afterClick = await toggle.isChecked();
    expect(afterClick).toBe(!initialChecked);

    // Refresh page and scroll to advanced section
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => {
      document.querySelector('#advanced')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(300);

    // Verify state persisted after refresh
    const toggleAfter = page.locator(`[data-testid="${TestComponents.demo.featureToggle}"]`);
    await expect(toggleAfter).toBeVisible();
    const afterRefresh = await toggleAfter.isChecked();
    expect(afterRefresh).toBe(afterClick);
  });

  test('priority selection persists across refresh', async ({ page }) => {
    await navigateToAdvancedSection(page);

    // Select high priority using actual testid
    const highRadio = page.locator(`[data-testid="${TestComponents.demo.priorityHigh}"]`);
    await expect(highRadio).toBeVisible();

    await highRadio.click();
    await page.waitForTimeout(500);

    // Verify checked
    await expect(highRadio).toBeChecked();

    // Refresh page and scroll
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => {
      document.querySelector('#advanced')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(300);

    // Verify still checked after refresh
    const highRadioAfter = page.locator(`[data-testid="${TestComponents.demo.priorityHigh}"]`);
    await expect(highRadioAfter).toBeChecked();
  });

  test('theme selection persists across refresh', async ({ page }) => {
    await navigateToAdvancedSection(page);

    // Find theme select using actual testid
    const themeSelect = page.locator(`[data-testid="${TestComponents.demo.themeToggle}"]`);
    await expect(themeSelect).toBeVisible();

    // Select dark theme
    await themeSelect.selectOption('dark');
    await page.waitForTimeout(500);

    // Verify selected
    await expect(themeSelect).toHaveValue('dark');

    // Refresh page and scroll
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => {
      document.querySelector('#advanced')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(300);

    // Verify still dark after refresh
    const themeSelectAfter = page.locator(`[data-testid="${TestComponents.demo.themeToggle}"]`);
    await expect(themeSelectAfter).toHaveValue('dark');
  });

  test('status selection persists across refresh', async ({ page }) => {
    await navigateToAdvancedSection(page);

    // Find status dropdown using actual testid
    const statusSelect = page.locator(`[data-testid="${TestComponents.demo.statusDropdown}"]`);
    await expect(statusSelect).toBeVisible();

    // Select "active" status
    await statusSelect.selectOption('active');
    await page.waitForTimeout(500);

    // Verify selected
    await expect(statusSelect).toHaveValue('active');

    // Refresh page and scroll
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => {
      document.querySelector('#advanced')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(300);

    // Verify still active after refresh
    const statusSelectAfter = page.locator(`[data-testid="${TestComponents.demo.statusDropdown}"]`);
    await expect(statusSelectAfter).toHaveValue('active');
  });

  test('notifications toggle persists across refresh', async ({ page }) => {
    await navigateToAdvancedSection(page);

    // Find notifications toggle using actual testid
    const notifToggle = page.locator(`[data-testid="${TestComponents.demo.notificationToggle}"]`);
    await expect(notifToggle).toBeVisible();

    // Get initial state
    const initialChecked = await notifToggle.isChecked();

    // Toggle it
    await notifToggle.click();
    await page.waitForTimeout(500);

    // Verify it changed
    const afterClick = await notifToggle.isChecked();
    expect(afterClick).toBe(!initialChecked);

    // Refresh page and scroll
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => {
      document.querySelector('#advanced')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(300);

    // Verify state persisted
    const notifToggleAfter = page.locator(`[data-testid="${TestComponents.demo.notificationToggle}"]`);
    const afterRefresh = await notifToggleAfter.isChecked();
    expect(afterRefresh).toBe(afterClick);
  });

  test('localStorage contains demo state after interactions', async ({ page }) => {
    await navigateToAdvancedSection(page);

    // Make some changes to trigger state updates
    const featureToggle = page.locator(`[data-testid="${TestComponents.demo.featureToggle}"]`);
    const priorityHigh = page.locator(`[data-testid="${TestComponents.demo.priorityHigh}"]`);

    await expect(featureToggle).toBeVisible();
    await expect(priorityHigh).toBeVisible();

    await featureToggle.click();
    await page.waitForTimeout(300);

    await priorityHigh.click();
    await page.waitForTimeout(500);

    // Check localStorage for the actual key used by the implementation
    const storageData = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      return keys.map(k => ({ key: k, value: localStorage.getItem(k) }));
    });

    // The implementation uses 'demo-simple-state' as the storage key
    // (see UIWidgetComponents.tsx line 59: const STORAGE_KEY = 'demo-simple-state')
    const hasStateKey = storageData.some(item =>
      item.key === 'demo-simple-state' ||
      item.value?.includes('featureEnabled') ||
      item.value?.includes('priority')
    );

    expect(hasStateKey).toBe(true);

    // Verify the state contains expected fields
    const demoState = storageData.find(item => item.key === 'demo-simple-state');
    if (demoState?.value) {
      const parsed = JSON.parse(demoState.value);
      expect(parsed).toHaveProperty('featureEnabled');
      expect(parsed).toHaveProperty('priority');
      expect(parsed).toHaveProperty('theme');
      expect(parsed).toHaveProperty('status');
    }
  });

  test('multiple state changes persist correctly', async ({ page }) => {
    await navigateToAdvancedSection(page);

    // Make multiple changes
    const featureToggle = page.locator(`[data-testid="${TestComponents.demo.featureToggle}"]`);
    const priorityHigh = page.locator(`[data-testid="${TestComponents.demo.priorityHigh}"]`);
    const themeSelect = page.locator(`[data-testid="${TestComponents.demo.themeToggle}"]`);
    const statusSelect = page.locator(`[data-testid="${TestComponents.demo.statusDropdown}"]`);

    // Toggle feature
    await featureToggle.click();
    await page.waitForTimeout(300);

    // Set priority
    await priorityHigh.click();
    await page.waitForTimeout(300);

    // Set theme
    await themeSelect.selectOption('dark');
    await page.waitForTimeout(300);

    // Set status
    await statusSelect.selectOption('active');
    await page.waitForTimeout(500);

    // Capture expected states
    const expectedFeature = await featureToggle.isChecked();
    const expectedPriority = await priorityHigh.isChecked();
    const expectedTheme = await themeSelect.inputValue();
    const expectedStatus = await statusSelect.inputValue();

    // Refresh page and scroll
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => {
      document.querySelector('#advanced')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(300);

    // Verify ALL states persisted
    const featureAfter = page.locator(`[data-testid="${TestComponents.demo.featureToggle}"]`);
    const priorityAfter = page.locator(`[data-testid="${TestComponents.demo.priorityHigh}"]`);
    const themeAfter = page.locator(`[data-testid="${TestComponents.demo.themeToggle}"]`);
    const statusAfter = page.locator(`[data-testid="${TestComponents.demo.statusDropdown}"]`);

    expect(await featureAfter.isChecked()).toBe(expectedFeature);
    expect(await priorityAfter.isChecked()).toBe(expectedPriority);
    await expect(themeAfter).toHaveValue(expectedTheme);
    await expect(statusAfter).toHaveValue(expectedStatus);
  });
});
