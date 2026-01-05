import { test, expect } from '@playwright/test';
import { testId } from '@supernal-interface/core/testing';
import { Chat } from '../src/architecture/DemoComponentNames';

test.describe('Navigation Debug', () => {
  
  test('check if chat sends commands', async ({ page }) => {
    const consoleLogs: string[] = [];
    
    // Capture console logs
    page.on('console', (msg) => {
      const text = msg.text();
      consoleLogs.push(text);
      console.log(`[BROWSER]: ${text}`);
    });
    
    // Go to page
    await page.goto('/demo/simple');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Type command
    const chatInput = page.locator(testId(Chat.input));
    await chatInput.fill('dashboard');
    console.log('✓ Typed "dashboard" into chat input');
    
    // Click send
    const sendButton = page.locator(testId(Chat.sendButton));
    await sendButton.click();
    console.log('✓ Clicked send button');
    
    // Wait a bit for execution
    await page.waitForTimeout(2000);
    
    // Check if any AIInterface logs appeared
    const aiLogs = consoleLogs.filter(log => log.includes('AIInterface') || log.includes('Tool Match') || log.includes('NavHandler'));
    
    console.log('\n=== CONSOLE LOGS ===');
    console.log(aiLogs.join('\n'));
    console.log('===================\n');
    
    // Check if we have evidence of command execution
    expect(aiLogs.length).toBeGreaterThan(0);
  });
});

