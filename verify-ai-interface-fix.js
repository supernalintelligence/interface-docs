#!/usr/bin/env node
/**
 * Verify that AIInterface uses getToolsForCurrentContext
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'node_modules/@supernal/interface/dist/esm/src/ai/AIInterface.js');

console.log('\n========== VERIFYING AIInterface FIX ==========\n');

const content = fs.readFileSync(filePath, 'utf8');

if (content.includes('getToolsForCurrentContext')) {
  console.log('✅ FOUND: Uses ToolRegistry.getToolsForCurrentContext()');

  // Find the line
  const lines = content.split('\n');
  const relevantLines = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('getToolsForCurrentContext')) {
      relevantLines.push(`${i + 1}: ${lines[i].trim()}`);
      // Show next 2 lines
      if (i + 1 < lines.length) relevantLines.push(`${i + 2}: ${lines[i + 1].trim()}`);
      if (i + 2 < lines.length) relevantLines.push(`${i + 3}: ${lines[i + 2].trim()}`);
    }
  }

  console.log('\n📋 Code:');
  relevantLines.forEach(line => console.log(`   ${line}`));

} else {
  console.log('❌ MISSING: Still using manual filtering (OLD CODE)');
}

if (content.includes('tool.containerId === context.currentContainer')) {
  console.log('\n❌ ERROR: Still has OLD buggy comparison!');
} else {
  console.log('\n✅ GOOD: Old buggy comparison removed');
}

console.log('\n========== VERIFICATION COMPLETE ==========\n');
