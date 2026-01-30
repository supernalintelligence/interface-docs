
> @supernal-interface/docs-site@1.0.0 pretest
> npm run story:generate || true


> @supernal-interface/docs-site@1.0.0 story:generate
> node ../enterprise/dist/cjs/cli/index.js generate-story-tests features -o tests/generated/stories --name-contracts src/architecture/ComponentNames.ts

🧪 Generating Playwright tests from Gherkin features...
   Mode: basic

📁 Found 18 .feature files in features

📄 Processing: features/subtitle-overlay.feature
   ✅ Generated: subtitleoverlay-component.spec.ts
      Scenarios: 12
📄 Processing: features/story-flow-demo.feature
   ✅ Generated: story-flow-demonstration.spec.ts
      Scenarios: 3
📄 Processing: features/landing-page-navigation.feature
   ✅ Generated: landing-page-navigation.spec.ts
      Scenarios: 3
📄 Processing: features/demo-widgets.feature
   ✅ Generated: demo-interactive-widgets.spec.ts
      Scenarios: 6
📄 Processing: features/counter.feature
   ✅ Generated: counter-component.spec.ts
      Scenarios: 5
📄 Processing: features/chat.feature
   ✅ Generated: chat-component.spec.ts
      Scenarios: 7
📄 Processing: features/blog-navigation.feature
   ✅ Generated: blog-navigation.spec.ts
      Scenarios: 2
📄 Processing: features/production/counter-basic.feature
   ✅ Generated: counter-basic-operations.spec.ts
      Scenarios: 4
📄 Processing: features/production/chat-messages.feature
   ✅ Generated: chat-messages.spec.ts
      Scenarios: 2
📄 Processing: features/production/blog-basic.feature
   ✅ Generated: blog-basic-navigation.spec.ts
      Scenarios: 1
📄 Processing: features/archive/simple-demo.feature
   ✅ Generated: simple-interface-demo.spec.ts
      Scenarios: 1
📄 Processing: features/archive/counter-tools-demo.feature
   ✅ Generated: counter-tools-demo.spec.ts
      Scenarios: 1
📄 Processing: features/archive/counter-demo.feature
   ⚠️  No scenarios found, skipping
📄 Processing: features/archive/complete-demo.feature
   ✅ Generated: complete-interface-demo.spec.ts
      Scenarios: 4
📄 Processing: features/archive/blog-search.feature
   ✅ Generated: blog-search-navigation.spec.ts
      Scenarios: 11
📄 Processing: features/archive/blog-search-updated.feature
   ✅ Generated: blog-search-navigation.spec.ts
      Scenarios: 15
📄 Processing: features/archive/deprecated/state-caching.feature
   ✅ Generated: state-transitions-and-caching.spec.ts
      Scenarios: 7
📄 Processing: features/archive/deprecated/cache-demo.feature
   ✅ Generated: cache-demo.spec.ts
      Scenarios: 1

✨ Generated 17 test files with 85 scenarios
   Output: tests/generated/stories
📋 Saved manifest: /Users/ianderrington/git/supernal-nova/families/supernal-interface/docs-site/tests/generated/stories/.story-manifest.json


> @supernal-interface/docs-site@1.0.0 test
> playwright test --reporter=list

📦 [NavigationGraph] Created module-level singleton instance (SSR)
Error: Cannot find module '@supernal/interface-enterprise/testing'
Require stack:
- /Users/ianderrington/git/supernal-nova/families/supernal-interface/docs-site/tests/e2e/orchestrator-examples.spec.ts
- /Users/ianderrington/git/supernal-nova/families/supernal-interface/node_modules/playwright/lib/transform/transform.js
- /Users/ianderrington/git/supernal-nova/families/supernal-interface/node_modules/playwright/lib/common/configLoader.js
- /Users/ianderrington/git/supernal-nova/families/supernal-interface/node_modules/playwright/lib/program.js
- /Users/ianderrington/git/supernal-nova/families/supernal-interface/node_modules/@playwright/test/cli.js

   at e2e/orchestrator-examples.spec.ts:18

  16 | import { test, expect, getBaseURL, expandChatBubble } from '../fixtures';
  17 | import { Demo, Chat } from '../../src/architecture/ComponentNames';
> 18 | import { TestDataOrchestrator } from '@supernal/interface-enterprise/testing';
     | ^
  19 | import { StoryCache } from '@supernal/interface-enterprise/stories';
  20 |
  21 | // Calculate source hash once for cache validation
    at Object.<anonymous> (/Users/ianderrington/git/supernal-nova/families/supernal-interface/docs-site/tests/e2e/orchestrator-examples.spec.ts:18:1)

