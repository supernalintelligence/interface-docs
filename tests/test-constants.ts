/**
 * Test Constants - Architecture-Aware Test Helpers
 * 
 * Imports proper container and component names from architecture.
 * Tests should use these instead of magic strings or hardcoded paths.
 */

import { DemoContainers, ComponentNames } from '../src/architecture';

/**
 * Test Routes - Based on Container Definitions
 */
export const TestRoutes = {
  landing: DemoContainers.Landing.route,
  demo: DemoContainers.Demo.route,
  demoSimple: DemoContainers.DemoSimple.route,
  demoStateful: DemoContainers.DemoStateful.route,
  examples: DemoContainers.Examples.route,
  dashboard: DemoContainers.Dashboard.route,
  docs: DemoContainers.Docs.route,
  architecture: DemoContainers.Architecture.route,
  blog: DemoContainers.Blog.route,
} as const;

/**
 * Test Component IDs - Based on ComponentNames
 */
export const TestComponents = {
  // Navigation
  nav: ComponentNames.GlobalNav,
  
  // Landing page
  landing: ComponentNames.Landing,
  
  // Demo page
  demo: ComponentNames.Demo,
  
  // Examples page
  examples: ComponentNames.Examples,
  
  // Settings modal
  settings: ComponentNames.Settings,
  
  // Chat bubble (global)
  chat: ComponentNames.Chat,
  
  // Dashboard
  dashboard: ComponentNames.Dashboard,
  
  // Blog
  blog: ComponentNames.Blog,
} as const;

/**
 * Helper: Get full URL for a test route
 */
export function getTestURL(baseURL: string, route: string): string {
  return `${baseURL}${route}`;
}

/**
 * Helper: Get testid selector
 */
export function testid(id: string): string {
  return `[data-testid="${id}"]`;
}

/**
 * Helper: Get testid locator string
 */
export function getByTestId(id: string): string {
  return `[data-testid="${id}"]`;
}

