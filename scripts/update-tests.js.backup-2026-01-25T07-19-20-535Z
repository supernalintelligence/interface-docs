#!/usr/bin/env node
/**
 * Update all test files to use the fixtures instead of hardcoded URLs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all spec files with hardcoded URLs
const testsDir = path.join(__dirname, '..', 'tests');
const result = execSync(
  `grep -l "localhost:301[01]" ${testsDir}/*.spec.ts ${testsDir}/e2e/*.spec.ts 2>/dev/null || true`,
  { encoding: 'utf8' }
);

const files = result.trim().split('\n').filter(Boolean);

console.log(`Found ${files.length} test files with hardcoded URLs`);

files.forEach(file => {
  console.log(`\nProcessing: ${path.relative(testsDir, file)}`);
  
  let content = fs.readFileSync(file, 'utf8');
  const originalContent = content;
  
  // Check if already using fixtures
  if (content.includes("from './fixtures'") || content.includes('from "../fixtures"')) {
    console.log('  ✓ Already using fixtures, skipping');
    return;
  }
  
  // Determine relative path to fixtures
  const isE2E = file.includes('/e2e/');
  const fixturesImport = isE2E ? '../fixtures' : './fixtures';
  
  // Replace import
  content = content.replace(
    /import { test, expect } from '@playwright\/test';/,
    `import { test, expect, getBaseURL } from '${fixturesImport}';`
  );
  
  // Replace hardcoded URLs
  content = content.replace(
    /page\.goto\(['"]http:\/\/localhost:301[01](\/[^'"]*)?['"]\)/g,
    (match, path) => {
      if (path) {
        return `page.goto(\`\${getBaseURL()}${path}\`)`;
      } else {
        return `page.goto(getBaseURL())`;
      }
    }
  );
  
  // Check if anything changed
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('  ✓ Updated');
  } else {
    console.log('  ⚠ No changes made (check file manually)');
  }
});

console.log('\n✓ All test files updated');

