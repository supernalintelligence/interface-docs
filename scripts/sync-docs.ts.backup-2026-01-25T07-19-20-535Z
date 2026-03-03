#!/usr/bin/env tsx
/**
 * Sync Architecture Docs to Demo Site
 * 
 * Copies /docs/architecture/story-system/ to demo/content/docs/story-system/ 
 * so they're visible on the demo site.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Paths - try multiple locations for source
const possibleSourceDirs = [
  path.join(__dirname, '../../../docs/architecture/story-system'),  // Local dev
  path.join(__dirname, '../../docs/architecture/story-system'),     // Alternative
  path.join(process.cwd(), '../docs/architecture/story-system'),    // Vercel with include outside root
];

const destDir = path.join(__dirname, '../content/docs/story-system');

log('\n📚 Syncing Story System Docs to Demo Site\n', 'cyan');

// Find the source directory that exists
let sourceDir: string | null = null;
for (const dir of possibleSourceDirs) {
  log(`Checking: ${dir}`, 'cyan');
  if (fs.existsSync(dir)) {
    sourceDir = dir;
    log(`Found source at: ${dir}`, 'green');
    break;
  }
}

if (!sourceDir) {
  log('⚠️  Source docs directory not found. Tried:', 'yellow');
  possibleSourceDirs.forEach(d => log(`   - ${d}`, 'yellow'));
  log('Skipping sync - docs may need to be added manually.\n', 'yellow');
  process.exit(0);
}

// Ensure destination exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  log('✓ Created story-system docs directory', 'green');
}

// Copy all markdown files from source to dest
// Files already have frontmatter, so we just copy them directly
const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.md'));

let syncedCount = 0;
for (const file of files) {
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(destDir, file);
  
  // Read and copy
  const content = fs.readFileSync(sourcePath, 'utf-8');
  fs.writeFileSync(destPath, content, 'utf-8');
  
  log(`✓ Synced ${file}`, 'green');
  syncedCount++;
}

log(`\n✅ Synced ${syncedCount} documentation files\n`, 'green');
log('📍 Files available at:', 'cyan');
log(`   ${path.relative(process.cwd(), destDir)}\n`, 'cyan');
log('💡 These docs will now appear in the demo site under "Story System"\n', 'yellow');

