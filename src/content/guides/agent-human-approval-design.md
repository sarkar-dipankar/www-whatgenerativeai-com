---
title: "What should require human approval for AI agents?"
description: "Decide which AI agent actions need human approval by mapping reversibility, blast radius and confidence, then choosing an approval pattern and controls."
slug: "agent-human-approval-design"
kind: "decision"
cluster: "agent-approval"
question: "Our AI agent can take actions in our systems. Which of those should a person approve first?"
answer: "Decide per action, not per agent. Score each action on how reversible it is, how much damage a wrong one could do, and how confident you can be that it's right, then assign an approval pattern from draft-only to autonomous within limits. Back that with least-privilege access, tool allowlists, hard limits and an audit log."
appliesWhen:
  - "An AI agent or automation will update records, send messages, spend money or change systems"
  - "Someone has asked whether the agent can \"just do it\" without review"
  - "Security or the process owner needs a defensible rule for what the agent may do alone"
alternatives:
  - "If the workflow only needs drafts, keep the agent read-only and let people act — no approval design needed"
  - "If the steps are fixed and the inputs structured, ordinary rules-based automation may be easier to control"
  - "If you can't log or undo the agent's actions, don't give it write access yet"
offer: "pilot-readiness-review"
relatedChapters:
  - "anatomy-of-ai-agent"
  - "agents-security-governance"
  - "tools-function-calling-mcp"
relatedPosts:
  - "prompt-injection-attacks-defense"
weight: 7
date: 2026-10-08
reviewed: 2026-10-08
tags: ["AI agents", "human in the loop", "AI governance", "agent security", "access control"]
---

## Approve actions, not agents

"Should our agent need human approval?" is usually asked about the agent as a whole. That leads to one of two bad outcomes: everything needs sign-off, so the agent saves no time, or nothing does, so one bad output reaches a customer or a ledger.

An agent is a set of **actions**: read a ticket, look up a customer, draft a reply, update a field, send an email, issue a refund. Each action carries different risk. The right question is: **for each action, what is the worst plausible outcome if it is wrong, and how would we find out?**

## Three factors for each action

Score every action the agent can take on three factors:

- **Reversibility.** Can it be undone cleanly and quickly? A draft can be deleted. A sent email, a payment or a deleted record often cannot.
- **Blast radius.** How many people, records or how much money does one wrong action affect? Updating one internal note is small. Changing a price list or emailing a whole customer segment is large.
- **Confidence.** How well can you tell, in advance, that the agent will get this right? That comes from evaluation on real cases, not from a demo. Confidence is also lower wherever the agent reads untrusted content — inbound emails, web pages, uploaded files — because that content can try to steer it. See [prompt injection attacks and defences](/posts/prompt-injection-attacks-defense/).

Low reversibility or a large blast radius should push an action towards human approval regardless of confidence. High confidence only earns autonomy when mistakes are also cheap to undo.

## Five approval patterns

| Pattern | What the agent does | Good fit |
|---|---|---|
| **Draft-only** | Produces an output; a person takes every action | Client-facing messages, anything legal or financial, early pilots |
| **Suggest** | Proposes a specific action with its reasoning; a person chooses whether to do it | Triage, classification, routing where judgement varies |
| **Act with approval** | Prepares the action; it runs only after a person approves it | Record updates, refunds, bookings — reversible but consequential |
| **Act and notify** | Acts, then tells a person who can review and reverse | Low-impact, easily reversed actions with good evaluation results |
| **Autonomous within limits** | Acts without review inside hard limits on value, volume and scope | High-frequency, low-value, fully logged actions with proven accuracy |

Most workflows use more than one pattern. An agent might read and summarise autonomously, suggest a category, and need approval to send anything outside the organisation.

Start each action one step more cautious than you think it needs, and loosen it only when you have evidence from real use.

## Controls that make approval meaningful

Approval steps only help if the agent can't go around them. Check these:

- **Least privilege.** The agent's credentials allow only the actions it needs, on only the data it needs. Read-only wherever possible.
- **Tool allowlist.** The agent can call a defined list of tools or functions, and nothing else. New tools need review before they are added.
- **Hard limits.** Caps on value (for example, refund amount), volume (actions per hour) and scope (which accounts, which fields) enforced *in the system*, not just in the agent's instructions.
- **Separation of approval.** The approval step runs outside the agent, so the agent can't approve its own request.
- **Audit log.** Every action records what the agent saw, what it did, which tool it called with which inputs, and who approved it.
- **Approval that is easy to do well.** Approvers see the proposed action, the relevant context and what will change. If approval is a single "OK" button with no context, people will click it without reading.

## How to stop an agent making the wrong change

Plan for the case where something goes wrong anyway:

- A **kill switch** that stops the agent immediately, owned by a named person.
- A tested **rollback** for each reversible action, and a manual procedure for the irreversible ones.
- **Alerts** on unusual patterns: spikes in volume, actions outside normal hours, repeated failures.
- A **review cadence** where someone samples logged actions, even for autonomous ones, and checks they were right.
- A rule for **tightening**: if an error is found, the affected action moves back to a more cautious pattern until it is understood.

## Checklist before giving an agent write access

- Every action is listed, with its reversibility, blast radius and confidence noted.
- Each action has an assigned approval pattern and an owner.
- The agent's credentials match the allowlist and nothing more.
- Limits are enforced by the systems it acts on, not only by its prompt.
- Logs capture inputs, actions and approvals, and someone reviews them.
- There is a tested way to stop the agent and reverse its recent actions.
- Untrusted inputs are identified, and actions triggered by them are treated more cautiously.

## Worked example (illustrative)

*This is a hypothetical example, not a client result.*

An online retailer's customer-service team pilots an agent that handles "where is my order" and return requests. Its actions are mapped:

- **Look up order status** — read-only, small blast radius: autonomous.
- **Draft reply to customer** — reversible until sent: draft-only for the first month, then act and notify for standard templates.
- **Create a return label** — reversible, low value: act and notify, capped at a set number per customer.
- **Issue a refund** — money leaves the business: act with approval, with a hard value cap in the payment system.
- **Change the customer's address** — risk of fraud via a manipulated email: suggest only.

After two months of logged results, the team moves standard replies to act and notify. Refunds stay with approval.

## Next step

If the agent will read company documents to do its job, check the data flow first with [Can staff use AI with internal documents?](/guides/staff-ai-internal-documents/). If the pilot is working but hasn't moved to production, see [why AI pilots stall](/guides/why-ai-pilots-stall/). For an independent review of permissions, approval design, logging and rollback before you widen access, book a [Pilot Readiness Review](/work-with-us/pilot-readiness-review/).
