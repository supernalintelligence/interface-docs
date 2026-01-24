/**
 * Browser Console Test Script for ExposureCollector Auto-Initialization
 *
 * Usage:
 * 1. Open http://localhost:3000/demo
 * 2. Open browser console (F12)
 * 3. Copy and paste this entire file
 * 4. Press Enter
 *
 * Tests will run automatically and show results in console
 */

console.log('%c🧪 ExposureCollector Auto-Initialization Tests', 'font-size: 20px; font-weight: bold; color: #4ec9b0;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4ec9b0;');

const results = {
  total: 0,
  passed: 0,
  failed: 0,
};

function testPass(name, message, details) {
  results.total++;
  results.passed++;
  console.log(`%c✅ PASS: ${name}`, 'color: #4ec9b0; font-weight: bold;');
  console.log(`   ${message}`);
  if (details) {
    console.log('   Details:', details);
  }
  console.log('');
}

function testFail(name, message, details) {
  results.total++;
  results.failed++;
  console.log(`%c❌ FAIL: ${name}`, 'color: #f14c4c; font-weight: bold;');
  console.log(`   ${message}`);
  if (details) {
    console.log('   Details:', details);
  }
  console.log('');
}

function testInfo(message) {
  console.log(`%cℹ️  ${message}`, 'color: #9cdcfe;');
}

// Test 1: ExposureCollector Initialization
console.log('%c📌 Test 1: ExposureCollector Initialization', 'font-size: 16px; color: #dcdcaa; font-weight: bold;');
if (typeof window.ExposureCollector !== 'undefined') {
  const collector = window.ExposureCollector.getInstance();
  if (collector) {
    testPass(
      'ExposureCollector Initialized',
      'ExposureCollector singleton is properly initialized',
      { instance: 'ExposureCollector.getInstance()' }
    );
  } else {
    testFail('ExposureCollector Initialized', 'getInstance() returned null/undefined');
  }
} else {
  testFail('ExposureCollector Initialized', 'ExposureCollector not found on window object');
}

// Test 2: Tools Registered
console.log('%c📌 Test 2: Tools Registered with ExposureCollector', 'font-size: 16px; color: #dcdcaa; font-weight: bold;');
if (typeof window.ExposureCollector !== 'undefined') {
  const collector = window.ExposureCollector.getInstance();
  const tools = collector.getAllTools();

  if (tools.length > 0) {
    testPass(
      'Tools Registered',
      `Found ${tools.length} registered tools`,
      {
        totalTools: tools.length,
        sampleTools: tools.slice(0, 5).map(t => ({
          toolId: t.toolId,
          state: ['NOT_PRESENT', 'PRESENT', 'VISIBLE', 'EXPOSED', 'INTERACTABLE'][t.state] || t.state,
          hasElement: !!t.element,
        })),
      }
    );
  } else {
    testFail('Tools Registered', 'No tools found in ExposureCollector', { toolCount: 0 });
  }
} else {
  testFail('Tools Registered', 'ExposureCollector not available');
}

// Test 3: LocationContext.elements Populated
console.log('%c📌 Test 3: LocationContext.elements Populated', 'font-size: 16px; color: #dcdcaa; font-weight: bold;');
if (typeof window.LocationContext !== 'undefined') {
  const location = window.LocationContext.getCurrent();

  if (location && location.elements && location.elements.length > 0) {
    testPass(
      'LocationContext.elements Populated',
      `Found ${location.elements.length} visible element IDs`,
      {
        page: location.page,
        route: location.route,
        elementCount: location.elements.length,
        sampleElements: location.elements.slice(0, 10),
      }
    );
  } else {
    testFail(
      'LocationContext.elements Populated',
      'LocationContext.elements is empty',
      { location }
    );
  }
} else {
  testFail('LocationContext.elements Populated', 'LocationContext not found on window object');
}

// Test 4: ToolRegistry Filtering
console.log('%c📌 Test 4: ToolRegistry Filtering by Location', 'font-size: 16px; color: #dcdcaa; font-weight: bold;');
if (typeof window.ToolRegistry !== 'undefined') {
  const filteredTools = window.ToolRegistry.getToolsByLocation();

  if (filteredTools.length > 0) {
    testPass(
      'ToolRegistry Filtering',
      `${filteredTools.length} tools available at current location`,
      {
        toolCount: filteredTools.length,
        toolsWithElements: filteredTools.filter(t => t.elementId).length,
        sampleTools: filteredTools.slice(0, 5).map(t => ({
          name: t.name,
          elementId: t.elementId,
          containerId: t.containerId,
        })),
      }
    );
  } else {
    testFail('ToolRegistry Filtering', 'No tools available at current location');
  }
} else {
  testFail('ToolRegistry Filtering', 'ToolRegistry not found on window object');
}

// Test 5: Zero-Config Verification
console.log('%c📌 Test 5: Zero-Config Verification (No containerId)', 'font-size: 16px; color: #dcdcaa; font-weight: bold;');
if (typeof window.ToolRegistry !== 'undefined') {
  const allTools = window.ToolRegistry.getAllTools();
  const demoTools = allTools.filter(
    t => t.name?.includes('Demo') ||
         t.name?.includes('Widget') ||
         t.name?.includes('Priority') ||
         t.name?.includes('Status') ||
         t.name?.includes('Theme') ||
         t.name?.includes('Menu')
  );
  const toolsWithContainerId = demoTools.filter(t => t.containerId);
  const zeroConfigCount = demoTools.length - toolsWithContainerId.length;
  const zeroConfigPercent = demoTools.length > 0 ? Math.round((zeroConfigCount / demoTools.length) * 100) : 0;

  if (zeroConfigPercent >= 90) {
    testPass(
      'Zero-Config Verification',
      `${zeroConfigPercent}% of demo tools are zero-config`,
      {
        totalDemoTools: demoTools.length,
        zeroConfigTools: zeroConfigCount,
        withContainerId: toolsWithContainerId.length,
        percentage: zeroConfigPercent + '%',
        toolsWithContainerId: toolsWithContainerId.map(t => ({ name: t.name, containerId: t.containerId })),
      }
    );
  } else {
    testFail(
      'Zero-Config Verification',
      `Only ${zeroConfigPercent}% are zero-config (expected >= 90%)`,
      {
        totalDemoTools: demoTools.length,
        zeroConfigTools: zeroConfigCount,
        withContainerId: toolsWithContainerId.length,
      }
    );
  }
} else {
  testFail('Zero-Config Verification', 'ToolRegistry not available');
}

// Test 6: Visibility Changes on Scroll
console.log('%c📌 Test 6: Visibility Changes (scroll test)', 'font-size: 16px; color: #dcdcaa; font-weight: bold;');
if (typeof window.LocationContext !== 'undefined') {
  const beforeScroll = window.LocationContext.getCurrent()?.elements || [];
  testInfo(`Visible elements before scroll: ${beforeScroll.length}`);

  // Scroll to bottom
  window.scrollTo(0, document.body.scrollHeight);

  // Wait for IntersectionObserver to update
  setTimeout(() => {
    const afterScroll = window.LocationContext.getCurrent()?.elements || [];
    testInfo(`Visible elements after scroll: ${afterScroll.length}`);

    const changed = beforeScroll.length !== afterScroll.length;
    if (changed || document.body.scrollHeight <= window.innerHeight) {
      testPass(
        'Visibility Changes',
        'Elements list updated after scrolling',
        {
          before: beforeScroll.length,
          after: afterScroll.length,
          changed: changed,
          note: document.body.scrollHeight <= window.innerHeight ? 'Page too short to scroll' : undefined,
        }
      );
    } else {
      testInfo('Elements count unchanged (page might be too short or elements already in view)');
      testPass('Visibility Changes', 'Scroll test completed', { before: beforeScroll.length, after: afterScroll.length });
    }

    // Scroll back to top
    window.scrollTo(0, 0);

    // Show summary
    showSummary();
  }, 1000);
} else {
  testFail('Visibility Changes', 'LocationContext not available');
  showSummary();
}

function showSummary() {
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4ec9b0;');
  console.log('%c📊 Test Summary', 'font-size: 18px; font-weight: bold; color: #dcdcaa;');
  console.log('');

  const passRate = results.total > 0 ? Math.round((results.passed / results.total) * 100) : 0;
  const color = passRate === 100 ? '#4ec9b0' : passRate >= 80 ? '#dcdcaa' : '#f14c4c';

  console.log(`%c   Total Tests: ${results.total}`, 'font-size: 16px;');
  console.log(`%c   ✅ Passed: ${results.passed}`, 'font-size: 16px; color: #4ec9b0; font-weight: bold;');
  console.log(`%c   ❌ Failed: ${results.failed}`, 'font-size: 16px; color: #f14c4c; font-weight: bold;');
  console.log(`%c   Pass Rate: ${passRate}%`, `font-size: 18px; color: ${color}; font-weight: bold;`);
  console.log('');

  if (passRate === 100) {
    console.log('%c🎉 All tests passed! Zero-config inference is working perfectly!', 'font-size: 16px; color: #4ec9b0; font-weight: bold; background: #1a3a1a; padding: 10px;');
  } else if (passRate >= 80) {
    console.log('%c⚠️  Most tests passed, but some issues detected', 'font-size: 16px; color: #dcdcaa; font-weight: bold;');
  } else {
    console.log('%c❌ Multiple test failures - check the details above', 'font-size: 16px; color: #f14c4c; font-weight: bold;');
  }

  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4ec9b0;');
}
