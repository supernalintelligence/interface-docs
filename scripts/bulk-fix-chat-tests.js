#!/usr/bin/env node
/**
 * Bulk fix chat tests by adding expandChatBubble calls
 *
 * This script automatically adds expandChatBubble(page) calls before
 * any access to chat.input, chat.sendButton, or similar chat elements.
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'tests/clickable-tools.spec.ts',
  'tests/stateful-theme-ai.spec.ts',
];

function fixTestFile(filePath) {
  console.log(`\n📝 Processing: ${filePath}`);

  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Pattern 1: Find tests that access chat.input without prior expandChatBubble
  // Look for: page.locator(...chat.input...) NOT preceded by expandChatBubble in the same test

  const testBlocks = content.split(/test\(/);

  for (let i = 1; i < testBlocks.length; i++) {
    const block = testBlocks[i];

    // Check if this test accesses chat input
    const accessesChatInput =
      block.includes('chat.input') ||
      block.includes('chat-input') ||
      block.includes('chat.sendButton');

    // Check if it already has expandChatBubble
    const hasExpand = block.includes('expandChatBubble');

    if (accessesChatInput && !hasExpand) {
      console.log(`  ⚠️  Found test accessing chat without expansion`);

      // Find the first chat access
      const chatAccessMatch = block.match(/(page\.locator.*?(?:chat\.input|chat-input|chat\.sendButton))/);
      if (chatAccessMatch) {
        const beforeChatAccess = block.substring(0, chatAccessMatch.index);
        const afterChatAccess = block.substring(chatAccessMatch.index);

        // Find a good insertion point - typically after page.goto or page.waitForLoadState
        const insertionPoints = [
          { pattern: /(await page\.waitForLoadState\([^)]+\);?\s*)/, desc: 'after waitForLoadState' },
          { pattern: /(await page\.goto\([^)]+\);?\s*)/, desc: 'after page.goto' },
          { pattern: /(async \(\{ page \}\) => \{\s*)/, desc: 'at start of test' }
        ];

        for (const { pattern, desc } of insertionPoints) {
          const match = beforeChatAccess.match(pattern);
          if (match) {
            const insertPoint = match.index + match[0].length;
            const newBlock =
              beforeChatAccess.substring(0, insertPoint) +
              '\n    // Expand chat bubble to make input visible\n    await expandChatBubble(page);\n\n    ' +
              beforeChatAccess.substring(insertPoint) +
              afterChatAccess;

            testBlocks[i] = newBlock;
            modified = true;
            console.log(`  ✓ Added expandChatBubble ${desc}`);
            break;
          }
        }
      }
    }
  }

  if (modified) {
    const newContent = testBlocks.join('test(');
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`  ✅ Fixed ${filePath}`);
    return true;
  } else {
    console.log(`  ⊘ No changes needed for ${filePath}`);
    return false;
  }
}

let fixedCount = 0;

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    if (fixTestFile(file)) {
      fixedCount++;
    }
  } else {
    console.log(`  ⚠️  File not found: ${file}`);
  }
});

console.log(`\n✨ Done! Fixed ${fixedCount} files.`);
console.log(`\n💡 Run 'npm test' to verify the fixes.`);
