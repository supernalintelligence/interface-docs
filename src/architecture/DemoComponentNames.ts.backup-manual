/**
 * Architecture Definition: Component Names
 * 
 * Single source of truth for all UI component identifiers.
 * Maps logical component names to data-testid values for testing and AI control.
 * 
 * NEW: Using flexible format system (array format for speed, object for custom suffixes)
 * 
 * Pattern: Use createNames for auto-registration and kebab-case conversion.
 */

// NOTE: This file demonstrates BOTH old and new patterns for educational purposes.
// Uncomment the new patterns and comment out old to migrate to zero-config system.

// --- NEW PATTERN (Flexible Format System) ---
// Uncomment to use zero-config architecture:
/*
import { createNames } from "@supernalintelligence/interface-enterprise";

export const GlobalNav = createNames('nav', [
  'home', 'demo', 'dashboard', 'architecture', 
  'docs', 'examples', 'stories', 'blog'
]);
// Result: { home: 'nav-home', demo: 'nav-demo', ... } - auto-generated!
*/

// --- OLD PATTERN (Manual Boilerplate) ---
// Currently active for backward compatibility:
/**
 * Global Navigation (Header - appears on all pages)
 */
export const GlobalNav = {
  home: 'nav-home',
  demo: 'nav-demo',
  showcase: 'nav-showcase',
  testing: 'nav-testing',
  stories: 'nav-stories',
  docs: 'nav-docs',
  blog: 'nav-blog'
} as const;

// --- NEW PATTERN (Array format - fastest) ---
// Uncomment to use zero-config:
/*
export const Landing = createNames('landing', [
  'hero', 'title', 'description'
]);
// 3 lines vs 6 lines - 50% reduction!
*/

// --- OLD PATTERN ---
/**
 * Landing Page Components
 */
export const Landing = {
  hero: 'landing-hero',
  title: 'landing-title',
  description: 'landing-description'
} as const;

// --- NEW PATTERN (Array format for standard names) ---
// Uncomment to use zero-config:
/*
export const Demo = createNames('demo', [
  'title', 'container',
  // Main Menu
  'mainMenu', 'openMainMenu', 'closeMainMenu',
  // Feature Controls
  'featureToggle', 'notificationToggle',
  // Priority Selection
  'priorityHigh', 'priorityMedium', 'priorityLow',
  // Counter
  'counter', 'incrementButton', 'decrementButton', 'resetButton', 'display',
  // Theme
  'themeToggle', 'themeDark', 'themeLight',
  // Notification
  'notification', 'dismissNotification'
]);
// Result: 16 lines vs 51 lines - 69% reduction!
*/

// --- OLD PATTERN ---
/**
 * Demo Page Components
 */
export const Demo = {
  title: 'demo-title',
  container: 'demo-container',
  
  // Main Menu
  mainMenu: 'main-menu',
  openMainMenu: 'open-main-menu',
  closeMainMenu: 'close-main-menu',
  
  // Feature Controls
  featureToggle: 'feature-toggle',
  notificationToggle: 'notification-toggle',
  
  // Priority Selection
  priorityHigh: 'priority-high',
  priorityMedium: 'priority-medium',
  priorityLow: 'priority-low',
  
  // Status Selection
  statusDropdown: 'status-dropdown',
  statusPending: 'status-pending',
  statusInProgress: 'status-in-progress',
  statusCompleted: 'status-completed',
  
  // Theme
  themeToggle: 'theme-toggle',
  
  // Form
  formName: 'form-name',
  formSubmit: 'form-submit',
  
  // Tool List Execute Buttons
  // Note: Execute buttons use pattern: `execute-${tool.elementId}`
  // Example: 'execute-open-main-menu', 'execute-feature-toggle'
  toolListContainer: 'tool-list-container'
} as const;

/**
 * Examples Page Components
 */
export const Examples = {
  title: 'examples-title',
  container: 'examples-container',
  list: 'examples-list',
  
  // Example Cards
  card: 'example-card',
  cardTitle: 'example-card-title',
  cardWidget: 'example-card-widget',
  cardCode: 'example-card-code',
  expandButton: 'example-expand-button',
  
  // Code Display
  codeShorthand: 'code-shorthand',
  codeFull: 'code-full',
  codeToggle: 'code-toggle',
  copyButton: 'example-copy-button',
  copyToChatButton: 'example-copy-to-chat',
  
  // Controls
  expandAllButton: 'examples-expand-all',
  
  // Example Widgets
  simpleWidget: 'simple-widget',
  chatWidget: 'chat-widget',
  settingsWidget: 'settings-widget',
  dataWidget: 'data-widget',
  
  // Counter Widget
  counterWidget: 'examples-counter-widget',
  counterIncrement: 'examples-counter-increment',
  counterDecrement: 'examples-counter-decrement',
  counterReset: 'examples-counter-reset',
} as const;

/**
 * Settings Modal Components
 */
export const Settings = {
  modal: 'settings-modal',
  title: 'settings-title',
  themeToggle: 'settings-theme-toggle',
  notificationsToggle: 'settings-notifications-toggle',
  close: 'settings-close'
} as const;

/**
 * Chat Bubble (Global)
 */
export const Chat = {
  bubble: 'chat-bubble',
  input: 'chat-input',
  sendButton: 'chat-send-button',
  messages: 'chat-messages',
  clearButton: 'chat-clear-button',
  minimizeButton: 'chat-minimize',
  unreadBadge: 'chat-unread-badge'
} as const;

/**
 * Counter Component (for story testing)
 * Uses the actual testids from the Examples page counter widget
 */
export const Counter = {
  widget: 'examples-counter-widget',
  increment: 'examples-counter-increment',
  decrement: 'examples-counter-decrement',
  reset: 'examples-counter-reset'
} as const;

/**
 * Dashboard Page Components
 */
export const Dashboard = {
  title: 'dashboard-title'
} as const;

/**
 * Blog Page Components
 */
export const Blog = {
  container: 'blog-container',
  searchInput: 'blog-search-input',
  categoryFilter: 'blog-category-filter',
  postCard: 'blog-post-card',
  postTitle: 'blog-post-title',
  postLink: 'blog-post-link',
  backButton: 'blog-back-button',

  // Individual post page
  postContainer: 'blog-post-container',
  postHeader: 'blog-post-header',
  postContent: 'blog-post-content',
  postBackButton: 'blog-post-back-button'
} as const;

/**
 * Showcase Page Components
 */
export const Showcase = {
  container: 'showcase-container',
  title: 'showcase-title',
  siteCard: 'showcase-site-card',
  siteTitle: 'showcase-site-title',
  siteDescription: 'showcase-site-description',
  siteLink: 'showcase-site-link',
  categoryFilter: 'showcase-category-filter'
} as const;

/**
 * Testing Page Components
 */
export const Testing = {
  container: 'testing-container',
  title: 'testing-title',
  featureCard: 'testing-feature-card',
  featureTitle: 'testing-feature-title',
  featureDescription: 'testing-feature-description',
  codeExample: 'testing-code-example'
} as const;

/**
 * Stories Page Components (Walkthroughs)
 */
export const Stories = {
  container: 'stories-container',
  title: 'stories-title',
  featureCard: 'stories-feature-card',
  executeButton: 'stories-execute-button',
  viewButton: 'stories-view-button',
  resultsContainer: 'stories-results-container'
} as const;

/**
 * 404 Not Found Page Components
 */
export const NotFound = {
  container: 'not-found-container',
  title: 'not-found-title',
  message: 'not-found-message',
  homeButton: 'not-found-home-button'
} as const;

/**
 * All Component Names
 *
 * Organized by container for easy reference and validation.
 */
export const ComponentNames = {
  GlobalNav,
  Landing,
  Demo,
  Examples,
  Settings,
  Chat,
  Counter,
  Dashboard,
  Blog,
  Showcase,
  Testing,
  Stories,
  NotFound
} as const;

/**
 * Alias for backward compatibility
 */
export const Components = ComponentNames;

/**
 * Type helper for component IDs
 */
export type ComponentId =
  | typeof Landing[keyof typeof Landing]
  | typeof Demo[keyof typeof Demo]
  | typeof Examples[keyof typeof Examples]
  | typeof Settings[keyof typeof Settings]
  | typeof Chat[keyof typeof Chat]
  | typeof Blog[keyof typeof Blog]
  | typeof Showcase[keyof typeof Showcase]
  | typeof Testing[keyof typeof Testing]
  | typeof Stories[keyof typeof Stories]
  | typeof NotFound[keyof typeof NotFound];

/**
 * Get all component IDs as a flat array
 */
export function getAllComponentIds(): ComponentId[] {
  return [
    ...Object.values(Landing),
    ...Object.values(Demo),
    ...Object.values(Examples),
    ...Object.values(Settings),
    ...Object.values(Chat),
    ...Object.values(Blog),
    ...Object.values(Showcase),
    ...Object.values(Testing),
    ...Object.values(Stories),
    ...Object.values(NotFound)
  ];
}

/**
 * Validate that a component ID exists
 */
export function isValidComponentId(id: string): id is ComponentId {
  return getAllComponentIds().includes(id as ComponentId);
}

/**
 * Find which namespace a component belongs to
 */
export function findComponentNamespace(id: ComponentId): keyof typeof ComponentNames | null {
  for (const [namespace, components] of Object.entries(ComponentNames)) {
    if (Object.values(components).includes(id)) {
      return namespace as keyof typeof ComponentNames;
    }
  }
  return null;
}

