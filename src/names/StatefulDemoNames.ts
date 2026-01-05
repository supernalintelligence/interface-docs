/**
 * Stateful Demo Component Names
 * 
 * Stateful demo using Component Memory with persistence.
 * Uses @ToolProvider pattern.
 */

export const StatefulDemoNames = {
  // Container
  container: 'stateful-demo-container',
  
  // Menu buttons
  openMenu: 'stateful-open-menu',
  closeMenu: 'stateful-close-menu',
  
  // Toggle checkboxes
  featureToggle: 'stateful-feature-toggle',
  notificationsToggle: 'stateful-notifications-toggle',
  
  // Priority radio buttons
  priorityHigh: 'stateful-priority-high',
  priorityMedium: 'stateful-priority-medium',
  priorityLow: 'stateful-priority-low',
  
  // Select dropdowns
  statusDropdown: 'stateful-status-dropdown',
  themeSelect: 'stateful-theme-select',
  
  // Form inputs
  formName: 'stateful-form-name',
  formSubmit: 'stateful-form-submit',
  
  // Counter buttons for SimplifiedDemoTools
  incrementButton: 'stateful-increment-button',
  decrementButton: 'stateful-decrement-button',
  resetButton: 'stateful-reset-button',
} as const;

export type StatefulDemoNameId = typeof StatefulDemoNames[keyof typeof StatefulDemoNames];

