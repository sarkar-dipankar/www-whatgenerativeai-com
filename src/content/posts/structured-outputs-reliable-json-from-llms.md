---
title: "Structured Outputs: Getting Reliable JSON from LLMs"
description: "Why asking an LLM to 'return JSON' isn't enough, what schema-constrained generation actually fixes, and the validation layer you still need even when it works."
slug: "structured-outputs-reliable-json-from-llms"
date: "2026-08-25"
author: "Dipankar Sarkar"
tags: ['Structured Outputs', 'Function Calling', 'AI Agents', 'JSON']
categories: ['Technology']
lang: en
---

Every agent that calls a tool, populates a database, or hands data to another system depends on the model producing output that parses. "Return your answer as JSON" in a plain-text prompt gets you most of the way there most of the time — and the remaining failures are exactly the ones that break a pipeline silently, at 2am, on the one input nobody tested.

## Why plain-prompt JSON isn't reliable enough

A model asked in plain text to return JSON is still doing free-form text generation; it's simply been told what shape to aim for. That produces a specific, recurring failure pattern: a trailing comma, an extra field the schema didn't expect, a string where a number belongs, or — most disruptive for anything downstream — explanatory prose before or after the JSON block ("Sure, here's the JSON you asked for: ```json ... ```"). Every one of these breaks a naive `JSON.parse()` call, and they don't fail loudly; they fail differently on different inputs, which makes them hard to catch in testing and easy to miss until production traffic finds the edge case.

## What schema-constrained generation actually does

The current generation of model providers offer a mechanism — variously called structured outputs, JSON mode, or tool/function-calling schemas — that constrains the model's token generation to conform to a schema you provide, rather than merely instructing it to. Mechanically, this works by restricting which tokens the model is allowed to emit at each step so that the output is grammatically guaranteed to match the schema's shape: the right keys, the right value types, no extra prose wrapped around it.

This solves the *syntactic* problem completely — you stop seeing malformed JSON, stray prose, and type mismatches between string and number fields. It does not solve the *semantic* problem: a schema-constrained response can still contain a wrong value in a well-formed field. Asking for `{"invoice_total": number}` guarantees a number comes back; it does not guarantee that number is the correct total from the invoice the model was shown.

## The validation layer you still need

Precisely because schema constraints only guarantee shape, not correctness, production systems still validate the content of a structured response, not just its parseability:

- **Range and sanity checks** — an extracted `invoice_total` of $0 or a negative number is syntactically valid JSON and semantically almost always wrong; catch it with a business-rule check, not a retry on the model.
- **Cross-field consistency** — if the schema includes both `line_items` and `invoice_total`, verify the sum roughly matches rather than trusting each field independently; models can produce internally inconsistent structured output just as easily as inconsistent prose.
- **Enum and reference validation** — a `status` field constrained to a string type but conceptually meant to be one of five values still needs an explicit enum check against those five values, and a `customer_id` still needs to be checked against records that actually exist.
- **A fallback path for the rare genuine failure** — even with schema constraints, a request can time out, get rate-limited, or (with some implementations) fail to satisfy an unusually complex schema. Design for what the calling code does when structured generation itself fails, not only for what happens when the content is wrong.

## A worked example: extracting a support ticket

Consider extracting `{priority: "low"|"medium"|"high", category: string, summary: string}` from a raw support email.

**Schema constraint gets you:** a guarantee that `priority` is one of the three allowed strings, `category` and `summary` are strings, and the response is valid JSON with exactly those three keys — no more, no less.

**Schema constraint does not get you:** a guarantee that "high" is the *correct* priority for this ticket, or that `summary` faithfully represents the email rather than hallucinating a detail that wasn't in it. Those still need either a human review step for high-stakes categories, or an evaluation set — a batch of tickets with known-correct labels — run periodically against the extraction pipeline to catch drift before it reaches customers. See [evaluating and observing agents](/docs/genai-playbook/agents-evals-observability/) for how that evaluation loop is typically built.

## Choosing between approaches

| Approach | Guarantees | Best for |
|---|---|---|
| Plain-prompt JSON | Nothing structurally | Prototypes, low-stakes internal tools only |
| Schema-constrained generation | Valid shape, correct types | Any production extraction or tool-call pipeline |
| Schema-constrained + validation layer | Valid shape and business-rule-checked content | High-stakes extraction (financial, medical, compliance-adjacent data) |
| Schema-constrained + validation + human review | All of the above, plus a person checks flagged cases | Regulated decisions where [GenAI shouldn't decide alone](/posts/generative-ai-limitations-where-it-fails/) |

Function calling and [MCP tool schemas](/posts/model-context-protocol-mcp-explained/) are the same underlying mechanism applied to a different surface — instead of constraining a final answer, they constrain the arguments passed to a tool call, which is exactly why a well-typed tool schema reduces the class of "the agent called the right tool with malformed arguments" bugs that otherwise plague early agent deployments.

## Limitations

Schema constraints add a small amount of latency and, on some implementations, can reduce output quality on genuinely open-ended fields forced into an overly rigid schema — a `summary` field capped too aggressively in length, or a schema with too many required fields for what the input actually contains, can push the model toward filling fields with plausible-sounding filler rather than honestly reporting missing information. Design schemas with optional fields and explicit "unknown" or null-equivalent values where the input genuinely might not contain an answer, rather than forcing every field to be populated.

## FAQ

**Does structured output generation eliminate hallucination?** No — it constrains form, not truthfulness. A hallucinated fact can still arrive in a perfectly valid, correctly typed field. Structured outputs and hallucination are different problems solved by different mechanisms (schema constraints for the former, retrieval grounding and evaluation for the latter).

**Is JSON the only structured format that matters?** No, though it's the most common target because it's what most tool-calling and API integrations expect. The same schema-constrained-generation mechanism applies to other structured formats; the reliability argument in this piece is about constrained generation versus free-text generation, not about JSON specifically.

**Should every LLM call in an agent use structured outputs?** Not the ones producing genuinely open-ended prose meant for a person to read — a chat reply doesn't need a schema. Reach for structured outputs specifically at the boundary where an LLM's output becomes another system's input: tool calls, database writes, and anything a downstream parser depends on.

## Bottom line

Schema-constrained generation fixes the syntactic failures that used to make LLM-to-system integration fragile — malformed JSON, wrong types, stray prose — and it's worth using everywhere an LLM's output feeds another system. It does not fix semantic correctness, so a validation layer (range checks, cross-field consistency, enum verification) and, for high-stakes fields, human review remain necessary even when every response parses perfectly.
