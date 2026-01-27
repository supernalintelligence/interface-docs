# Analytics System - Quick Start Guide

> 1-page reference for getting analytics working **RIGHT NOW**

---

## ⚡ 60-Second Setup

### 1. Get PostHog API Key (Optional but Recommended)

```bash
# Visit https://posthog.com and sign up (free tier)
# Copy your API key from Project Settings → API Keys
```

### 2. Configure Environment

Create/update `.env.local`:

```bash
# PostHog (NEW - required for tracking)
NEXT_PUBLIC_POSTHOG_API_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Google Tag Manager (may already exist)
NEXT_PUBLIC_GTM_CONTAINER_ID=GTM-XXXXXXX
```

### 3. Restart Server

```bash
npm run dev
```

### 4. Verify in Browser Console

Open http://localhost:3013 → Browser Console:

```javascript
// Should see:
[Analytics Module] Loaded (SSR or client)
[useAnalyticsInit] Analytics module loaded
[Analytics] Providers initialized: ['GTM', 'PostHog', 'Console']
[useAnalyticsInit] Analytics initialized successfully
```

---

## 📊 What's Being Tracked (Automatically)

| Event Type | What Triggers It | Example |
|------------|------------------|---------|
| **Component Click** | Click on any component with `data-testid` | Click "Increment" button → `🖱️ component_interaction` |
| **Tool Execution** | AI executes a @Tool | Chat: "increment counter" → `🔧 tool_execution` |
| **Navigation** | Route change | Home → Demo → `🧭 navigation` |
| **Variant Change** | Switch chat bubble variant | Full → Subtitle → `🎨 variant_change` |

---

## 🔍 Quick Tests

### Test 1: Component Interaction (5 seconds)
```bash
1. Visit: http://localhost:3013/examples
2. Click: "Increment" button
3. Check console: Should see 🖱️ component_interaction event
```

### Test 2: Navigation (10 seconds)
```bash
1. Click: Home → Demo → Docs
2. Check console: Should see 🧭 navigation events with duration
```

### Test 3: Variant Change (10 seconds)
```bash
1. Open: DevVariantSwitcher (bottom-right in dev mode)
2. Switch: Full → Subtitle
3. Check console: Should see 🎨 variant_change event
```

---

## 🎯 Track Custom Events (Code)

```typescript
import { track } from '@/lib/analytics';
import { Routes } from '@/architecture/Routes';
import { ChatBubbleVariant } from '@supernal/interface-nextjs';

track({
  event: 'custom_event',
  timestamp: Date.now(),
  sessionId: 'session_xxx', // Get from getSessionId()
  route: Routes.examples,
  variant: ChatBubbleVariant.full,
  metadata: {
    buttonClicked: 'download',
    fileSize: 1024
  }
});
```

---

## 🐛 Troubleshooting

### No console logs?
- **Check**: `process.env.NODE_ENV === 'development'`
- **Fix**: Console logging only works in dev mode

### PostHog not working?
- **Check**: `.env.local` has `NEXT_PUBLIC_POSTHOG_API_KEY`
- **Check**: Restart dev server after adding env vars
- **Check**: Browser console for `[PostHog] Initialized`

### TypeScript warnings?
- **Status**: Expected (20 warnings, non-critical)
- **Impact**: None (code compiles and runs fine)

---

## 📚 Full Documentation

- **README**: [README-ANALYTICS.md](./README-ANALYTICS.md) - Complete system docs
- **Checklist**: [SPRINT-CHECKLIST.md](./SPRINT-CHECKLIST.md) - Sprint tracking
- **Plan**: [../../.claude/plans/moonlit-hopping-matsumoto.md](../../.claude/plans/moonlit-hopping-matsumoto.md) - Original implementation plan

---

## 🚀 Next Steps

1. **Manual Setup**: Get PostHog API key (5 min)
2. **Verification**: Run all 3 quick tests (1 min)
3. **Sprint 2**: Build feedback modal (Week 2)

---

**That's it!** Analytics is now tracking all interactions automatically. 🎉
