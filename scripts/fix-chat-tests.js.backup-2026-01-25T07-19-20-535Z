#!/usr/bin/env node
/**
 * Script to fix chat-related tests by adding expandChatBubble calls
 *
 * This script finds all test files that access chat input and ensures they:
 * 1. Import expandChatBubble from fixtures
 * 2. Call expandChatBubble(page) before accessing chat input
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all test files that mention chat input
const testFiles = execSync(
  'grep -l "chat.input\\|chat-input\\|ChatInput" tests/*.spec.ts tests/**/*.spec.ts 2>/dev/null || true',
  { encoding: 'utf-8' }
)
  .split('\n')
  .filter(Boolean)
  .filter(file => !file.includes('node_modules'));

console.log(`Found ${testFiles.length} test files that use chat input:`);
testFiles.forEach(file => console.log(`  - ${file}`));

let fixedCount = 0;
let skippedCount = 0;

testFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // Check if already imports expandChatBubble
    const hasExpandImport = content.includes('expandChatBubble');

    if (!hasExpandImport) {
      // Add expandChatBubble to imports from fixtures
      if (content.includes("from './fixtures'") || content.includes('from "./fixtures"')) {
        // Add to existing fixtures import
        content = content.replace(
          /import\s*{([^}]+)}\s*from\s*['"]\.\/fixtures['"]/,
          (match, imports) => {
            if (!imports.includes('expandChatBubble')) {
              return match.replace('}', ', expandChatBubble }');
            }
            return match;
          }
        );
        modified = true;
        console.log(`✓ Added expandChatBubble import to ${filePath}`);
      } else {
        console.log(`⚠ ${filePath} doesn't import from fixtures, skipping`);
        skippedCount++;
        return;
      }
    }

    // Save if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      fixedCount++;
    } else if (hasExpandImport) {
      console.log(`- ${filePath} already has expandChatBubble import`);
      skippedCount++;
    }

  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n✅ Fixed ${fixedCount} files`);
console.log(`⊘ Skipped ${skippedCount} files (already fixed or no fixtures import)`);
console.log(`\n⚠️  NOTE: You still need to manually add expandChatBubble(page) calls before accessing chat input in test bodies.`);
console.log(`   The safest place is right after page.goto() and before accessing chat elements.`);
