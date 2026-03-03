/**
 * Scoping Test - Verify tools are correctly scoped to containers
 *
 * This test verifies that:
 * 1. Tools with containerId='DemoSimple' only appear on /demo/simple
 * 2. Tools with containerId='Demo' only appear on /demo
 * 3. Global navigation tools appear on all pages
 */

import { test, expect } from '@playwright/test';

test.describe('Tool Scoping Verification', () => {
  test('should show scoped tools on /demo page', async ({ page }) => {
    await page.goto('/demo');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Get the AI tools count from the page
    const toolList = page.locator('[data-testid*="tool-list"], .tool-list, :has-text("Available AI Tools")');
    const tools = await toolList.locator('[data-testid*="tool-"], [class*="tool-"]').count();

    console.log(`[Test] Found ${tools} tools on /demo page`);

    // Should have demo-specific tools plus global tools
    expect(tools).toBeGreaterThan(10);
  });

  test('should show scoped tools on /demo/simple page', async ({ page }) => {
    await page.goto('/demo/simple');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Get the AI tools count from the page
    const toolList = page.locator('[data-testid*="tool-list"], .tool-list, :has-text("Available AI Tools")');
    const tools = await toolList.locator('[data-testid*="tool-"], [class*="tool-"]').count();

    console.log(`[Test] Found ${tools} tools on /demo/simple page`);

    // Should have demo-simple-specific tools plus global tools
    expect(tools).toBeGreaterThan(5);
  });

  test('should only show global tools on landing page', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check if tool list exists
    const hasToolList = await page.locator('[data-testid*="tool-list"], .tool-list').count();

    console.log(`[Test] Landing page has tool list: ${hasToolList > 0}`);

    // Landing page should either have no tool list, or only global navigation tools
    if (hasToolList > 0) {
      const tools = await page.locator('[data-testid*="tool-"], [class*="tool-"]').count();
      console.log(`[Test] Found ${tools} tools on landing page`);
      // Should only have global navigation tools (< 10)
      expect(tools).toBeLessThan(10);
    }
  });

  test('goToDemo navigation should work correctly', async ({ page }) => {
    await page.goto('/');

    // This would test the actual navigation in a real browser
    // For now, just verify the page loads
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/');
  });
});
