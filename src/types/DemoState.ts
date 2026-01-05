/**
 * Demo Widget State Type
 * 
 * Shared state interface for demo widgets.
 * Used by DemoWidgetProvider, InteractiveWidgets, and UIWidgetComponents.
 * 
 * Extends ApplicationState to be compatible with StateManager's ComponentState constraint.
 */

import { ApplicationState } from "@supernal/interface-enterprise";

export interface DemoWidgetState extends ApplicationState {
  kind: 'application';
  stateId: string; // Allow different state IDs for Simple vs Stateful
  
  // Widget state properties (top-level for easy access)
  menuOpen: boolean;
  featureEnabled: boolean;
  notificationsEnabled: boolean;
  priority: 'high' | 'medium' | 'low';
  status: string;
  theme: 'light' | 'dark' | 'auto';
}

