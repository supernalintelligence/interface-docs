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
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
let changed = false;

const replacements = {
  '@supernal/interface': '^1.0.4',
  '@supernal/interface-nextjs': '^1.0.4',
  '@supernalintelligence/interface-enterprise': '^1.0.18'
};

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
npm install

# Step 3: Build
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3/3: Building Next.js application"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm run build

echo ""
echo "✅ Vercel build complete!"
