#!/bin/bash
# BUILDME.sh - Build the docs-site
# This script ensures the open-source package is built first, then builds docs-site

set -e  # Exit on error

echo "🔨 Building docs-site..."

# Step 1: Build open-source package first
echo "📦 Building @supernal/interface dependency..."
(cd ../open-source && ./BUILDME.sh)

# Step 2: Clean caches
echo "🧹 Cleaning caches..."
rm -rf .next node_modules/.cache

# Step 3: Install/update dependencies
echo "📦 Installing dependencies..."
npm install ../open-source

# Step 4: Build docs-site
echo "🏗️  Building Next.js application..."
npm run build

echo "✅ Build complete!"
