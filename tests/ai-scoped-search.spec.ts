/**
 * E2E Tests for AI Scoped Tool Resolution
 * 
 * Tests that the AIInterface correctly prioritizes local (container-specific)
 * tools over global tools using the new searchScoped functionality.
 * 
 * NOTE: These tests are currently SKIPPED because window.DemoAIInterface
 * is not exposed in the current implementation. These tests should be
 * re-enabled once the AI tool resolution system is properly exposed.
 */

import { test, expect, getBaseURL } from './fixtures';
import { TestRoutes } from './test-constants';

test.describe.skip('AI Scoped Tool Resolution', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to examples page to have tools available
    await page.goto(`${getBaseURL()}${TestRoutes.examples}`);
    await page.waitForLoadState('networkidle');
  });

  test('Prioritizes local counter tools on Examples page', async ({ page }) => {
    // On /examples page, "increment" should match the local counter tool
    const result = await page.evaluate(() => {
      // @ts-ignore - AIInterface exists on window in demo
      const aiInterface = (window as any).DemoAIInterface;
      if (!aiInterface) return null;
      
      return aiInterface.findToolsForCommand('increment counter');
    });

    expect(result).toBeTruthy();
    expect(result.tool).toBeTruthy();
    
    // Should find the counter tool from Examples container
    expect(result.tool.containerId).toBe('Examples');
    expect(result.tool.componentName).toBe('counter');
    expect(result.tool.methodName).toBe('increment');
    
    console.log('✅ Found local counter tool:', {
      container: result.tool.containerId,
      component: result.tool.componentName,
      method: result.tool.methodName
    });
  });

  test('Global navigation tools accessible from any page', async ({ page }) => {
    // Navigate to dashboard
    await page.goto(`${getBaseURL()}${TestRoutes.dashboard}`);
    await page.waitForLoadState('networkidle');
    
    // Navigation tools should be available globally
    const result = await page.evaluate(() => {
      // @ts-ignore
      const aiInterface = (window as any).DemoAIInterface;
      if (!aiInterface) return null;
      
      return aiInterface.findToolsForCommand('go to examples');
    });

    expect(result).toBeTruthy();
    expect(result.tool).toBeTruthy();
    
    // Navigation tools should not have containerId (they're global)
    expect(result.tool.containerId).toBeUndefined();
    expect(result.tool.elementId).toContain('nav-');
  });

  test('Local tools take precedence over global tools with similar names', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.examples}`);
    await page.waitForLoadState('networkidle');
    
    // If there are both local and global "counter" related tools,
    // local should be prioritized
    const result = await page.evaluate(() => {
      // @ts-ignore
      const aiInterface = (window as any).DemoAIInterface;
      if (!aiInterface) return null;
      
      return aiInterface.findToolsForCommand('counter');
    });

    expect(result).toBeTruthy();
    expect(result.tool).toBeTruthy();
    
    // Should match local counter tool on Examples page
    if (result.tool.containerId) {
      expect(result.tool.containerId).toBe('Examples');
    }
  });

  test('Falls back to global tools when no local match exists', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.examples}`);
    await page.waitForLoadState('networkidle');
    
    // Theme toggle is a global tool - should be accessible from Examples page
    const result = await page.evaluate(() => {
      // @ts-ignore
      const aiInterface = (window as any).DemoAIInterface;
      if (!aiInterface) return null;
      
      return aiInterface.findToolsForCommand('toggle theme');
    });

    expect(result).toBeTruthy();
    expect(result.tool).toBeTruthy();
    
    // Theme tools should be global (no containerId)
    expect(result.tool.containerId).toBeUndefined();
  });

  test('Different containers have different tool contexts', async ({ page }) => {
    // Test on Examples page
    await page.goto(`${getBaseURL()}${TestRoutes.examples}`);
    await page.waitForLoadState('networkidle');
    
    const examplesResult = await page.evaluate(() => {
      // @ts-ignore
      const aiInterface = (window as any).DemoAIInterface;
      if (!aiInterface) return null;
      
      return aiInterface.findToolsForCommand('increment');
    });

    expect(examplesResult?.tool?.containerId).toBe('Examples');
    
    // Now test on a different page (e.g., dashboard)
    await page.goto(`${getBaseURL()}${TestRoutes.dashboard}`);
    await page.waitForLoadState('networkidle');
    
    const dashboardResult = await page.evaluate(() => {
      // @ts-ignore
      const aiInterface = (window as any).DemoAIInterface;
      if (!aiInterface) return null;
      
      return aiInterface.findToolsForCommand('increment');
    });

    // On dashboard, if there's no local "increment" tool, should not find one
    // OR should find a different increment tool specific to dashboard
    if (dashboardResult?.tool) {
      // If found, should be from a different container
      expect(dashboardResult.tool.containerId).not.toBe('Examples');
    }
  });

  test('searchScoped logs show container context', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.examples}`);
    await page.waitForLoadState('networkidle');
    
    // Listen for console logs
    const logs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('Scoped search')) {
        logs.push(msg.text());
      }
    });
    
    await page.evaluate(() => {
      // @ts-ignore
      const aiInterface = (window as any).DemoAIInterface;
      if (!aiInterface) return null;
      
      return aiInterface.findToolsForCommand('increment counter');
    });

    // Wait a bit for console logs to be captured
    await page.waitForTimeout(100);
    
    // Should see a log indicating scoped search with Examples container
    const hasContainerLog = logs.some(log => 
      log.includes('container: Examples') || log.includes('container: "Examples"')
    );
    
    expect(hasContainerLog).toBeTruthy();
  });

  test('Component-namespaced tool names are logged correctly', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.examples}`);
    await page.waitForLoadState('networkidle');
    
    const logs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('Tools:')) {
        logs.push(msg.text());
      }
    });
    
    await page.evaluate(() => {
      // @ts-ignore
      const aiInterface = (window as any).DemoAIInterface;
      if (!aiInterface) return null;
      
      return aiInterface.findToolsForCommand('increment counter');
    });

    await page.waitForTimeout(100);
    
    // Should see component.method format in logs (e.g., "counter.increment")
    const hasComponentName = logs.some(log => 
      log.includes('counter.increment') || log.includes('counter.')
    );
    
    expect(hasComponentName).toBeTruthy();
  });

  test('AI can execute local tools found via scoped search', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.examples}`);
    await page.waitForLoadState('networkidle');
    
    // Find the counter value before increment
    const initialValue = await page.locator('[data-testid="counter-value"]').textContent();
    expect(initialValue).toBeTruthy();
    const initialNum = parseInt(initialValue || '0', 10);
    
    // Execute increment via AI
    await page.evaluate(() => {
      // @ts-ignore
      const aiInterface = (window as any).DemoAIInterface;
      if (!aiInterface) return null;
      
      const command = aiInterface.findToolsForCommand('increment counter');
      if (command.tool) {
        // Execute the tool
        return aiInterface.executeToolMethod(command.tool, command.parameters || []);
      }
      return null;
    });

    // Wait for UI update
    await page.waitForTimeout(500);
    
    // Verify counter was incremented
    const newValue = await page.locator('[data-testid="counter-value"]').textContent();
    expect(newValue).toBeTruthy();
    const newNum = parseInt(newValue || '0', 10);
    
    expect(newNum).toBe(initialNum + 1);
  });
});

