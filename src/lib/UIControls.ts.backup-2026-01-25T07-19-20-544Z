/**
 * UI Controls - Plain state management methods
 * 
 * NO @Tool decorators here - the HOC-wrapped components are the tools.
 */

import { updateState, highlightWidget } from './UIWidgetComponents';
import { Components } from '../architecture';
import { Theme } from './ThemeManager'; // Only import type, not manager

export class UIControls {
  
  async openMainMenu(): Promise<{ success: boolean; message: string }> {
    highlightWidget(Components.Demo.openMainMenu);
    updateState({ menuOpen: true });
    return { success: true, message: 'Main menu opened' };
  }
  
  async closeMainMenu(): Promise<{ success: boolean; message: string }> {
    highlightWidget(Components.Demo.closeMainMenu);
    updateState({ menuOpen: false });
    return { success: true, message: 'Main menu closed' };
  }

  async toggleFeature(enabled: boolean): Promise<{ success: boolean; message: string }> {
    highlightWidget(Components.Demo.featureToggle);
    updateState({ featureEnabled: enabled });
    return { success: true, message: `Feature ${enabled ? 'enabled' : 'disabled'}` };
  }

  async toggleNotifications(enabled: boolean): Promise<{ success: boolean; message: string }> {
    highlightWidget(Components.Demo.notificationToggle);
    updateState({ notificationsEnabled: enabled });
    return { success: true, message: `Notifications ${enabled ? 'enabled' : 'disabled'}` };
  }

  async setPriority(priority: 'high' | 'medium' | 'low'): Promise<{ success: boolean; message: string }> {
    const componentMap = {
      high: Components.Demo.priorityHigh,
      medium: Components.Demo.priorityMedium,
      low: Components.Demo.priorityLow
    };
    highlightWidget(componentMap[priority]);
    updateState({ priority });
    return { success: true, message: `Priority set to ${priority}` };
  }

  async setStatus(status: string): Promise<{ success: boolean; message: string }> {
    // Status doesn't have a specific component in ComponentNames yet
    updateState({ status });
    return { success: true, message: `Status changed to ${status}` };
  }

  async setTheme(theme: Theme): Promise<{ success: boolean; message: string }> {
    // Widget-scoped theme (not global) - just update demo state
    updateState({ theme });
    return { success: true, message: `Theme changed to ${theme}` };
  }

  async submitForm(name: string): Promise<{ success: boolean; message: string }> {
    highlightWidget(Components.Demo.formSubmit);
    return { success: true, message: `Form submitted with name: ${name}` };
  }
}

let uiControlsInstance: UIControls | null = null;

export function getUIControls(): UIControls {
  if (!uiControlsInstance) {
    uiControlsInstance = new UIControls();
  }
  return uiControlsInstance;
}
