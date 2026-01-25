import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

/**
 * Playwright config for video recording
 * Extends base docs-site config with video recording enabled
 */
export default defineConfig({
  ...baseConfig,
  
  // Override for video recording
  fullyParallel: false, // Sequential for predictable recording
  retries: 0, // No retries
  workers: 1, // Single worker
  
  use: {
    ...baseConfig.use,
    
    // Enable video recording
    video: 'on',
    
    // Show browser (headful mode)
    headless: false,
    
    // Slow down execution to make it visible
    launchOptions: {
      slowMo: 800, // 800ms delay between actions
    },
    
    // Increase timeouts for slower execution
    actionTimeout: 3000,
  },
  
  // Save videos to workspace root videos directory
  outputDir: '../videos/test-results',
});
