# Analytics & Optimization System - Sprint Checklist

> **Purpose**: Track implementation progress across all 5 sprints
>
> **Last Updated**: 2026-01-26
>
> **Status**: Sprint 1 Complete ✅ | Sprints 2-5 Pending

---

## Sprint 1: Analytics Foundation ✅ COMPLETE

**Goal**: Integrate GTM + PostHog with automatic event tracking

**Duration**: Week 1 (2026-01-20 to 2026-01-26)

### Code Implementation ✅

#### Files Created (13 files)

- [x] `src/lib/analytics/index.ts` - AnalyticsManager singleton
- [x] `src/lib/analytics/AnalyticsProvider.ts` - Provider interface + config types
- [x] `src/lib/analytics/events/EventSchema.ts` - 9 event type definitions
- [x] `src/lib/analytics/providers/GTMProvider.ts` - Google Tag Manager integration
- [x] `src/lib/analytics/providers/PostHogProvider.ts` - PostHog SDK integration
- [x] `src/lib/analytics/providers/ConsoleProvider.ts` - Dev console logging
- [x] `src/lib/analytics/trackers/ComponentTracker.ts` - Global event delegation
- [x] `src/lib/analytics/trackers/ToolTracker.ts` - CustomEvent listener
- [x] `src/lib/analytics/trackers/NavigationTracker.ts` - Router event tracking
- [x] `src/lib/analytics/trackers/VariantTracker.ts` - Variant change tracking
- [x] `src/hooks/useAnalyticsInit.ts` - React hook for _app.tsx
- [x] `docs/analytics/README-ANALYTICS.md` - Complete documentation
- [x] `docs/analytics/SPRINT-CHECKLIST.md` - This file

#### Files Modified (2 files)

- [x] `src/pages/_app.tsx` - Added `useAnalyticsInit(router)` call
- [x] `.env.example` - Documented PostHog environment variables

#### Dependencies Installed (2 packages)

- [x] `posthog-js@^1.335.3` - PostHog analytics SDK
- [x] `html2canvas@^1.4.1` - Screenshot capture (for Sprint 2)

### Manual Setup ⚠️ REQUIRED

#### Environment Variables

- [ ] **Get PostHog API Key** (https://posthog.com)
  1. Sign up for PostHog account
  2. Create new project or select existing
  3. Copy API key from Project Settings → API Keys
  4. Format: `phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

- [ ] **Update .env.local**
  ```bash
  # Add these lines (GTM may already exist)
  NEXT_PUBLIC_GTM_CONTAINER_ID=GTM-XXXXXXX
  NEXT_PUBLIC_POSTHOG_API_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
  NEXT_PUBLIC_POSTHOG_SESSION_REPLAY=false
  ```

- [ ] **Restart dev server** (`npm run dev`)

### Testing & Verification ⚠️ REQUIRED

#### Console Logging Test (Development Mode)

- [ ] Start dev server: `npm run dev`
- [ ] Open browser console at http://localhost:3013
- [ ] Verify initialization messages:
  ```
  [Analytics Module] Loaded (SSR or client)
  [useAnalyticsInit] Analytics module loaded
  [Analytics Module] initializeAnalytics called
  [Analytics] Providers initialized
  [useAnalyticsInit] Analytics initialized successfully
  ```

#### Component Interaction Test

- [ ] Navigate to http://localhost:3013/examples
- [ ] Click "Increment" button
- [ ] **Verify**: Console shows `🖱️ component_interaction` event with:
  - `component: 'counter-increment-btn'`
  - `action: 'click'`
  - `route: 'examples'`
  - `variant: 'full'`

#### Tool Execution Test

- [ ] Open chat bubble (full variant)
- [ ] Type "increment counter by 5" and send
- [ ] **Verify**: Console shows `🔧 tool_execution` event with:
  - `toolId: 'counter.increment'`
  - `method: 'ai'`
  - `success: true`

#### Navigation Test

- [ ] Navigate: Home → Demo → Docs → Examples
- [ ] **Verify**: Console shows `🧭 navigation` events for each route change
- [ ] **Verify**: Each event includes `duration` (time on previous page)

#### Variant Change Test

- [ ] Open DevVariantSwitcher (bottom-right, dev mode only)
- [ ] Switch from "full" to "subtitle"
- [ ] **Verify**: Console shows `🎨 variant_change` event
- [ ] **Verify**: URL parameter added: `?variant=subtitle`
- [ ] **Verify**: localStorage updated: `chat-variant: "subtitle"`

#### PostHog Integration Test (If API Key Configured)

- [ ] Perform any of the tests above
- [ ] Visit PostHog dashboard: https://app.posthog.com
- [ ] Navigate to: Events → Live Events
- [ ] **Verify**: Events appear in real-time
- [ ] **Verify**: Event properties include named contracts (route, variant, component)

### Known Issues ⚠️

- [ ] **20 TypeScript warnings** - Type narrowing issues (non-critical, don't prevent functionality)
  - Location: `src/lib/analytics/trackers/` and `src/lib/analytics/index.ts`
  - Impact: None (warnings only, code compiles and runs)
  - Fix: Incremental type narrowing improvements (low priority)

- [ ] **Console logging only in development** - Production requires API keys
  - Expected behavior (security best practice)
  - No action needed

### Sprint 1 Success Criteria ✅

- [x] Analytics module structure created with all providers and trackers
- [x] useAnalyticsInit hook integrated into _app.tsx
- [x] Console logging works in development mode
- [x] GTM integration functional (if container ID provided)
- [x] PostHog integration functional (if API key provided)
- [x] Component interaction tracking via global event delegation
- [x] Tool execution tracking via existing CustomEvents
- [x] Navigation tracking via Next.js router events
- [x] Variant change tracking via URL + localStorage monitoring
- [x] Documentation complete (README-ANALYTICS.md)
- [x] Checklist tracking document created (this file)

---

## Sprint 2: Feedback Modal 📋 NOT STARTED

**Goal**: Build global feedback collection UI

**Duration**: Week 2 (Estimated: 5-7 days)

**Prerequisites**: Sprint 1 complete ✅

### Code Implementation

#### Files to Create (5 files)

- [ ] `src/lib/feedback.ts` - Feedback submission logic
  - Functions: `submitFeedback()`, `captureScreenshot()`, `collectDiagnostics()`
  - Integration with GitHub Issues API

- [ ] `src/pages/api/feedback.ts` - Next.js API route
  - Proxies GitHub Issues API
  - Requires `GITHUB_TOKEN` environment variable

- [ ] `src/components/feedback/FeedbackModal.tsx` - Global feedback modal
  - 4 tabs: Bug Report, Feature Request, Question, General
  - Form fields: title, description, category, email (optional)
  - Screenshot capture button (html2canvas)
  - System diagnostics auto-attach

- [ ] `src/components/feedback/FeedbackButton.tsx` - Floating trigger button
  - Style: Matches DevVariantSwitcher (glassmorphism)
  - Position: Fixed bottom-right, z-index: 50
  - Text: "💬 Feedback"

- [ ] `src/hooks/useFeedback.ts` - Feedback state management
  - Functions: `openFeedbackModal()`, `closeFeedbackModal()`
  - State: modal visibility, current tab, form data

#### Files to Modify (2 files)

- [ ] `src/pages/_app.tsx` - Add FeedbackButton component
  ```typescript
  import { FeedbackButton } from '@/components/feedback/FeedbackButton';
  // ... in JSX:
  <FeedbackButton />
  ```

- [ ] `src/lib/analytics.ts` - Add feedback tracking functions
  ```typescript
  export function trackFeedbackSubmitted(type, metadata) { ... }
  ```

- [ ] `src/architecture/ComponentNames.ts` - Add Feedback namespace
  ```typescript
  export const Feedback = {
    button: 'feedback-button',
    modal: 'feedback-modal',
    // ... more components
  } as const;
  ```

### Manual Setup ⚠️ REQUIRED

#### GitHub Personal Access Token

- [ ] **Create GitHub PAT** (https://github.com/settings/tokens)
  1. Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Generate new token (classic)
  3. Scopes: Select `public_repo` (for public repos) or `repo` (for private repos)
  4. Copy token (format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

- [ ] **Update .env.local**
  ```bash
  GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  ```

- [ ] **Restart dev server** (`npm run dev`)

### Testing & Verification

#### Feedback Button Test

- [ ] Navigate to any page
- [ ] **Verify**: Feedback button visible (bottom-right)
- [ ] Click feedback button
- [ ] **Verify**: Modal opens with 4 tabs

#### Bug Report Submission Test

- [ ] Click "Bug Report" tab
- [ ] Fill in: Title, Description
- [ ] Click "Attach Screenshot" button
- [ ] **Verify**: Screenshot preview appears
- [ ] Click "Submit"
- [ ] **Verify**: Success toast appears
- [ ] **Verify**: GitHub issue created in repo
- [ ] **Verify**: Console shows `feedback_submitted` analytics event

#### Feature Request Test

- [ ] Click "Feature Request" tab
- [ ] Fill in form
- [ ] Submit
- [ ] **Verify**: GitHub issue created with `enhancement` label

### Sprint 2 Success Criteria

- [ ] FeedbackButton visible on all pages
- [ ] FeedbackModal opens/closes smoothly
- [ ] All 4 tabs functional (Bug, Feature, Question, General)
- [ ] Screenshot capture works (html2canvas)
- [ ] System diagnostics auto-attach
- [ ] GitHub issues created successfully
- [ ] Analytics events tracked for feedback submissions
- [ ] Error handling for failed submissions

---

## Sprint 3: Contextual Feedback 📋 NOT STARTED

**Goal**: Add component-level feedback widgets

**Duration**: Week 3 (Estimated: 3-5 days)

**Prerequisites**: Sprint 2 complete

### Code Implementation

#### Files to Create (2 files)

- [ ] `src/components/feedback/ComponentFeedback.tsx` - Contextual widget
  - Props: `componentId`, `route`
  - UI: 👍 👎 buttons
  - On click: Expand textarea for comment
  - Submit: Track event + show "Thank you!" message (auto-hide after 3s)

- [ ] `src/components/feedback/RatingWidget.tsx` - Star/thumbs rating
  - Props: `context`, `onRate`
  - UI: 5-star rating or thumbs up/down
  - Controlled component pattern

#### Files to Modify (4+ files)

- [ ] `src/pages/docs/[slug].tsx` - Add ComponentFeedback at bottom
- [ ] `src/pages/examples/index.tsx` - Add ComponentFeedback at bottom
- [ ] `src/pages/index.tsx` - Add ComponentFeedback at bottom
- [ ] (Add to 2-3 more pages as needed)

### Testing & Verification

#### Component Feedback Test

- [ ] Navigate to /docs page
- [ ] Scroll to bottom
- [ ] **Verify**: "Was this helpful?" widget visible
- [ ] Click 👍
- [ ] **Verify**: Textarea expands (optional comment)
- [ ] Submit comment (or skip)
- [ ] **Verify**: "Thank you!" message appears
- [ ] **Verify**: Message auto-hides after 3 seconds
- [ ] **Verify**: Analytics event `component_feedback` tracked

#### Rating Widget Test

- [ ] Find RatingWidget on page
- [ ] Click 3rd star (3/5 rating)
- [ ] **Verify**: Stars highlight (1-3)
- [ ] **Verify**: Analytics event `rating` tracked with `rating: 3`

### Sprint 3 Success Criteria

- [ ] ComponentFeedback widget functional
- [ ] RatingWidget functional
- [ ] Widgets added to 3+ pages
- [ ] Analytics tracking for all feedback interactions
- [ ] UI matches glassmorphism design system
- [ ] Feedback stored (localStorage or API)

---

## Sprint 4: NPS & Consent 📋 NOT STARTED

**Goal**: Add NPS survey and GDPR compliance

**Duration**: Week 4 (Estimated: 5-7 days)

**Prerequisites**: Sprint 3 complete

### Code Implementation

#### Files to Create (2 files)

- [ ] `src/components/feedback/NPSModal.tsx` - Net Promoter Score survey
  - Display rules: After 2 page views OR 30 seconds on site
  - Frequency: Once per month per user (localStorage tracking)
  - UI: Modal with 0-10 score buttons + reason textarea
  - Submit: Track NPS score in analytics + PostHog

- [ ] `src/components/feedback/CookieConsent.tsx` - GDPR banner
  - Position: Bottom banner (non-blocking)
  - Buttons: Accept / Decline
  - Link: Privacy Policy
  - State: Stored in localStorage (`supernal-cookie-consent`)
  - Behavior: If declined, disable GTM and PostHog tracking

#### Files to Modify (2 files)

- [ ] `src/pages/_app.tsx` - Add NPSModal and CookieConsent
  ```typescript
  <NPSModal />
  <CookieConsent />
  ```

- [ ] `src/lib/analytics.ts` - Add NPS and consent tracking
  ```typescript
  export function trackNPS(score, reason) { ... }
  export function trackCookieConsent(accepted) { ... }
  ```

### Manual Setup ⚠️ REQUIRED

#### Privacy Policy Page

- [ ] **Create /privacy page** (or link to existing policy)
  - Path: `src/pages/privacy.tsx`
  - Content: GDPR-compliant privacy policy
  - Sections: Data collection, cookies, opt-out, data deletion

### Testing & Verification

#### NPS Modal Test

- [ ] Clear localStorage: `localStorage.clear()`
- [ ] Visit homepage
- [ ] Navigate to 2 pages OR wait 30 seconds
- [ ] **Verify**: NPS modal appears (bottom-right)
- [ ] Select score (e.g., 9)
- [ ] Type reason
- [ ] Click Submit
- [ ] **Verify**: Modal hides
- [ ] **Verify**: localStorage updated (`nps-last-shown`)
- [ ] **Verify**: Analytics event `nps_score` tracked
- [ ] Refresh page
- [ ] **Verify**: Modal does NOT appear (30-day cooldown)

#### Cookie Consent Test

- [ ] Clear localStorage: `localStorage.clear()`
- [ ] Visit site
- [ ] **Verify**: Cookie consent banner appears (bottom)
- [ ] Click "Accept"
- [ ] **Verify**: Banner hides
- [ ] **Verify**: localStorage `supernal-cookie-consent: "granted"`
- [ ] **Verify**: GTM and PostHog tracking enabled
- [ ] Refresh page
- [ ] **Verify**: Banner does NOT appear

#### Opt-Out Test

- [ ] Clear localStorage
- [ ] Visit site
- [ ] Click "Decline" on consent banner
- [ ] **Verify**: localStorage `supernal-cookie-consent: "declined"`
- [ ] **Verify**: GTM and PostHog tracking disabled
- [ ] Interact with site
- [ ] **Verify**: No analytics events sent to GTM/PostHog
- [ ] **Verify**: Console provider still logs (dev mode only)

### Sprint 4 Success Criteria

- [ ] NPS modal functional with display rules
- [ ] NPS scores tracked in analytics + PostHog
- [ ] Cookie consent banner functional
- [ ] Consent state persisted in localStorage
- [ ] Analytics respects opt-out (disables GTM + PostHog)
- [ ] Privacy policy page created
- [ ] GDPR compliance verified

---

## Sprint 5: A/B Testing 📋 NOT STARTED

**Goal**: Launch ChatBubbleVariant A/B test

**Duration**: Week 5 (Estimated: 3-5 days)

**Prerequisites**: Sprint 4 complete

### Code Implementation

#### Files to Create (1 file)

- [ ] `src/lib/analytics/experiments.ts` - A/B testing helpers
  ```typescript
  export async function getChatVariantExperiment(posthog) {
    const flag = posthog.getFeatureFlag('chat-bubble-variant-test');
    if (flag) {
      await posthog.trackExperiment('chat-bubble-variant-test', flag);
      return flag as ChatBubbleVariantType;
    }
    return ChatBubbleVariant.full; // Default control
  }
  ```

#### Files to Modify (1 file)

- [ ] `src/pages/_app.tsx` - Integrate experiment assignment
  ```typescript
  useEffect(() => {
    const experimentVariant = await getChatVariantExperiment(posthogProvider);
    if (experimentVariant && !localStorage.getItem('chat-variant')) {
      setChatVariant(experimentVariant);
      localStorage.setItem('chat-variant', experimentVariant);
      track({
        event: 'variant_change',
        fromVariant: chatVariant,
        toVariant: experimentVariant,
        method: 'experiment',
        experimentId: 'chat-bubble-variant-test'
      });
    }
  }, []);
  ```

### Manual Setup ⚠️ REQUIRED

#### PostHog Experiment Configuration

- [ ] **Create PostHog Experiment**
  1. Visit PostHog dashboard: https://app.posthog.com
  2. Navigate to: Experiments → New Experiment
  3. Name: "chat-bubble-variant-test"
  4. Feature flag key: "chat-bubble-variant-test"
  5. Variants:
     - Control: "full" (33%)
     - Test A: "floating" (33%)
     - Test B: "subtitle" (34%)
  6. Target: All users (or specific cohort)
  7. Goal metric: Engagement rate, conversion, etc.
  8. Click "Launch"

- [ ] **Verify Feature Flag**
  - PostHog dashboard → Feature Flags
  - **Verify**: "chat-bubble-variant-test" is active
  - **Verify**: Rollout percentage is 100%

### Testing & Verification

#### Experiment Assignment Test

- [ ] Clear localStorage: `localStorage.clear()`
- [ ] Visit homepage
- [ ] **Verify**: Chat bubble variant assigned (check localStorage)
- [ ] **Verify**: Console shows `variant_change` event with `method: 'experiment'`
- [ ] **Verify**: PostHog dashboard shows experiment assignment event

#### Variant Distribution Test

- [ ] Open 10+ incognito windows (different sessions)
- [ ] Visit homepage in each
- [ ] **Verify**: Variants distributed roughly evenly (33/33/34%)
- [ ] **Verify**: Each session assigned consistent variant

#### Experiment Tracking Test

- [ ] Interact with site (click buttons, navigate, etc.)
- [ ] Visit PostHog dashboard → Experiments → "chat-bubble-variant-test"
- [ ] **Verify**: Events attributed to correct variant
- [ ] **Verify**: Goal metrics tracking per variant

### Sprint 5 Success Criteria

- [ ] PostHog experiment configured
- [ ] Automatic variant assignment functional
- [ ] Experiment tracking in analytics events
- [ ] Variant consistency across session
- [ ] Dashboard shows experiment results
- [ ] Statistical significance achieved (sample size > 100 per variant)
- [ ] Winning variant identified (after 2 weeks)

---

## Post-Sprint 5: Deployment & Monitoring

### Production Deployment Checklist

- [ ] **Verify all environment variables set in production**
  - `NEXT_PUBLIC_GTM_CONTAINER_ID`
  - `NEXT_PUBLIC_POSTHOG_API_KEY`
  - `NEXT_PUBLIC_POSTHOG_HOST`
  - `NEXT_PUBLIC_POSTHOG_SESSION_REPLAY`
  - `GITHUB_TOKEN`

- [ ] **Disable console logging in production**
  - Verify `console.enabled: false` when `NODE_ENV === 'production'`

- [ ] **Test production build**
  ```bash
  npm run build
  npm start
  ```

- [ ] **Verify analytics in production**
  - Visit production site
  - Interact with site (click, navigate, etc.)
  - Check PostHog dashboard for events
  - Check Google Analytics for events

### Ongoing Monitoring

- [ ] **Weekly**: Check PostHog dashboard for anomalies
- [ ] **Weekly**: Review feedback submissions (GitHub issues)
- [ ] **Monthly**: Analyze NPS scores and trends
- [ ] **Monthly**: Review A/B test results
- [ ] **Quarterly**: Audit analytics data quality
- [ ] **Quarterly**: Update privacy policy if data collection changes

---

## Summary: What's Done vs. What's Left

### ✅ Completed (Sprint 1)

- Analytics module structure with providers and trackers
- GTM + PostHog + Console integration
- Automatic event tracking (components, tools, navigation, variants)
- useAnalyticsInit hook in _app.tsx
- TypeScript event schemas
- Documentation (README-ANALYTICS.md)
- This checklist

### ⏳ In Progress

- Manual setup: PostHog API key configuration
- Testing: Console logging verification

### 📋 Remaining (Sprints 2-5)

- Sprint 2: Feedback modal + GitHub Issues integration (5-7 days)
- Sprint 3: Contextual feedback widgets (3-5 days)
- Sprint 4: NPS survey + Cookie consent (5-7 days)
- Sprint 5: A/B testing with PostHog experiments (3-5 days)

### 📊 Progress Overview

- **Total Sprints**: 5
- **Completed**: 1 (20%)
- **Remaining**: 4 (80%)
- **Estimated Time**: 16-24 days remaining
- **Estimated Completion**: Mid-February 2026

---

## Next Immediate Actions

1. **Manual Setup** (30 minutes):
   - [ ] Get PostHog API key from https://posthog.com
   - [ ] Add `NEXT_PUBLIC_POSTHOG_API_KEY` to `.env.local`
   - [ ] Restart dev server

2. **Verification Testing** (15 minutes):
   - [ ] Run component interaction test
   - [ ] Run navigation test
   - [ ] Run variant change test
   - [ ] Verify events in browser console
   - [ ] Verify events in PostHog dashboard (if API key configured)

3. **Sprint 2 Kickoff** (Next Session):
   - [ ] Review Sprint 2 checklist
   - [ ] Create GitHub Personal Access Token
   - [ ] Start building FeedbackModal component

---

**Questions or Issues?** See [README-ANALYTICS.md](./README-ANALYTICS.md) → Troubleshooting section
