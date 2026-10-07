---
title: "How to measure AI adoption — and when to retire an AI workflow"
description: "A workflow health review for AI in production: usage, quality, review effort, incidents, cost and maintenance, plus clear criteria to keep, extend or retire."
slug: "measuring-ai-adoption-and-retiring-workflows"
kind: "workflow"
cluster: "maintain-value"
question: "Our AI workflows are live. How do we know they're still worth running, and when should we switch one off?"
answer: "Give each AI workflow a named service owner and review its health on a fixed cadence: use on the intended workflow, quality against a re-run evaluation set, review effort, incidents, cost per run and maintenance burden. Keep, extend or retire it against criteria agreed in advance, not on enthusiasm or habit."
appliesWhen:
  - "One or more AI workflows are in live use and nobody formally reviews them"
  - "A model, vendor or pricing change is coming and you don't know what it will affect"
  - "Leadership asks whether AI spend is still justified and the only evidence is login counts"
alternatives:
  - "If nothing is live yet, measure readiness and baseline first — see why AI pilots stall"
  - "If a workflow is used rarely and costs almost nothing, a light annual check may be enough"
  - "If the workflow has no owner, assign one before designing any measurement"
offer: "adoption-assurance-retainer"
relatedChapters:
  - "agents-evals-observability"
  - "agents-future"
relatedPosts:
  - "generative-ai-roi-measurement"
weight: 14
date: 2026-10-08
reviewed: 2026-10-08
tags: ["AI adoption metrics", "AI governance", "evaluation", "service ownership", "AI operations"]
---

## The workflow and its real cost

Launching an AI workflow is a project. Running it is a service. Most organisations plan for the first and forget the second.

Once live, an AI workflow drifts. The underlying model is updated or deprecated. Source documents change. The prompt that worked in testing meets cases nobody anticipated. Staff find workarounds, or quietly stop using it. Meanwhile it still costs money: licences or usage charges, review time, and someone's effort keeping it working.

The cost of not measuring is that you can't tell a workflow that is quietly paying its way from one that is quietly failing. Both look the same on a dashboard of logins.

## Options

| Option | When it fits | Limits |
|---|---|---|
| **Usage dashboards only** | Very early, low-risk use | Shows activity, not value or quality |
| **Ad-hoc review when something breaks** | Rarely used, low-stakes workflows | Problems are found by clients or auditors |
| **Scheduled workflow health review** (this guide) | Any workflow in regular use or touching clients, money or personal data | Needs an owner and a small, fixed amount of time each cycle |
| **Retire without review** | The workflow plainly isn't used | Fine — but record why, so the lesson isn't lost |

## The workflow health review, step by step

### 1. Name a service owner

Each AI workflow has one person accountable for whether it is working, what it costs and whether it continues. Usually this is the business owner of the underlying process, supported by whoever maintains the technical side. Without an owner, none of the rest happens.

### 2. Agree the measures at launch

Record these at go-live so later reviews compare like with like:

- **Use on the intended workflow:** how many of the runs that should go through the AI-assisted path actually do, rather than raw logins.
- **Quality:** results from a fixed evaluation set — a few dozen real, representative cases with known good outputs — re-run each review. This is the main way to spot drift after a model or prompt change.
- **Review effort:** time people spend checking and correcting outputs, sampled.
- **Incidents:** errors that reached a client or decision, information-handling breaches, and near misses.
- **Cost per run:** licences, usage charges and review time divided by runs.
- **Maintenance burden:** hours spent on prompts, integrations and content updates.

### 3. Set the cadence

Monthly for the first quarter after launch, then quarterly for stable workflows. Add an unscheduled review whenever a model version, vendor, pricing or source system changes, or after any significant incident.

### 4. Run the review

**Review point:** the service owner looks at the measures against the launch baseline and the previous review, re-runs the evaluation set, and reads a sample of recent outputs. That last step catches problems the numbers miss.

### 5. Assess change impact

When a model or vendor change is announced, re-run the evaluation set on the new version before switching, where you can. Check whether prompts, output formats or costs change. Treat a forced model change as a small re-launch, not a background update.

### 6. Decide: keep, extend or retire

**Review point:** the owner makes and records a decision against criteria agreed in advance.

| Decision | Typical signals |
|---|---|
| **Keep** | Use on the intended workflow is steady; quality holds on the evaluation set; review effort is stable or falling; cost per run is acceptable; no unresolved incidents |
| **Fix, then keep** | Quality has slipped after a change; review effort is rising; a fixable cause is identified |
| **Extend** | The workflow is healthy, other teams have the same task, and the information rules allow reuse |
| **Retire** | Use has fallen away; review effort cancels the time saved; quality can't be restored at reasonable cost; maintenance outweighs value; or the underlying task has changed or disappeared |

Retiring is a success of the review process, not a failure of the workflow. Switch it off cleanly: tell users, restore or document the manual process, remove access and integrations, and write a short note on what was learned.

## What to check and measure

- [ ] Every live AI workflow has a named service owner.
- [ ] Launch baseline and measures are recorded.
- [ ] An evaluation set exists, is kept current, and is re-run each review and after any model change.
- [ ] Use is measured on the intended workflow, not by logins.
- [ ] Review effort and cost per run are tracked, not assumed.
- [ ] Incidents and near misses are logged and reviewed.
- [ ] Each review ends in a recorded keep, fix, extend or retire decision.
- [ ] Released hours are reported honestly — see [why hours are not cash](/guides/ai-roi-hours-are-not-cash/).

## Worked example (illustrative)

*This is a hypothetical example, not a client result.*

A finance team runs three AI-assisted workflows: drafting supplier query responses, summarising monthly variance commentary, and answering staff expense-policy questions.

At the quarterly review, the service owner finds supplier responses healthy: steady use, stable quality on the evaluation set, and falling review time. Variance commentary quality dropped after a vendor model update; re-running the evaluation set shows the new version misreads one table format, and a prompt change fixes it. Expense-policy questions have dwindled since the policy was simplified and moved onto the intranet, and the remaining queries are handled faster by a person.

The owner keeps the first, fixes the second, and retires the third — telling staff, removing the integration and noting that a clearer policy did the job better than an assistant.

## Next step

Start by listing every live AI workflow, its owner and whether it has an evaluation set; the gaps usually show where to begin. If you want an independent, recurring health review of your AI workflows, with maintenance and change impact handled, that's what the [Adoption & Assurance Retainer](/work-with-us/adoption-assurance-retainer/) is for. For the evidence standards behind these reviews, see [our evidence page](/evidence/).
