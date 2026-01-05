import { test, expect } from '@playwright/test';

test('Check actual AI response in chat', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
  
  const input = page.locator('[data-testid="chat-input"]');
  await input.fill('open menu');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  
  // Get AI response messages
  const aiMessages = page.locator('[data-testid="chat-message-ai"]');
  const count = await aiMessages.count();
  
  console.log(`\nFound ${count} AI messages:`);
  for (let i = 0; i < count; i++) {
    const text = await aiMessages.nth(i).textContent();
    console.log(`  AI[${i}]: ${text}`);
  }
  
  // Get LAST AI message
  const lastAI = aiMessages.last();
  const responseText = await lastAI.textContent();
  
  console.log(`\n=== LAST AI RESPONSE ===`);
  console.log(responseText);
  console.log(`========================\n`);
  
  // Check for error
  if (responseText?.includes('toLowerCase')) {
    throw new Error(`❌ toLowerCase error: ${responseText}`);
  }
  
  if (responseText?.includes('undefined')) {
    throw new Error(`❌ undefined error: ${responseText}`);
  }
});

