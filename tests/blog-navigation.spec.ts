import { test, expect } from '@playwright/test';
import { testId } from '@supernal/interface/testing';
import { Chat } from '../../src/architecture/DemoComponentNames';
import { TestRoutes } from './test-constants';

test.describe('Blog Post Navigation', () => {
  
  test('should navigate to specific blog post by title keywords', async ({ page }) => {
    const consoleLogs: string[] = [];
    
    // Capture console logs
    page.on('console', (msg) => {
      const text = msg.text();
      consoleLogs.push(text);
      if (text.includes('BlogNav') || text.includes('ParamExtract') || text.includes('Match')) {
        console.log(`[BROWSER]: ${text}`);
      }
    });
    
    // Go to any page (blog tools are global)
    await page.goto(TestRoutes.demoSimple);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
    
    // Type command with blog post keywords
    const chatInput = page.locator(testId(Chat.input));
    await chatInput.fill('open blog type-safe');
    console.log('✓ Typed "open blog type-safe" into chat input');
    
    // Click send
    const sendButton = page.locator(testId(Chat.sendButton));
    await sendButton.click();
    console.log('✓ Clicked send button');
    
    // Wait for navigation
    await page.waitForURL('**/blog/**', { timeout: 5000 });
    
    // Verify we're on a specific blog post page (not just /blog index)
    const url = page.url();
    console.log('✓ Final URL:', url);
    expect(url).toContain('/blog/');
    expect(url).not.toBe('/blog'); // Should be on specific post
    
    // Check console logs for parameter extraction
    const paramLogs = consoleLogs.filter(log => log.includes('ParamExtract'));
    console.log('\n=== PARAMETER EXTRACTION LOGS ===');
    console.log(paramLogs.join('\n'));
    console.log('=================================\n');
    
    // Verify parameter was extracted
    const extractedParam = paramLogs.find(log => log.includes('type-safe'));
    expect(extractedParam).toBeTruthy();
  });
  
  test('should navigate to blog post with different keywords', async ({ page }) => {
    await page.goto(TestRoutes.demoSimple);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
    
    const chatInput = page.locator(testId(Chat.input));
    await chatInput.fill('show blog boilerplate');
    
    const sendButton = page.locator(testId(Chat.sendButton));
    await sendButton.click();
    
    // Should navigate to "80% Less Boilerplate" post
    await page.waitForURL('**/blog/**', { timeout: 5000 });
    
    const url = page.url();
    expect(url).toContain('/blog/');
    expect(url).not.toBe('/blog');
  });
  
  test('should show suggestions if no exact match', async ({ page }) => {
    await page.goto(TestRoutes.demoSimple);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
    
    const chatInput = page.locator(testId(Chat.input));
    await chatInput.fill('open blog xyz123notreal');
    
    const sendButton = page.locator(testId(Chat.sendButton));
    await sendButton.click();
    
    // Should show error/suggestion message
    await page.waitForTimeout(1000);
    
    // Check for AI response with suggestions
    const messages = page.locator('[data-testid*="chat-message"]');
    const lastMessage = messages.last();
    await expect(lastMessage).toContainText(/No.*found|Did you mean/i);
  });
});
