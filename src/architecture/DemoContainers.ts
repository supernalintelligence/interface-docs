/**
 * Demo Application Containers
 * 
 * Define all major navigation boundaries for the demo application.
 * These are automatically registered in NavigationGraph on app init.
 */
import type { ContainerDefinition } from "@supernal/interface-enterprise";

/**
 * Demo Application Containers
 */
export const DemoContainers = {
  
  /**
   * Landing Page
   * 
   * Initial entry point for the application.
   * Contains hero section and primary navigation.
   */
  Landing: {
    id: 'Landing',
    name: 'Landing Page',
    type: 'page' as const,
    route: '/',
    components: [
      'landing-hero',
      'landing-description',
      'nav-to-demo',
      'nav-to-examples'
    ],
    description: 'Application landing page with primary navigation'
  },
  
  /**
   * Demo Page
   * 
   * Root demo page with tabbed sub-sections for different patterns.
   */
  Demo: {
    id: 'Demo',
    name: 'Demo Page',
    type: 'page' as const,
    route: '/demo',
    components: [],
    description: 'Demo page root with Simple and Stateful sub-containers'
  },
  
  /**
   * Simple Demo (Stateless Pattern)
   * 
   * HOC-based components with callbacks, no persistence.
   */
  DemoSimple: {
    id: 'DemoSimple',
    name: 'Simple Demo',
    type: 'section' as const,
    parent: 'Demo',
    route: '/demo/simple',
    components: [
      'open-main-menu',
      'close-main-menu',
      'feature-toggle',
      'notification-toggle',
      'priority-high',
      'priority-medium', 
      'priority-low',
      'status-dropdown',
      'theme-toggle',
      'form-submit'
    ],
    description: 'Stateless pattern with HOCs and callbacks'
  },
  
  /**
   * Stateful Demo (Persistent State Pattern)
   * 
   * StateManager-based components with Component Memory persistence.
   */
  DemoStateful: {
    id: 'DemoStateful',
    name: 'Stateful Demo',
    type: 'section' as const,
    parent: 'Demo',
    route: '/demo/stateful',
    components: [
      'open-main-menu',
      'close-main-menu',
      'feature-toggle',
      'notification-toggle',
      'priority-high',
      'priority-medium', 
      'priority-low',
      'status-dropdown',
      'theme-toggle',
      'form-submit'
    ],
    description: 'Stateful pattern with Component Memory persistence'
  },
  
  /**
   * Examples Page
   * 
   * Gallery of example scenarios showing specialized decorators
   */
  Examples: {
    id: 'Examples',
    name: 'Examples Page',
    type: 'page' as const,
    route: '/examples',
    components: [
      // Counter tools
      'examples-counter-increment',
      'examples-counter-decrement',
      'examples-counter-reset',
      // Chat tools
      'examples-chat-send',
      'examples-chat-clear',
      // Settings tools
      'examples-settings-change',
      'examples-settings-reset',
      'examples-settings-delete',
      // Data tools
      'examples-data-add',
      'examples-data-fetch',
      'examples-data-delete',
    ],
    description: 'Examples and use cases showing specialized tool decorators'
  },
  
  /**
   * Dashboard Page
   * 
   * Analytics and overview dashboard.
   */
  Dashboard: {
    id: 'Dashboard',
    name: 'Dashboard',
    type: 'page' as const,
    route: '/dashboard',
    components: [
      'dashboard-title',
      'nav-to-demo'
    ],
    description: 'Dashboard page'
  },
  
  /**
   * Docs Page
   * 
   * Documentation and guides.
   */
  Docs: {
    id: 'Docs',
    name: 'Documentation',
    type: 'page' as const,
    route: '/docs',
    components: [
      'docs-title',
      'nav-to-demo'
    ],
    description: 'Documentation page'
  },
  
  /**
   * API Page
   * 
   * API reference documentation.
   */
  API: {
    id: 'API',
    name: 'API Reference',
    type: 'page' as const,
    route: '/api',
    components: [
      'api-title',
      'nav-to-demo'
    ],
    description: 'API reference page'
  },
  
  /**
   * Architecture Page
   * 
   * Application architecture visualization.
   */
  Architecture: {
    id: 'Architecture',
    name: 'Architecture',
    type: 'page' as const,
    route: '/architecture',
    components: [
      'architecture-graph'
    ],
    description: 'Application architecture visualization page'
  },
  
  /**
   * Blog Page
   * 
   * Blog posts and articles about Supernal Interface.
   */
  Blog: {
    id: 'Blog',
    name: 'Blog',
    type: 'page' as const,
    route: '/blog',
    components: [
      'blog-container',
      'blog-search-input',
      'blog-category-filter',
      'blog-post-card',
      'blog-post-link'
    ],
    description: 'Blog posts and articles'
  },
  
  /**
   * Stories Page
   * 
   * Test stories and story execution.
   */
  Stories: {
    id: 'Stories',
    name: 'Stories',
    type: 'page' as const,
    route: '/stories',
    components: [
      'stories-container',
      'stories-list'
    ],
    description: 'Test stories and story execution page'
  },
  
  /**
   * Settings Modal
   * 
   * Application settings overlay (can appear on any page).
   */
  Settings: {
    id: 'Settings',
    name: 'Settings Modal',
    type: 'modal' as const,
    parent: 'Demo', // Can be triggered from Demo
    components: [
      'settings-title',
      'settings-theme-toggle',
      'settings-notifications-toggle',
      'settings-close'
    ],
    description: 'Application settings modal overlay'
  }
  
} as const satisfies Record<string, ContainerDefinition>;

/**
 * Type helper to get all demo container IDs
 */
export type DemoContainerId = keyof typeof DemoContainers;

