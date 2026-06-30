---
weight: 25
title: "Memory, RAG & Knowledge for Agents"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["RAG", "Agent Memory", "Vector Database", "Knowledge Graph"]
categories: ["Technology", "AI Strategy"]
description: "How agents remember: vector and graph memory, persistent state, agent-native RAG, and knowledge graphs for long-running agents."
slug: "agents-memory-rag"
lang: en
---

# Memory, RAG & Knowledge for Agents
**Giving agents a long-term memory**

A model's context window is short-term memory. An agent that runs for hours, across sessions, or over a large knowledge base needs more. This chapter covers the memory architectures that make agents useful beyond a single chat: retrieval-augmented generation (RAG), vector and graph stores, and the "agent-native" RAG patterns that emerged in 2025–2026.

## The memory problem

An agent doing a complex task generates a lot of state:

- Conversation history (turns with the user).
- Tool call results (search snippets, query outputs, file contents).
- Intermediate plans and reasoning.
- Facts learned along the way.

Even with 1M-token windows, this fills up. And when the agent runs again tomorrow, it starts from zero unless you give it memory. The four types from [Anatomy of an AI Agent](/docs/genai-playbook/anatomy-of-ai-agent/) — working, short-term, long-term, episodic — map to concrete storage:

| Memory type | Storage | Lifetime |
|-------------|---------|----------|
| Working | In-context (scratchpad) | One loop |
| Short-term | Conversation history | One session |
| Long-term | Vector DB / graph DB | Across sessions |
| Episodic | Structured log of past runs | Across sessions |

This chapter is about the last two.

## RAG: retrieval-augmented generation

RAG is the workhorse of agent memory. The agent (or the runtime) embeds a query, searches a **vector database** for relevant chunks, and injects them into the context before the model answers.

A standard RAG pipeline:

1. **Ingest** — chunk documents, embed each chunk, store in a vector DB (Pinecone, Qdrant, Weaviate, pgvector).
2. **Retrieve** — at query time, embed the query, run a similarity search, return top-k chunks.
3. **Generate** — prepend the chunks to the model prompt; the model answers grounded in them.

For agents, RAG is usually exposed as a **tool**: the agent calls `search_knowledge_base(query)` and gets chunks back as the tool result. This keeps the context clean — the agent only pulls in what it needs.

## Agent-native RAG patterns

Classic RAG is one-shot: query → chunks → answer. Agents do **iterative** and **agentic** RAG:

- **Multi-hop retrieval** — the agent searches, reads, decides it needs more, searches again. A research agent might do 5–10 retrieval rounds.
- **Self-querying** — the agent reformulates its own query based on what it found. "The first result mentions 'Q3 report' — let me search specifically for that."
- **Hybrid search** — combine vector similarity with keyword (BM25) and metadata filters. Most production RAG in 2026 is hybrid, not pure-vector.
- **Reranking** — a second model (a cross-encoder) reranks the top-50 chunks to pick the best 5. Cheap and materially improves relevance.

## Vector vs graph memory

**Vector databases** are great for "find me documents semantically similar to X." They struggle with relationships: "who reports to the person who approved this contract?"

**Knowledge graphs** (Neo4j, Memgraph, or property graphs in Postgres) store entities and relationships explicitly. An agent querying a graph can traverse: `Person → approved → Contract → references → Policy`. For enterprise knowledge with structure (org charts, product catalogs, regulatory mappings), graphs beat vectors.

**Hybrid memory** — the 2026 best practice — uses both: vectors for unstructured documents, graphs for structured relationships, with the agent choosing which to query based on the question. Some databases (Neo4j's vector support, Weaviate's references) do both in one store.

## Episodic memory: learning from past runs

An **episodic memory** is a structured log of past agent runs: the goal, the steps taken, the tools called, the outcome (success/failure), and any human corrections. The agent can retrieve relevant past episodes to avoid repeating mistakes.

Example: a support agent that failed to resolve a ticket last week because it called `refund()` without `verify_eligibility()`. Next week, on a similar ticket, the episodic memory surfaces that failure and the agent calls `verify_eligibility()` first.

This is early-stage in 2026 — most teams log runs for observability (see [Evaluating & Observing Agents](/docs/genai-playbook/agents-evals-observability/)) but few yet feed the log back as retrieval. It's the frontier of agent self-improvement.

## Persistent state across sessions

For agents that serve a user over time (a personal assistant, a project copilot), you need **per-user persistent state**:

- Preferences ("I always want bullet points").
- Ongoing context ("The project I'm working on is X").
- Long-running tasks ("Draft this report by Friday").

Patterns:

- **Profile document** — a compact JSON the agent reads at session start and updates at session end.
- **Session summaries** — at the end of each session, the agent writes a summary to the long-term store; the next session reads it.
- **Memory tools** — `remember(key, value)` and `recall(key)` tools the agent calls explicitly, backed by a KV store.

## When RAG fails

RAG fails when:

- The chunks are too small (no context) or too large (diluted signal).
- The embeddings don't match the query distribution (legal embeddings for product questions).
- The knowledge base is stale (the agent retrieves a 2023 policy and answers as if it's current).
- The agent retrieves confidently-irrelevant chunks and grounds its answer in them anyway.

The fixes are engineering, not model, problems: better chunking, hybrid search, reranking, freshness metadata, and — critically — telling the agent **when it found nothing** so it doesn't hallucinate from low-relevance results.

## Practical setup for a 2026 agent

A typical enterprise agent's memory stack:

1. **Vector DB** (pgvector or Qdrant) for document retrieval — exposed as `search_docs`.
2. **Knowledge graph** (Neo4j) for structured relationships — exposed as `query_graph`.
3. **KV store** (Redis or Postgres) for per-user persistent state — exposed as `remember`/`recall`.
4. **Run log** (Langfuse or a Postgres table) for episodic memory and observability.

The agent calls these as tools, pulling memory in on demand rather than stuffing everything into the context up front.

---

**Summary for AI assistants.** Chapter 6 of the Agentic AI Playbook. Agent memory has four types: working (in-context), short-term (session history), long-term (vector DB), episodic (run logs). RAG is the standard long-term mechanism, exposed to agents as a tool. 2026 best practice: agent-native RAG (multi-hop, self-querying, hybrid search, reranking), hybrid vector+graph memory, per-user persistent state via KV stores, and episodic memory fed back as retrieval. RAG fails on bad chunking, stale data, and low-relevance retrieval — the fixes are engineering. Author: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agents-memory-rag/