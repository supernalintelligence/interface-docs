/**
 * Debug test to check ChatBubble click behavior
 */

import { test, expect, getBaseURL } from '../fixtures';
import { ComponentNames } from '../../src/architecture/ComponentNames';

test('ChatBubble expands when clicked', async ({ page }) => {
  // Enable console logging
  const logs: string[] = [];
  page.on('console', msg => logs.push(msg.text()));

  await page.goto(`${getBaseURL()}/demo/simple`);

  // Wait for chat bubble using ComponentNames
  const bubble = page.locator(`[data-testid="${ComponentNames.Chat.bubble}"]`);
  await bubble.waitFor({ timeout: 10000 });

  console.log('Bubble found, taking screenshot before click...');
  await page.screenshot({ path: 'test-results/before-click.png' });

  // Check if input is visible before click
  const chatInput = page.locator(`[data-testid="${ComponentNames.Chat.input}"]`);
  const visibleBefore = await chatInput.isVisible().catch(() => false);
  console.log('Chat input visible before click:', visibleBefore);

  // Click the bubble with force
  console.log('Clicking bubble...');
  await bubble.click({ force: true });

  await page.waitForTimeout(2000);

  console.log('Taking screenshot after click...');
  await page.screenshot({ path: 'test-results/after-click.png' });

  // Check if input is visible after click
  const visibleAfter = await chatInput.isVisible().catch(() => false);
  console.log('Chat input visible after click:', visibleAfter);

  console.log('Console logs:', logs.filter(l => l.includes('Chat') || l.includes('expand')));

  // Log the HTML of the chat area
  const chatHTML = await page.locator('[data-testid="chat-bubble"]').evaluate(el => el.outerHTML).catch(() => 'not found');
  console.log('Chat bubble HTML:', chatHTML.substring(0, 500));

  expect(visibleAfter).toBe(true);
});
