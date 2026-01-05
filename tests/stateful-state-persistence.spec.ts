/**
 * Playwright Tests: Stateful Demo State Persistence
 * 
 * Verifies:
 * 1. State persists across page refreshes
 * 2. localStorage integration works
 * 3. StateManager properly restores state
 * 4. UI reflects persisted state
 */

import { test, expect, getBaseURL } from './fixtures';

test.describe('Stateful Demo - State Persistence', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto(`${getBaseURL()}/demo/stateful`);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });
  
  test('menu state persists across refresh', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/stateful`);
    
    // Open menu
    const openButton = page.locator('[data-testid="stateful-open-menu"]');
    await openButton.click();
    await page.waitForTimeout(500);
    
    // Verify menu opened (check UI state)
    // This will depend on your InteractiveWidgets implementation
    
    // Refresh page
    await page.reload();
    await page.waitForTimeout(1000);
    
    // TODO: Verify menu state persisted
    // This depends on how menu state is reflected in UI
  });
  
  test('feature toggle persists across refresh', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/stateful`);
    await page.waitForTimeout(1000);
    
    // Toggle feature on
    const toggle = page.locator('[data-testid="stateful-feature-toggle"]');
    await toggle.click();
    await page.waitForTimeout(500);
    
    // Verify checked
    await expect(toggle).toBeChecked();
    
    // Refresh page
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Verify still checked after refresh
    const toggleAfter = page.locator('[data-testid="stateful-feature-toggle"]');
    await expect(toggleAfter).toBeChecked();
  });
  
  test('priority selection persists across refresh', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/stateful`);
    await page.waitForTimeout(1000);
    
    // Select high priority
    const highRadio = page.locator('[data-testid="stateful-priority-high"]');
    await highRadio.click();
    await page.waitForTimeout(500);
    
    // Verify checked
    await expect(highRadio).toBeChecked();
    
    // Refresh page
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Verify still checked after refresh
    const highRadioAfter = page.locator('[data-testid="stateful-priority-high"]');
    await expect(highRadioAfter).toBeChecked();
  });
  
  test('theme selection persists across refresh', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/stateful`);
    await page.waitForTimeout(1000);
    
    // Select dark theme
    const themeSelect = page.locator('[data-testid="stateful-theme-select"]');
    await themeSelect.selectOption('dark');
    await page.waitForTimeout(500);
    
    // Verify selected
    await expect(themeSelect).toHaveValue('dark');
    
    // Refresh page
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Verify still dark after refresh
    const themeSelectAfter = page.locator('[data-testid="stateful-theme-select"]');
    await expect(themeSelectAfter).toHaveValue('dark');
  });
  
  test('simple demo does NOT persist state', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/simple`);
    await page.waitForTimeout(1000);
    
    // Toggle feature on
    const toggle = page.locator('[data-testid="simple-feature-toggle"]');
    await toggle.click();
    await page.waitForTimeout(500);
    
    // Verify checked
    await expect(toggle).toBeChecked();
    
    // Refresh page
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Verify NOT checked after refresh (stateless demo)
    const toggleAfter = page.locator('[data-testid="simple-feature-toggle"]');
    await expect(toggleAfter).not.toBeChecked();
  });
  
  test('localStorage contains demo-widgets key', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/stateful`);
    await page.waitForTimeout(1000);
    
    // Make some changes
    await page.locator('[data-testid="stateful-feature-toggle"]').click();
    await page.locator('[data-testid="stateful-priority-high"]').click();
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

