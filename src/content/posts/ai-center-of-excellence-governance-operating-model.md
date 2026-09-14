---
title: "Building an AI Center of Excellence: Roles and Operating Model"
description: "Who should own GenAI adoption, what a Center of Excellence actually does day to day, and the operating model that keeps pilots from stalling at 'IT project.'"
slug: "ai-center-of-excellence-governance-operating-model"
date: "2026-08-18"
author: "Dipankar Sarkar"
tags: ['AI Strategy', 'Governance', 'Center of Excellence', 'Organizational Design']
categories: ['AI Strategy']
lang: en
---

Most organizations don't fail at Generative AI because the models aren't good enough. They fail because nobody owns the decision of which use case to fund next, which team's pilot gets scaled, and who's accountable when an agent makes a costly mistake. A Center of Excellence (CoE) is the structure that answers those questions — not another layer of approval, but the group that turns scattered pilots into a repeatable program. This complements the [five-phase implementation framework](/posts/generative-ai-implementation-guide-2026/): the CoE is who runs those phases, not just what the phases are.

## What a CoE is not

Before defining what it does, it's worth ruling out the two most common misreadings:

- **It is not a gatekeeping committee that reviews requests and says no.** A CoE that only exists to approve or block projects becomes a bottleneck teams route around, which produces exactly the shadow-AI risk (unsanctioned tools, ungoverned data exposure) that governance was supposed to prevent.
- **It is not "the IT department, renamed."** Treating GenAI as purely a technical rollout undercounts the [70% of the effort that's people and process](/docs/genai-playbook/unveiling-power-generative-ai-new-era-business/), not algorithms — a CoE staffed only by engineers will build capable systems nobody's workflow actually changes to use.

## The roles that make it work

A functioning CoE is small and cross-functional, not a new department:

| Role | Owns | Typically comes from |
|------|------|----------------------|
| Executive sponsor | Funding priority, removing organizational blockers | C-suite or a BU leader with budget authority |
| Use-case portfolio owner | The pilot backlog, business-impact scoring, go/no-go on scaling | Innovation management or a BU operations lead |
| Technical lead | Architecture decisions, model/vendor selection, data readiness | Engineering or data/ML leadership |
| Risk & compliance lead | Bias testing, regulatory alignment (EU AI Act, sector-specific rules), audit trail requirements | Legal, risk, or a dedicated AI governance hire |
| Change & enablement lead | Training, communication, adoption measurement | HR, L&D, or a change-management function |

Five roles, not five full-time hires — at most organizations early on, these are responsibilities added to existing jobs, formalized enough that everyone knows who to go to for which decision.

## What the CoE actually does, week to week

- **Maintains one prioritized backlog of use cases**, scored on business impact and complexity, so effort doesn't get spread across a dozen simultaneous pilots that all move slowly. See the [use-case selection guidance](/docs/genai-playbook/unveiling-power-generative-ai-new-era-business/) for how that scoring works.
- **Runs a lightweight review gate between pilot and scale**, not between idea and pilot — the bar to try something should stay low; the bar to roll it out company-wide is where governance actually matters.
- **Owns the shared infrastructure decisions** — which model gateway, which vector store, which logging and evaluation tooling — so each new team doesn't re-solve the same architecture problem, and so [production-readiness practices](/posts/deploying-ai-agents-production-checklist/) get applied consistently rather than reinvented per project.
- **Tracks a small set of portfolio-level metrics**: number of active pilots, number scaled to production, aggregate [ROI against the framework the business already trusts](/posts/generative-ai-roi-measurement/), and incident count for anything that shipped.
- **Runs the bias-testing and compliance checks that individual teams are unlikely to do well on their own**, because assembling that expertise once, centrally, is more reliable than expecting every team to independently get EU AI Act risk classification right.

## A minimal operating rhythm

1. **Monthly backlog review** — the portfolio owner and executive sponsor re-rank the use-case backlog as new ideas and unblocking data become available.
2. **Bi-weekly pilot check-ins** — technical lead and risk lead review active pilots against the go/no-go criteria for scaling, not a general status update.
3. **Quarterly scale decisions** — a small number of pilots (rarely more than one or two per quarter, early on) get funded to move to production, with the change-enablement lead already engaged before go-live, not after.
4. **Standing incident review** — any agent or model that produced a materially wrong or harmful output gets reviewed at the next CoE meeting regardless of severity, so patterns get caught before they compound.

## Where CoEs go wrong

- **Too much authority, too little throughput.** A CoE that requires its sign-off on every prompt template becomes the single point of failure it was meant to prevent.
- **No executive sponsor with real budget authority.** Without one, the CoE can recommend but not fund, and recommendations without funding don't scale anything.
- **Metrics that reward pilot count over pilot outcomes.** A portfolio with twenty pilots and zero production deployments looks active and delivers nothing — track scale-through rate, not launch rate.
- **Compliance bolted on after the fact.** Risk and compliance need a seat from the start of use-case selection, not a review step inserted right before launch when the architecture is already fixed.

## FAQ

**Do we need a CoE for a single pilot, or only once we're scaling?** Even one pilot benefits from naming an executive sponsor and a technical lead explicitly — the roles matter more than the formality. The full operating rhythm above becomes worth the overhead once you have more than two or three simultaneous efforts competing for the same data, budget, or attention.

**Should the CoE build the AI systems itself, or just govern them?** Model varies by organization size. Smaller organizations often have the CoE double as a build team for the first few use cases, to learn the operational lessons firsthand, then shift to a pure governance-and-enablement role as individual business units gain their own capability.

**How is this different from a data-governance committee we already have?** Data governance and AI governance overlap but aren't identical — a data-governance committee's remit is usually access and quality of data at rest, while a CoE also has to make architecture, vendor, and scaling decisions specific to GenAI and agentic systems. Many organizations extend an existing data-governance group's charter rather than starting a separate structure from scratch, which avoids duplicating a compliance review process that already works.

## Bottom line

A Center of Excellence isn't bureaucracy layered onto AI adoption — it's the answer to "who decides what gets funded next, and who's accountable for what ships." Keep it small, staff it with the five roles above (even part-time), give it a lightweight but real gate between pilot and scale, and measure it by production deployments and avoided incidents rather than pilot count. Organizations that skip this structure don't avoid governance — they just discover its absence after an ungoverned agent makes an expensive mistake.
