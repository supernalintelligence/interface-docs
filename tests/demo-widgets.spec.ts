/**
 * Demo Widgets E2E Tests
 *
 * Tests for StatusSelect and ThemeSelect widgets that don't have
 * Gherkin story patterns yet.
 */

import { test, expect } from '@playwright/test';
import { Components } from '../src/architecture/ComponentNames';
import { Routes } from '../src/architecture/Routes';

test.describe('Demo Interactive Widgets', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(Routes.Demo);
    await page.waitForLoadState('networkidle');
  });

  test.describe('StatusSelect Widget', () => {
    test('should change status to active', async ({ page }) => {
      const statusSelect = page.locator(`[data-testid="${Components.Demo.statusDropdown}"]`);

      await statusSelect.selectOption('active');

      // Assert the state changed via data attribute
      const container = page.locator('[data-state-status]');
      await expect(container).toHaveAttribute('data-state-status', 'active');
    });

    test('should change status to processing', async ({ page }) => {
      const statusSelect = page.locator(`[data-testid="${Components.Demo.statusDropdown}"]`);

      await statusSelect.selectOption('processing');

      const container = page.locator('[data-state-status]');
      await expect(container).toHaveAttribute('data-state-status', 'processing');
    });

    test('should change status to complete', async ({ page }) => {
      const statusSelect = page.locator(`[data-testid="${Components.Demo.statusDropdown}"]`);

      await statusSelect.selectOption('complete');

      const container = page.locator('[data-state-status]');
      await expect(container).toHaveAttribute('data-state-status', 'complete');
    });

    test('should change status to inactive', async ({ page }) => {
      const statusSelect = page.locator(`[data-testid="${Components.Demo.statusDropdown}"]`);

      // First change to something else
      await statusSelect.selectOption('active');
      // Then back to inactive
      await statusSelect.selectOption('inactive');

      const container = page.locator('[data-state-status]');
      await expect(container).toHaveAttribute('data-state-status', 'inactive');
    });
  });

  test.describe('ThemeSelect Widget', () => {
    test('should change theme to dark', async ({ page }) => {
      const themeSelect = page.locator(`[data-testid="${Components.Demo.themeToggle}"]`);

      await themeSelect.selectOption('dark');

      const container = page.locator('[data-state-theme]');
      await expect(container).toHaveAttribute('data-state-theme', 'dark');
    });

    test('should change theme to light', async ({ page }) => {
      const themeSelect = page.locator(`[data-testid="${Components.Demo.themeToggle}"]`);

      // First change to dark
      await themeSelect.selectOption('dark');
      // Then back to light
      await themeSelect.selectOption('light');

      const container = page.locator('[data-state-theme]');
      await expect(container).toHaveAttribute('data-state-theme', 'light');
    });

    test('should change theme to auto', async ({ page }) => {
      const themeSelect = page.locator(`[data-testid="${Components.Demo.themeToggle}"]`);

      await themeSelect.selectOption('auto');

      const container = page.locator('[data-state-theme]');
      await expect(container).toHaveAttribute('data-state-theme', 'auto');
    });
  });

  test.describe('Widget Integration', () => {
    test('should update state display when changing status', async ({ page }) => {
      const statusSelect = page.locator(`[data-testid="${Components.Demo.statusDropdown}"]`);

      await statusSelect.selectOption('active');

      // Check the StateManager display shows the updated status
      const stateDisplay = page.locator('text=Status:').locator('..');
      await expect(stateDisplay).toContainText('active');
    });

    test('should update state display when changing theme', async ({ page }) => {
      const themeSelect = page.locator(`[data-testid="${Components.Demo.themeToggle}"]`);

      await themeSelect.selectOption('dark');

      // Check the StateManager display shows the updated theme
      const stateDisplay = page.locator('text=Theme:').locator('..');
      await expect(stateDisplay).toContainText('dark');
    });
  });
});
