---
title: "Can staff use AI with internal documents?"
description: "How to decide whether staff may use AI with internal documents: approve a workflow's data flow, match information classes to tool tiers, and check the contract."
slug: "staff-ai-internal-documents"
kind: "decision"
cluster: "company-information"
question: "Can our staff paste or upload internal documents into AI tools?"
answer: "Sometimes, but approve a specific workflow's data flow rather than \"AI\" in general. Match the sensitivity of the information to the tier of tool and the contract terms behind it, exclude the categories that need more care, and record the decision so people know what is allowed."
appliesWhen:
  - "Staff are already using AI tools with work documents and nobody has said what is allowed"
  - "A team wants to use AI on contracts, client files, HR records or financial data"
  - "Security or the DPO has been asked to approve \"AI\" and needs something specific to review"
alternatives:
  - "If the information is public or low-sensitivity, a short acceptable-use note may be enough — no formal review"
  - "If the workflow needs special-category or regulated data, consider redaction or a different design before choosing a tool"
  - "If no business-tier tool is available, block uploads for now and publish what is allowed instead of leaving it ambiguous"
offer: "pilot-readiness-review"
relatedChapters:
  - "genai-security-and-compliance-safeguarding-innovation-ai-era"
  - "harnessing-power-existing-genai-tools-practical-guide-businesses"
  - "structuring-data-for-genai-foundation-ai-driven-innovation"
relatedPosts:
  - "generative-ai-security-best-practices"
  - "eu-ai-act-compliance-guide"
weight: 6
date: 2026-10-08
reviewed: 2026-10-08
tags: ["AI governance", "data protection", "information security", "acceptable use", "AI adoption"]
---

## Approve a data flow, not "AI"

"Can we use AI with our documents?" is too broad to answer. The honest reply is "it depends", and that tends to produce either a blanket ban that staff route around or a blanket yes that nobody has checked.

A better question is: **for this workflow, which information goes into which tool, under which terms, and who can see the result?** That is something a security lead, a DPO or a legal adviser can actually review. It also gives staff a clear rule instead of a vague warning.

Two things decide most answers:

- **The class of information** — how much harm it would do if it were exposed, retained or misused.
- **The tier of tool** — the contract terms, controls and hosting behind the tool, not its brand.

The same tool can sit in different tiers. A consumer account and a business account of the same assistant often come with different terms on retention, training use and administration. Check the terms you have actually signed, not the marketing page.

## Information classes and tool tiers

Most organisations already have an information classification. If yours doesn't, these five classes are a reasonable starting point:

- **Public** — already published, or intended to be.
- **Internal** — routine business information with low harm if exposed, such as process notes or meeting agendas.
- **Confidential** — commercially sensitive material: pricing, contracts, client deliverables, strategy, unreleased financials.
- **Personal data** — information about identifiable people: staff, customers, contacts.
- **Special-category or regulated** — health, biometric, criminal records, financial account data, legally privileged material, or anything under sector rules or client confidentiality clauses.

And four tool tiers:

- **Consumer** — personal accounts on free or individual plans, with terms set by the vendor and little or no admin control.
- **Business or enterprise plan** — an organisational account with admin controls, single sign-on and contractual commitments on data use.
- **Private tenant or API with agreed terms** — access through your own cloud tenancy or an API under a negotiated agreement, often with configurable retention and region.
- **Self-hosted** — a model you run on infrastructure you control.

## A decision table to start from

Treat this as a default to adapt with your security lead and DPO, not as a rule that settles every case.

| Information class | Consumer | Business / enterprise plan | Private tenant / API with agreed terms | Self-hosted |
|---|---|---|---|---|
| **Public** | Allowed | Allowed | Allowed | Allowed |
| **Internal** | Not allowed | Allowed for approved workflows | Allowed | Allowed |
| **Confidential** | Not allowed | Allowed for approved workflows after a data-flow review | Allowed after review | Allowed after review |
| **Personal data** | Not allowed | Only after review with the DPO; minimise what is shared | Only after review with the DPO | Only after review with the DPO |
| **Special-category or regulated** | Not allowed | Exclude by default | Case-by-case, with legal or DPO sign-off | Case-by-case, with legal or DPO sign-off |

Self-hosting is not automatically safer. It moves responsibility for security, patching, access and logging onto you. It only helps if you can run it well.

## What to exclude by default

Even with a good tool, some material should stay out until someone has looked at it specifically:

- Special-category personal data and anything covered by sector regulation
- Legally privileged material and live litigation files
- Client information where the engagement terms restrict processing or sub-contracting
- Credentials, keys, access tokens and system configuration
- Unannounced financial results or other price-sensitive information
- Bulk exports of personal data, such as full HR or CRM extracts

The data protection position depends on your organisation, the purpose and the jurisdiction. Rules such as the GDPR (and, where relevant, the EU AI Act) may apply, but how they apply to a given workflow is a question for your DPO or legal adviser, not a guide like this one.

## Data-flow review checklist

For each workflow you want to approve, write down the answers to these:

- **Where the data goes.** Which service, which vendor, which region, and whether any other services are called on the way.
- **Retention.** How long prompts, files and outputs are kept, and whether you can change or shorten that.
- **Training use.** Whether your inputs may be used to train or improve the vendor's models *under your contract terms*, and whether that is off by default or needs to be switched off.
- **Access controls.** Who in your organisation can use the tool, whether it uses single sign-on, and whether shared spaces or connectors expose documents to people who shouldn't see them.
- **Permission inheritance.** If the tool connects to file stores or email, whether it respects existing document permissions.
- **Logging.** What is logged, who can see the logs, and whether logs themselves now contain sensitive content.
- **Residency.** Where data is stored and processed, and whether that matches your obligations and client commitments.
- **Sub-processors.** Which third parties the vendor uses, and how you are told about changes.
- **Exit.** How to delete your data and export what you need if you stop using the tool.

Record the outcome in one place: the workflow, the information class, the approved tool and tier, any exclusions, and the review date.

## Worked example (illustrative)

*This is a hypothetical example, not a client result.*

A 300-person engineering consultancy finds that project managers are pasting client correspondence into personal AI accounts to draft weekly status updates. Rather than ban AI, the operations director asks for a specific workflow to be reviewed: "draft weekly client status update from the project tracker and email thread".

The review classifies the inputs as confidential, with some personal data (client contact names). The firm already has a business plan for an AI assistant, so the security lead checks its terms on retention, training use and sub-processors, and confirms single sign-on is enforced. The DPO agrees that contact names may be included but asks that personal details beyond names are left out. Two client contracts restrict sub-processing, so those projects are excluded.

The firm publishes a one-page rule: this workflow, this tool, these exclusions, and personal accounts are not to be used for client work. The decision is reviewed in six months.

## Next step

If you are deciding which workflow to approve first, [Where should our business start with AI?](/guides/where-to-start-with-ai/) covers how to choose one. For workflows where an agent will act on that information rather than just read it, see [what should require human approval for AI agents](/guides/agent-human-approval-design/). If you want the data flow, controls and contract terms reviewed before a pilot goes wider, that is part of the [Pilot Readiness Review](/work-with-us/pilot-readiness-review/).
