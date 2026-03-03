/**
 * Comprehensive Widget Tests - ALL Interactive Widgets
 *
 * Tests every widget on the demo page using AI command execution
 */

import { test, expect } from '@playwright/test';
import { Components } from '../../src/architecture';

const BASE_URL = 'http://localhost:3011';

test.describe('All Demo Widgets - AI Command Execution', () => {
  test.beforeEach(async ({ page }) => {
    // Capture console messages
    page.on('console', msg => {
      if (msg.text().includes('UIWidgetComponents') || msg.text().includes('ToolRegistry') || msg.text().includes('registered')) {
        console.log('BROWSER:', msg.text());
      }
    });

    await page.goto(`${BASE_URL}/demo`);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector(`[data-testid="${Components.Demo.featureToggle}"]`);
  });

  // Helper to execute AI command
  async function executeCommand(page: any, command: string) {
    const result = await page.evaluate(async (cmd) => {
      const aiInterface = (window as any).DemoAIInterface;
      if (!aiInterface) return { error: 'No AI interface' };

      // Use processQuery - the correct API for executing commands
      const response = await aiInterface.processQuery(cmd);
      return response;
    }, command);

    await page.waitForTimeout(500); // Let UI update
    return result;
  }

  test('Open Menu button', async ({ page }) => {
    await executeCommand(page, 'open menu');

    const state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.menuOpen).toBe(true);
  });

  test('Close Menu button', async ({ page }) => {
    await executeCommand(page, 'open menu');
    await executeCommand(page, 'close menu');

    const state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.menuOpen).toBe(false);
  });

  test('Toggle Feature checkbox', async ({ page }) => {
    const checkbox = page.locator(`[data-testid="${Components.Demo.featureToggle}"]`);
    const initialChecked = await checkbox.isChecked();

    await executeCommand(page, 'toggle feature');

    const finalChecked = await checkbox.isChecked();
    expect(finalChecked).toBe(!initialChecked);

    const state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.featureEnabled).toBe(finalChecked);
  });

  test('Enable Feature checkbox', async ({ page }) => {
    const checkbox = page.locator(`[data-testid="${Components.Demo.featureToggle}"]`);

    await executeCommand(page, 'enable feature');

    expect(await checkbox.isChecked()).toBe(true);

    const state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.featureEnabled).toBe(true);
  });

  test('Disable Feature checkbox', async ({ page }) => {
    const checkbox = page.locator(`[data-testid="${Components.Demo.featureToggle}"]`);

    // First enable it
    await executeCommand(page, 'enable feature');

    // Then disable
    await executeCommand(page, 'disable feature');

    expect(await checkbox.isChecked()).toBe(false);

    const state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.featureEnabled).toBe(false);
  });

  test('Toggle Notifications checkbox', async ({ page }) => {
    const checkbox = page.locator(`[data-testid="${Components.Demo.notificationToggle}"]`);
    const initialChecked = await checkbox.isChecked();

    await executeCommand(page, 'toggle notifications');

    const finalChecked = await checkbox.isChecked();
    expect(finalChecked).toBe(!initialChecked);

    const state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.notificationsEnabled).toBe(finalChecked);
  });

  test('Enable Notifications', async ({ page }) => {
    const checkbox = page.locator(`[data-testid="${Components.Demo.notificationToggle}"]`);

    await executeCommand(page, 'enable notifications');

    expect(await checkbox.isChecked()).toBe(true);

    const state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.notificationsEnabled).toBe(true);
  });

  test('Set Priority to High', async ({ page }) => {
    const highRadio = page.locator(`[data-testid="${Components.Demo.priorityHigh}"]`);

    await executeCommand(page, 'set priority high');

    expect(await highRadio.isChecked()).toBe(true);

    const state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.priority).toBe('high');
  });

  test('Set Priority to Medium', async ({ page }) => {
    const mediumRadio = page.locator(`[data-testid="${Components.Demo.priorityMedium}"]`);

    await executeCommand(page, 'priority medium');

    expect(await mediumRadio.isChecked()).toBe(true);

    const state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.priority).toBe('medium');
  });

  test('Set Priority to Low', async ({ page }) => {
    const lowRadio = page.locator(`[data-testid="${Components.Demo.priorityLow}"]`);

    await executeCommand(page, 'change priority to low');

    expect(await lowRadio.isChecked()).toBe(true);

    const state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.priority).toBe('low');
  });

  test('Set Status to Active', async ({ page }) => {
    const select = page.locator(`[data-testid="${Components.Demo.statusDropdown}"]`);

    await executeCommand(page, 'set status active');

    expect(await select.inputValue()).toBe('active');

    const state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.status).toBe('active');
  });

  test('Change Status to Processing', async ({ page }) => {
    const select = page.locator(`[data-testid="${Components.Demo.statusDropdown}"]`);

    await executeCommand(page, 'change status to processing');

    expect(await select.inputValue()).toBe('processing');

    const state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.status).toBe('processing');
  });

  test('Set Status to Complete', async ({ page }) => {
    const select = page.locator(`[data-testid="${Components.Demo.statusDropdown}"]`);

    await executeCommand(page, 'status complete');

    expect(await select.inputValue()).toBe('complete');

    const state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.status).toBe('complete');
  });

  test('Set Theme to Dark', async ({ page }) => {
    const select = page.locator(`[data-testid="${Components.Demo.themeToggle}"]`);

    await executeCommand(page, 'set theme dark');

    expect(await select.inputValue()).toBe('dark');

    const state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.theme).toBe('dark');
  });

  test('Set Theme to Light', async ({ page }) => {
    const select = page.locator(`[data-testid="${Components.Demo.themeToggle}"]`);

    await executeCommand(page, 'theme light');

    expect(await select.inputValue()).toBe('light');

    const state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.theme).toBe('light');
  });

  test('Submit Form', async ({ page }) => {
    const formInput = page.locator(`[data-testid="${Components.Demo.formName}"]`);

    await formInput.fill('Test User');

    const result = await executeCommand(page, 'submit form');

    expect(result).toBeTruthy();
  });

  test('Multiple commands in sequence', async ({ page }) => {
    // Enable feature
    await executeCommand(page, 'enable feature');
    let state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.featureEnabled).toBe(true);

    // Set priority
    await executeCommand(page, 'set priority high');
    state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.priority).toBe('high');

    // Enable notifications
    await executeCommand(page, 'enable notifications');
    state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.notificationsEnabled).toBe(true);

    // Set status
    await executeCommand(page, 'set status active');
    state = await page.evaluate(() => (window as any).__demoState__.get());
    expect(state.status).toBe('active');

    // Verify all state changes persisted
    expect(state.featureEnabled).toBe(true);
    expect(state.priority).toBe('high');
    expect(state.notificationsEnabled).toBe(true);
    expect(state.status).toBe('active');
  });
});
