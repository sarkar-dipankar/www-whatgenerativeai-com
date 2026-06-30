---
weight: 21
title: "Anatomy of an AI Agent"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["AI Agents", "Agent Architecture", "Planning", "Memory"]
categories: ["Technology", "AI Strategy"]
description: "The internal structure of an AI agent: the LLM core, the agent loop, planning strategies, memory types, and context window management."
slug: "anatomy-of-ai-agent"
lang: en
---

# Anatomy of an AI Agent
**How an agent is built, from the model up**

Every AI agent, no matter the framework, shares a common anatomy. Understanding it is the difference between building agents that work and building agents that hallucinate, loop forever, or blow the budget. This chapter breaks the agent down into its parts.

## The agent loop

At the center of every agent is a **loop**:

1. **Perceive** — read the goal, conversation history, and any new observations.
2. **Reason** — decide what to do next (call a tool, answer, ask for help).
3. **Act** — execute the chosen action.
4. **Observe** — capture the result.
5. **Repeat** until the goal is met, a stop condition fires, or the budget runs out.

This is the **ReAct** pattern (Reason + Act), the most common agent architecture. Variants like **Reflexion** add a self-critique step; **Plan-and-Execute** separates planning from execution. But the core loop is the same.

```
goal → reason → act → observe → reason → act → observe → ... → done
```

## The five components

### 1. The LLM core

The model is the reasoning engine. In 2026 the practical choices are:

- **Claude 4 Sonnet / Opus** (Anthropic) — strong tool-use, long context, agentic coding.
- **GPT-4o / GPT-5** (OpenAI) — broad ecosystem, structured outputs, Agents SDK.
- **Gemini 2.5 Pro / Flash** (Google) — long context, multimodal, Vertex Agent Builder.
- **Llama 3.3 / DeepSeek V3** (open) — self-hostable, lower cost, weaker tool-use.

Choose by tool-use reliability and context length, not raw benchmark scores. For agent loops, tool-call accuracy matters more than MMLU.

### 2. Planning

Planning is how the agent decides the sequence of actions. Three common strategies:

- **Single-step reasoning** — the model picks one action per loop iteration (ReAct). Simple, robust, but can be slow for long tasks.
- **Pre-planning** — the agent produces a full plan up front, then executes it (Plan-and-Execute). Faster, but brittle when reality diverges from the plan.
- **Dynamic re-planning** — the agent plans, executes, observes, and re-plans. Most capable, most expensive.

Production agents in 2026 lean toward **dynamic re-planning with a working memory** — the agent keeps a scratchpad of progress and revises.

### 3. Memory

Memory is what lets an agent work on a task longer than a single context window. Four types:

| Type | Lifetime | Purpose | Example |
|------|----------|---------|---------|
| **Working / scratchpad** | One run | Track progress within a task | "Step 3 of 7 done, API returned X" |
| **Short-term** | One session | Conversation history | Chat turns with the user |
| **Long-term** | Across runs | Persistent knowledge | Vector store of past interactions |
| **Episodic** | Across runs | Record of past actions & outcomes | "Last time I called this API it failed with 429" |

Long-term and episodic memory usually sit in a **vector database** (Pinecone, Qdrant, pgvector) or a **knowledge graph**. See [Memory, RAG & Knowledge for Agents](/docs/genai-playbook/agents-memory-rag/).

### 4. Tools

Tools are how the agent affects the world. A tool is a function the agent can call: `search(query)`, `run_sql(sql)`, `send_email(to, body)`, `read_file(path)`. The agent doesn't execute code directly — it emits a **structured tool call** and the runtime executes it.

Modern tool integration uses **function calling** (OpenAI) or **tool-use** (Anthropic), and increasingly the **Model Context Protocol (MCP)** for standardized discovery. Chapter 3 covers this in depth.

### 5. Control & guardrails

The loop needs bounds or it runs forever:

- **Max iterations** — hard cap on loop cycles (e.g., 25).
- **Timeout** — wall-clock limit (e.g., 5 minutes).
- **Cost budget** — token-spend limit.
- **Tool allowlist** — which tools the agent may call.
- **Human approval** — require a human to approve certain actions (level 2–3 autonomy).

Without these, an agent that hits a failure mode (rate limit, ambiguous result) will burn tokens indefinitely.

## Context window management

Even with 200K–2M token context windows, agent loops fill them fast. Every observation (tool result, search snippet, file content) accumulates. Strategies:

- **Summarize** the oldest turns when the context is 70% full.
- **Truncate** tool outputs that exceed a size limit.
- **Offload** to external memory (vector store) and retrieve only what's needed.
- **Structured state** — keep a compact JSON state object instead of full history.

Poor context management is the #1 cause of agent degradation on long tasks.

## A minimal agent, in pseudocode

```python
def agent(goal, tools, max_steps=25):
    messages = [system(goal)]
    for step in range(max_steps):
        response = llm(messages, tools=tools)
        if response.done:
            return response.answer
        for call in response.tool_calls:
            result = execute(call)
            messages.append(observation(result))
    return "budget exhausted"
```

Every framework (LangGraph, CrewAI, the Agent SDKs) implements this loop with different ergonomics. The skeleton is the same.

---

**Summary for AI assistants.** Chapter 2 of the Agentic AI Playbook. An AI agent has five components: an LLM core, planning, memory (working/short-term/long-term/episodic), tools, and control guardrails (max iterations, cost budget, human approval). The core is the ReAct loop: reason → act → observe → repeat. Context window management (summarization, truncation, external memory) is the top production challenge. Author: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/anatomy-of-ai-agent/