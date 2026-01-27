# Analytics & Optimization System - Complete Guide

> **Status**: Sprint 1 Complete ✅ | Sprint 2-5 Pending
>
> **Last Updated**: 2026-01-26

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [What's Currently Implemented (Sprint 1)](#whats-currently-implemented-sprint-1)
4. [How to Use the Analytics System](#how-to-use-the-analytics-system)
5. [Manual Setup Required](#manual-setup-required)
6. [Testing & Verification](#testing--verification)
7. [Next Steps (Sprints 2-5)](#next-steps-sprints-2-5)
8. [Troubleshooting](#troubleshooting)
9. [API Reference](#api-reference)

---

## Overview

The Analytics & Optimization System provides **dual analytics tracking** (GTM + PostHog) with automatic event tracking for:

- **Component Interactions** - Tracks clicks, focus, blur, change, submit on all components with `data-testid`
- **Tool Executions** - Tracks @Tool decorator executions (AI-driven and direct)
- **Navigation Patterns** - Tracks route changes, time-on-page, navigation methods
- **Variant Usage** - Tracks ChatBubbleVariant changes (full, floating, drawer, subtitle)

### Key Features

✅ **Zero-Code Tracking** - Leverages existing `data-testid` attributes and @Tool decorators
✅ **Named Contracts** - All events reference Routes, Components, ChatBubbleVariant contracts
✅ **Dual Platform** - GTM + PostHog for redundancy and advanced features
✅ **Privacy-First** - GDPR consent support, input masking, opt-out capability
✅ **Type-Safe** - Full TypeScript schemas for all events

---

## Architecture

### File Structure

```
docs-site/
├── src/
│   ├── lib/
│   │   └── analytics/
│   │       ├── index.ts                    # Main AnalyticsManager (singleton)
│   │       ├── AnalyticsProvider.ts        # Provider interface + config types
│   │       ├── events/
│   │       │   └── EventSchema.ts          # TypeScript event schemas (9 types)
│   │       ├── providers/
│   │       │   ├── GTMProvider.ts          # Google Tag Manager integration
│   │       │   ├── PostHogProvider.ts      # PostHog analytics integration
│   │       │   └── ConsoleProvider.ts      # Dev console logging
│   │       └── trackers/
│   │           ├── ComponentTracker.ts     # Global event delegation for components
│   │           ├── ToolTracker.ts          # CustomEvent listener for tools
│   │           ├── NavigationTracker.ts    # Next.js router event tracking
│   │           └── VariantTracker.ts       # ChatBubbleVariant change tracking
│   └── hooks/
│       └── useAnalyticsInit.ts             # React hook for _app.tsx
├── docs/
│   └── analytics/
│       ├── README-ANALYTICS.md             # This file
│       └── SPRINT-CHECKLIST.md             # Implementation tracking
└── .env.example                            # Environment variables documented
```

### Data Flow

```
User Interaction
       ↓
Event Delegation / Router Events / CustomEvents
       ↓
Tracker (Component/Tool/Navigation/Variant)
       ↓
AnalyticsManager.track(event)
       ↓
[GTMProvider] [PostHogProvider] [ConsoleProvider]
       ↓
Google Analytics / PostHog Dashboard / Browser Console
```

### Event Types

1. **ComponentInteractionEvent** - Click, focus, blur, change, submit on components
2. **ToolExecutionEvent** - Tool executions with success/failure, duration, parameters
3. **NavigationEvent** - Route changes with time-on-page, navigation method
4. **VariantChangeEvent** - ChatBubbleVariant changes (manual, URL, storage, experiment)
5. **PageViewEvent** - Page views with landing page flag
6. **EngagementEvent** - Time-on-site, scroll depth, bounce rate
7. **FeedbackEvent** - User feedback submissions (Sprint 2)
8. **ConsentEvent** - Cookie consent granted/declined (Sprint 4)
9. **ErrorEvent** - JavaScript errors and exceptions (future)

---

## What's Currently Implemented (Sprint 1)

### ✅ Completed

1. **Analytics Module** (`src/lib/analytics/`)
   - AnalyticsManager singleton orchestrating all providers
   - Provider interface (IAnalyticsProvider) for extensibility
   - TypeScript event schemas with named contracts

2. **Providers**
   - GTMProvider - Wraps existing GTM integration in _app.tsx
   - PostHogProvider - PostHog SDK with feature flags support
   - ConsoleProvider - Dev-only pretty-print console logging

3. **Trackers**
   - ComponentTracker - Global event delegation (1 listener for all clicks)
   - ToolTracker - Listens to existing CustomEvents from @Tool decorators
   - NavigationTracker - Next.js router events for navigation tracking
   - VariantTracker - URL params + localStorage monitoring for variant changes

4. **Integration**
   - useAnalyticsInit hook added to _app.tsx
   - Dynamic import to avoid TypeScript compilation errors
   - Environment variables documented in .env.example

5. **Dependencies**
   - `posthog-js@^1.335.3` - PostHog SDK
   - `html2canvas@^1.4.1` - Screenshot capture (for Sprint 2 feedback)

### ⚠️ Known Issues

- **20 TypeScript warnings** - Internal type narrowing warnings (non-critical, don't prevent functionality)
- **Console logging only enabled in development** - Production tracking requires API keys
- **No visual feedback** - Events tracked silently (will add feedback UI in Sprint 2)

---

## How to Use the Analytics System

### 1. Current State (Development Mode)

The analytics system is **already integrated** and runs automatically. In development mode:

- ✅ Console logs all events (pretty-printed with emojis)
- ✅ GTM integration works if `NEXT_PUBLIC_GTM_CONTAINER_ID` is set
- ❌ PostHog tracking disabled (no API key)

### 2. Verify It's Working

**Open browser console** at http://localhost:3013 and look for:

```
[Analytics Module] Loaded (SSR or client)
[useAnalyticsInit] Analytics module loaded
[Analytics Module] initializeAnalytics called
[Analytics] Providers initialized: ['Console']
[Analytics] Trackers initialized
[useAnalyticsInit] Analytics initialized successfully
```

**Then interact with the page**:

```
🖱️ [Analytics] component_interaction (2026-01-26 10:30:45)
┌─────────┬────────────────────────────────┐
│ event   │ component_interaction          │
│ route   │ root                           │
│ variant │ full                           │
└─────────┴────────────────────────────────┘
```

### 3. Track Custom Events (Optional)

Import the `track` function from the analytics module:

```typescript
import { track } from '@/lib/analytics';
import { Routes } from '@/architecture/Routes';
import { ChatBubbleVariant } from '@supernal/interface-nextjs';

// Track a custom event
track({
  event: 'custom_event',
  timestamp: Date.now(),
  sessionId: 'current-session-id', // Get from getSessionId()
  route: Routes.examples,
  variant: ChatBubbleVariant.full,
  metadata: {
    customProperty: 'value'
  }
});
```

### 4. Access Analytics API

```typescript
import {
  initializeAnalytics,
  track,
  identify,
  reset,
  getSessionId,
  isInitialized,
  getPostHogProvider
} from '@/lib/analytics';

// Check if initialized
if (isInitialized()) {
  console.log('Session ID:', getSessionId());
}

// Identify user (after login)
await identify('user-123', {
  email: 'user@example.com',
  plan: 'pro'
});

// Reset on logout
await reset();

// Access PostHog for feature flags
const posthog = getPostHogProvider();
if (posthog) {
  const variant = posthog.getFeatureFlag('experiment-id');
}
```

---

## Manual Setup Required

### Step 1: Get PostHog API Key (Optional but Recommended)

1. **Sign up at https://posthog.com** (free tier available)
2. **Create a new project** or select existing
3. **Get your API key**:
   - Go to Project Settings → API Keys
   - Copy the key (format: `phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### Step 2: Configure Environment Variables

Create or update `.env.local`:

```bash
# Google Tag Manager (already configured?)
NEXT_PUBLIC_GTM_CONTAINER_ID=GTM-XXXXXXX

# PostHog Analytics (NEW)
NEXT_PUBLIC_POSTHOG_API_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# PostHog Session Replay (optional, requires Plus plan)
NEXT_PUBLIC_POSTHOG_SESSION_REPLAY=false
```

### Step 3: Restart Dev Server

```bash
npm run dev
```

### Step 4: Verify PostHog Integration

Check browser console for:

```
[PostHog] Initialized
[Analytics] Providers initialized: ['GTM', 'PostHog', 'Console']
```

Then visit PostHog dashboard to see events:
https://app.posthog.com → Events → Live Events

---

## Testing & Verification

### Test Checklist

Run through these scenarios to verify analytics tracking:

#### ✅ Component Interaction Tracking

1. Navigate to http://localhost:3013/examples
2. Click "Increment" button (Components.Counter.increment)
3. **Verify**: Console logs `🖱️ component_interaction` event
4. **Verify**: PostHog dashboard shows event (if API key configured)

#### ✅ Tool Execution Tracking

1. Open chat bubble (full variant)
2. Type "increment counter by 5" and send
3. AI executes tool
4. **Verify**: Console logs `🔧 tool_execution` event with `method: 'ai'`

#### ✅ Navigation Tracking

1. Navigate: Home → Demo → Docs → Examples
2. **Verify**: Console logs `🧭 navigation` events for each route change
3. **Verify**: Each event includes `duration` (time on previous page)

#### ✅ Variant Change Tracking

1. Open DevVariantSwitcher (bottom-right in dev mode)
2. Switch from "full" to "subtitle"
3. **Verify**: Console logs `🎨 variant_change` event
4. **Verify**: localStorage updated: `chat-variant: "subtitle"`
5. **Verify**: URL parameter added: `?variant=subtitle`

#### ✅ Session Management

1. Open browser console
2. Run: `localStorage.clear()` and refresh
3. **Verify**: New session ID generated
4. **Verify**: All events use new session ID

### Expected Console Output (Development)

```javascript
// Module loaded
[Analytics Module] Loaded (SSR or client)
[useAnalyticsInit] Analytics module loaded

// Initialization
[Analytics Module] initializeAnalytics called
[GTM] Already initialized with container GTM-XXXXXXX
[PostHog] Initialized
[Analytics] Providers initialized: ['GTM', 'PostHog', 'Console']
[Analytics] Trackers initialized
[useAnalyticsInit] Analytics initialized successfully

// Component interaction
🖱️ [Analytics] component_interaction (10:30:45.123)
┌─────────┬────────────────────────────────┐
│ event   │ component_interaction          │
│ route   │ examples                       │
│ variant │ full                           │
└─────────┴────────────────────────────────┘

// Tool execution
🔧 [Analytics] tool_execution (10:31:02.456)
┌─────────┬────────────────────────────────┐
│ toolId  │ counter.increment              │
│ method  │ ai                             │
│ success │ true                           │
└─────────┴────────────────────────────────┘

// Navigation
🧭 [Analytics] navigation (10:31:15.789)
┌─────────┬────────────────────────────────┐
│ from    │ examples                       │
│ to      │ docs                           │
│ duration│ 13333 ms                       │
└─────────┴────────────────────────────────┘

// Variant change
🎨 [Analytics] variant_change (10:31:30.012)
┌─────────┬────────────────────────────────┐
│ from    │ full                           │
│ to      │ subtitle                       │
│ method  │ manual                         │
└─────────┴────────────────────────────────┘
```

---

## Next Steps (Sprints 2-5)

### Sprint 2: Feedback Modal (Week 2) - NOT STARTED

**Goal**: Build global feedback collection UI

**Files to Create**:
- `src/lib/feedback.ts` - Feedback submission logic
- `src/pages/api/feedback.ts` - GitHub Issues API route
- `src/components/feedback/FeedbackModal.tsx` - Global modal
- `src/components/feedback/FeedbackButton.tsx` - Floating trigger
- `src/hooks/useFeedback.ts` - Feedback state hook

**Manual Setup**:
- Create GitHub Personal Access Token for Issues API
- Add `GITHUB_TOKEN` to `.env.local`

**Deliverables**:
- ✅ Global feedback button (bottom-right, matches DevVariantSwitcher)
- ✅ 4-tab modal: Bug Report, Feature Request, Question, General
- ✅ Screenshot capture with html2canvas
- ✅ System diagnostics auto-attach
- ✅ Creates GitHub issues on submit

### Sprint 3: Contextual Feedback (Week 3) - NOT STARTED

**Goal**: Add component-level feedback widgets

**Files to Create**:
- `src/components/feedback/ComponentFeedback.tsx` - "Was this helpful?" widget
- `src/components/feedback/RatingWidget.tsx` - Star/thumbs rating

**Integration**:
- Add ComponentFeedback to 3+ pages (docs, examples, landing)

**Deliverables**:
- ✅ Contextual "Was this helpful?" widgets
- ✅ 👍 👎 buttons with optional comment
- ✅ Analytics tracking for feedback events

### Sprint 4: NPS & Consent (Week 4) - NOT STARTED

**Goal**: Add NPS survey and GDPR compliance

**Files to Create**:
- `src/components/feedback/NPSModal.tsx` - Net Promoter Score survey
- `src/components/feedback/CookieConsent.tsx` - GDPR banner

**Display Rules**:
- NPS: After 2 page views OR 30 seconds on site
- NPS: Once per month per user
- Cookie consent: On first visit only

**Deliverables**:
- ✅ NPS modal with 0-10 score + reason
- ✅ Cookie consent banner (bottom, non-blocking)
- ✅ Consent gating for analytics (respects opt-out)

### Sprint 5: A/B Testing (Week 5) - NOT STARTED

**Goal**: Launch ChatBubbleVariant A/B test

**PostHog Setup**:
1. Create experiment: "chat-bubble-variant-test"
2. Variants: full (control), floating, subtitle
3. Target: All users (or specific cohort)

**Files to Create**:
- `src/lib/analytics/experiments.ts` - A/B test helpers

**Deliverables**:
- ✅ PostHog experiment integration
- ✅ Automatic variant assignment
- ✅ Experiment tracking in analytics events
- ✅ Dashboard for analyzing results

---

## Troubleshooting

### Issue: No console logs appearing

**Cause**: Analytics only logs in development mode

**Solution**: Check `process.env.NODE_ENV === 'development'`

---

### Issue: "Failed to read source code" errors

**Cause**: Monorepo dependencies not built

**Solution**: These are warnings, not errors. The analytics system still works. To fix:
```bash
cd ../enterprise && npm run build
cd ../open-source && npm run build
```

---

### Issue: PostHog events not appearing in dashboard

**Possible Causes**:
1. API key not set in `.env.local`
2. Invalid API key format
3. PostHog dashboard filter not showing recent events

**Solution**:
1. Verify `NEXT_PUBLIC_POSTHOG_API_KEY` is set correctly
2. Check browser console for `[PostHog] Initialized`
3. In PostHog dashboard: Events → Live Events → Refresh

---

### Issue: TypeScript compilation warnings

**Cause**: Type narrowing issues with Routes and ChatBubbleVariant unions

**Impact**: Non-critical, doesn't prevent functionality

**Solution**: Will be fixed incrementally as we test and refine

---

## API Reference

### `initializeAnalytics(config, router): Promise<void>`

Initializes the analytics system with providers and trackers.

**Parameters**:
- `config: AnalyticsConfig` - Configuration object
- `router: NextRouter` - Next.js router instance

**Example**:
```typescript
import { initializeAnalytics } from '@/lib/analytics';
import { useRouter } from 'next/router';

const router = useRouter();
await initializeAnalytics({
  providers: {
    gtm: { enabled: true, containerId: 'GTM-XXX' },
    posthog: { enabled: true, apiKey: 'phc_xxx' },
    console: { enabled: true }
  },
  consent: { required: true, defaultState: 'granted' },
  performance: { batchEnabled: false },
  debug: true
}, router);
```

---

### `track(event: AnalyticsEvent): void`

Tracks an analytics event to all providers.

**Parameters**:
- `event: AnalyticsEvent` - Event object (see EventSchema.ts)

**Example**:
```typescript
import { track } from '@/lib/analytics';

track({
  event: 'component_interaction',
  timestamp: Date.now(),
  sessionId: 'session_xxx',
  route: 'examples',
  variant: 'full',
  component: 'counter-increment-btn',
  action: 'click'
});
```

---

### `identify(userId, traits): Promise<void>`

Identifies a user with traits (call after login).

**Parameters**:
- `userId: string` - Unique user ID
- `traits?: Record<string, unknown>` - User properties

**Example**:
```typescript
import { identify } from '@/lib/analytics';

await identify('user-123', {
  email: 'user@example.com',
  plan: 'pro',
  signupDate: '2026-01-15'
});
```

---

### `reset(): Promise<void>`

Resets user identification and generates new session ID (call on logout).

**Example**:
```typescript
import { reset } from '@/lib/analytics';

await reset();
```

---

### `getSessionId(): string`

Returns the current session ID.

**Returns**: `string` - Session ID (format: `session_{timestamp}_{random}`)

---

### `isInitialized(): boolean`

Checks if analytics system is initialized.

**Returns**: `boolean` - True if initialized

---

### `getPostHogProvider(): PostHogProvider | undefined`

Gets PostHog provider instance for feature flags.

**Returns**: `PostHogProvider | undefined`

**Example**:
```typescript
import { getPostHogProvider } from '@/lib/analytics';

const posthog = getPostHogProvider();
if (posthog) {
  const variant = posthog.getFeatureFlag('experiment-id');
  console.log('Experiment variant:', variant);
}
```

---

## Questions?

- **Analytics not tracking?** Check browser console for errors
- **PostHog not working?** Verify API key in `.env.local`
- **Need custom events?** Use `track()` function with custom event type
- **Want to disable tracking?** Set `providers.console.enabled: false` in config

---

**Next Action**: Follow Sprint 2 checklist to build feedback modal UI
