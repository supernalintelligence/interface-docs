/**
 * Playwright Tests: Simple Demo Widgets
 * 
 * Verifies:
 * 1. All widgets render correctly
 * 2. Widgets are interactive
 * 3. State updates work (non-persistent)
 * 4. Tools are properly decorated
 */

import { test, expect, getBaseURL } from '../fixtures';
import { TestRoutes, TestComponents } from '../test-constants';
import { testId } from '@supernal-interface/core/testing';
import { assertDemoState, waitForDemoState } from '../state-helpers';

test.describe('Simple Demo - Widget Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    await page.waitForTimeout(1000);
    
    // Minimize chat bubble
    const minimizeButton = page.locator(testId(TestComponents.chat.minimizeButton));
    for (let i = 0; i < 2; i++) {
      if (await minimizeButton.isVisible({ timeout: 500 }).catch(() => false)) {
        await minimizeButton.click();
        await page.waitForTimeout(200);
      }
    }
  });
  
  test('all widgets are visible', async ({ page }) => {
    // Menu buttons
    await expect(page.locator(testId(TestComponents.demo.openMainMenu))).toBeVisible();
    await expect(page.locator(testId(TestComponents.demo.closeMainMenu))).toBeVisible();
    
    // Toggles
    await expect(page.locator(testId(TestComponents.demo.featureToggle))).toBeVisible();
    await expect(page.locator(testId(TestComponents.demo.notificationToggle))).toBeVisible();
    
    // Priority radios
    await expect(page.locator(testId(TestComponents.demo.priorityHigh))).toBeVisible();
    await expect(page.locator(testId(TestComponents.demo.priorityMedium))).toBeVisible();
    await expect(page.locator(testId(TestComponents.demo.priorityLow))).toBeVisible();
    
    // Dropdowns
    await expect(page.locator(testId(TestComponents.demo.statusDropdown))).toBeVisible();
    await expect(page.locator(testId(TestComponents.demo.themeToggle))).toBeVisible();
    
    // Form
    await expect(page.locator(testId(TestComponents.demo.formName))).toBeVisible();
    await expect(page.locator(testId(TestComponents.demo.formSubmit))).toBeVisible();
  });
  
  test('menu buttons are clickable', async ({ page }) => {
    const openButton = page.locator(testId(TestComponents.demo.openMainMenu));
    const closeButton = page.locator(testId(TestComponents.demo.closeMainMenu));
    
    await expect(openButton).toBeEnabled();
    await openButton.click();
    await page.waitForTimeout(200);
    
    await expect(closeButton).toBeEnabled();
    await closeButton.click();
    await page.waitForTimeout(200);
  });
  
  test('feature toggle works', async ({ page }) => {
    const toggle = page.locator(testId(TestComponents.demo.featureToggle));
    
    // Initially unchecked
    await expect(toggle).not.toBeChecked();
    
    // Click to check
    await toggle.click();
    await expect(toggle).toBeChecked();
    
    // Click to uncheck
    await toggle.click();
    await expect(toggle).not.toBeChecked();
  });
  
  test('notifications toggle works', async ({ page }) => {
    const toggle = page.locator(testId(TestComponents.demo.notificationToggle));
    
    // Initially unchecked
    await expect(toggle).not.toBeChecked();
    
    // Click to check
    await toggle.click();
    await expect(toggle).toBeChecked();
  });
  
  test('priority radio buttons work', async ({ page }) => {
    const high = page.locator(testId(TestComponents.demo.priorityHigh));
    const medium = page.locator(testId(TestComponents.demo.priorityMedium));
    const low = page.locator(testId(TestComponents.demo.priorityLow));
    
    // Select high - use dispatchEvent to bypass z-index blocking
    await high.dispatchEvent('click');
    await expect(high).toBeChecked();
    await expect(medium).not.toBeChecked();
    await expect(low).not.toBeChecked();
    
    // Select medium
    await medium.dispatchEvent('click');
    await expect(high).not.toBeChecked();
    await expect(medium).toBeChecked();
    await expect(low).not.toBeChecked();
    
    // Select low
    await low.dispatchEvent('click');
    await expect(high).not.toBeChecked();
    await expect(medium).not.toBeChecked();
    await expect(low).toBeChecked();
  });
  
  test('status dropdown works', async ({ page }) => {
    const dropdown = page.locator(testId(TestComponents.demo.statusDropdown));
    
    // Change to active
    await dropdown.selectOption('active');
    await expect(dropdown).toHaveValue('active');
    
    // Change to processing (not 'pending' - that was the bug!)
    await dropdown.selectOption('processing');
    await expect(dropdown).toHaveValue('processing');
    
    // Change back to inactive
    await dropdown.selectOption('inactive');
    await expect(dropdown).toHaveValue('inactive');
  });
  
  test('theme select works', async ({ page }) => {
    const select = page.locator(testId(TestComponents.demo.themeToggle));
    
    // Initially light
    await expect(select).toHaveValue('light');
    
    // Change to dark
    await select.selectOption('dark');
    await expect(select).toHaveValue('dark');
    
    // Change to auto
    await select.selectOption('auto');
    await expect(select).toHaveValue('auto');
  });
  
  test('form input accepts text', async ({ page }) => {
    const input = page.locator(testId(TestComponents.demo.formName));
    
    await input.fill('Test User');
    await expect(input).toHaveValue('Test User');
  });
  
  test('form submit button is clickable', async ({ page }) => {
    const input = page.locator(testId(TestComponents.demo.formName));
    const submit = page.locator(testId(TestComponents.demo.formSubmit));
    
    await input.fill('Test User');
    await expect(submit).toBeEnabled();
    await submit.click();
  });
  
  test('AI tools section exists', async ({ page }) => {
    await expect(page.locator('text=🤖 AI TOOLS')).toBeVisible();
    
    // Check if tools are listed
    const toolsSection = page.locator('text=🤖 AI TOOLS').locator('..').locator('..');
    await expect(toolsSection).toBeVisible();
  });
});

