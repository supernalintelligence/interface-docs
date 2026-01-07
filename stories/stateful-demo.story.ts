const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { Chat, Examples } = require('../src/architecture/DemoComponentNames');

// Import NEW narration helper
const { initializeNarrationSession, smartNarrationWait, finalizeNarrationSession } = require('../../enterprise/dist/cjs/video/StoryNarrationHelper');

// Read dev port from .dev-port file
function getDevServerPort() {
  try {
    const portFile = path.resolve(__dirname, '../.dev-port');
    const port = fs.readFileSync(portFile, 'utf-8').trim();
    return parseInt(port, 10);
  } catch {
    return 3000; // fallback
  }
}

// Use name contracts - NO MAGIC STRINGS!
const CHAT_INPUT_TEST_ID = Chat.input;
const CHAT_SEND_BUTTON_TEST_ID = Chat.sendButton;
const COUNTER_WIDGET_TEST_ID = Examples.counterWidget;

async function runStory() {
  let browser;
  try {
    const port = getDevServerPort();
    const baseUrl = `http://localhost:${port}`;
    const storyName = path.basename(__filename, '.story.ts');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const outputDir = path.resolve(process.cwd(), `videos/stories/${storyName}-${timestamp}`);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    browser = await chromium.launch({
      headless: false,
      slowMo: 100, // Slightly slower for visibility
      args: [
        '--start-maximized', // Start browser maximized
        '--disable-infobars', // Hide "Chrome is being controlled" banner
        '--disable-blink-features=AutomationControlled', // Make it look less like automation
      ],
    });
    
    const context = await browser.newContext({
      recordVideo: {
        dir: outputDir,
        size: { width: 1920, height: 1200 }, // Keep working width, just taller for bottom content
      },
      viewport: { width: 1920, height: 1200 }, // 16:10 aspect ratio
    });
    
    const page = await context.newPage();

    // Initialize narration session (start timestamp recording)
    await initializeNarrationSession(page);

    console.log(`📱 Opening home page...`);
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500); // Brief pause to ensure full render
    
    // === WELCOME ===
    // ACTION_START: welcome
    // NARRATE: before, action=welcome
    // "Welcome to Supernal Interface! In this video, we'll demonstrate how you can use AI-compatible tool calls to control your site. We're using our own site as a demonstration. You can do this yourself or look at our video!"
    await smartNarrationWait(page, 'welcome');
    await page.waitForTimeout(1000);
    // ACTION_END: welcome

    // === STEP 1: Navigate to Examples page ===
    // ACTION_START: navigate-to-examples
    console.log(`\n🔍 Step 1: Navigate to Examples page`);
    await page.waitForSelector(`[data-testid="${CHAT_INPUT_TEST_ID}"]`, { state: 'visible', timeout: 10000 });
    
    const chatInput = page.locator(`[data-testid="${CHAT_INPUT_TEST_ID}"]`);
    const chatSendButton = page.locator(`[data-testid="${CHAT_SEND_BUTTON_TEST_ID}"]`);

    const navCommand = `Navigate to examples page`;
    console.log(`💬 User types: "${navCommand}"`);
    await chatInput.fill(''); // Clear first
    await chatInput.pressSequentially(navCommand, { delay: 30 });
    // NARRATE: during, action=navigate-to-examples
    // "I'm using natural language to navigate to the examples page. Watch as the AI interprets this command."
    await smartNarrationWait(page, 'navigate-to-examples');
    await page.waitForTimeout(300);
    
    console.log(`📤 User clicks send...`);
    await chatSendButton.click();
    
    console.log(`⏳ Waiting for navigation to /examples...`);
    await page.waitForURL('**/examples', { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    // ACTION_END: navigate-to-examples
    
    // NARRATE: after, action=navigate-to-examples
    // "Perfect! We've successfully navigated to the examples page."
    await smartNarrationWait(page, 'narrate-examples-success');
    await page.waitForTimeout(1500);

    // === STEP 2: Increment counter ===
    // ACTION_START: increment-counter
    console.log(`\n➕ Step 2: Increment the counter`);
    const incrementCommand = `Increment the counter`;
    console.log(`💬 User types: "${incrementCommand}"`);
    await chatInput.fill('');
    await chatInput.pressSequentially(incrementCommand, { delay: 30 });
    // NARRATE: during, action=increment-counter
    // "Now I'll ask the AI to increment the counter. Watch as it automatically executes the tool."
    await smartNarrationWait(page, 'increment-counter');
    await page.waitForTimeout(300);
    
    console.log(`📤 User clicks send...`);
    await chatSendButton.click();
    
    console.log(`⏳ Waiting for counter to increment...`);
    await page.waitForTimeout(1000);
    // ACTION_END: increment-counter
    
    // Scroll to counter to show the change
    console.log(`📍 Scrolling to counter widget...`);
    const counterWidget = page.locator(`[data-testid="${COUNTER_WIDGET_TEST_ID}"]`).first();
    await counterWidget.scrollIntoViewIfNeeded();
    // NARRATE: after, action=increment-counter
    // "Excellent! The counter has been incremented. The AI tool executed successfully."
    await smartNarrationWait(page, 'narrate-counter-success');
    await page.waitForTimeout(1500);

    // === STEP 3: Navigate to Blog ===
    // ACTION_START: navigate-to-blog
    console.log(`\n📝 Step 3: Navigate to Blog`);
    const blogCommand = `Go to blog`;
    console.log(`💬 User types: "${blogCommand}"`);
    await chatInput.fill('');
    await chatInput.pressSequentially(blogCommand, { delay: 30 });
    // NARRATE: during, action=navigate-to-blog
    // "Let's navigate to the blog section with another natural language command."
    await smartNarrationWait(page, 'navigate-to-blog');
    await page.waitForTimeout(300);
    
    console.log(`📤 User clicks send...`);
    await chatSendButton.click();
    
    console.log(`⏳ Waiting for navigation to /blog...`);
    await page.waitForURL('**/blog', { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    // ACTION_END: navigate-to-blog
    
    // NARRATE: after, action=navigate-to-blog
    // "Great! We're now on the blog page."
    await smartNarrationWait(page, 'narrate-blog-success');
    await page.waitForTimeout(1500);

    // === STEP 4: Open a blog post ===
    // ACTION_START: open-blog-post
    console.log(`\n📖 Step 4: Open AI-Woven blog post`);
    const openPostCommand = `Open blog AI-Woven`;
    console.log(`💬 User types: "${openPostCommand}"`);
    await chatInput.fill('');
    await chatInput.pressSequentially(openPostCommand, { delay: 30 });
    // NARRATE: during, action=open-blog-post
    // "Now I'll open the AI-Woven blog post."
    await smartNarrationWait(page, 'open-blog-post');
    await page.waitForTimeout(300);
    
    console.log(`📤 User clicks send...`);
    await chatSendButton.click();
    
    console.log(`⏳ Waiting for blog post to open...`);
    await page.waitForTimeout(2500);
    // ACTION_END: open-blog-post
    
    // NARRATE: after, action=open-blog-post
    // "Perfect! The AI-Woven blog post opened successfully."
    await smartNarrationWait(page, 'narrate-post-success');

    console.log(`\n✅ Story complete!`);
    console.log(`   Video shows: Home → Examples → Increment → Blog → Post\n`);

    // Finalize narration session BEFORE closing context
    await finalizeNarrationSession(page);

    await context.close();
    
    const videoFiles = fs.readdirSync(outputDir).filter((f: string) => f.endsWith('.webm'));
    if (videoFiles.length > 0) {
      const videoPath = path.join(outputDir, videoFiles[0]);
      const finalPath = path.join(outputDir, `${storyName}.webm`);
      fs.renameSync(videoPath, finalPath);
      console.log(`🎥 Video saved to: ${finalPath}\n`);
    }

  } catch (error: any) {
    console.error(`\n❌ Story failed: ${error.message}`);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runStory().catch((error: any) => {
  console.error(error);
  process.exit(1);
});
