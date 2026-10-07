---
title: "What should the board ask before investing in AI?"
description: "Questions for boards, CEOs and CFOs: treat AI as a portfolio of workflow bets, each with alternatives, costs, risks and stopping conditions."
slug: "board-questions-ai-investment"
kind: "decision"
cluster: "leadership"
question: "What should our board, CEO or CFO ask before approving AI investment?"
answer: "Ask for AI to be presented as a portfolio of specific workflow bets rather than a single programme, each with an owner, a measured baseline, the alternatives considered, honest costs, the main risks and the conditions under which it will be stopped. Then review the portfolio on a fixed cadence and move money towards the bets that are producing evidence."
appliesWhen:
  - "Management is asking the board to approve an AI budget or programme"
  - "The board is under pressure to 'have an AI strategy' and wants to avoid spending for its own sake"
  - "AI spending is already happening across teams with no shared view of results"
alternatives:
  - "If no specific workflows have been identified, approve a small discovery budget rather than a programme"
  - "If existing licences are under-used, ask for activation before new spending"
  - "If risk appetite is unclear, settle that before approving any customer-facing use"
offer: "ai-opportunity-sprint"
tool: "workflow-economics"
relatedChapters:
  - "future-proofing-your-organization-thriving-ai-driven-future"
  - "genai-security-and-compliance-safeguarding-innovation-ai-era"
  - "agents-security-governance"
relatedPosts:
  - "generative-ai-roi-measurement"
  - "eu-ai-act-compliance-guide"
weight: 9
date: 2026-10-08
reviewed: 2026-10-08
tags: ["AI governance", "board oversight", "AI investment", "AI strategy", "leadership"]
---

## Why "what's our AI strategy?" is the wrong first question

Boards are often asked to approve "an AI strategy" or "an AI programme". These are hard to oversee because they're hard to falsify. A programme can always claim progress: licences rolled out, pilots started, staff trained. None of that shows whether the organisation is better off.

A more useful view treats AI as a **portfolio of workflow bets**. Each bet is a specific change to a specific piece of work, with an owner, a cost, an expected result, and a point at which it will be stopped if the result doesn't appear. The board's job is then familiar: test the logic of each bet, keep the portfolio balanced, and move money towards what's working.

This also makes it legitimate to say no. A bet that loses to a simpler alternative isn't a failure of ambition. It's the oversight working.

## Options the board should expect to see

For each proposed workflow, management should show that it considered:

- **Doing nothing**, and what that costs.
- **Process redesign** or **existing software**, including AI features in licences already held.
- **Ordinary automation**, where the work is predictable.
- **A bought product** or an **AI-assisted workflow built in-house or by a supplier**.
- **A custom agent**, only where the work genuinely needs systems that act with some autonomy.

If the paper jumps straight to the most advanced option, ask why the cheaper ones were rejected. See [buy, build, configure or do nothing](/guides/buy-build-configure-or-do-nothing/).

## Questions to ask

### About value
- Which specific workflows will change, and who owns each one?
- What is the measured current cost of each, and who agreed the baseline?
- How much of the benefit is cash removed, and how much is time released? Where does the released time go? See [hours released are not cash saved](/guides/ai-roi-hours-are-not-cash/).
- What does the case look like in the low scenario?

### About cost
- What are the recurring costs — licences, usage, review time, support, oversight — not just the set-up cost?
- What would it cost to leave a supplier or platform if we needed to?

### About risk
- What information will each workflow use, and is that permitted?
- Where could an error reach a customer, a regulator or the accounts, and what human check stands in the way?
- Does any system take actions on its own? Who approves them? See [designing human approval for AI agents](/guides/agent-human-approval-design/).
- Which obligations apply in the jurisdictions where we operate, and who has confirmed that?

### About delivery
- What evidence will we see, and when, that shows the bet is working?
- What are the stopping conditions, and who has the authority to stop?
- What happened to previous pilots? See [why AI pilots stall](/guides/why-ai-pilots-stall/).

## An investment memo outline

Ask management to bring each bet, or a group of small ones, in a consistent format:

| Section | Contents |
|---|---|
| **Workflow and owner** | What changes, who is accountable |
| **Baseline** | Current volume, effort, quality and cost, with the source |
| **Options considered** | Including doing nothing and existing software, with reasons for rejection |
| **Economics** | Cash removed, time released and its destination, recurring costs, payback across low, base and high cases |
| **Risks and controls** | Information, errors, autonomy, supplier dependence, and the control for each |
| **Evidence plan** | What will be measured, when, and the acceptance threshold |
| **Stopping conditions** | The results that would trigger a pause or exit |
| **Decision requested** | Amount, stage, and the next point of review |

Funding in stages works well: a small amount to prove or disprove the bet, then a larger amount only once the evidence plan has delivered.

## Governance cadence

- **Quarterly:** a single portfolio view showing each bet, its stage, the evidence so far, and spend against plan. Stop, continue or scale decisions are taken here.
- **At each stage gate:** the owner presents results against the acceptance threshold set at approval, not a new one.
- **Annually:** review risk appetite, policy on information use, and whether the balance of the portfolio still fits the strategy.
- **By exception:** any incident involving information, a customer-facing error or an autonomous action is reported promptly with the response taken.

Keep the reporting about outcomes. Licence counts and training completions are inputs. See [measuring AI adoption and retiring workflows](/guides/measuring-ai-adoption-and-retiring-workflows/).

## What to check before committing budget

- Each bet names a workflow and an accountable owner, not a department or a technology.
- Baselines have been measured and agreed by the people who do the work.
- Cash and time are shown separately, with recurring costs included.
- Simpler alternatives were considered and rejected for stated reasons.
- Risks are listed with controls, and someone has checked the obligations that apply.
- Stopping conditions are written into the approval, with authority to act on them.
- The first tranche of funding is sized to produce evidence, not to complete the programme.

## Worked example (illustrative)

*This is a hypothetical example, not a client result.*

A mid-sized insurer's executive team asks the board to approve a broad AI programme. The board asks instead for a portfolio of specific bets in the memo format above.

Management returns with five. The board approves three for a first stage: drafting claim-file summaries for handlers, with human review; activating AI features in existing office licences for underwriting support teams; and automating a reconciliation report with ordinary rules-based automation, which needs no AI. It defers a customer-facing chatbot until risk appetite for unsupervised customer communication has been agreed. It declines a fifth bet because its benefit was entirely released time with no stated destination.

Each approved bet carries a stopping condition and a review date. At the next quarterly review, one bet is stopped because review time didn't fall as planned, and its remaining budget moves to the one that met its threshold early.

## Next step

Ask for each bet to be modelled with the [Workflow Economics Calculator](/tools/workflow-economics/), so cash, time and recurring costs are shown the same way across the portfolio. If the executive team needs the shortlist, baselines and recommendation built from scratch, the [AI Opportunity Sprint](/work-with-us/ai-opportunity-sprint/) does that, and can be scoped to include an executive decision workshop at the end. For choosing the first bet, see [where to start with AI](/guides/where-to-start-with-ai/).
