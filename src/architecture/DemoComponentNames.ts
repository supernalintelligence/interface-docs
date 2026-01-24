/**
 * Component Name Contracts - Auto-generated
 * Generated from: docs-site/src
 * Canonical source: docs-site/src/architecture/DemoComponentNames.ts
 * Do not edit manually - regenerate with: si scan-names
 */

export const Blog = {
  backButton: 'blog-back-button',
  categoryFilter: 'blog-category-filter',
  container: 'blog-container',
  postBackButton: 'blog-post-back-button',
  postCard: 'blog-post-card',
  postContainer: 'blog-post-container',
  postContent: 'blog-post-content',
  postHeader: 'blog-post-header',
  postLink: 'blog-post-link',
  postTitle: 'blog-post-title',
  searchInput: 'blog-search-input'
} as const;

export const Chat = {
  bubble: 'chat-bubble',
  clearButton: 'chat-clear-button',
  input: 'chat-input',
  messages: 'chat-messages',
  minimizeButton: 'chat-minimize',
  sendButton: 'chat-send-button',
  unreadBadge: 'chat-unread-badge'
} as const;

export const Counter = {
  decrement: 'examples-counter-decrement',
  increment: 'examples-counter-increment',
  reset: 'examples-counter-reset',
  widget: 'examples-counter-widget'
} as const;

export const Dashboard = {
  title: 'dashboard-title'
} as const;

export const Demo = {
  closeMainMenu: 'close-main-menu',
  container: 'demo-container',
  Example: 'execute-open-main-menu',
  featureToggle: 'feature-toggle',
  formName: 'form-name',
  formSubmit: 'form-submit',
  mainMenu: 'main-menu',
  notificationToggle: 'notification-toggle',
  openMainMenu: 'open-main-menu',
  priorityHigh: 'priority-high',
  priorityLow: 'priority-low',
  priorityMedium: 'priority-medium',
  statusCompleted: 'status-completed',
  statusDropdown: 'status-dropdown',
  statusInProgress: 'status-in-progress',
  statusPending: 'status-pending',
  themeToggle: 'theme-toggle',
  title: 'demo-title',
  toolListContainer: 'tool-list-container'
} as const;

export const Examples = {
  card: 'example-card',
  cardCode: 'example-card-code',
  cardTitle: 'example-card-title',
  cardWidget: 'example-card-widget',
  chatWidget: 'chat-widget',
  codeFull: 'code-full',
  codeShorthand: 'code-shorthand',
  codeToggle: 'code-toggle',
  container: 'examples-container',
  copyButton: 'example-copy-button',
  copyToChatButton: 'example-copy-to-chat',
  counterDecrement: 'examples-counter-decrement',
  counterIncrement: 'examples-counter-increment',
  counterReset: 'examples-counter-reset',
  counterWidget: 'examples-counter-widget',
  dataWidget: 'data-widget',
  expandAllButton: 'examples-expand-all',
  expandButton: 'example-expand-button',
  list: 'examples-list',
  settingsWidget: 'settings-widget',
  simpleWidget: 'simple-widget',
  title: 'examples-title'
} as const;

export const GlobalNav = {
  blog: 'nav-blog',
  demo: 'nav-demo',
  docs: 'nav-docs',
  home: 'nav-home',
  showcase: 'nav-showcase',
  stories: 'nav-stories',
  testing: 'nav-testing'
} as const;

export const Landing = {
  description: 'landing-description',
  hero: 'landing-hero',
  title: 'landing-title'
} as const;

export const NotFound = {
  container: 'not-found-container',
  homeButton: 'not-found-home-button',
  message: 'not-found-message',
  title: 'not-found-title'
} as const;

export const Settings = {
  close: 'settings-close',
  modal: 'settings-modal',
  notificationsToggle: 'settings-notifications-toggle',
  themeToggle: 'settings-theme-toggle',
  title: 'settings-title'
} as const;

export const Showcase = {
  categoryFilter: 'showcase-category-filter',
  container: 'showcase-container',
  siteCard: 'showcase-site-card',
  siteDescription: 'showcase-site-description',
  siteLink: 'showcase-site-link',
  siteTitle: 'showcase-site-title',
  title: 'showcase-title'
} as const;

export const Stories = {
  container: 'stories-container',
  executeButton: 'stories-execute-button',
  featureCard: 'stories-feature-card',
  resultsContainer: 'stories-results-container',
  title: 'stories-title',
  viewButton: 'stories-view-button'
} as const;

export const Testing = {
  codeExample: 'testing-code-example',
  container: 'testing-container',
  featureCard: 'testing-feature-card',
  featureDescription: 'testing-feature-description',
  featureTitle: 'testing-feature-title',
  title: 'testing-title'
} as const;

/**
 * Aggregate export for all component namespaces
 * Allows both individual imports (import { Chat } from './Components')
 * and aggregate access (Components.Chat.input)
 */
export const Components = {
  Blog,
  Chat,
  Counter,
  Dashboard,
  Demo,
  Examples,
  GlobalNav,
  Landing,
  NotFound,
  Settings,
  Showcase,
  Stories,
  Testing
} as const;

/**
 * Alias for backward compatibility
 */
export const ComponentNames = Components;

export type ComponentNamespace = keyof typeof Components;
export type ComponentName<T extends ComponentNamespace> = keyof typeof Components[T];
export type ComponentTestId<T extends ComponentNamespace> = typeof Components[T][ComponentName<T>];
