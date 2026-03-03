import { test, expect } from '@playwright/test';

test('stateful demo theme change via AI', async ({ page }) => {
  // Enable console logging
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  // Navigate to stateful demo
  await page.goto('http://localhost:3001/demo/stateful');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Wait a bit for client-side hydration and tool registration
  await page.waitForTimeout(2000);
  
  // Type "theme dark" command
  const input = page.locator('input[placeholder*="command"]').first();
  await input.fill('theme dark');
  await input.press('Enter');
  
  // Wait for execution
  await page.waitForTimeout(1000);
  
  // Check if theme changed
  const container = page.locator('[data-theme]').first();
  const theme = await container.getAttribute('data-theme');
  
  console.log('Theme after command:', theme);
  expect(theme).toBe('dark');
});

