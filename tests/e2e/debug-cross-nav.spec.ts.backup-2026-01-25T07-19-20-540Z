import { test, expect } from '@playwright/test';

test('Debug cross-container navigation', async ({ page }) => {
  // Capture console logs
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Navigation') || text.includes('Container') || text.includes('Tool Match')) {
      console.log(`[CONSOLE]: ${text}`);
    }
  });
  
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
  
  // Go to Dashboard
  await page.click('[data-testid="nav-dashboard"]');
  await page.waitForTimeout(500);
  
  console.log('\n=== SENDING "open menu" FROM DASHBOARD ===\n');
  
  // Type "open menu"
  const input = page.locator('[data-testid="chat-input"]');
  await input.fill('open menu');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);
  
  // Get AI response
  const aiMessages = page.locator('[data-testid="chat-message-ai"]');
  const lastMessage = aiMessages.last();
  const text = await lastMessage.textContent();
  
  console.log(`\n=== AI RESPONSE: "${text}" ===\n`);
  
  // Check what page we're on
  const onDemo = await page.locator('[data-testid="demo-title"]').isVisible().catch(() => false);
  const onDashboard = await page.locator('[data-testid="dashboard-title"]').isVisible().catch(() => false);
  
  console.log(`On Demo: ${onDemo}, On Dashboard: ${onDashboard}`);
});

