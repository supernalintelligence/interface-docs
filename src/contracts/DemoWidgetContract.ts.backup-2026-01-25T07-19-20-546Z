/**
 * Demo Widget State Contract
 * 
 * Single source of truth for demo widget state across Simple and Stateful demos.
 * This contract defines the canonical state structure that:
 * - StateManager uses internally
 * - UI components render from
 * - Tests assert against
 * 
 * @module contracts/DemoWidgetContract
 */

/**
 * Component State IDs for demo widgets
 * Used to register and access state in window.__componentState__
 */
export const DemoStateIds = {
  /** Simple demo widgets (stateless pattern) */
  SIMPLE: 'demo-widgets',
  /** Stateful demo widgets (persistent pattern) */
  STATEFUL: 'demo-widgets-stateful',
} as const;

/**
 * Core demo widget state structure
 */
export interface DemoWidgetState {
  /** Main menu open/closed state */
  menuOpen: boolean;
  
  /** Feature toggle state */
  featureEnabled: boolean;
  
  /** Notifications toggle state */
  notificationsEnabled: boolean;
  
  /** Priority level selection */
  priority: 'low' | 'medium' | 'high';
  
  /** Current status */
  status: 'inactive' | 'active' | 'processing' | 'complete';
  
  /** Theme selection */
  theme: 'light' | 'dark';
  
  /** Currently highlighted widget (for visual feedback) */
  highlightedWidget: string | null;
}

/**
 * Default initial state
 */
export const DefaultDemoState: DemoWidgetState = {
  menuOpen: false,
  featureEnabled: false,
  notificationsEnabled: false,
  priority: 'medium',
  status: 'inactive',
  theme: 'light',
  highlightedWidget: null,
};

/**
 * Named state scenarios for testing and stories
 * These represent common states that components should handle correctly
 */
export const DemoStateScenarios = {
  /** Initial default state */
  default: DefaultDemoState,
  
  /** Menu is open */
  menuOpen: {
    ...DefaultDemoState,
    menuOpen: true,
  },
  
  /** All features enabled */
  allEnabled: {
    ...DefaultDemoState,
    menuOpen: true,
    featureEnabled: true,
    notificationsEnabled: true,
  },
  
  /** High priority active */
  highPriority: {
    ...DefaultDemoState,
    priority: 'high' as const,
    status: 'active' as const,
  },
  
  /** Dark theme */
  darkTheme: {
    ...DefaultDemoState,
    theme: 'dark' as const,
  },
  
  /** Processing state */
  processing: {
    ...DefaultDemoState,
    status: 'processing' as const,
    menuOpen: true,
  },
  
  /** Completed state */
  complete: {
    ...DefaultDemoState,
    status: 'complete' as const,
    featureEnabled: true,
    notificationsEnabled: true,
  },
} as const;

export type DemoStateScenario = keyof typeof DemoStateScenarios;

/**
 * State field names for data-state attributes
 * Used to add state indicators to DOM elements
 */
export const DemoStateFields = {
  MENU_OPEN: 'menu-open',
  FEATURE_ENABLED: 'feature-enabled',
  NOTIFICATIONS_ENABLED: 'notifications-enabled',
  PRIORITY: 'priority',
  STATUS: 'status',
  THEME: 'theme',
} as const;

/**
 * Helper to convert state to data attributes
 * Usage: <div {...stateToDataAttrs(state)} />
 */
export function stateToDataAttrs(state: Partial<DemoWidgetState>): Record<string, string> {
  const attrs: Record<string, string> = {};
  
  if (state.menuOpen !== undefined) {
    attrs['data-state-menu-open'] = String(state.menuOpen);
  }
  if (state.featureEnabled !== undefined) {
    attrs['data-state-feature-enabled'] = String(state.featureEnabled);
  }
  if (state.notificationsEnabled !== undefined) {
    attrs['data-state-notifications-enabled'] = String(state.notificationsEnabled);
  }
  if (state.priority !== undefined) {
    attrs['data-state-priority'] = state.priority;
  }
  if (state.status !== undefined) {
    attrs['data-state-status'] = state.status;
  }
  if (state.theme !== undefined) {
    attrs['data-state-theme'] = state.theme;
  }
  
  return attrs;
}

/**
 * Type guard to check if state matches scenario
 */
export function matchesScenario(
  state: DemoWidgetState, 
  scenario: DemoStateScenario
): boolean {
  const expected = DemoStateScenarios[scenario];
  return Object.keys(expected).every(
    key => state[key as keyof DemoWidgetState] === expected[key as keyof DemoWidgetState]
  );
}

