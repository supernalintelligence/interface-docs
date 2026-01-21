/**
 * AI Command Test
 * 
 * Test that AI commands work through the chat interface
 * Updated to use state contracts instead of UI text assertions
 */

import { test, expect, getBaseURL, expandChatBubble } from './fixtures';
import { TestRoutes, TestComponents } from './test-constants';
import { assertDemoState, waitForDemoState } from './state-helpers';

test.describe('AI Command Interface', () => {
  
  test('should be able to type in chat input', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);

    // Expand chat bubble to make input visible
    await expandChatBubble(page);

    // Find the chat input
    const chatInput = page.locator(`[data-testid="${TestComponents.chat.input}"]`);
    await expect(chatInput).toBeVisible({ timeout: 10000 });
    
    // Try to type in it
    await chatInput.fill('open menu');
    await expect(chatInput).toHaveValue('open menu');
    
    console.log('✅ Chat input accepts text');
  });

  test('should execute tool command via chat', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500); // Let state initialize

    // Verify initial state
    await assertDemoState(page, { menuOpen: false });

    // Expand chat bubble to make input visible
    await expandChatBubble(page);

    // Find chat components
    const chatInput = page.locator(`[data-testid="${TestComponents.chat.input}"]`);
    const sendButton = page.locator(`[data-testid="${TestComponents.chat.sendButton}"]`);

    await expect(chatInput).toBeVisible({ timeout: 10000 });
    
    // Send a command
    await chatInput.fill('open menu');
    await sendButton.click({ force: true }); // Force click to bypass z-index
    
    // Wait for state to change
    await waitForDemoState(page, state => state.menuOpen === true, { timeout: 3000 });
    
    // Verify state changed
    await assertDemoState(page, { menuOpen: true });
  });

  test('should open menu via chat command vs UI button', async ({ page }) => {
    await page.goto(`${getBaseURL()}${TestRoutes.demoSimple}`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500); // Let state initialize

    // Verify initial state
    await assertDemoState(page, { menuOpen: false });

    // Test 1: Open menu via UI button
    const uiMenuButton = page.locator(`[data-testid="${TestComponents.demo.openMainMenu}"]`);
    await expect(uiMenuButton).toBeVisible();
    await uiMenuButton.click({ force: true }); // Force click

    // Check state changed (not UI text!)
    await assertDemoState(page, { menuOpen: true });

    // Close menu
    const closeButton = page.locator(`[data-testid="${TestComponents.demo.closeMainMenu}"]`);
    await closeButton.click({ force: true }); // Force click
    await assertDemoState(page, { menuOpen: false });

    // Expand chat bubble to make input visible
    await expandChatBubble(page);

    // Test 2: Open menu via chat command
    const chatInput = page.locator(`[data-testid="${TestComponents.chat.input}"]`);
    const sendButton = page.locator(`[data-testid="${TestComponents.chat.sendButton}"]`);
    
    await chatInput.fill('open menu');
    await sendButton.click({ force: true }); // Force click
    
    // Wait and check state
    await waitForDemoState(page, state => state.menuOpen === true, { timeout: 3000 });
    await assertDemoState(page, { menuOpen: true });
    
    console.log('✅ Menu can be opened via both UI and chat');
  });
});
