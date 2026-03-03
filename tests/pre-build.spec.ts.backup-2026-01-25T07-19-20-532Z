/**
 * Pre-build validation tests
 * 
 * These tests run BEFORE the build to catch common issues:
 * - 'use client' directive placement
 * - Missing required frontmatter in docs
 * - Invalid imports
 */

import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import path from 'path';

test.describe('Pre-Build Validations', () => {
  
  test('validate "use client" directive placement', async () => {
    try {
      const scriptPath = path.join(__dirname, '../scripts/validate-client-directives.ts');
      const result = execSync(`tsx ${scriptPath}`, {
        encoding: 'utf-8',
        cwd: path.join(__dirname, '..'),
      });
      
      expect(result).toContain('All files passed validation');
    } catch (error: any) {
      // If the script exits with code 1, it means there are errors
      const output = error.stdout || error.stderr || error.message;
      console.error('Validation failed:', output);
      throw new Error(`Client directive validation failed:\n${output}`);
    }
  });
  
  test('TypeScript compilation check', async () => {
    try {
      // Run tsc --noEmit to check for type errors without building
      execSync('npx tsc --noEmit', {
        encoding: 'utf-8',
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });
    } catch (error: any) {
      const output = error.stdout || error.stderr || '';
      
      // Filter out noise and show only real errors
      const lines = output.split('\n').filter((line: string) => 
        line.includes('error TS') || 
        line.includes('Found ') ||
        line.trim().length > 0
      );
      
      if (lines.some((line: string) => line.includes('error TS'))) {
        throw new Error(`TypeScript compilation errors:\n${lines.join('\n')}`);
      }
    }
  });
  
  test('no Node.js fs module in browser code', async () => {
    const browserFiles = [
      'src/components/**/*.tsx',
      'src/components/**/*.ts',
      'src/hooks/**/*.tsx',
      'src/hooks/**/*.ts',
      'src/lib/**/*.tsx',
      'src/lib/**/*.ts',
    ];
    
    try {
      // Search for fs imports in browser-side code (exclude pages/api)
      const result = execSync(
        `grep -r "import.*from.*['\"]fs['\"]" src/components src/hooks src/lib 2>/dev/null || true`,
        {
          encoding: 'utf-8',
          cwd: path.join(__dirname, '..'),
        }
      );
      
      if (result.trim()) {
        throw new Error(
          `Found Node.js 'fs' module imports in browser code:\n${result}\n\n` +
          `💡 Node.js modules like 'fs' can only be used in:\n` +
          `   - pages/api/* (API routes)\n` +
          `   - getStaticProps/getServerSideProps\n` +
          `   - Server Components (app directory)`
        );
      }
    } catch (error: any) {
      if (error.message && error.message.includes('Found Node.js')) {
        throw error;
      }
      // grep returns exit code 1 when no matches found, which is what we want
    }
  });
  
  test('no console.log in production code (warnings only)', async () => {
    try {
      const result = execSync(
        `grep -r "console\\.log(" src/components src/lib --include="*.tsx" --include="*.ts" 2>/dev/null || true`,
        {
          encoding: 'utf-8',
          cwd: path.join(__dirname, '..'),
        }
      );
      
      if (result.trim()) {
        // This is a warning, not a failure
        console.warn('⚠️  Found console.log statements (consider removing for production):');
        console.warn(result);
      }
    } catch (error) {
      // Ignore grep errors
    }
  });
});

