#!/bin/bash
# Build script for @supernal-interface/docs-site
set -e

echo "🏗️  Building @supernal-interface/docs-site"
echo "==========================================="

# Check if linked packages are available
echo "🔗 Checking for linked packages..."
if [ ! -L "node_modules/@supernal/interface" ]; then
  echo "⚠️  @supernal/interface not linked"
  echo "   Run: cd ../open-source && npm link"
  echo "   Then: npm link @supernal/interface"
fi

if [ ! -L "node_modules/@supernalintelligence/interface-enterprise" ]; then
  echo "⚠️  @supernalintelligence/interface-enterprise not linked"
  echo "   Run: cd ../enterprise && npm link"
  echo "   Then: npm link @supernalintelligence/interface-enterprise"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run validation
echo "✅ Validating client directives..."
npm run validate || true

# Sync docs
echo "📚 Syncing documentation..."
npm run sync:docs || true

# Build Next.js app
echo "🔨 Building Next.js application..."
npm run build

echo "✅ @supernal-interface/docs-site build complete!"
echo ""
echo "📦 Build output:"
echo "   - .next/: Next.js build artifacts"
echo "   - out/: Static export (if using export)"
echo ""
echo "🚀 To start:"
echo "   npm run dev   - Development server"
echo "   npm start     - Production server"

