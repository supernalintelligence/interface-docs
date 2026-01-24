/**
 * Manual Test Script: Verify ExposureCollector Auto-Initialization
 *
 * Run with: node docs-site/scripts/test-exposure-init.mjs
 *
 * This script opens the demo page and checks:
 * 1. ExposureCollector is initialized
 * 2. Tools are registered
 * 3. LocationContext.elements is populated
 */

import puppeteer from 'puppeteer';

const TEST_URL = 'http://localhost:3000/demo';

async function runTests() {
  console.log('🧪 Testing ExposureCollector Auto-Initialization\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Enable console logging from browser
  page.on('console', msg => {
    if (msg.text().includes('ExposureCollector') || msg.text().includes('SupernalProvider')) {
      console.log('[Browser]:', msg.text());
    }
  });

  try {
    console.log('1️⃣  Navigating to demo page...');
    await page.goto(TEST_URL, { waitUntil: 'networkidle0' });
    console.log('✅ Page loaded\n');

    // Wait a bit for ExposureCollector to initialize
    await page.waitForTimeout(2000);

    console.log('2️⃣  Checking if ExposureCollector was initialized...');
    const collectorInitialized = await page.evaluate(() => {
      // Access ExposureCollector from window
      const ExposureCollector = window.ExposureCollector;
      if (!ExposureCollector) return false;

      const collector = ExposureCollector.getInstance();
      return collector !== undefined;
    });

    if (collectorInitialized) {
      console.log('✅ ExposureCollector is initialized\n');
    } else {
      console.log('❌ ExposureCollector NOT initialized\n');
    }

    console.log('3️⃣  Checking registered tools...');
    const registeredTools = await page.evaluate(() => {
      const ExposureCollector = window.ExposureCollector;
      if (!ExposureCollector) return null;

      const collector = ExposureCollector.getInstance();
      const tools = collector.getAllTools();

      return {
        count: tools.length,
        tools: tools.slice(0, 5).map((tool) => ({
          toolId: tool.toolId,
          state: tool.state,
          hasElement: !!tool.element,
        })),
      };
    });

    if (registeredTools && registeredTools.count > 0) {
      console.log(`✅ Found ${registeredTools.count} registered tools`);
      console.log('   First 5 tools:', JSON.stringify(registeredTools.tools, null, 2));
      console.log('');
    } else {
      console.log('❌ No tools registered\n');
    }

    console.log('4️⃣  Checking LocationContext.elements...');
    const locationContext = await page.evaluate(() => {
      const LocationContext = window.LocationContext;
      if (!LocationContext) return null;

      const location = LocationContext.getCurrent();
      return {
        page: location?.page,
        elements: location?.elements || [],
        elementCount: location?.elements?.length || 0,
      };
    });

    if (locationContext && locationContext.elementCount > 0) {
      console.log(`✅ LocationContext has ${locationContext.elementCount} visible elements`);
      console.log(`   Page: ${locationContext.page}`);
      console.log(`   First 5 elements:`, locationContext.elements.slice(0, 5));
      console.log('');
    } else {
      console.log('❌ LocationContext.elements is empty\n');
    }

    console.log('5️⃣  Checking ToolRegistry filtering...');
    const filteredTools = await page.evaluate(() => {
      const ToolRegistry = window.ToolRegistry;
      if (!ToolRegistry) return null;

      const tools = ToolRegistry.getToolsByLocation();
      return {
        count: tools.length,
        toolsWithElements: tools.filter((t) => t.elementId).length,
        sampleTools: tools.slice(0, 3).map((t) => ({
          name: t.name,
          elementId: t.elementId,
          hasContainerId: !!t.containerId,
        })),
      };
    });

    if (filteredTools && filteredTools.count > 0) {
      console.log(`✅ ToolRegistry.getToolsByLocation() returned ${filteredTools.count} tools`);
      console.log(`   Tools with elementId: ${filteredTools.toolsWithElements}`);
      console.log(`   Sample tools:`, JSON.stringify(filteredTools.sampleTools, null, 2));
      console.log('');
    } else {
      console.log('❌ No filtered tools found\n');
    }

    console.log('\n🎉 All tests completed!');
    console.log('\n📋 Summary:');
    console.log(`   ✓ ExposureCollector: ${collectorInitialized ? 'PASS' : 'FAIL'}`);
    console.log(`   ✓ Registered Tools: ${registeredTools?.count || 0} tools`);
    console.log(`   ✓ LocationContext.elements: ${locationContext?.elementCount || 0} elements`);
    console.log(`   ✓ Filtered Tools: ${filteredTools?.count || 0} tools`);

  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
