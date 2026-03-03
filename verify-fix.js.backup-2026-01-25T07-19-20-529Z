#!/usr/bin/env node
/**
 * Verify that the ContainerRegistry fix is in the installed enterprise package
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'node_modules/@supernalintelligence/interface-enterprise/dist/esm/architecture/ArchitectureInitializer.js');

console.log('\n========== VERIFYING FIX IS PRESENT ==========\n');
console.log('📁 Checking file:', filePath);

if (!fs.existsSync(filePath)) {
  console.error('❌ ERROR: File not found!');
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');

// Check for the diagnostic logging
if (content.includes('🔴🔴🔴 [ArchitectureInitializer.ts]')) {
  console.log('✅ FOUND: Diagnostic logging (🔴🔴🔴)');
} else {
  console.log('❌ MISSING: Diagnostic logging');
}

// Check for ContainerRegistry.registerContainers call
if (content.includes('ContainerRegistry.registerContainers')) {
  console.log('✅ FOUND: ContainerRegistry.registerContainers() call');
} else {
  console.log('❌ MISSING: ContainerRegistry.registerContainers()');
}

// Find the line with ContainerRegistry.registerContainers
const lines = content.split('\n');
const relevantLines = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('🔴🔴🔴') || lines[i].includes('ContainerRegistry.registerContainers')) {
    relevantLines.push(`${i + 1}: ${lines[i].trim()}`);
  }
}

if (relevantLines.length > 0) {
  console.log('\n📋 Relevant code lines:');
  relevantLines.forEach(line => console.log(`   ${line}`));
}

console.log('\n========== VERIFICATION COMPLETE ==========\n');
console.log('🎯 Next step: Start dev server and check browser console for 🔴🔴🔴');
console.log('   Expected logs:');
console.log('   - 🔴🔴🔴 [ArchitectureInitializer.ts] initialize() called');
console.log('   - [ContainerRegistry] 📦 Registering: Demo → /demo');
console.log('   - 📦 [AI] Scoped tools: 4 (or more)');
console.log('\n');
