#!/bin/bash
set -e

echo "🏗️  Vercel Build - Supernal Interface Docs"
echo "=========================================="

# Use package.vercel.json (has published npm versions instead of file: deps)
cp package.vercel.json package.json

# Install
echo "📦 Installing dependencies..."
npm install

# Build
echo "📦 Building Next.js app..."
npm run build

echo "✅ Build complete!"
