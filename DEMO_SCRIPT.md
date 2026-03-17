# NextIQ — 15-Minute Demo Script

> **Audience**: Internal stakeholders, product leadership, engineering leads
> **Goal**: Show NextIQ's intelligence engine, Autopilot mode, widget ecosystem, and Actions Builder

---

## PART 1: Setting the Stage (1 min)

**[Open the app at `localhost:5173`. You'll land on the Home/Engagement page.]**

> "What you're looking at is the NextIQ prototype — our vision for an AI-native agent assistant built directly into the Nextiva platform. NextIQ doesn't just suggest responses. It classifies intent in real time, decides whether to surface a Knowledge Base answer, a Next Best Action, or both — and when in Autopilot mode, it executes autonomously with a human-in-the-loop safety net."

> "I'll walk you through two real customer scenarios, the widget ecosystem, and the Actions Builder where admins configure the tools that power NextIQ."

---

## PART 2: Brad Pitt — Manual Assist Mode (4 min)

**[Click "Inbox" in the left sidebar. Select Brad Pitt from the conversation list.]**

> "Brad Pitt is a VIP customer who reached out about an urgent billing question. Let's see how NextIQ supports an agent in manual mode."

### Step 1 — Intent Classification & First Response

**[Look at the NextIQ Intelligence panel on the right. The first message is already classified.]**

> "The moment Brad's message came in — 'I was given your direct contact by our account manager, we have an urgent billing question' — NextIQ classified the intent and made a decision: this is a greeting-stage message, so no Knowledge Base article is needed. Instead, it presents Next Best Actions."

> "Notice we have NBA options: a Greeting reply to acknowledge Brad and ask about the billing question, and an Action to fetch Brad's account and billing details. Each NBA shows its type, priority, and a preview of what will happen."

**[Hover over the first NBA tile to show the expanded reply preview.]**

> "On hover, the tile expands to reveal the AI-generated message. The agent can click Send to use it as-is, or Edit to customize. This is the manual assist flow — NextIQ recommends, the agent decides."

**[Click "Send" on the greeting NBA.]**

> "The greeting is sent. Now watch — Brad responds with the actual billing issue."

### Step 2 — Knowledge Base + Action NBAs

**[Brad's mock reply arrives. Look at the NextIQ panel update.]**

> "Now Brad mentions duplicate billing charges for February. NextIQ's engine does two things simultaneously: it pulls a Knowledge Base response about refund policy — notice the confidence score — and it generates action-oriented NBAs like 'Respond & Check Feb Billing for Double Charges'."

> "This is the core intelligence: the engine decided this message needs BOTH a knowledge answer AND executable actions. The KB gives the agent policy context, the NBAs give them tools to act."

**[Click Execute on the action NBA to check billing.]**

> "When the agent executes this action, NextIQ runs the tool — it checks the billing system and finds two identical charges of $2,400 on Feb 15. The result is presented in a clean, non-technical format."

**[Continue through the refund flow by clicking the next NBAs as they appear.]**

> "From here, the flow continues: NextIQ suggests confirming the duplicate and initiating a refund. Each step is an NBA that the agent can approve, edit, or skip. The entire billing investigation — from detection to resolution — is powered by tool calls happening behind the scenes."

---

## PART 3: Right Panel Widgets (2 min)

**[While still on Brad Pitt's conversation, click through the widget tabs on the right.]**

### Customer 360 Tab

**[Click the person icon tab.]**

> "Beyond intelligence, agents have full context at their fingertips. The Customer 360 tab shows Brad's profile, account tier, health score, tenure, and recent activity — all pulled from our Unified Data Platform."

### Meetings Tab

**[Click the video icon tab.]**

> "The Meetings tab shows upcoming scheduled calls. Agents can see context before joining — like the quarterly business review coming up — and create new meetings directly from here."

### Tickets Tab

**[Click the alert icon tab.]**

> "The Tickets tab shows related support tickets. Notice this duplicate billing ticket was already created with the transaction IDs. Agents can create new tickets without leaving the conversation."

### Notes Tab

**[Click the notes icon tab.]**

> "Internal notes let the team collaborate. These are invisible to the customer — agents can tag colleagues, leave context for the next shift."

**[Click back to the NextIQ Intelligence tab (sparkle icon).]**

> "And we're back to the intelligence view. All of these widgets work together — NextIQ has access to the same customer data, which is why its suggestions are so contextually accurate."

---

## PART 4: David Kim — Autopilot Mode (5 min)

**[Select David Kim from the conversation list.]**

> "Now let's see what happens when we turn on Autopilot. David Kim is a technical customer with API rate limit errors. This is a complex, multi-step resolution."

### Step 1 — Enable Autopilot

**[Toggle Autopilot ON in the NextIQ panel.]**

> "When I flip Autopilot on, NextIQ takes the wheel. Watch the panel — it immediately classifies David's message, decides the best response, and starts a 10-second countdown."

**[Point to the countdown animation — the conic border sweep and glow on the chosen tile.]**

> "See that border tracing around the tile? That's the 10-second timer. The agent can see exactly what NextIQ is about to do. They can hit 'Send Now' to approve immediately, 'Edit' to modify, or 'Cancel' to intervene. This is human-in-the-loop — AI proposes, the human has final say."

### Step 2 — Watch the Autonomous Flow

**[Let the countdown complete. NextIQ sends the KB response automatically.]**

> "NextIQ sent a Knowledge Base response about rate limiting policy. Now David replies asking to check his usage — and Autopilot kicks in again."

**[Let each step auto-execute, narrating as you go:]**

> "Step two — NextIQ chose an Action NBA: 'Check API Usage & Rate Limits.' It's executing the tool call, pulling David's actual usage data. The result comes back: he's hitting 487 requests per minute against a 300 limit."

> "Step three — Now NextIQ suggests sharing the findings AND applying a temporary rate limit increase. Watch the countdown..."

> "Step four — David confirms. NextIQ applies the temporary increase to 1,000 requests per minute and pivots the conversation to discuss an Enterprise upgrade. This is upsell intelligence built into the resolution flow."

> "Step five — David wants to schedule a call. NextIQ generates a 'Schedule Enterprise Consultation' action, books Thursday at 2 PM, and sends the confirmation."

> "Step six — David says thanks. NextIQ recognizes this is a closing message — no KB article needed, just a warm wrap-up."

### The Result

> "In about two minutes of Autopilot, NextIQ resolved a technical issue, applied a temporary fix, identified an upsell opportunity, and scheduled a follow-up call. An agent monitoring this could have intervened at any point, but the AI handled the entire flow."

---

## PART 5: Actions Builder (3 min)

**[Navigate to Admin (gear icon in sidebar) → Click "Actions Builder" under People & AI.]**

> "Everything NextIQ just did — checking billing, running API lookups, processing refunds, scheduling meetings — is powered by Actions. Let's see where admins build and manage them."

### The Landing Page

> "Here are our 10 pre-built action templates across three categories: Account Management, Billing & Payments, and Communication. Each card shows the action name, description, and whether it's available to the NextIQ engine."

**[Point to the stats banner at the top.]**

> "This banner gives admins a quick count — 10 actions available across 3 categories, all powering Next Best Actions in real time."

### Inside an Action — The Canvas Builder

**[Click on "Modify Plan".]**

> "Let's look inside the Modify Plan action. This is the visual canvas builder — a drag-and-drop workflow editor built on ReactFlow."

**[Point to each node in the flow:]**

> "Every action follows a pattern: Start node defines the inputs — here it's user ID, new plan details, and the modify action type (upgrade, downgrade, or cancel). These are the parameters NextIQ passes in automatically."

**[Click on the AI Action node to open its config.]**

> "This is the key — the AI Action node. It has a system prompt that says: 'You are an AI agent analyzing user plans and executing modifications. You have APIs available to execute cancel, upgrade, downgrade...' This is what makes building tools so easy. The admin writes a natural language prompt, and the AI figures out how to transform user input into the right API call."

**[Close the modal. Click on the API node.]**

> "The API node is configured with the actual endpoint — PUT to the subscriptions API with the plan payload. Headers, timeout, output variable — all configurable."

**[Close the modal. Click on the Condition node.]**

> "The Condition node branches the flow — if the user is eligible for the plan change, we proceed to execute it. If not, a separate AI Action explains why and suggests alternatives."

**[Click on the End node.]**

> "The End node defines what gets returned to NextIQ: a success message and the modified plan details. This is what the engine uses to generate the NBA response the agent sees."

**[Click "Back" to return to the Actions Builder landing page.]**

### Enable/Disable & New Actions

**[Toggle one of the action switches off.]**

> "Admins can enable or disable any action with this toggle. If a tool is still being built or tested, flip it to 'Hidden from NextIQ' and it won't appear in agent sessions. Flip it back when it's ready."

**[Click "New Action" button.]**

> "Creating a new action is simple. Give it a name — say 'Check Account Rate Limits' — and a description that tells NextIQ when and how to use it. This description becomes the tool definition for the AI engine."

**[Fill in the name and description fields, then click "Create & Open Builder".]**

> "And now you're in the canvas with a blank slate. Drag in a Start node, an AI Action, an API call, and an End node — connect them — and you've built a new tool for NextIQ. No engineering deployment needed."

**[Click "Back" to return to the landing page.]**

---

## CLOSING (30 sec)

> "To recap: NextIQ is an intent-driven intelligence engine that decides in real time whether agents need knowledge, actions, or both. In manual mode, it's a copilot. In Autopilot mode, it's an autonomous agent with human oversight. And the Actions Builder lets admins create and manage the tools that power it all — with AI prompts, not code."

> "Questions?"

---

## Quick Reference — Key Demo Beats


| Time  | Section         | What to Show                                                                   |
| ----- | --------------- | ------------------------------------------------------------------------------ |
| 0:00  | Intro           | Home page, set context                                                         |
| 1:00  | Brad Pitt       | Manual mode: greeting → billing inquiry → KB + NBA → refund flow               |
| 5:00  | Widgets         | Customer 360, Meetings, Tickets, Notes tabs                                    |
| 7:00  | David Kim       | Autopilot ON → watch 6-step autonomous resolution                              |
| 12:00 | Actions Builder | Landing page → Modify Plan canvas → node configs → enable/disable → new action |
| 15:00 | Close           | Recap and Q&A                                                                  |


## Tips

- **Don't rush Autopilot**: Let the 10-second countdown play out at least once so the audience sees the border animation and understands the human-in-the-loop concept.
- **Click into node configs**: The AI Action prompts are the "wow moment" — show that building a tool is just writing a prompt.
- **Toggle an action off**: This shows governance — admins control what AI can do at runtime.
- **Hover on NBA tiles**: The expand animation and preview text show the agent experience clearly.

