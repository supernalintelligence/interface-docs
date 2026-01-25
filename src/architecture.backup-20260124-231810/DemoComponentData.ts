/**
 * Architecture Definition: Component Data Contracts
 *
 * Single source of truth for component state definitions.
 * Used by Gherkin stories for state setup and assertions.
 *
 * Pattern: Components.<Namespace>.<Component>.state.<StateName>
 * Example: Components.Examples.counter.state.zero → { count: 0 }
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CounterState {
  count: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  type: 'user' | 'ai' | 'system';  // Matches useSharedChat Message type
  timestamp?: string;
}

export interface ChatState {
  messages: ChatMessage[];
}

export interface SettingsState {
  theme: 'light' | 'dark';
  notifications: boolean;
}

// ============================================================================
// EXAMPLES DATA CONTRACTS
// ============================================================================

export const ExamplesData = {
  counter: {
    // Initial states - referenced in Gherkin as Components.Examples.counter.state.zero
    state: {
      zero: { count: 0 } as CounterState,
      one: { count: 1 } as CounterState,
      five: { count: 5 } as CounterState,
      ten: { count: 10 } as CounterState,
      negative: { count: -3 } as CounterState,
    },

    // State transitions - referenced in Gherkin as Components.Examples.counter.after.increment
    after: {
      increment: (prev: CounterState): CounterState => ({ count: prev.count + 1 }),
      decrement: (prev: CounterState): CounterState => ({ count: prev.count - 1 }),
      reset: (): CounterState => ({ count: 0 }),
    },

    // Test data sets for parameterized scenarios
    testCases: {
      basic: {
        start: { count: 0 },
        expected: { count: 1 },
      },
      multipleIncrements: [
        { start: { count: 0 }, clicks: 3, expected: { count: 3 } },
        { start: { count: 5 }, clicks: 2, expected: { count: 7 } },
      ],
    },
  },

  chat: {
    // Initial states
    state: {
      empty: { messages: [] } as ChatState,
      single: {
        messages: [
          { id: '1', text: 'Hello', type: 'user' as const }
        ]
      } as ChatState,
      withMessages: {
        messages: [
          { id: '1', text: 'Hello', type: 'user' as const },
          { id: '2', text: 'Hi there!', type: 'ai' as const },
        ]
      } as ChatState,
    },

    // State transitions
    after: {
      sendMessage: (prev: ChatState, text: string): ChatState => ({
        messages: [
          ...prev.messages,
          { id: String(Date.now()), text, type: 'user' }
        ]
      }),
      clearMessages: (): ChatState => ({ messages: [] }),
    },

    testCases: {
      sendMessage: {
        input: 'Test message',
        expectedMessageCount: 1,
      },
    },
  },

  settings: {
    state: {
      defaults: { theme: 'light', notifications: true } as SettingsState,
      dark: { theme: 'dark', notifications: true } as SettingsState,
      silent: { theme: 'light', notifications: false } as SettingsState,
    },

    after: {
      toggleTheme: (prev: SettingsState): SettingsState => ({
        ...prev,
        theme: prev.theme === 'light' ? 'dark' : 'light'
      }),
      toggleNotifications: (prev: SettingsState): SettingsState => ({
        ...prev,
        notifications: !prev.notifications
      }),
    },
  },
} as const;

// ============================================================================
// DEMO DATA CONTRACTS (for /demo page)
// ============================================================================

export const DemoData = {
  menu: {
    state: {
      closed: { isOpen: false },
      open: { isOpen: true },
    },
  },

  theme: {
    state: {
      light: { theme: 'light' },
      dark: { theme: 'dark' },
    },
  },

  feature: {
    state: {
      disabled: { enabled: false },
      enabled: { enabled: true },
    },
  },
} as const;

// ============================================================================
// COMBINED DATA REGISTRY
// ============================================================================

/**
 * Complete data contract registry
 * Use dot-notation in Gherkin: Components.Examples.counter.state.zero
 */
export const ComponentData = {
  Examples: ExamplesData,
  Demo: DemoData,
} as const;

// ============================================================================
// TYPE HELPERS
// ============================================================================

export type ExamplesDataType = typeof ExamplesData;
export type DemoDataType = typeof DemoData;
export type ComponentDataType = typeof ComponentData;

/**
 * Resolve a dot-notation data reference
 * @example resolveDataContract('Examples.counter.state.zero') → { count: 0 }
 */
export function resolveDataContract(reference: string): any {
  const parts = reference.split('.');
  let current: any = ComponentData;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      throw new Error(`Invalid data contract reference: ${reference} (failed at "${part}")`);
    }
  }

  return current;
}
