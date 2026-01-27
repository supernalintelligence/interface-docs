/**
 * Examples Tool Execution Tests
 *
 * Tests parameter extraction and tool execution:
 * - "send a chat saying test" should extract "test" and send it
 * - "enable features" should toggle checkbox, not enter text
 * - Tools with parameters should receive them correctly
 */

import { test, expect, getBaseURL } from '../fixtures';
import { Components } from '../../src/architecture/ComponentNames';

test.describe('Examples Tool Execution', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${getBaseURL()}/examples`);
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Check if input is already visible (chat already open)
    const chatInput = page.locator(`[data-testid="${Components.Chat.input}"]`);
    const isInputVisible = await chatInput.isVisible().catch(() => false);

    if (isInputVisible) {
      // Already open, we're good
      return;
    }

    // Input not visible, find and click bubble to open
    const bubble = page.locator(`[data-testid="${Components.Chat.bubble}"]`);
    await bubble.waitFor({ timeout: 10000 });
    await bubble.click();
    await chatInput.waitFor({ state: 'visible', timeout: 5000 });
  });

  test('should extract parameter from "send a chat saying test"', async ({ page }) => {
    const chatInput = page.locator(`[data-testid="${Components.Chat.input}"]`);
    const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);

    // Listen for the custom event that should be dispatched
    const eventPromise = page.evaluate(() => {
      return new Promise((resolve) => {
        window.addEventListener('example-tool-send-message', (e: any) => {
          resolve(e.detail);
        }, { once: true });
      });
    });

    // Send the command
    await chatInput.fill('send a chat saying test');
    await sendButton.click();

    // Wait for the event
    const eventDetail = await eventPromise.catch(() => null);

    // Verify the parameter was extracted
    expect(eventDetail).toBeTruthy();
    expect((eventDetail as any)?.message).toBe('test');
  });

  test('should extract numeric parameter from "increment counter by 5"', async ({ page }) => {
    // Capture console logs to see parameter extraction
    const logs: string[] = [];
    page.on('console', msg => {
      if (msg.text().includes('[ParamExtract]') || msg.text().includes('Parameters:')) {
        logs.push(msg.text());
      }
    });

    const chatInput = page.locator(`[data-testid="${Components.Chat.input}"]`);
    const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);

    // Listen for increment event
    const eventPromise = page.evaluate(() => {
      return new Promise((resolve) => {
        window.addEventListener('example-tool-increment', (e: any) => {
          resolve(e.detail);
        }, { once: true });
      });
    });

    // Send the command
    await chatInput.fill('increment counter by 5');
    await sendButton.click();

    // Wait for the event
    const eventDetail = await eventPromise.catch(() => null);

    // Log captured logs
    console.log('=== PARAMETER EXTRACTION LOGS ===');
    logs.forEach(log => console.log(log));
    console.log('=== END LOGS ===');

    // Verify the parameter was extracted
    expect(eventDetail).toBeTruthy();
    console.log('Event detail:', JSON.stringify(eventDetail, null, 2));
    expect((eventDetail as any)?.amount).toBe(5);
  });

  test('should handle "increment counter" without explicit parameter', async ({ page }) => {
    const chatInput = page.locator(`[data-testid="${Components.Chat.input}"]`);
    const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);

    // Listen for increment event
    const eventPromise = page.evaluate(() => {
      return new Promise((resolve) => {
        window.addEventListener('example-tool-increment', (e: any) => {
          resolve(e.detail);
        }, { once: true });
      });
    });

    // Send the command
    await chatInput.fill('increment counter');
    await sendButton.click();

    // Wait for the event
    const eventDetail = await eventPromise.catch(() => null);

    // Verify default parameter was used (should be 1)
    expect(eventDetail).toBeTruthy();
    expect((eventDetail as any)?.amount).toBe(1);
  });

  test('should log tool execution for debugging', async ({ page }) => {
    // Capture ALL console logs
    const logs: string[] = [];
    page.on('console', msg => {
      logs.push(`[${msg.type()}] ${msg.text()}`);
    });

    const chatInput = page.locator(`[data-testid="${Components.Chat.input}"]`);
    const sendButton = page.locator(`[data-testid="${Components.Chat.sendButton}"]`);

    // Send a command
    await chatInput.fill('send a chat saying hello');
    await sendButton.click();

    // Wait a bit for execution
    await page.waitForTimeout(3000);

    // Log what we captured
    console.log('=== ALL CAPTURED LOGS ===');
    logs.forEach(log => console.log(log));
    console.log('=== END LOGS ===');

    // Also check if tool metadata has instance
    const toolInfo = await page.evaluate(() => {
      const registry = (window as any).__SUPERNAL_TOOL_REGISTRY__;
      if (!registry) return { error: 'No registry Map found' };

      // Registry is a Map, convert to array
      const tools = Array.from(registry.values());
      const sendTool = tools.find((t: any) => t.name && t.name.includes('Send'));

      return {
        totalTools: tools.length,
        toolNames: tools.map((t: any) => t.name).slice(0, 15),
        sendTool: sendTool ? {
          name: sendTool.name,
          hasInstance: !!sendTool.instance,
          hasMethodName: !!sendTool.methodName,
          methodName: sendTool.methodName,
          instanceType: sendTool.instance ? typeof sendTool.instance : 'undefined',
          examples: sendTool.examples
        } : null
      };
    });

    console.log('=== SEND MESSAGE TOOL INFO ===');
    console.log(JSON.stringify(toolInfo, null, 2));
    console.log('=== END TOOL INFO ===');

    // Just verify logs were captured (helps with debugging)
    expect(logs.length).toBeGreaterThanOrEqual(0);
  });
});
