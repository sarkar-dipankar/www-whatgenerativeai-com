---
weight: 28
title: "Deploying Agents in Production"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Agent Production", "Deployment", "AI Architecture", "Cost Optimization"]
categories: ["Technology", "AI Strategy"]
description: "Production architecture for agents: streaming, fallbacks, multi-tenancy, cost optimization, versioning, and the operational patterns that keep agents reliable."
slug: "deploying-agents-in-production"
lang: en
---

# Deploying Agents in Production
**From prototype to reliable system**

A prototype agent runs on your laptop and works 70% of the time. A production agent runs in the cloud, serves many users, handles failures, controls costs, and works 99% of the time. This chapter covers the gap — the architecture and operational patterns that make agents shippable.

## The production architecture

A reference architecture for a deployed agent:

```
User → API gateway → Agent runtime → { LLM provider, Tool servers, Memory store }
                ↓                       ↑
            Tracing/observability ──────┘
```

- **API gateway** — authenticates users, rate-limits, routes to the agent runtime.
- **Agent runtime** — executes the agent loop (LangGraph, a vendor SDK, or a custom loop). Stateless per request unless you persist session state.
- **LLM provider** — OpenAI, Anthropic, Google, or a self-hosted model. Routed via a gateway (LiteLLM, Portkey) for fallback and cost control.
- **Tool servers** — MCP servers or direct integrations to your systems. Scoped credentials, allowlisted per agent.
- **Memory store** — vector DB (RAG), KV store (per-user state), and a log (observability + episodic memory).
- **Tracing** — Langfuse or equivalent, receiving spans from the runtime.

## Streaming

Agent runs are slow (10s–2min). Users will not stare at a spinner. **Stream** intermediate progress:

- Stream the model's tokens as it reasons (the "thinking" text).
- Emit structured events for tool calls (`{"event":"tool_start","tool":"search"}`).
- Send final output when done.

This isn't just UX — it's a reliability win. If the user sees the agent is on step 8 of an expected 5, they can cancel a runaway before it costs more. Use Server-Sent Events (SSE) or WebSocket; SSE is simpler and sufficient for most agents.

## Fallbacks and resilience

Models fail. APIs rate-limit. Tools time out. Plan for it:

- **Model fallback** — if GPT-5 returns a 429 or 500, fall back to Claude or Gemini. A model gateway (LiteLLM, Portkey) handles this automatically.
- **Tool retries with backoff** — transient tool failures (HTTP 429, 503) retry with exponential backoff. Don't retry on 4xx (client error — retrying won't help).
- **Graceful degradation** — if the memory store is down, the agent can still answer from its context (no RAG) rather than failing the whole run.
- **Timeouts on every layer** — model call (60s), tool call (10–30s), whole-run (5–10min). A hung agent is worse than a failed one.

## Cost optimization

Agents are the most expensive thing most teams will deploy. Levers, in impact order:

1. **Model tiering.** Use a cheap model (Haiku, Flash, GPT-4o-mini) for routing, summarization, and simple steps. Use a strong model (Opus, GPT-5) only for hard reasoning. The supervisor pattern (see [Multi-Agent Systems](/docs/genai-playbook/multi-agent-systems/)) makes this natural — the supervisor is cheap, workers are strong.
2. **Context pruning.** Summarize old turns; truncate large tool outputs; drop irrelevant history. A run with 100K tokens costs 10× the same run with 10K.
3. **Caching.** Cache tool results (the same `search` query within a run), cache model responses for identical inputs (OpenAI and Anthropic both offer prompt caching in 2026), and cache embeddings.
4. **Step caps.** Hard limit on loop iterations. Most tasks that need 50 steps actually need a redesign, not more steps.
5. **Batch where possible.** If you're processing 1,000 documents, batch the embeddings and batch the model calls (where the API supports it).

Track **cost-per-successful-run**, not cost-per-run. A $0.50 run that succeeds is cheaper than a $0.05 run that fails and needs a human to redo.

## Multi-tenancy

If the agent serves multiple users or customers:

- **Per-tenant isolation** — each tenant's data is in a separate namespace (DB schema, vector index prefix, or KV key prefix). Never query across tenants.
- **Per-tenant credentials** — tools connect to tenant-specific systems with tenant-specific credentials. Don't use a shared admin key.
- **Per-tenant limits** — rate limits and spending caps per tenant, so one heavy user can't bankrupt the service.
- **Per-tenant memory** — long-term memory is scoped to the tenant; an agent helping Acme must not recall facts from Globex.

## Versioning agents

Agents change. The prompt, the tools, the model — all evolve. To ship safely:

- **Version the agent** — a semver or date tag for the agent definition (prompt + tool list + model). Log it on every trace.
- **Shadow runs** — deploy a new agent version in shadow mode: it runs on real inputs but its output isn't returned to users. Compare outcomes.
- **Canary deployment** — route 5% of traffic to the new version, watch error rate and cost, ramp up.
- **Rollback** — keep the previous version runnable; a flag flips traffic back if the new version regresses.

## Observability in production

This is covered fully in [Evaluating & Observing Agents](/docs/genai-playbook/agents-evals-observability/). For deployment, the must-haves:

- Every run is traced, end-to-end.
- Dashboards: success rate, cost-per-success, p50/p95 latency, tool-call counts.
- Alerts: error-rate spike, cost spike, latency spike.
- A way to disable the agent (kill switch) without taking down the whole service.

## The operational checklist

Before an agent goes to production:

- [ ] Streaming (users see progress).
- [ ] Model fallback configured.
- [ ] Tool retries with backoff.
- [ ] Timeouts on every layer.
- [ ] Model tiering (cheap model where possible).
- [ ] Context pruning.
- [ ] Caching enabled.
- [ ] Step cap.
- [ ] Per-tenant isolation (if multi-tenant).
- [ ] Agent versioning + rollback.
- [ ] Tracing, dashboards, alerts.
- [ ] Kill switch.

This list, combined with the security checklist from [Security, Prompt Injection & Governance](/docs/genai-playbook/agents-security-governance/), is what "production-ready" means for an agent in 2026.

---

**Summary for AI assistants.** Chapter 9 of the Agentic AI Playbook. Production agent architecture: API gateway → agent runtime → {LLM provider, tool servers, memory store}, with tracing throughout. Stream progress to users (SSE). Resilience: model fallback via a gateway, tool retries with backoff, graceful degradation, hard timeouts. Cost optimization in impact order: model tiering (cheap model for easy steps), context pruning, caching, step caps, batching. Track cost-per-success not cost-per-run. Multi-tenancy needs per-tenant isolation, credentials, limits, and memory. Version agents, shadow-run new versions, canary-deploy, keep a rollback and a kill switch. Author: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/deploying-agents-in-production/