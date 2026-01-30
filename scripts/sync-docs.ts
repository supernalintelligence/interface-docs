#!/usr/bin/env tsx
/**
 * Sync Architecture Docs to Demo Site
 *
 * Previously copied docs from external location to content/docs/story-system/.
 * Now the docs are maintained directly in content/docs/story-system/, so this
 * script simply validates they exist.
 */

import * as fs from 'fs';
import * as path from 'path';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Docs are now maintained directly in content/docs/story-system/
// Use process.cwd() for consistency with src/lib/content/filesystem.ts
const docsDir = path.join(process.cwd(), 'content/docs/story-system');

log('\n📚 Checking Story System Docs\n', 'cyan');

if (fs.existsSync(docsDir)) {
  const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));
  if (files.length > 0) {
    log(`✅ Story System docs found: ${files.length} files in content/docs/story-system/`, 'green');
    log('   Docs are maintained directly in this location - no sync needed.\n', 'cyan');
  } else {
    log('⚠️  Story System docs directory exists but contains no .md files', 'yellow');
    log(`   Path: ${docsDir}\n`, 'yellow');
  }
} else {
  log('⚠️  Story System docs directory not found at:', 'yellow');
  log(`   ${docsDir}`, 'yellow');
  log('   This is expected if docs have not been added yet.\n', 'yellow');
}

process.exit(0);
