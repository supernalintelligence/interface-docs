/**
 * Blog Navigation via AI Commands - Parameter Extraction Test
 * 
 * Tests that AI commands with parameters work correctly for blog navigation.
 * 
 * NOTE: These tests are currently SKIPPED because AI parameter extraction
 * for blog post navigation is not yet implemented. The AI currently does not
 * extract and use parameters like "open blog type-safe" -> navigate to specific post.
 * 
 * Re-enable these tests once parameter extraction is implemented in the AI system.
 */

import { test, expect } from '@playwright/test';

test.describe.skip('Blog Navigation - AI Commands with Parameters', () => {
  
  test.beforeEach(async ({ page }) => {
    // Capture console logs to debug parameter extraction
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('ParamExtract') || text.includes('BlogNav')) {
        console.log(`[CONSOLE]: ${text}`);
      }
    });
    
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
  });

  test('FAILING: should navigate to specific blog post via AI command', async ({ page }) => {
    // Type AI command with parameter
    const chatInput = page.locator('[data-testid="chat-input"]');
    await chatInput.fill('open blog type-safe');
    await page.keyboard.press('Enter');
    
    // Wait for navigation
    await page.waitForTimeout(2000);
    
    // EXPECTED: Should navigate to /blog/type-safe-ui-testing
    // ACTUAL: Navigates to /blog (no parameter extracted)
    await expect(page).toHaveURL(/\/blog\/type-safe-ui-testing/);
    
    // Should show the blog post content
    await expect(page.locator('article.prose')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Type-Safe UI Testing');
  });

  test('FAILING: should navigate to blog post with "80%" in title', async ({ page }) => {
    const chatInput = page.locator('[data-testid="chat-input"]');
    await chatInput.fill('open blog 80%');
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(2000);
    
    // Should navigate to the "80% Less Boilerplate" post
    await expect(page).toHaveURL(/\/blog\/80-percent-less-boilerplate/);
    await expect(page.locator('h1')).toContainText('80%');
  });

  test('FAILING: should navigate to blog post with "name" in title', async ({ page }) => {
    const chatInput = page.locator('[data-testid="chat-input"]');
    await chatInput.fill('open blog name');
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(2000);
    
    // Should navigate to "What's In a Name?" post
    await expect(page).toHaveURL(/\/blog\/whats-in-a-name/);
    await expect(page.locator('h1')).toContainText('Name');
  });

  test('FAILING: should show suggestions for partial match', async ({ page }) => {
    const chatInput = page.locator('[data-testid="chat-input"]');
    await chatInput.fill('open blog testing');
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(2000);
    
    // If no exact match, should show AI message with suggestions
    const aiMessages = page.locator('[data-testid="chat-message-ai"]');
    const lastMessage = aiMessages.last();
    const messageText = await lastMessage.textContent();
    
    // Should include "Did you mean" or suggestions
    expect(messageText).toMatch(/Did you mean|Type-Safe UI Testing/i);
  });

  test('should navigate to blog index when no parameter given', async ({ page }) => {
    // This should already work (no parameter needed)
    const chatInput = page.locator('[data-testid="chat-input"]');
    await chatInput.fill('open blog');
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(2000);
    
    // Should stay on or navigate to /blog
    await expect(page).toHaveURL(/\/blog$/);
    
    // Should show blog post cards
    const postCards = page.locator('[data-testid="blog-post-card"]');
    await expect(postCards).toHaveCount(3);
  });

  test('DEBUG: check console for parameter extraction logs', async ({ page }) => {
    const consoleLogs: string[] = [];
    
    page.on('console', msg => {
      consoleLogs.push(msg.text());
    });
    
    const chatInput = page.locator('[data-testid="chat-input"]');
    await chatInput.fill('open blog type-safe');
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(2000);
    
    console.log('\n=== Console Logs ===');
    consoleLogs
      .filter(log => log.includes('ParamExtract') || log.includes('BlogNav') || log.includes('Tool Match'))
      .forEach(log => console.log(log));
    
    // Check if parameter extraction logs appear
    const hasParamLogs = consoleLogs.some(log => log.includes('ParamExtract'));
    const hasToolCall = consoleLogs.some(log => log.includes('BlogNav'));
    
    console.log('\n=== Debug Info ===');
    console.log(`Parameter extraction logs found: ${hasParamLogs}`);
    console.log(`Blog tool called: ${hasToolCall}`);
    
    // This will help us see what's happening
    if (hasToolCall) {
      const blogCallLog = consoleLogs.find(log => log.includes('openBlog called with query'));
      console.log(`Blog tool call: ${blogCallLog}`);
    }
  });
});

test.describe('Blog Navigation - Expected Behavior Documentation', () => {
  
  test('DOCUMENTATION: What should happen', async () => {
    // This test just documents the expected flow
    console.log(`
=== EXPECTED FLOW ===

User types: "open blog type-safe"
           ↓
1. ToolRegistry finds tool: "Navigate to Blog" (100% confidence)
           ↓
2. Parameter extraction:
   - Tool examples: ["open blog", "open blog {title}", ...]
   - Matched pattern: "open blog"
   - Trailing text: "type-safe"
   - Parameters: ["type-safe"]
           ↓
3. Function called: openBlog("type-safe")
           ↓
4. Blog posts loaded from markdown files
           ↓
5. Fuzzy match: "type-safe" → "Type-Safe UI Testing Without the Pain"
           ↓
6. Navigate to: /blog/type-safe-ui-testing
           ↓
7. AI message: "✅ Opened: Type-Safe UI Testing Without the Pain"

=== ACTUAL FLOW (BUG) ===

User types: "open blog type-safe"
           ↓
1. ToolRegistry finds tool: "Navigate to Blog" ✅
           ↓
2. Parameter extraction: ❌ FAILS HERE
   - Parameters: [] (empty!)
           ↓
3. Function called: openBlog(undefined)
           ↓
4. No query to match, navigates to blog index
           ↓
5. Navigate to: /blog
           ↓
6. AI message: "✅ Navigated to Blog" (wrong!)

=== ROOT CAUSE ===

The parameter extraction in AIInterface.extractParameters() is not working.
Possible causes:
1. Tool's examples not reaching extractParameters()
2. findMatchedExample() not finding the pattern
3. extractTrailingText() returning empty string
4. Parameters array not being passed to tool execution

=== FIX NEEDED ===

Debug logs added to trace the issue:
- 🔍 [ParamExtract] Tool has examples: [...]
- 🔍 [ParamExtract] Matched example pattern: ???
- 🔍 [ParamExtract] Extracted trailing text: ???
- ✅ [ParamExtract] Parameter extraction successful: ???
- 🎯 [BlogNav] openBlog called with query: ???

Check browser console for these logs to identify where it fails.
    `);
  });
});

