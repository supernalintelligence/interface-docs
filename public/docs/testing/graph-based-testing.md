# Graph-Based Testing Framework

> Comprehensive testing framework that systematically tests all routes in your application across multiple dimensions: visual regression, performance, accessibility, and SEO.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Test Modes](#test-modes)
- [Reporters](#reporters)
- [Configuration](#configuration)
- [Examples](#examples)
- [Best Practices](#best-practices)

---

## Overview

The Graph-Based Testing Framework treats your NavigationGraph as a testable execution graph, systematically applying different test functions (visual, performance, accessibility, SEO) to all routes in your application.

### Key Features

- **📸 Visual Regression**: Screenshot capture with element annotations (bounding boxes, testids, interaction capabilities)
- **⚡ Performance Testing**: Core Web Vitals collection (FCP, LCP, CLS, TTI, TBT)
- **♿ Accessibility Testing**: WCAG 2.0/2.1/2.2 compliance with axe-core
- **🔍 SEO Testing**: Meta tag validation, OpenGraph, Twitter Cards, structured data
- **📱 Responsive Testing**: Multi-viewport support (Desktop, Tablet, Mobile)
- **📊 Multi-Format Reports**: HTML dashboard, Markdown, JSON, CSV
- **🤖 AI-Ready Output**: JSON + PNG format optimized for multimodal AI analysis

---

## Quick Start

### Installation

```bash
npm install @supernal/interface
```

### Basic Usage

```typescript
import {
  GraphTester,
  VisualRegressionMode,
  PerformanceMode,
  AccessibilityMode,
  SEOMode,
  UnifiedReporter,
  ViewportPresets,
} from '@supernal/interface/testing/graph-tester';

// Create test modes
const visualMode = new VisualRegressionMode({
  outputDir: './test-results/screenshots',
  annotate: true,
  generateHTML: true,
});

const performanceMode = new PerformanceMode({
  outputDir: './test-results/performance',
  thresholds: {
    fcp: 3000,  // First Contentful Paint
    lcp: 4000,  // Largest Contentful Paint
    cls: 0.1,   // Cumulative Layout Shift
  },
});

const accessibilityMode = new AccessibilityMode({
  outputDir: './test-results/accessibility',
  wcagVersion: '2.1',
  wcagLevel: 'AA',
});

const seoMode = new SEOMode({
  outputDir: './test-results/seo',
  validateOpenGraph: true,
  validateTwitterCards: true,
});

// Create tester
const tester = new GraphTester({
  baseUrl: 'http://localhost:3000',
  routes: [
    { route: '/', metadata: { name: 'Home' } },
    { route: '/dashboard', metadata: { name: 'Dashboard' } },
    { route: '/about', metadata: { name: 'About' } },
  ],
  modes: ['visual', 'performance', 'accessibility', 'seo'],
  browser: {
    headless: true,
    viewports: [
      ViewportPresets.Desktop,
      ViewportPresets.Mobile,
    ],
  },
});

// Register test modes
tester.registerTestFunction(visualMode);
tester.registerTestFunction(performanceMode);
tester.registerTestFunction(accessibilityMode);
tester.registerTestFunction(seoMode);

// Run tests
const results = await tester.runTests();
console.log(`Pass rate: ${results.passRate}%`);

// Generate reports
const reporter = new UnifiedReporter({
  outputDir: './test-results',
  formats: ['json', 'html', 'markdown', 'csv'],
});
await reporter.generate(results);
```

---

## Test Modes

### 1. Visual Regression Mode

Captures annotated screenshots with element metadata for visual testing.

**Features:**
- Full-page screenshots
- Element bounding boxes with testids
- Interaction capability detection (buttons, links, inputs)
- Interactive HTML overlays with click-to-highlight
- JSON metadata for AI analysis

**Configuration:**

```typescript
const visualMode = new VisualRegressionMode({
  outputDir: './screenshots',
  annotate: true,           // Enable element annotations
  generateHTML: true,       // Generate interactive HTML overlay
  fullPage: true,          // Capture full page (not just viewport)
});
```

**Output:**
- `route-viewport-timestamp.png` - Screenshot
- `route-viewport-timestamp.json` - Annotation metadata
- `route-viewport-timestamp.html` - Interactive overlay

---

### 2. Performance Mode

Collects Core Web Vitals and performance metrics.

**Metrics Collected:**
- **FCP** (First Contentful Paint) - Time to first content render
- **LCP** (Largest Contentful Paint) - Time to largest content render
- **CLS** (Cumulative Layout Shift) - Visual stability score
- **TTI** (Time to Interactive) - Time until page is interactive
- **TBT** (Total Blocking Time) - Main thread blocking time
- **DNS, TCP, TTFB** - Network timing breakdown
- **Resource Count & Size** - Total resources loaded

**Configuration:**

```typescript
const performanceMode = new PerformanceMode({
  outputDir: './performance',
  thresholds: {
    fcp: 3000,   // Fail if FCP > 3000ms
    lcp: 4000,   // Fail if LCP > 4000ms
    cls: 0.1,    // Fail if CLS > 0.1
    tti: 5000,   // Fail if TTI > 5000ms
    tbt: 300,    // Fail if TBT > 300ms
  },
});
```

**Threshold Guidelines:**

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| FCP    | < 1.8s | 1.8s - 3.0s | > 3.0s |
| LCP    | < 2.5s | 2.5s - 4.0s | > 4.0s |
| CLS    | < 0.1 | 0.1 - 0.25 | > 0.25 |
| TTI    | < 3.8s | 3.8s - 7.3s | > 7.3s |
| TBT    | < 200ms | 200ms - 600ms | > 600ms |

---

### 3. Accessibility Mode

Tests WCAG compliance using axe-core.

**Features:**
- WCAG 2.0, 2.1, 2.2 support
- Configurable compliance levels (A, AA, AAA)
- Detailed violation reports with remediation URLs
- Impact classification (critical, warning, info)
- Strict mode for warnings as errors

**Configuration:**

```typescript
const accessibilityMode = new AccessibilityMode({
  outputDir: './accessibility',
  wcagVersion: '2.1',      // '2.0' | '2.1' | '2.2'
  wcagLevel: 'AA',         // 'A' | 'AA' | 'AAA'
  strict: false,           // Treat warnings as errors
});
```

**Common Violations:**

- **Color Contrast**: Text color contrast ratio too low
- **Alt Text**: Images missing alternative text
- **ARIA**: Invalid or missing ARIA attributes
- **Form Labels**: Form inputs missing labels
- **Heading Hierarchy**: Skipped heading levels

---

### 4. SEO Mode

Validates meta tags, structured data, and SEO best practices.

**Checks:**
- **Title & Description**: Length validation (30-60 chars / 120-160 chars)
- **OpenGraph**: og:title, og:description, og:image, og:url
- **Twitter Cards**: twitter:card, twitter:title, twitter:description, twitter:image
- **Heading Structure**: H1 uniqueness, H2 count
- **Image Alt Text**: Detection of images without alt attributes
- **Structured Data**: JSON-LD extraction
- **Canonical URL**: Presence and validity
- **Link Analysis**: Total and external link counts

**Configuration:**

```typescript
const seoMode = new SEOMode({
  outputDir: './seo',
  requiredMetaTags: ['description', 'keywords', 'author'],
  validateOpenGraph: true,
  validateTwitterCards: true,
});
```

**SEO Scoring:**
- **100 points**: Perfect SEO
- **-10 points per issue**: Deducted for each validation failure
- **Minimum 0 points**

---

## Reporters

### 1. HTML Reporter

Interactive dashboard with charts and drill-down.

**Features:**
- Beautiful gradient header
- Summary cards with hover effects
- Bar charts for mode comparison
- Expandable error details
- Color-coded badges

```typescript
const htmlReporter = new HTMLReporter({
  outputDir: './test-results',
  filename: 'index.html',
  includeCharts: true,
});
```

**Output:** `./test-results/index.html`

---

### 2. Markdown Reporter

GitHub-friendly markdown report for PR comments.

**Features:**
- Summary tables with emoji indicators
- Collapsible error sections
- Mode-specific performance metrics
- Success rate calculations

```typescript
const markdownReporter = new MarkdownReporter({
  outputDir: './test-results',
  filename: 'TEST_RESULTS.md',
  includeErrorStacks: true,
});
```

**Output:** `./test-results/TEST_RESULTS.md`

---

### 3. JSON Reporter

CI/CD-ready JSON data for automated processing.

```typescript
const jsonReporter = new JSONReporter({
  outputDir: './test-results',
  filename: 'results.json',
  pretty: true,
});
```

**Output:** `./test-results/results.json`

---

### 4. Unified Reporter

Generates all report formats in parallel.

```typescript
const unifiedReporter = new UnifiedReporter({
  outputDir: './test-results',
  formats: ['json', 'html', 'markdown', 'csv'],
  includeDetailedLogs: true,
});
```

**Outputs:**
- `results.json` - JSON data
- `index.html` - Interactive dashboard
- `TEST_RESULTS.md` - Markdown report
- `results.csv` - Spreadsheet export

---

## Configuration

### Viewport Presets

Pre-configured viewports for responsive testing:

```typescript
import { ViewportPresets } from '@supernal/interface/testing/graph-tester';

const tester = new GraphTester({
  browser: {
    viewports: [
      ViewportPresets.Desktop,          // 1920x1080
      ViewportPresets.DesktopSmall,     // 1366x768
      ViewportPresets.Laptop,           // 1280x720
      ViewportPresets.TabletLandscape,  // 1024x768
      ViewportPresets.TabletPortrait,   // 768x1024
      ViewportPresets.MobileLarge,      // 414x896
      ViewportPresets.Mobile,           // 375x812
      ViewportPresets.MobileSmall,      // 320x568
    ],
  },
});
```

### Custom Viewports

Define custom viewport configurations:

```typescript
const tester = new GraphTester({
  browser: {
    viewports: [
      {
        name: 'custom-desktop',
        width: 2560,
        height: 1440,
      },
      {
        name: 'custom-mobile',
        width: 390,
        height: 844,
        isMobile: true,
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
      },
    ],
  },
});
```

---

## Examples

### Example 1: Visual Regression Only

```typescript
import {
  GraphTester,
  VisualRegressionMode,
  ViewportPresets,
} from '@supernal/interface/testing/graph-tester';

const tester = new GraphTester({
  baseUrl: 'http://localhost:3000',
  routes: [
    { route: '/', metadata: { name: 'Home' } },
    { route: '/about', metadata: { name: 'About' } },
  ],
  modes: ['visual'],
  browser: {
    viewports: [ViewportPresets.Desktop, ViewportPresets.Mobile],
  },
});

const visualMode = new VisualRegressionMode({
  outputDir: './screenshots',
  annotate: true,
  generateHTML: true,
});

tester.registerTestFunction(visualMode);
const results = await tester.runTests();
```

---

### Example 2: Performance Testing with Thresholds

```typescript
import {
  GraphTester,
  PerformanceMode,
  HTMLReporter,
} from '@supernal/interface/testing/graph-tester';

const tester = new GraphTester({
  baseUrl: 'http://localhost:3000',
  routes: [
    { route: '/', metadata: { name: 'Home' } },
    { route: '/dashboard', metadata: { name: 'Dashboard' } },
  ],
  modes: ['performance'],
});

const performanceMode = new PerformanceMode({
  outputDir: './performance',
  thresholds: {
    fcp: 1800,  // Strict: 1.8s
    lcp: 2500,  // Strict: 2.5s
    cls: 0.1,   // Good: 0.1
  },
});

tester.registerTestFunction(performanceMode);
const results = await tester.runTests();

// Generate HTML report
const reporter = new HTMLReporter({
  outputDir: './test-results',
  filename: 'performance-report.html',
});
await reporter.generate(results);
```

---

### Example 3: Accessibility Testing in CI/CD

```typescript
import {
  GraphTester,
  AccessibilityMode,
  JSONReporter,
} from '@supernal/interface/testing/graph-tester';

const tester = new GraphTester({
  baseUrl: process.env.STAGING_URL || 'http://localhost:3000',
  routes: [
    { route: '/', metadata: { name: 'Home' } },
    { route: '/dashboard', metadata: { name: 'Dashboard' } },
  ],
  modes: ['accessibility'],
});

const accessibilityMode = new AccessibilityMode({
  outputDir: './accessibility',
  wcagVersion: '2.1',
  wcagLevel: 'AA',
  strict: true,  // Fail on warnings
});

tester.registerTestFunction(accessibilityMode);
const results = await tester.runTests();

// Generate JSON for CI/CD
const reporter = new JSONReporter({
  outputDir: './test-results',
  filename: 'a11y-results.json',
});
await reporter.generate(results);

// Exit with error if tests failed
if (results.failedCount > 0) {
  console.error(`❌ ${results.failedCount} accessibility violations found`);
  process.exit(1);
}
```

---

### Example 4: Complete Multi-Mode Testing

```typescript
import {
  GraphTester,
  VisualRegressionMode,
  PerformanceMode,
  AccessibilityMode,
  SEOMode,
  UnifiedReporter,
  ViewportPresets,
} from '@supernal/interface/testing/graph-tester';

const tester = new GraphTester({
  baseUrl: 'http://localhost:3000',
  routes: [
    { route: '/', metadata: { name: 'Home' } },
    { route: '/dashboard', metadata: { name: 'Dashboard' } },
    { route: '/about', metadata: { name: 'About' } },
  ],
  modes: ['visual', 'performance', 'accessibility', 'seo'],
  browser: {
    headless: true,
    viewports: [ViewportPresets.Desktop, ViewportPresets.Mobile],
  },
});

// Register all modes
tester.registerTestFunction(new VisualRegressionMode({
  outputDir: './screenshots',
  annotate: true,
  generateHTML: true,
}));

tester.registerTestFunction(new PerformanceMode({
  outputDir: './performance',
  thresholds: { fcp: 3000, lcp: 4000, cls: 0.1 },
}));

tester.registerTestFunction(new AccessibilityMode({
  outputDir: './accessibility',
  wcagVersion: '2.1',
  wcagLevel: 'AA',
}));

tester.registerTestFunction(new SEOMode({
  outputDir: './seo',
  validateOpenGraph: true,
  validateTwitterCards: true,
}));

// Run all tests
const results = await tester.runTests();

// Generate all report formats
const reporter = new UnifiedReporter({
  outputDir: './test-results',
  formats: ['json', 'html', 'markdown', 'csv'],
});
await reporter.generate(results);

console.log(`✅ Testing complete: ${results.passRate}% pass rate`);
```

---

## Best Practices

### 1. Start Small, Scale Up

Begin with visual regression only, then add other modes:

```typescript
// Week 1: Visual only
modes: ['visual']

// Week 2: Add performance
modes: ['visual', 'performance']

// Week 3: Add accessibility
modes: ['visual', 'performance', 'accessibility']

// Week 4: Add SEO
modes: ['visual', 'performance', 'accessibility', 'seo']
```

---

### 2. Use Appropriate Thresholds

Set realistic performance thresholds based on your application:

```typescript
// E-commerce site (strict)
thresholds: { fcp: 1800, lcp: 2500, cls: 0.1 }

// Dashboard application (moderate)
thresholds: { fcp: 3000, lcp: 4000, cls: 0.15 }

// Content site (lenient)
thresholds: { fcp: 4000, lcp: 5000, cls: 0.25 }
```

---

### 3. Test Critical Routes First

Prioritize your most important routes:

```typescript
routes: [
  { route: '/', metadata: { name: 'Home', critical: true } },
  { route: '/checkout', metadata: { name: 'Checkout', critical: true } },
  { route: '/product/:id', metadata: { name: 'Product', critical: true } },
  // ... less critical routes
]
```

---

### 4. Integrate with CI/CD

Run tests on every PR:

```yaml
# .github/workflows/test.yml
name: Graph-Based Testing

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - run: npm run start &  # Start server
      - run: npx wait-on http://localhost:3000
      - run: npm run test:graph  # Run graph tests
      - uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: test-results/
```

---

### 5. Review Reports Regularly

Schedule weekly reviews of test results:

1. Check **HTML dashboard** for visual overview
2. Review **accessibility violations** and fix high-impact issues
3. Monitor **performance trends** over time
4. Validate **SEO improvements** after content updates

---

## Next Steps

- [Enterprise Features](./enterprise-features.md) - NavigationGraph auto-discovery
- [Custom Test Functions](./custom-test-functions.md) - Build your own test modes
- [AI Screenshot Analysis](./ai-analysis.md) - GPT-4 Vision integration (coming soon)

---

## Troubleshooting

### Issue: Tests timeout

**Solution:** Increase timeout in configuration:

```typescript
const tester = new GraphTester({
  execution: {
    timeout: 60000,  // 60 seconds
  },
});
```

---

### Issue: axe-core fails to inject

**Solution:** Check network connection or use local CDN:

```typescript
// The framework automatically uses CDN, but ensure your
// test environment has internet access
```

---

### Issue: Screenshots missing elements

**Solution:** Enable full-page screenshots:

```typescript
const visualMode = new VisualRegressionMode({
  fullPage: true,  // Capture entire page, not just viewport
});
```

---

## Support

- **GitHub Issues**: [supernalintelligence/supernal-interface](https://github.com/supernalintelligence/supernal-interface/issues)
- **Documentation**: [https://supernal.ai/docs](https://supernal.ai/docs)
- **Discord**: [https://discord.gg/supernal](https://discord.gg/supernal)
