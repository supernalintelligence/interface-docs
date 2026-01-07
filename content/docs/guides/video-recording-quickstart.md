# Quick Start: Your First Video

Complete this in 10 minutes to generate your first story video.

## Step 1: Write a Simple Story (2 min)

Create `docs-site/features/my-first-demo.feature`:

```gherkin
Feature: My First Demo
  As a new user
  I want to see the basics
  So that I understand the interface

  Scenario: Basic interaction
    Given I am on the demo page
    When I wait for 1 second
    Then I should see the page loaded
```

## Step 2: Start Your Dev Server (1 min)

```bash
cd docs-site
npm run dev
# Wait for: "ready - started server on http://localhost:3000"
```

## Step 3: Record Video (2 min)

In a new terminal:

```bash
cd /Users/ianderrington/git/supernal-nova/platform/packages/@supernal-interface

# Record the video
si record-story-video docs-site/features/my-first-demo.feature \
  --base-url http://localhost:3000
```

Output will be: `./videos/stories/my-first-demo.webm`

## Step 4: Watch Your Video (1 min)

```bash
# macOS
open ./videos/stories/my-first-demo.webm

# Or drag the file into your browser
```

## Step 5: Refine Your Story (4 min)

Now make it more interesting:

```gherkin
Feature: Chat Demo
  As a new user
  I want to see chat in action
  So that I understand the AI capabilities

  Scenario: Send a message
    Given I am on the demo page at "/demo/simple"
    And I wait for the page to fully load
    When I type "Hello, AI!" in the chat input
    And I click the send button
    Then I should see my message appear
    And I wait for 2 seconds
```

Record again:

```bash
si record-story-video docs-site/features/my-first-demo.feature \
  --step-delay 1000
```

## What's Next?

- Read the [Full Guide](./video-recording-guide.md)
- See [Example Stories](../../features/demos/)
- Learn about [Embedding Videos](./video-recording-guide.md#7-embedding-videos-in-documentation-site)

## Troubleshooting

**Video won't record?**
```bash
# Check if server is running
curl http://localhost:3000

# Check if CLI is available
si --help
```

**Server not found?**
```bash
# Make sure you're in the right directory
cd docs-site
npm run dev
```

**CLI command not found?**
```bash
cd enterprise
npm link
si --help
```

---

**Time to first video**: 10 minutes  
**Difficulty**: Beginner-friendly

