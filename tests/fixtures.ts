/**
 * Playwright Test Fixtures
 * 
 * Shared fixtures and utilities for all tests
 */

import { test as base } from '@playwright/test';

// Get the dynamic base URL
const getDevPort = require('../scripts/get-port');
const testConfig = require('../test.config');

export const getBaseURL = () => {
  return testConfig.getBaseURL(getDevPort());
};

// Extend base test with custom fixtures if needed in the future
export const test = base.extend({
  // Example: Could add custom fixtures here
  // baseURL: async ({}, use) => {
  //   await use(getBaseURL());
  // },
});

export { expect } from '@playwright/test';

