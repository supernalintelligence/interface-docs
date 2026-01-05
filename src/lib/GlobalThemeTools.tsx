/**
 * Global Theme Tools
 * These tools work from ANY page because they have NO containerId
 */

import { Tool, ToolCategory } from "@supernal/interface/browser";
import { themeManager } from './ThemeManager';

/**
 * Global theme tool - Set to light mode
 * No elementId/containerId = globally available from any page
 */
export const setThemeLight = Tool({
  name: 'SetThemeLight',
  description: 'Change theme to light mode',
  category: ToolCategory.USER_INTERACTION,
  aiEnabled: true,
  dangerLevel: 'safe',
  examples: ['light mode', 'set theme light', 'switch to light', 'change to light', 'light theme', 'theme light'],
  executionContext: 'ui',
  returnType: 'json'
})(async () => {
  themeManager.setTheme('light');
  return { 
    success: true, 
    message: 'Theme changed to light' 
  };
});

/**
 * Global theme tool - Set to dark mode
 * No elementId/containerId = globally available from any page
 */
export const setThemeDark = Tool({
  name: 'SetThemeDark',
  description: 'Change theme to dark mode',
  category: ToolCategory.USER_INTERACTION,
  aiEnabled: true,
  dangerLevel: 'safe',
  examples: ['dark mode', 'set theme dark', 'switch to dark', 'change to dark', 'dark theme', 'theme dark'],
  executionContext: 'ui',
  returnType: 'json'
})(async () => {
  themeManager.setTheme('dark');
  return { 
    success: true, 
    message: 'Theme changed to dark' 
  };
});

/**
 * Global theme tool - Set to auto (follow system)
 * No elementId/containerId = globally available from any page
 */
export const setThemeAuto = Tool({
  name: 'SetThemeAuto',
  description: 'Set theme to follow system preference (automatic)',
  category: ToolCategory.USER_INTERACTION,
  aiEnabled: true,
  dangerLevel: 'safe',
  examples: ['auto theme', 'automatic theme', 'follow system theme', 'system theme', 'theme auto'],
  executionContext: 'ui',
  returnType: 'json'
})(async () => {
  themeManager.setTheme('auto');
  const currentTheme = themeManager.getTheme();
  return { 
    success: true, 
    message: `Theme set to auto (currently following system: ${currentTheme})` 
  };
});

/**
 * Query current theme
 */
export const getTheme = Tool({
  name: 'GetTheme',
  description: 'Get current theme setting',
  category: ToolCategory.CONTENT_RETRIEVAL,
  aiEnabled: false, // Hidden from UI - should not be triggered by user commands
  dangerLevel: 'safe',
  examples: [], // Empty examples so it doesn't match user queries
  executionContext: 'ui',
  returnType: 'json'
})(() => {
  return { 
    theme: themeManager.getTheme() 
  };
});
