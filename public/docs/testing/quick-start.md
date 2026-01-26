# Graph-Based Testing - Quick Start Guide

> Get up and running with graph-based testing in 5 minutes.

## Installation

```bash
npm install @supernal/interface
```

## Minimal Example

```typescript
import {
  GraphTester,
  VisualRegressionMode,
  ViewportPresets,
} from '@supernal/interface/testing/graph-tester';

// Create visual mode
const visualMode = new VisualRegressionMode({
  outputDir: './screenshots',
  annotate: true,
  generateHTML: true,
});

// Create tester
const tester = new GraphTester({
  baseUrl: 'http://localhost:3000',
  routes: [
    { route: '/', metadata: { name: 'Home' } },
  ],
  modes: ['visual'],
  browser: {
    viewports: [ViewportPresets.Desktop],
  },
});

// Register and run
tester.registerTestFunction(visualMode);
const results = await tester.runTests();
console.log(`Pass rate: ${results.passRate}%`);
```

## Common Patterns

### Pattern 1: Visual + Performance

```typescript
import {
  GraphTester,
  VisualRegressionMode,
  PerformanceMode,
  ViewportPresets,
} from '@supernal/interface/testing/graph-tester';

const tester = new GraphTester({
  baseUrl: 'http://localhost:3000',
  routes: [
    { route: '/', metadata: { name: 'Home' } },
    { route: '/dashboard', metadata: { name: 'Dashboard' } },
  ],
  modes: ['visual', 'performance'],
  browser: {
    viewports: [ViewportPresets.Desktop, ViewportPresets.Mobile],
  },
});

tester.registerTestFunction(new VisualRegressionMode({
  outputDir: './screenshots',
  annotate: true,
}));

tester.registerTestFunction(new PerformanceMode({
  outputDir: './performance',
  thresholds: {
    fcp: 3000,
    lcp: 4000,
    cls: 0.1,
  },
}));

const results = await tester.runTests();
// 2 routes × 2 modes × 2 viewports = 8 tests
```

### Pattern 2: All Modes with Unified Report

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
  ],
  modes: ['visual', 'performance', 'accessibility', 'seo'],
  browser: {
    viewports: [ViewportPresets.Desktop],
  },
});

// Register all modes
tester.registerTestFunction(new VisualRegressionMode({
  outputDir: './screenshots',
  annotate: true,
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
}));

// Run tests
const results = await tester.runTests();

// Generate all report formats
const reporter = new UnifiedReporter({
  outputDir: './test-results',
  formats: ['json', 'html', 'markdown', 'csv'],
});
await reporter.generate(results);

console.log(`✅ Testing complete: ${results.passRate}% pass rate`);
console.log(`📊 View report: ./test-results/index.html`);
```

### Pattern 3: CI/CD Integration

```typescript
// test-graph.ts
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

tester.registerTestFunction(new AccessibilityMode({
  outputDir: './accessibility',
  wcagVersion: '2.1',
  wcagLevel: 'AA',
  strict: true,
}));

const results = await tester.runTests();

// Generate JSON for CI
const reporter = new JSONReporter({
  outputDir: './test-results',
  filename: 'results.json',
});
await reporter.generate(results);

// Exit with error if tests failed
if (results.failedCount > 0) {
  console.error(`❌ ${results.failedCount} accessibility violations found`);
  process.exit(1);
}

console.log(`✅ All tests passed`);
```

```yaml
# .github/workflows/test.yml
name: Accessibility Testing

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - run: npm run start &
      - run: npx wait-on http://localhost:3000
      - run: node test-graph.ts
      - uses: actions/upload-artifact@v2
        if: failure()
        with:
          name: test-results
          path: test-results/
```

## Viewport Presets

```typescript
import { ViewportPresets } from '@supernal/interface/testing/graph-tester';

// Available presets:
ViewportPresets.Desktop          // 1920×1080
ViewportPresets.DesktopSmall     // 1366×768
ViewportPresets.Laptop           // 1280×720
ViewportPresets.TabletLandscape  // 1024×768
ViewportPresets.TabletPortrait   // 768×1024
ViewportPresets.MobileLarge      // 414×896
ViewportPresets.Mobile           // 375×812
ViewportPresets.MobileSmall      // 320×568

// Usage:
const tester = new GraphTester({
  browser: {
    viewports: [
      ViewportPresets.Desktop,
      ViewportPresets.Mobile,
    ],
  },
});
```

## Custom Viewport

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
      },
    ],
  },
});
```

## Test Mode Configurations

### Visual Regression

```typescript
new VisualRegressionMode({
  outputDir: './screenshots',
  annotate: true,           // Element annotations
  generateHTML: true,       // Interactive HTML overlay
  fullPage: true,           // Full page screenshot
})
```

### Performance

```typescript
new PerformanceMode({
  outputDir: './performance',
  thresholds: {
    fcp: 3000,   // First Contentful Paint (ms)
    lcp: 4000,   // Largest Contentful Paint (ms)
    cls: 0.1,    // Cumulative Layout Shift
    tti: 5000,   // Time to Interactive (ms)
    tbt: 300,    // Total Blocking Time (ms)
  },
})
```

### Accessibility

```typescript
new AccessibilityMode({
  outputDir: './accessibility',
  wcagVersion: '2.1',       // '2.0' | '2.1' | '2.2'
  wcagLevel: 'AA',          // 'A' | 'AA' | 'AAA'
  strict: false,            // Fail on warnings
})
```

### SEO

```typescript
new SEOMode({
  outputDir: './seo',
  requiredMetaTags: ['description', 'keywords'],
  validateOpenGraph: true,
  validateTwitterCards: true,
})
```

## Reporter Configurations

### HTML Reporter

```typescript
new HTMLReporter({
  outputDir: './test-results',
  filename: 'index.html',
  includeCharts: true,
})
```

### Markdown Reporter

```typescript
new MarkdownReporter({
  outputDir: './test-results',
  filename: 'TEST_RESULTS.md',
  includeErrorStacks: true,
})
```

### JSON Reporter

```typescript
new JSONReporter({
  outputDir: './test-results',
  filename: 'results.json',
  pretty: true,
})
```

### Unified Reporter

```typescript
new UnifiedReporter({
  outputDir: './test-results',
  formats: ['json', 'html', 'markdown', 'csv'],
  includeDetailedLogs: true,
})
```

## Troubleshooting

### Issue: Tests timeout

**Solution:**
```typescript
const tester = new GraphTester({
  execution: {
    timeout: 60000,  // 60 seconds
  },
});
```

### Issue: Screenshots missing elements

**Solution:**
```typescript
new VisualRegressionMode({
  fullPage: true,  // Capture entire page
})
```

### Issue: axe-core fails to load

**Solution:** Check network connection (axe-core loads from CDN)

## Next Steps

- [Complete Documentation](./graph-based-testing.md) - Full guide with examples
- [Blog Post](../../blog/introducing-graph-based-testing.md) - Real-world use cases
- [Phase 3 Planning](../planning/phase-3-ai-vision-analysis.md) - AI vision roadmap

## Support

- **GitHub**: [supernal-interface](https://github.com/supernalintelligence/supernal-interface)
- **Discord**: [Supernal Community](https://discord.gg/supernal)
- **Docs**: [supernal.ai/docs](https://supernal.ai/docs)
