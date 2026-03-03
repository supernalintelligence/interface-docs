/**
 * Tool Scoping Diagnostic Script
 *
 * Run this in the browser console to diagnose tool scoping issues.
 *
 * Usage:
 *   1. Open browser console
 *   2. Paste this entire script
 *   3. Review the output to identify scoping issues
 */

(function() {
  console.log('='.repeat(80));
  console.log('TOOL SCOPING DIAGNOSTIC');
  console.log('='.repeat(80));

  // Get ToolRegistry from global scope
  const registry = window.__SUPERNAL_TOOL_REGISTRY__;

  if (!registry) {
    console.error('❌ ToolRegistry not found in window.__SUPERNAL_TOOL_REGISTRY__');
    return;
  }

  console.log('\n✅ ToolRegistry found:', registry.size, 'tools registered\n');

  // Get all tools
  const allTools = Array.from(registry.values());

  // Group by containerId
  const byContainer = {};
  const noContainer = [];

  allTools.forEach(tool => {
    if (tool.containerId) {
      if (!byContainer[tool.containerId]) {
        byContainer[tool.containerId] = [];
      }
      byContainer[tool.containerId].push(tool);
    } else {
      noContainer.push(tool);
    }
  });

  // Display results
  console.log('📊 TOOLS BY CONTAINER:');
  console.log('-'.repeat(80));

  Object.keys(byContainer).sort().forEach(containerId => {
    const tools = byContainer[containerId];
    console.log(`\n🔵 Container: "${containerId}" (${tools.length} tools)`);
    tools.forEach(tool => {
      console.log(`   - ${tool.toolId || tool.name}`);
      console.log(`     • name: ${tool.name}`);
      console.log(`     • componentName: ${tool.componentName || 'none'}`);
      console.log(`     • aiEnabled: ${tool.aiEnabled}`);
    });
  });

  if (noContainer.length > 0) {
    console.log(`\n🔵 No Container (${noContainer.length} tools - global):`);
    noContainer.forEach(tool => {
      console.log(`   - ${tool.toolId || tool.name}`);
    });
  }

  // Check LocationContext
  console.log('\n' + '='.repeat(80));
  console.log('LOCATION CONTEXT:');
  console.log('-'.repeat(80));

  // Import LocationContext
  try {
    // LocationContext should be available globally or via a known path
    const LocationContext = window.__SUPERNAL_LOCATION_CONTEXT__;

    if (LocationContext) {
      const current = LocationContext.getCurrent?.();
      console.log('📍 Current Location:', JSON.stringify(current, null, 2));
    } else {
      console.log('⚠️  LocationContext not found in window.__SUPERNAL_LOCATION_CONTEXT__');
      console.log('   This may be normal if LocationContext is not exposed globally');
    }
  } catch (error) {
    console.log('⚠️  Could not access LocationContext:', error.message);
  }

  // Check ContainerRegistry
  console.log('\n' + '='.repeat(80));
  console.log('CONTAINER REGISTRY:');
  console.log('-'.repeat(80));

  const containerRegistry = window.__SUPERNAL_CONTAINER_REGISTRY__;

  if (!containerRegistry) {
    console.error('❌ ContainerRegistry not found in window.__SUPERNAL_CONTAINER_REGISTRY__');
  } else {
    console.log('\n✅ ContainerRegistry found:', containerRegistry.size, 'containers registered\n');

    const containers = Array.from(containerRegistry.values());
    containers.forEach(container => {
      console.log(`   - ID: "${container.id}" → Route: "${container.route}"`);
    });
  }

  // Test getToolsForCurrentContext
  console.log('\n' + '='.repeat(80));
  console.log('CURRENT CONTEXT TOOLS:');
  console.log('-'.repeat(80));

  // Try to get ToolRegistry class
  if (window.ToolRegistry) {
    try {
      const contextTools = window.ToolRegistry.getToolsForCurrentContext();
      console.log(`\n✅ getToolsForCurrentContext() returned ${contextTools.length} tools\n`);

      const scoped = contextTools.filter(t => t.containerId && t.containerId !== 'global');
      const global = contextTools.filter(t => !t.containerId || t.containerId === 'global');

      console.log(`   • Scoped tools: ${scoped.length}`);
      console.log(`   • Global tools: ${global.length}`);

      if (scoped.length > 0) {
        console.log('\n   Scoped tools:');
        scoped.forEach(t => {
          console.log(`     - ${t.name} (containerId: ${t.containerId})`);
        });
      }
    } catch (error) {
      console.error('❌ Error calling getToolsForCurrentContext():', error);
    }
  } else {
    console.log('⚠️  window.ToolRegistry not found - cannot test getToolsForCurrentContext()');
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY:');
  console.log('-'.repeat(80));
  console.log(`   Total tools registered: ${allTools.length}`);
  console.log(`   Tools with containerId: ${allTools.filter(t => t.containerId).length}`);
  console.log(`   Unique containerIds: ${Object.keys(byContainer).length}`);
  console.log(`   Global tools: ${noContainer.length}`);
  console.log('='.repeat(80));

  // Export for further inspection
  window.__DIAGNOSTIC__ = {
    allTools,
    byContainer,
    noContainer,
    registry,
  };

  console.log('\n💡 Diagnostic data saved to window.__DIAGNOSTIC__ for inspection');
  console.log('   Try: __DIAGNOSTIC__.byContainer');
  console.log('        __DIAGNOSTIC__.allTools');
})();
