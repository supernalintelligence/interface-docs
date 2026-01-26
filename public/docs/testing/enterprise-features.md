# Enterprise Features 🔒

> Advanced capabilities for teams that need automated route discovery, AI-powered visual analysis, and enterprise-grade testing at scale.

## Overview

Supernal Interface Enterprise extends the open-source testing framework with powerful automation and AI features designed for production applications with complex navigation graphs.

---

## Features

### 🤖 AI Vision Analysis

**Automated screenshot analysis using multimodal vision models**

- **Visual Bug Detection**: Automatically identify broken layouts, overlapping elements, cut-off text, missing images
- **Accessibility Analysis**: Detect low contrast, small text, missing touch targets, form label issues
- **UX Review**: Identify unclear navigation, poor visual hierarchy, mobile responsiveness issues
- **Performance Hints**: Spot large images, render-blocking resources, layout shift sources

**Supported Providers:**
- **Ollama** - Local, private, free (llama3.2-vision, llava, bakllava)
- **OpenAI GPT-4 Vision** - Highest accuracy ($0.01-0.03 per image)
- **Anthropic Claude 3.5 Sonnet** - Balanced cost/performance ($0.003-0.015 per image)
- **Custom Models** - Fine-tuned for your domain

**Example Output:**
```json
{
  "findings": [
    {
      "category": "layout-issues",
      "severity": "warning",
      "title": "Navigation menu cutoff on mobile",
      "description": "The navigation menu appears partially cut off on mobile viewports",
      "suggestion": "Consider using a hamburger menu for mobile",
      "selector": "nav.main-nav"
    },
    {
      "category": "accessibility",
      "severity": "critical",
      "title": "Submit button has low contrast",
      "description": "Contrast ratio of 3.2:1, below WCAG AA requirement of 4.5:1",
      "suggestion": "Increase button text color to #000000",
      "selector": "button.submit-btn"
    }
  ],
  "score": 75
}
```

**Cost Analysis:**

| Provider | Monthly Cost (10 routes, 2 viewports, daily) | Break-even vs Manual QA |
|----------|----------------------------------------------|-------------------------|
| Ollama (local) | $0/month (hardware: $500-2000 one-time) | 3-11 months |
| Anthropic | $6/month | Immediate |
| OpenAI | $18/month | Immediate |

---

### 🗺️ NavigationGraph Auto-Discovery

**Automatically discover all routes in your application**

Instead of manually defining routes:
```typescript
// Open-source: Manual route definition
const tester = new GraphTester({
  routes: [
    { route: '/', metadata: { name: 'Home' } },
    { route: '/dashboard', metadata: { name: 'Dashboard' } },
    // ... manually list all routes
  ],
});
```

Enterprise auto-discovers routes by crawling your app:
```typescript
// Enterprise: Automatic route discovery
import { NavigationGraph } from '@supernal/interface-enterprise/testing';

const graph = await NavigationGraph.discoverFromUrl('http://localhost:3000');
// Automatically finds all routes, generates graph

const tester = new GraphTester({
  navigationGraph: graph,  // All routes discovered
});
```

**Features:**
- Crawls application starting from root URL
- Follows all navigation links automatically
- Builds complete route graph
- Identifies orphan/unreachable routes
- Detects circular navigation paths
- Validates route contracts

---

### 📊 Advanced Reporting

**Enterprise-grade reporting and analytics**

- **Trend Analysis**: Track metrics over time (performance degradation, accessibility improvements)
- **Team Dashboards**: Multi-project overview with aggregated metrics
- **Slack/Teams Integration**: Automated notifications on test failures
- **Custom Webhooks**: Integrate with your CI/CD and monitoring tools
- **Historical Comparison**: Compare test runs to identify regressions

---

### 🔐 Security & Compliance

**Enterprise security features**

- **SSO/SAML Integration**: Centralized authentication
- **Audit Logs**: Complete history of test runs and changes
- **Role-Based Access Control**: Granular permissions per team/project
- **Data Residency**: Run tests in your own infrastructure
- **Compliance Reports**: SOC 2, HIPAA, GDPR reporting

---

### ⚡ Performance & Scale

**Optimized for large applications**

- **Distributed Testing**: Parallel execution across multiple machines
- **Smart Caching**: Incremental testing (only test changed routes)
- **Resource Optimization**: Intelligent browser pooling
- **Test Scheduling**: Automated nightly/weekly test runs
- **Load Balancing**: Distribute tests across cloud workers

---

## Pricing

### Open Source (Free)
- ✅ Visual regression testing
- ✅ Performance testing (Core Web Vitals)
- ✅ Accessibility testing (WCAG 2.0/2.1/2.2)
- ✅ SEO validation
- ✅ Multi-viewport testing
- ✅ HTML/Markdown/JSON/CSV reports
- ✅ Manual route definition
- ❌ AI vision analysis
- ❌ NavigationGraph auto-discovery
- ❌ Advanced reporting & analytics
- ❌ Enterprise security features

### Enterprise (Contact Sales)
- ✅ **Everything in Open Source**
- ✅ **AI vision analysis** (Ollama/OpenAI/Anthropic/Custom)
- ✅ **NavigationGraph auto-discovery**
- ✅ **Advanced reporting & analytics**
- ✅ **Team dashboards & notifications**
- ✅ **SSO/SAML, audit logs, RBAC**
- ✅ **Distributed testing & smart caching**
- ✅ **Priority support**
- ✅ **Custom integrations**

---

## Getting Started with Enterprise

**Contact us for pricing and early access:**

- **Email**: [enterprise@supernal.ai](mailto:enterprise@supernal.ai)
- **Book Demo**: [https://supernal.ai/demo](https://supernal.ai/demo)
- **Documentation**: [https://docs.supernal.ai/enterprise](https://docs.supernal.ai/enterprise)

**What happens next:**
1. 30-minute demo tailored to your application
2. Free 14-day trial with full enterprise features
3. Custom pricing based on your team size and usage
4. Onboarding support and training
5. Dedicated Slack channel for support

---

## FAQ

### Why isn't AI vision analysis open-source?

AI vision analysis requires significant infrastructure, ongoing model training, and expertise to maintain. By keeping this feature enterprise-only, we can:
- Invest in better models and accuracy
- Provide dedicated support for complex use cases
- Ensure sustainable development of the entire framework
- Compete effectively with proprietary testing platforms

The open-source framework already provides comprehensive testing across 4 dimensions (visual, performance, accessibility, SEO) with rich metadata output. Enterprise customers get automated AI analysis on top of this foundation.

### Can I use Ollama for free AI analysis?

Ollama is a local, open-source AI runtime. While the **models** are free to download and run, the **integration and orchestration** with Supernal Interface is an enterprise feature. Enterprise customers can choose Ollama as their provider to avoid per-image API costs while still benefiting from our prompt library, result aggregation, and reporting infrastructure.

### What's the ROI of Enterprise?

**Manual QA Cost**: $50-100/hour × 2-4 hours/week = $400-1600/month

**Enterprise Cost**: Starting at $99/month (contact for custom pricing)

**Savings**: $300-1500/month + faster releases + fewer production bugs

Most teams see positive ROI within the first month.

### Can I self-host Enterprise?

Yes! Enterprise customers can self-host in their own infrastructure for compliance and data residency requirements. Contact us for on-premise licensing.

---

## Support

- **Enterprise Support**: [support@supernal.ai](mailto:support@supernal.ai)
- **Sales**: [enterprise@supernal.ai](mailto:enterprise@supernal.ai)
- **Documentation**: [https://docs.supernal.ai](https://docs.supernal.ai)
- **Discord**: [https://discord.gg/supernal](https://discord.gg/supernal)
