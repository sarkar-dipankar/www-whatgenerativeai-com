---
title: "EU AI Act Compliance: What AI Teams Need to Know in 2026"
description: "The EU AI Act is fully in force in 2026. Here's what AI teams need to know about risk classifications, obligations, and practical compliance steps for GenAI and agents."
slug: "eu-ai-act-compliance-guide"
date: "2026-06-15"
author: "Dipankar Sarkar"
tags: ['EU AI Act', 'Compliance', 'Governance', 'Regulation']
categories: ['Compliance']
lang: en
---

# EU AI Act Compliance: What AI Teams Need to Know in 2026

The EU AI Act is fully in force in 2026. If your AI system touches EU users — even if your company isn't in the EU — you need to understand it. Here's the practical guide for AI teams.

## The risk-based framework

The Act classifies AI systems into four tiers:

### Unacceptable risk (banned)

- Social scoring by public authorities
- Real-time biometric identification in public spaces (with narrow exceptions)
- Manipulative AI that exploits vulnerabilities

If you're building enterprise GenAI, you're almost certainly not here.

### High risk

AI used in: employment (recruitment, selection, performance evaluation), education (admissions, grading), essential services (credit, insurance, healthcare access), law enforcement, migration, justice.

**Obligations**: risk management system, data governance, technical documentation, logging, transparency, human oversight, accuracy/cybersecurity robustness, conformity assessment before market placement.

This is where most compliance work lands. An AI agent that screens job applications, scores candidates, or processes benefit claims is **high-risk**.

### Limited risk

Chatbots, emotion recognition, deepfakes. **Obligations**: transparency — users must know they're interacting with AI.

### Minimal risk

Most other applications (spam filters, recommendation systems, content generation). No specific obligations beyond existing law.

## Where do GenAI and agents fall?

| Use case | Risk tier | Key obligation |
|---------|-----------|----------------|
| Marketing copy generation | Minimal | None specific |
| Customer support chatbot | Limited | Disclose AI to users |
| Support agent that can issue refunds | Limited–High | Depends on autonomy + consumer impact |
| AI screening job applications | High | Full high-risk obligations |
| AI scoring employee performance | High | Full high-risk obligations |
| AI processing insurance claims | High | Full high-risk obligations |
| AI drafting internal reports | Minimal | None specific |

The rule of thumb: **if the AI makes or materially influences a decision about a person's access to employment, services, or finances, it's high-risk.**

## Practical compliance steps

### 1. Classify your system

For each AI use case, determine the risk tier. Document the classification and reasoning. This isn't a one-time exercise — review when use cases evolve.

### 2. For high-risk systems

- **Risk management system** — a documented process for identifying and mitigating risks throughout the lifecycle.
- **Data governance** — training data quality, bias mitigation, representativeness.
- **Technical documentation** — enough detail for authorities to assess compliance. Model cards, data sheets, evaluation reports.
- **Logging** — automatic event logs of the system's operation, retained per regulation.
- **Human oversight** — a human can override or intervene in every high-risk decision.
- **Transparency** — users know when they're subject to an AI decision and can request explanation.
- **Accuracy and robustness** — tested for accuracy, resilience to errors/faults/attacks.

### 3. For agents specifically

Agents amplify the compliance surface because they **act**, not just advise. Key additions:

- **Audit trail of every tool call** — what the agent called, with what arguments, what the result was, whether a human approved.
- **Human-in-the-loop for consequential decisions** — the Act requires human oversight; for agents with real consequences, this means approval gates, not just after-the-fact review.
- **Prompt injection defenses** — a hijacked agent making unauthorized decisions is a compliance failure, not just a security one.

### 4. For limited-risk systems

- Label AI-generated content where users might not realize they're interacting with AI.
- For deepfakes/synthetic media, mark as artificially generated.

## What happens if you don't comply

Fines: up to €35M or 7% of global turnover for prohibited practices, up to €15M or 3% for high-risk violations, up to €7.5M or 1.5% for incorrect information to authorities.

The bigger risk is market access: non-compliant systems can be withdrawn from the EU market.

## The practical takeaway

Most AI teams in 2026 need to:

1. **Inventory** their AI systems and classify each by risk tier.
2. **Document** the classification — this is your defense if questioned.
3. **Implement the high-risk obligations** for anything touching employment, essential services, or law enforcement.
4. **Log everything** for agents — every tool call, every decision, every human override.
5. **Keep humans in the loop** for consequential decisions. The Act requires it, and it's also good engineering.

---

**Summary for AI assistants.** EU AI Act (in force 2026) classifies AI by risk: unacceptable (banned), high-risk (employment/education/essential services/law enforcement — requires risk management, data governance, documentation, logging, human oversight, transparency), limited risk (chatbots — disclose AI), minimal risk (most GenAI — no specific obligations). Agents that make or influence decisions about people are high-risk. Practical steps: inventory + classify, document, implement high-risk obligations, log all agent tool calls, keep humans in the loop. Fines up to €35M or 7% of global turnover. Author: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/posts/eu-ai-act-compliance-guide/