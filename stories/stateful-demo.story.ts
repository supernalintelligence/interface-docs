const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { Chat, Examples } = require('../src/architecture/DemoComponentNames');

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
    });
    
    const context = await browser.newContext({
      recordVideo: {
        dir: outputDir,
        size: { width: 1280, height: 720 },
      },
    });
    
    const page = await context.newPage();

    console.log(`📱 Opening home page...`);
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // === STEP 1: Navigate to Examples page ===
    // NARRATE: "Welcome! Let's start by navigating to the examples page using natural language."
    console.log(`\n🔍 Step 1: Navigate to Examples page`);
    await page.waitForSelector(`[data-testid="${CHAT_INPUT_TEST_ID}"]`, { state: 'visible', timeout: 10000 });
    
    const chatInput = page.locator(`[data-testid="${CHAT_INPUT_TEST_ID}"]`);
    const chatSendButton = page.locator(`[data-testid="${CHAT_SEND_BUTTON_TEST_ID}"]`);

    const navCommand = `Navigate to examples page`;
    console.log(`💬 User types: "${navCommand}"`);
    await chatInput.fill(''); // Clear first
    await chatInput.pressSequentially(navCommand, { delay: 30 }); // Faster typing
    await page.waitForTimeout(300);
    
    console.log(`📤 User clicks send...`);
    await chatSendButton.click();
    
    console.log(`⏳ Waiting for navigation to /examples...`);
    await page.waitForURL('**/examples', { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    // NARRATE: "Great! We're now on the examples page. Notice how the AI understood our natural language command."
    await page.waitForTimeout(1500); // Show the examples page

    // === STEP 2: Increment counter ===
    // NARRATE: "Now let's ask the AI to increment the counter. Watch as it executes the tool automatically."
    console.log(`\n➕ Step 2: Increment the counter`);
    const incrementCommand = `Increment the counter`;
    console.log(`💬 User types: "${incrementCommand}"`);
    await chatInput.fill('');
    await chatInput.pressSequentially(incrementCommand, { delay: 30 });
    await page.waitForTimeout(300);
    
    console.log(`📤 User clicks send...`);
    await chatSendButton.click();
    
    console.log(`⏳ Waiting for counter to increment...`);
    await page.waitForTimeout(1000);
    
    // Scroll to counter to show the change (use .first() as there are multiple)
    console.log(`📍 Scrolling to counter widget...`);
    const counterWidget = page.locator(`[data-testid="${COUNTER_WIDGET_TEST_ID}"]`).first();
    await counterWidget.scrollIntoViewIfNeeded();
    // NARRATE: "Perfect! The counter has incremented. The AI tool executed successfully, updating the UI in real-time."
    await page.waitForTimeout(1500); // Show counter value changed

    // === STEP 3: Navigate to Blog ===
    // NARRATE: "Next, we'll navigate to the blog section using another natural language command."
    console.log(`\n📝 Step 3: Navigate to Blog`);
    const blogCommand = `Go to blog`;
    console.log(`💬 User types: "${blogCommand}"`);
    await chatInput.fill('');
    await chatInput.pressSequentially(blogCommand, { delay: 30 });
    await page.waitForTimeout(300);
    
    console.log(`📤 User clicks send...`);
    await chatSendButton.click();
    
    console.log(`⏳ Waiting for navigation to /blog...`);
    await page.waitForURL('**/blog', { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    // NARRATE: "We're now on the blog page. Let's demonstrate ordinal matching by opening the first blog post."
    await page.waitForTimeout(1500); // Show the blog page

    // === STEP 4: Open a blog post ===
    // NARRATE: "Finally, we'll use ordinal matching to open the first blog post. The AI understands positional language like 'first', 'second', and 'last'."
    console.log(`\n📖 Step 4: Open first blog post (using ordinal matching)`);
    const openPostCommand = `Open the first blog post`;
    console.log(`💬 User types: "${openPostCommand}"`);
    await chatInput.fill('');
    await chatInput.pressSequentially(openPostCommand, { delay: 30 });
    await page.waitForTimeout(300);
    
    console.log(`📤 User clicks send...`);
    await chatSendButton.click();
    
    console.log(`⏳ Waiting for blog post to open...`);
    // NARRATE: "Excellent! The AI successfully opened the first blog post using ordinal matching. This demonstrates the power of natural language interface design."
    await page.waitForTimeout(2500); // Wait for post to open

    console.log(`\n✅ Story complete!`);
    console.log(`   Video shows: Home → Examples → Increment → Blog → Post\n`);

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
