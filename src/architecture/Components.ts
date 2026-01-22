/**
 * Component Name Contracts - Auto-generated
 * Generated from: src/components
 * Canonical source: src/architecture/DemoComponentNames.ts
 * Do not edit manually - regenerate with: si scan-names
 */
// Namespaces from canonical source:
// - GlobalNav
// - Landing
// - Demo
// - Examples
// - Settings
// - Chat
// - Counter
// - Dashboard
// - Blog
// - Showcase
// - Testing
// - Stories
// - NotFound


export const Components = {
  BlogBackButton: 'blog-back-button',
  BlogCategoryFilter: 'blog-category-filter',
  BlogContainer: 'blog-container',
  BlogPostBackButton: 'blog-post-back-button',
  BlogPostCard: 'blog-post-card',
  BlogPostContainer: 'blog-post-container',
  BlogPostContent: 'blog-post-content',
  BlogPostHeader: 'blog-post-header',
  BlogPostLink: 'blog-post-link',
  BlogPostTitle: 'blog-post-title',
  BlogSearchInput: 'blog-search-input',
  ChatBubble: 'chat-bubble',
  ChatClearButton: 'chat-clear-button',
  ChatInput: 'chat-input',
  ChatMessages: 'chat-messages',
  ChatMinimizeButton: 'chat-minimize',
  ChatSendButton: 'chat-send-button',
  ChatUnreadBadge: 'chat-unread-badge',
  CounterDecrement: 'examples-counter-decrement',
  CounterIncrement: 'examples-counter-increment',
  CounterReset: 'examples-counter-reset',
  CounterWidget: 'examples-counter-widget',
  DashboardTitle: 'dashboard-title',
  DemoCloseMainMenu: 'close-main-menu',
  DemoContainer: 'demo-container',
  DemoExample: 'execute-open-main-menu',
  DemoFeatureToggle: 'feature-toggle',
  DemoFormName: 'form-name',
  DemoFormSubmit: 'form-submit',
  DemoMainMenu: 'main-menu',
  DemoNotificationToggle: 'notification-toggle',
  DemoOpenMainMenu: 'open-main-menu',
  DemoPriorityHigh: 'priority-high',
  DemoPriorityLow: 'priority-low',
  DemoPriorityMedium: 'priority-medium',
  DemoStatusCompleted: 'status-completed',
  DemoStatusDropdown: 'status-dropdown',
  DemoStatusInProgress: 'status-in-progress',
  DemoStatusPending: 'status-pending',
  DemoThemeToggle: 'theme-toggle',
  DemoTitle: 'demo-title',
  DemoToolListContainer: 'tool-list-container',
  ExamplesCard: 'example-card',
  ExamplesCardCode: 'example-card-code',
  ExamplesCardTitle: 'example-card-title',
  ExamplesCardWidget: 'example-card-widget',
  ExamplesChatWidget: 'chat-widget',
  ExamplesCodeFull: 'code-full',
  ExamplesCodeShorthand: 'code-shorthand',
  ExamplesCodeToggle: 'code-toggle',
  ExamplesContainer: 'examples-container',
  ExamplesCopyButton: 'example-copy-button',
  ExamplesCopyToChatButton: 'example-copy-to-chat',
  ExamplesCounterDecrement: 'examples-counter-decrement',
  ExamplesCounterIncrement: 'examples-counter-increment',
  ExamplesCounterReset: 'examples-counter-reset',
  ExamplesCounterWidget: 'examples-counter-widget',
  ExamplesDataWidget: 'data-widget',
  ExamplesExpandAllButton: 'examples-expand-all',
  ExamplesExpandButton: 'example-expand-button',
  ExamplesList: 'examples-list',
  ExamplesSettingsWidget: 'settings-widget',
  ExamplesSimpleWidget: 'simple-widget',
  ExamplesTitle: 'examples-title',
  GlobalNavBlog: 'nav-blog',
  GlobalNavDemo: 'nav-demo',
  GlobalNavDocs: 'nav-docs',
  GlobalNavHome: 'nav-home',
  GlobalNavShowcase: 'nav-showcase',
  GlobalNavStories: 'nav-stories',
  GlobalNavTesting: 'nav-testing',
  LandingDescription: 'landing-description',
  LandingHero: 'landing-hero',
  LandingNavToDemo: 'landing-nav-to-demo',
  LandingTitle: 'landing-title',
  NotFoundContainer: 'not-found-container',
  NotFoundHomeButton: 'not-found-home-button',
  NotFoundMessage: 'not-found-message',
  NotFoundTitle: 'not-found-title',
  SettingsClose: 'settings-close',
  SettingsModal: 'settings-modal',
  SettingsNotificationsToggle: 'settings-notifications-toggle',
  SettingsThemeToggle: 'settings-theme-toggle',
  SettingsTitle: 'settings-title',
  ShowcaseCategoryFilter: 'showcase-category-filter',
  ShowcaseContainer: 'showcase-container',
  ShowcaseSiteCard: 'showcase-site-card',
  ShowcaseSiteDescription: 'showcase-site-description',
  ShowcaseSiteLink: 'showcase-site-link',
  ShowcaseSiteTitle: 'showcase-site-title',
  ShowcaseTitle: 'showcase-title',
  StatefulDemoContainer: 'stateful-demo-container',
  StoriesContainer: 'stories-container',
  StoriesExecuteButton: 'stories-execute-button',
  StoriesFeatureCard: 'stories-feature-card',
  StoriesResultsContainer: 'stories-results-container',
  StoriesTitle: 'stories-title',
  StoriesViewButton: 'stories-view-button',
  TestingCodeExample: 'testing-code-example',
  TestingContainer: 'testing-container',
  TestingFeatureCard: 'testing-feature-card',
  TestingFeatureDescription: 'testing-feature-description',
  TestingFeatureTitle: 'testing-feature-title',
  TestingTitle: 'testing-title'
} as const;

export type ComponentName = keyof typeof Components;
export type ComponentTestId = typeof Components[ComponentName];
