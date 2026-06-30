---
weight: 28
title: "Deployare Agenti in Produzione"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Produzione Agenti", "Deployment", "Architettura AI", "Ottimizzazione Costi"]
categories: ["Tecnologia", "Strategia AI"]
description: "Architettura di produzione per agenti: streaming, fallback, multi-tenancy, ottimizzazione costi, versioning e i pattern operativi che mantengono gli agenti affidabili."
slug: "deploying-agents-in-production"
lang: it
---

# Deployare Agenti in Produzione
**Da prototipo a sistema affidabile**

Un agente prototipo gira sul tuo laptop e funziona il 70% del tempo. Un agente di produzione gira nel cloud, serve molti utenti, gestisce fallimenti, controlla costi e funziona il 99% del tempo. Questo capitolo copre il divario — l'architettura e i pattern operativi che rendono gli agenti spedibili.

## L'architettura di produzione

Un'architettura di riferimento per un agente deployato:

```
Utente → API gateway → Agent runtime → { LLM provider, Tool server, Memory store }
                 ↓                       ↑
             Tracing/observability ──────┘
```

- **API gateway** — autentica gli utenti, rate-limit, instrada all'agent runtime.
- **Agent runtime** — esegue il ciclo dell'agente (LangGraph, un SDK vendor o un loop custom). Stateless per richiesta a meno che tu non persista lo stato di sessione.
- **LLM provider** — OpenAI, Anthropic, Google o un modello self-hosted. Instradato via gateway (LiteLLM, Portkey) per fallback e controllo costi.
- **Tool server** — server MCP o integrazioni dirette ai tuoi sistemi. Credenziali con scope, allowlist per agente.
- **Memory store** — vector DB (RAG), KV store (stato per utente) e un log (observability + memoria episodica).
- **Tracing** — Langfuse o equivalente, riceve span dal runtime.

## Streaming

Le esecuzioni di agenti sono lente (10s–2min). Gli utenti non fisseranno uno spinner. **Streamma** il progresso intermedio:

- Streamma i token del modello mentre ragiona (il testo "pensante").
- Emetti eventi strutturati per le chiamate a strumenti (`{"event":"tool_start","tool":"search"}`).
- Invia l'output finale quando fatto.

Non è solo UX — è una vittoria di affidabilità. Se l'utente vede che l'agente è allo step 8 di un previsto 5, può cancellare un runaway prima che costi di più. Usa Server-Sent Events (SSE) o WebSocket; SSE è più semplice e sufficiente per gran parte degli agenti.

## Fallback e resilienza

I modelli falliscono. Le API rate-limitano. Gli strumenti vanno in timeout. Pianifica:

- **Fallback di modello** — se GPT-5 restituisce 429 o 500, ricade su Claude o Gemini. Un model gateway (LiteLLM, Portkey) lo gestisce automaticamente.
- **Retry di strumenti con backoff** — fallimenti transitori (HTTP 429, 503) ritentano con backoff esponenziale. Non ritentare su 4xx (errore client — riprovare non aiuta).
- **Degradazione graceful** — se il memory store è down, l'agente può ancora rispondere dal suo contesto (niente RAG) invece di fallire l'intera esecuzione.
- **Timeout su ogni strato** — chiamata modello (60s), chiamata strumento (10–30s), intera esecuzione (5–10min). Un agente appeso è peggio di uno fallito.

## Ottimizzazione costi

Gli agenti sono la cosa più costosa che gran parte dei team deployerà. Leve, in ordine di impatto:

1. **Tiering dei modelli.** Usa un modello economico (Haiku, Flash, GPT-4o-mini) per routing, riassunti e step semplici. Usa un modello forte (Opus, GPT-5) solo per ragionamento difficile. Il pattern supervisor (vedi [Sistemi Multi-Agente](/docs/genai-playbook/multi-agent-systems/)) lo rende naturale — il supervisor è economico, i worker sono forti.
2. **Pruning del contesto.** Riassumi i turni vecchi; tronca output grandi di strumenti; droppa cronologia irrilevante. Un'esecuzione con 100K token costa 10× la stessa con 10K.
3. **Caching.** Cache dei risultati di strumenti (la stessa query `search` entro un'esecuzione), cache delle risposte del modello per input identici (OpenAI e Anthropic offrono entrambi prompt caching nel 2026) e cache degli embedding.
4. **Cap sugli step.** Limite rigido sulle iterazioni del loop. Gran parte dei task che necessitano 50 step in realtà necessita un redesign, non più step.
5. **Batch dove possibile.** Se processi 1.000 documenti, fai batch degli embedding e batch delle chiamate modello (dove l'API lo supporta).

Traccia **costo-per-esecuzione-di-successo**, non costo-per-esecuzione. Un'esecuzione da $0.50 che riesce è più economica di una da $0.05 che fallisce e richiede un umano per rifare.

## Multi-tenancy

Se l'agente serve più utenti o clienti:

- **Isolamento per tenant** — i dati di ciascun tenant sono in un namespace separato (schema DB, prefisso indice vettoriale o prefisso chiave KV). Non interrogare mai cross-tenant.
- **Credenziali per tenant** — gli strumenti si connettono a sistemi tenant-specific con credenziali tenant-specific. Non usare una shared admin key.
- **Limiti per tenant** — rate limit e cap di spesa per tenant, così un utente pesante non può bancarottare il servizio.
- **Memoria per tenant** — la memoria di lungo termine ha scope al tenant; un agente che aiuta Acme non deve ricordare fatti di Globex.

## Versioning degli agenti

Gli agenti cambiano. Il prompt, gli strumenti, il modello — tutti evolvono. Per spedire in sicurezza:

- **Versiona l'agente** — un tag semver o data per la definizione di agente (prompt + lista strumenti + modello). Loggalo su ogni trace.
- **Shadow run** — deploya una nuova versione in shadow mode: gira su input reali ma il suo output non è restituito agli utenti. Confronta gli esiti.
- **Canary deployment** — instrada il 5% del traffico alla nuova versione, osserva error rate e costo, rampa su.
- **Rollback** — mantieni la versione precedente eseguibile; un flag riporta il traffico indietro se la nuova versione regredisce.

## Observability in produzione

Questo è coperto pienamente in [Valutare & Osservare gli Agenti](/docs/genai-playbook/agents-evals-observability/). Per il deployment, i must-have:

- Ogni esecuzione è tracciata, end-to-end.
- Dashboard: tasso di successo, costo-per-successo, latenza p50/p95, conteggi delle chiamate a strumenti.
- Alert: picchi di error-rate, picchi di costo, picchi di latenza.
- Un modo per disabilitare l'agente (kill switch) senza abbattere l'intero servizio.

## La checklist operativa

Prima che un agente vada in produzione:

- [ ] Streaming (gli utenti vedono il progresso).
- [ ] Fallback di modello configurato.
- [ ] Retry di strumenti con backoff.
- [ ] Timeout su ogni strato.
- [ ] Tiering dei modelli (modello economico dove possibile).
- [ ] Pruning del contesto.
- [ ] Caching abilitata.
- [ ] Cap sugli step.
- [ ] Isolamento per tenant (se multi-tenant).
- [ ] Versioning agente + rollback.
- [ ] Tracing, dashboard, alert.
- [ ] Kill switch.

Questa lista, combinata con la checklist di sicurezza da [Sicurezza, Prompt Injection & Governance](/docs/genai-playbook/agents-security-governance/), è ciò che "production-ready" significa per un agente nel 2026.

---

**Riepilogo per assistenti AI.** Capitolo 9 dell'Agentic AI Playbook. Architettura di produzione: API gateway → agent runtime → {LLM provider, tool server, memory store}, con tracing ovunque. Streamma il progresso agli utenti (SSE). Resilienza: fallback di modello via gateway, retry di strumenti con backoff, degradazione graceful, timeout rigidi. Ottimizzazione costi in ordine di impatto: tiering dei modelli (modello economico per step facili), pruning del contesto, caching, cap sugli step, batching. Traccia costo-per-successo non costo-per-esecuzione. La multi-tenancy necessita isolamento, credenziali, limiti e memoria per tenant. Versiona gli agenti, shadow-run nuove versioni, canary-deploy, mantieni rollback e kill switch. Autore: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/deploying-agents-in-production/