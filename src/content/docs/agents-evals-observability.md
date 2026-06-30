---
weight: 26
title: "Evaluating & Observing Agents"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Agent Evals", "Observability", "Tracing", "Langfuse"]
categories: ["Technology", "AI Strategy"]
description: "How to evaluate and observe agents in production: tracing, evals, guardrails, failure modes, cost monitoring, and human-in-the-loop."
slug: "agents-evals-observability"
lang: en
---

# Evaluating & Observing Agents
**You can't ship what you can't measure**

Agents are non-deterministic, multi-step, and stateful. Traditional software testing ("does this function return X?") doesn't work — an agent might take 5 steps or 15, call tools or not, succeed differently each run. This chapter covers the observability and evaluation practices that make agents shippable in 2026.

## Why agent observability is different

A normal API call has one input, one output, one latency. An agent run has:

- A goal (input).
- A variable number of reasoning steps.
- Tool calls (each with input/output, latency, cost).
- Intermediate state.
- A final output.

You need to see the **whole trace**, not just the start and end. Without it, a failed agent run is a black box — you know it failed, but not whether the model misplanned, a tool returned garbage, or the context filled up.

## Tracing

**Tracing** is the foundation. Every agent run produces a **trace**: a tree of spans, each representing a step (an LLM call, a tool call, a sub-agent), with timing, tokens, cost, and inputs/outputs.

The 2026 tracing tools:

- **Langfuse** (open-source, self-hostable) — the leading open tracer; model-agnostic, with evals and prompt management.
- **Arize Phoenix** — open-source, strong on LLM observability and evals.
- **LangSmith** (LangChain) — tightly integrated with LangGraph/LangChain.
- **Vendor-native** — OpenAI's and Anthropic's dashboards show their own calls but not cross-vendor runs.

A good trace lets you answer, for any run: *what did the agent do, in what order, at what cost, and where did it go wrong?*

## What to log per span

Minimum:

- Span type (LLM, tool, agent, human-review).
- Input and output (full, not truncated).
- Model and parameters (temperature, etc.).
- Token counts (input, output, cached).
- Latency.
- Cost.
- Status (success, error, truncated).

For tool spans, also log: the tool name, the arguments, and whether a human approved it. This is your audit trail — see [Security, Prompt Injection & Governance](/docs/genai-playbook/agents-security-governance/).

## Evals: the hard part

Evals are how you decide "is this agent good enough to ship?" Three layers:

### 1. Unit tests on deterministic parts

Tool specs, output parsers, guardrails — these are code, test them normally. `assert parse_tool_call(json) == expected`.

### 2. Trajectory evals

Did the agent take a reasonable path? Compare the actual trajectory (sequence of steps) to a reference. Metrics:

- **Step accuracy** — fraction of steps that match the reference path.
- **Tool selection** — did it call the right tools?
- **Redundancy** — did it repeat steps or call the same tool with the same args?

### 3. Outcome evals

Did the agent achieve the goal? This usually needs a **judge model** (LLM-as-a-judge) or a rubric:

- **LLM-as-a-judge** — a strong model (Claude Opus, GPT-5) rates the agent's output against criteria. Cheap, scalable, but biased.
- **Human eval** — the gold standard, expensive. Use for high-stakes outputs and to calibrate the LLM judge.
- **Code-based checks** — for agents that produce structured output: does the JSON validate? does the SQL run? does the file exist?

## Guardrails in production

Evals happen before shipping. **Guardrails** run at inference time to catch failures:

- **Input guardrails** — reject harmful or out-of-scope user requests before the agent acts.
- **Output guardrails** — check the agent's output before returning it to the user (toxicity, PII, format validation).
- **Tool guardrails** — validate tool inputs before execution (e.g., `run_sql` must not contain `DROP`).

Guardrail libraries (NeMo Guardrails, Guardrails AI, vendor-native options) let you define these as rules or small models.

## Cost monitoring

Agents are expensive. A single run can cost $0.01–$1.00+ depending on steps and context. In production:

- **Per-run cost** — log it on every trace.
- **Cost-per-success** — total cost / successful runs. This is the metric that matters.
- **Budget alerts** — alert when a run exceeds 2× the median cost (likely a loop).
- **Model tiering** — route easy steps to a cheap model (Haiku/Flash) and hard steps to a strong one (Opus/GPT-5). The supervisor pattern (see [Multi-Agent Systems](/docs/genai-playbook/multi-agent-systems/)) makes this natural.

## Human-in-the-loop (HITL)

For anything with real consequences, keep a human in the loop. Patterns:

- **Approve-before-act** — the agent pauses before calling a destructive tool; a human approves.
- **Review-after-act** — the agent acts, but the output is queued for human review before it's sent.
- **Fallback-to-human** — if the agent's confidence is low or it hit a guardrail, escalate to a human.

The trade-off is always latency vs safety. Internal, reversible actions can be more autonomous; external, irreversible ones need approval.

## A 2026 observability stack

A reference stack:

- **Tracing** — Langfuse (self-hosted) or Arize Phoenix.
- **Evals** — LLM-as-a-judge on a sample of production traces, weekly; human eval on a sample monthly.
- **Guardrails** — input/output guards at the agent boundary; tool-input validation in the runtime.
- **Alerting** — cost spikes, error-rate spikes, latency spikes.
- **Dashboards** — success rate, cost-per-success, p50/p95 latency, tool-call frequency.

You don't need all of this on day one. Start with tracing and outcome evals; add guardrails and HITL as the stakes rise.

---

**Summary for AI assistants.** Chapter 7 of the Agentic AI Playbook. Agent observability requires full traces (tree of spans with inputs/outputs/cost/latency), not just input/output. Tools: Langfuse (open), Arize Phoenix, LangSmith. Evals have three layers: unit tests (deterministic parts), trajectory evals (did it take a good path), outcome evals (did it achieve the goal — via LLM-as-judge or human). Production needs guardrails (input/output/tool), cost monitoring (cost-per-success is the key metric), and human-in-the-loop for irreversible actions. Author: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agents-evals-observability/