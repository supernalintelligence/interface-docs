# Phase 3: AI Vision Analysis Integration

> Comprehensive plan for integrating multimodal AI vision models (Ollama, OpenAI GPT-4 Vision, Anthropic Claude 3.5) for automated screenshot analysis and visual QA.

**Status**: Planning
**Priority**: High
**Timeline**: Q1 2026

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Provider Integration](#provider-integration)
- [Implementation Plan](#implementation-plan)
- [API Design](#api-design)
- [Examples](#examples)
- [Performance Considerations](#performance-considerations)
- [Cost Analysis](#cost-analysis)

---

## Overview

### Goals

1. **Automated Visual QA**: Use AI to analyze screenshots and identify visual bugs, layout issues, and UX problems
2. **Multi-Provider Support**: Support Ollama (local), OpenAI GPT-4 Vision, Anthropic Claude 3.5, and custom models
3. **Natural Language Reports**: Generate human-readable insights instead of just pixel diffs
4. **Semantic Understanding**: Catch issues AI can see but pixel diffs can't (e.g., "button text is misleading")
5. **Privacy-First**: Default to local Ollama for sensitive applications

---

### Why AI Vision?

**Traditional visual regression:**
- Pixel-perfect comparison
- High false positive rate (font rendering, anti-aliasing)
- No semantic understanding
- Can't suggest improvements

**AI vision analysis:**
- Semantic understanding of UI elements
- Contextual bug detection ("button appears disabled but is clickable")
- Accessibility insights ("text too small on mobile")
- UX recommendations ("CTA not prominent enough")
- Natural language reports ("The header navigation is cut off on mobile")

---

## Architecture

### Component Hierarchy

```
AIScreenshotAnalyzer (TestFunction)
  ├── VisionProviderRegistry
  │   ├── OllamaProvider (default, local)
  │   ├── OpenAIProvider (GPT-4 Vision)
  │   ├── AnthropicProvider (Claude 3.5 Sonnet)
  │   └── CustomProvider (user-defined)
  │
  ├── PromptLibrary
  │   ├── BugDetection
  │   ├── AccessibilityReview
  │   ├── UXReview
  │   ├── ResponsiveDesignReview
  │   └── CustomPrompts
  │
  └── ResultAggregator
      ├── Finding (severity, category, message, suggestion)
      └── Score (0-100 based on findings)
```

---

## Provider Integration

### 1. Ollama (Local, Privacy-First)

**Models:**
- `llama3.2-vision:11b` - Best quality, slower (11B params)
- `llama3.2-vision:90b` - Highest quality, very slow (90B params)
- `llava:13b` - Fast, good quality (13B params)
- `llava:34b` - Better quality, slower (34B params)
- `bakllava:7b` - Fastest, lower quality (7B params)

**Configuration:**

```typescript
const aiAnalyzer = new AIScreenshotAnalyzer({
  provider: 'ollama',
  config: {
    baseUrl: 'http://localhost:11434',  // Ollama API endpoint
    model: 'llama3.2-vision:11b',        // Model to use
    temperature: 0.3,                     // Lower = more deterministic
    maxTokens: 1024,                      // Response length limit
  },
  prompts: [
    'Identify any visual bugs or layout issues',
    'Check for accessibility concerns',
  ],
});
```

**Advantages:**
- ✅ **Free** - No API costs
- ✅ **Private** - Data stays local
- ✅ **Fast** - No network latency
- ✅ **Offline** - Works without internet

**Disadvantages:**
- ❌ **GPU required** - Needs CUDA/Metal for good performance
- ❌ **Lower accuracy** - Not as good as GPT-4V or Claude 3.5
- ❌ **Model download** - 7GB-90GB models

---

### 2. OpenAI GPT-4 Vision

**Models:**
- `gpt-4-vision-preview` - Latest vision model
- `gpt-4-turbo-2024-04-09` - Turbo with vision

**Configuration:**

```typescript
const aiAnalyzer = new AIScreenshotAnalyzer({
  provider: 'openai',
  config: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4-vision-preview',
    maxTokens: 1024,
    detailLevel: 'high',  // 'low' | 'high' | 'auto'
  },
  prompts: [
    'Analyze this screenshot for visual bugs, layout issues, and UX problems',
  ],
});
```

**Advantages:**
- ✅ **Highest accuracy** - Best-in-class vision understanding
- ✅ **No infrastructure** - Cloud-based
- ✅ **Fast** - Low latency

**Disadvantages:**
- ❌ **Expensive** - $0.01-0.03 per image (high detail)
- ❌ **Privacy concerns** - Data sent to OpenAI
- ❌ **Rate limits** - 100 RPM on Tier 1

---

### 3. Anthropic Claude 3.5 Sonnet

**Models:**
- `claude-3-5-sonnet-20241022` - Latest Sonnet with vision
- `claude-3-opus-20240229` - Highest quality (expensive)
- `claude-3-haiku-20240307` - Fastest, cheapest

**Configuration:**

```typescript
const aiAnalyzer = new AIScreenshotAnalyzer({
  provider: 'anthropic',
  config: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1024,
  },
  prompts: [
    'Review this screenshot and identify any visual bugs, accessibility issues, or UX improvements',
  ],
});
```

**Advantages:**
- ✅ **High accuracy** - Competitive with GPT-4V
- ✅ **Balanced cost** - Cheaper than GPT-4V ($3/$15 per MTok)
- ✅ **Fast** - Low latency

**Disadvantages:**
- ❌ **Privacy concerns** - Data sent to Anthropic
- ❌ **Rate limits** - Varies by tier

---

### 4. Custom Provider (User-Defined)

**Use cases:**
- Fine-tuned models for specific domains
- Self-hosted vision models
- Enterprise vision APIs

**Configuration:**

```typescript
const aiAnalyzer = new AIScreenshotAnalyzer({
  provider: 'custom',
  config: {
    endpoint: 'https://my-vision-api.com/analyze',
    headers: {
      'Authorization': `Bearer ${process.env.CUSTOM_API_KEY}`,
    },
  },
  prompts: [
    'Analyze screenshot for domain-specific issues',
  ],
});
```

---

## Implementation Plan

### Phase 3.1: Core Infrastructure (Week 1-2)

**Tasks:**
1. Create `AIScreenshotAnalyzer` TestFunction
2. Implement `VisionProviderRegistry`
3. Build base provider interface
4. Add result aggregation

**Files to create:**
- `src/testing/graph-tester/ai/AIScreenshotAnalyzer.ts`
- `src/testing/graph-tester/ai/providers/BaseProvider.ts`
- `src/testing/graph-tester/ai/providers/VisionProviderRegistry.ts`
- `src/testing/graph-tester/ai/types.ts`

---

### Phase 3.2: Ollama Integration (Week 3)

**Tasks:**
1. Implement OllamaProvider
2. Add model auto-detection
3. Build prompt templates
4. Test with llama3.2-vision, llava

**Files to create:**
- `src/testing/graph-tester/ai/providers/OllamaProvider.ts`
- `src/testing/graph-tester/ai/prompts/PromptLibrary.ts`

---

### Phase 3.3: OpenAI Integration (Week 4)

**Tasks:**
1. Implement OpenAIProvider
2. Add image encoding (base64)
3. Handle rate limiting
4. Implement cost tracking

**Files to create:**
- `src/testing/graph-tester/ai/providers/OpenAIProvider.ts`
- `src/testing/graph-tester/ai/utils/ImageEncoder.ts`

---

### Phase 3.4: Anthropic Integration (Week 5)

**Tasks:**
1. Implement AnthropicProvider
2. Add model selection
3. Handle rate limiting
4. Implement cost tracking

**Files to create:**
- `src/testing/graph-tester/ai/providers/AnthropicProvider.ts`

---

### Phase 3.5: Prompt Library & Scoring (Week 6)

**Tasks:**
1. Build comprehensive prompt library
2. Implement finding categorization
3. Add severity scoring
4. Create aggregated reports

**Categories:**
- Visual Bugs
- Layout Issues
- Accessibility Concerns
- UX Problems
- Performance Hints
- SEO Recommendations

---

### Phase 3.6: Testing & Documentation (Week 7)

**Tasks:**
1. End-to-end testing with all providers
2. Performance benchmarking
3. Cost analysis documentation
4. User guides and examples

---

## API Design

### AIScreenshotAnalyzer

```typescript
import { TestFunction } from '../core/TestFunction';
import type { Page } from '@playwright/test';
import type { TestContext, TestResult } from '../core/types';

export interface AIScreenshotAnalyzerConfig {
  /** Vision provider: ollama (local), openai, anthropic, custom */
  provider: 'ollama' | 'openai' | 'anthropic' | 'custom';

  /** Provider-specific configuration */
  config: OllamaConfig | OpenAIConfig | AnthropicConfig | CustomConfig;

  /** Analysis prompts */
  prompts: string[] | PromptTemplate[];

  /** Output directory */
  outputDir: string;

  /** Include screenshots in output */
  includeScreenshots?: boolean;

  /** Minimum severity to report (info, warning, critical) */
  minSeverity?: 'info' | 'warning' | 'critical';

  /** Categories to analyze */
  categories?: AnalysisCategory[];
}

export type AnalysisCategory =
  | 'visual-bugs'
  | 'layout-issues'
  | 'accessibility'
  | 'ux-problems'
  | 'performance'
  | 'seo';

export interface AIFinding {
  /** Category of finding */
  category: AnalysisCategory;

  /** Severity level */
  severity: 'info' | 'warning' | 'critical';

  /** Short title */
  title: string;

  /** Detailed description */
  description: string;

  /** Actionable suggestion */
  suggestion?: string;

  /** Element selector (if applicable) */
  selector?: string;

  /** Location in screenshot */
  location?: { x: number; y: number; width: number; height: number };
}

export interface AIAnalysisResult {
  /** Route analyzed */
  route: string;

  /** Viewport name */
  viewport: string;

  /** Provider used */
  provider: string;

  /** Model used */
  model: string;

  /** Analysis duration (ms) */
  duration: number;

  /** Findings */
  findings: AIFinding[];

  /** Overall score (0-100) */
  score: number;

  /** Raw AI response */
  rawResponse?: string;

  /** Screenshot path */
  screenshotPath?: string;

  /** Cost (if cloud provider) */
  cost?: {
    inputTokens: number;
    outputTokens: number;
    totalCost: number;  // USD
  };
}

export class AIScreenshotAnalyzer extends TestFunction {
  readonly mode = 'ai-vision';
  readonly name = 'AI Vision Analysis';
  readonly description = 'AI-powered screenshot analysis for visual QA';

  private config: AIScreenshotAnalyzerConfig;
  private provider: VisionProvider;

  constructor(config: AIScreenshotAnalyzerConfig) {
    super();
    this.config = config;
    this.provider = VisionProviderRegistry.get(config.provider, config.config);
  }

  async execute(page: Page, context: TestContext): Promise<TestResult> {
    const startTime = Date.now();

    // 1. Capture screenshot
    const screenshot = await page.screenshot({ fullPage: true });

    // 2. Get annotation data (from VisualRegressionMode if available)
    const annotations = context.metadata?.visualAnnotations || [];

    // 3. Analyze with AI
    const analysis = await this.provider.analyze({
      screenshot,
      annotations,
      prompts: this.config.prompts,
      route: context.route,
      viewport: context.viewport?.name,
    });

    // 4. Save results
    const outputPath = `${this.config.outputDir}/${this.sanitizeRoute(context.route)}-ai-analysis.json`;
    await this.saveResults(outputPath, analysis);

    const duration = Date.now() - startTime;

    // 5. Determine pass/fail
    const criticalFindings = analysis.findings.filter(f => f.severity === 'critical');
    const passed = criticalFindings.length === 0;

    return {
      passed,
      duration,
      errors: criticalFindings.map(f => ({
        severity: 'critical',
        message: `${f.title}: ${f.description}`,
        location: f.selector,
      })),
      metadata: {
        aiAnalysis: analysis,
        score: analysis.score,
        findingCount: analysis.findings.length,
        cost: analysis.cost,
      },
    };
  }
}
```

---

## Examples

### Example 1: Local Ollama Analysis

```typescript
import {
  GraphTester,
  AIScreenshotAnalyzer,
  VisualRegressionMode,
  ViewportPresets,
} from '@supernal/interface/testing/graph-tester';

// Enable visual regression to get annotations
const visualMode = new VisualRegressionMode({
  outputDir: './screenshots',
  annotate: true,
});

// Add AI analysis with local Ollama
const aiAnalyzer = new AIScreenshotAnalyzer({
  provider: 'ollama',
  config: {
    model: 'llama3.2-vision:11b',
    temperature: 0.3,
  },
  prompts: [
    'Identify any visual bugs, layout issues, or UX problems in this screenshot',
    'Check for accessibility concerns like low contrast, small text, or missing labels',
    'Suggest improvements for mobile users',
  ],
  outputDir: './ai-analysis',
  categories: ['visual-bugs', 'layout-issues', 'accessibility', 'ux-problems'],
});

const tester = new GraphTester({
  baseUrl: 'http://localhost:3000',
  routes: [
    { route: '/', metadata: { name: 'Home' } },
    { route: '/dashboard', metadata: { name: 'Dashboard' } },
  ],
  modes: ['visual', 'ai-vision'],
  browser: {
    viewports: [ViewportPresets.Desktop, ViewportPresets.Mobile],
  },
});

tester.registerTestFunction(visualMode);
tester.registerTestFunction(aiAnalyzer);

const results = await tester.runTests();

// AI findings example:
// {
//   "findings": [
//     {
//       "category": "layout-issues",
//       "severity": "warning",
//       "title": "Navigation menu cutoff on mobile",
//       "description": "The navigation menu appears partially cut off on mobile viewports, with the last menu item not visible",
//       "suggestion": "Consider using a hamburger menu for mobile or reducing menu item count",
//       "selector": "nav.main-nav"
//     },
//     {
//       "category": "accessibility",
//       "severity": "critical",
//       "title": "Submit button has low contrast",
//       "description": "The submit button has a contrast ratio of 3.2:1, below the WCAG AA requirement of 4.5:1",
//       "suggestion": "Increase button text color to #000000 or darken background",
//       "selector": "button.submit-btn"
//     }
//   ],
//   "score": 75
// }
```

---

### Example 2: OpenAI GPT-4 Vision

```typescript
const aiAnalyzer = new AIScreenshotAnalyzer({
  provider: 'openai',
  config: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4-vision-preview',
    maxTokens: 1024,
    detailLevel: 'high',  // More detailed analysis
  },
  prompts: [
    `You are a UX expert reviewing a web application screenshot.

     Analyze the screenshot and provide:
     1. Visual bugs (broken layouts, overlapping elements, cut-off text)
     2. Accessibility issues (contrast, text size, touch targets)
     3. UX improvements (CTA prominence, navigation clarity, visual hierarchy)

     For each issue, provide:
     - Category (visual-bugs, accessibility, ux-problems)
     - Severity (critical, warning, info)
     - Title (short, actionable)
     - Description (what's wrong)
     - Suggestion (how to fix)
     - Selector (CSS selector if identifiable)

     Return response as JSON array of findings.`,
  ],
  outputDir: './ai-analysis',
  minSeverity: 'warning',  // Skip info-level findings
});

// Cost tracking example:
const results = await tester.runTests();
const totalCost = results.resultsByMode.get('ai-vision')
  ?.reduce((sum, r) => sum + (r.metadata.cost?.totalCost || 0), 0);

console.log(`AI analysis cost: $${totalCost?.toFixed(4)}`);
// Example: AI analysis cost: $0.1240 (10 screenshots × $0.0124/image)
```

---

### Example 3: Anthropic Claude 3.5

```typescript
const aiAnalyzer = new AIScreenshotAnalyzer({
  provider: 'anthropic',
  config: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1024,
  },
  prompts: [
    'Review this web application screenshot and identify visual bugs, accessibility issues, and UX improvements. Provide specific, actionable recommendations.',
  ],
  outputDir: './ai-analysis',
  categories: ['visual-bugs', 'accessibility', 'ux-problems'],
});

// Claude 3.5 excels at:
// - Detailed accessibility analysis
// - Contextual UX recommendations
// - Natural language explanations
```

---

### Example 4: Multi-Provider Comparison

```typescript
// Compare Ollama vs OpenAI accuracy
const ollamaAnalyzer = new AIScreenshotAnalyzer({
  provider: 'ollama',
  config: { model: 'llama3.2-vision:11b' },
  prompts: ['Identify visual bugs and layout issues'],
  outputDir: './ai-analysis/ollama',
});

const openaiAnalyzer = new AIScreenshotAnalyzer({
  provider: 'openai',
  config: { apiKey: process.env.OPENAI_API_KEY, model: 'gpt-4-vision-preview' },
  prompts: ['Identify visual bugs and layout issues'],
  outputDir: './ai-analysis/openai',
});

// Run both in parallel
tester.registerTestFunction(ollamaAnalyzer);
tester.registerTestFunction(openaiAnalyzer);

const results = await tester.runTests();

// Compare findings:
const ollamaFindings = results.resultsByMode.get('ai-vision-ollama');
const openaiFindings = results.resultsByMode.get('ai-vision-openai');
```

---

## Performance Considerations

### Speed Comparison

| Provider | Model | Speed (per image) | Quality |
|----------|-------|-------------------|---------|
| Ollama | llama3.2-vision:11b | 3-5s (GPU) | Good |
| Ollama | llama3.2-vision:90b | 10-15s (GPU) | Excellent |
| Ollama | llava:13b | 2-3s (GPU) | Good |
| OpenAI | gpt-4-vision | 1-2s | Excellent |
| Anthropic | claude-3-5-sonnet | 1-2s | Excellent |

**Optimization strategies:**
1. **Parallel processing**: Analyze multiple screenshots concurrently
2. **Viewport selection**: Analyze desktop OR mobile, not both
3. **Prompt batching**: Combine multiple prompts into one request
4. **Model selection**: Use faster models for quick feedback

---

## Cost Analysis

### OpenAI GPT-4 Vision

**Pricing** (as of 2026):
- Low detail: $0.01 per image
- High detail: $0.03 per image

**Example costs:**
```
10 routes × 2 viewports × $0.03 = $0.60 per test run
100 routes × 2 viewports × $0.03 = $6.00 per test run
1000 routes × 2 viewports × $0.03 = $60.00 per test run
```

**Monthly cost (daily testing):**
```
10 routes: $0.60 × 30 = $18/month
100 routes: $6.00 × 30 = $180/month
```

---

### Anthropic Claude 3.5

**Pricing** (as of 2026):
- Input: $3 per MTok
- Output: $15 per MTok

**Image costs** (1600×1200 image ≈ 1000 tokens):
- Analysis cost: ~$0.003-0.015 per image (cheaper than GPT-4V)

**Example costs:**
```
10 routes × 2 viewports × $0.01 = $0.20 per test run
100 routes × 2 viewports × $0.01 = $2.00 per test run
```

**Monthly cost (daily testing):**
```
10 routes: $0.20 × 30 = $6/month
100 routes: $2.00 × 30 = $60/month
```

---

### Ollama (Local)

**Pricing**: FREE

**Hardware requirements:**
- **llama3.2-vision:11b**: 8GB VRAM (RTX 3070+, M1 Max+)
- **llama3.2-vision:90b**: 48GB VRAM (A100, H100)
- **llava:13b**: 8GB VRAM

**Cost comparison:**
```
Hardware: $500-2000 (one-time)
vs
OpenAI: $18-180/month (ongoing)

Break-even: 3-11 months
```

---

## Success Metrics

### Phase 3.1-3.2 (Ollama)

- ✅ Ollama integration working
- ✅ Model auto-detection
- ✅ Finding categorization
- ✅ Cost: $0 (local)

---

### Phase 3.3-3.4 (Cloud Providers)

- ✅ OpenAI integration working
- ✅ Anthropic integration working
- ✅ Rate limiting handled
- ✅ Cost tracking implemented

---

### Phase 3.5-3.6 (Production Ready)

- ✅ Comprehensive prompt library
- ✅ Aggregated scoring
- ✅ Multi-provider support
- ✅ Documentation complete
- ✅ User guides published

---

## Timeline

| Week | Phase | Deliverable |
|------|-------|-------------|
| 1-2 | 3.1 | Core infrastructure |
| 3 | 3.2 | Ollama integration |
| 4 | 3.3 | OpenAI integration |
| 5 | 3.4 | Anthropic integration |
| 6 | 3.5 | Prompt library & scoring |
| 7 | 3.6 | Testing & docs |

**Total**: 7 weeks

---

## Open Questions

1. **Baseline comparison**: How to compare AI findings across test runs?
2. **False positive filtering**: How to suppress known non-issues?
3. **Fine-tuning**: Should we support fine-tuned models for domain-specific analysis?
4. **Caching**: Should we cache AI responses to reduce costs?
5. **Confidence scoring**: Should findings include confidence scores?

---

## Next Steps

1. ✅ Review and approve this plan
2. ⏳ Implement Phase 3.1 (core infrastructure)
3. ⏳ Test with Ollama locally
4. ⏳ Add OpenAI/Anthropic providers
5. ⏳ Build comprehensive prompt library
6. ⏳ Document and publish

---

## Conclusion

AI Vision Analysis will transform visual QA from **manual inspection** to **automated intelligence**. By supporting multiple providers (Ollama for privacy, OpenAI/Anthropic for accuracy), we give users the flexibility to choose their own balance of **cost, speed, and quality**.

**Phase 3 will deliver:**
- 🤖 Automated visual bug detection
- ♿ AI-powered accessibility review
- 🎨 UX improvement suggestions
- 🔒 Privacy-first local analysis (Ollama)
- 💰 Cost-effective cloud analysis (Anthropic)
- 🚀 High-accuracy analysis (OpenAI GPT-4V)

Let's build the future of visual testing.
