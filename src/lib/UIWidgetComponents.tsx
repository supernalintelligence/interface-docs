/**
 * UI Widget Components - DRY Pattern
 * 
 * Base components wrapped with @Tool decorators for BOTH Simple and (Stateful) demos.
 * Each base component is wrapped TWICE to create separate Simple/(Stateful) tools.
 */

import React, { useState, useEffect } from 'react';
import { ClickTool, ChangeTool, Tool, ToolCategory } from "@supernalintelligence/interface-enterprise";
import { Components, DemoContainers } from '../architecture';
import { StatefulDemoNames } from '../names/StatefulDemoNames';
import { getUIControls } from './UIControls';
import { DemoWidgetState } from '../types/DemoState';

// ============================================================================
// Demo State Management (Shared + LocalStorage Persistence)
// ============================================================================

interface DemoState extends DemoWidgetState {
  highlightedWidget: string | null;
}

const STORAGE_KEY = 'demo-simple-state'; // Simple demo state (separate from Stateful)

// Default state (used for SSR and initial render)
const DEFAULT_STATE: DemoState = {
  kind: 'application',
  stateId: 'demo-widgets',
  menuOpen: false,
  featureEnabled: false,
  notificationsEnabled: false,
  priority: 'medium',
  status: 'inactive',
  theme: 'light',
  highlightedWidget: null
};

// Start with defaults, will be hydrated from localStorage on client
let demoState: DemoState = { ...DEFAULT_STATE };
let isHydrated = false;

// Hydrate state from localStorage (only on client after mount)
function hydrateFromStorage() {
  if (typeof window === 'undefined' || isHydrated) return;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const loadedState = JSON.parse(stored);
      demoState = { ...demoState, ...loadedState };
      
      // NOTE: Theme is now widget-scoped, not global
      // No longer setting document.documentElement attributes
      
      // Notify all listeners about the hydrated state
      stateChangeCallbacks.forEach(cb => cb(demoState));
    }
    isHydrated = true;
  } catch {
    // Failed to hydrate state from localStorage
  }
}

// NOTE: Theme is now widget-scoped, not global
// Removed global document.documentElement theme setting

let stateChangeCallbacks: Array<(state: DemoState) => void> = [];

export function getDemoState(): DemoState {
  return { ...demoState };
}

// Expose state to window for E2E testing
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__demoState__ = {
    get: () => ({ ...demoState }),
    update: (updates: Partial<DemoState>) => updateState(updates),
  };
}

export function hydrateState() {
  hydrateFromStorage();
}

export function setStateChangeCallback(callback: (state: DemoState) => void) {
  stateChangeCallbacks.push(callback);
}

export function updateState(updates: Partial<DemoState>) {
  demoState = { ...demoState, ...updates };
  
  // NOTE: Theme/status are now widget-scoped, not global
  // No longer setting document.documentElement attributes
  
  // Persist to localStorage (for Simple demo - NOT persisted, resets on refresh)
  // Stateful demo uses its own StateManager
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoState));
    } catch {
      // Failed to save state to localStorage
    }
  }
  
  stateChangeCallbacks.forEach(cb => cb(demoState));
  
  // Notify AI listeners about what changed
  aiStateListeners.forEach(listener => {
    listener(demoState, updates);
  });
}

export function highlightWidget(widgetId: string) {
  updateState({ highlightedWidget: widgetId });
  setTimeout(() => {
    updateState({ highlightedWidget: null });
  }, 2000);
}

// ============================================================================
// State Change Listener (Push Notifications to AI) - RESTORED
// ============================================================================

let aiStateListeners: Array<(state: DemoState, changes: Partial<DemoState>) => void> = [];

export function subscribeToStateChanges(
  callback: (state: DemoState, changes: Partial<DemoState>) => void
) {
  aiStateListeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    aiStateListeners = aiStateListeners.filter(cb => cb !== callback);
  };
}

// ============================================================================
// Base Component Interfaces
// ============================================================================

interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

interface CheckboxProps {
  label?: string;
  className?: string;
}

interface RadioProps {
  label?: string;
  className?: string;
}

interface SelectProps {
  className?: string;
}

interface FormInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface FormSubmitProps {
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onFormSubmit?: (name: string) => void;
  formName: string;
}

interface ToolCallbacks {
  reportSuccess?: (message?: string) => void;
  reportFailure?: (message?: string) => void;
}

// ============================================================================
// BASE COMPONENTS (Shared Implementation)
// ============================================================================

const OpenMenuButtonBase: React.FC<ButtonProps & ToolCallbacks & { elementId: string }> = ({ 
  className, children, disabled, reportSuccess, elementId 
}) => {
  const handleClick = async () => {
    const result = await getUIControls().openMainMenu();
    reportSuccess?.(result.message);
  };
  
  return (
    <button
      data-testid={elementId}
      onClick={handleClick}
      disabled={disabled}
      className={className}
    >
      {children || 'Open Menu'}
    </button>
  );
};

const CloseMenuButtonBase: React.FC<ButtonProps & ToolCallbacks & { elementId: string }> = ({ 
  className, children, disabled, reportSuccess, elementId 
}) => {
  const handleClick = async () => {
    const result = await getUIControls().closeMainMenu();
    reportSuccess?.(result.message);
  };
  
  return (
    <button
      data-testid={elementId}
      onClick={handleClick}
      disabled={disabled}
      className={className}
    >
      {children || 'Close Menu'}
    </button>
  );
};

const FeatureToggleBase: React.FC<CheckboxProps & ToolCallbacks & { elementId: string }> = ({ 
  label, className, reportSuccess, elementId 
}) => {
  const [checked, setChecked] = useState(false);
  
  useEffect(() => {
    const callback = (state: DemoState) => setChecked(state.featureEnabled);
    setStateChangeCallback(callback);
    setChecked(getDemoState().featureEnabled);
  }, []);
  
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    const result = await getUIControls().toggleFeature(newChecked);
    reportSuccess?.(result.message);
  };
  
  return (
    <label className={`${className} text-gray-700`}>
      <input
        type="checkbox"
        data-testid={elementId}
        checked={checked}
        onChange={handleChange}
        className="mr-2"
      />
      {label || 'Feature Toggle'}
    </label>
  );
};

const NotificationsToggleBase: React.FC<CheckboxProps & ToolCallbacks & { elementId: string }> = ({ 
  label, className, reportSuccess, elementId 
}) => {
  const [checked, setChecked] = useState(false);
  
  useEffect(() => {
    const callback = (state: DemoState) => setChecked(state.notificationsEnabled);
    setStateChangeCallback(callback);
    setChecked(getDemoState().notificationsEnabled);
  }, []);
  
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    const result = await getUIControls().toggleNotifications(newChecked);
    reportSuccess?.(result.message);
  };
  
  return (
    <label className={`${className} text-gray-700`}>
      <input
        type="checkbox"
        data-testid={elementId}
        checked={checked}
        onChange={handleChange}
        className="mr-2"
      />
      {label || 'Notifications Toggle'}
    </label>
  );
};

// SINGLE Priority Radio Base (DRY!)
// The radio buttons are just UI - the @Tool is ONE "Set Priority" with a parameter
const PriorityRadioBase: React.FC<RadioProps & { 
  elementId: string;
  value: 'high' | 'medium' | 'low';
}> = ({ label, className, elementId, value }) => {
  const [selectedPriority, setSelectedPriority] = useState<'high' | 'medium' | 'low'>('medium');
  
  useEffect(() => {
    const callback = (state: DemoState) => setSelectedPriority(state.priority);
    setStateChangeCallback(callback);
    setSelectedPriority(getDemoState().priority);
  }, []);
  
  const handleChange = () => {
    highlightWidget(`priority-${value}-widget`);
    updateState({ priority: value });
  };
  
  return (
    <label className={`${className} text-gray-700`}>
      <input
        type="radio"
        name="priority"
        data-testid={elementId}
        checked={selectedPriority === value}
        onChange={handleChange}
        className="mr-2"
      />
      {label || value.charAt(0).toUpperCase() + value.slice(1)}
    </label>
  );
};

const StatusSelectBase: React.FC<SelectProps & ToolCallbacks & { elementId: string }> = ({ 
  className, reportSuccess, elementId 
}) => {
  const [value, setValue] = useState('inactive');
  
  useEffect(() => {
    const callback = (state: DemoState) => setValue(state.status);
    setStateChangeCallback(callback);
    setValue(getDemoState().status);
  }, []);
  
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    const result = await getUIControls().setStatus(newValue);
    reportSuccess?.(result.message);
  };
  
  return (
    <select
      data-testid={elementId}
      value={value}
      onChange={handleChange}
      className={className}
    >
      <option value="inactive">Inactive</option>
      <option value="active">Active</option>
      <option value="processing">Processing</option>
      <option value="complete">Complete</option>
    </select>
  );
};

// Simple demo's ThemeSelect - updates Simple's global state
const ThemeSelectBase: React.FC<SelectProps & ToolCallbacks & { elementId: string }> = ({ 
  className, reportSuccess, elementId 
}) => {
  const [value, setValue] = useState<'light' | 'dark' | 'auto'>('light');
  
  useEffect(() => {
    const callback = (state: DemoState) => setValue(state.theme);
    setStateChangeCallback(callback);
    setValue(getDemoState().theme);
  }, []);
  
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as 'light' | 'dark' | 'auto';
    const result = await getUIControls().setTheme(newValue);
    reportSuccess?.(result.message);
  };
  
  return (
    <select
      data-testid={elementId}
      value={value}
      onChange={handleChange}
      className={className}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="auto">Auto</option>
    </select>
  );
};

// Stateful demo's ThemeSelect - TRULY stateful controlled component
// Just a normal controlled component, parent manages state
const _StatefulThemeSelectBase: React.FC<SelectProps & ToolCallbacks & { elementId: string; value?: string; onValueChange?: (value: string) => void }> = ({ 
  className, reportSuccess, elementId, value = 'light', onValueChange
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onValueChange?.(newValue);
    reportSuccess?.(`Theme changed to ${newValue}`);
  };
  
  return (
    <select
      data-testid={elementId}
      value={value}
      onChange={handleChange}
      className={className}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="auto">Auto</option>
    </select>
  );
};

const FormSubmitButtonBase: React.FC<FormSubmitProps & ToolCallbacks & { elementId: string }> = ({ 
  disabled, className, children, onFormSubmit, formName, reportSuccess, elementId 
}) => {
  const handleClick = async (_e: React.MouseEvent) => {
    const result = await getUIControls().submitForm(formName);
    reportSuccess?.(result.message);
    onFormSubmit?.(formName);
  };
  
  return (
    <button
      data-testid={elementId}
      type="submit"
      disabled={disabled}
      onClick={handleClick}
      className={className}
    >
      {children || 'Submit'}
    </button>
  );
};

export const FormNameInput = ({ value, onChange, placeholder, className }: FormInputProps) => {
  return (
    <input
      data-testid={Components.Demo.formName}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
};

// ============================================================================
// SIMPLE DEMO TOOLS (DemoSimple container)
// ============================================================================

export const OpenMenuButton = ClickTool({
  elementId: Components.Demo.openMainMenu,
  containerId: DemoContainers.DemoSimple.route,
  description: 'Open the main menu',
  aiEnabled: true,
  dangerLevel: 'safe',
  examples: ['open menu', 'show menu', 'display menu']
})((props: ButtonProps & ToolCallbacks) => (
  <OpenMenuButtonBase {...props} elementId={Components.Demo.openMainMenu} />
));

export const CloseMenuButton = ClickTool({
  elementId: Components.Demo.closeMainMenu,
  containerId: DemoContainers.DemoSimple.route,
  description: 'Close the main menu',
  aiEnabled: true,
  dangerLevel: 'safe',
  examples: ['close menu', 'hide menu', 'dismiss menu']
})((props: ButtonProps & ToolCallbacks) => (
  <CloseMenuButtonBase {...props} elementId={Components.Demo.closeMainMenu} />
));

export const FeatureToggle = ChangeTool({
  elementId: Components.Demo.featureToggle,
  containerId: DemoContainers.DemoSimple.route,
  description: 'Toggle feature on/off',
  aiEnabled: true,
  dangerLevel: 'safe',
  examples: ['toggle feature', 'enable feature', 'disable feature']
})((props: CheckboxProps & ToolCallbacks) => (
  <FeatureToggleBase {...props} elementId={Components.Demo.featureToggle} />
));

export const NotificationsToggle = ChangeTool({
  elementId: Components.Demo.notificationToggle,
  containerId: DemoContainers.DemoSimple.route,
  description: 'Toggle notifications on/off',
  aiEnabled: true,
  dangerLevel: 'safe',
  examples: ['toggle notifications', 'enable notifications', 'disable notifications']
})((props: CheckboxProps & ToolCallbacks) => (
  <NotificationsToggleBase {...props} elementId={Components.Demo.notificationToggle} />
));

// Priority Radio - ONE @Tool with parameter, 3 UI components (DRY!)
export const PriorityHighRadio = (props: RadioProps) => (
  <PriorityRadioBase {...props} elementId={Components.Demo.priorityHigh} value="high" />
);

export const PriorityMediumRadio = (props: RadioProps) => (
  <PriorityRadioBase {...props} elementId={Components.Demo.priorityMedium} value="medium" />
);

export const PriorityLowRadio = (props: RadioProps) => (
  <PriorityRadioBase {...props} elementId={Components.Demo.priorityLow} value="low" />
);

// ONE @Tool for AI to set priority
export const setPriority = Tool({
  name: 'Set Priority',
  description: 'Set priority level (high, medium, or low)',
  category: ToolCategory.USER_INTERACTION,
  aiEnabled: true,
  dangerLevel: 'safe',
  containerId: DemoContainers.DemoSimple.route,
  examples: ['set priority high', 'priority medium', 'change priority to low'],
  executionContext: 'ui',
  returnType: 'json'
})((value: 'high' | 'medium' | 'low') => {
  highlightWidget(`priority-${value}-widget`);
  updateState({ priority: value });
  return { success: true, priority: value };
});

export const StatusSelect = ChangeTool({
  elementId: Components.Demo.statusDropdown,
  containerId: DemoContainers.DemoSimple.route,
  description: 'Change status',
  aiEnabled: true,
  dangerLevel: 'safe',
  examples: ['set status active', 'change status', 'status inactive']
})((props: SelectProps & ToolCallbacks) => (
  <StatusSelectBase {...props} elementId={Components.Demo.statusDropdown} />
));

export const ThemeSelect = ChangeTool({
  elementId: Components.Demo.themeToggle,
  containerId: DemoContainers.DemoSimple.route,
  description: 'Change theme using dropdown widget',
  aiEnabled: true,  // Enable AI control
  dangerLevel: 'safe',
  examples: [
    'theme light', 
    'theme dark', 
    'set theme light',
    'set theme dark',
    'change theme to light',
    'change theme to dark',
    'use light theme',
    'use dark theme',
    'switch to light mode',
    'switch to dark mode'
  ]
})((props: SelectProps & ToolCallbacks) => (
  <ThemeSelectBase {...props} elementId={Components.Demo.themeToggle} />
));

export const FormSubmitButton = ClickTool({
  elementId: Components.Demo.formSubmit,
  containerId: DemoContainers.DemoSimple.route,
  description: 'Submit form with name',
  aiEnabled: true,
  dangerLevel: 'safe',
  examples: ['submit form', 'send form']
})((props: FormSubmitProps & ToolCallbacks) => (
  <FormSubmitButtonBase {...props} elementId={Components.Demo.formSubmit} />
));

// ============================================================================
// State Query Tools (Read-Only)
// ============================================================================

export const getWidgetState = Tool({
  name: 'getWidgetState',
  description: 'Get current state of all interactive widgets',
  category: ToolCategory.CONTENT_RETRIEVAL,
  aiEnabled: false,
  dangerLevel: 'safe',
  examples: ['get widget state', 'show current state'],
  executionContext: 'ui',
  returnType: 'json'
})(() => getDemoState());

export const getMenuState = Tool({
  name: 'getMenuState',
  description: 'Check if menu is open or closed',
  category: ToolCategory.CONTENT_RETRIEVAL,
  aiEnabled: false,
  dangerLevel: 'safe',
  examples: ['is menu open?', 'check menu state'],
  executionContext: 'ui',
  returnType: 'json'
})(() => ({ menuOpen: demoState.menuOpen }));

export const getFeatureState = Tool({
  name: 'getFeatureState',
  description: 'Check if feature is enabled',
  category: ToolCategory.CONTENT_RETRIEVAL,
  aiEnabled: false,
  dangerLevel: 'safe',
  examples: ['is feature enabled?', 'check feature toggle'],
  executionContext: 'ui',
  returnType: 'json'
})(() => ({ 
  featureEnabled: demoState.featureEnabled,
  notificationsEnabled: demoState.notificationsEnabled
}));

export const getThemeState = Tool({
  name: 'getThemeState',
  description: 'Get current theme setting',
  category: ToolCategory.CONTENT_RETRIEVAL,
  aiEnabled: false,
  dangerLevel: 'safe',
  examples: ['what theme?', 'current theme'],
  executionContext: 'ui',
  returnType: 'json'
})(() => ({ theme: demoState.theme }));

export const getPriorityState = Tool({
  name: 'getPriorityState',
  description: 'Get current priority level',
  category: ToolCategory.CONTENT_RETRIEVAL,
  aiEnabled: false,
  dangerLevel: 'safe',
  examples: ['what priority?', 'current priority'],
  executionContext: 'ui',
  returnType: 'json'
})(() => ({ priority: demoState.priority }));

export const getStatusState = Tool({
  name: 'getStatusState',
  description: 'Get current status',
  category: ToolCategory.CONTENT_RETRIEVAL,
  aiEnabled: false,
  dangerLevel: 'safe',
  examples: ['what status?', 'current status'],
  executionContext: 'ui',
  returnType: 'json'
})(() => ({ status: demoState.status }));

// ============================================================================
// ADVANCED DEMO TOOLS (DemoStateful container)
// Same base components, different @Tool decorators
// ============================================================================

export const StatefulOpenMenu = ClickTool({
  elementId: StatefulDemoNames.openMenu,
  containerId: DemoContainers.DemoStateful.route,
  description: 'Open the main menu (Stateful)',
  aiEnabled: true,
  dangerLevel: 'safe',
  examples: ['open menu stateful', 'show stateful menu']
})((props: ButtonProps & ToolCallbacks) => (
  <OpenMenuButtonBase {...props} elementId={StatefulDemoNames.openMenu} />
));

export const StatefulCloseMenu = ClickTool({
  elementId: StatefulDemoNames.closeMenu,
  containerId: DemoContainers.DemoStateful.route,
  description: 'Close the main menu (Stateful)',
  aiEnabled: true,
  dangerLevel: 'safe',
  examples: ['close menu stateful', 'hide stateful menu']
})((props: ButtonProps & ToolCallbacks) => (
  <CloseMenuButtonBase {...props} elementId={StatefulDemoNames.closeMenu} />
));

export const StatefulFeatureToggle = ChangeTool({
  elementId: StatefulDemoNames.featureToggle,
  containerId: DemoContainers.DemoStateful.route,
  description: 'Toggle feature on/off (Stateful)',
  aiEnabled: true,
  dangerLevel: 'safe',
  examples: ['toggle stateful feature', 'enable stateful feature']
})((props: CheckboxProps & ToolCallbacks) => (
  <FeatureToggleBase {...props} elementId={StatefulDemoNames.featureToggle} />
));

export const StatefulNotificationsToggle = ChangeTool({
  elementId: StatefulDemoNames.notificationsToggle,
  containerId: DemoContainers.DemoStateful.route,
  description: 'Toggle notifications on/off (Stateful)',
  aiEnabled: true,
  dangerLevel: 'safe',
  examples: ['toggle stateful notifications', 'enable stateful notifications']
})((props: CheckboxProps & ToolCallbacks) => (
  <NotificationsToggleBase {...props} elementId={StatefulDemoNames.notificationsToggle} />
));

// Priority Radio - ONE @Tool with parameter, 3 UI components (DRY!)
export const StatefulPriorityHighRadio = (props: RadioProps) => (
  <PriorityRadioBase {...props} elementId={StatefulDemoNames.priorityHigh} value="high" />
);

export const StatefulPriorityMediumRadio = (props: RadioProps) => (
  <PriorityRadioBase {...props} elementId={StatefulDemoNames.priorityMedium} value="medium" />
);

export const StatefulPriorityLowRadio = (props: RadioProps) => (
  <PriorityRadioBase {...props} elementId={StatefulDemoNames.priorityLow} value="low" />
);

// ONE @Tool for AI to set priority (Stateful)
export const setStatefulPriority = Tool({
  name: 'Set Priority (Stateful)',
  description: 'Set priority level (high, medium, or low) in Stateful demo',
  category: ToolCategory.USER_INTERACTION,
  aiEnabled: true,
  dangerLevel: 'safe',
  containerId: DemoContainers.DemoStateful.route,
  examples: ['set stateful priority high', 'stateful priority medium'],
  executionContext: 'ui',
  returnType: 'json'
})((value: 'high' | 'medium' | 'low') => {
  highlightWidget(`priority-${value}-widget`);
  updateState({ priority: value });
  return { success: true, priority: value };
});

export const StatefulStatusSelect = ChangeTool({
  elementId: StatefulDemoNames.statusDropdown,
  containerId: DemoContainers.DemoStateful.route,
  description: 'Change status (Stateful)',
  aiEnabled: true,
  dangerLevel: 'safe',
  examples: ['set stateful status active', 'change stateful status']
})((props: SelectProps & ToolCallbacks) => (
  <StatusSelectBase {...props} elementId={StatefulDemoNames.statusDropdown} />
));

export const StatefulFormSubmitButton = ClickTool({
  elementId: StatefulDemoNames.formSubmit,
  containerId: DemoContainers.DemoStateful.route,
  description: 'Submit form with name (Stateful)',
  aiEnabled: true,
  dangerLevel: 'safe',
  examples: ['submit stateful form', 'send stateful form']
})((props: FormSubmitProps & ToolCallbacks) => (
  <FormSubmitButtonBase {...props} elementId={StatefulDemoNames.formSubmit} />
));

