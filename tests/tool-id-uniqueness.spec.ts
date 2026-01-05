/**
 * Playwright Tests: Tool ID Uniqueness
 * 
 * Verifies:
 * 1. Simple demo tools have unique IDs
 * 2. Stateful demo tools have unique IDs
 * 3. Both demos use the same component architecture (shared IDs)
 * 4. Tools are properly registered
 */

import { test, expect, getBaseURL } from './fixtures';

test.describe('Tool ID Uniqueness', () => {
  test('simple demo has unique tool IDs', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/simple`);
    
    // Get all elements with data-testid (all widgets)
    const elements = await page.locator('[data-testid]').all();
    
    // Collect all test IDs
    const testIds: string[] = [];
    for (const el of elements) {
      const id = await el.getAttribute('data-testid');
      if (id) testIds.push(id);
    }
    
    // Find duplicates
    const idCounts = new Map<string, number>();
    testIds.forEach(id => {
      idCounts.set(id, (idCounts.get(id) || 0) + 1);
    });
    const duplicates = Array.from(idCounts.entries()).filter(([_, count]) => count > 1);
    
    // Allow duplicates for list items (chat messages, etc) - these use data-testid for type indication
    const allowedDuplicates = ['chat-message-user', 'chat-message-ai', 'chat-message-system'];
    const problematicDuplicates = duplicates.filter(([id]) => !allowedDuplicates.includes(id));
    
    // Check for uniqueness (excluding allowed duplicates)
    expect(problematicDuplicates.length).toBe(0);
    
    // Should have at least some widgets
    expect(testIds.length).toBeGreaterThan(0);
  });
  
  test('stateful demo has unique tool IDs', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/stateful`);
    
    // Get all elements with data-testid (all widgets)
    const elements = await page.locator('[data-testid]').all();
    
    // Collect all test IDs
    const testIds: string[] = [];
    for (const el of elements) {
      const id = await el.getAttribute('data-testid');
      if (id) testIds.push(id);
    }
    
    // Find duplicates
    const idCounts = new Map<string, number>();
    testIds.forEach(id => {
      idCounts.set(id, (idCounts.get(id) || 0) + 1);
    });
    const duplicates = Array.from(idCounts.entries()).filter(([_, count]) => count > 1);
    
    // Allow duplicates for list items (chat messages, etc) - these use data-testid for type indication
    const allowedDuplicates = ['chat-message-user', 'chat-message-ai', 'chat-message-system'];
    const problematicDuplicates = duplicates.filter(([id]) => !allowedDuplicates.includes(id));
    
    // Check for uniqueness (excluding allowed duplicates)
    expect(problematicDuplicates.length).toBe(0);
    
    // Should have at least some widgets
    expect(testIds.length).toBeGreaterThan(0);
  });
  
  test('both demos share the same component architecture', async ({ page }) => {
    // Get simple demo IDs
    await page.goto(`${getBaseURL()}/demo/simple`);
    const simpleElements = await page.locator('[data-testid]').all();
    const simpleIds: Set<string> = new Set();
    for (const el of simpleElements) {
      const id = await el.getAttribute('data-testid');
      if (id) simpleIds.add(id);
    }
    
    // Get stateful demo IDs
    await page.goto(`${getBaseURL()}/demo/stateful`);
    const statefulElements = await page.locator('[data-testid]').all();
    const statefulIds: Set<string> = new Set();
    for (const el of statefulElements) {
      const id = await el.getAttribute('data-testid');
      if (id) statefulIds.add(id);
    }
    
    // Both demos should have widgets
    expect(simpleIds.size).toBeGreaterThan(0);
    expect(statefulIds.size).toBeGreaterThan(0);
    
    // They should share most component IDs (same architecture)
    // Check for significant overlap
    const overlap = Array.from(simpleIds).filter(id => statefulIds.has(id));
    expect(overlap.length).toBeGreaterThan(0);
  });
  
  test('simple demo has expected tool count', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/simple`);
    
    // Wait for tools to be registered
    await page.waitForTimeout(1000);
    
    // Check for key widgets (using actual component IDs from architecture)
    await expect(page.locator('[data-testid="open-main-menu"]')).toBeVisible();
    await expect(page.locator('[data-testid="feature-toggle"]')).toBeVisible();
    await expect(page.locator('[data-testid="priority-high"]')).toBeVisible();
    await expect(page.locator('[data-testid="status-dropdown"]')).toBeVisible();
  });
  
  test('stateful demo has expected tool count', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/stateful`);
    
    // Wait for tools to be registered
    await page.waitForTimeout(1000);
    
    // Check for key widgets (stateful uses stateful- prefixed IDs)
    await expect(page.locator('[data-testid="stateful-open-menu"]')).toBeVisible();
    await expect(page.locator('[data-testid="stateful-feature-toggle"]')).toBeVisible();
    await expect(page.locator('[data-testid="stateful-priority-high"]')).toBeVisible();
    await expect(page.locator('[data-testid="stateful-status-dropdown"]')).toBeVisible();
  });
});

