/**
 * Simple Counter Demo - Timeline Annotated
 * 
 * This story demonstrates the Timeline Manager with precise narration sync.
 */

const { chromium } = require('playwright');
const { smartNarrationWait } = require('../../enterprise/dist/cjs/video/StoryNarrationHelper');

async function runStory() {
  const browser = await chromium.launch({ slowMo: 100 });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: 'videos/stories',
      size: { width: 1280, height: 720 },
    },
  });
  const page = await context.newPage();

  try {
    console.log('📱 Opening interface demo...');
    
    // ACTION_START: open-examples
    await page.goto('http://localhost:3000/examples');
    await page.waitForLoadState('networkidle');
    // ACTION_END: open-examples
    
    // NARRATE: after, action=open-examples, offset=0.5
    // "Welcome to the examples page! Let's interact with the counter."
    await smartNarrationWait(page, 'open-examples');
    
    await page.waitForTimeout(500);
    
    // ACTION_START: find-counter
    const counterWidget = page.locator('[data-testid="counter-widget"]');
    await counterWidget.scrollIntoViewIfNeeded();
    // ACTION_END: find-counter
    
    // NARRATE: during, action=find-counter, offset=0.2
    // "I'm scrolling to the counter widget"
    await smartNarrationWait(page, 'find-counter');
    
    await page.waitForTimeout(300);
    
    // ACTION_START: click-increment
    const incrementButton = page.locator('[data-testid="counter-increment"]');
    await incrementButton.click();
    await page.waitForTimeout(300);
    // ACTION_END: click-increment
    
    // NARRATE: during, action=click-increment, offset=0.1
    // "Now I'm clicking the increment button"
    await smartNarrationWait(page, 'click-increment');
    
    // ACTION_START: click-increment-again
    await incrementButton.click();
    await page.waitForTimeout(300);
    // ACTION_END: click-increment-again
    
    // NARRATE: after, action=click-increment-again, offset=0.3
    // "Great! The counter has been incremented twice. Demo complete."
    await smartNarrationWait(page, 'click-increment-again');
    
    await page.waitForTimeout(1000);

    console.log('✅ Story complete!');

  } catch (error) {
    console.error('❌ Story failed:', error.message);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

runStory();

