---
title: "Your Users Want It to Work. Your AI Is Getting in the Way."
date: "2026-01-14"
subheader: "Part 1 of 3: Why chat AI fails everyone—and what to do about it"
categories: ["Agentic UX", "AI Strategy", "User Experience"]
readingTime: "8 min read"
featured: true
series: "Agentic UX"
seriesPart: 1
tts:
  enabled: true
  voice: "nova"
  voices: ["alloy", "echo", "fable", "nova", "onyx", "shimmer"]
  enableSpeed: true
  enableProgress: true
---

## Put Yourself in Their Shoes

Before we dive into architecture, frameworks, or technology—let's start with empathy. Let's understand what's actually happening when AI meets users.

There are three perspectives that matter here. And right now, AI chat is failing all of them.

---

## Perspective 1: You as a Person

Put yourself in your users' shoes. Not as a product person—as a human using software.

You open an app. You need to do something. Maybe export a report. Maybe update a customer record. Maybe configure a setting.

**What you want:**

> "I just want this done. I don't want to learn how this app works. I don't want to read instructions. I don't want to click through five menus. I want the thing to happen, and then I want to move on with my life."

You have 47 other tools you're supposed to know how to use. You don't have time to become an expert in this one. You don't *want* to become an expert in this one. You want the **outcome** of expertise without the **effort** of acquiring it.

**Why you feel this way:**

You're not lazy. You'll put in effort for things that feel rewarding:
- Learning a skill you'll use repeatedly
- Making a creative decision
- Reviewing something important

But clicking through menus? Finding the right button? Reading a wall of instructions? That's not rewarding. That's **tax**. It's the cost between you and what you actually want.

**What you don't want:**

When you ask for help and get:

> "To export your report, navigate to Settings, click the three-dot menu, select Export Options, choose your format..."

You think: *"Great. Homework."*

You didn't want a tutorial. You wanted the report.

**The insight:**

You don't want to *use* the software. You want to *have used* it. You want the outcome without the process.

---

## Perspective 2: You for Your Client

Now put yourself in the shoes of someone who built software for people like you.

You made something. You want people to succeed with it. When they struggle, it hurts.

**What you want for your users:**

> "I want them to get value. I want them to accomplish their goals. I don't want them frustrated, confused, or giving up halfway through."

You've watched the session recordings. You've seen users:
- Give up on onboarding at step 4
- Ask for features that already exist
- Churn because they never found the thing that would have helped them

It's not that your product is bad. It's that they couldn't get to the good parts.

**Why you added AI:**

You thought: "AI will help them! They can ask questions. They'll discover features. They'll get unstuck."

You shipped a chatbot. You integrated an LLM. You added the sparkle icon.

**What actually happened:**

Users asked the AI for help. The AI gave them instructions. They still had to do all the work themselves.

The AI didn't *help* them. It *tutored* them. And they didn't want a tutor—they wanted a helper.

**The gap:**

Your AI told them what to do. They wanted it done.

Their experience: "I asked for help and got assigned homework."

That's not what you wanted for them.

---

## Perspective 3: You for Your Business

Now put yourself in the shoes of someone running the company.

You have metrics to hit. Investors to satisfy. A business to grow.

**What you need:**

> "I need adoption up. Churn down. Support costs reduced. I need this AI investment to pay off."

You spent money on AI integration. Engineering time. API costs. The "AI-powered" marketing.

**What you're seeing:**

- Chat usage spiked for a week, then flatlined
- Support tickets didn't decrease (maybe increased: "the AI told me to...")
- Activation rates unchanged
- Churn unchanged
- You're paying per token for conversations that don't convert to outcomes

**The uncomfortable math:**

You're measuring: chat sessions, messages sent, AI utilization.

You should be measuring: tasks completed, time saved, effort eliminated.

These aren't the same thing. When they diverge, you've built AI that serves your dashboard, not your bottom line.

**The realization:**

Your AI is a cost center, not a value driver. It's not reducing friction—it's adding a new kind of friction (reading instructions) on top of the old friction (doing the work).

You're paying to make your product harder to use.

---

## Why Current AI Chat Fails All Three Perspectives

Traditional AI chat creates a lose-lose-lose:

**It fails YOU AS A PERSON:**
- You asked for help → You got homework
- The effort wasn't eliminated, it was translated
- Reading instructions is still effort
- Your mental model: "I asked, it should happen" — reality: "I asked, now I have to do the thing myself anyway"

**It fails YOU FOR YOUR CLIENT:**
- You wanted them to succeed → They got tutored instead of helped
- They're still frustrated
- They're still churning
- They're still asking for features that already exist (because discovering them requires effort they won't spend)

**It fails YOU FOR YOUR BUSINESS:**
- You're paying per-token for conversations that don't convert
- Metrics haven't improved
- You've added cost without adding value
- The AI serves your dashboard, not your outcomes

**The core failure:**

Your AI chat is a **translator**, not an **actor**.

User says: "Help me export the report"

AI translates to: "Here's how to export the report: Step 1..."

What user wanted: The report exported.

**The effort gap:**

```
What user expected:    Ask → Done
What they got:         Ask → Read → Understand → Navigate → Click → Configure → Done
```

Every step in that gap is unrewarding effort. Your AI didn't eliminate it—it just described it.

---

## The Voice Assistant Precedent

Your users already know what helpful AI feels like. They use it every day:

"Hey Siri, set a timer for 10 minutes."
→ Timer starts. Done.

"Alexa, turn off the lights."
→ Lights off. Done.

"OK Google, text Sarah I'm running late."
→ Message sent. Done.

Notice what doesn't happen:
- No explanation of how timers work
- No instructions for light switch location
- No tutorial on the Messages app

Voice assistants trained users to expect **AI that does**.

When they ask, something happens. The outcome occurs. Effort is eliminated, not described.

Then they open your app:

"Help me export the report"
→ "To export a report, navigate to the Reports section, click the three-dot menu..."

The cognitive dissonance: "My phone does things. Your product explains things."

**Why voice succeeded:**
- Can't copy-paste from voice → action is the only output option
- Immediate feedback → user sees/hears the result
- Simple contract: request → outcome (not request → instructions → effort → outcome)

---

## The Real Problem: Telling vs. Doing

This is the fundamental gap:

**AI that tells:**
> "To export your report, click Settings in the top right, select Export Options, choose your format, configure the date range, and click Generate."

**AI that does:**
> "Here's your report—exported as PDF with last month's data. Want me to change anything?"

**Telling** = effort translated
**Doing** = effort eliminated

From your perspective as a user:
- Telling: "Great, now I have homework"
- Doing: "Done. What's next?"

From your perspective for your clients:
- Telling: User might complete the task (if they follow through)
- Doing: Task is completed (success guaranteed)

From your perspective for your business:
- Telling: Conversation happened (metric logged, outcome uncertain)
- Doing: Outcome happened (value delivered)

**The uncomfortable math:**

Every "telling" interaction adds steps:
1. User reads instructions
2. User understands instructions
3. User navigates to location
4. User performs action
5. User verifies it worked

Every "doing" interaction removes steps:
1. User asks
2. Done

You're paying for AI that makes your product take longer to use.

---

## The Cost of Getting This Wrong

**Costs to you as a person:**
- Time reading instructions you didn't want
- Cognitive load understanding steps
- Frustration when it still doesn't work
- Erosion of trust ("AI is useless")

**Costs to you for your clients:**
- Users who "tried the AI" and gave up
- Churn from friction you thought you'd eliminated
- Feature discovery that never happens

**Costs to you for your business:**
- LLM API costs for conversations that don't convert
- Engineering time maintaining chat features nobody uses
- Support tickets that start with "the AI said to..."

**The hidden cost:**

Every failed AI interaction teaches users not to try again.

"I asked for help and got a lecture. Next time I'll just Google it."

You've trained them that your AI is overhead, not assistance.

---

## The Shift: From Telling to Doing

The solution isn't better prompts, fancier models, or more training data.

The solution is a different interaction model:

**Telling (current):**
```
User asks → AI explains → User acts → Maybe it works
```

**Doing (agentic):**
```
User asks → AI acts → User sees result → Done
```

This is **Agentic UX**: AI embedded in your product that takes action—in real-time, visibly, with full context.

**For you as a person:** Outcome delivered. Effort eliminated. No homework.

**For you for your client:** They succeed. They stay. They find the good parts.

**For you for your business:** Tasks complete. Metrics improve. Investment pays off.

All three perspectives aligned.

---

## Part 1 Conclusion

Three perspectives. One problem.

**You as a person:** Want the outcome, not the process. Got homework instead of help.

**You for your client:** Want them to succeed. They're still frustrated, still churning.

**You for your business:** Need the AI investment to pay off. It's a cost center, not a value driver.

Current AI chat fails all three. It translates effort instead of eliminating it.

The path forward: AI that does, not AI that tells.

---

**Next in Part 2:** What "AI that does" actually looks like—the architecture of Agentic UX, and how it compares to the alternatives you're probably evaluating (RAG, MCP, function calling).

---

*This is Part 1 of the Agentic UX series. [Read Part 2: Agentic UX—AI That Does, Not Tells →](./agentic-ux-part-2-the-solution)*
