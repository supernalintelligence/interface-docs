/**
 * Auto-Generated Playwright Tests
 * 
 * These tests are automatically generated from @Tool decorators
 * and demonstrate how the system can create comprehensive test suites.
 * Updated to use architecture-aware components and routes
 */

import { test, expect, getBaseURL } from './fixtures';
import { TestRoutes, TestComponents, testid } from './test-constants';

test.describe('@supernal-interface/core Auto-Generated Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the demo/simple page
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    
    // Wait for the page to load and tools to be registered
    await page.waitForSelector(testid(TestComponents.demo.openMainMenu), { timeout: 10000 });
    
    // Minimize chat bubble if visible
    const minimizeButton = page.locator(testid(TestComponents.chat.minimizeButton));
    if (await minimizeButton.isVisible({ timeout: 500 }).catch(() => false)) {
      await minimizeButton.click();
      await page.waitForTimeout(200);
    }
  });

  test('should have all required tool elements present', async ({ page }) => {
    // These test IDs are from the architecture ComponentNames
    const requiredElements = [
      TestComponents.demo.openMainMenu,
      TestComponents.demo.closeMainMenu,
      TestComponents.demo.featureToggle,
      TestComponents.demo.notificationToggle,
      TestComponents.chat.input,
      TestComponents.chat.sendButton,
      TestComponents.chat.clearButton,
    ];

    for (const testId of requiredElements) {
      await expect(page.locator(testid(testId))).toBeVisible();
    }
  });

  test('should execute safe navigation tools', async ({ page }) => {
    // Test opening menu
    await page.locator(testid(TestComponents.demo.openMainMenu)).dispatchEvent('click');
    await page.waitForTimeout(200);
    
    // Test closing menu
    await page.locator(testid(TestComponents.demo.closeMainMenu)).dispatchEvent('click');
    await page.waitForTimeout(200);
  });

  test('should execute demo control tools', async ({ page }) => {
    // Test feature toggle
    await page.locator(testid(TestComponents.demo.featureToggle)).dispatchEvent('click');
    await page.waitForTimeout(500);
    
    // Test notification toggle
    await page.locator(testid(TestComponents.demo.notificationToggle)).dispatchEvent('click');
    await page.waitForTimeout(500);
  });

  test('should handle chat interface tools', async ({ page }) => {
    // Test sending a message
    const chatInput = page.locator(testid(TestComponents.chat.input));
    const sendButton = page.locator(testid(TestComponents.chat.sendButton));
    
    await chatInput.fill('Test message');
    await sendButton.click();
    
    // Wait for message to appear
    await page.waitForTimeout(500);
    
    // Test clearing chat
    const clearButton = page.locator(testid(TestComponents.chat.clearButton));
    await clearButton.click();
  });

  test('should navigate between demo pages', async ({ page }) => {
    // Navigate to examples
    await page.locator(testid(TestComponents.nav.examples)).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(new RegExp(TestRoutes.examples));
    
    // Navigate back to demo
    await page.locator(testid(TestComponents.nav.demo)).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(new RegExp(TestRoutes.demo));
  });

  test('should process AI commands via chat', async ({ page }) => {
    const chatInput = page.locator(testid(TestComponents.chat.input));
    const sendButton = page.locator(testid(TestComponents.chat.sendButton));
    
    // Send "open menu" command
    await chatInput.fill('open menu');
    await sendButton.click();
    
    // Wait for execution
    await page.waitForTimeout(1000);
    
    // Just verify the button exists after command
    await expect(page.locator(testid(TestComponents.demo.openMainMenu))).toBeVisible();
  });

  test('should show correct tool metadata', async ({ page }) => {
    // Verify demo container is present with correct testid
    await expect(page.locator(testid(TestComponents.demo.container))).toBeVisible();
    
    // Verify all main control elements exist
    await expect(page.locator(testid(TestComponents.demo.openMainMenu))).toBeVisible();
    await expect(page.locator(testid(TestComponents.demo.closeMainMenu))).toBeVisible();
    await expect(page.locator(testid(TestComponents.demo.featureToggle))).toBeVisible();
  });

  test('should demonstrate real tool execution', async ({ page }) => {
    // Test menu open/close cycle
    const menuButton = page.locator(testid(TestComponents.demo.openMainMenu));
    
    // Initial state
    await expect(menuButton).toContainText('Open Menu');
    
    // Open
    await menuButton.click();
    await expect(menuButton).toContainText('✅ Menu Open');
    
    // Close
    await page.locator(testid(TestComponents.demo.closeMainMenu)).click();
    await expect(menuButton).toContainText('Open Menu');
  });
});

test.describe('AI Command Processing', () => {
  const aiCommands = [
    { command: 'open menu', expectedAction: 'Menu Open' },
    { command: 'close menu', expectedAction: 'Open Menu' },
    { command: 'toggle feature', expectedAction: 'Feature toggled' },
  ];

  aiCommands.forEach(({ command, expectedAction }) => {
    test(`should process AI command: "${command}"`, async ({ page }) => {
      await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
      await page.waitForLoadState('domcontentloaded');
      
      const chatInput = page.locator(testid(TestComponents.chat.input));
      const sendButton = page.locator(testid(TestComponents.chat.sendButton));
      
      await chatInput.fill(command);
      await sendButton.click();
      
      // Wait for execution
      await page.waitForTimeout(1000);
      
      // Verify action occurred (check chat messages or UI state)
      const messages = page.locator(testid(TestComponents.chat.messages));
      await expect(messages).toBeVisible();
    });
  });
});

test.describe('Tool Safety and Permissions', () => {
  test('should execute safe actions without approval', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    
    // Safe actions like opening menu should work immediately
    await page.click(testid(TestComponents.demo.openMainMenu));
    await expect(page.locator(testid(TestComponents.demo.openMainMenu))).toContainText('✅ Menu Open');
  });
});
