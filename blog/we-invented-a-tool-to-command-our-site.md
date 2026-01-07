---
title: "We Invented a Tool to Command Our Site. Now We're Using That Tool to Show You How Our Site Can Command Tools"
date: 2025-01-XX
status: draft
unpublished: true
tags:
  - tools
  - automation
  - story-flow
  - enterprise
  - demonstration
tts:
  enabled: true
  voice: "alloy"
  voices: ["alloy", "echo", "fable", "nova", "onyx", "shimmer"]
  enableSpeed: true
  enableProgress: true
---

# We Invented a Tool to Command Our Site. Now We're Using That Tool to Show You How Our Site Can Command Tools

**Meta, right?**

We've built something that we think is pretty special: a system that lets you command your site through natural language, and then we built a system to record videos of that system in action. It's tools all the way down.

## The Problem We Solved

When building complex web applications, one of the hardest things to demonstrate is the *flow*—how different parts of your application work together, how user journeys unfold, and how your tools enable those journeys.

Traditional screen recording tools capture what you do, but they don't capture *why* you're doing it, or how the system is orchestrating those actions. They don't show the story.

## The Solution: Story Flow Recording

We've integrated video recording directly into our story system—the same Gherkin-based behavioral testing framework we use to define user journeys. Now, when we execute a story, we can automatically record a video demonstration that shows:

- **Cursor movements** that guide the viewer's attention
- **Step annotations** that explain what's happening
- **Click highlights** that show exactly what's being interacted with
- **Complete story flow** from start to finish

## How It Works

### 1. Define Your Story

We use Gherkin feature files to define our stories—the same format we use for testing:

```gherkin
Feature: Story Flow Demonstration
  As a developer
  I want to see a complete story flow demonstration
  So that I can understand how our tool system commands the site

  Scenario: Complete user journey through chat and counter
    Given I am on the demo page
    When I open the main menu using Components.demo.openMainMenu
    Then the menu should be visible
    When I navigate to the chat demo using Components.demo.navigateToChat
    Then I should see the chat component
    When I type "Hello, I'm testing the story flow" in Components.chat.input
    And I click Components.chat.sendButton
    Then the message should appear in Components.chat.messageList
```

### 2. Execute with Video Recording

Using our enterprise CLI tool:

```bash
si record-story-video features/story-flow-demo.feature \
  --output ./videos/stories \
  --quality high \
  --base-url http://localhost:3000
```

### 3. Get a Polished Demonstration Video

The system automatically:
- Records the entire execution
- Tracks cursor movements to guide attention
- Highlights clicked elements
- Shows step-by-step annotations
- Generates a high-quality video file

## What Makes This Special

### It's Not Just Screen Recording

Traditional screen recording captures *what* you do. Our story flow recording captures:
- **The story** (the Gherkin scenarios)
- **The execution** (Playwright automation)
- **The context** (step annotations, highlights)
- **The flow** (complete user journey)

### It's Automated

No manual recording required. Write your story once, generate videos on demand. Perfect for:
- Documentation
- Onboarding
- Sales demos
- Bug reports
- User guides

### It's Integrated

The video recording is built into our story execution system. When you run a story, you can optionally record it. The same story that tests your application can demonstrate it.

## The Meta Part

Here's where it gets interesting: we're using our tool system (the one that lets you command the site) to demonstrate how our tool system works. The story flow recording uses Playwright to navigate through the site, executing the same tools that users would execute through the chat interface.

It's a demonstration of a demonstration system, powered by the tools it's demonstrating.

## Try It Yourself

This feature is available in our **Enterprise** package. If you're already using Supernal Interface Enterprise, you can start recording story videos today:

```bash
# Install enterprise package
npm install @supernalintelligence/interface-enterprise

# Record a story video
si record-story-video your-story.feature
```

## What's Next

We're continuing to enhance the story flow recording system:
- **Post-processing** with ffmpeg for even better video quality
- **Custom overlays** and branding
- **Multi-scenario** videos that combine multiple stories
- **Interactive annotations** that link to documentation

## Conclusion

We built a tool to command our site. Then we built a tool to record videos of that tool in action. The result is a system that can automatically generate polished demonstration videos from the same stories we use for testing.

It's tools all the way down, and we think that's pretty cool.

---

*This feature is part of Supernal Interface Enterprise. [Learn more about our enterprise features](/enterprise).*

