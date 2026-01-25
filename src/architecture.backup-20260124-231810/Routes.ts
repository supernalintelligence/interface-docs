/**
 * Route Contracts - Auto-generated
 * Generated from: src/pages
 * Do not edit manually - regenerate with: si scan-routes
 */

export const Routes = {
  404: '/404',
  Testing: '/testing',
  Stories: '/stories',
  Showcase: '/showcase',
  Home: '/',
  IndexNew: '/index-new',
  Examples: '/examples',
  Docs: '/docs',
  Dashboard: '/dashboard',
  Comparison: '/comparison',
  Architecture: '/architecture',
  ExamplesChatAdapters: '/examples/chat-adapters',
  Demo: '/demo',
  Blog: '/blog',
  BlogSlug: '/blog/:slug'
} as const;

export type RouteName = keyof typeof Routes;
export type RouteValue = typeof Routes[RouteName];
