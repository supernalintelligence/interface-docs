/**
 * YC Demo Story - Complete User Journey
 * 
 * Full flow showing:
 * 1. supernal.ai landing page
 * 2. Login to dashboard
 * 3. Onboarding flow for new user
 * 4. Dashboard features
 * 
 * This demonstrates the complete Supernal platform experience for YC application.
 */

const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Simple narration wait function (replaces enterprise helper)
async function smartNarrationWait(page, action) {
  console.log(`🎬 ${action}`);
  await page.waitForTimeout(1000);
}

async function initializeNarrationSession(page) {
  console.log('🎥 Initializing recording session');
}

async function finalizeNarrationSession(page) {
  console.log('🎬 Finalizing recording session');
}

// Landing Page Configuration
const LANDING_PAGE_PORT = 3001;
const LANDING_PAGE_URL = `http://localhost:${LANDING_PAGE_PORT}`;

// Dashboard Configuration  
const DASHBOARD_PORT = 3000;
const DASHBOARD_URL = `http://localhost:${DASHBOARD_PORT}`;

// Component testids from dashboard Components.ts contract
const Components = {
  // Onboarding
  QuickProfileModal: 'quick-profile-modal',
  ProfileNameInput: 'profile-name-input',
  ProfileEmailInput: 'profile-email-input',
  ProfileRoleSelect: 'profile-role-select',
  ProfileTeamSelect: 'profile-team-select',
  ProfileTimezoneSelect: 'profile-timezone-select',
  ProfileSaveButton: 'profile-save-button',
  OnboardingProgress: 'onboarding-progress',
  OnboardingNextButton: 'onboarding-next-button',
  OnboardingCompleteButton: 'onboarding-complete-button',

  // Navigation
  NavSidebar: 'nav-sidebar',
  NavDashboardLink: 'nav-dashboard-link',
  NavProjectsLink: 'nav-projects-link',
  NavSettingsLink: 'nav-settings-link',

  // Chat Interface
  ChatContainer: 'chat-container',
  ChatInputTextarea: 'chat-input-textarea',
  ChatSendButton: 'chat-send-button',

  // Dashboard
  DashboardGrid: 'dashboard-grid',
  DashboardWidget: 'dashboard-widget',
  StatsCardTotal: 'stats-card-total',
  ActivityFeed: 'activity-feed',

  // Settings
  SettingsContainer: 'settings-container',
};

async function runStory() {
  let browser;
  let context;

  try {
    const storyName = path.basename(__filename, '.story.ts');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const outputDir = path.resolve(process.cwd(), `videos/stories/${storyName}-${timestamp}`);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    browser = await chromium.launch({
      headless: false,
      slowMo: 150, // Slower for demo clarity
      args: [
        '--window-size=1680,1050',
        '--disable-infobars',
        '--disable-blink-features=AutomationControlled',
      ],
    });

    context = await browser.newContext({
      recordVideo: {
        dir: outputDir,
        size: { width: 1680, height: 1050 },
      },
      viewport: { width: 1680, height: 1050 },
    });

    const page = await context.newPage();

    // Initialize narration session
    await initializeNarrationSession(page);

    // ═══════════════════════════════════════════════════════════════
    // STEP 1: SUPERNAL.AI LANDING PAGE
    // ═══════════════════════════════════════════════════════════════

    // ACTION_START: landing-page
    console.log(`\n🏠 STEP 1: Supernal.ai Landing Page`);
    console.log(`📱 Opening ${LANDING_PAGE_URL}...`);
    
    await page.goto(LANDING_PAGE_URL);
    await page.waitForLoadState('networkidle');
    
    // NARRATE: "Welcome to Supernal! This is our AI-powered platform that transforms how teams work. Let me show you the complete user journey from landing page to dashboard."
    await smartNarrationWait(page, 'landing-intro');
    await page.waitForTimeout(2000);

    // Show key landing page sections
    console.log(`🎯 Showcasing landing page features...`);
    
    // Scroll to show hero section
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    
    // NARRATE: "Our landing page highlights the key value propositions - AI automation, team collaboration, and seamless workflow integration."
    await smartNarrationWait(page, 'landing-features');
    
    // Scroll to features section
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1500);
    
    // Scroll to CTA section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    // ACTION_END: landing-page

    // ═══════════════════════════════════════════════════════════════
    // STEP 2: NAVIGATE TO DASHBOARD (SIMULATE LOGIN)
    // ═══════════════════════════════════════════════════════════════

    // ACTION_START: navigate-to-dashboard
    console.log(`\n🚪 STEP 2: Navigate to Dashboard`);
    
    // NARRATE: "Now let's log into the dashboard to see the full platform experience."
    await smartNarrationWait(page, 'navigate-dashboard');
    
    console.log(`🔗 Navigating to dashboard at ${DASHBOARD_URL}...`);
    await page.goto(DASHBOARD_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    // ACTION_END: navigate-to-dashboard

    // ═══════════════════════════════════════════════════════════════
    // STEP 3: ONBOARDING FLOW FOR NEW USER
    // ═══════════════════════════════════════════════════════════════

    // ACTION_START: onboarding-flow
    console.log(`\n👋 STEP 3: Onboarding Flow`);
    
    // Check if onboarding modal appears (new user simulation)
    try {
      await page.waitForSelector(`[data-testid="${Components.QuickProfileModal}"]`, { timeout: 3000 });
      console.log(`✅ Quick Profile Modal detected`);
      
      // NARRATE: "For new users, we show a quick profile setup to personalize their experience."
      await smartNarrationWait(page, 'onboarding-start');
      
      // Fill in profile information
      console.log(`📝 Filling profile information...`);
      
      const nameInput = page.locator(`[data-testid="${Components.ProfileNameInput}"]`);
      if (await nameInput.count() > 0) {
        await nameInput.pressSequentially('Alex Chen', { delay: 50 });
        await page.waitForTimeout(500);
      }
      
      const emailInput = page.locator(`[data-testid="${Components.ProfileEmailInput}"]`);
      if (await emailInput.count() > 0) {
        await emailInput.pressSequentially('alex@company.com', { delay: 50 });
        await page.waitForTimeout(500);
      }
      
      // NARRATE: "Users enter their basic information to get started quickly."
      await smartNarrationWait(page, 'profile-fill');
      
      // Save profile
      const saveButton = page.locator(`[data-testid="${Components.ProfileSaveButton}"]`);
      if (await saveButton.count() > 0) {
        await saveButton.click();
        await page.waitForTimeout(1000);
      }
      
      // Continue through onboarding steps
      const nextButton = page.locator(`[data-testid="${Components.OnboardingNextButton}"]`);
      if (await nextButton.count() > 0) {
        await nextButton.click();
        await page.waitForTimeout(1500);
        
        // NARRATE: "The onboarding guides users through key features step by step."
        await smartNarrationWait(page, 'onboarding-steps');
      }
      
      // Complete onboarding
      const completeButton = page.locator(`[data-testid="${Components.OnboardingCompleteButton}"]`);
      if (await completeButton.count() > 0) {
        await completeButton.click();
        await page.waitForTimeout(2000);
      }
      
    } catch (error) {
      console.log(`ℹ️  No onboarding modal found - simulating experienced user`);
      // NARRATE: "For returning users, we jump straight to the dashboard experience."
      await smartNarrationWait(page, 'returning-user');
    }
    // ACTION_END: onboarding-flow

    // ═══════════════════════════════════════════════════════════════
    // STEP 4: DASHBOARD FEATURES
    // ═══════════════════════════════════════════════════════════════

    // ACTION_START: dashboard-features
    console.log(`\n📊 STEP 4: Dashboard Features`);
    
    // Wait for main dashboard components to load
    await page.waitForSelector(`[data-testid="${Components.ChatContainer}"]`, { timeout: 10000 });
    console.log(`✅ Dashboard loaded`);
    
    // NARRATE: "Welcome to the Supernal dashboard - your central hub for AI-powered productivity."
    await smartNarrationWait(page, 'dashboard-overview');
    await page.waitForTimeout(2000);

    // Demonstrate Chat Interface
    console.log(`💬 Demonstrating chat interface...`);
    const chatInput = page.locator(`[data-testid="${Components.ChatInputTextarea}"]`);
    await chatInput.waitFor({ state: 'visible', timeout: 5000 });
    
    await chatInput.pressSequentially('Show me my current projects and tasks', { delay: 60 });
    await page.waitForTimeout(2000);
    
    // NARRATE: "Users can interact with AI using natural language to get insights about their work."
    await smartNarrationWait(page, 'chat-demo');
    
    const chatSendButton = page.locator(`[data-testid="${Components.ChatSendButton}"]`);
    if (await chatSendButton.count() > 0) {
      await chatSendButton.click();
      await page.waitForTimeout(2000);
    }

    // Navigate to different dashboard sections
    console.log(`🧭 Exploring navigation features...`);
    
    // Navigate to Projects (if available)
    const projectsLink = page.locator(`[data-testid="${Components.NavProjectsLink}"]`);
    if (await projectsLink.count() > 0) {
      await projectsLink.click();
      await page.waitForTimeout(2000);
      
      // NARRATE: "The projects section shows all active work streams and their current status."
      await smartNarrationWait(page, 'projects-view');
    }

    // Navigate to Settings
    console.log(`⚙️ Showing settings page...`);
    const settingsLink = page.locator(`[data-testid="${Components.NavSettingsLink}"]`);
    if (await settingsLink.count() > 0) {
      await settingsLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // NARRATE: "Settings allow users to customize their experience and manage team preferences."
      await smartNarrationWait(page, 'settings-view');
    }

    // Return to main dashboard
    console.log(`🏠 Returning to main dashboard...`);
    const dashboardLink = page.locator(`[data-testid="${Components.NavDashboardLink}"]`);
    if (await dashboardLink.count() > 0) {
      await dashboardLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }

    // Show dashboard widgets and stats
    console.log(`📈 Highlighting dashboard widgets...`);
    const dashboardGrid = page.locator(`[data-testid="${Components.DashboardGrid}"]`);
    if (await dashboardGrid.count() > 0) {
      await dashboardGrid.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      
      // NARRATE: "The dashboard provides real-time insights, activity feeds, and key metrics at a glance."
      await smartNarrationWait(page, 'dashboard-widgets');
    }

    // Final demo interaction
    console.log(`🎯 Final AI interaction demo...`);
    await chatInput.fill('');
    await chatInput.pressSequentially('Create a summary of today\'s activity', { delay: 50 });
    await page.waitForTimeout(1500);
    
    // NARRATE: "Users can ask for summaries, reports, and insights - the AI understands context and provides relevant information."
    await smartNarrationWait(page, 'final-interaction');
    
    if (await chatSendButton.count() > 0) {
      await chatSendButton.click();
      await page.waitForTimeout(2000);
    }
    // ACTION_END: dashboard-features

    // ═══════════════════════════════════════════════════════════════
    // COMPLETION
    // ═══════════════════════════════════════════════════════════════

    console.log(`\n✅ YC Demo Story Complete!`);
    console.log(`   Journey: Landing → Login → Onboarding → Dashboard`);
    
    // NARRATE: "That's the complete Supernal experience - from first visit to productive work. AI that understands, automates, and amplifies human capability."
    await smartNarrationWait(page, 'demo-complete');
    await page.waitForTimeout(3000);

    // Finalize narration session
    await finalizeNarrationSession(page);

    // Clean up
    await page.close();
    await context.close();

    // Process video output
    const videoFiles = fs.readdirSync(outputDir).filter((f: string) => f.endsWith('.webm'));
    if (videoFiles.length > 0) {
      const videoPath = path.join(outputDir, videoFiles[0]);
      const finalPath = path.join(outputDir, `${storyName}.webm`);
      fs.renameSync(videoPath, finalPath);
      
      console.log(`\n🎥 Video saved: ${finalPath}`);
      
      // Convert to MP4 for broader compatibility
      const mp4Path = path.join(outputDir, `${storyName}.mp4`);
      try {
        const { execSync } = require('child_process');
        execSync(
          `ffmpeg -y -i "${finalPath}" -c:v libx264 -preset medium -crf 23 "${mp4Path}"`,
          { stdio: 'pipe' }
        );
        console.log(`✅ MP4 converted: ${mp4Path}`);

        const duration = execSync(
          `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${mp4Path}"`
        ).toString().trim();
        console.log(`⏱️  Duration: ${parseFloat(duration).toFixed(1)} seconds`);
      } catch {
        console.log('⚠️ MP4 conversion failed, webm still available');
      }
    }

    return { success: true, outputDir, videoFiles };

  } catch (error) {
    console.error(`\n❌ YC Demo Story failed: ${error.message}`);
    console.error(error);
    
    if (context) await context.close().catch(() => {});
    return { success: false, error: error.message };
    
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}

module.exports = { runStory };

// Allow direct execution
if (require.main === module) {
  runStory().then((result) => {
    console.log('\n' + '═'.repeat(60));
    if (result.success) {
      console.log('✅ YC DEMO STORY COMPLETED SUCCESSFULLY');
      console.log(`📁 Output directory: ${result.outputDir}`);
    } else {
      console.log('❌ YC DEMO STORY FAILED');
      console.log(`💥 Error: ${result.error}`);
    }
    console.log('═'.repeat(60));
    process.exit(result.success ? 0 : 1);
  });
}