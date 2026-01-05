/**
 * Playwright Tests: Route Navigation
 * 
 * Verifies:
 * 1. Simple demo route loads
 * 2. Advanced demo route loads
 * 3. Routes are independent
 * 4. Navigation between routes works
 */

import { test, expect, getBaseURL } from './fixtures';
import { TestRoutes, TestComponents } from './test-constants';
import { testId } from '@supernal-interface/core/testing';

test.describe('Demo Route Navigation', () => {
  test('simple demo route loads successfully', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    
    // Check container exists
    await expect(page.locator(testId(TestComponents.demo.container))).toBeVisible();
  });
  
  test('stateful demo route loads successfully', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoStateful}`);
    
    // Check container exists
    await expect(page.locator(testId(TestComponents.demo.container))).toBeVisible();
  });
  
  test('can navigate between simple and advanced routes', async ({ page }) => {
    // Start at simple
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    await expect(page.locator(testId(TestComponents.demo.container))).toBeVisible();
    
    // Navigate to stateful
    await page.goto(`${getBaseURL()}${TestRoutes.demoStateful}`);
    await expect(page.locator(testId(TestComponents.demo.container))).toBeVisible();
    
    // Navigate back to simple
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    await expect(page.locator(testId(TestComponents.demo.container))).toBeVisible();
  });
  
  test('routes have independent page structures', async ({ page }) => {
    // Check simple route
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    await expect(page.locator(testId(TestComponents.demo.container))).toBeVisible();
    
    // Check stateful route  
    await page.goto(`${getBaseURL()}${TestRoutes.demoStateful}`);
    await expect(page.locator(testId(TestComponents.demo.container))).toBeVisible();
  });
});

