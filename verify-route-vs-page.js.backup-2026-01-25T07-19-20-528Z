#!/usr/bin/env node
/**
 * Verify ToolRegistry checks .route before .page
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'node_modules/@supernal/interface/dist/esm/src/background/registry/ToolRegistry.js');

console.log('\n========== VERIFYING ROUTE VS PAGE CHECK ==========\n');

if (!fs.existsSync(filePath)) {
  console.error('❌ ERROR: File not found:', filePath);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');

// Find the line with currentPage assignment
const lines = content.split('\n');
let found = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const currentPage =') && lines[i].includes('currentLocation')) {
    console.log('📋 Found currentPage assignment at line', i + 1);
    console.log('   ', lines[i].trim());

    // Check if it's .route || .page (CORRECT) or .page || .route (WRONG)
    if (lines[i].includes('currentLocation.route') &&
        lines[i].indexOf('route') < lines[i].indexOf('page')) {
      console.log('\n✅ CORRECT: Checks .route before .page');
      found = true;
    } else if (lines[i].includes('currentLocation.page') &&
               lines[i].indexOf('page') < lines[i].indexOf('route')) {
      console.log('\n❌ WRONG: Checks .page before .route (will fail with NavigationGraph)');
      found = true;
    }
    break;
  }
}

if (!found) {
  console.log('❌ Could not find currentPage assignment');
}

console.log('\n========== VERIFICATION COMPLETE ==========\n');
