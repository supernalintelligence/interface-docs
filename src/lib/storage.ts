/**
 * Shared Storage Adapter Singleton
 * 
 * Provides a single LocalStorageAdapter instance for the entire demo app.
 * This prevents creating multiple adapter instances unnecessarily.
 */

import { LocalStorageAdapter } from "@supernal/interface-enterprise";

/**
 * Singleton LocalStorageAdapter instance
 * 
 * Usage:
 * ```typescript
 * import { localStorageAdapter } from './lib/storage';
 * const manager = StateManager.getInstance(StateManagers.SupernalCoreV1, localStorageAdapter);
 * ```
 */
export const localStorageAdapter = new LocalStorageAdapter();

