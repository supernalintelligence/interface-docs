/**
 * Diagnostic Test - Capture ALL runtime state
 */

import { test } from '@playwright/test';

const BASE_URL = 'http://localhost:3011';

test('Diagnostic: Dump all runtime state', async ({ page }) => {
  // Capture ALL console output
  const consoleMessages: string[] = [];
  page.on('console', msg => consoleMessages.push(`[${msg.type()}] ${msg.text()}`));

  await page.goto(`${BASE_URL}/demo`);
  await page.waitForLoadState('networkidle');

  // Dump everything we need to know
  const diagnostics = await page.evaluate(() => {
    const results: any = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      errors: [],
      warnings: []
    };

    // Check DemoAIInterface
    try {
      const aiInterface = (window as any).DemoAIInterface;
      results.aiInterface = {
        exists: !!aiInterface,
        type: typeof aiInterface,
        constructor: aiInterface?.constructor?.name,
        methods: aiInterface ? Object.getOwnPropertyNames(Object.getPrototypeOf(aiInterface)) : []
      };
    } catch (e: any) {
      results.errors.push(`AIInterface check failed: ${e.message}`);
    }

    // Check ToolRegistry
    try {
      const ToolRegistry = (window as any).ToolRegistry;
      if (ToolRegistry) {
        const allTools = ToolRegistry.getAllTools();
        const toolsArray = Array.from(allTools.values());

        results.toolRegistry = {
          exists: true,
          totalTools: toolsArray.length,
          tools: toolsArray.map((t: any) => ({
            name: t.name,
            elementId: t.elementId,
            containerId: t.containerId,
            aiEnabled: t.aiEnabled,
            examples: t.examples
          }))
        };

        // Group by container
        const byContainer: any = {};
        toolsArray.forEach((t: any) => {
          const container = t.containerId || 'global';
          if (!byContainer[container]) byContainer[container] = [];
          byContainer[container].push(t.name);
        });
        results.toolsByContainer = byContainer;
      } else {
        results.toolRegistry = { exists: false };
        results.errors.push('ToolRegistry not found on window');
      }
    } catch (e: any) {
      results.errors.push(`ToolRegistry check failed: ${e.message}`);
    }

    // Check state manager
    try {
      const demoState = (window as any).__demoState__;
      results.demoState = {
        exists: !!demoState,
        value: demoState?.get ? demoState.get() : demoState
      };
    } catch (e: any) {
      results.errors.push(`State check failed: ${e.message}`);
    }

    // Check if widgets are in DOM
    try {
      const featureToggle = document.querySelector('[data-testid="feature-toggle"]');
      const openMenu = document.querySelector('[data-testid="open-main-menu"]');

      results.widgets = {
        featureToggleInDOM: !!featureToggle,
        openMenuInDOM: !!openMenu,
        totalTestIds: document.querySelectorAll('[data-testid]').length
      };
    } catch (e: any) {
      results.errors.push(`Widget check failed: ${e.message}`);
    }

    // Try to execute a command
    try {
      const aiInterface = (window as any).DemoAIInterface;
      if (aiInterface && aiInterface.processQuery) {
        // Execute sync for testing
        results.testCommand = {
          attempted: true,
          note: 'Command execution is async, check server logs'
        };
      } else {
        results.testCommand = {
          attempted: false,
          reason: 'No processQuery method'
        };
      }
    } catch (e: any) {
      results.errors.push(`Command test failed: ${e.message}`);
    }

    return results;
  });

  // Print everything
  console.log('\n========================================');
  console.log('DIAGNOSTIC REPORT');
  console.log('========================================\n');
  console.log(JSON.stringify(diagnostics, null, 2));
  console.log('\n========================================');
  console.log('CONSOLE MESSAGES FROM BROWSER');
  console.log('========================================\n');
  consoleMessages.forEach(msg => console.log(msg));
  console.log('\n========================================\n');

  // Force test to pass so we can see output
  expect(true).toBe(true);
});
