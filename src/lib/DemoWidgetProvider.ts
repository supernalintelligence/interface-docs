/**
 * Demo Widget Tools Provider
 * 
 * Bundled tool provider for demo page widgets.
 * Uses proper categories (container names) and StateManager integration.
 * 
 * NOTE: This must be initialized client-side only (not during SSR)
 */

import { ToolProvider, Tool, StateManager, ToolCategory } from "@supernalintelligence/interface-enterprise";
import { StatefulDemoNames } from '../names/StatefulDemoNames';
import { DemoContainers } from '../architecture/DemoContainers';
import { StateManagers } from "@supernalintelligence/interface-enterprise";
import { DemoWidgetState } from '../types/DemoState';
import { localStorageAdapter } from './storage';

@ToolProvider({
  category: DemoContainers.DemoStateful.id, // Stateful demo container
  containerId: DemoContainers.DemoStateful.id,
})
export class DemoWidgetTools {
  private stateManager: StateManager | null = null;
  private initialized = false;
  
  constructor() {
    // Don't initialize StateManager in constructor - wait for client-side
  }
  
  private async ensureInitialized() {
    if (this.initialized || typeof window === 'undefined') return;
    
    this.stateManager = StateManager.getInstance(
      StateManagers.CoreV1,
      localStorageAdapter
    );
    
      // Initialize default state if not present
      // Use SEPARATE key from Simple demo to avoid conflicts
      const currentState = await this.stateManager.get<DemoWidgetState>('demo-stateful-widgets');
      if (!currentState) {
        await this.stateManager.set('demo-stateful-widgets', {
          kind: 'application',
          stateId: 'demo-stateful-widgets',
          menuOpen: false,
          featureEnabled: false,
          notificationsEnabled: false,
          priority: 'medium',
          status: 'inactive',
          theme: 'light',
        } as DemoWidgetState);
      }
    
    this.initialized = true;
  }
  
  @Tool({
    elementId: StatefulDemoNames.openMenu,
    containerId: DemoContainers.DemoStateful.id,
    callbacks: { storage: true },
    name: 'Open Menu',
    description: 'Open the main menu (Advanced Demo)',
    aiEnabled: true,
    dangerLevel: 'safe',
    requiresApproval: false,
    examples: ['open menu', 'show menu', 'display menu'],
  })
  async openMenu() {
    await this.ensureInitialized();
    if (!this.stateManager) return { success: false, menuOpen: false };
    
    await this.stateManager.merge('demo-stateful-widgets', { menuOpen: true } as Partial<DemoWidgetState>);
    return { success: true, menuOpen: true };
  }
  
  @Tool({
    elementId: StatefulDemoNames.closeMenu,
    containerId: DemoContainers.DemoStateful.id,
    callbacks: { storage: true },
    name: 'Close Menu',
    description: 'Close the main menu (Advanced Demo)',
    aiEnabled: true,
    dangerLevel: 'safe',
    requiresApproval: false,
    examples: ['close menu', 'close', 'hide menu'],
  })
  async closeMenu() {
    await this.ensureInitialized();
    if (!this.stateManager) return { success: false, menuOpen: false };
    
    await this.stateManager.merge('demo-stateful-widgets', { menuOpen: false } as Partial<DemoWidgetState>);
    return { success: true, menuOpen: false };
  }
  
  @Tool({
    // NO elementId - this is a programmatic tool, not a DOM-click tool
    // The checkbox UI element exists for manual interaction only
    containerId: DemoContainers.DemoStateful.id,
    category: ToolCategory.USER_INTERACTION,
    callbacks: { storage: true },
    name: 'Toggle Feature',
    description: 'Enable or disable the feature flag (Advanced Demo - persists to localStorage)',
    aiEnabled: true,
    dangerLevel: 'safe',
    requiresApproval: false,
    examples: ['toggle feature', 'enable feature', 'disable feature', 'feature on', 'feature off'],
  })
  async toggleFeature(enabled: boolean) {
    await this.ensureInitialized();
    if (!this.stateManager) return { success: false, featureEnabled: enabled };
    
    await this.stateManager.merge('demo-stateful-widgets', { featureEnabled: enabled } as Partial<DemoWidgetState>);
    return { success: true, featureEnabled: enabled };
  }
  
  @Tool({
    // NO elementId - programmatic tool with parameter
    containerId: DemoContainers.DemoStateful.id,
    category: ToolCategory.USER_INTERACTION,
    callbacks: { storage: true },
    name: 'Toggle Notifications',
    description: 'Enable or disable notifications (Advanced Demo - persists to localStorage)',
    aiEnabled: true,
    dangerLevel: 'safe',
    requiresApproval: false,
    examples: ['toggle notifications', 'enable notifications', 'disable notifications', 'notifications on', 'notifications off'],
  })
  async toggleNotifications(enabled: boolean) {
    await this.ensureInitialized();
    if (!this.stateManager) return { success: false, notificationsEnabled: enabled };
    
    await this.stateManager.merge('demo-stateful-widgets', { notificationsEnabled: enabled } as Partial<DemoWidgetState>);
    return { success: true, notificationsEnabled: enabled };
  }
  
  @Tool({
    elementId: StatefulDemoNames.priorityHigh,
    containerId: DemoContainers.DemoStateful.id,
    callbacks: { storage: true },
    name: 'Set Priority High',
    description: 'Set priority to high (Advanced Demo - persists to localStorage)',
    aiEnabled: true,
    dangerLevel: 'safe',
    requiresApproval: false,
    examples: ['set priority high', 'priority high', 'high priority'],
  })
  async setPriorityHigh() {
    await this.ensureInitialized();
    if (!this.stateManager) return { success: false, priority: 'high' };
    
    await this.stateManager.merge('demo-stateful-widgets', { priority: 'high' } as Partial<DemoWidgetState>);
    return { success: true, priority: 'high' };
  }
  
  @Tool({
    elementId: StatefulDemoNames.priorityMedium,
    containerId: DemoContainers.DemoStateful.id,
    callbacks: { storage: true },
    name: 'Set Priority Medium',
    description: 'Set priority to medium (Advanced Demo - persists to localStorage)',
    aiEnabled: true,
    dangerLevel: 'safe',
    requiresApproval: false,
    examples: ['set priority medium', 'priority medium', 'medium priority'],
  })
  async setPriorityMedium() {
    await this.ensureInitialized();
    if (!this.stateManager) return { success: false, priority: 'medium' };
    
    await this.stateManager.merge('demo-stateful-widgets', { priority: 'medium' } as Partial<DemoWidgetState>);
    return { success: true, priority: 'medium' };
  }
  
  @Tool({
    elementId: StatefulDemoNames.priorityLow,
    containerId: DemoContainers.DemoStateful.id,
    callbacks: { storage: true },
    name: 'Set Priority Low',
    description: 'Set priority to low (Advanced Demo - persists to localStorage)',
    aiEnabled: true,
    dangerLevel: 'safe',
    requiresApproval: false,
    examples: ['set priority low', 'priority low', 'low priority'],
  })
  async setPriorityLow() {
    await this.ensureInitialized();
    if (!this.stateManager) return { success: false, priority: 'low' };
    
    await this.stateManager.merge('demo-stateful-widgets', { priority: 'low' } as Partial<DemoWidgetState>);
    return { success: true, priority: 'low' };
  }
  
  @Tool({
    elementId: StatefulDemoNames.statusDropdown,
    containerId: DemoContainers.DemoStateful.id,
    callbacks: { storage: true },
    name: 'Set Status',
    description: 'Change status (Advanced Demo - persists to localStorage)',
    aiEnabled: true,
    dangerLevel: 'safe',
    requiresApproval: false,
    examples: ['set status active', 'change status to pending', 'status completed'],
  })
  async changeStatus(status: string) {
    await this.ensureInitialized();
    if (!this.stateManager) return { success: false, message: 'State manager not initialized' };
    
    await this.stateManager.merge('demo-stateful-widgets', { status } as Partial<DemoWidgetState>);
    document.documentElement.setAttribute('data-status', status);
    return { success: true, message: `Status changed to ${status}`, status };
  }
  
  @Tool({
    // NO elementId - programmatic tool with parameter
    containerId: DemoContainers.DemoStateful.id,
    category: ToolCategory.USER_INTERACTION,
    callbacks: { storage: true },
    name: 'Change Theme',
    description: 'Change UI theme (Advanced Demo - persists to localStorage)',
    aiEnabled: true,
    dangerLevel: 'safe',
    requiresApproval: false,
    examples: [
      'theme light',
      'theme dark',
      'set theme dark', 
      'change theme to light', 
      'theme auto', 
      'dark mode', 
      'light mode',
      'switch to dark',
      'switch to light'
    ],
  })
  async changeTheme(theme: 'light' | 'dark' | 'auto') {
    await this.ensureInitialized();
    if (!this.stateManager) return { success: false, message: 'State manager not initialized' };
    
    // Widget-scoped theme (not global) - just update StateManager
    await this.stateManager.merge('demo-stateful-widgets', { theme } as Partial<DemoWidgetState>);
    // NOTE: Container div has data-theme attribute, no need to set document.documentElement
    return { success: true, message: `Theme changed to ${theme}`, theme };
  }
  
  @Tool({
    elementId: StatefulDemoNames.formSubmit,
    containerId: DemoContainers.DemoStateful.id,
    callbacks: { storage: true },
    name: 'Submit Form',
    description: 'Submit demo form (Advanced Demo)',
    aiEnabled: true,
    dangerLevel: 'safe',
    requiresApproval: false,
    examples: ['submit form', 'submit', 'send form'],
  })
  async submitForm(name: string) {
    await this.ensureInitialized();
    // Just a demo - doesn't persist form data
    return { success: true, message: 'Form submitted successfully', submitted: name };
  }
}

