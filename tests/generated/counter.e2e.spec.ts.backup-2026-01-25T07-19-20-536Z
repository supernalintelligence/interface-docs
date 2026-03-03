/**
 * Auto-generated BASIC E2E tests for Counter Component
 * 
 * Component: counter
 * Container: Examples
 * 
 * Generated from @Component and @Tool decorators
 * 
 * ⚠️ BASIC TESTS ONLY:
 * - Click interactions
 * - Visibility checks
 * - Element presence
 * 
 * For advanced tests (state verification, assertions), see story-based tests.
 * 
 * To regenerate this file:
 * ```typescript
 * import { ComponentTestGenerator } from "@supernal/interface-enterprise";
 * 
 * const tests = ComponentTestGenerator.generateComponentTests('counter');
 * // or regenerate all:
 * await ComponentTestGenerator.generateAndWriteTests('demo/tests/generated/basic');
 * ```
 * 
 * Uses:
 * - Playwright fixtures for dynamic port
 * - testId helper (no magic strings!)
 * - Name contracts from DemoComponentNames
 */

import { test, expect, getBaseURL } from '../fixtures';
import { testId } from '@supernal/interface/testing';
import { Components } from '../../src/architecture';

test.describe('Component: counter', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to container using fixture-based URL
    await page.goto(`${getBaseURL()}/examples`, { 
      waitUntil: 'domcontentloaded' 
    });
  });

  test('increment - Increment counter by specified amount', async ({ page }) => {
    // Find the element using testId helper + name contract reference
    const element = page.locator(testId(Examples.counterIncrement)).first();
    
    // Wait for element to be visible (may be in animated section)
    await element.waitFor({ state: 'visible', timeout: 10000 });
    
    // Verify element is visible
    await expect(element).toBeVisible();
    
    // Click the element
    await element.click();
    
    // Verify action completed
    await expect(element).toBeEnabled();
  });

  test('decrement - Decrement counter by specified amount', async ({ page }) => {
    // Find the element using testId helper + name contract reference
    const element = page.locator(testId(Examples.counterDecrement)).first();
    
    // Wait for element to be visible (may be in animated section)
    await element.waitFor({ state: 'visible', timeout: 10000 });
    
    // Verify element is visible
    await expect(element).toBeVisible();
    
    // Click the element
    await element.click();
    
    // Verify action completed
    await expect(element).toBeEnabled();
  });

  test('reset - Reset counter to zero', async ({ page }) => {
    // Find the element using testId helper + name contract reference
    const element = page.locator(testId(Examples.counterReset)).first();
    
    // Wait for element to be visible (may be in animated section)
    await element.waitFor({ state: 'visible', timeout: 10000 });
    
    // Verify element is visible
    await expect(element).toBeVisible();
    
    // Click the element
    await element.click();
    
    // Verify action completed
    await expect(element).toBeEnabled();
  });

});
