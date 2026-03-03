#!/usr/bin/env tsx
/**
 * Validate 'use client' directive placement in React components
 * 
 * This script checks that 'use client' directives are placed at the very top
 * of files, before any imports or comments, as required by Next.js.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ValidationError {
  file: string;
  line: number;
  issue: string;
}

/**
 * Recursively find all .tsx and .ts files in a directory
 */
function findComponentFiles(dir: string, extensions = ['.tsx', '.ts']): string[] {
  const files: string[] = [];
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules, .next, dist, etc.
      if (!['node_modules', '.next', 'dist', 'build', '.git'].includes(entry.name)) {
        files.push(...findComponentFiles(fullPath, extensions));
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (extensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

/**
 * Validate a single file for 'use client' directive placement
 */
function validateFile(filePath: string): ValidationError | null {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // Find 'use client' directive
  const useClientLineIndex = lines.findIndex(line => 
    line.trim() === "'use client';" || line.trim() === '"use client";'
  );
  
  // If no 'use client', file is fine
  if (useClientLineIndex === -1) {
    return null;
  }
  
  // Check if there's anything before 'use client' (except empty lines and shebang)
  for (let i = 0; i < useClientLineIndex; i++) {
    const line = lines[i].trim();
    
    // Allow empty lines and shebang
    if (line === '' || line.startsWith('#!')) {
      continue;
    }
    
    // Anything else before 'use client' is an error
    return {
      file: filePath,
      line: i + 1,
      issue: `'use client' directive must be on line 1 (found on line ${useClientLineIndex + 1}). Line ${i + 1} contains: "${line.substring(0, 50)}${line.length > 50 ? '...' : ''}"`
    };
  }
  
  return null;
}

/**
 * Main validation function
 */
function main() {
  console.log('🔍 Validating "use client" directive placement...\n');
  
  const projectRoot = path.resolve(__dirname, '..');
  const srcDir = path.join(projectRoot, 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.error(`❌ Source directory not found: ${srcDir}`);
    process.exit(1);
  }
  
  const files = findComponentFiles(srcDir);
  console.log(`📁 Found ${files.length} TypeScript files to check\n`);
  
  const errors: ValidationError[] = [];
  
  for (const file of files) {
    const error = validateFile(file);
    if (error) {
      errors.push(error);
    }
  }
  
  if (errors.length === 0) {
    console.log('✅ All files passed validation!\n');
    process.exit(0);
  }
  
  console.error(`❌ Found ${errors.length} validation error(s):\n`);
  
  for (const error of errors) {
    const relativePath = path.relative(projectRoot, error.file);
    console.error(`  ${relativePath}:${error.line}`);
    console.error(`    ${error.issue}\n`);
  }
  
  console.error('\n💡 To fix: Move "use client" to be the very first line of each file.\n');
  process.exit(1);
}

main();

