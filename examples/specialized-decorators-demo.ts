/**
 * Demo: Specialized Tool Decorators
 * 
 * This demo showcases the simplified API for tool declaration using
 * specialized decorators and presets.
 * 
 * Compare:
 * - BEFORE: 15 lines of config per tool
 * - AFTER: 3-5 lines per tool (80% reduction!)
 */

import {
  AITool,
  TestTool,
  DangerousTool,
  DestructiveTool,
  OnboardingTool,
  DataReadTool,
  DataWriteTool,
  NavigationTool,
  ToolPreset,
  PresetTemplates,
  containerPreset,
  pathPreset,
} from "@supernalintelligence/interface-enterprise";
import { ToolCategory } from "@supernalintelligence/interface-enterprise";

// ============================================================================
// Example 1: Basic AI Tools (No Preset)
// ============================================================================

class BasicSearchTools {
  /**
   * Simple AI-enabled search
   * 3 lines instead of 15!
   */
  @AITool({ toolId: 'search-query' })
  async search(query: string) {
    console.log(`Searching for: ${query}`);
    return { results: [`Result for ${query}`] };
  }

  /**
   * Test-only tool (AI cannot use)
   */
  @TestTool({ toolId: 'reset-search-db' })
  async resetDatabase() {
    console.log('Database reset (test only)');
    return { success: true };
  }
}

// ============================================================================
// Example 2: Using ToolPreset for DRY
// ============================================================================

@ToolPreset({
  category: ToolCategory.CHAT,
  tags: ['chat', 'messaging'],
})
class ChatTools {
  /**
   * All tools inherit: category, containerId, tags from preset
   * Only need to specify unique properties!
   */
  @AITool({ toolId: 'send-message' })
  async sendMessage(text: string) {
    console.log(`Sending: ${text}`);
    return { sent: true, timestamp: Date.now() };
  }

  @AITool({ toolId: 'clear-chat' })
  async clearChat() {
    console.log('Chat cleared');
    return { cleared: true };
  }

  /**
   * Override preset category for this specific tool
   */
  @AITool({
    toolId: 'export-chat',
    category: ToolCategory.DATA, // Override preset
  })
  async exportChatHistory() {
    console.log('Exporting chat...');
    return { exported: true };
  }
}

// ============================================================================
// Example 3: Using Preset Templates
// ============================================================================

@ToolPreset(PresetTemplates.Navigation)
class NavigationTools {
  /**
   * Inherits:
   * - category: NAVIGATION
   * - tags: ['navigation', 'routing']
   * - executionContext: 'ui'
   * - callbacks.navigation: true
   */
  @NavigationTool({ toolId: 'goto-settings' })
  async goToSettings() {
    console.log('Navigating to settings');
    return { navigated: true };
  }

  @NavigationTool({ toolId: 'goto-dashboard' })
  async goToDashboard() {
    console.log('Navigating to dashboard');
    return { navigated: true };
  }
}

// ============================================================================
// Example 4: Dangerous Operations
// ============================================================================

@ToolPreset({
  category: ToolCategory.DATA,
  tags: ['data-management'],
})
class DataManagementTools {
  /**
   * Safe read operation (no approval needed)
   */
  @DataReadTool({ toolId: 'fetch-users' })
  async fetchUsers(filters: { role?: string }) {
    console.log('Fetching users...', filters);
    return { users: [] };
  }

  /**
   * Write operation (requires approval)
   */
  @DataWriteTool({ toolId: 'update-user' })
  async updateUser(userId: string, data: any) {
    console.log(`Updating user ${userId}`, data);
    return { updated: true };
  }

  /**
   * Dangerous operation (requires explicit approval)
   */
  @DangerousTool({
    toolId: 'delete-user',
    description: 'Permanently delete user account',
  })
  async deleteUser(userId: string) {
    console.log(`Deleting user ${userId}`);
    return { deleted: true };
  }

  /**
   * Destructive operation (irreversible, requires approval)
   */
  @DestructiveTool({
    toolId: 'purge-all-data',
    description: 'Delete ALL data - cannot be undone!',
  })
  async purgeAllData() {
    console.log('PURGING ALL DATA');
    return { purged: true };
  }
}

// ============================================================================
// Example 5: Onboarding & Help System
// ============================================================================

@ToolPreset(PresetTemplates.Onboarding)
class OnboardingSystem {
  /**
   * Show contextual help
   */
  @OnboardingTool({ toolId: 'show-tooltip' })
  async showTooltip(elementId: string, message: string) {
    console.log(`Showing tooltip on ${elementId}: ${message}`);
    return { shown: true };
  }

  /**
   * Start feature tour
   */
  @OnboardingTool({ toolId: 'start-tour' })
  async startFeatureTour(tourId: string) {
    console.log(`Starting tour: ${tourId}`);
    return { started: true };
  }

  /**
   * Mark step complete
   */
  @OnboardingTool({ toolId: 'complete-step' })
  async completeOnboardingStep(stepId: string) {
    console.log(`Completed step: ${stepId}`);
    return { completed: true };
  }
}

// ============================================================================
// Example 6: Container Preset (for modals/dialogs)
// ============================================================================

@ToolPreset(containerPreset('settings-modal', ToolCategory.SETTINGS))
class SettingsModalTools {
  /**
   * All tools automatically know they're in 'settings-modal'
   */
  @AITool({ toolId: 'save-settings' })
  async saveSettings(settings: any) {
    console.log('Saving settings...', settings);
    return { saved: true };
  }

  @AITool({ toolId: 'reset-settings' })
  async resetToDefaults() {
    console.log('Resetting to defaults');
    return { reset: true };
  }
}

// ============================================================================
// Example 7: Path Preset (for specific routes)
// ============================================================================

@ToolPreset(pathPreset('/dashboard', ToolCategory.DATA))
class DashboardPageTools {
  /**
   * Tools that only work on /dashboard route
   */
  @AITool({ toolId: 'refresh-dashboard' })
  async refreshDashboard() {
    console.log('Refreshing dashboard data');
    return { refreshed: true };
  }

  @AITool({ toolId: 'export-dashboard' })
  async exportDashboard() {
    console.log('Exporting dashboard');
    return { exported: true };
  }
}

// ============================================================================
// Example 8: Mixed AI and Test Tools
// ============================================================================

@ToolPreset({
  category: ToolCategory.UTILITY,
  tags: ['utility'],
})
class UtilityTools {
  /**
   * AI can use this
   */
  @AITool({ toolId: 'format-date' })
  async formatDate(date: Date) {
    return { formatted: date.toISOString() };
  }

  /**
   * Only for testing
   */
  @TestTool({ toolId: 'mock-time' })
  async setMockTime(time: number) {
    console.log('Setting mock time (test only)');
    return { mocked: true };
  }

  /**
   * Dangerous utility (requires approval)
   */
  @DangerousTool({ toolId: 'clear-cache' })
  async clearAllCaches() {
    console.log('Clearing all caches');
    return { cleared: true };
  }
}

// ============================================================================
// Demo Usage
// ============================================================================

async function runDemo() {
  console.log('='.repeat(60));
  console.log('Specialized Tool Decorators Demo');
  console.log('='.repeat(60));

  // Basic search
  console.log('\n1. Basic Search Tools:');
  const search = new BasicSearchTools();
  await search.search('TypeScript decorators');

  // Chat with preset
  console.log('\n2. Chat Tools (with preset):');
  const chat = new ChatTools();
  await chat.sendMessage('Hello!');
  await chat.clearChat();

  // Navigation
  console.log('\n3. Navigation Tools:');
  const nav = new NavigationTools();
  await nav.goToSettings();

  // Data management (various danger levels)
  console.log('\n4. Data Management Tools:');
  const data = new DataManagementTools();
  await data.fetchUsers({ role: 'admin' });
  await data.updateUser('user-123', { name: 'John' });

  // Onboarding
  console.log('\n5. Onboarding Tools:');
  const onboarding = new OnboardingSystem();
  await onboarding.showTooltip('search-button', 'Click here to search');
  await onboarding.startFeatureTour('welcome-tour');

  // Settings modal
  console.log('\n6. Settings Modal Tools:');
  const settings = new SettingsModalTools();
  await settings.saveSettings({ theme: 'dark' });

  // Dashboard
  console.log('\n7. Dashboard Tools:');
  const dashboard = new DashboardPageTools();
  await dashboard.refreshDashboard();

  console.log('\n' + '='.repeat(60));
  console.log('Demo Complete!');
  console.log('='.repeat(60));
}

// Export for use in tests or other demos
export {
  BasicSearchTools,
  ChatTools,
  NavigationTools,
  DataManagementTools,
  OnboardingSystem,
  SettingsModalTools,
  DashboardPageTools,
  UtilityTools,
  runDemo,
};

// Run demo if executed directly
if (require.main === module) {
  runDemo().catch(console.error);
}

