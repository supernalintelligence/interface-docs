/**
 * Scoping Test - Verify tools are correctly scoped to containers
 */

import { ToolRegistry } from '@supernalintelligence/interface-enterprise';
import { DemoContainers, initializeDemoArchitecture } from '../src/architecture';

describe('Tool Scoping', () => {
  beforeAll(() => {
    // Initialize architecture to register containers
    initializeDemoArchitecture();
  });

  it('should scope DemoSimple tools to /demo/simple route', () => {
    // Get tools for /demo/simple route
    const tools = ToolRegistry.getToolsByLocation('/demo/simple');

    // Filter to only DemoSimple container tools
    const demoSimpleTools = tools.filter(t => t.containerId === DemoContainers.DemoSimple.id);

    console.log(`[Test] Found ${demoSimpleTools.length} DemoSimple tools on /demo/simple`);
    expect(demoSimpleTools.length).toBeGreaterThan(0);
  });

  it('should NOT scope DemoSimple tools to /demo route', () => {
    // Get tools for /demo route
    const tools = ToolRegistry.getToolsByLocation('/demo');

    // Filter to only DemoSimple container tools
    const demoSimpleTools = tools.filter(t => t.containerId === DemoContainers.DemoSimple.id);

    console.log(`[Test] Found ${demoSimpleTools.length} DemoSimple tools on /demo`);
    expect(demoSimpleTools.length).toBe(0);
  });

  it('should scope Demo tools to /demo route', () => {
    // Get tools for /demo route
    const tools = ToolRegistry.getToolsByLocation('/demo');

    // Filter to only Demo container tools
    const demoTools = tools.filter(t => t.containerId === DemoContainers.Demo.id);

    console.log(`[Test] Found ${demoTools.length} Demo tools on /demo`);
    expect(demoTools.length).toBeGreaterThan(0);
  });

  it('should show global navigation tools on all pages', () => {
    const landingTools = ToolRegistry.getToolsByLocation('/');
    const demoTools = ToolRegistry.getToolsByLocation('/demo');
    const blogTools = ToolRegistry.getToolsByLocation('/blog');

    const globalToolsOnLanding = landingTools.filter(t => t.name?.includes('Navigate') || t.name?.includes('go'));
    const globalToolsOnDemo = demoTools.filter(t => t.name?.includes('Navigate') || t.name?.includes('go'));
    const globalToolsOnBlog = blogTools.filter(t => t.name?.includes('Navigate') || t.name?.includes('go'));

    console.log(`[Test] Global tools: landing=${globalToolsOnLanding.length}, demo=${globalToolsOnDemo.length}, blog=${globalToolsOnBlog.length}`);

    // Global tools should be available on all pages
    expect(globalToolsOnLanding.length).toBeGreaterThan(0);
    expect(globalToolsOnDemo.length).toBeGreaterThan(0);
    expect(globalToolsOnBlog.length).toBeGreaterThan(0);
  });
});
