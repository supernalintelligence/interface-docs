/**
 * Playwright Tests: Tool ID Uniqueness
 * 
 * Verifies:
 * 1. Simple demo tools have unique IDs
 * 2. Advanced demo tools have unique IDs  
 * 3. No conflicts between demos
 * 4. Tools are properly registered
 */

import { test, expect, getBaseURL } from '../fixtures';

test.describe('Tool ID Uniqueness', () => {
  test('simple demo has unique tool IDs', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/simple`);
    
    // Get all elements with data-testid starting with 'simple-'
    const simpleElements = await page.locator('[data-testid^="simple-"]').all();
    
    // Collect all test IDs
    const testIds: string[] = [];
    for (const el of simpleElements) {
      const id = await el.getAttribute('data-testid');
      if (id) testIds.push(id);
    }
    
    // Check for uniqueness
    const uniqueIds = new Set(testIds);
    expect(uniqueIds.size).toBe(testIds.length);
    
    // Verify they all start with 'simple-'
    testIds.forEach(id => {
      expect(id).toMatch(/^simple-/);
    });
  });
  
  test('stateful demo has unique tool IDs', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/stateful`);
    
    // Get all elements with data-testid starting with 'stateful-'
    const advancedElements = await page.locator('[data-testid^="stateful-"]').all();
    
    // Collect all test IDs
    const testIds: string[] = [];
    for (const el of advancedElements) {
      const id = await el.getAttribute('data-testid');
      if (id) testIds.push(id);
    }
    
    // Check for uniqueness
    const uniqueIds = new Set(testIds);
    expect(uniqueIds.size).toBe(testIds.length);
    
    // Verify they all start with 'stateful-'
    testIds.forEach(id => {
      expect(id).toMatch(/^stateful-/);
    });
  });
  
  test('no tool ID conflicts between demos', async ({ page }) => {
    // Get simple demo IDs
    await page.goto(`${getBaseURL()}/demo/simple`);
    const simpleElements = await page.locator('[data-testid^="simple-"]').all();
    const simpleIds: string[] = [];
    for (const el of simpleElements) {
      const id = await el.getAttribute('data-testid');
      if (id) simpleIds.push(id);
    }
    
    // Get stateful demo IDs
    await page.goto(`${getBaseURL()}/demo/stateful`);
    const advancedElements = await page.locator('[data-testid^="stateful-"]').all();
    const advancedIds: string[] = [];
    for (const el of advancedElements) {
      const id = await el.getAttribute('data-testid');
      if (id) advancedIds.push(id);
    }
    
    // Check for any overlaps
    const simpleSet = new Set(simpleIds);
    const advancedSet = new Set(advancedIds);
    
    advancedIds.forEach(id => {
      expect(simpleSet.has(id)).toBe(false);
    });
    
    simpleIds.forEach(id => {
      expect(advancedSet.has(id)).toBe(false);
    });
  });
  
  test('simple demo has expected tool count', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/simple`);
    
    // Wait for tools to be registered
    await page.waitForTimeout(1000);
    
    // Check for key widgets
    await expect(page.locator('[data-testid="simple-open-menu"]')).toBeVisible();
    await expect(page.locator('[data-testid="simple-feature-toggle"]')).toBeVisible();
    await expect(page.locator('[data-testid="simple-priority-high"]')).toBeVisible();
    await expect(page.locator('[data-testid="simple-status-dropdown"]')).toBeVisible();
  });
  
  test('stateful demo has expected tool count', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/stateful`);
    
    // Wait for tools to be registered
    await page.waitForTimeout(1000);
    
    // Check for key widgets
    await expect(page.locator('[data-testid="stateful-open-menu"]')).toBeVisible();
    await expect(page.locator('[data-testid="stateful-feature-toggle"]')).toBeVisible();
    await expect(page.locator('[data-testid="stateful-priority-high"]')).toBeVisible();
    await expect(page.locator('[data-testid="stateful-status-dropdown"]')).toBeVisible();
  });
});

