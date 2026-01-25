/**
 * Global Theme Tools Tests
 * 
 * Tests for theme tools that work from ANY page without navigation
 */

import { test, expect, getBaseURL } from '../fixtures';
import { Components } from '../../src/architecture';

test.describe('Global Theme Tools', () => {
  test.beforeEach(async ({ page }) => {
    // Start on a non-Demo page (e.g., Docs) to verify global tools work everywhere
    await page.goto(getBaseURL());
    await page.click(`[data-testid="${Components.GlobalNav.docs}"]`);
    await page.waitForSelector('h1:has-text("Documentation")');
  });

  test('should execute "dark mode" command from Docs page without navigation', async ({ page }) => {
    // Type "dark mode" in chat
    await page.fill(`[data-testid="${Components.Chat.input}"]`, 'dark mode');
    await page.click(`[data-testid="${Components.Chat.sendButton}"]`);
    
    // Wait for AI response
    await page.waitForSelector('text=Theme changed to dark', { timeout: 5000 });
    
    // Verify theme attribute changed
    const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(newTheme).toBe('dark');
    
    // Verify we're still on Docs page (no navigation occurred)
    await expect(page.locator('h1:has-text("Documentation")')).toBeVisible();
  });

  test('should execute "light mode" command to revert theme', async ({ page }) => {
    // Set to dark first
    await page.fill(`[data-testid="${Components.Chat.input}"]`, 'dark mode');
    await page.click(`[data-testid="${Components.Chat.sendButton}"]`);
    await page.waitForSelector('text=Theme changed to dark');
    
    // Then set to light
    await page.fill(`[data-testid="${Components.Chat.input}"]`, 'light mode');
    await page.click(`[data-testid="${Components.Chat.sendButton}"]`);
    await page.waitForSelector('text=Theme changed to light', { timeout: 5000 });
    
    // Verify theme attribute
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('light');
  });

  test('should find theme tools with various command phrases', async ({ page }) => {
    const commands = [
      'dark mode',
      'set theme dark',
      'switch to dark',
      'dark theme',
      'theme dark'
    ];

    for (const command of commands) {
      // Reset to light
      await page.fill(`[data-testid="${Components.Chat.input}"]`, 'light mode');
      await page.click(`[data-testid="${Components.Chat.sendButton}"]`);
      await page.waitForTimeout(1000);
      
      // Try the command
      await page.fill(`[data-testid="${Components.Chat.input}"]`, command);
      await page.click(`[data-testid="${Components.Chat.sendButton}"]`);
      
      // Should succeed with any of these phrases - get last message
      await expect(page.locator('[data-testid="chat-message-ai"]:has-text("Theme changed to dark")').last()).toBeVisible({ timeout: 3000 });
    }
  });

  test('should work from Dashboard page (test true global availability)', async ({ page }) => {
    // Navigate to Dashboard
    await page.click(`[data-testid="${Components.GlobalNav.dashboard}"]`);
    await page.waitForSelector('h1:has-text("Dashboard")');
    
    // Execute theme command
    await page.fill(`[data-testid="${Components.Chat.input}"]`, 'dark mode');
    await page.click(`[data-testid="${Components.Chat.sendButton}"]`);
    
    // Should work without error
    await page.waitForSelector('text=Theme changed to dark', { timeout: 5000 });
    
    // Verify we're still on Dashboard
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
  });

  test('should work from Examples page', async ({ page }) => {
    // Navigate to Examples
    await page.click(`[data-testid="${Components.GlobalNav.examples}"]`);
    await page.waitForSelector('text=Examples');
    
    // Execute theme command
    await page.fill(`[data-testid="${Components.Chat.input}"]`, 'light mode');
    await page.click(`[data-testid="${Components.Chat.sendButton}"]`);
    
    // Should work
    await page.waitForSelector('text=Theme changed to light', { timeout: 5000 });
  });

  test('should persist theme across page navigation', async ({ page }) => {
    // Set dark theme
    await page.fill(`[data-testid="${Components.Chat.input}"]`, 'dark mode');
    await page.click(`[data-testid="${Components.Chat.sendButton}"]`);
    await page.waitForSelector('text=Theme changed to dark');
    
    // Navigate to different pages
    await page.click(`[data-testid="${Components.GlobalNav.dashboard}"]`);
    await page.waitForTimeout(300);
    
    // Theme should still be dark
    let theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
    
    // Navigate again
    await page.click(`[data-testid="${Components.GlobalNav.demo}"]`);
    await page.waitForTimeout(300);
    
    // Theme should still be dark
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
  });

  test('should persist theme across page reload', async ({ page }) => {
    // Set dark theme
    await page.fill(`[data-testid="${Components.Chat.input}"]`, 'dark mode');
    await page.click(`[data-testid="${Components.Chat.sendButton}"]`);
    await page.waitForSelector('text=Theme changed to dark');
    
    // Wait longer for localStorage to be set
    await page.waitForTimeout(2000);
    
    // Verify theme is dark before reload
    let theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    // Theme should still be dark (loaded from localStorage)
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
  });

  test('should not navigate to Demo page when executing theme command', async ({ page }) => {
    // Ensure we're on Docs
    await page.click(`[data-testid="${Components.GlobalNav.docs}"]`);
    await page.waitForSelector('h1:has-text("Documentation")');
    
    // Execute theme command
    await page.fill(`[data-testid="${Components.Chat.input}"]`, 'dark mode');
    await page.click(`[data-testid="${Components.Chat.sendButton}"]`);
    await page.waitForSelector('text=Theme changed to dark');
    
    // Should still be on Docs
    await expect(page.locator('h1:has-text("Documentation")')).toBeVisible();
  });

  test('should show error for single-word "dark" or "light" commands', async ({ page }) => {
    // Test "dark" alone
    await page.fill(`[data-testid="${Components.Chat.input}"]`, 'dark');
    await page.click(`[data-testid="${Components.Chat.sendButton}"]`);
    
    // Should show error message - look for user message since error comes from simple.tsx
    await expect(page.locator('[class*="chat-message"]:has-text("No matching command")').last()).toBeVisible({ timeout: 3000 });
    
    // Clear chat to try again
    await page.waitForTimeout(500);
    
    // Test "light" alone
    await page.fill(`[data-testid="${Components.Chat.input}"]`, 'light');
    await page.click(`[data-testid="${Components.Chat.sendButton}"]`);
    
    // Should show error message
    await expect(page.locator('[class*="chat-message"]:has-text("No matching command")').last()).toBeVisible({ timeout: 3000 });
  });
});

