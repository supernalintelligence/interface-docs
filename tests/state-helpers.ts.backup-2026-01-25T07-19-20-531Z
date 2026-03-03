/**
 * Demo-Specific State Helpers
 * 
 * Convenience wrappers around generalized component state helpers
 * for demo widget testing. Uses the core testing utilities with
 * demo-specific types and defaults.
 * 
 * @module tests/state-helpers
 */

import { Page, expect } from '@playwright/test';
// Import Playwright-dependent helpers directly (not exported from main testing index)
// These are test-only helpers that import Playwright
import {
  assertComponentState,
  waitForComponentState,
  debugComponentState,
} from '@supernal/interface/testing/ComponentStateHelpers';
import type { DemoWidgetState } from '../src/contracts/DemoWidgetContract';
import { 
  DemoStateScenarios, 
  DemoStateIds,
  type DemoStateScenario 
} from '../src/contracts/DemoWidgetContract';

/**
 * Get current demo widget state
 * Wrapper around generic getComponentState with demo types
 */
export async function getDemoState(
  page: Page,
  componentId: string = DemoStateIds.SIMPLE
): Promise<DemoWidgetState> {
  // Demo exposes state via window.__demoState__ (legacy)
  // Fallback to checking that first
  try {
    return await page.evaluate(() => {
      if ((window as any).__demoState__) {
        return (window as any).__demoState__.get();
      }
      // Otherwise try standard registry
      if ((window as any).__componentState__?.['demo-widgets']) {
        return (window as any).__componentState__['demo-widgets'].get();
      }
      throw new Error('Demo state not exposed');
    });
  } catch (error) {
    throw new Error(
      `Failed to get demo state. ` +
      `Make sure UIWidgetComponents is loaded and exposes window.__demoState__`
    );
  }
}

/**
 * Assert demo widget state matches expected
 * Type-safe wrapper for demo widgets
 */
export async function assertDemoState(
  page: Page,
  expected: Partial<DemoWidgetState>,
  componentId: string = DemoStateIds.SIMPLE
): Promise<void> {
  const actual = await getDemoState(page, componentId);
  expect(actual).toMatchObject(expected);
}

/**
 * Wait for demo state to match condition
 * Type-safe wrapper for demo widgets
 */
export async function waitForDemoState(
  page: Page,
  condition: (state: DemoWidgetState) => boolean,
  options: { timeout?: number; componentId?: string } = {}
): Promise<void> {
  const { timeout = 5000, componentId = DemoStateIds.SIMPLE } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const state = await getDemoState(page, componentId);
    if (condition(state)) {
      return;
    }
    await page.waitForTimeout(100);
  }

  const currentState = await getDemoState(page, componentId);
  throw new Error(
    `Timeout waiting for demo state condition after ${timeout}ms.\n` +
    `Current state: ${JSON.stringify(currentState, null, 2)}`
  );
}

/**
 * Assert state matches a named scenario
 */
export async function assertDemoScenario(
  page: Page,
  scenario: DemoStateScenario,
  componentId: string = DemoStateIds.SIMPLE
): Promise<void> {
  const expected = DemoStateScenarios[scenario];
  await assertDemoState(page, expected, componentId);
}

/**
 * Wait for state to match a named scenario
 */
export async function waitForScenario(
  page: Page,
  scenario: DemoStateScenario,
  options: { timeout?: number; componentId?: string } = {}
): Promise<void> {
  const expected = DemoStateScenarios[scenario];
  await waitForDemoState(
    page,
    state => Object.keys(expected).every(
      key => state[key as keyof DemoWidgetState] === expected[key as keyof DemoWidgetState]
    ),
    options
  );
}

/**
 * Debug helper: Print current demo state
 */
export async function debugDemoState(
  page: Page,
  componentId: string = DemoStateIds.SIMPLE
): Promise<void> {
  const state = await getDemoState(page, componentId);
  console.log('=== Current Demo State ===');
  console.log(JSON.stringify(state, null, 2));
  console.log('========================');
}

