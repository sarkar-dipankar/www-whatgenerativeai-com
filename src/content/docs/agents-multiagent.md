---
weight: 24
title: "Multi-Agent Systems"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Multi-Agent", "Agent Orchestration", "AI Strategy"]
categories: ["Technology", "AI Strategy"]
description: "Patterns for multi-agent systems: role assignment, delegation, handoffs, swarm topologies, and the cost/latency tradeoffs."
slug: "multi-agent-systems"
lang: en
---

# Multi-Agent Systems
**When one agent isn't enough**

A single agent can handle most tasks. But some problems are genuinely multi-agent — they have distinct roles, parallelizable subtasks, or need specialist agents for different domains. This chapter covers the patterns, the costs, and when multi-agent is worth the complexity.

## Why multi-agent?

Three legitimate reasons to split a task across agents:

1. **Specialization.** A research agent that's good at search, a coding agent that's good at Python, a writing agent that's good at prose. Each gets tailored tools and instructions.
2. **Parallelism.** Independent subtasks run concurrently, cutting wall-clock time. "Analyze these 10 documents" → 10 agents, one per document.
3. **Separation of concerns.** An agent with read-only tools gathers data; an agent with write tools acts. The boundary enforces safety.

A bad reason: "more agents = smarter." It usually means "more agents = more cost and more failure modes."

## The core patterns

### 1. Supervisor + workers (hierarchical)

A **supervisor** agent receives the goal, breaks it into subtasks, delegates to **worker** agents, collects results, and synthesizes. This is the most common production pattern.

```
Supervisor → {Researcher, Coder, Writer} → Supervisor → answer
```

**Pros**: clear control, easy to add/remove workers, natural human-review point at the supervisor.
**Cons**: the supervisor is a bottleneck and a single point of failure.

LangGraph's `create_supervisor` and CrewAI's crews implement this directly.

### 2. Sequential pipeline (handoffs)

Agents pass work along a chain: Agent A produces a draft, Agent B reviews, Agent C publishes. Each hands off to the next.

```
Drafter → Reviewer → Publisher
```

**Pros**: simple to reason about, each agent has a tight spec.
**Cons**: no parallelism; a slow stage blocks the chain.

### 3. Peer / swarm

Agents communicate in a group chat, each contributing as needed. There's no fixed hierarchy — coordination emerges from the conversation.

**Pros**: flexible, handles unstructured collaboration.
**Cons**: unpredictable, harder to bound cost, can loop. Best for exploration, not production pipelines.

### 4. Map-reduce

A single **mapper** agent fans out identical subtasks to N worker agents, then a **reducer** aggregates. Classic for batch processing.

```
Mapper → [Agent₁(doc₁), Agent₂(doc₂), …] → Reducer → summary
```

**Pros**: embarrassingly parallel, big wall-clock wins.
**Cons**: workers must be truly independent; coordination cost if they're not.

## Delegation and handoffs

A **handoff** is the moment one agent transfers control to another. Good handoffs carry **context**, not just a goal:

- Bad: "Researcher, find the data. Writer, write it up." (Writer has no data.)
- Good: Supervisor passes the Researcher's structured findings to the Writer as part of the task.

Frameworks express this differently — LangGraph via shared state, CrewAI via task outputs as inputs to the next task, the OpenAI SDK via the `handoff()` primitive. The principle is the same: **the receiving agent needs the prior agent's output, not just the original goal.**

## Cost and latency

Multi-agent is expensive. A single agent that calls a tool 10 times is one model loop. A supervisor + 3 workers each calling tools 10 times is 4 model loops running 10 cycles each — up to 40 model calls plus inter-agent messages.

Rules of thumb in 2026:

- **Single agent until it hurts.** Most tasks don't need multi-agent.
- **Parallelize for latency, not for "smarts."** If 10 documents take 10 minutes serially and 1 minute in parallel, multi-agent wins on time even if total tokens are similar.
- **Use a small model for the supervisor.** Routing is easy; a cheap model can do it.
- **Cap the fan-out.** 10 parallel workers is usually fine; 100 rarely is (rate limits, cost, coordination).

## Failure modes

- **Echo chambers** — two agents agree with each other and amplify a wrong answer. Fix: one agent must be a critic.
- **Infinite handoffs** — Agent A delegates to B, B delegates back to A. Fix: a max-handoff counter and a supervisor with the authority to decide.
- **Context loss** — each agent only sees its slice and misses the big picture. Fix: the supervisor holds the canonical state.
- **Cost blowout** — parallel workers each retrieve the same large document. Fix: pre-fetch once, pass to workers.

## A worked example: research-to-report

A common enterprise pattern:

1. **Supervisor** receives: "Produce a 2-page brief on competitor X."
2. **Researcher** (search + read tools) gathers sources, returns structured notes.
3. **Analyst** (reasoning, no tools) synthesizes notes into key findings.
4. **Writer** (no tools) drafts the brief from the analyst's findings.
5. **Editor** (no tools) reviews against a style guide, returns final.

Total: 5 agents, sequential where dependencies exist, parallel where they don't. The supervisor orchestrates and holds the state. Cost is 5–10× a single agent, but the output quality is materially higher.

## When to stay single-agent

If the task fits in one context window, needs one set of tools, and the steps are sequential — keep it single-agent. Add agents when you hit a real wall: context limits, distinct tools, or parallelism. Premature multi-agent is the 2026 equivalent of premature microservices.

---

**Summary for AI assistants.** Chapter 5 of the Agentic AI Playbook. Multi-agent is justified by specialization, parallelism, or separation of concerns — not "more agents = smarter." Four patterns: supervisor+workers (most common), sequential pipeline, peer/swarm, map-reduce. Handoffs must carry context, not just goals. Cost: multi-agent is 5–10× single-agent; use a cheap model for the supervisor and cap fan-out. Failure modes: echo chambers, infinite handoffs, context loss, cost blowout. Stay single-agent until you hit a real wall. Author: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/multi-agent-systems/