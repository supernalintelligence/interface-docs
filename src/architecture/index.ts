/**
 * Demo Application Architecture
 * 
 * Educational Example: Shows BOTH old and new architecture patterns.
 * 
 * NEW PATTERN: Zero-config with auto-inference (96% less code)
 * OLD PATTERN: Manual configuration (shown for comparison)
 * 
 * To migrate: Uncomment NEW, comment OLD, update imports in DemoComponentNames and DemoContainers
 */

// ============================================
// NEW PATTERN (Zero-Config) - 3 lines!
// ============================================
// Uncomment to use zero-config architecture:
/*
import { initializeArchitecture } from "@supernalintelligence/interface-enterprise";
import './DemoComponentNames';  // Auto-registers on import
import './DemoContainers';       // Auto-registers on import

export const DemoArchitecture = initializeArchitecture();
// That's it! Everything else is automatic:
// - navToContainerMap inferred from container names/routes
// - All components auto-discovered from registry
// - All containers auto-discovered from registry
// Result: 3 lines vs 47 lines - 94% reduction!
*/

// ============================================
// OLD PATTERN (Manual Configuration) - 47 lines
// ============================================
// Currently active for backward compatibility:
import { createAutoInitializer } from "@supernalintelligence/interface-enterprise";
import { DemoContainers } from './DemoContainers';
import { Components } from './DemoComponentNames';

export { DemoContainers } from './DemoContainers';
export { Components, ComponentNames } from './DemoComponentNames';

/**
 * Navigation mapping (GlobalNav key → Container name)
 * NEW: This would be auto-inferred from container names and routes
 */
const navToContainerMap: Record<string, string> = {
  home: 'Landing',
  demo: 'Demo',
  dashboard: 'Dashboard',
  docs: 'Docs',
  examples: 'Examples',
  blog: 'Blog',
  architecture: 'Architecture'
};

/**
 * Initialize demo architecture using core pattern
 * NEW: Just call initializeArchitecture() - no manual config needed!
 */
export const {
  initialize: initializeDemoArchitecture,
  createNavigationHandler,
  getGraph
} = createAutoInitializer({
  containers: DemoContainers,
  components: { GlobalNav: Components.GlobalNav },
  navToContainerMap,
  autoInferEdges: true,
  mirrorTools: [
    // Mirror tools from DemoSimple to DemoStateful (they share components)
    { from: 'DemoSimple', to: 'DemoStateful' }
  ]
});
