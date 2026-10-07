---
title: "How to automate recurring client reports and packs (and check AI-written summaries)"
seoTitle: "Automating recurring client reports and checking AI summaries"
description: "Split report automation into data assembly, narrative drafting and review, trace every figure to source, and check AI-written summaries before release."
slug: "automate-recurring-client-reports"
kind: "workflow"
cluster: "reports-packs"
question: "Can we use AI to produce our monthly client reports and packs, and how do we know the summaries are right?"
answer: "Automate the figures with ordinary tools — queries, templates and BI — and use a language model only to draft the narrative from those figures. Every number in the final pack must trace back to a source, and a named person checks the AI-written commentary for figure accuracy, unsupported claims and tone before it goes to a client."
appliesWhen:
  - "You produce the same report or pack for clients every week, month or quarter"
  - "Analysts spend most of the time assembling figures and writing similar commentary each cycle"
  - "Errors in a client report would be embarrassing, costly or contractually significant"
alternatives:
  - "If the report is pure figures with no commentary, BI or template automation alone is enough"
  - "If source data is unreliable or manually keyed, fix the data before automating anything"
  - "If each report is genuinely bespoke analysis, use AI only for formatting and first-draft prose, not end-to-end"
offer: "workflow-implementation"
tool: "workflow-scorecard"
relatedChapters:
  - "structuring-data-for-genai-foundation-ai-driven-innovation"
  - "crafting-success-building-internal-genai-use-cases"
relatedPosts:
  - "generative-ai-data-pipeline-architecture"
weight: 11
date: 2026-10-08
reviewed: 2026-10-08
tags: ["report automation", "client reporting", "AI summaries", "quality assurance", "data traceability"]
---

## The workflow and its real cost

A recurring client report usually looks like one task but is really three:

1. **Data assembly:** pulling figures from finance, CRM, operational or analytics systems, reconciling them, and dropping them into tables and charts.
2. **Narrative:** writing the commentary — what changed, why, and what it means for the client.
3. **Review and release:** checking the figures and the words, getting sign-off and sending the pack.

The cost is rarely just the analyst's time. It includes the senior reviewer who rereads every pack, the rework when a figure doesn't match last month's, the delay when a key person is away, and the occasional error that reaches a client. Before estimating any value, gather: how many reports per cycle, hours per report split across the three stages, who reviews, how often errors are found (and at which stage), and what information each report contains.

## Options

| Option | Best for | Limits |
|---|---|---|
| **Existing tools** (spreadsheet templates, BI dashboards, mail merge) | Standard figures, consistent layouts | Doesn't write commentary |
| **Deterministic automation** (scheduled queries, scripts, template filling) | The data assembly stage, almost always | Brittle if source systems change without notice |
| **AI-assisted narrative with review** | Commentary that follows a pattern but varies with the figures | Can misstate numbers or invent explanations; needs a checking step |
| **Don't automate** | Highly bespoke, low-volume, high-judgement reports | You keep the current cost, but avoid the risk |

The common mistake is asking a language model to do all three stages at once: read the raw data, calculate, and write. That puts arithmetic and data handling where they are least reliable. Keep the figures deterministic and let the model work from figures that have already been calculated and checked.

## The redesigned workflow, step by step

### 1. Assemble the data deterministically

Use scheduled queries, BI extracts or scripts to produce a single, structured dataset per client per cycle. Every figure carries its source: system, query or report name, and extract date. Run reconciliation checks here — totals that must match, period-on-period movements outside expected ranges, missing values.

**Review point:** an analyst confirms the reconciliation checks passed before anything else happens.

### 2. Fill the template

Tables and charts are generated from the dataset by the template, not typed by hand and not produced by the model.

### 3. Draft the narrative from the checked figures

Give the model the structured dataset, last cycle's approved commentary, a style guide and clear instructions: only refer to figures provided, flag anything unexplained rather than guessing a cause, and keep to the agreed length and tone. Where explanations depend on context the data doesn't contain — a client's reorganisation, a known outage — the analyst adds notes for the model to use.

Confidentiality matters here. Each client's data should only ever be processed with that client's data, using a tool and account approved for that class of information. Don't build prompts that pull in other clients' reports as examples.

### 4. Check the AI-written summary

**Review point:** a named person checks every draft against three tests:

- **Figure reconciliation:** every number in the prose matches the dataset exactly, including units, periods and direction of change.
- **Claim-to-source:** every explanation or causal statement is supported by the data or by the analyst's notes. Anything else is removed or confirmed.
- **Tone and commitments:** nothing over-promises, apologises for the wrong thing, or creates an obligation the firm hasn't agreed.

A simple automated pre-check helps: extract the numbers from the draft and compare them with the dataset, flagging mismatches for the reviewer. It doesn't replace the human check.

### 5. Approve and release

**Review point:** the account owner signs off and the pack is sent through the usual channel. Keep the dataset, the draft, the reviewer's edits and the final version together, so any figure can be traced later.

## What to check and measure

- [ ] Every figure in the final pack traces to a named source and extract date.
- [ ] Reconciliation checks run on every cycle, and failures stop the process.
- [ ] Review time per report, before and after. If checking the narrative takes as long as writing it, the drafting step isn't helping.
- [ ] Errors found at review, and errors found by clients, tracked separately.
- [ ] Share of AI-drafted narrative kept with only minor edits.
- [ ] Client data is processed only in approved tools and never mixed between clients.
- [ ] A named owner maintains the queries, template and prompt when source systems or report formats change.

## Worked example (illustrative)

*This is a hypothetical example, not a client result.*

An agency sends 40 monthly performance packs. Each takes an analyst most of a day: half on pulling and pasting figures, half on commentary, followed by an account director's review.

The agency first automates data assembly: scheduled extracts feed a dataset per client, with reconciliation checks and source references. The template builds the tables and charts. That alone removes most of the copy-and-paste work and the errors it caused.

It then adds narrative drafting. The model receives the checked dataset, last month's approved commentary and the analyst's notes. A pre-check flags any number in the draft that doesn't appear in the dataset. In the first cycles, reviewers find the model sometimes attributes changes to causes not in the notes, so the instructions are tightened to require flagging rather than explaining. The account director's review stays in place throughout.

## Next step

Score your reporting workflow with the [Workflow Opportunity Scorecard](/tools/workflow-scorecard/) to see whether the narrative stage is worth automating or the data stage is enough. If you want the data pipeline, templates, drafting and review checks built and handed over, that's what [Workflow Implementation](/work-with-us/workflow-implementation/) is for.
