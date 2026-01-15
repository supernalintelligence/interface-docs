---
title: "Agentic UX: AI That Does, Not Tells"
date: "2026-01-14"
subheader: "Part 2 of 3: Where Agentic UX fits in the AI landscape, and why the alternatives fall short"
categories: ["Agentic UX", "AI Strategy", "Architecture"]
readingTime: "10 min read"
featured: true
series: "Agentic UX"
seriesPart: 2
tts:
  enabled: true
  voice: "nova"
  voices: ["alloy", "echo", "fable", "nova", "onyx", "shimmer"]
  enableSpeed: true
  enableProgress: true
---

## Recap: Three Perspectives, One Problem

In [Part 1](./agentic-ux-part-1-the-problem), we established:

- **You as a person:** Want the outcome, not the process. Got homework instead of help.
- **You for your client:** Want them to succeed. They're still frustrated, still churning.
- **You for your business:** Need the AI investment to pay off. It's a cost center, not a value driver.

Current AI chat fails all three because it tells instead of does. Every "telling" interaction adds steps instead of removing them.

Now: What does "AI that does" actually mean? And how does it differ from the other approaches you're probably hearing about?

---

## Defining Agentic UX

> **Agentic UX**: AI embedded in your application that takes real action on behalf of users—clicking buttons, filling forms, navigating screens, executing workflows—in real-time, with full application context, visibly.

**Key characteristics:**

**Embedded**: Lives inside your product. Sees what users see. Knows what's possible right now.

**Real-time**: Acts immediately. User watches it happen. Not batch processing somewhere invisible.

**Contextual**: Knows current page, selected items, form state. Offers only what's relevant.

**Visible**: User sees the AI working. Not a black box. Can intervene, adjust, undo.

**The contract with users:**

> "Tell me what you want done. I'll do it. You'll see it happen. You can change anything."

This aligns all three perspectives:
- **You as a person get**: Outcome delivered, effort eliminated, no homework
- **You for your client get**: Users who succeed, stay, and find the good parts
- **You for your business get**: Task completion, not just task explanation

---

## The AI Landscape: Where Alternatives Fall Short

Let's map the options and why they don't fully solve the problem.

### Option 1: Content Agents (Generative AI)

**What they do**: Generate text, images, code, summaries

**Examples**: ChatGPT (standalone), Claude, Midjourney, GitHub Copilot suggestions

**The experience:**
> User: "Help me write the customer email"
> AI: "Here's a draft: Dear valued customer..."
> User: [copies text, opens email client, pastes, reviews, sends]

**Why it falls short:**

From **your perspective as a person**: Content created, but you still have to do the sending, the context-switching, the effort. The outcome (email sent) requires you to finish the job.

From **your perspective for your clients**: Users engaged with AI, but task not complete. They still have all the remaining steps ahead of them.

From **your perspective for your business**: AI utilization metric logged, but conversion to outcome uncertain.

**Verdict**: Good for content creation where human review is essential. Not good for workflow completion or task execution.

---

### Option 2: Retrieval Agents (RAG / Knowledge Bots)

**What they do**: Answer questions from your data

**Examples**: Documentation bots, enterprise search, support assistants

**The experience:**
> User: "How do I export reports?"
> AI: "According to our documentation, you can export reports by navigating to..."

**Why it falls short:**

From **your perspective as a person**: You didn't want to know how—you wanted it done. Now you have instructions, but you still have all the unrewarding effort ahead of you.

From **your perspective for your clients**: User got an answer, but did they do the thing? Probably not. They still have friction between them and the outcome.

From **your perspective for your business**: Question answered (metric logged), but task completion uncertain. Support deflection questionable.

**Verdict**: It's telling with extra steps. Good for finding information. Not good for actually doing the thing the user asked about.

---

### Option 3: Orchestration Agents (MCP / Backend Tool-Use)

**What they do**: Call APIs and backend services based on user intent

**Examples**: MCP servers, LangChain agents, function-calling patterns

**The experience:**
> User: "Update the customer record"
> AI: [calls API in background, invisibly]
> AI: "Done. Record updated."
> User: "What changed? Did it work? I can't tell."

**Why it falls short:**

From **your perspective as a person**: Outcome happened... maybe? But you can't see it. You don't know what changed. It feels uncertain. Invisible = unverifiable.

From **your perspective for your clients**: Action taken, but trust is hard to build when users can't see what's happening. Black box experience.

From **your perspective for your business**: Action completed, but user experience degraded. Risk of errors that users can't catch.

**The specific gaps with MCP:**

**Context Gap**: MCP tools operate on data, not on UI. They don't know what screen the user is on, what item is selected, what form is open, or what the user is trying to accomplish. AI acts on something, but user can't verify it was the right thing.

**Visibility Gap**: User says something → waits → result appears (or doesn't). No feedback loop. No ability to course-correct mid-action.

**Relevance Gap**: MCP exposes all server tools regardless of context. AI might suggest deleting a customer when user is on dashboard, or offer actions impossible in current UI state.

**Verdict**: Powerful for backend automation and system integration. Not designed for user-facing experiences.

---

### Option 4: Agentic UX (Frontend, Real-Time, Visible)

**What they do**: Act within the application UI—navigate, click, fill, submit—visibly

**The experience:**
> User: "Update the customer record"
> AI: [navigates to customer page—user sees this]
> AI: [fills in fields—user sees this]
> AI: [clicks save—user sees this]
> AI: "Done. Updated Johnson account: new email, new phone. Anything else?"

**Why it works:**

From **your perspective as a person**: Outcome delivered. You watched it happen. You can verify it was right. You can change anything. No homework.

From **your perspective for your clients**: Users succeed. They see the AI working. They trust it. They come back.

From **your perspective for your business**: Task completed. Value delivered. Metric actually means something.

**The key differentiators:**

- **Full context**: AI knows what's on screen, what's selected, what's possible *right now*
- **Visible action**: User sees every step, can intervene anytime
- **Immediate feedback**: Results appear as they happen, not after a mystery delay
- **Trust through transparency**: Users understand what AI did and can verify it

---

## The Comparison Table

| Approach | Effort for User | Task Completion | Visibility | Your Goal (Person) | Your Goal (Client) | Your Goal (Business) |
|----------|-----------------|-----------------|------------|--------------------|--------------------|----------------------|
| Content AI | Medium (copy/paste/finish) | Partial | N/A | Partial | Partial | Partial |
| RAG | High (read, then do) | No | N/A | No | No | No |
| MCP/Backend | Low (but uncertain) | Yes (maybe) | None | Uncertain | Partial | Partial |
| **Agentic UX** | **Minimal** | **Yes** | **Full** | **Yes** | **Yes** | **Yes** |

---

## Why MCP Isn't Enough

MCP (Model Context Protocol) is impressive technology. It standardizes how AI calls backend tools. It's genuinely useful for server-side automation.

But it solves a different problem than user experience.

**The Context Problem:**

MCP tools operate on data, not on UI. They don't know:
- What screen the user is on
- What item is selected
- What form is open
- What the user is trying to accomplish

Result: AI acts on something, but user can't verify it was the right thing.

**The Visibility Problem:**

User says something → waits → result appears (or doesn't).

No feedback loop. No ability to course-correct mid-action. Trust is hard to build when you can't see what's happening.

**The Relevance Problem:**

MCP exposes all server tools regardless of context. AI might:
- Suggest deleting a customer when user is on dashboard
- Offer actions impossible in current UI state
- Create confusion between what's possible and what's relevant

**The Right Model: Use Both**

MCP and Agentic UX aren't competitors—they're complements:

- **MCP**: Backend capability (databases, APIs, external services)
- **Agentic UX**: Frontend experience (UI actions, navigation, forms)

**The analogy:**

MCP gives AI access to your server.
Agentic UX gives AI access to your user interface.

Users interact with your interface.

---

## The Business Case Aligned

Let's reconnect to all three perspectives:

### For You as a Person

| Experience | Telling AI | Doing AI |
|------------|-----------|----------|
| Effort required | Read, understand, execute | Confirm |
| Outcome certainty | Maybe | Yes |
| Feeling | "Homework assigned" | "Done" |

### For You for Your Client

| Outcome | Telling AI | Doing AI |
|---------|-----------|----------|
| User success | Uncertain | Guaranteed |
| User frustration | Likely | Minimal |
| Feature discovery | Requires effort | Just happens |
| Trust | Low (black box) | High (visible) |

### For You for Your Business

| Metric | Telling AI | Doing AI |
|--------|-----------|----------|
| Activation | User might complete setup | User completes setup |
| Feature adoption | User learns about features | User uses features |
| Support deflection | User has instructions | User has outcome |
| Churn reduction | User still frustrated | User successful |
| ROI | Cost center | Value driver |

**The alignment:**

All three perspectives converge when AI does instead of tells.

---

## What Agentic UX Looks Like in Practice

**Onboarding:**

Traditional: "Welcome! Here's how to set up your account: Step 1, Step 2, Step 3..."

Agentic: "Welcome! I'll help you get set up. Creating your workspace now... done. Want me to import your data from Google Drive or start fresh?"

**Configuration:**

Traditional: "To enable dark mode, go to Settings > Appearance > Theme > Dark"

Agentic: "Switching to dark mode now... done. Looks good?"

**Complex Workflows:**

Traditional: "To generate a monthly report, first select the date range, then choose the metrics, then pick the format, then click Export..."

Agentic: "Here's your monthly report—same format as last time, with this month's data. Want me to change anything before I send it to the team?"

**The pattern:**

User expresses intent → AI executes → User sees result → User confirms or adjusts

No homework. No translation. No gap between wanting and having.

---

## The Voice Assistant Model, Applied to Visual Interfaces

Remember the voice precedent from Part 1:

"Hey Siri, set a timer" → Timer set
"Alexa, turn off lights" → Lights off

Voice assistants succeeded because:
1. Action is the only output (can't copy-paste from voice)
2. Feedback is immediate and visible
3. The contract is: request → outcome

Agentic UX brings this model to visual interfaces:

"Help me export the report" → Report exported, user sees it happen
"Update the customer info" → Customer updated, user watches the changes
"Set up my account" → Account set up, user sees each step

Same contract. Same immediacy. Same value.

---

## Part 2 Conclusion

The AI landscape has options. Most solve the wrong problem:

- **Content AI** creates, but doesn't complete
- **RAG** answers, but doesn't act
- **MCP** automates backends, but ignores frontends

**Agentic UX fills the gap**: AI that acts in your UI, visibly, contextually, in real-time.

It serves all three perspectives:

- **You as a person**: Outcomes, not homework
- **You for your client**: Success, not frustration
- **You for your business**: Value, not cost

This isn't about adding another AI feature. It's about changing how your product works.

---

**Next in Part 3:** The architectural principles behind Agentic UX, and a pragmatic path to implementation—how to start small, prove value, and expand.

---

*This is Part 2 of the Agentic UX series. [Read Part 3: Building AI That Does →](./agentic-ux-part-3-the-path-forward)*
