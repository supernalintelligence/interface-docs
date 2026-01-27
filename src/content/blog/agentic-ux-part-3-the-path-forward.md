---
title: "Building AI That Does: Architecture and Path Forward"
date: "2026-01-14"
subheader: "Part 3 of 3: The principles behind Agentic UX and how to get started"
categories: ["Agentic UX", "AI Strategy", "Implementation"]
readingTime: "8 min read"
featured: true
series: "Agentic UX"
seriesPart: 3
tts:
  enabled: true
  voice: "nova"
  voices: ["alloy", "echo", "fable", "nova", "onyx", "shimmer"]
  enableSpeed: true
  enableProgress: true
---

## Recap: Three Perspectives, One Solution

In [Part 1](./agentic-ux-part-1-the-problem), we established the problem:
- AI chat fails users (homework instead of help)
- AI chat fails clients (frustration instead of success)
- AI chat fails businesses (cost center instead of value driver)

In [Part 2](./agentic-ux-part-2-the-solution), we defined the solution:
- Agentic UX = AI that acts in your UI, visibly, in real-time
- Different from Content AI, RAG, and MCP (which all fall short)
- Aligns all three perspectives

Now: What makes Agentic UX work? And how do you start building it?

---

## Architectural Principles

You don't need implementation details yet. You need to understand what makes this work.

### Principle 1: Tool Registry

AI can only do what it knows about.

A **Tool Registry** is a central catalog of available actions:
- What actions exist in this app
- What each action does
- What parameters each action needs
- When each action is available (context-dependent)
- How risky each action is

As users navigate your app, the registry updates dynamically. AI always knows what's possible *right now*.

**Example:**

On the dashboard, AI knows:
- View reports
- Create new project
- Access settings

On the customer detail page, AI knows:
- Update customer info
- View purchase history
- Send message to customer

The available actions change based on where the user is.

**Why it matters:** No registry → AI guesses → errors → distrust. With a registry, AI only offers what's actually possible.

---

### Principle 2: Context Awareness

AI should only offer what's relevant.

**Context** means:
- Current page/screen
- Selected items
- Form values
- User permissions
- Application state

With context, AI filters actions to what makes sense *right now*.

**Without context:**
> "Would you like to delete this customer?" (when user is on dashboard, not viewing any customer)

**With context:**
> "I can see you have Johnson's record open. Want me to update their email address?"

**Why it matters:** Relevance builds trust. Irrelevance destroys it. When AI consistently offers useful, contextual suggestions, users learn to rely on it.

---

### Principle 3: Visible Action

Users need to see AI working.

**Invisible action (bad):**
> User: "Update the settings"
> AI: [something happens]
> AI: "Done."
> User: "What changed? Did it work?"

**Visible action (good):**
> User: "Update the settings"
> AI: [navigates to settings—user sees this]
> AI: [toggles option—user sees this]
> AI: [clicks save—user sees this]
> AI: "Done. Changed notification preference to 'daily digest'."

**Why it matters:** Visibility enables three critical things:
1. **Trust**: User knows what happened
2. **Learning**: User learns the interface by watching
3. **Intervention**: User can stop or adjust mid-action

Black boxes erode trust. Visible actions build it.

---

### Principle 4: Progressive Agency

Start conservative. Build trust. Increase agency over time.

**Level 1 - Suggest (Low Agency):**
> "I can export that report for you. Want me to?"

User must explicitly approve before anything happens.

**Level 2 - Prepare (Medium Agency):**
> "I've filled in the form with the data you mentioned. Just confirm to submit."

AI sets things up, user confirms the final action.

**Level 3 - Execute (High Agency):**
> "Done. Exported the report as PDF. Here it is."

AI acts immediately, user monitors the result.

**Why it matters:** Different users, contexts, and stakes need different levels.
- New users need reassurance → Start at Level 1
- Power users want speed → Offer Level 3
- High-stakes actions → Stay at Level 1-2 regardless of user experience

---

### Principle 5: Safety Boundaries

Not everything should be automated.

**Hard rules:**
- Dangerous actions always require confirmation
- Irreversible actions get extra friction (intentionally)
- Everything logged (what, when, who, what changed)
- User can always stop, undo, override

**Examples:**

| Action Type | Agency Level | Confirmation Required |
|-------------|--------------|----------------------|
| View data | High | No |
| Edit draft | High | No |
| Send message | Medium | Brief confirmation |
| Delete record | Low | Explicit confirmation |
| Financial transaction | Low | Multi-step confirmation |

**Why it matters:** Your enterprise customers will ask about this. Your users' trust depends on it. Building safety in from the start is easier than retrofitting it later.

---

## Choosing the Right Agency Level

Agency isn't binary. It's a dial you turn based on context.

| Context | Suggested Agency | Reasoning |
|---------|------------------|-----------|
| High stakes (financial, legal) | Low—suggest only | Mistakes are costly |
| Irreversible actions | Low—require confirmation | Can't undo |
| New users | Low—build trust first | They don't know you yet |
| Repetitive tasks | High—save time | Same action, known outcome |
| Power users | High—they want speed | Trust established |
| Low stakes (preferences, drafts) | High—minimal risk | Easy to change |

**The key insight:** Match agency to risk and trust. Turn it up where appropriate, down where necessary. Let users control their own agency level when possible.

---

## Getting Started: A Pragmatic Path

Don't try to make everything agentic at once. That's how projects fail.

### Step 1: Pick One Workflow

Choose something that is:
- **High friction**: Users complain about it, or you see abandonment in analytics
- **Low stakes**: Mistakes aren't catastrophic, easy to fix
- **High frequency**: Happens often enough to matter

**Good first candidates:**

| Workflow | Why It's Good |
|----------|---------------|
| Onboarding | High friction, high impact, recoverable |
| Settings/Configuration | Users struggle to find things |
| Repetitive exports | Same action, over and over |
| Form filling | Tedious, error-prone |
| Search → Select → Act | Multi-step but predictable |

**Bad first candidates:**

| Workflow | Why to Avoid Initially |
|----------|------------------------|
| Financial transactions | High stakes |
| Compliance workflows | Audit requirements |
| Anything irreversible | Risk too high for learning |
| Workflows with external dependencies | Too many variables |

### Step 2: Measure Before

Before changing anything, establish baselines:

| Metric | How to Measure |
|--------|----------------|
| Task completion rate | Analytics, funnel tracking |
| Time to completion | Session recordings, timestamps |
| Error rate | Support tickets, error logs |
| User satisfaction | Survey, NPS for the workflow |
| Support tickets | Count tickets about this workflow |

These are your "before" numbers. You need them to prove value.

### Step 3: Add Agentic Assistance

For this one workflow:

1. **Register the relevant actions** in a tool registry
2. **Provide context awareness** so AI knows where user is
3. **Make execution visible** so user sees what's happening
4. **Start at low agency** (suggest first, don't just do)

**The implementation pattern:**

```
User enters workflow
  → AI offers: "I can help you complete this. Want me to?"
  → User accepts
  → AI executes steps visibly
  → User confirms result
```

### Step 4: Measure After

Same metrics as Step 2. Compare.

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Completion rate | 65% | 89% | +24% |
| Time to complete | 4.2 min | 1.1 min | -74% |
| Error rate | 12% | 3% | -75% |
| Support tickets | 47/week | 12/week | -74% |

Now you have a story to tell and a case for expanding.

### Step 5: Iterate and Expand

Based on results:

1. **Tune agency level** based on user feedback and metrics
2. **Roll out to more workflows** starting with similar patterns
3. **Build on what works** rather than starting fresh each time

---

## What to Avoid

**Don't:**
- Try to make everything agentic at launch (scope creep kills projects)
- Start with high-stakes workflows (mistakes will erode trust)
- Skip the visibility (black boxes feel unsafe)
- Forget fallbacks (what happens when AI fails?)
- Ignore security (prompt injection is real)

**Do:**
- Start small, prove value, expand
- Build trust progressively
- Keep humans in the loop (especially early)
- Log everything AI does
- Test AI paths specifically (they need different test strategies)

---

## The Security Conversation

Your security team will ask. Have answers ready.

**Prompt Injection:**
- Input validation on all user queries
- Sandboxed execution (AI can only call registered actions)
- Rate limiting on sensitive operations

**Principle of Least Privilege:**
- AI gets minimum necessary access
- Actions scoped to user's actual permissions
- No privilege escalation through AI

**Audit Logging:**
- Every AI action logged: what, when, who, result
- Searchable, exportable, retainable
- Meets compliance requirements (SOC2, GDPR, etc.)

**User Control:**
- Users can disable AI assistance
- Users can adjust agency levels
- Users can review and undo AI actions

---

## The Choice Ahead

You have two paths:

### Path A: Status Quo

- Keep adding chat features
- Watch usage plateau
- Wonder why AI isn't moving metrics
- Compete on features (commodity, easily copied)

**Outcome:** AI remains a cost center. Users remain frustrated. Differentiation erodes.

### Path B: Agency

- Build AI that does, not tells
- Reduce unrewarding effort in key workflows
- Watch adoption, retention, and satisfaction improve
- Compete on experience (hard to copy)

**Outcome:** AI becomes a value driver. Users succeed. Differentiation strengthens.

The technology is ready. The question is: will your AI tell users what to do, or do it for them?

---

## Series Conclusion

Three perspectives. One solution.

**You as a person:** Want the outcome, not the process. With Agentic UX, you get it.

**You for your client:** Want them to succeed. With Agentic UX, they do.

**You for your business:** Need the AI investment to pay off. With Agentic UX, it does.

Current AI chat translates effort into instructions.
Agentic UX eliminates effort entirely.

The best AI interface is one users don't notice. They just notice they're getting more done.

---

## Key Takeaways

1. **Agentic UX** = AI that acts in your UI, visibly, in real-time, with full context
2. **Five principles**: Tool Registry, Context Awareness, Visible Action, Progressive Agency, Safety Boundaries
3. **Start small**: One high-friction, low-stakes workflow
4. **Measure everything**: Before and after, same metrics
5. **Build trust progressively**: Low agency first, increase over time
6. **Safety first**: Log everything, scope permissions, keep humans in the loop

---

## The Question

The question isn't "should we add AI?"

**It's "should our AI tell, or do?"**

---

*This is Part 3 of the Agentic UX series.*

*[Read Part 1: Your Users Want It to Work →](./agentic-ux-part-1-the-problem)*
*[Read Part 2: AI That Does, Not Tells →](./agentic-ux-part-2-the-solution)*

---

*Ready to build AI that does? Supernal Interface provides the architecture—Tool Registry, Context Awareness, Visible Actions—out of the box. [Learn more →](/docs/getting-started)*
