---
title: "Introducing SI Tracking: Analytics for the AI Agent Era"
date: 2026-02-01
status: published
tags:
  - analytics
  - tracking
  - open-source
  - react
tts:
  enabled: true
  voice: "nova"
---

# Introducing SI Tracking: Analytics for the AI Agent Era

**Track what matters. Build what works.**

Today we're releasing SI Tracking—a lightweight, privacy-conscious analytics module built into `@supernal/interface`. It's designed for modern applications where both humans and AI agents interact with your UI.

## Why Another Analytics Library?

Traditional analytics (Google Analytics, Mixpanel, Amplitude) were built for human-only interactions. They track pageviews, clicks, and conversions. But in the agent era, we need to understand:

- **Engagement quality**, not just quantity
- **Scroll depth** and time-on-content
- **Component-level interactions**, not just page-level
- **Session continuity** across human and agent actions

SI Tracking is built from the ground up for this new reality.

## Quick Start

```bash
npm install @supernal/interface
```

```typescript
import { createTracker, TrackingProvider, useTrackClick } from '@supernal/interface';

// Create a tracker
const tracker = createTracker({
  endpoint: '/api/v1/analytics',
  batchSize: 10,
});

// Wrap your app
function App() {
  return (
    <TrackingProvider tracker={tracker} userId={user?.id}>
      <YourApp />
    </TrackingProvider>
  );
}

// Track in components
function PostCard({ post }) {
  const tracker = useTracker();
  const trackClick = useTrackClick(tracker, 'PostCard');
  
  return (
    <button onClick={() => trackClick('like', post.id)}>
      Like
    </button>
  );
}
```

## Key Features

### 🎯 Automatic Batching
Events are queued and sent in batches to minimize network requests. Configure batch size and flush intervals to match your needs.

### 📊 Engagement Tracking
Track meaningful engagement—not just clicks, but time spent, scroll depth, and interaction patterns.

```typescript
const { recordInteraction } = useTrackEngagement(tracker, post.id);
// Automatically tracks duration and interactions when component unmounts
```

### 👁️ Visibility Detection
Use IntersectionObserver to track when content actually enters the viewport—more accurate than mount-based tracking.

```typescript
const ref = useTrackVisibility(tracker, 'PostCard', post.id);
<div ref={ref}>Content that tracks when visible</div>
```

### 🔒 Privacy-First
- No fingerprinting
- Session IDs stored in sessionStorage (not persistent)
- Easy to disable based on consent
- GDPR-friendly data structure

### 🔑 API Key Authentication
Secure your analytics endpoint with API keys:

```typescript
const tracker = createTracker({
  endpoint: '/api/v1/analytics',
  customFetch: async (url, options) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'x-si-api-key': process.env.NEXT_PUBLIC_SI_API_KEY,
      },
    });
  },
});
```

## API Key Process

1. **Generate keys** in your backend (server-side only)
2. **Store securely** — use environment variables
3. **Use client key** (`NEXT_PUBLIC_*`) for tracker
4. **Use admin key** for dashboard/aggregation queries

```bash
# .env.local
NEXT_PUBLIC_SI_API_KEY=si_client_xxx    # Limited: write events only
SI_ADMIN_API_KEY=si_admin_xxx           # Full: read aggregates, delete, etc.
```

## What's Next

- **Dashboard Components**: Drop-in React components for visualizing analytics
- **Supernal Cloud**: Hosted analytics service (no backend required)
- **Agent Analytics**: Special metrics for AI agent interactions

## Get Started

Full documentation: [docs/tracking.md](https://github.com/supernalintelligence/interface/blob/main/open-source/docs/tracking.md)

Integration guide: [docs/analytics-integration.md](https://github.com/supernalintelligence/interface/blob/main/open-source/docs/analytics-integration.md)

---

*SI Tracking is part of `@supernal/interface`, the open-source toolkit for building AI-controllable applications. [Learn more](https://supernal.ai)*
