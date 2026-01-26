# Landing Page A/B Testing - Implementation & Optimization Plan

## Current Status (Phase 1 - Complete)

✅ **Manual Variant Switching Implemented**

We now have 4 landing page variants that can be switched using:
- Environment variable: `NEXT_PUBLIC_HERO_VARIANT=a|b|c|d`
- Query parameter: `?variant=a|b|c|d` (overrides env var)

### Variants Overview

| Variant | Primary Text | Animation | Secondary Text | Purpose |
|---------|--------------|-----------|----------------|---------|
| **A** (Control) | "Agentify your [React App/Website/Future]" | Cycling | "Easy for users / Fast for devs / Value for you" | Current design baseline |
| **B** (Agentic Focus) | "Make your App" + typewriter "Agentic" | Typewriter | "Users want it to work / Not to learn to make it work" | Problem-solution messaging |
| **C** (Customer Agent) | "Make your App" + typewriter "An Agent for your Customers" | Typewriter | "They want outcomes / Not instructions" | User-benefit focused |
| **D** (Value Prop) | Cycling ["Agentic", "Automatically testable", "Supernal"] | Cycling | "Easy for users / Fast for devs / Value for business" | Feature highlights |

## Next Phase: Random Assignment & Tracking (Phase 2)

### Overview: Dogfooding Supernal Interface

We'll use **Supernal Interface's own tracking infrastructure** to implement production A/B testing. This "dogfoods" the framework by proving it works for real-world analytics.

### Architecture Components

#### 1. Random Variant Assignment with Cookie Persistence

**Implementation:**
```typescript
// src/lib/variants/VariantAssignment.ts
import Cookies from 'js-cookie';

export class VariantAssignmentService {
  private static COOKIE_NAME = 'si_landing_variant';
  private static COOKIE_EXPIRY = 30; // days

  // Weighted random assignment (can configure weights per variant)
  static getAssignedVariant(): VariantId {
    const existing = Cookies.get(this.COOKIE_NAME);
    if (existing && this.isValidVariant(existing)) {
      return existing as VariantId;
    }

    // New user - assign random variant
    const variant = this.assignNewVariant();
    Cookies.set(this.COOKIE_NAME, variant, { expires: this.COOKIE_EXPIRY });
    return variant;
  }

  private static assignNewVariant(): VariantId {
    const variants: VariantId[] = ['a', 'b', 'c', 'd'];
    const weights = [0.25, 0.25, 0.25, 0.25]; // Equal distribution
    // Can adjust to [0.5, 0.5, 0, 0] for A/B test between A and B only

    const randomValue = Math.random();
    let cumulativeWeight = 0;

    for (let i = 0; i < variants.length; i++) {
      cumulativeWeight += weights[i];
      if (randomValue < cumulativeWeight) {
        return variants[i];
      }
    }

    return 'a'; // fallback
  }
}
```

**Benefits:**
- New users get random variant assignment
- Returning users see consistent variant (30-day cookie)
- Can weight distribution (e.g., 50/50 A/B, 25/25/25/25 for all 4)
- Query parameter override for testing: `?forceVariant=b`

#### 2. Tracking with Supernal Interface @Tool Decorators

**Instrument landing page CTAs with @Tool decorators:**

```typescript
// src/tools/LandingPageTools.ts
import { ToolProvider, Tool } from '@supernal/interface';
import { trackVariantConversion } from '@/lib/analytics/variantTracking';

@ToolProvider()
export class LandingPageTools {
  @Tool({
    id: 'landing-primary-cta',
    description: 'Click primary CTA on landing page',
    origin: {
      path: Routes.Home,
      elements: ['landing-primary-cta']
    }
  })
  clickPrimaryCTA(variantId: VariantId) {
    trackVariantConversion('primary_cta', variantId, {
      timestamp: Date.now(),
      url: window.location.href
    });
    window.location.href = Routes.docs;
  }

  @Tool({
    id: 'landing-secondary-cta',
    description: 'Click secondary CTA on landing page',
    origin: {
      path: Routes.Home,
      elements: ['landing-secondary-cta']
    }
  })
  clickSecondaryCTA(variantId: VariantId) {
    trackVariantConversion('secondary_cta', variantId, {
      timestamp: Date.now(),
      url: window.location.href
    });
    window.location.href = Routes.examples;
  }
}
```

**Why @Tool decorators?**
- Proves Supernal Interface works for production analytics
- Type-safe tracking with IDE autocomplete
- Centralized tool registry for all interactions
- AI agents can analyze user behavior patterns

#### 3. ExposureCollector Integration

**Track when CTAs become visible (not just clicked):**

```typescript
// src/lib/analytics/exposureTracking.ts
import { ExposureCollector } from '@supernal/interface';

export function initializeLandingExposureTracking(variantId: VariantId) {
  const collector = ExposureCollector.getInstance();

  // Track when primary CTA becomes visible
  collector.subscribe('landing-primary-cta', (state) => {
    if (state.exposureState === 'EXPOSED') {
      trackVariantInteraction('primary_cta_visible', variantId, {
        timestamp: Date.now(),
        scrollDepth: state.scrollPosition || 0
      });
    }
  });

  // Track when user can interact with CTA
  collector.subscribe('landing-primary-cta', (state) => {
    if (state.exposureState === 'INTERACTABLE') {
      trackVariantInteraction('primary_cta_interactable', variantId, {
        timestamp: Date.now()
      });
    }
  });
}
```

**Metrics tracked:**
- **Exposure**: User saw the CTA (viewport visibility)
- **Interactability**: CTA became clickable (no overlays)
- **Conversion**: User clicked the CTA
- **Scroll depth**: How far user scrolled before seeing CTA
- **Time to interaction**: Time between exposure and click

#### 4. Google Tag Manager (GTM) Integration

**Setup GTM Custom Dimensions:**

| Dimension | Type | Description |
|-----------|------|-------------|
| `variant_id` | Text | Which variant user saw (a/b/c/d) |
| `cta_id` | Text | Which CTA was clicked (primary/secondary) |
| `scroll_depth` | Number | Scroll percentage when action occurred |
| `engagement_time` | Number | Time on page in milliseconds |

**Track events to GTM dataLayer:**

```typescript
// src/lib/analytics/variantTracking.ts
export const trackVariantExposure = (variantId: VariantId) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'variant_exposure',
    variant_id: variantId,
    timestamp: Date.now(),
    page_location: window.location.href
  });
};

export const trackVariantConversion = (
  ctaId: string,
  variantId: VariantId,
  metadata?: Record<string, unknown>
) => {
  window.dataLayer.push({
    event: 'variant_conversion',
    variant_id: variantId,
    cta_id: ctaId,
    ...metadata
  });
};
```

**GA4 Analysis Queries:**

```sql
-- Conversion rate by variant
SELECT
  variant_id,
  COUNT(DISTINCT user_pseudo_id) as users,
  COUNTIF(event_name = 'variant_conversion') as conversions,
  SAFE_DIVIDE(
    COUNTIF(event_name = 'variant_conversion'),
    COUNT(DISTINCT user_pseudo_id)
  ) * 100 as conversion_rate
FROM `analytics_XXXXX.events_*`
WHERE event_name IN ('variant_exposure', 'variant_conversion')
  AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
                        AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
GROUP BY variant_id
ORDER BY conversion_rate DESC;
```

### Success Metrics to Track

#### Primary Metrics
1. **Primary CTA Conversion Rate** - % clicking "Get Started"
2. **Secondary CTA Conversion Rate** - % clicking "View Examples"
3. **Overall Conversion Rate** - % clicking any CTA

#### Secondary Metrics
4. **Time to First Interaction** - Seconds before first CTA click
5. **Scroll Depth** - Average scroll percentage before conversion
6. **Engagement Time** - Total time on landing page
7. **Bounce Rate** - % leaving without interaction

#### Statistical Significance
- **Minimum Sample Size**: 385 users per variant (95% confidence, 5% margin of error)
- **Test Duration**: 30 days minimum (account for weekly patterns)
- **Significance Level**: p < 0.05 (95% confidence)

### Implementation Checklist

**Setup (Week 1)**
- [ ] Install `js-cookie` dependency
- [ ] Create `VariantAssignmentService` class
- [ ] Set up GTM container and custom dimensions
- [ ] Create GTM triggers for variant events

**Tool Integration (Week 2)**
- [ ] Create `LandingPageTools` class with @Tool decorators
- [ ] Add `data-testid` attributes to CTAs
- [ ] Import tools in provider to auto-register

**Tracking (Week 3)**
- [ ] Implement `trackVariantExposure()`
- [ ] Implement `trackVariantConversion()`
- [ ] Integrate ExposureCollector tracking
- [ ] Add cookie consent banner (GDPR compliance)

**Testing (Week 4)**
- [ ] Write Playwright E2E tests for variant assignment
- [ ] Test GTM dataLayer events
- [ ] Test cookie persistence (30 days)
- [ ] Test query parameter override (`?forceVariant=b`)

**Launch (Week 5)**
- [ ] Deploy to production with equal weights (25/25/25/25)
- [ ] Monitor GTM Real-Time reports
- [ ] Create GA4 exploration report for variant analysis

### Dogfooding Benefits

1. **Self-Validation** - Proves Supernal Interface works for production analytics
2. **Case Study** - Real-world A/B testing example for documentation
3. **Example Code** - Reference implementation for users
4. **Tool Testing** - Validates @Tool decorators in production
5. **ExposureCollector Proof** - Demonstrates visibility tracking at scale
6. **Framework Evolution** - Identifies missing features

### Privacy & GDPR Compliance

- [ ] Add cookie consent banner before setting variant cookie
- [ ] Respect Do Not Track (DNT) browser setting
- [ ] 30-day cookie expiry (not indefinite)
- [ ] No PII tracking (only variant assignment)
- [ ] Update privacy policy with A/B testing disclosure

### Decision Framework

After collecting data for 30 days:

**If Variant B/C/D wins (statistically significant):**
- Make winning variant the default
- Document why it performed better
- Share findings in blog post

**If Variant A (control) wins:**
- Keep current design
- Document what we learned from user behavior
- Consider testing new hypotheses

**If no statistical significance:**
- Extend test duration to 60 days
- Or increase traffic to landing page
- Or test with only 2 variants (50/50 split for faster results)

## Quick Reference

### Test Variants Manually

```bash
# Environment variable (requires server restart)
echo "NEXT_PUBLIC_HERO_VARIANT=b" > .env.local && npm run dev

# Query parameter (instant, no restart)
http://localhost:3000/?variant=b
```

### Production A/B Testing

```bash
# Force specific variant for testing
http://yoursite.com/?forceVariant=b

# Check assigned variant in browser console
document.cookie.split(';').find(c => c.includes('si_landing_variant'))

# View GTM dataLayer events
console.log(window.dataLayer)
```

## Related Files

- Implementation Plan: `/Users/ianderrington/.claude/plans/flickering-kindling-toucan.md`
- Hero Variants Config: [hero-variants.ts](../src/config/hero-variants.ts)
- Hero Component: [TextFirstHero.tsx](../src/components/hero/TextFirstHero.tsx)
- Animation Utilities: [HeroAnimations.tsx](../src/components/hero/animations/HeroAnimations.tsx)
- Environment Variables: [.env.example](../.env.example)

## Questions?

File an issue or ask in the Supernal Interface community!
