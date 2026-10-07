---
title: "Writing an AI implementation brief, and the questions to ask suppliers"
seoTitle: "AI implementation brief: what to include, what to ask suppliers"
description: "What an AI project brief must contain, a skeleton you can copy, and the questions that separate credible AI suppliers from confident ones."
slug: "ai-implementation-brief-and-supplier-questions"
kind: "decision"
cluster: "procurement"
question: "What should we give an AI supplier before they quote, and what should we ask them?"
answer: "Give suppliers a written brief covering scope, systems, information, constraints, acceptance criteria, open questions and your purchasing requirements, so every quote answers the same problem. Then ask each one for evaluation evidence, how they handle your data, who will actually do the work, how acceptance is tested, where support ends, how you can leave, and whether they earn fees from the products they recommend."
appliesWhen:
  - "You've chosen a workflow and are about to ask suppliers for proposals"
  - "Quotes you've received are hard to compare because each supplier solved a different problem"
  - "Procurement or IT needs a clear record of what is being bought and why"
alternatives:
  - "If you haven't yet chosen a workflow, do that first — a brief can't fix an unclear goal"
  - "If the work is mostly configuring software you already own, an internal brief to IT may be enough"
  - "If you're unsure what's feasible, commission a short paid discovery before a full build quote"
offer: "workflow-implementation"
tool: "project-brief"
relatedChapters:
  - "crafting-success-building-internal-genai-use-cases"
  - "genai-security-and-compliance-safeguarding-innovation-ai-era"
  - "deploying-agents-in-production"
relatedPosts:
  - "deploying-ai-agents-production-checklist"
  - "generative-ai-security-best-practices"
weight: 5
date: 2026-10-08
reviewed: 2026-10-08
tags: ["AI procurement", "project brief", "supplier selection", "AI implementation", "RFP"]
---

## Why the brief matters more than the proposal

When AI proposals are hard to compare, the cause is usually the request, not the suppliers. Without a brief, each supplier fills the gaps with their own assumptions: one quotes for a prototype, another for a production system, a third for a platform licence with "configuration" included. The prices differ because the problems differ.

A good brief does three jobs. It forces you to decide what you're buying. It lets you compare quotes on equal terms. And it becomes the basis for acceptance: when the work is done, you check it against what you asked for.

A brief is also portable. It belongs to you, not to whichever supplier helped write it, and you can send it to anyone.

## What a brief must include

| Section | What it answers | Common gap |
|---|---|---|
| **Scope** | Which workflow, which steps change, what's out of scope | "Use AI for proposals" with no boundary |
| **Systems** | Which tools the workflow touches, and whether the solution must read, write or act in them | Integrations discovered halfway through the build |
| **Information** | What data is involved, its classification, where it lives, who may see it | Personal or client data found during testing |
| **Constraints** | Security, hosting, regulatory, accessibility, budget and timing limits | IT requirements raised after the contract is signed |
| **Acceptance criteria** | How you'll decide it works: quality on test cases, review time, controls passing | "Client satisfied" as the only criterion |
| **Open questions** | What you don't know yet and want the supplier to address | Unknowns treated as settled |
| **Purchasing requirements** | Contract form, IP, insurance, payment terms, who owns what at the end | Commercial terms negotiated after scope is fixed |

Keep it short. Two or three pages that are specific are worth more than twenty that are generic.

## A brief skeleton

Copy and fill this in, or generate it with the [Project Brief Builder](/tools/project-brief/).

```markdown
# AI implementation brief: <workflow name>

## 1. Context
- Business owner: <name, role>
- Why now: <problem, current cost, trigger>

## 2. Scope
- Workflow today: <steps, frequency, volume, people involved>
- What should change: <steps to assist or automate>
- Out of scope: <explicit exclusions>

## 3. Systems
- Systems involved: <name — read / write / act>
- Authentication and access: <SSO, service accounts, constraints>

## 4. Information
- Data used: <documents, records, fields>
- Classification: <public / internal / confidential / personal>
- Restrictions: <where it may be processed, retention, training use>

## 5. Constraints
- Security and hosting: <requirements>
- Regulatory or policy: <what applies, as you understand it>
- Budget range and timing: <range, key dates>

## 6. Acceptance criteria
- Quality: <threshold on an agreed test set>
- Review time: <target per item>
- Controls: <logging, approvals, access checks that must pass>

## 7. Open questions
- <what you want the supplier to investigate or propose>

## 8. Purchasing requirements
- Contract form, IP and ownership of prompts, configuration and code
- Support model and hand-over expectations
- Exit: what you receive if the engagement ends
```

## Questions to ask an AI supplier

Ask every supplier the same questions in writing, and compare the answers side by side.

### Evaluation evidence
- How will you show the solution works on our examples, not just yours?
- What test set will you build, who will score it, and will we keep it?
- What do you expect the error rate to be on hard cases, and how will we know?

### Data handling
- Which third parties will process our information, and where?
- Is any of our data retained or used to train models? Where is that stated contractually?
- How are access permissions in our systems respected by the solution?

### Who does the work
- Who exactly will be on the project, and what share of the work will be subcontracted?
- Who is accountable if quality falls short?

### Acceptance
- What will you test before hand-over, and in which environment?
- What happens if acceptance criteria aren't met: fix, extend, or refund?

### Support boundary
- What's included after go-live, for how long, and what costs extra?
- Who handles changes when the underlying model or vendor API changes?

### Exit and portability
- What do we own at the end: prompts, configuration, code, test sets, documentation?
- Could another supplier or our own team take over? What would they need?
- Are we tied to a platform we couldn't replace without a rebuild?

### Conflicts and referral fees
- Do you receive commission, referral fees or partner incentives from any product you're recommending?
- Would you recommend a simpler option, including no AI, if that were the right answer?

A supplier that answers these plainly, including "we don't know yet", is usually a better bet than one with polished answers to every question.

## What to check before committing budget

- The brief has been agreed by the business owner, IT and whoever approves the purchase.
- Every supplier received the same brief and the same questions.
- Acceptance criteria are measurable and include review time, not just quality.
- Data handling answers have been checked against contract terms, not just marketing pages.
- Ownership of prompts, configuration, code and test sets is clear in the contract.
- Referral fees and partner incentives have been disclosed.
- You've compared the quotes with at least one simpler option. See [buy, build, configure or do nothing](/guides/buy-build-configure-or-do-nothing/).

## Worked example (illustrative)

*This is a hypothetical example, not a client result.*

A regional law firm wants help drafting first-pass responses to routine client enquiries. Its first round of quotes ranges widely and can't be compared: one supplier proposed a licence, one a prototype, one a full integration with the case management system.

The firm writes a three-page brief. It limits scope to three enquiry types, states that the solution may read but not write to case management, lists client data as confidential and requires processing in an agreed region, and sets acceptance at "85% of drafts need only minor edits on a 40-item test set, with review under 10 minutes".

The second round of quotes is comparable. One supplier says it can't meet the data-processing requirement. Another discloses a partner incentive on the platform it recommends. The firm chooses the supplier whose answers on acceptance testing and exit were most specific, and writes the test set into the contract.

## Next step

Build your brief with the [Project Brief Builder](/tools/project-brief/). It produces a Markdown document you can send to any supplier. If you want one bounded workflow built and handed over against that brief, with tests, controls and a clear support boundary, see [Workflow Implementation](/work-with-us/workflow-implementation/). To prepare the evaluation evidence first, read [how to evaluate AI tools for your workflow](/guides/evaluate-ai-tools-for-your-workflow/).
