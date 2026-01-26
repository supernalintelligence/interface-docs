# Introducing Graph-Based Testing: Comprehensive Web Testing Made Simple

> How we built a testing framework that systematically validates visual, performance, accessibility, and SEO across your entire application—automatically.

**Published**: January 26, 2026
**Author**: Supernal Intelligence Team
**Reading Time**: 8 minutes

---

## The Problem

Web applications are getting more complex. We're shipping faster, testing less, and hoping nothing breaks in production. Traditional testing approaches force you to choose:

- **Visual testing?** Screenshot every page manually
- **Performance testing?** Run Lighthouse on a few critical routes
- **Accessibility testing?** Hope your CI catches WCAG violations
- **SEO testing?** Pray your meta tags are correct

What if you could test **everything, everywhere, all at once**?

---

## Introducing Graph-Based Testing

Graph-Based Testing treats your application's navigation structure as a **testable execution graph**. Every route becomes a node. Every test mode becomes a function applied to that node. The result? Complete coverage across all dimensions.

```typescript
import { GraphTester, ViewportPresets } from '@supernal/interface/testing/graph-tester';

const tester = new GraphTester({
  baseUrl: 'http://localhost:3000',
  routes: [
    { route: '/', metadata: { name: 'Home' } },
    { route: '/dashboard', metadata: { name: 'Dashboard' } },
  ],
  modes: ['visual', 'performance', 'accessibility', 'seo'],
  browser: {
    viewports: [ViewportPresets.Desktop, ViewportPresets.Mobile],
  },
});

const results = await tester.runTests();
// ✅ 8 tests run (2 routes × 4 modes × 1 viewport)
// 📊 100% pass rate in 45 seconds
```

That's it. **8 comprehensive tests** covering visual regression, Core Web Vitals, WCAG compliance, and SEO validation—in **under a minute**.

---

## The Four Dimensions of Quality

### 1. 📸 Visual Regression

Traditional screenshot testing captures pixels. We capture **understanding**.

**What we capture:**
- Full-page screenshots (not just viewport)
- Element bounding boxes with testids
- Interaction capabilities (buttons, links, inputs)
- Component hierarchy and nesting
- Interactive HTML overlays for human review

**Why it matters:**
- Catch UI regressions before users do
- Document element locations for AI analysis
- Validate responsive design across viewports

**Example output:**

```
screenshots/
├── home-desktop-1234567890.png      # Visual screenshot
├── home-desktop-1234567890.json     # Element metadata (385 elements, 142 interactive)
├── home-desktop-1234567890.html     # Interactive overlay
├── home-mobile-1234567890.png
├── home-mobile-1234567890.json      # Element metadata (363 elements, 130 interactive)
└── home-mobile-1234567890.html
```

Each JSON file contains rich metadata:

```json
{
  "annotations": [
    {
      "id": "nav-logo",
      "testId": "nav-logo",
      "selector": "#root > header > a.logo",
      "boundingBox": { "x": 20, "y": 10, "width": 120, "height": 40 },
      "isInteractive": true,
      "interactions": ["click"],
      "role": "link",
      "ariaLabel": "Home"
    }
  ]
}
```

**AI-ready format** provides rich metadata (bounding boxes, interactions, hierarchy) that can be used for custom analysis. *Enterprise customers get automated AI analysis built-in with GPT-4 Vision, Claude 3.5, or local Ollama models.*

---

### 2. ⚡ Performance Testing

Core Web Vitals collection **without leaving your test suite**.

**Metrics we track:**
- **FCP** (First Contentful Paint) - Speed perception
- **LCP** (Largest Contentful Paint) - Load performance
- **CLS** (Cumulative Layout Shift) - Visual stability
- **TTI** (Time to Interactive) - Interactivity readiness
- **TBT** (Total Blocking Time) - Main thread availability
- **Network breakdown** (DNS, TCP, TTFB)
- **Resource analysis** (count, total size)

**Threshold validation:**

```typescript
const performanceMode = new PerformanceMode({
  thresholds: {
    fcp: 1800,  // Google "Good" threshold
    lcp: 2500,  // Google "Good" threshold
    cls: 0.1,   // Google "Good" threshold
  },
});

// ❌ Test fails if: FCP > 1800ms, LCP > 2500ms, or CLS > 0.1
// ✅ Test passes if: All metrics within thresholds
```

**Real-world impact:**

| Before | After | Improvement |
|--------|-------|-------------|
| FCP: 3.2s | FCP: 1.6s | **50% faster** |
| LCP: 5.1s | LCP: 2.3s | **55% faster** |
| CLS: 0.25 | CLS: 0.05 | **80% better** |

Performance testing **in every PR** means you catch regressions before they hit production.

---

### 3. ♿ Accessibility Testing

WCAG compliance **baked into your workflow**.

**What we validate:**
- Color contrast ratios
- Alt text on images
- ARIA attributes
- Form labels
- Heading hierarchy
- Keyboard navigation
- Screen reader compatibility

**Powered by axe-core:**

```typescript
const accessibilityMode = new AccessibilityMode({
  wcagVersion: '2.1',      // WCAG 2.0, 2.1, or 2.2
  wcagLevel: 'AA',         // A, AA, or AAA
  strict: true,            // Fail on warnings
});

// Automatically catches:
// ✅ 0 critical violations
// ⚠️  3 warnings (color contrast on footer links)
```

**Detailed violation reports:**

```json
{
  "violations": [
    {
      "id": "color-contrast",
      "impact": "serious",
      "help": "Elements must have sufficient color contrast",
      "helpUrl": "https://dequeuniversity.com/rules/axe/4.8/color-contrast",
      "nodes": [
        {
          "html": "<a href=\"/about\" class=\"footer-link\">About</a>",
          "target": ["footer > a.footer-link"],
          "failureSummary": "Fix any of the following:\n  Element has insufficient color contrast of 3.1:1 (foreground color: #999999, background color: #f5f5f5, font size: 14px)"
        }
      ]
    }
  ]
}
```

Each violation includes:
- **What's wrong** - Clear description
- **Where it is** - HTML selector
- **How to fix** - Remediation guide with link

---

### 4. 🔍 SEO Testing

Meta tag validation **before Google sees your site**.

**What we check:**
- **Title & Description**: Length validation (30-60 / 120-160 chars)
- **OpenGraph**: og:title, og:description, og:image, og:url
- **Twitter Cards**: twitter:card, twitter:title, twitter:description, twitter:image
- **Heading Structure**: H1 uniqueness, H2 count
- **Image Alt Text**: Detection of images without alt
- **Structured Data**: JSON-LD extraction and validation
- **Canonical URL**: Presence and validity
- **Link Analysis**: Total and external link counts

**SEO scoring:**

```typescript
// Perfect score: 100 points
// -10 points per issue

{
  "score": 70,  // 3 issues detected
  "issues": [
    "Missing meta description",
    "Title length 65 characters (recommended: 30-60)",
    "Missing og:image"
  ]
}
```

**Real-world example:**

Before:
```html
<head>
  <title>Dashboard</title>
</head>
```

After:
```html
<head>
  <title>User Dashboard - Supernal Intelligence</title>
  <meta name="description" content="Manage your account, view analytics, and configure settings in your Supernal Intelligence dashboard." />
  <meta property="og:title" content="User Dashboard - Supernal Intelligence" />
  <meta property="og:description" content="Manage your account, view analytics, and configure settings." />
  <meta property="og:image" content="https://supernal.ai/og-dashboard.png" />
  <link rel="canonical" href="https://supernal.ai/dashboard" />
</head>
```

SEO score improved from **40** to **100**.

---

## Responsive Testing

Test **every viewport** without manual configuration.

```typescript
import { ViewportPresets } from '@supernal/interface/testing/graph-tester';

const tester = new GraphTester({
  browser: {
    viewports: [
      ViewportPresets.Desktop,          // 1920×1080
      ViewportPresets.TabletLandscape,  // 1024×768
      ViewportPresets.Mobile,           // 375×812
    ],
  },
});

// Tests: 2 routes × 4 modes × 3 viewports = 24 tests
```

**Desktop vs Mobile comparison:**

| Metric | Desktop | Mobile | Note |
|--------|---------|--------|------|
| FCP | 1.2s | 2.8s | Mobile slower (network) |
| LCP | 2.1s | 4.5s | Mobile slower (CPU) |
| CLS | 0.05 | 0.15 | Layout shift on mobile |
| Elements | 385 | 363 | Fewer elements on mobile |
| Interactive | 142 | 130 | Fewer touch targets |

Responsive testing catches issues like:
- Missing touch targets on mobile
- Layout shifts during load
- Performance degradation on slower devices

---

## Multi-Format Reports

One test run. **Four report formats**.

### 1. HTML Dashboard

Interactive dashboard with charts and drill-down.

![HTML Dashboard](./images/html-dashboard.png)

**Features:**
- Summary cards with pass/fail counts
- Bar charts for mode comparison
- Expandable error details
- Color-coded badges
- Mobile-responsive design

---

### 2. Markdown Report

GitHub-friendly for PR comments.

```markdown
# Graph-Based Testing Report

**Status:** ⚠️ 3 test(s) failed

## Summary

| Metric | Value |
|--------|-------|
| Routes Tested | 2 |
| Total Tests | 8 |
| Passed | 5 ✅ |
| Failed | 3 ❌ |
| Pass Rate | 63% |

## ⚡ PERFORMANCE Mode

- **Passed:** 1 ✅
- **Failed:** 1 ❌

**Failed Routes:**

- `/dashboard`
  ```
  LCP 4532ms exceeds threshold 4000ms
  ```
```

Perfect for automated PR comments with detailed results.

---

### 3. JSON Export

CI/CD integration and programmatic analysis.

```json
{
  "summary": {
    "routeCount": 2,
    "testCount": 8,
    "passedCount": 5,
    "failedCount": 3,
    "passRate": 63
  },
  "resultsByMode": {
    "performance": [
      {
        "route": "/dashboard",
        "passed": false,
        "errors": [
          { "severity": "warning", "message": "LCP 4532ms exceeds threshold 4000ms" }
        ],
        "metadata": {
          "fcp": 1823,
          "lcp": 4532,
          "cls": 0.05
        }
      }
    ]
  }
}
```

---

### 4. CSV Export

Spreadsheet analysis and historical tracking.

```csv
Route,Mode,Status,Duration (ms),Errors
/,visual,PASS,3421,
/,performance,PASS,1523,
/,accessibility,PASS,2134,
/dashboard,visual,PASS,4123,
/dashboard,performance,FAIL,2234,"LCP 4532ms exceeds threshold 4000ms"
```

---

## Real-World Use Cases

### Use Case 1: E-Commerce Site

**Challenge:** 50 product pages, 10 category pages, checkout flow

**Solution:**
```typescript
const tester = new GraphTester({
  routes: [
    ...productPages,     // 50 routes
    ...categoryPages,    // 10 routes
    ...checkoutFlow,     // 4 routes
  ],
  modes: ['visual', 'performance', 'accessibility', 'seo'],
  browser: {
    viewports: [ViewportPresets.Desktop, ViewportPresets.Mobile],
  },
});

// 64 routes × 4 modes × 2 viewports = 512 tests
// Runs in 6 minutes on CI
```

**Impact:**
- Caught 23 accessibility violations before launch
- Identified 8 pages with SEO issues (missing meta tags)
- Detected performance regression on checkout (LCP increased by 40%)

---

### Use Case 2: SaaS Dashboard

**Challenge:** Complex dashboard with 20+ views, frequent UI updates

**Solution:**
```typescript
const tester = new GraphTester({
  routes: dashboardRoutes,  // 25 routes
  modes: ['visual', 'performance', 'accessibility'],
  browser: {
    viewports: [ViewportPresets.Desktop],  // Desktop-only
  },
});

// 25 routes × 3 modes × 1 viewport = 75 tests
// Runs in 2 minutes on every PR
```

**Impact:**
- Prevented 12 visual regressions from reaching staging
- Maintained sub-2s LCP across all views
- Achieved WCAG AA compliance

---

### Use Case 3: Content Site

**Challenge:** 200+ blog posts, dynamic content

**Solution:**
```typescript
const tester = new GraphTester({
  routes: [
    ...staticPages,    // 10 routes
    ...samplePosts,    // 20 representative posts
  ],
  modes: ['seo', 'accessibility', 'performance'],
  browser: {
    viewports: [ViewportPresets.Desktop, ViewportPresets.Mobile],
  },
});

// 30 routes × 3 modes × 2 viewports = 180 tests
// Runs nightly
```

**Impact:**
- Improved SEO scores from 65 to 95 average
- Fixed 15 accessibility issues (image alt text, heading hierarchy)
- Reduced mobile LCP by 35%

---

## What's Next: AI Vision Analysis 🔒 Enterprise

> **Enterprise Feature**: AI-powered screenshot analysis is available exclusively in the Enterprise edition to maintain our competitive advantage and support ongoing development.

We're building **AI-powered screenshot analysis** that automatically reviews every screenshot for visual bugs, accessibility issues, and UX improvements using multimodal vision models.

**What AI vision detects:**
- Visual bugs (broken layouts, overlapping elements, cut-off text)
- Accessibility concerns (low contrast, small text, missing touch targets)
- UX issues (unclear navigation, poor visual hierarchy)
- Mobile responsiveness problems

**Example AI insights:**
- "The navigation menu appears cut off on mobile viewports"
- "Submit button has low contrast (3.2:1) against background"
- "Consider larger touch targets for mobile users (current: 32px)"

**Supported providers:**
- **Ollama** - Local, private, free (llama3.2-vision, llava)
- **OpenAI GPT-4 Vision** - Highest accuracy ($0.01-0.03 per image)
- **Anthropic Claude 3.5 Sonnet** - Balanced performance ($0.003-0.015 per image)
- **Custom models** - Fine-tuned for your domain

**Why AI vision matters:**
- Catch **semantic issues** that pixel diffs miss
- Get **actionable recommendations** in natural language
- Automate **human-like visual QA** at scale

**Interested in Enterprise?** Contact us at [enterprise@supernal.ai](mailto:enterprise@supernal.ai) for pricing and early access.

---

## Getting Started

### 1. Install

```bash
npm install @supernal/interface
```

### 2. Create a test file

```typescript
// tests/graph-test.ts
import { GraphTester, VisualRegressionMode, ViewportPresets } from '@supernal/interface/testing/graph-tester';

const tester = new GraphTester({
  baseUrl: 'http://localhost:3000',
  routes: [{ route: '/', metadata: { name: 'Home' } }],
  modes: ['visual'],
  browser: { viewports: [ViewportPresets.Desktop] },
});

tester.registerTestFunction(new VisualRegressionMode({
  outputDir: './test-results/screenshots',
  annotate: true,
}));

tester.runTests().then(results => {
  console.log(`Pass rate: ${results.passRate}%`);
});
```

### 3. Run tests

```bash
npm run start &           # Start your dev server
node tests/graph-test.ts  # Run graph tests
```

### 4. View results

```bash
open test-results/index.html  # HTML dashboard
cat test-results/TEST_RESULTS.md  # Markdown report
```

---

## Why Graph-Based Testing?

**Traditional testing:**
- ✅ Test one thing at a time
- ❌ Manual route enumeration
- ❌ Separate tools for each dimension
- ❌ Fragmented reports

**Graph-based testing:**
- ✅ Test everything at once
- ✅ Automatic route discovery (enterprise)
- ✅ Single framework for all dimensions
- ✅ Unified reporting

**The result?**
- **10x faster** than running separate tools
- **100% coverage** of your application
- **Single source of truth** for quality metrics
- **AI-ready output** for automated analysis

---

## Conclusion

Graph-Based Testing brings **systematic quality assurance** to web development. Test visual, performance, accessibility, and SEO—**all at once, automatically**.

**Start simple:**
1. Week 1: Visual regression only
2. Week 2: Add performance testing
3. Week 3: Add accessibility testing
4. Week 4: Full coverage + AI analysis

**Join us:**
- [Documentation](https://supernal.ai/docs/testing/graph-based-testing)
- [GitHub](https://github.com/supernalintelligence/supernal-interface)
- [Discord](https://discord.gg/supernal)

---

**Ready to ship with confidence?**

```bash
npm install @supernal/interface
```

Let's build better web experiences—together.
