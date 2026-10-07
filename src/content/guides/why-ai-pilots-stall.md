---
title: "Why AI pilots stall — and what production-ready actually requires"
description: "The common reasons AI pilots never reach production, a production-readiness checklist, and how to decide go, fix-then-go or stop."
slug: "why-ai-pilots-stall"
kind: "decision"
cluster: "beyond-pilot"
question: "Our AI pilot looked promising. Why hasn't it gone into production, and what would it take?"
answer: "Most pilots stall because they were set up to demonstrate a tool rather than to pass a decision: no agreed acceptance threshold, no evaluation set, no owner for running it, and unresolved data, integration or security questions. Review the pilot against a production-readiness checklist, then make an explicit go, fix-then-go or stop decision."
appliesWhen:
  - "A pilot has run for months and nobody can say whether it passed"
  - "Users liked the demo but adoption dropped once the novelty wore off"
  - "Security, IT or finance is blocking rollout and the pilot team doesn't know what they need"
alternatives:
  - "If the pilot never had a clear workflow or owner, restart from workflow selection rather than patching it"
  - "If the economics don't hold at scale, stop and record why — that is a valid result"
  - "If only one blocker remains, fix that specific gap instead of running a second pilot"
offer: "pilot-readiness-review"
relatedChapters:
  - "agents-evals-observability"
  - "deploying-agents-in-production"
  - "crafting-success-building-internal-genai-use-cases"
relatedPosts:
  - "deploying-ai-agents-production-checklist"
weight: 8
date: 2026-10-08
reviewed: 2026-10-08
tags: ["AI pilots", "production readiness", "AI evaluation", "AI governance", "AI adoption"]
---

## A pilot is a decision, not a demo

A pilot exists to answer one question: **should we run this workflow this way, at this scale, under these conditions?** Many pilots are set up to answer a different question — "can the tool do something useful?" — and the answer to that is almost always yes. So the pilot ends with enthusiasm and no decision.

Stalled pilots usually share a pattern. Nobody wrote down what "good enough" meant before starting, so nobody can say whether it was met. The people who would have to run, secure and pay for the workflow in production weren't involved until the end, and they arrive with questions the pilot never tried to answer.

## Common blockers

| Blocker | What it looks like | What fixes it |
|---|---|---|
| **No acceptance threshold** | "It's quite good" but no agreed pass mark | A written threshold set with the process owner, such as quality, review time and error tolerance |
| **No evaluation set** | Quality judged on a handful of demos or anecdotes | A fixed set of real cases with expected outputs, re-run after every change |
| **Data access** | Pilot used exported samples; production needs live systems | Agreed access route, permissions and data-flow approval |
| **Integration** | Copy-paste between tools works for five users, not fifty | The workflow wired into the systems people already use |
| **Security sign-off** | Review starts after the pilot and finds open questions | Security involved from the start, with a defined set of controls to check |
| **No owner or support model** | Nobody responsible once the pilot team moves on | A named service owner, a support route and a maintenance plan |
| **Cost at scale** | Pilot costs were small; production usage is unknown | A cost model using real volumes and a monitored budget |
| **Workflow mismatch** | The tool adds a step rather than removing one, so people stop using it | Redesign the workflow around where people already work |

## What production-ready requires

Use this as a checklist. A pilot that can't tick most of it isn't ready, however good the outputs look.

- **Owner.** A named business owner accountable for results, and a service owner responsible for running it.
- **Acceptance threshold.** Written down before the decision, agreed by the owner, and measured.
- **Evaluation set.** Real cases, including awkward ones, with expected outputs. Results recorded per version.
- **Baseline.** The current cost, time or error rate, so improvement can be shown — and translated honestly into value. See [why hours are not cash](/guides/ai-roi-hours-are-not-cash/).
- **Data flow approved.** What information goes where, under which terms. See [Can staff use AI with internal documents?](/guides/staff-ai-internal-documents/)
- **Security controls.** Access, logging, prompt-injection exposure and, for agents, which actions need approval. See [what should require human approval for AI agents](/guides/agent-human-approval-design/).
- **Integration.** The workflow runs inside the tools people use, without manual copying.
- **Monitoring.** Quality, usage, cost and errors tracked after launch, with someone looking at them.
- **Support and change.** A route for users to report problems, a plan for model or vendor changes, and training for new staff.
- **Cost at scale.** Expected monthly cost at real volumes, with a ceiling and an alert.
- **Exit.** What happens if you stop: data deletion, fallback process, contract terms.

## Go, fix-then-go, or stop

At the end of a review, make one of three decisions and write it down:

- **Go.** The threshold is met, the checklist is substantially complete, and the remaining gaps have owners and dates.
- **Fix-then-go.** The workflow works, but specific gaps block production — for example, no evaluation set or no security sign-off. List those gaps, fix them, and re-check against the same criteria. Don't run a second open-ended pilot.
- **Stop.** The threshold isn't met and there's no credible fix, or the economics don't work at scale. Record why. A clean stop frees budget and makes the next proposal more credible.

The worst outcome is no decision: the pilot carries on in limbo, a few enthusiasts keep using it, and nobody owns it.

## Worked example (illustrative)

*This is a hypothetical example, not a client result.*

A logistics company pilots an AI assistant that drafts responses to carrier disputes. After four months, the operations team says it "saves time", but rollout is blocked.

A review finds three gaps. There was no acceptance threshold, so the team agrees one: most drafts need only minor edits, and review takes less time than writing from scratch. There was no evaluation set, so they build one from recent disputes with the replies that were actually sent. And security had never reviewed the data flow, because the pilot used a personal account.

The evaluation shows the drafts meet the threshold for routine disputes but not for disputes involving damage claims. The decision is fix-then-go: move to the company's business-tier account, limit scope to routine disputes, name a service owner, and re-check in six weeks.

## Next step

If the pilot's original workflow choice is the problem, start again with [Where should our business start with AI?](/guides/where-to-start-with-ai/) and the [Workflow Opportunity Scorecard](/tools/workflow-scorecard/). If you want an independent check of a pilot against this checklist, with a clear go, fix-then-go or stop recommendation, that is what the [Pilot Readiness Review](/work-with-us/pilot-readiness-review/) does. If the answer is go, the [Workflow Implementation](/work-with-us/workflow-implementation/) engagement covers the build into production.
