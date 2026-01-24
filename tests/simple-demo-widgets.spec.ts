/**
 * Playwright Tests: Simple Demo Widgets
 * 
 * Tests widget functionality using STATE CONTRACTS instead of UI checks.
 * Verifies:
 * 1. State changes when widgets are interacted with
 * 2. State matches expected values (behavior, not presentation)
 * 3. Widgets properly update the state manager
 */

import { test, expect, getBaseURL } from './fixtures';
import { TestRoutes, TestComponents, testid } from './test-constants';
import { assertDemoState, getDemoState, waitForDemoState } from './state-helpers';
import { testId } from '@supernal/interface/testing';

test.describe('Simple Demo - Widget State Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demo}`);
    await page.waitForTimeout(1000);
    
    // Minimize chat bubble TWICE to ensure it stays minimized
    const minimizeButton = page.locator(testId(TestComponents.chat.minimizeButton));
    for (let i = 0; i < 2; i++) {
      if (await minimizeButton.isVisible({ timeout: 500 }).catch(() => false)) {
        await minimizeButton.click();
        await page.waitForTimeout(200);
      }
    }
  });
  
  test('initial state is default', async ({ page }) => {
    // Verify default state
    await assertDemoState(page, {
      menuOpen: false,
      featureEnabled: false,
      notificationsEnabled: false,
      priority: 'medium',
      status: 'inactive',
      theme: 'light',
    });
  });
  
  test('menu buttons update state', async ({ page }) => {
    const openButton = page.locator(testId(TestComponents.demo.openMainMenu));
    const closeButton = page.locator(testId(TestComponents.demo.closeMainMenu));
    
    // Verify initial state
    await assertDemoState(page, { menuOpen: false });
    
    // Open menu
    await openButton.click({ force: true });
    await assertDemoState(page, { menuOpen: true });
    
    // Close menu
    await closeButton.click({ force: true });
    await assertDemoState(page, { menuOpen: false });
  });
  
  test('feature toggle updates state', async ({ page }) => {
    const toggle = page.locator(testId(TestComponents.demo.featureToggle));
    
    // Initially disabled
    await assertDemoState(page, { featureEnabled: false });
    
    // Enable feature
    await toggle.click({ force: true });
    await waitForDemoState(page, state => state.featureEnabled === true);
    await assertDemoState(page, { featureEnabled: true });
    
    // Disable feature
    await toggle.click({ force: true });
    await waitForDemoState(page, state => state.featureEnabled === false);
    await assertDemoState(page, { featureEnabled: false });
  });
  
  test('notifications toggle updates state', async ({ page }) => {
    const toggle = page.locator(testId(TestComponents.demo.notificationToggle));
    
    // Initially disabled
    await assertDemoState(page, { notificationsEnabled: false });
    
    // Enable notifications
    await toggle.click({ force: true });
    await waitForDemoState(page, state => state.notificationsEnabled === true);
    await assertDemoState(page, { notificationsEnabled: true });
  });
  
  test('priority radio buttons update state', async ({ page }) => {
    const high = page.locator(testId(TestComponents.demo.priorityHigh));
    const medium = page.locator(testId(TestComponents.demo.priorityMedium));
    const low = page.locator(testId(TestComponents.demo.priorityLow));
    
    // Default is medium
    await assertDemoState(page, { priority: 'medium' });
    
    // Select high - use dispatchEvent to ensure onChange fires
    await high.dispatchEvent('click');
    await waitForDemoState(page, state => state.priority === 'high');
    await assertDemoState(page, { priority: 'high' });
    
    // Select low
    await low.dispatchEvent('click');
    await waitForDemoState(page, state => state.priority === 'low');
    await assertDemoState(page, { priority: 'low' });
    
    // Select medium
    await medium.dispatchEvent('click');
    await waitForDemoState(page, state => state.priority === 'medium');
    await assertDemoState(page, { priority: 'medium' });
  });
  
  test('status dropdown updates state', async ({ page }) => {
    const dropdown = page.locator(testId(TestComponents.demo.statusDropdown));
    
    // Default is inactive
    await assertDemoState(page, { status: 'inactive' });
    
    // Change to active
    await dropdown.selectOption('active');
    await waitForDemoState(page, state => state.status === 'active');
    await assertDemoState(page, { status: 'active' });
    
    // Change to processing
    await dropdown.selectOption('processing');
    await waitForDemoState(page, state => state.status === 'processing');
    await assertDemoState(page, { status: 'processing' });
    
    // Change to complete
    await dropdown.selectOption('complete');
    await waitForDemoState(page, state => state.status === 'complete');
    await assertDemoState(page, { status: 'complete' });
  });
  
  test('theme select updates state', async ({ page }) => {
    const select = page.locator(testId(TestComponents.demo.themeToggle));
    
    // Default is light
    await assertDemoState(page, { theme: 'light' });
    
    // Change to dark
    await select.selectOption('dark');
    await waitForDemoState(page, state => state.theme === 'dark');
    await assertDemoState(page, { theme: 'dark' });
  });
  
  test('multiple state changes work together', async ({ page }) => {
    // Change multiple states using dispatchEvent to bypass z-index issues
    await page.locator(testId(TestComponents.demo.featureToggle)).dispatchEvent('click');
    await page.locator(testId(TestComponents.demo.priorityHigh)).dispatchEvent('click');
    await page.locator(testId(TestComponents.demo.statusDropdown)).selectOption('active');
    
    // Wait for all changes
    await waitForDemoState(page, state => 
      state.featureEnabled === true &&
      state.priority === 'high' &&
      state.status === 'active'
    );
    
    // Verify all changes persisted
    const state = await getDemoState(page);
    expect(state.featureEnabled).toBe(true);
    expect(state.priority).toBe('high');
    expect(state.status).toBe('active');
  });
  
  test('widgets are visible and interactive', async ({ page }) => {
    // Quick sanity check that widgets render
    // (Main testing is via state, but we verify UI exists)
    await expect(page.locator(testId(TestComponents.demo.openMainMenu))).toBeVisible();
    await expect(page.locator(testId(TestComponents.demo.featureToggle))).toBeVisible();
    await expect(page.locator(testId(TestComponents.demo.priorityMedium))).toBeVisible();
    await expect(page.locator(testId(TestComponents.demo.statusDropdown))).toBeVisible();
    await expect(page.locator(testId(TestComponents.demo.themeToggle))).toBeVisible();
  });
});
