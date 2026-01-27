/**
 * Component Name Contracts - Auto-generated + Package Inheritance
 *
 * This file combines:
 * 1. Auto-generated contracts from src/components (via `si scan-names`)
 * 2. Inherited contracts from @supernal/interface-nextjs (Chat components)
 *
 * **Precedence Rules:**
 * - Package components (from @supernal/interface-nextjs) are the source of truth
 * - Local scanned components complement package components
 * - Use InterfaceComponents.* for direct package access
 * - Use semantic namespaces (Chat, Blog, etc.) for app-specific grouping
 *
 * Note: Namespaces that conflict with global types (Document, Window, etc.)
 * are automatically renamed with "Names" suffix (e.g., Document → DocumentNames)
 * to avoid TypeScript conflicts.
 */

// ============================================================================
// Package Component Inheritance
// ============================================================================

/**
 * Re-export components from @supernal/interface-nextjs package
 * Use these for direct access to package-provided component testids:
 *
 * @example
 * import { InterfaceComponents } from './ComponentNames';
 * const testId = InterfaceComponents.ChatToggleButton; // 'chat-toggle-button'
 */
export { Components as InterfaceComponents } from '@supernal/interface-nextjs';

// Import for mapping to semantic namespaces
import { Components as IC } from '@supernal/interface-nextjs';

// ============================================================================
// App-Specific Component Namespaces (Semantic Grouping)
// ============================================================================

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

/**
 * Chat - Semantic namespace for chat-related components
 * Inherits from @supernal/interface-nextjs package + app-specific components
 */
export const Chat = {
  // Package-provided components (source of truth)
  bubble: IC.ChatToggleButton,
  clearButton: IC.ChatClearButton,
  input: IC.ChatInput,
  sendButton: IC.ChatSendButton,
  // App-specific chat components (not in package)
  messages: 'chat-messages',
  minimizeButton: 'chat-minimize',
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
 * Additional auto-scanned components
 * Note: DocumentNames renamed to avoid conflict with global Document type
 */
export const DocumentNames = {
  link: 'document-link',
  link2: 'document-link2',
  link3: 'document-link3',
  link4: 'document-link4',
  link5: 'document-link5'
} as const;

export const BlogPost = {
  link: 'blogPost-link'
} as const;

export const NewLandingPage = {
  forUsers: 'newLandingPage-forUsers',
  forDevelopers: 'newLandingPage-forDevelopers',
  forBusiness: 'newLandingPage-forBusiness',
  showcase: 'newLandingPage-showcase',
  pricing: 'newLandingPage-pricing',
  vsCompetitors: 'newLandingPage-vsCompetitors',
  documentation: 'newLandingPage-documentation',
  examples: 'newLandingPage-examples',
  gitHub: 'newLandingPage-gitHub',
  blog: 'newLandingPage-blog',
  communityDiscord: 'newLandingPage-communityDiscord',
  support: 'newLandingPage-support'
} as const;

export const Footer = {
  form: 'footer-form',
  link: 'footer-link',
  link2: 'footer-link2',
  link3: 'footer-link3',
  link4: 'footer-link4',
  link5: 'footer-link5',
  link6: 'footer-link6',
  link7: 'footer-link7',
  link8: 'footer-link8',
  link9: 'footer-link9',
  link10: 'footer-link10'
} as const;

export const Header = {
  link: 'header-link'
} as const;

export const InteractiveWidgets = {
  form: 'interactiveWidgets-form'
} as const;

export const StatefulInteractiveWidgets = {
  form: 'statefulInteractiveWidgets-form'
} as const;

export const Pages = {
  link: 'pages-link',
  button: 'pages-button'
} as const;

/**
 * Aggregate export for all component namespaces
 * Allows both individual imports (import { Chat } from './Components')
 * and aggregate access (Components.Chat.input)
 */
export const Components = {
  Blog,
  BlogPost,
  Chat,
  Counter,
  Dashboard,
  Demo,
  DocumentNames,
  Examples,
  Footer,
  GlobalNav,
  Header,
  InteractiveWidgets,
  Landing,
  NewLandingPage,
  NotFound,
  Pages,
  Settings,
  Showcase,
  StatefulInteractiveWidgets,
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
