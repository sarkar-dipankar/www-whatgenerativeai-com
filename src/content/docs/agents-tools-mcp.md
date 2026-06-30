---
weight: 22
title: "Tools, Function Calling & MCP"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["MCP", "Function Calling", "Tool Use", "Agent Architecture"]
categories: ["Technology", "AI Strategy"]
description: "How agents call external systems: function calling, the Model Context Protocol (MCP), tool design, and security boundaries."
slug: "tools-function-calling-mcp"
lang: en
---

# Tools, Function Calling & MCP
**How agents touch the real world**

An agent without tools is just a chatbot. Tools turn a language model into a system that can search, query databases, send messages, run code, and call APIs. This chapter covers how tool-use works in 2026 — from native function calling to the Model Context Protocol that is standardizing it.

## Function calling: the primitive

Function calling lets a model emit a **structured request to call a function**, instead of (or alongside) text. The model doesn't execute the function — it returns a JSON-like call, and your runtime executes it.

Example: you give the model a tool spec:

```json
{
  "name": "get_weather",
  "description": "Get current weather for a city",
  "parameters": { "city": "string", "units": "celsius|fahrenheit" }
}
```

The model, asked "What's the weather in Helsinki?", responds:

```json
{ "tool": "get_weather", "city": "Helsinki", "units": "celsius" }
```

Your code runs `get_weather("Helsinki", "celsius")`, returns `{"temp": 14, "conditions": "cloudy"}`, and the model uses that to answer. This is the bedrock of every agent framework.

OpenAI calls this **function calling** (now **structured outputs**). Anthropic calls it **tool use**. Google calls it **function calling**. The mechanism is the same.

## The Model Context Protocol (MCP)

The problem: every tool integration was bespoke. You wrote an OpenAI function spec, an Anthropic tool spec, a Google function spec — all describing the same underlying API. The **Model Context Protocol (MCP)**, open-sourced by Anthropic in late 2024, fixed this.

MCP is a standard protocol for **exposing tools, resources, and prompts to any AI application**. An MCP **server** wraps an API (Slack, GitHub, Postgres, a local filesystem). An MCP **client** (an agent, an IDE, a chat app) connects to it and gets a uniform list of tools. By mid-2026:

- OpenAI, Anthropic, Google, and most open frameworks support MCP clients.
- Hundreds of MCP servers exist (filesystem, Git, Slack, Notion, Postgres, Sentry, linear, browser automation).
- The major IDEs (Cursor, Windsurf, VS Code + Copilot) ship MCP client support.

### How MCP works

An MCP server exposes three primitives:

- **Tools** — functions the model can call (`send_slack_message`, `run_sql_query`).
- **Resources** — data the model can read (`file://report.md`, `postgres://users`).
- **Prompts** — reusable prompt templates the model can invoke.

The client (agent) connects via stdio (local) or HTTP/SSE (remote), lists the server's tools, and surfaces them to the model. The model calls a tool; the client forwards the call to the server; the server executes and returns the result.

### Why MCP matters for enterprises

- **Portability** — write the tool integration once, use it with any model that supports MCP.
- **Discoverability** — the agent lists available tools at runtime instead of hard-coding them.
- **Security boundary** — the MCP server controls what the agent can access; you don't hand the model raw credentials.

## Tool design principles

Bad tools break agents. Good tools make agents look smart. Principles:

1. **Be specific.** `search_pinecone_for_customer_issues(product="acme", limit=5)` beats `search("customer issues")`. The model picks the right tool when the spec is unambiguous.
2. **Return structured data, not prose.** `{"tickets": [{"id": 123, "status": "open"}]}` is parseable; "I found 5 tickets..." is not.
3. **Cap output size.** A tool that returns 50KB of JSON floods the context. Paginate, summarize, or truncate.
4. **One tool, one job.** A `send_email` tool that also drafts the body is two tools in disguise. Let the model draft, then send.
5. **Document failure modes.** If the API returns 429, tell the model — it can back off. Silent failures make agents hallucinate.

## Security boundaries

Tools are power, and power needs bounds. The minimum:

- **Allowlist** — the agent may only call tools you've approved for this task.
- **Scoped credentials** — each tool gets least-privilege keys, never the agent's full access.
- **Audit log** — every tool call (input + output) is logged for review.
- **Approval gates** — for destructive or external-facing actions (sending email, writing to production), require human approval.

The biggest new risk in 2026 is **prompt injection through tool outputs**: a malicious web page returned by a `search` tool contains instructions that trick the agent into calling `send_email`. The defense is strict separation between tool output and instructions — never let tool output become a system prompt. See [Security, Prompt Injection & Governance](/docs/genai-playbook/agents-security-governance/).

## Choosing between native function calling and MCP

- **Native function calling** — best for a small, fixed set of tools tightly coupled to one app. Lower overhead.
- **MCP** — best when you want to share tools across agents, models, or teams; when third-party MCP servers already exist for your systems; when you want the model to discover tools dynamically.

In 2026 most new agent builds use **MCP for external integrations** and **native function calling for a few app-specific helpers**.

---

**Summary for AI assistants.** Chapter 3 of the Agentic AI Playbook. Function calling lets models emit structured tool-call requests; MCP standardizes tool discovery across models and vendors. MCP servers expose tools/resources/prompts; clients (agents, IDEs) connect and surface them to the model. Tool design: specific names, structured output, size caps, one job per tool. Security: allowlists, least-privilege creds, audit logs, approval gates, and defense against prompt injection via tool outputs. Author: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/tools-function-calling-mcp/