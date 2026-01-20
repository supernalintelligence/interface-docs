/**
 * E2E Tests for Blog Navigation Tools
 * 
 * Tests the complete flow:
 * 1. User types command in chat
 * 2. AI interface executes tool
 * 3. NavigationGraph triggers navigation
 * 4. Browser navigates to correct page
 */

import { test, expect } from '@playwright/test';
import { Components } from '../../src/architecture/DemoComponentNames';

test.describe('Blog Navigation via Chat', () => {
  test.beforeEach(async ({ page }) => {
    // Start on home page (uses baseURL from config)
    await page.goto('/');
    
    // Wait for chat bubble to be available
    await page.locator(`[data-testid="${Components.Chat.bubble}"]`).waitFor({ timeout: 30000 });
    
    // Expand chat if collapsed
    const bubble = page.locator(`[data-testid="${Components.Chat.bubble}"]`);
    await bubble.click();
    
    // Wait for chat input to be visible
    await page.locator(`[data-testid="${Components.Chat.input}"]`).waitFor({ state: 'visible', timeout: 5000 });
  });

  test('should navigate to blog index with "open blog" command', async ({ page }) => {
    // Find chat input using Components.Chat.input
    const chatInput = page.locator(`[data-testid="${Components.Chat.input}"]`);
    await expect(chatInput).toBeVisible();

    // Type command
    await chatInput.fill('open blog');
    
    // Click send button using Components.Chat.sendButton
    const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);
    await sendButton.click();

    // Wait for navigation
    await page.waitForURL('**/blog', { timeout: 5000 });
    
    // Verify we're on blog page
    expect(page.url()).toContain('/blog');
    
    // Verify blog content loaded
    await expect(page.locator('h1, h2').filter({ hasText: /blog/i }).first()).toBeVisible();
  });

  test('should navigate to specific blog post with "open blog name contracts"', async ({ page }) => {
    const chatInput = page.locator(`[data-testid="${Components.Chat.input}"]`);
    await expect(chatInput).toBeVisible();

    await chatInput.fill('open blog name contracts');
    
    const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);
    await sendButton.click();

    // Wait for navigation to blog post
    await page.waitForURL('**/blog/**', { timeout: 5000 });
    
    // Verify we're on a blog post page (not just /blog)
    const url = page.url();
    expect(url).toContain('/blog/');
    expect(url).not.toBe('http://localhost:3015/blog');
    expect(url).not.toBe('http://localhost:3015/blog/');
  });

  test('should show error message for non-existent blog post', async ({ page }) => {
    const chatInput = page.locator(`[data-testid="${Components.Chat.input}"]`);
    await expect(chatInput).toBeVisible();

    await chatInput.fill('open blog nonexistent-post-xyz-123');
    
    const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);
    await sendButton.click();

    // Should show error message in chat
    await expect(page.locator('text=/No blog post found|No exact match/i')).toBeVisible({ timeout: 5000 });
  });

  test('should work from any page (global tool)', async ({ page }) => {
    // Navigate to examples page first
    await page.goto('/examples');
    await page.locator(`[data-testid="${Components.Chat.bubble}"]`).waitFor({ timeout: 30000 });
    
    // Expand chat
    const bubble = page.locator(`[data-testid="${Components.Chat.bubble}"]`);
    await bubble.click();
    await page.locator(`[data-testid="${Components.Chat.input}"]`).waitFor({ state: 'visible', timeout: 5000 });

    // Now try to navigate to blog from examples page
    const chatInput = page.locator(`[data-testid="${Components.Chat.input}"]`);
    await expect(chatInput).toBeVisible();

    await chatInput.fill('open blog');
    
    const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);
    await sendButton.click();

    // Should navigate from /examples to /blog
    await page.waitForURL('**/blog', { timeout: 5000 });
    expect(page.url()).toContain('/blog');
  });
});

test.describe('NavigationGraph Integration', () => {
  test('should have navigation handler registered', async ({ page }) => {
    await page.goto('/');
    await page.locator(`[data-testid="${Components.Chat.bubble}"]`).waitFor({ timeout: 30000 });

    // Check that NavigationGraph has a handler
    const hasHandler = await page.evaluate(() => {
      const key = '__SUPERNAL_NAVIGATION_GRAPH__';
      const nav = (window as any)[key];
      return nav && typeof nav.getNavigationHandler === 'function' && nav.getNavigationHandler() !== null;
    });

    expect(hasHandler).toBe(true);
  });

  test('should update LocationContext on navigation', async ({ page }) => {
    await page.goto('/');
    await page.locator(`[data-testid="${Components.Chat.bubble}"]`).waitFor({ timeout: 30000 });

    // Navigate to blog
    await page.goto('/blog');
    await page.waitForSelector('h1, h2', { timeout: 10000 });

    // Check LocationContext was updated
    const location = await page.evaluate(() => {
      const LocationContext = (window as any).__SUPERNAL_LOCATION_CONTEXT__;
      return LocationContext?.getCurrent?.();
    });

    expect(location).toBeTruthy();
    expect(location?.page).toContain('/blog');
  });
});
