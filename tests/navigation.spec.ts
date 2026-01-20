import { test, expect } from '@playwright/test';
import { testId, testIdContains } from '@supernal/interface/testing';
import { Chat } from '../../src/architecture/DemoComponentNames';
import { TestRoutes } from './test-constants';

test.describe('Navigation via AI Commands', () => {
  
  test.beforeEach(async ({ page }) => {
    // Start from the simple demo page
    await page.goto(TestRoutes.demoSimple);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000); // Let everything initialize
  });

  test('should navigate to dashboard', async ({ page }) => {
    // Type command in chat using name contracts
    const chatInput = page.locator(testId(Chat.input));
    await chatInput.fill('dashboard');
    
    const sendButton = page.locator(testId(Chat.sendButton));
    await sendButton.click();
    
    // Wait for navigation
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    
    // Verify we're on dashboard
    expect(page.url()).toContain('/dashboard');
    
    // Verify success message appeared
    const messages = page.locator(testIdContains('chat-message'));
    await expect(messages.last()).toContainText(/Navigated|Dashboard/i);
  });

  test('should navigate to blog', async ({ page }) => {
    const chatInput = page.locator(testId(Chat.input));
    await chatInput.fill('blog');
    
    const sendButton = page.locator(testId(Chat.sendButton));
    await sendButton.click();
    
    // Wait for navigation
    await page.waitForURL('**/blog', { timeout: 5000 });
    
    expect(page.url()).toContain('/blog');
    
    const messages = page.locator(testIdContains('chat-message'));
    await expect(messages.last()).toContainText(/Navigated|Blog/i);
  });

  test('should navigate to examples', async ({ page }) => {
    const chatInput = page.locator(testId(Chat.input));
    await chatInput.fill('examples');
    
    const sendButton = page.locator(testId(Chat.sendButton));
    await sendButton.click();
    
    await page.waitForURL('**/examples', { timeout: 5000 });
    expect(page.url()).toContain('/examples');
  });

  test('should navigate from blog to dashboard', async ({ page }) => {
    // First go to blog
    await page.goto(TestRoutes.blog);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
    
    // Then navigate to dashboard via AI
    const chatInput = page.locator(testId(Chat.input));
    await chatInput.fill('dashboard');
    
    const sendButton = page.locator(testId(Chat.sendButton));
    await sendButton.click();
    
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    expect(page.url()).toContain('/dashboard');
  });
});
