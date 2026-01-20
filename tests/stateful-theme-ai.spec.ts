import { test, expect, getBaseURL } from './fixtures';
import { TestRoutes, TestComponents } from './test-constants';
import { testId } from '@supernal/interface/testing';

// Stateful demo testids
const StatefulDemo = {
  container: 'stateful-widgets-container',
  themeSelect: 'stateful-theme-select'
};

test.describe('Stateful Demo - AI Theme Control', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoStateful}`);
    
    // Wait for page to be interactive
    await page.waitForLoadState('networkidle');
    
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('should bind DemoWidgetTools instance methods', async ({ page }) => {
    // Set up console listener BEFORE navigating
    const allLogs: string[] = [];
    
    page.on('console', (msg) => {
      const text = msg.text();
      allLogs.push(text);
      console.log('[BROWSER]', text); // Also log to test output
    });
    
    // Navigate to page
    await page.goto(`${getBaseURL()}${TestRoutes.demoStateful}`);
    await page.waitForLoadState('networkidle');
    
    // Wait a bit for module initialization
    await page.waitForTimeout(2000);
    
    // Check for binding logs
    const bindingLogs = allLogs.filter(log => 
      log.includes('Binding instance for:') || 
      log.includes('Bound ') || 
      log.includes('[StatefulPage]')
    );
    
    console.log('All logs count:', allLogs.length);
    console.log('Binding-related logs:', bindingLogs);
    
    // Should see binding logs
    expect(bindingLogs.length).toBeGreaterThan(0);
  });

  test('should change theme via AI command', async ({ page }) => {
    // Log ALL console messages to see what's happening
    page.on('console', (msg) => console.log('[BROWSER]', msg.text()));
    
    // Get the theme select element
    const themeSelect = page.locator(testId(StatefulDemo.themeSelect));
    
    // Initial theme should be light (default)
    await expect(themeSelect).toHaveValue('light');
    
    // Find AI input and submit "theme dark" command
    const aiInput = page.locator(testId(TestComponents.chat.input));
    await aiInput.fill('theme dark');
    
    console.log('Submitting "theme dark" command...');
    await page.locator(testId(TestComponents.chat.sendButton)).click();
    
    // Wait for command to process
    await page.waitForTimeout(2000);
    
    // Check if theme changed
    await expect(themeSelect).toHaveValue('dark');
    
    // Try changing back
    await aiInput.fill('theme light');
    await page.locator(testId(TestComponents.chat.sendButton)).click();
    await page.waitForTimeout(1000);
    
    await expect(themeSelect).toHaveValue('light');
  });

  test('should persist theme after refresh', async ({ page }) => {
    // Change theme via AI
    const aiInput = page.locator(testId(TestComponents.chat.input));
    await aiInput.fill('theme dark');
    await page.locator(testId(TestComponents.chat.sendButton)).click();
    await page.waitForTimeout(1000);
    
    // Verify it changed
    const themeSelect = page.locator(testId(StatefulDemo.themeSelect));
    await expect(themeSelect).toHaveValue('dark');
    
    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Theme should still be dark (persisted)
    const themeSelectAfter = page.locator(testId(StatefulDemo.themeSelect));
    await expect(themeSelectAfter).toHaveValue('dark');
  });
});
