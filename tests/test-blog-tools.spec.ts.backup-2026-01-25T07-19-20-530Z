/**
 * Debug test to check what tools are actually registered
 */

import { test } from '@playwright/test';

test('debug: check blog tools registration', async ({ page }) => {
  await page.goto('http://localhost:3011/blog');
  await page.waitForLoadState('networkidle');

  // Get all registered tools
  const toolsInfo = await page.evaluate(() => {
    const { ToolRegistry } = (window as any).require('@supernal/interface/browser');
    const allTools = Array.from(ToolRegistry.getAllTools().values());

    return {
      totalTools: allTools.length,
      blogTools: allTools.filter((t: any) =>
        t.containerId === '/blog' ||
        t.containerId === 'Blog' ||
        t.name?.toLowerCase().includes('blog')
      ).map((t: any) => ({
        name: t.name,
        containerId: t.containerId,
        examples: t.examples,
        aiEnabled: t.aiEnabled
      })),
      navigationContext: {
        currentContext: (window as any).__SUPERNAL_NAVIGATION_GRAPH__?.getCurrentContext?.(),
        currentRoute: (window as any).__SUPERNAL_NAVIGATION_GRAPH__?.getCurrentRoute?.()
      }
    };
  });

  console.log('=== BLOG TOOLS DEBUG ===');
  console.log('Total tools:', toolsInfo.totalTools);
  console.log('Blog-related tools:', JSON.stringify(toolsInfo.blogTools, null, 2));
  console.log('Navigation context:', toolsInfo.navigationContext);
});
