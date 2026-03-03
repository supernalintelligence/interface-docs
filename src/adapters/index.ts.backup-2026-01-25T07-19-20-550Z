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

/**
 * Demo Chat Adapter Configuration
 *
 * NOTE: This file is deprecated. Use SupernalProvider from @supernal/interface-nextjs instead.
 *
 * SupernalProvider provides the same pattern-matching functionality with a premium UI.
 * See _app.tsx for usage example.
 */

export type AdapterType = 'copilotkit' | 'native';

/**
 * @deprecated Use SupernalProvider from @supernal/interface-nextjs instead
 */
export function getAdapterType(): AdapterType {
  const envAdapter = process.env.NEXT_PUBLIC_CHAT_ADAPTER;
  if (envAdapter === 'copilotkit') return 'copilotkit';
  return 'native';
}







