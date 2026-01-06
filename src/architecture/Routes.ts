/**
 * Route Contracts - Auto-generated
 * Generated from: src/pages
 * Do not edit manually - regenerate with: si scan-routes
 */

export const Routes = {
  Stories: '/stories',
  Home: '/',
  Examples: '/examples',
  Docs: '/docs',
  Dashboard: '/dashboard',
  Comparison: '/comparison',
  Architecture: '/architecture',
  'ExamplesChat-adapters': '/examples/chat-adapters',
  DemoStateful: '/demo/stateful',
  DemoSimple: '/demo/simple',
  Demo: '/demo',
  DemoHierarchical: '/demo/hierarchical',
  DemoAdvanced: '/demo/advanced',
  Blog: '/blog',
  'BlogSlug': '/blog/:slug'
} as const;

export type RouteName = keyof typeof Routes;
export type RouteValue = typeof Routes[RouteName];
