#!/usr/bin/env node
/**
 * Verify Critical Dependencies
 *
 * Checks that critical devDependencies are actually installed.
 * This prevents the "Cannot find module 'tailwindcss'" error.
 *
 * Usage:
 *   node scripts/verify-deps.js
 *
 * Exit codes:
 *   0 = All dependencies present
 *   1 = Some dependencies missing
 */

const fs = require('fs');
const path = require('path');

const CRITICAL_DEPS = [
  'tailwindcss',
  'autoprefixer',
  'postcss',
  '@playwright/test',
  'next'
];

function main() {
  console.log('🔍 Verifying critical dependencies...\n');

  let allPresent = true;
  const missing = [];

  for (const dep of CRITICAL_DEPS) {
    const depPath = path.join(__dirname, '..', 'node_modules', dep);
    const exists = fs.existsSync(depPath);

    if (exists) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - MISSING!`);
      allPresent = false;
      missing.push(dep);
    }
  }

  console.log('');

  if (!allPresent) {
    console.log('⚠️  Some critical dependencies are missing!');
    console.log('');
    console.log('Missing packages:');
    missing.forEach(dep => console.log(`  - ${dep}`));
    console.log('');
    console.log('To fix, run one of:');
    console.log('  npm install                # Should work');
    console.log('  npm install --include=dev  # Force devDependencies');
    console.log('  ./RUNME.sh                 # Recommended');
    console.log('');
    process.exit(1);
  }

  console.log('✅ All critical dependencies are present');
  process.exit(0);
}

main();
