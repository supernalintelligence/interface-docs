/**
 * Playwright Tests: Demo Navigation Between Routes
 * 
 * Verifies:
 * 1. Demo routes are accessible and have proper layout
 * 2. Can navigate between demo routes via tab navigation
 * 3. Each route shows correct demo widgets
 * 4. Active tab styling works correctly
 */

import { test, expect, getBaseURL } from '../fixtures';
import { TestRoutes, TestComponents } from '../test-constants';
import { testId } from '@supernal/interface/testing';

test.describe('Demo Route Navigation', () => {

  test('demo index redirects to simple', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo`);
    await page.waitForLoadState('networkidle');
    
    // Should redirect to /demo/simple
    await expect(page).toHaveURL(/\/demo\/simple/);
    await expect(page.locator(testId(TestComponents.demo.container))).toBeVisible();
  });
  
  test('simple demo loads with proper layout', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    await page.waitForLoadState('networkidle');
    
    // Check header (be specific - multiple h1s might exist)
    await expect(page.locator('h1').first()).toContainText('Interactive Demo');
    
    // Check demo container exists
    await expect(page.locator(testId(TestComponents.demo.container))).toBeVisible();
    
    // Check Simple tab navigation exists
    await expect(page.locator('a[href="/demo/simple"]')).toBeVisible();
  });
  
  test('can navigate to stateful demo via tab', async ({ page }) => {
    // Start on simple
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    await page.waitForLoadState('networkidle');
    
    // Click stateful/advanced tab (labeled "Stateful")
    const statefulTab = page.locator('a[href="/demo/advanced"]');
    await statefulTab.click();
    await page.waitForLoadState('networkidle');
    
    // Should be on advanced/stateful route
    await expect(page).toHaveURL(/\/demo\/(advanced|stateful)/);
    await expect(page.locator(testId(TestComponents.demo.container))).toBeVisible();
  });
  
  test('can navigate to hierarchical demo via tab', async ({ page }) => {
    // Start on simple
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    await page.waitForLoadState('networkidle');
    
    // Click hierarchical tab
    const hierarchicalTab = page.locator('a[href="/demo/hierarchical"]');
    await hierarchicalTab.click();
    await page.waitForLoadState('networkidle');
    
    // Should be on hierarchical route
    await expect(page).toHaveURL(/\/demo\/hierarchical/);
    await expect(page.locator(testId(TestComponents.demo.container))).toBeVisible();
  });
  
  test('active tab has correct styling', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    await page.waitForLoadState('networkidle');
    
    // Simple tab should have active styling
    const simpleTab = page.locator('a[href="/demo/simple"]');
    await expect(simpleTab).toHaveClass(/border-blue-500/);
  });
  
  test('simple demo shows widgets', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    await page.waitForLoadState('networkidle');
    
    // Check for demo widgets
    await expect(page.locator(testId(TestComponents.demo.openMainMenu))).toBeVisible();
    await expect(page.locator(testId(TestComponents.demo.featureToggle))).toBeVisible();
  });
  
  test('stateful demo is accessible', async ({ page }) => {
    // Try both routes since naming might vary
    const statefulRoute = TestRoutes.demoStateful || '/demo/advanced';
    await page.goto(`${getBaseURL()}${statefulRoute}`);
    await page.waitForLoadState('networkidle');
    
    // Should load successfully
    await expect(page.locator(testId(TestComponents.demo.container))).toBeVisible();
  });
  
  test('navigation between routes preserves layout', async ({ page }) => {
    // Start on simple
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    await page.waitForLoadState('networkidle');
    
    const header = page.locator('h1').first();
    await expect(header).toContainText('Interactive Demo');
    
    // Navigate to stateful
    await page.locator('a[href="/demo/advanced"]').click();
    await page.waitForLoadState('networkidle');
    
    // Header should still exist
    await expect(header).toContainText('Interactive Demo');
    await expect(page.locator(testId(TestComponents.demo.container))).toBeVisible();
  });
});
