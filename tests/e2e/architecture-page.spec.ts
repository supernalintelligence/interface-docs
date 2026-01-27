import { test, expect, getBaseURL } from '../fixtures';
import { Components } from '../../src/architecture/ComponentNames';

test.describe('Architecture Page', () => {
  test('should navigate to architecture page and load graph', async ({ page }) => {
    // Go to home page
    await page.goto(getBaseURL());
    
    // Click the Architecture nav button
    await page.locator(`[data-testid="${Components.GlobalNav.architecture}"]`).click();
    
    // Wait for architecture page to load
    await expect(page).toHaveURL(/.*architecture/);
    
    // Check for page title
    await expect(page.locator('h1')).toContainText('Architecture');
    
    // Wait for the test page status to update
    const statusElement = page.locator('text=/Status:/').locator('..').locator('p');
    
    // Should show "Initializing..." first
    await expect(statusElement).toBeVisible({ timeout: 5000 });
    
    // Then should progress to "Testing imports..." or show results
    await expect(statusElement).not.toContainText('Initializing', { timeout: 10000 });
    
    // Should eventually show either success or error (not stuck on "Initializing")
    const finalStatus = await statusElement.textContent();
    console.log('Final status:', finalStatus);
    
    // Check if it succeeded or failed
    if (finalStatus?.includes('✅')) {
      // Success case - verify graph data is shown
      await expect(page.locator('text=/Graph built/')).toBeVisible();
      await expect(page.locator('text=/Total Nodes:/')).toBeVisible();
      
      // Take screenshot of success
      await page.screenshot({ path: 'test-results/architecture-success.png', fullPage: true });
      
      console.log('✅ Architecture page loaded successfully with graph data');
    } else if (finalStatus?.includes('❌')) {
      // Failure case - capture the error
      const errorText = await statusElement.textContent();
      console.error('❌ Architecture page error:', errorText);
      
      // Take screenshot of error
      await page.screenshot({ path: 'test-results/architecture-error.png', fullPage: true });
      
      // Fail the test with the error message
      throw new Error(`Architecture page failed to load: ${errorText}`);
    } else {
      // Stuck on "Initializing" or unknown state
      await page.screenshot({ path: 'test-results/architecture-stuck.png', fullPage: true });
      throw new Error(`Architecture page stuck in unknown state: ${finalStatus}`);
    }
  });
  
  test('should display debug info', async ({ page }) => {
    await page.goto(`${getBaseURL()}/architecture`);
    
    // Wait for page to load
    await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });
    
    // Check for debug section
    const debugSection = page.locator('text=/Debug Info:/').locator('..');
    await expect(debugSection).toBeVisible();
    
    // Get console logs
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.text().includes('[ArchitectureGraph]')) {
        consoleMessages.push(`${msg.type()}: ${msg.text()}`);
      }
    });
    
    // Wait a bit for any console logs
    await page.waitForTimeout(3000);
    
    // Log console messages
    if (consoleMessages.length > 0) {
      console.log('Console messages:');
      consoleMessages.forEach(msg => console.log('  ', msg));
    } else {
      console.log('No [ArchitectureGraph] console messages found - component may not be rendering');
    }
  });
  
  test('should verify @supernal-interface/core exports', async ({ page }) => {
    await page.goto(`${getBaseURL()}/architecture`);
    
    // Wait for the test to run
    await page.waitForTimeout(5000);
    
    // Evaluate what's actually exported from the core package
    const coreExports = await page.evaluate(async () => {
      try {
        const core = await import('@supernal-interface/core');
        return {
          hasArchitectureGraph: 'ArchitectureGraph' in core,
          hasLiveArchitectureGraph: 'LiveArchitectureGraph' in core,
          hasGraphBuilder: 'GraphBuilder' in core,
          exportCount: Object.keys(core).length,
          exportNames: Object.keys(core).slice(0, 20) // First 20 exports
        };
      } catch (error) {
        return { error: error instanceof Error ? error.message : String(error) };
      }
    });
    
    console.log('Core package exports:', JSON.stringify(coreExports, null, 2));
    
    // Verify critical exports exist
    expect(coreExports).toHaveProperty('hasGraphBuilder', true);
    expect(coreExports).toHaveProperty('exportCount');
    expect((coreExports as any).exportCount).toBeGreaterThan(0);
  });
});

