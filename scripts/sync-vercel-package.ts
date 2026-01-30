#!/usr/bin/env tsx
/**
 * Sync package.vercel.json with package.json
 *
 * This script:
 * 1. Reads package.json
 * 2. Replaces file: references with latest npm versions
 * 3. Removes dependencies that can't be installed on Vercel (local-only)
 * 4. Writes to package.vercel.json
 *
 * Run: npm run sync:vercel-package
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Packages that use file: locally but have npm equivalents
const FILE_TO_NPM_MAPPINGS: Record<string, string> = {
  '@supernal/interface-nextjs': '@supernal/interface-nextjs',
  // Add more mappings as needed
};

// Packages to completely remove (local-only, no npm equivalent)
const LOCAL_ONLY_PACKAGES = [
  'supernal-blog', // Local blog template, not on npm
];

function getLatestNpmVersion(packageName: string): string | null {
  try {
    const version = execSync(`npm view ${packageName} version 2>/dev/null`, {
      encoding: 'utf-8',
    }).trim();
    return version || null;
  } catch {
    return null;
  }
}

function syncPackages() {
  log('\n📦 Syncing package.vercel.json with package.json\n', 'cyan');

  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const vercelPackagePath = path.join(process.cwd(), 'package.vercel.json');

  if (!fs.existsSync(packageJsonPath)) {
    log('❌ package.json not found', 'red');
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const vercelPackage = { ...packageJson };

  // Process dependencies
  const processedDeps: string[] = [];
  const skippedDeps: string[] = [];
  const updatedDeps: string[] = [];

  for (const depType of ['dependencies', 'devDependencies'] as const) {
    if (!vercelPackage[depType]) continue;

    const deps = { ...vercelPackage[depType] };

    for (const [name, version] of Object.entries(deps)) {
      const versionStr = version as string;

      // Remove local-only packages
      if (LOCAL_ONLY_PACKAGES.includes(name)) {
        delete deps[name];
        skippedDeps.push(name);
        continue;
      }

      // Replace file: references with npm versions
      if (versionStr.startsWith('file:')) {
        const npmName = FILE_TO_NPM_MAPPINGS[name] || name;
        const latestVersion = getLatestNpmVersion(npmName);

        if (latestVersion) {
          deps[name] = `^${latestVersion}`;
          updatedDeps.push(`${name}: file:... → ^${latestVersion}`);
        } else {
          // Can't find on npm, remove it
          delete deps[name];
          skippedDeps.push(`${name} (not on npm)`);
        }
        continue;
      }

      processedDeps.push(name);
    }

    vercelPackage[depType] = deps;
  }

  // Write the synced package
  fs.writeFileSync(
    vercelPackagePath,
    JSON.stringify(vercelPackage, null, 2) + '\n',
    'utf-8'
  );

  // Report
  log('✅ Synced package.vercel.json', 'green');

  if (updatedDeps.length > 0) {
    log('\n📝 Updated file: references to npm versions:', 'cyan');
    updatedDeps.forEach((d) => log(`   ${d}`, 'green'));
  }

  if (skippedDeps.length > 0) {
    log('\n⏭️  Skipped local-only packages:', 'yellow');
    skippedDeps.forEach((d) => log(`   ${d}`, 'yellow'));
  }

  log(
    `\n📊 Summary: ${processedDeps.length} deps kept, ${updatedDeps.length} converted, ${skippedDeps.length} skipped\n`,
    'cyan'
  );
}

syncPackages();
