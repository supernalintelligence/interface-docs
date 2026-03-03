import { test, expect, getBaseURL } from '../fixtures';

test.describe('Architecture Page Debug', () => {
  test('should load and display hierarchical graph', async ({ page }) => {
    // Capture ALL console logs for debugging
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      consoleLogs.push(msg.text());
    });

    // Navigate to architecture page
    await page.goto(`${getBaseURL()}/`);
    await page.waitForLoadState('networkidle');
    
    // Click architecture link
    const archLink = page.locator('[data-testid="nav-architecture"]');
    await expect(archLink).toBeVisible();
    await archLink.click();
    
    // Wait for graph to load
    await page.waitForTimeout(3000);
    
    // Filter for GraphBuilder logs only
    const builderLogs = consoleLogs.filter(log => log.includes('[GraphBuilder]'));
    console.log('\n=== ALL GRAPHBUILDER LOGS ===');
    builderLogs.forEach(log => console.log(log));
    
    // Take screenshot
    await page.screenshot({ 
      path: './tests/e2e/screenshots/architecture-debug.png',
      fullPage: true 
    });
    
    // Check stats
    const statsText = await page.locator('p:has-text("Containers:")').textContent();
    console.log('\n=== STATS ===');
    console.log(statsText);
  });
});
