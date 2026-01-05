/**
 * Playwright Tests: Route Navigation
 * 
 * Verifies:
 * 1. Simple demo route loads
 * 2. Advanced demo route loads
 * 3. Routes are independent
 * 4. Navigation between routes works
 */

import { test, expect, getBaseURL } from '../fixtures';
import { Components } from '../../src/architecture';

test.describe('Demo Route Navigation', () => {
  test('simple demo route loads successfully', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/simple`);
    
    // Check page loaded
    await expect(page).toHaveTitle(/Simple Demo/);
    
    // Check header
    await expect(page.getByRole('heading', { level: 1, name: /Interactive Demo/i })).toBeVisible();
    
    // Check widgets section exists using component names
    await expect(page.locator(`[data-testid="${Components.Demo.openMainMenu}"]`)).toBeVisible();
    await expect(page.locator(`[data-testid="${Components.Demo.featureToggle}"]`)).toBeVisible();
  });
  
  test('stateful demo route loads successfully', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/stateful`);
    
    // Check page loaded
    await expect(page).toHaveTitle(/Stateful Demo/);
    
    // Check header
    await expect(page.getByRole('heading', { level: 1, name: /Interactive Demo/i })).toBeVisible();
    
    // Check widgets section exists
    await expect(page.locator('[data-testid*="priority"]').first()).toBeVisible();
  });
  
  test('can navigate between simple and advanced routes', async ({ page }) => {
    // Start at simple
    await page.goto(`${getBaseURL()}/demo/simple`);
    await expect(page).toHaveTitle(/Simple Demo/);
    
    // Navigate to advanced
    await page.goto(`${getBaseURL()}/demo/stateful`);
    await expect(page).toHaveTitle(/Stateful Demo/);
    
    // Navigate back to simple
    await page.goto(`${getBaseURL()}/demo/simple`);
    await expect(page).toHaveTitle(/Simple Demo/);
  });
  
  test('routes have working widgets', async ({ page }) => {
    // Check simple route has expected widgets
    await page.goto(`${getBaseURL()}/demo/simple`);
    await expect(page.locator(`[data-testid="${Components.Demo.openMainMenu}"]`)).toBeVisible();
    await expect(page.locator(`[data-testid="${Components.Demo.priorityHigh}"]`)).toBeVisible();
    await expect(page.locator(`[data-testid="${Components.Demo.formSubmit}"]`)).toBeVisible();
    
    // Check advanced route has widgets
    await page.goto(`${getBaseURL()}/demo/stateful`);
    // Advanced uses different IDs - check for any widget presence
    await expect(page.locator('[data-testid*="priority"]').first()).toBeVisible();
  });
});

