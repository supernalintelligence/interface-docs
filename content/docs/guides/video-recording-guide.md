# Story Video Recording: Complete Usage Guide

**Quick Start**: Write story → Record video → Test/Upload → Embed

---

## 1. Prerequisites

### Install & Build Enterprise Package

```bash
# Navigate to enterprise package
cd /Users/ianderrington/git/supernal-nova/platform/packages/@supernal-interface/enterprise

# Install dependencies (includes playwright-core)
npm install

# Build the package
npm run build

# Link for local testing
npm link

# Verify CLI is available
si record-story-video --help
```

---

## 2. Writing Stories for Video Recording

### Story Writing Guidelines

Stories for video recording should be:
- **Visual** - Focus on UI interactions
- **Sequential** - Clear step-by-step flow
- **Paced** - Not too fast, not too slow
- **Demonstrative** - Show key features

### Example: Simple Chat Demo

```gherkin
Feature: Chat Interface Demo
  As a viewer
  I want to see how the chat interface works
  So that I understand the product capabilities

  Background:
    Given I am on the demo page at "/demo/simple"
    And I wait for the page to fully load

  Scenario: Sending a chat message
    Given the chat interface is visible
    When I click to open the chat input
    And I type "Hello, this is a demonstration of our AI-powered chat" slowly
    And I click the send button
    Then the message appears in the chat history
    And I pause for 2 seconds to show the result

  Scenario: Using AI commands
    Given the chat is open
    When I type "open menu" in the chat
    And I click send
    Then the main menu opens via AI command
    And I highlight the opened menu for 1 second
```

### Where to Save Stories

```bash
# For documentation videos
docs-site/features/demos/

# For product tour videos
docs-site/features/tours/

# For tutorial videos
docs-site/features/tutorials/

# Structure example:
docs-site/features/
├── demos/
│   ├── chat-demo.feature
│   ├── counter-demo.feature
│   └── navigation-demo.feature
├── tours/
│   ├── getting-started.feature
│   └── advanced-features.feature
└── tutorials/
    ├── first-steps.feature
    └── power-user.feature
```

---

## 3. Recording Videos

### Basic Recording

```bash
# Record a story
si record-story-video docs-site/features/demos/chat-demo.feature

# Output: ./videos/stories/chat-demo.webm
```

### With Options

```bash
# High quality, slow paced for tutorials
si record-story-video docs-site/features/tutorials/first-steps.feature \
  --quality high \
  --step-delay 1500 \
  --output ./videos/tutorials

# Fast paced for quick demos
si record-story-video docs-site/features/demos/quick-tour.feature \
  --quality medium \
  --step-delay 500 \
  --output ./videos/demos

# No annotations for clean recording
si record-story-video docs-site/features/tours/product-tour.feature \
  --no-annotations \
  --quality high \
  --output ./videos/tours
```

### Advanced Recording

```bash
# Different base URL (staging/production)
si record-story-video features/demo.feature \
  --base-url https://demo.mysite.com \
  --output ./videos/production

# Minimal visual effects
si record-story-video features/clean-demo.feature \
  --no-cursor \
  --no-highlights \
  --no-annotations \
  --output ./videos/clean
```

---

## 4. Testing Videos Locally

### View Generated Videos

```bash
# macOS
open ./videos/stories/chat-demo.webm

# Linux
xdg-open ./videos/stories/chat-demo.webm

# Or use VLC, Chrome, Firefox
```

### Check Video Quality

1. **Cursor Movement**: Should be smooth, natural
2. **Click Highlights**: Green borders should be visible
3. **Annotations**: Step text should be readable
4. **Pacing**: Not too fast or slow
5. **Audio**: (Future feature)

### Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Video too fast | Increase `--step-delay` (default 500ms) |
| Cursor jumpy | This is expected behavior (10-step smooth movement) |
| Annotations hard to read | Use `--no-annotations` for cleaner look |
| Video file large | Use `--quality medium` or `low` |
| Page doesn't load | Check `--base-url` and ensure server is running |

---

## 5. Converting Videos for Web

### Install ffmpeg (if not installed)

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Check installation
ffmpeg -version
```

### Convert WebM to MP4

```bash
# Basic conversion
ffmpeg -i ./videos/stories/chat-demo.webm \
       ./videos/stories/chat-demo.mp4

# With optimization for web
ffmpeg -i ./videos/stories/chat-demo.webm \
       -c:v libx264 \
       -preset slow \
       -crf 22 \
       -c:a aac \
       -b:a 128k \
       ./videos/stories/chat-demo.mp4

# Create smaller preview
ffmpeg -i ./videos/stories/chat-demo.webm \
       -vf scale=1280:720 \
       -c:v libx264 \
       -crf 28 \
       ./videos/stories/chat-demo-preview.mp4
```

### Create GIF for Quick Previews

```bash
# Create optimized GIF (first 5 seconds)
ffmpeg -i ./videos/stories/chat-demo.webm \
       -t 5 \
       -vf "fps=10,scale=640:-1:flags=lanczos" \
       ./videos/stories/chat-demo-preview.gif
```

### Batch Conversion Script

```bash
#!/bin/bash
# convert-videos.sh

for video in ./videos/stories/*.webm; do
  filename=$(basename "$video" .webm)
  
  # MP4 for web
  ffmpeg -i "$video" \
         -c:v libx264 \
         -preset slow \
         -crf 22 \
         "./videos/stories/${filename}.mp4"
  
  # Small preview
  ffmpeg -i "$video" \
         -vf scale=640:360 \
         -c:v libx264 \
         -crf 28 \
         "./videos/stories/${filename}-preview.mp4"
  
  echo "✅ Converted $filename"
done
```

---

## 6. Uploading Videos

### Option 1: Vercel Blob Storage (Recommended)

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Upload video
vercel blob put ./videos/stories/chat-demo.mp4 \
  --token YOUR_VERCEL_TOKEN

# Returns URL like:
# https://blob.vercel-storage.com/chat-demo-abc123.mp4
```

### Option 2: GitHub (for smaller videos)

```bash
# Add to git (if < 100MB)
git lfs track "*.mp4"
git add ./videos/stories/chat-demo.mp4
git commit -m "docs: Add chat demo video"
git push

# Use GitHub raw URL:
# https://github.com/user/repo/raw/main/videos/stories/chat-demo.mp4
```

### Option 3: YouTube (Public)

1. Upload to YouTube
2. Set privacy to "Unlisted" or "Public"
3. Get embed code or share URL

### Option 4: AWS S3

```bash
# Upload to S3
aws s3 cp ./videos/stories/chat-demo.mp4 \
  s3://your-bucket/videos/demos/chat-demo.mp4 \
  --acl public-read

# URL: https://your-bucket.s3.amazonaws.com/videos/demos/chat-demo.mp4
```

---

## 7. Embedding Videos in Documentation Site

### Create Video Component

```tsx
// docs-site/src/components/VideoDemo.tsx
'use client';

import React from 'react';

interface VideoDemoProps {
  src: string;
  title: string;
  poster?: string; // Thumbnail image
  width?: string;
  height?: string;
}

export function VideoDemo({ 
  src, 
  title, 
  poster,
  width = '100%',
  height = 'auto' 
}: VideoDemoProps) {
  return (
    <div className="video-demo-container my-8">
      <video
        controls
        width={width}
        height={height}
        poster={poster}
        className="rounded-lg shadow-lg"
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        <source src={src.replace('.mp4', '.webm')} type="video/webm" />
        Your browser doesn't support video playback.
      </video>
      <p className="text-sm text-gray-600 mt-2 text-center">{title}</p>
    </div>
  );
}
```

### Use in MDX Documentation

```mdx
---
title: Chat Interface Guide
---

import { VideoDemo } from '@/components/VideoDemo';

# Chat Interface

Our chat interface allows natural language commands.

<VideoDemo 
  src="https://blob.vercel-storage.com/chat-demo.mp4"
  title="Chat Demo: Sending Messages"
  poster="/images/chat-demo-thumb.jpg"
/>

## Features

- Natural language processing
- AI command execution
- Real-time responses

<VideoDemo 
  src="https://blob.vercel-storage.com/ai-commands-demo.mp4"
  title="AI Commands Demo"
/>
```

### Embed YouTube Videos

```mdx
# Getting Started

<div className="youtube-container my-8">
  <iframe
    width="100%"
    height="500"
    src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
    title="Getting Started Tutorial"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
</div>
```

---

## 8. Creating a Video Gallery Page

### Video Gallery Component

```tsx
// docs-site/src/components/VideoGallery.tsx
'use client';

import React, { useState } from 'react';

interface Video {
  id: string;
  title: string;
  description: string;
  src: string;
  thumbnail: string;
  duration: string;
  category: 'tutorial' | 'demo' | 'tour';
}

export function VideoGallery({ videos }: { videos: Video[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filtered = selectedCategory === 'all'
    ? videos
    : videos.filter(v => v.category === selectedCategory);
  
  return (
    <div className="video-gallery">
      <div className="filters mb-6 flex gap-2">
        <button onClick={() => setSelectedCategory('all')}>All</button>
        <button onClick={() => setSelectedCategory('tutorial')}>Tutorials</button>
        <button onClick={() => setSelectedCategory('demo')}>Demos</button>
        <button onClick={() => setSelectedCategory('tour')}>Tours</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(video => (
          <div key={video.id} className="video-card">
            <a href={`/videos/${video.id}`}>
              <img src={video.thumbnail} alt={video.title} />
              <div className="p-4">
                <h3>{video.title}</h3>
                <p className="text-sm text-gray-600">{video.description}</p>
                <span className="text-xs">{video.duration}</span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Video Gallery Page

```tsx
// docs-site/src/app/videos/page.tsx
import { VideoGallery } from '@/components/VideoGallery';

const videos = [
  {
    id: 'chat-demo',
    title: 'Chat Interface Demo',
    description: 'Learn how to use our AI-powered chat',
    src: 'https://blob.vercel-storage.com/chat-demo.mp4',
    thumbnail: '/images/chat-demo-thumb.jpg',
    duration: '2:30',
    category: 'demo' as const
  },
  // ... more videos
];

export default function VideosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Video Demos & Tutorials</h1>
      <VideoGallery videos={videos} />
    </div>
  );
}
```

---

## 9. Automated Video Generation Pipeline

### Create Generation Script

```bash
#!/bin/bash
# scripts/generate-all-videos.sh

set -e

echo "🎬 Starting video generation pipeline..."

# Ensure server is running
echo "📡 Starting dev server..."
cd docs-site
npm run dev &
SERVER_PID=$!
sleep 5

# Wait for server to be ready
until $(curl --output /dev/null --silent --head --fail http://localhost:3000); do
    echo "Waiting for server..."
    sleep 2
done

echo "✅ Server ready"

# Generate all videos
cd ..
echo "🎥 Recording videos..."

si record-story-video docs-site/features/demos/chat-demo.feature \
  --output ./videos/demos \
  --quality high

si record-story-video docs-site/features/tutorials/getting-started.feature \
  --output ./videos/tutorials \
  --quality high \
  --step-delay 1500

si record-story-video docs-site/features/tours/product-tour.feature \
  --output ./videos/tours \
  --quality high

echo "🎬 Converting to web formats..."
./scripts/convert-videos.sh

echo "☁️  Uploading to storage..."
./scripts/upload-videos.sh

# Cleanup
kill $SERVER_PID

echo "✅ All videos generated successfully!"
```

### Add to npm scripts

```json
{
  "scripts": {
    "videos:generate": "./scripts/generate-all-videos.sh",
    "videos:convert": "./scripts/convert-videos.sh",
    "videos:upload": "./scripts/upload-videos.sh",
    "videos:all": "npm run videos:generate && npm run videos:convert && npm run videos:upload"
  }
}
```

---

## 10. Documentation Structure

### Where to Document

```
docs-site/
├── content/
│   └── docs/
│       ├── guides/
│       │   └── video-demos.mdx          # This guide
│       ├── tutorials/
│       │   ├── chat-tutorial.mdx        # Embed chat video
│       │   └── getting-started.mdx      # Embed intro video
│       └── features/
│           └── ai-commands.mdx          # Embed AI demo video
├── public/
│   └── videos/
│       ├── demos/                       # Hosted demo videos
│       ├── tutorials/                   # Tutorial videos
│       └── thumbnails/                  # Video thumbnails
└── features/
    ├── demos/                           # Source .feature files
    ├── tutorials/                       # Tutorial .feature files
    └── tours/                           # Product tour .feature files
```

### Documentation Page Example

```mdx
---
title: Video Demos
description: Watch our product in action
---

# Video Demonstrations

## Quick Start Videos

<VideoGallery category="tutorial" />

## Feature Demos

### Chat Interface

Our AI-powered chat interface enables natural language commands.

<VideoDemo 
  src="/videos/demos/chat-demo.mp4"
  title="Chat Interface Demo"
  poster="/videos/thumbnails/chat-demo.jpg"
/>

**What you'll see:**
- Opening the chat interface
- Sending messages
- Using AI commands
- Real-time responses

### Navigation

<VideoDemo 
  src="/videos/demos/navigation-demo.mp4"
  title="Navigation Demo"
/>

## Full Product Tour

<VideoDemo 
  src="/videos/tours/complete-tour.mp4"
  title="Complete Product Tour (5 minutes)"
  width="100%"
/>
```

---

## 11. Testing Checklist

Before publishing videos:

- [ ] Story executes without errors
- [ ] Video quality is acceptable
- [ ] Cursor movements are smooth
- [ ] Click highlights are visible
- [ ] Annotations are readable (if enabled)
- [ ] Pacing feels natural
- [ ] Video plays in target browsers
- [ ] Video loads on mobile devices
- [ ] Thumbnail image is generated
- [ ] Video is uploaded to storage
- [ ] Embed code works in documentation
- [ ] Page load time is acceptable

---

## 12. Quick Reference

### Common Commands

```bash
# Basic recording
si record-story-video features/demo.feature

# High quality tutorial
si record-story-video features/tutorial.feature \
  --quality high \
  --step-delay 1500

# Convert to MP4
ffmpeg -i video.webm video.mp4

# Generate thumbnail
ffmpeg -i video.mp4 -ss 00:00:01 -vframes 1 thumbnail.jpg
```

### File Locations

- **Stories**: `docs-site/features/{category}/*.feature`
- **Videos**: `./videos/{category}/*.webm`
- **Public**: `docs-site/public/videos/{category}/*.mp4`
- **Thumbnails**: `docs-site/public/videos/thumbnails/*.jpg`

---

## Need Help?

- **Story writing**: See existing `.feature` files in `docs-site/features/`
- **Technical issues**: Check `enterprise/src/stories/VIDEO_RECORDING_README.md`
- **Embedding**: See `docs-site/src/components/VideoDemo.tsx`
- **Blog post**: See `docs-site/blog/we-invented-a-tool-to-command-our-site.md`

---

**Next Steps**:
1. Write your first story
2. Record it locally
3. Test the video
4. Convert to web format
5. Upload and embed

