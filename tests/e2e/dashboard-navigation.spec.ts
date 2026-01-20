/**
 * Dashboard Navigation Tests
 *
 * Tests:
 * - Dashboard navigation tool is globally available
 * - "open dashboard" works from blog page
 * - "open dashboard" works from examples page
 */

import { test, expect } from '@playwright/test';
import { Components } from '../../src/architecture/DemoComponentNames';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3011';

test.describe('Dashboard Navigation', () => {
  test('should find dashboard navigation tool from blog page', async ({ page }) => {
    // Navigate to blog page first
    await page.goto(`${BASE_URL}/blog`);
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Capture console logs
    const logs: string[] = [];
    page.on('console', msg => {
      logs.push(`[${msg.type()}] ${msg.text()}`);
    });

    // Wait for chat to be available
    await page.locator(`[data-testid="${Components.Chat.bubble}"]`).waitFor({ timeout: 30000 });

    // Expand chat if needed
    const chatInput = page.locator(`[data-testid="${Components.Chat.input}"]`);
    const isInputVisible = await chatInput.isVisible().catch(() => false);
    if (!isInputVisible) {
      await page.locator(`[data-testid="${Components.Chat.bubble}"]`).click();
      await chatInput.waitFor({ state: 'visible', timeout: 5000 });
    }

    // Try to navigate to dashboard
    await chatInput.fill('open dashboard');
    const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);
    await sendButton.click();

    // Wait for navigation or error
    await page.waitForTimeout(2000);

    // Log captured logs
    console.log('=== DASHBOARD NAVIGATION LOGS ===');
    logs.forEach(log => console.log(log));
    console.log('=== END LOGS ===');

    // Check if we navigated to dashboard
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);

    // Should have navigated to dashboard
    expect(currentUrl).toContain('/dashboard');
  });

  test('should show dashboard tool in global tools', async ({ page }) => {
    // Navigate to blog page
    await page.goto(`${BASE_URL}/blog`);
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Check available tools
    const toolInfo = await page.evaluate(() => {
      const registry = (window as any).__SUPERNAL_TOOL_REGISTRY__;
      if (!registry) return { error: 'No registry found' };

      const tools = Array.from(registry.values());

      // Find all navigation tools
      const navTools = tools.filter((t: any) =>
        t.name?.toLowerCase().includes('dashboard') ||
        t.description?.toLowerCase().includes('dashboard')
      );

      return {
        totalTools: tools.length,
        navigationTools: navTools.map((t: any) => ({
          name: t.name,
          containerId: t.containerId,
          toolType: t.toolType,
          examples: t.examples
        }))
      };
    });

    console.log('=== DASHBOARD TOOL INFO ===');
    console.log(JSON.stringify(toolInfo, null, 2));
    console.log('=== END TOOL INFO ===');

    // Should have at least one dashboard navigation tool
    expect(toolInfo.navigationTools.length).toBeGreaterThan(0);
  });
});
