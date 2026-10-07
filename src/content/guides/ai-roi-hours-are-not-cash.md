---
title: "How to calculate AI ROI honestly: hours released are not cash saved"
seoTitle: "AI ROI done honestly: hours released are not cash saved"
description: "Separate time released from cash removed, count the running costs people forget, test the case across a range, and set payback and stopping conditions."
slug: "ai-roi-hours-are-not-cash"
kind: "decision"
cluster: "establish-value"
question: "How do we work out whether an AI workflow will actually pay for itself?"
answer: "Count hours released separately from cash removed: time only becomes money if it cuts overtime, avoids a hire or contractor, or turns into output someone will pay for. Subtract the ongoing costs — review time, licences, support and change management — then test the result across low, base and high cases and agree in advance what would make you stop."
appliesWhen:
  - "A business case quotes hours saved and converts them straight into salary savings"
  - "Finance has asked for payback before approving an AI workflow"
  - "You need to compare an AI option against cheaper alternatives on equal terms"
alternatives:
  - "If the benefit is quality or speed rather than cost, value it as such and say so plainly"
  - "If the numbers only work in the high case, treat it as an experiment with a small, capped budget"
  - "If you can't measure the current effort, measure that first — a baseline is cheaper than a guess"
offer: "ai-opportunity-sprint"
tool: "workflow-economics"
relatedChapters:
  - "crafting-success-building-internal-genai-use-cases"
  - "harnessing-power-existing-genai-tools-practical-guide-businesses"
relatedPosts:
  - "generative-ai-roi-measurement"
weight: 2
date: 2026-10-08
reviewed: 2026-10-08
tags: ["AI ROI", "business case", "payback", "AI economics", "finance"]
---

## Why "hours saved" is not a business case

Most AI business cases follow the same arithmetic: hours saved per task, multiplied by volume, multiplied by an hourly salary cost. The result looks like money. It usually isn't.

Salaries are paid whether or not the hours are freed. If a team finishes the monthly report in two days instead of four, payroll does not change. The organisation now has two days of capacity it didn't have before. That capacity has value only if something happens to it.

So an honest calculation keeps five things apart:

- **Time released:** the effort no longer needed per run, after allowing for review.
- **Cash removed:** money that genuinely stops being spent.
- **Quality:** fewer errors, less rework, more consistent outputs.
- **Extra output:** more work done with the same people, which matters only if there is demand for it.
- **Ongoing cost:** what you pay every month to keep the new workflow running.

Finance will trust a modest case built this way more than a large one built on salary multiplication.

## What happens to released capacity

Before you put a value on released hours, name where they go. Each destination has a different value, and some have none.

| Where the time goes | Does it become cash? | What evidence you need |
|---|---|---|
| **Overtime no longer paid** | Yes, directly | Current overtime records for the people doing the work |
| **Hire avoided** | Yes, if the hire was genuinely planned | An approved or budgeted vacancy that will now not be filled |
| **Contractor or agency spend cut** | Yes, directly | Current invoices and a decision to reduce them |
| **More throughput** | Only if extra output is sold or needed | A backlog, waiting list or turned-away work |
| **Better service or faster turnaround** | Indirectly, and hard to price | A link to retention, conversion or penalties avoided |
| **Absorbed into the day** | No — value it at zero | None; this is the default if nobody plans otherwise |

The last row is the most common outcome and the one business cases leave out. If no one decides what the released time is for, it disappears into meetings and email. Value it at zero unless an owner commits to something else.

## The ongoing costs people forget

The licence fee is rarely the largest running cost. Include:

- **Review time.** Someone has to check every output that matters. If a draft takes 10 minutes to generate and 25 minutes to verify, the saving is smaller than the demo suggested.
- **Licences and usage.** Per-seat fees, usage-based charges at your real volume, and any premium tier needed for admin or data controls.
- **Support and maintenance.** Prompt and template updates, integration fixes, re-testing after the vendor changes the model, and someone to answer staff questions.
- **Change management.** Training, revised procedures and the dip in productivity while people learn.
- **Oversight.** Time spent on access reviews, logging, information governance and periodic evaluation.

Set one-off costs (set-up, integration, training) against payback. Treat recurring costs as a deduction from annual value, every year.

## Ranges, not a single number

Every input in an AI business case is uncertain: the time per run after review, the share of outputs that need heavy correction, adoption, and what happens to released capacity. Model three cases rather than one.

- **Low:** cautious adoption, longer review, and only firm cash destinations counted.
- **Base:** your best estimate, agreed with the process owner.
- **High:** strong adoption and short review, but still with released time valued honestly.

If the case only works in the high scenario, it is an experiment, not an investment. Fund it as one: small, time-boxed, with a clear test.

Payback is simply one-off cost divided by net annual value (cash removed plus any value you can defend, minus running costs). Express it in months for each case. A wide spread between low and high payback tells you which assumption to test first.

## What to check before committing budget

- The baseline effort per run has been measured on real work, not estimated in a workshop.
- Review time has been measured or realistically estimated, and is included.
- Each hour counted as cash has a named destination from the table above, with an owner.
- Running costs are priced at your real volume, not the vendor's example.
- One-off costs include integration, training and the people time to change the process.
- Low, base and high cases have been modelled, and the decision still makes sense in the low case — or the budget is capped as an experiment.
- Stopping conditions are written down. For example: "If review time is still above 20 minutes per item after eight weeks, we stop."
- Simpler alternatives — process redesign, existing software, ordinary automation — have been costed on the same basis. See [buy, build, configure or do nothing](/guides/buy-build-configure-or-do-nothing/).

## Worked example (illustrative)

*This is a hypothetical example, not a client result.*

A finance operations team of six prepares supplier query responses. They handle about 400 a month, each taking around 30 minutes, which comes to 200 hours a month.

An AI-assisted drafting workflow is proposed. In a trial on 50 past queries, drafting time falls to about 5 minutes, but review takes about 12 minutes. The time per query is therefore about 17 minutes, not 5. Hours released come to roughly 87 a month, not the 167 the vendor demo implied.

Where does that time go? The team currently pays around 30 hours of overtime a month, and has an approved but unfilled part-time vacancy. The sponsor agrees to remove the overtime and not fill the vacancy. Those two items become the cash case. The remaining released time is valued at zero for now, though the team lead plans to use it to clear an ageing query backlog.

Against that, the team adds licence costs, a few hours a month of template maintenance, and a one-off cost for integration and training. In the base case, payback is inside a year. In the low case, where review takes 18 minutes and the vacancy is filled after all, payback stretches to nearly two years. The sponsor approves the work, but sets a stopping condition: if review time hasn't fallen below 15 minutes after two months, the workflow is paused and reassessed.

Every figure here is an adjustable assumption. The useful output is not the number. It is knowing which assumption — review time — the decision depends on.

## Next step

Put your own figures into the [Workflow Economics Calculator](/tools/workflow-economics/). It keeps hours released apart from cash removed, adds running costs, and shows payback across low, base and high cases. If you need baseline measurement and the economics for several candidate workflows done with your team, that is part of the [AI Opportunity Sprint](/work-with-us/ai-opportunity-sprint/). For choosing which workflow to model first, see [where to start with AI](/guides/where-to-start-with-ai/).
