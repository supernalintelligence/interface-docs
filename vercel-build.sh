#!/bin/bash
# Vercel build script for docs-site
# Configures dependencies for cloud environment before building

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🏗️  Vercel Build - @supernal-interface/docs-site"
echo "================================================"
echo ""

# Step 1: Configure dependencies for cloud
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1/3: Configuring dependencies for cloud"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Inline dependency setup - replace file:../ references with published versions
# Auto-detect versions from source package.json files
node -e "
const fs = require('fs');
const path = require('path');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
let changed = false;

// Read versions from source packages (use fallback if source not available)
function getVersion(pkgPath, fallback) {
  try {
    if (fs.existsSync(pkgPath)) {
      const sourcePkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      return '^' + sourcePkg.version;
    }
  } catch (e) {
    console.warn('  ⚠️  Could not read ' + pkgPath + ', using fallback: ' + fallback);
  }
  return fallback;
}

const replacements = {
  '@supernal/interface': getVersion('../open-source/package.json', '^1.0.9'),
  '@supernal/interface-nextjs': getVersion('../open-source/interface-nextjs/package.json', '^1.0.18'),
  '@supernalintelligence/interface-enterprise': getVersion('../enterprise/package.json', '^1.0.18')
};

console.log('📦 Detected versions:');
for (const [dep, version] of Object.entries(replacements)) {
  console.log('  ' + dep + ': ' + version);
}
console.log('');

for (const [dep, version] of Object.entries(replacements)) {
  if (pkg.dependencies[dep] && pkg.dependencies[dep].startsWith('file:')) {
    console.log('  ✓ ' + dep + ': ' + pkg.dependencies[dep] + ' → ' + version);
    pkg.dependencies[dep] = version;
    changed = true;
  }
}

if (changed) {
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
  console.log('✅ Updated package.json for cloud deployment');
} else {
  console.log('✓ package.json already configured for cloud');
}
"

# Step 2: Install dependencies
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2/3: Installing dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
# Remove lock file and node_modules - the lock is for workspace, not published packages
echo "Cleaning old workspace dependencies..."
rm -rf package-lock.json node_modules
npm install --include=dev

# Step 3: Build
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3/3: Building Next.js application"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm run build

echo ""
echo "✅ Vercel build complete!"
