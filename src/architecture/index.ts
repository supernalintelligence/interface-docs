/**
 * Demo Application Architecture
 *
 * Uses zero-config initialization with auto-inference.
 * Components and containers auto-register on import.
 */

// ============================================
// NEW PATTERN (Zero-Config) - Active
// ============================================
import { initializeArchitecture } from "@supernalintelligence/interface-enterprise/browser";
import './ComponentNames';  // Auto-registers on import
import './DemoContainers';  // Auto-registers on import

export const DemoArchitecture = initializeArchitecture();
// That's it! Everything else is automatic:
// - navToContainerMap inferred from container names/routes
// - All components auto-discovered from registry
// - All containers auto-discovered from registry

// Re-export for consumers
export { DemoContainers } from './DemoContainers';
export {
  Components,
  ComponentNames,
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
} from './ComponentNames';

// Export architecture methods for backward compatibility
export const {
  initialize: initializeDemoArchitecture,
  createNavigationHandler,
  getGraph
} = DemoArchitecture;
