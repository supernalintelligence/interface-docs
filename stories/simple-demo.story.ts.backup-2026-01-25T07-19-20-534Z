/**
 * Simple Demo Story
 * 
 * Demonstrates the counter and menu widgets using name contracts
 */

import { chromium } from 'playwright';

// Name contracts from StatefulDemoNames
const Demo = {
  container: 'stateful-demo-container',
  incrementButton: 'stateful-increment-button',
  decrementButton: 'stateful-decrement-button',
  resetButton: 'stateful-reset-button',
  openMenu: 'stateful-open-menu',
  closeMenu: 'stateful-close-menu',
};

// Helper to generate testId selector
const testId = (id: string) => `[data-testid="${id}"]`;

async function runStory() {
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 1000 // Slow down for visibility
  });
  
  const context = await browser.newContext({
    recordVideo: {
      dir: './videos/stories',
      size: { width: 1280, height: 720 }
    }
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate to comparison page (has SimplifiedInteractiveWidgets with test IDs)
    console.log('📱 Opening comparison page...');
    await page.goto(`http://localhost:3011/comparison`);
    await page.waitForLoadState('networkidle');
    
    // Wait for React to hydrate and widgets to appear
    console.log('⏳ Waiting for widgets to load...');
    await page.waitForSelector(testId(Demo.incrementButton), { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Test counter widget
    console.log('\n🔢 Testing Counter Widget:');
    
    // Increment 3 times
    console.log('  - Clicking increment 3 times...');
    for (let i = 0; i < 3; i++) {
      await page.locator(testId(Demo.incrementButton)).click();
      await page.waitForTimeout(800);
    }
    
    // Decrement once
    console.log('  - Clicking decrement once...');
    await page.locator(testId(Demo.decrementButton)).click();
    await page.waitForTimeout(800);
    
    // Reset
    console.log('  - Resetting counter...');
    await page.locator(testId(Demo.resetButton)).click();
    await page.waitForTimeout(800);
    
    console.log('\n✅ Story complete!');
    
  } catch (error) {
    console.error('\n❌ Story failed:', error);
    throw error;
  } finally {
    // Close context to save video
    await context.close();
    await browser.close();
    
    console.log('\n🎥 Video saved to: ./videos/stories/');
  }
}

// Run the story
runStory().catch((error) => {
  console.error(error);
  process.exit(1);
});
