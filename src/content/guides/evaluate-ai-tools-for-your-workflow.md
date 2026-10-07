---
title: "How to evaluate AI tools for your workflow, not the vendor's demo"
description: "Compare AI products on your own work: build a test set, score it with a rubric, run a proper trial, and separate vendor claims from results."
slug: "evaluate-ai-tools-for-your-workflow"
kind: "decision"
cluster: "compare-products"
question: "How do we choose between AI tools when every vendor demo looks good?"
answer: "Decide what the workflow needs before you look at products, then test each shortlisted tool on a set of real examples from your own work, scored against the same rubric. A good trial measures output quality, review time, data handling, admin controls, integration and cost at your real volume — not how impressive the demo felt."
appliesWhen:
  - "You are comparing two or more AI products for the same workflow"
  - "A vendor has offered an enterprise trial and you want it to produce a decision"
  - "Staff are pushing for a tool they've seen demonstrated and you need a fair test"
alternatives:
  - "If you already hold licences for a capable general tool, test it alongside the specialist products"
  - "If you can't describe what a good output looks like, write that down before trialling anything"
  - "If the workflow is deterministic, compare automation tools instead of AI products"
offer: "ai-opportunity-sprint"
tool: "project-brief"
relatedChapters:
  - "harnessing-power-existing-genai-tools-practical-guide-businesses"
  - "agents-evals-observability"
  - "understanding-limitations-where-genai-falls-short"
relatedPosts:
  - "generative-ai-limitations-where-it-fails"
  - "generative-ai-implementation-guide-2026"
weight: 4
date: 2026-10-08
reviewed: 2026-10-08
tags: ["AI tool evaluation", "AI procurement", "vendor selection", "AI trials", "evaluation"]
---

## Why demos don't answer the question

A vendor demo shows the product working on examples the vendor chose, in a setup the vendor configured, presented by someone who knows how to get the best from it. That tells you the product *can* work. It tells you little about whether it will work on your documents, in your systems, with your staff, at your volume.

Comparing products demo against demo also hides the real question. You aren't choosing the best AI tool. You're choosing the best way to run one particular workflow. Sometimes that's a specialist product, sometimes a general assistant you already license, and sometimes no AI at all.

So turn the evaluation round. Start with what the workflow needs, build a test from your own work, and make every option sit the same test.

## Your options

For most workflows the realistic shortlist includes:

- **Existing software.** Features in tools you already pay for, including general AI assistants such as Microsoft 365 Copilot, ChatGPT Enterprise, Claude or Gemini, if you hold those licences.
- **Specialist products.** Tools built for this kind of work or for your sector.
- **A platform-built workflow.** A bounded workflow on a general AI platform, configured with your templates and information.
- **Doing nothing or redesigning the process.** Keep this as the baseline every option must beat. See [buy, build, configure or do nothing](/guides/buy-build-configure-or-do-nothing/).

Include at least one option you already own. It sets a useful bar: a new product has to be clearly better to justify another contract.

## Build a test set from your own work

Collect 20 to 50 real examples of the workflow, with the inputs each one used and, where possible, the output a person actually produced. Include:

- **typical cases**, which make up most of the volume
- **hard cases**: long, messy, ambiguous or unusual inputs
- **cases that went wrong** before, so you can see whether the tool repeats the mistake
- **cases that should be refused or escalated**, such as missing information or out-of-scope requests

Remove or replace any information the trial isn't allowed to see. Keep the set private and don't share it with vendors in advance, so nobody can tune for it.

## Score with a rubric

Agree the rubric with the process owner before anyone sees an output. Score each example on the same scale, ideally by two reviewers who don't know which tool produced it.

| Criterion | What to look for | Example scale |
|---|---|---|
| **Accuracy** | Facts, figures and references match the sources | 0 = wrong, 1 = minor errors, 2 = correct |
| **Completeness** | Covers what the output must contain | 0 = key parts missing … 2 = complete |
| **Usability** | How much editing before it can be used | 0 = rewrite, 1 = edit, 2 = use as is |
| **Review time** | Minutes a reviewer needs to check it | Measured, not scored |
| **Safe failure** | Says "I don't know" or escalates when it should | 0 = invents, 2 = flags correctly |
| **Format and tone** | Matches your templates and house style | 0–2 |

Review time often decides the case. A tool that produces slightly better drafts that take twice as long to check may be worse overall. See [how to calculate AI ROI honestly](/guides/ai-roi-hours-are-not-cash/).

## What an enterprise trial should test

Ask for a trial on your terms, with your test set and the configuration you'd actually use. Cover:

- **Quality on your examples**, scored with the rubric above.
- **Review time**, measured with the people who would do the reviewing.
- **Data handling:** where information is processed and stored, retention, whether inputs are used for training, and what the contract says, not just the website.
- **Admin controls:** single sign-on, user provisioning, permissions, audit logs, and the ability to restrict features or information sources.
- **Integration:** whether it connects to the systems the workflow uses, and what that connection can read or change.
- **Cost at real volume:** licences or usage priced for your actual users and runs, including the tier needed for the controls above.
- **Support:** who you call when it breaks, and how changes to the underlying model are communicated.

## Vendor claim versus your result

Keep a simple record for each shortlisted option with two columns: what the vendor said, and what your test showed. Treat vendor benchmarks, case studies and accuracy figures as hypotheses to check, not evidence. They were measured on someone else's work.

## Avoiding demo bias

- Don't let the vendor run the trial on your behalf. Your staff should operate it.
- Score blind where you can. Brand and interface polish shift judgements.
- Fix the rubric and acceptance threshold before testing, not after.
- Watch for "it will be able to do that in the next release". Evaluate what exists today.
- Re-test after configuration changes; don't carry earlier scores forward.

## What to check before committing budget

- Requirements are written down before products are compared. The [Project Brief Builder](/tools/project-brief/) helps here.
- The test set comes from your own work and includes hard and failure cases.
- At least one option you already own was tested on the same basis.
- Quality and review time were measured by the people who would use it.
- Data handling and admin controls have been checked against the contract and with IT.
- Cost has been calculated at real volume, including the necessary tier.
- The winning option met an acceptance threshold set in advance.

## Worked example (illustrative)

*This is a hypothetical example, not a client result.*

A housing association wants help drafting responses to repair complaints. It shortlists a specialist complaints product and the general AI assistant already included in its office licences.

The team builds a test set of 30 past complaints, including six difficult ones and four that should have been escalated. Two reviewers score the outputs blind.

The specialist product scores better on tone and format, because it ships with complaint templates. The general assistant, configured with the association's own templates, comes close on quality and slightly ahead on review time. But it misses two of the four escalation cases, while the specialist product flags three. The trial also shows that the specialist product's audit logging only comes with a higher tier, which changes the cost comparison.

The association chooses the general assistant for routine complaints, adds a mandatory human check for anything mentioning safety or vulnerability, and records the evaluation so it can re-run the same test when either product changes.

## Next step

Write down what the workflow needs before you speak to vendors, using the [Project Brief Builder](/tools/project-brief/). If you need help choosing which workflows to evaluate and building the business case for each, that's part of the [AI Opportunity Sprint](/work-with-us/ai-opportunity-sprint/). When you're ready to engage suppliers, use the [AI implementation brief and supplier questions](/guides/ai-implementation-brief-and-supplier-questions/).
