/**
 * Central Tool Registry for MCP Server
 * 
 * This file imports and registers all @Tool decorated classes
 * so they're available to the MCP server.
 * 
 * Add new tool files here as they're created.
 */

// Import tool classes (decorators run on import)
import './BlogNavigationTools';
import { registerExampleTools } from './ExampleTools';

// Import other tool providers
// Note: Some tools are in lib/ not tools/
import '../lib/DemoWidgetProvider';

/**
 * Register all docs-site tools
 * Call this from mcp-server.js to make tools available
 */
export function registerAllDocsTools() {
  // Register example tools (counter, chat, settings, data)
  registerExampleTools();
  
  // Blog navigation tools are auto-registered via import
  // DemoWidgetProvider is auto-registered via import
  
  console.error('[Tools] ✅ All docs-site tools registered');
}

// Auto-register on import (for convenience)
registerAllDocsTools();
