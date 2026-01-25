#!/bin/bash
# Vercel build script - replaces workspace dependencies with published versions

set -e

echo "🏗️  Vercel Build - Supernal Interface Docs"
echo "=========================================="

# Replace file: dependencies with published versions
node << 'EOF'
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const replacements = {
  '@supernal/interface': '^1.0.9',
  '@supernal/interface-nextjs': '^1.0.19',
  '@supernalintelligence/interface-enterprise': '^1.0.18'
};

let changed = false;
for (const [dep, version] of Object.entries(replacements)) {
  if (pkg.dependencies[dep] && pkg.dependencies[dep].startsWith('file:')) {
    console.log(`✓ ${dep}: ${pkg.dependencies[dep]} → ${version}`);
    pkg.dependencies[dep] = version;
    changed = true;
  }
}

if (changed) {
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
  console.log('✅ Updated package.json for Vercel build\n');
}
EOF

# Install dependencies with corrected package.json
echo "📦 Installing dependencies..."
npm install

# Build
echo "📦 Building Next.js app..."
npm run build

echo "✅ Build complete!"
