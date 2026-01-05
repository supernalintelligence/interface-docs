import { test, expect } from '@playwright/test';

test.describe('Post-Migration Site Functionality', () => {
  
  test('Architecture page loads and shows visualization', async ({ page }) => {
    await page.goto('http://localhost:3000/architecture');
    
    // Check page loaded
    await expect(page.locator('h1, h2')).toContainText(/architecture/i);
    
    // Architecture visualization should be present (not stub message)
    await expect(page.locator('text=temporarily disabled')).not.toBeVisible();
    
    // Should have some visualization content
    await expect(page.locator('[class*="architecture"], [class*="graph"], svg, canvas')).toBeVisible({ timeout: 10000 });
  });

  test('Chat bubble is present and functional', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Chat bubble should exist
    const chatBubble = page.locator('[data-testid*="chat"], [class*="chat-bubble"], button:has-text("Chat")').first();
    await expect(chatBubble).toBeVisible({ timeout: 5000 });
  });

  test('Navigation between pages works', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Navigate to dashboard
    await page.click('a:has-text("Dashboard"), [href="/dashboard"]');
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Navigate to architecture
    await page.click('a:has-text("Architecture"), [href="/architecture"]');
    await expect(page).toHaveURL(/.*architecture/);
    
    // Navigate to examples
    await page.click('a:has-text("Examples"), [href="/examples"]');
    await expect(page).toHaveURL(/.*examples/);
  });

  test('Tools are registered and visible', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Check console for tool registration messages
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      if (msg.text().includes('Registered Tool')) {
        consoleMessages.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Should have registered some tools
    expect(consoleMessages.length).toBeGreaterThan(0);
  });

  test('Blog pages still work after migration', async ({ page }) => {
    await page.goto('http://localhost:3000/blog');
    
    // Blog index should load
    await expect(page.locator('h1, h2')).toContainText(/blog|posts/i);
    
    // Should have blog post links
    const blogLinks = page.locator('a[href^="/blog/"]');
    await expect(blogLinks.first()).toBeVisible();
    
    // Click first blog post
    await blogLinks.first().click();
    
    // Blog post should load
    await expect(page.locator('article, main')).toBeVisible();
  });
});

