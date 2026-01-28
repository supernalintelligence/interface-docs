/**
 * Orchestrator Pattern Examples
 *
 * This file demonstrates the TestDataOrchestrator pattern for test data
 * and state management. Compare with basic tests in demo-commands.spec.ts.
 *
 * Benefits of orchestrator pattern:
 * - Caching: Skip redundant setup on subsequent runs
 * - State Management: Capture and restore browser state
 * - Snapshots: Automatic snapshot capture for debugging
 * - Reproducibility: Seeded data generation for consistent tests
 *
 * @see docs/planning/test-data-integration-plan.md
 */

import { test, expect, getBaseURL, expandChatBubble } from '../fixtures';
import { Demo, Chat } from '../../src/architecture/ComponentNames';
import { TestDataOrchestrator } from '@supernal/interface-enterprise/testing';
import { StoryCache } from '@supernal/interface-enterprise/stories';

// Calculate source hash once for cache validation
const SOURCE_HASH = StoryCache.calculateMD5(__filename, true);

test.describe('Orchestrator Pattern Examples', () => {
  let orchestrator: TestDataOrchestrator;

  test.beforeEach(async ({ page }) => {
    orchestrator = new TestDataOrchestrator(page, {
      cacheDir: '.story-cache',
      dataDir: '.test-snapshots',
      debug: process.env.DEBUG === 'true',
    });
  });

  test.afterEach(async ({ }, testInfo) => {
    // Optionally capture snapshot after each test for debugging
    if (testInfo.status === 'passed' && process.env.CAPTURE_SNAPSHOTS === 'true') {
      await orchestrator.captureSnapshot(
        `after-${testInfo.title.replace(/\s+/g, '-').toLowerCase()}`,
        ['e2e', 'orchestrator-examples']
      );
    }
  });

  /**
   * Example 1: Basic Usage with Browser State Capture
   *
   * Demonstrates capturing browser state after setup for potential reuse.
   */
  test('capture browser state after page load', async ({ page }) => {
    // Navigate to page
    await page.goto(`${getBaseURL()}/demo/simple`);
    await page.waitForSelector(`[data-testid="${Demo.openMainMenu}"]`);

    // Capture browser state (URL, localStorage, sessionStorage)
    const browserState = await orchestrator.captureBrowserState();

    // Verify state was captured correctly
    expect(browserState.url).toContain('/demo/simple');
    expect(browserState.timestamp).toBeDefined();
  });

  /**
   * Example 2: Cache Check Pattern
   *
   * Demonstrates the cache-first pattern for skipping redundant setup.
   * On first run: executes full test, caches result
   * On subsequent runs: restores from cache if source unchanged
   */
  test('cache-first pattern for demo page setup', async ({ page }) => {
    const storyId = 'demo-simple-page-ready';

    // Check if we can restore from cache
    if (await orchestrator.isStoryValid(storyId, SOURCE_HASH)) {
      // Cache hit! Restore and skip setup
      await orchestrator.fromStory(storyId);
      console.log('✓ Restored from cache');
    } else {
      // Cache miss - execute full setup
      await page.goto(`${getBaseURL()}/demo/simple`);
      await page.waitForSelector(`[data-testid="${Demo.openMainMenu}"]`);
      await expandChatBubble(page);

      // Cache the result for future runs
      await orchestrator.captureAndCacheStory(storyId, SOURCE_HASH);
      console.log('✓ Cached for future runs');
    }

    // Now test from this cached state
    const chatInput = page.locator(`[data-testid="${Chat.input}"]`);
    await expect(chatInput).toBeVisible({ timeout: 5000 });
  });

  /**
   * Example 3: Snapshot-Based State Management
   *
   * Demonstrates using snapshots for state persistence across test runs.
   */
  test('snapshot capture and metadata', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/simple`);
    await page.waitForSelector(`[data-testid="${Demo.openMainMenu}"]`);

    // Capture a named snapshot with tags
    const snapshotId = await orchestrator.captureSnapshot('demo-simple-loaded', [
      'demo',
      'simple',
      'baseline',
    ]);

    expect(snapshotId).toBeDefined();

    // List all snapshots
    const snapshots = await orchestrator.listSnapshots();
    expect(snapshots.length).toBeGreaterThan(0);
  });

  /**
   * Example 4: Command Execution with State Tracking
   *
   * Shows orchestrator alongside normal test flow for chat commands.
   */
  test('chat command with orchestrator state tracking', async ({ page }) => {
    const storyId = 'demo-open-menu-command';

    // Setup: navigate and expand chat
    await page.goto(`${getBaseURL()}/demo/simple`);
    await page.waitForSelector(`[data-testid="${Demo.openMainMenu}"]`);
    await expandChatBubble(page);

    // Execute command
    const chatInput = page.locator(`[data-testid="${Chat.input}"]`);
    await expect(chatInput).toBeVisible({ timeout: 5000 });
    await chatInput.fill('open menu');
    await chatInput.press('Enter');

    // Wait for response
    await page.waitForTimeout(2000);
    await expect(page.locator('text=✅ Clicked OpenMainMenu')).toBeVisible({ timeout: 5000 });

    // Cache this successful state for dependent tests
    await orchestrator.captureAndCacheStory(storyId, SOURCE_HASH);
  });

  /**
   * Example 5: Component State Management
   *
   * Demonstrates direct component state manipulation via orchestrator.
   */
  test('component state get/set operations', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/simple`);
    await page.waitForSelector(`[data-testid="${Demo.openMainMenu}"]`);

    // Track component states through orchestrator
    // Note: Actual state injection requires app-side __testState__ support
    await orchestrator.setComponentState('testCounter', { count: 42 });

    const state = await orchestrator.getComponentState<{ count: number }>('testCounter');
    expect(state?.count).toBe(42);
  });

  /**
   * Example 6: Browser Storage Operations
   *
   * Shows how to clear and manage browser storage.
   */
  test('clear browser storage for clean slate', async ({ page }) => {
    await page.goto(`${getBaseURL()}/demo/simple`);

    // Capture initial state
    const stateBefore = await orchestrator.captureBrowserState();

    // Clear all storage
    await orchestrator.clearBrowserStorage();

    // Verify storage is empty
    const stateAfter = await orchestrator.captureBrowserState();
    expect(Object.keys(stateAfter.localStorage).length).toBe(0);
    expect(Object.keys(stateAfter.sessionStorage).length).toBe(0);
  });
});

/**
 * Comparison: Basic Pattern (without orchestrator)
 *
 * The tests below show the traditional pattern for comparison.
 * Notice the repetitive setup code that the orchestrator can cache.
 */
test.describe('Basic Pattern (for comparison)', () => {
  test('basic pattern - open menu command', async ({ page }) => {
    // Setup (runs every time, no caching)
    await page.goto(`${getBaseURL()}/demo/simple`);
    await page.waitForSelector(`[data-testid="${Demo.openMainMenu}"]`);
    await expandChatBubble(page);

    // Execute
    const chatInput = page.locator(`[data-testid="${Chat.input}"]`);
    await expect(chatInput).toBeVisible({ timeout: 5000 });
    await chatInput.fill('open menu');
    await chatInput.press('Enter');

    // Assert
    await page.waitForTimeout(2000);
    await expect(page.locator('text=✅ Clicked OpenMainMenu')).toBeVisible({ timeout: 5000 });
  });
});
