/**
 * Debug test for blog navigation matching
 *
 * This test captures detailed tool matching logs to debug why
 * "open your users", "open agentic ux" etc. are matching wrong tools.
 */
import { test, expect } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';

const DEBUG_LOG_FILE = path.join(__dirname, '../debug-tool-matching.log');

test.describe('Blog Navigation Debug', () => {

  test.beforeEach(async ({ page }) => {
    // Clear previous debug log
    await fs.writeFile(DEBUG_LOG_FILE, '', 'utf8');

    // Capture console logs
    page.on('console', async (msg) => {
      const text = msg.text();
      await fs.appendFile(DEBUG_LOG_FILE, `[CONSOLE] ${text}\n`, 'utf8');
    });

    // Navigate to home page
    await page.goto('http://localhost:3011/');
    await page.waitForLoadState('networkidle');
  });

  test('Debug: "open your users" from home page', async ({ page }) => {
    await fs.appendFile(DEBUG_LOG_FILE, '\n=== TEST: "open your users" from home page ===\n\n', 'utf8');

    // Type the command
    const input = page.locator('textarea[placeholder*="Ask"], input[placeholder*="Ask"]').first();
    await input.fill('open your users');

    // Submit
    await input.press('Enter');

    // Wait a bit for logs
    await page.waitForTimeout(2000);

    // Capture current URL
    const currentUrl = page.url();
    await fs.appendFile(DEBUG_LOG_FILE, `\nFinal URL: ${currentUrl}\n`, 'utf8');

    // EXPECTED: Should NOT navigate to Stories
    // EXPECTED: Should show "No matching command found" OR stay on home page
    await fs.appendFile(DEBUG_LOG_FILE, `Expected: Should NOT be /stories\nActual: ${currentUrl}\n`, 'utf8');
  });

  test('Debug: "open agentic ux" from home page', async ({ page }) => {
    await fs.appendFile(DEBUG_LOG_FILE, '\n=== TEST: "open agentic ux" from home page ===\n\n', 'utf8');

    const input = page.locator('textarea[placeholder*="Ask"], input[placeholder*="Ask"]').first();
    await input.fill('open agentic ux');
    await input.press('Enter');
    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    await fs.appendFile(DEBUG_LOG_FILE, `\nFinal URL: ${currentUrl}\n`, 'utf8');
    await fs.appendFile(DEBUG_LOG_FILE, `Expected: Should NOT be /stories\nActual: ${currentUrl}\n`, 'utf8');
  });

  test('Debug: "open 80% less" from home page', async ({ page }) => {
    await fs.appendFile(DEBUG_LOG_FILE, '\n=== TEST: "open 80% less" from home page ===\n\n', 'utf8');

    const input = page.locator('textarea[placeholder*="Ask"], input[placeholder*="Ask"]').first();
    await input.fill('open 80% less');
    await input.press('Enter');
    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    await fs.appendFile(DEBUG_LOG_FILE, `\nFinal URL: ${currentUrl}\n`, 'utf8');
    await fs.appendFile(DEBUG_LOG_FILE, `Expected: Should NOT be /stories\nActual: ${currentUrl}\n`, 'utf8');
  });

  test('Debug: "open agentic ux" from blog page', async ({ page }) => {
    await fs.appendFile(DEBUG_LOG_FILE, '\n=== TEST: "open agentic ux" from /blog page ===\n\n', 'utf8');

    // First navigate to blog
    await page.goto('http://localhost:3011/blog');
    await page.waitForLoadState('networkidle');

    const input = page.locator('textarea[placeholder*="Ask"], input[placeholder*="Ask"]').first();
    await input.fill('open agentic ux');
    await input.press('Enter');
    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    await fs.appendFile(DEBUG_LOG_FILE, `\nFinal URL: ${currentUrl}\n`, 'utf8');
    await fs.appendFile(DEBUG_LOG_FILE, `Expected: Should be /blog/agentic-ux or similar\nActual: ${currentUrl}\n`, 'utf8');
  });

  test.afterEach(async () => {
    // Read and output the log file
    const logs = await fs.readFile(DEBUG_LOG_FILE, 'utf8');
    console.log('\n=== DEBUG LOG FILE CONTENTS ===\n');
    console.log(logs);
    console.log('\n=== END DEBUG LOG ===\n');
  });
});
