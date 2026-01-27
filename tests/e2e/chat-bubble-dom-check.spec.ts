/**
 * Check if chat input exists in DOM at all
 */

import { test, getBaseURL } from '../fixtures';
import { ComponentNames } from '../../src/architecture/ComponentNames';

test('Check if chat input exists in DOM', async ({ page }) => {
  await page.goto(`${getBaseURL()}/demo/simple`);

  await page.waitForTimeout(3000);

  // Check all elements with data-testid containing 'chat'
  const chatElements = await page.locator('[data-testid*="chat"]').all();
  console.log(`Found ${chatElements.length} elements with 'chat' in test ID`);

  for (const el of chatElements) {
    const testId = await el.getAttribute('data-testid');
    const tag = await el.evaluate(e => e.tagName);
    const visible = await el.isVisible().catch(() => false);
    console.log(`- [${testId}] <${tag}> visible=${visible}`);
  }

  // Check all textareas
  const textareas = await page.locator('textarea').all();
  console.log(`\nFound ${textareas.length} textareas`);

  for (const ta of textareas) {
    const testId = await ta.getAttribute('data-testid');
    const visible = await ta.isVisible().catch(() => false);
    const placeholder = await ta.getAttribute('placeholder');
    console.log(`- textarea testid="${testId}" visible=${visible} placeholder="${placeholder}"`);
  }

  // Try to get the full chat bubble container HTML
  const bubbleHTML = await page.locator('[data-testid="chat-bubble"]').evaluate(el => {
    // Get parent to see the full structure
    return el.parentElement?.outerHTML || el.outerHTML;
  }).catch(() => 'not found');

  console.log('\nChat bubble container HTML:');
  console.log(bubbleHTML.substring(0, 2000));
});
