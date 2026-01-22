#!/bin/bash
# RUNME.sh - Run the docs-site development server
# This script ensures dependencies are built and starts the dev server

set -e  # Exit on error

echo "🚀 Starting docs-site development server..."

# Step 1: Build open-source package if needed
if [ ! -f "../open-source/dist/esm/src/index.js" ]; then
  echo "📦 Open-source package not built. Building now..."
  (cd ../open-source && ./BUILDME.sh)
  echo "📦 Installing open-source package..."
  npm install
fi

# Step 2: Ensure ALL dependencies are installed (including devDependencies)
# NOTE: npm install should install devDependencies by default, but we verify to be safe
if [ ! -d "node_modules" ] || [ ! -d "node_modules/tailwindcss" ]; then
  echo "📦 Installing dependencies..."
  npm install
  # Verify critical devDependencies are installed
  if [ ! -d "node_modules/tailwindcss" ]; then
    echo "⚠️  Critical devDependencies missing. Installing explicitly..."
    npm install --include=dev
  fi
fi

# Step 3: Clean Next.js cache
echo "🧹 Cleaning Next.js cache..."
rm -rf .next

# Step 4: Start dev server
echo "🌐 Starting development server..."
npm run dev
