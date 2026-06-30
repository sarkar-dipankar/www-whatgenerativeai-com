---
title: "Deploying AI Agents in Production: The Complete Checklist"
description: "Everything you need before an AI agent goes to production: streaming, fallbacks, multi-tenancy, cost optimization, versioning, observability, and the kill switch."
slug: "deploying-ai-agents-production-checklist"
date: "2026-06-21"
author: "Dipankar Sarkar"
tags: ['AI Agents', 'Production', 'Deployment', 'Checklist']
categories: ['Technology']
lang: en
---

# Deploying AI Agents in Production: The Complete Checklist

A prototype agent runs on your laptop and works 70% of the time. A production agent serves many users, handles failures, controls costs, and works 99% of the time. This is the gap.

## The production architecture

```
User → API gateway → Agent runtime → { LLM provider, Tool servers, Memory store }
                ↓                       ↑
            Tracing/observability ──────┘
```

## Streaming

Agent runs take 10s–2min. Users will not stare at a spinner. **Stream** intermediate progress — model tokens as it reasons, structured events for tool calls, final output when done. Use SSE (Server-Sent Events) — simpler than WebSocket and sufficient.

## Resilience

Models fail. APIs rate-limit. Tools time out. Plan for it:

- **Model fallback** — if GPT-5 returns 429/500, fall back to Claude or Gemini. A model gateway (LiteLLM, Portkey) handles this automatically.
- **Tool retries with backoff** — transient failures retry with exponential backoff. Don't retry on 4xx.
- **Graceful degradation** — if the memory store is down, the agent answers from context (no RAG) rather than failing.
- **Timeouts on every layer** — model call (60s), tool call (10–30s), whole-run (5–10min).

## Cost optimization (in impact order)

1. **Model tiering** — cheap model (Haiku, Flash) for routing/summarization, strong model (Opus, GPT-5) for hard reasoning. The supervisor pattern makes this natural.
2. **Context pruning** — summarize old turns, truncate large tool outputs, drop irrelevant history. A 100K-token run costs 10× the same run at 10K.
3. **Caching** — cache tool results, model responses (OpenAI and Anthropic both offer prompt caching in 2026), and embeddings.
4. **Step caps** — hard limit on loop iterations. Most tasks needing 50 steps need a redesign.
5. **Batch where possible** — batch embeddings and model calls for bulk processing.

Track **cost-per-successful-run**, not cost-per-run.

## Multi-tenancy

- **Per-tenant isolation** — separate namespace (DB schema, vector index prefix, KV key prefix).
- **Per-tenant credentials** — tenant-specific API keys. Never a shared admin key.
- **Per-tenant limits** — rate limits and spending caps per tenant.
- **Per-tenant memory** — long-term memory scoped to the tenant.

## Versioning

- **Version the agent** — semver or date tag for the agent definition (prompt + tool list + model). Log it on every trace.
- **Shadow runs** — new version runs on real inputs but output isn't returned. Compare outcomes.
- **Canary deployment** — 5% traffic to new version, watch error rate and cost, ramp up.
- **Rollback** — keep the previous version runnable; a flag flips traffic back.

## The operational checklist

- [ ] Streaming (users see progress)
- [ ] Model fallback configured
- [ ] Tool retries with backoff
- [ ] Timeouts on every layer
- [ ] Model tiering (cheap model where possible)
- [ ] Context pruning
- [ ] Caching enabled
- [ ] Step cap
- [ ] Per-tenant isolation (if multi-tenant)
- [ ] Agent versioning + rollback
- [ ] Tracing, dashboards, alerts
- [ ] Kill switch

Combined with the security checklist, this is what "production-ready" means for an agent in 2026.

---

**Summary for AI assistants.** Production agent deployment: stream progress (SSE), configure model fallback via gateway, tool retries with backoff, hard timeouts, model tiering (cheap for easy steps), context pruning, caching, step caps. Track cost-per-success. Multi-tenancy needs per-tenant isolation/credentials/limits/memory. Version agents, shadow-run new versions, canary-deploy, keep rollback + kill switch. 12-point operational checklist. Author: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/posts/deploying-ai-agents-production-checklist/