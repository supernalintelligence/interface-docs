/**
 * Demo Chat Adapter Configuration
 * 
 * This module configures which chat adapter to use in the demo.
 * Supports both CopilotKit (with LLM) and Native (pattern matching).
 * 
 * Usage:
 * - Set NEXT_PUBLIC_CHAT_ADAPTER=copilotkit for CopilotKit
 * - Set NEXT_PUBLIC_CHAT_ADAPTER=native for Native (default)
 */

import { 
  ChatUIAdapter,
  createNativeAdapter,
  bridgeToolRegistry,
  createAuditTrail,
} from "@supernalintelligence/interface-enterprise";

// CopilotKit adapter - stubbed for now to avoid bundling
// To enable: install @copilotkit packages and uncomment the real import
const createCopilotKitAdapter = null as any;

export type AdapterType = 'copilotkit' | 'native';

/**
 * Get the configured adapter type from environment
 */
export function getAdapterType(): AdapterType {
  const envAdapter = process.env.NEXT_PUBLIC_CHAT_ADAPTER;
  if (envAdapter === 'copilotkit') return 'copilotkit';
  return 'native';
}

/**
 * Create the appropriate adapter based on configuration
 */
export function createDemoAdapter(): ChatUIAdapter {
  const type = getAdapterType();
  
  // eslint-disable-next-line no-console
  console.log(`[Demo] Creating ${type} chat adapter`);
  
  if (type === 'copilotkit') {
    return createCopilotKitAdapter({
      runtimeUrl: '/api/copilotkit',
      systemPrompt: `You are an AI assistant for the Supernal Interface demo.

You can control this application using tools. Available capabilities:
- Navigate between pages (docs, examples, blog, dashboard)
- Interact with demo widgets (counter, notifications, theme)
- Read application state

This demo showcases @supernal-interface - a framework for building AI-controllable React applications.

When users ask you to do something:
1. Use the appropriate tool
2. Confirm what action you took
3. If something fails, explain why

Try commands like:
- "increment the counter"
- "go to the docs"
- "toggle notifications"`,
    });
  }
  
  return createNativeAdapter();
}

/**
 * Set up the adapter with bridging and audit trail
 */
export function setupDemoAdapter(adapter: ChatUIAdapter) {
  // Bridge tools from ToolRegistry
  const toolCleanup = bridgeToolRegistry(adapter, {
    filter: (tool) => tool.aiEnabled === true,
    onBridge: (tools) => {
      // eslint-disable-next-line no-console
      console.log(`[Demo] Bridged ${tools.length} tools:`, tools.map(t => t.name));
    },
  });
  
  // Create audit trail for debugging
  const audit = createAuditTrail(adapter, {
    logToConsole: process.env.NODE_ENV === 'development',
    maxExecutions: 50,
  });
  
  return {
    audit,
    cleanup: () => {
      toolCleanup();
      audit.unsubscribe();
    },
  };
}









