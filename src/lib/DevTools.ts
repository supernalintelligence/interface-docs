/**
 * Development Tools - Exposes AI interface and state for testing
 *
 * This module exposes DemoAIInterface and component state managers
 * to window for E2E testing and debugging.
 */

import { DemoAIInterface } from '@supernal/interface-nextjs';

declare global {
  interface Window {
    DemoAIInterface?: DemoAIInterface;
    __demoState__?: any;
  }
}

/**
 * Initialize development tools
 * Exposes AI interface to window for E2E tests
 */
export function initializeDevTools() {
  if (typeof window === 'undefined') return;

  // Create and expose AI interface
  if (!window.DemoAIInterface) {
    window.DemoAIInterface = new DemoAIInterface();
    console.log('✅ [DevTools] DemoAIInterface exposed to window');
  }
}

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  initializeDevTools();
}
