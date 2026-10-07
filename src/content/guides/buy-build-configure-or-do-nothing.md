---
title: "Should we buy, build, configure or do nothing about AI?"
description: "A seven-rung options ladder from doing nothing to a custom agent, the criteria that decide between them, and when custom AI is simply unnecessary."
slug: "buy-build-configure-or-do-nothing"
kind: "decision"
cluster: "buy-vs-build"
question: "For this workflow, should we buy an AI product, build something, use what we already have, or leave it alone?"
answer: "Work up a ladder of options and stop at the lowest rung that meets the need: do nothing, redesign the process, configure software you already own, add ordinary automation, buy a specialist product, build an AI-assisted workflow on a platform, and only then commission a custom agent. Each rung costs more to run and maintain, so the burden of proof rises with it."
appliesWhen:
  - "A supplier is proposing a custom AI build and you want to know whether it's justified"
  - "You already pay for software with AI features but haven't checked whether they cover the need"
  - "Several teams want different tools for similar problems"
alternatives:
  - "If the workflow is rare or low-value, doing nothing is a legitimate decision — record it and move on"
  - "If the steps are identical every time, use ordinary automation rather than generative AI"
  - "If you can't yet describe the workflow precisely, fix that before choosing any option"
offer: "ai-opportunity-sprint"
tool: "workflow-scorecard"
relatedChapters:
  - "harnessing-power-existing-genai-tools-practical-guide-businesses"
  - "crafting-success-building-internal-genai-use-cases"
  - "from-genai-to-agentic-ai"
relatedPosts:
  - "generative-ai-implementation-guide-2026"
  - "multi-agent-systems-when-to-use"
weight: 3
date: 2026-10-08
reviewed: 2026-10-08
tags: ["buy vs build", "AI strategy", "automation", "AI agents", "procurement"]
---

## Why "buy or build?" is too narrow

"Buy or build?" assumes the answer involves new AI. Often it doesn't. A problem described as "we need AI for this" is frequently a process problem, a data problem, or a feature you already pay for but haven't switched on.

A better framing is a ladder. Start at the bottom and climb only when the rung below genuinely can't meet the need. Each step up usually brings higher set-up cost, more ongoing maintenance, more risk to manage and more dependence on specialist skills. None of those are reasons to refuse a higher rung. They are reasons to require evidence before reaching it.

## The options ladder

1. **Do nothing.** Accept the current cost. This is right when the workflow is rare, cheap, or about to change for other reasons. Write the decision down so it isn't relitigated every quarter.
2. **Redesign the process.** Remove steps, standardise inputs, change who does what, or stop producing an output nobody reads. This is often the largest and cheapest win, and it makes every later option easier.
3. **Configure existing software.** Your CRM, document platform, service desk or office suite may already have the feature, including AI features covered by licences you hold. Configuration and templates cost staff time, not new contracts.
4. **Deterministic automation.** Rules, scripts, integrations or workflow tools that do the same thing every time. Cheap to run, easy to test and predictable. Best when inputs are structured and the steps don't vary.
5. **Buy a specialist product.** A vendor tool built for this kind of work in your sector. You get the vendor's product development, but also their roadmap, pricing and data terms.
6. **AI-assisted workflow on a platform.** A bounded workflow built on a general AI platform or your existing cloud: your templates, your information, your review step. More fitted than a product, but you own the upkeep.
7. **Custom agent.** A system that plans and takes multi-step actions across tools with some autonomy. Powerful where the work genuinely requires it. Also the hardest to test, secure and support.

## Decision criteria

| Criterion | Points down the ladder | Points up the ladder |
|---|---|---|
| **Variation in inputs** | Structured, predictable, same every time | Free text, documents, varied requests |
| **Judgement required** | Fixed rules can express it | Requires reading, summarising or drafting |
| **Volume and value** | Low frequency or low cost per run | High frequency, high effort, many people |
| **Existing tools** | Current software already does most of it | No current tool covers it |
| **Differentiation** | Common task; others solve it the same way | Specific to how you compete or serve clients |
| **Error tolerance** | Mistakes are costly and hard to spot | Outputs are easy to check before use |
| **Ownership and skills** | No one to maintain a bespoke system | A named owner and access to engineering skills |
| **Actions taken** | Output is read by a person | System must act in other tools — and you can design approvals for that |

No single row decides. But if most rows point down, a higher rung needs an unusually strong reason.

## When custom AI is unnecessary

Custom AI is usually the wrong answer when:

- **A feature you already own does 80% of the job.** The last 20% rarely justifies a separate system. Change the process to fit the tool instead.
- **The task is deterministic.** If you can write the rules down, a rules engine or integration will be cheaper, faster and easier to audit than a model.
- **The real problem is information.** If the source documents are outdated, duplicated or inaccessible, a custom assistant will repeat their faults confidently. Fix the content first. See [why internal knowledge assistants give bad answers](/guides/internal-knowledge-assistant-bad-answers/).
- **Nobody will own it.** A bespoke system without an owner decays when models, prompts or integrations change.
- **The output is rarely used.** Automating a report nobody reads still costs money.
- **"Agent" is being used to mean "workflow".** Many proposals described as agents are fixed sequences of steps. Build them as fixed sequences. Keep autonomy for cases where the path genuinely can't be known in advance, and pair it with [human approval design](/guides/agent-human-approval-design/).

## What to check before committing budget

- The workflow is described precisely: inputs, steps, outputs, frequency, owner, and how quality is checked.
- Lower rungs have been considered and costed, with reasons recorded for rejecting each one.
- Existing licences and features have been checked by someone who knows the systems, not assumed absent.
- The economics of the chosen rung include running and maintenance costs. See [how to calculate AI ROI honestly](/guides/ai-roi-hours-are-not-cash/).
- There is a named owner for the solution after it goes live, not just during the project.
- For rungs 5–7, you know how you'll evaluate quality on your own examples. See [how to evaluate AI tools for your workflow](/guides/evaluate-ai-tools-for-your-workflow/).
- You know what you'd need to see in order to step back down the ladder.

## Worked example (illustrative)

*This is a hypothetical example, not a client result.*

A distribution business's customer service team spends a lot of time answering "where is my order?" emails. A supplier proposes a custom AI agent that reads each email, looks up the order, and replies.

Working up the ladder tells a different story:

- **Process redesign:** most of these emails arrive because dispatch notifications don't include a tracking link. Adding one is expected to cut the volume noticeably.
- **Existing software:** the service desk already supports auto-categorisation and templated replies with order fields merged in.
- **Deterministic automation:** a simple integration can look up order status from the email's order reference and fill the template. Nothing about this needs generative AI.

What is left are the less common emails: complaints, mixed requests, and messages without an order reference. For these, the team turns on the drafting feature in its existing service desk, with an agent reviewing every reply before it goes out. The custom agent is not commissioned. The business records the decision and a trigger for revisiting it: if the remaining unstructured volume grows significantly, it will look at the question again.

## Next step

Score the workflow with the [Workflow Opportunity Scorecard](/tools/workflow-scorecard/). Its recommended approach can be "no AI needed", and that's a useful result. If you'd like the options costed side by side for several workflows, with a recommendation you can take to a sponsor, that's what the [AI Opportunity Sprint](/work-with-us/ai-opportunity-sprint/) does. If the answer is "use what we already own", see [improving Copilot and ChatGPT adoption in your team](/guides/improve-copilot-chatgpt-team-adoption/).
