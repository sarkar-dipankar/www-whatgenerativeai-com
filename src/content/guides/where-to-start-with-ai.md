---
title: "Where should our business start with AI?"
description: "How to choose the first workflow worth changing with AI: a selection method, the scoring criteria, the traps to avoid, and what a credible first project looks like."
slug: "where-to-start-with-ai"
kind: "decision"
cluster: "choose-start"
question: "We've been told to adopt AI. Which workflow should we start with?"
answer: "Start with one recurring workflow that has a named owner, a measurable current cost, outputs a person can check quickly, and information you are allowed to use. Rank a handful of candidates on value, feasibility, risk and readiness, then pick the one you can prove or disprove within a quarter — even if it isn't the biggest prize."
appliesWhen:
  - "Leadership wants AI adoption but nobody has chosen a specific workflow"
  - "You have several candidate ideas and no way to compare them"
  - "You need a first project that builds credibility rather than a moonshot"
alternatives:
  - "If a single painful process is already obvious, skip ranking and go straight to its economics"
  - "If staff already have AI licences, start by activating those before buying anything"
  - "If no one will own the change, fix ownership first — no tool fixes that"
offer: "ai-opportunity-sprint"
tool: "workflow-scorecard"
relatedChapters:
  - "crafting-success-building-internal-genai-use-cases"
  - "revolutionizing-business-functions-departmental-genai-integration"
  - "understanding-limitations-where-genai-falls-short"
relatedPosts:
  - "generative-ai-automation-use-cases"
  - "generative-ai-implementation-guide-2026"
weight: 1
date: 2026-10-08
reviewed: 2026-10-08
tags: ["AI strategy", "AI use cases", "opportunity selection", "AI adoption"]
---

## Why "where do we start?" is the wrong first question

Most organisations ask where to start with *AI*. The better question is which *workflow* deserves attention. AI is one possible intervention. Others are a process redesign, a feature in software you already own, ordinary automation, or doing nothing.

A workflow is a good unit because it has:

- **an owner**, who can say yes and is accountable for the result
- **a current cost** you can measure: time, errors, delay or missed revenue
- **inputs and outputs**, so you can see what information is involved and how quality is checked
- **a frequency**, which tells you whether a small improvement adds up to something worth paying for

"Use AI in marketing" has none of these. "Draft the first version of the monthly campaign performance summary, which takes two analysts a day each month" has all four.

## A selection method that fits in a week

1. **Collect candidates.** Ask four to eight process owners for the recurring tasks that take the most time or cause the most rework. Accept anything; filter later.
2. **Describe each one the same way.** Cover what it does, how often it runs, the effort per run, who does it, what information it uses, how the output is checked, and what happens if it's wrong.
3. **Score them on four dimensions** (below). Use the [Workflow Opportunity Scorecard](/tools/workflow-scorecard/) if you want the weights done for you.
4. **Check the top three with their owners.** Confirm the numbers, and ask whether each owner wants the change.
5. **Pick one,** and write down why the runners-up lost. You'll come back to them.

## The four dimensions

| Dimension | What raises it | What lowers it |
|---|---|---|
| **Value** | High frequency, high effort per run, many people involved, visible impact on customers or revenue | Rare, quick or low-stakes tasks |
| **Feasibility** | Digital, accessible inputs; outputs a person can check quickly; some variation that rules-based automation handles badly | Scattered or paper inputs; outputs nobody can verify; tacit judgement |
| **Risk** (higher = safer) | Errors are minor and caught; information is internal; AI drafts and a person decides | Client-facing, regulated or financial consequences; personal data; autonomous actions |
| **Readiness** | Named owner with budget; existing licensed tools; a known baseline | No owner; no baseline; nobody available to change the process |

Weight value most heavily, but don't let it override readiness. A high-value workflow with no owner is a slide in a deck, not a project.

## Traps that waste the first project

- **Choosing the most impressive idea.** The first project's job is to prove the method and build trust. A modest workflow that ships is worth more than an ambitious one that stalls.
- **Picking a workflow where errors are invisible.** If no one can tell whether the output is right, you can't evaluate it, approve it or improve it.
- **Starting with a tool.** "We bought X, what should we use it for?" leads to forced use cases. Start from the work, then check whether existing tools already cover it.
- **Assuming deterministic tasks need generative AI.** If the steps are identical every time and the inputs are structured, ordinary automation is usually cheaper and more reliable.
- **Counting hours as cash.** Released time only becomes a saving if it reduces overtime, avoids a hire or turns into extra output. See [how to calculate AI ROI honestly](/guides/ai-roi-hours-are-not-cash/).

## What to check before committing budget

- The owner agrees with the baseline numbers and wants the change.
- The information involved may be used with the intended tool. If in doubt, see [Can staff use AI with internal documents?](/guides/staff-ai-internal-documents/)
- A person will review outputs, and you know how long that review will take.
- There is a defined acceptance threshold. For example: "90% of drafts need only minor edits, and review takes 15 minutes or less."
- You know what would make you stop.

## Worked example (illustrative)

*This is a hypothetical example, not a client result.*

A 200-person professional-services firm collects six candidates. Two stand out:

- **Client onboarding pack:** 30 a month, about 3 hours each. Inputs come from the CRM and a template library. An account manager reviews each one.
- **Proposal responses:** 8 a month, about 12 hours each. Inputs are scattered across old proposals, and the work involves a lot of judgement.

Proposals look like the bigger prize. But the onboarding pack scores higher on feasibility and readiness: the inputs are structured, the owner is named, and outputs are easy to check. The firm starts there and reaches acceptance in six weeks. It then uses that evidence to fund the harder proposal workflow, starting with the information clean-up that workflow needs.

## Next step

Score your top candidate with the [Workflow Opportunity Scorecard](/tools/workflow-scorecard/). It takes about five minutes and the result is yours to keep. If you need the shortlist, the economics and the recommendation done with your team, that's what the [AI Opportunity Sprint](/work-with-us/ai-opportunity-sprint/) is for.
