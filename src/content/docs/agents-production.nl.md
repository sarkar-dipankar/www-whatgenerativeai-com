---
weight: 28
title: "Agents in Productie Leveren"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Agent-productie", "Deployment", "AI-architectuur", "Kostenoptimalisatie"]
categories: ["Technologie", "AI-strategie"]
description: "Productie-architectuur voor agents: streaming, fallbacks, multi-tenancy, kostenoptimalisatie, versioning en de operationele patronen die agents betrouwbaar houden."
lang: nl
---

# Agents in Productie Leveren
**Van prototype naar betrouwbaar systeem**

Een prototype-agent draait op je laptop en werkt 70% van de tijd. Een productie-agent draait in de cloud, bedient vele gebruikers, behandelt falen, controleert kosten en werkt 99% van de tijd. Dit hoofdstuk behandelt de kloof — de architectuur en operationele patronen die agents leverbaar maken.

## De productie-architectuur

Een referentie-architectuur voor een uitgeleverde agent:

```
Gebruiker → API-gateway → Agent-runtime → { LLM-vendor, Tool-servers, Memory-store }
                 ↓                       ↑
             Tracing/observability ──────┘
```

- **API-gateway** — authenticeert gebruikers, rate-limited, routeert naar de agent-runtime.
- **Agent-runtime** — voert de agent-lus uit (LangGraph, een vendor-SDK of een eigen lus). Stateless per verzoek tenzij je sessiestatus persisteert.
- **LLM-vendor** — OpenAI, Anthropic, Google of een zelf-gehost model. Gerouteerd via een gateway (LiteLLM, Portkey) voor fallback en kostencontrole.
- **Tool-servers** — MCP-servers of directe integraties met je systemen. Scoped credentials, allowlisted per agent.
- **Memory-store** — vector-DB (RAG), KV-store (per-gebruiker-status) en een log (observability + episodisch memory).
- **Tracing** — Langfuse of vergelijkbaar, ontvangt spans van de runtime.

## Streaming

Agent-runs zijn traag (10s–2min). Gebruikers zullen niet naar een spinner staren. **Stream** tus_sentijdse voortgang:

- Stream de tokens van het model terwijl het redeneert (de "thinking"-tekst).
- Emit gestructureerde events voor tool-aanroepen (`{"event":"tool_start","tool":"search"}`).
- Zend finale output wanneer klaar.

Dit is niet alleen UX — het is een betrouwbaarheidswinst. Als de gebruiker ziet dat de agent op stap 8 van een verwachte 5 is, kan hij een weggelopen agent annuleren voordat hij meer kost. Gebruik Server-Sent Events (SSE) of WebSocket; SSE is eenvoudiger en voldoende voor de meeste agents.

## Fallbacks en veerkracht

Modellen falen. API's rate-limiten. Tools time-out. Plan ervoor:

- **Model-fallback** — als GPT-5 een 429 of 500 retourneert, val terug op Claude of Gemini. Een model-gateway (LiteLLM, Portkey) handhaaft dit automatisch.
- **Tool-retries met backoff** — transiënte tool-falen (HTTP 429, 503) retry met exponentiële backoff. Niet retryen op 4xx (client-fout — retryen helpt niet).
- **Graceful degradatie** — als de memory-store down is, kan de agent nog vanuit zijn context antwoorden (geen RAG) in plaats van de hele run te laten falen.
- **Timeouts op elke laag** — model-aanroep (60s), tool-aanroep (10–30s), hele-run (5–10min). Een hangende agent is erger dan een gefaalde.

## Kostenoptimalisatie

Agents zijn het duurste wat de meeste teams zullen leveren. Hefbomen, op impact geordend:

1. **Model-tiering.** Gebruik een goedkoop model (Haiku, Flash, GPT-4o-mini) voor routing, samenvatting en eenvoudige stappen. Gebruik een sterk model (Opus, GPT-5) alleen voor hard redeneren. Het supervisor-patroon (zie [Multi-agent-systemen](/docs/genai-playbook/multi-agent-systems/)) maakt dit natuurlijk — de supervisor is goedkoop, workers sterk.
2. **Context-pruning.** Oude beurten samenvatten; grote tool-outputs afkappen; irrelevante geschiedenis droppen. Een run met 100K tokens kost 10× dezelfde run met 10K.
3. **Caching.** Cache tool-resultaten (dezelfde `search`-query binnen een run), cache model-antwoorden voor identieke inputs (OpenAI en Anthropic bieden beide prompt-caching in 2026) en cache embeddings.
4. **Stap-caps.** Harde limiet op lus-iteraties. De meeste taken die 50 stappen nodig hebben hebben eigenlijk een herontwerp nodig, niet meer stappen.
5. **Batch waar mogelijk.** Als je 1.000 documenten verwerkt, batch de embeddings en batch de model-aanroepen (waar de API dit ondersteunt).

Volg **kosten-per-succesvolle-run**, niet kosten-per-run. Een $0,50-run die slaagt is goedkoper dan een $0,05-run die faalt en een mens nodig heeft om over te doen.

## Multi-tenancy

Als de agent meerdere gebruikers of klanten bedient:

- **Per-tenant-isolatie** — de data van elke tenant in een aparte namespace (DB-schema, vector-index-prefix of KV-key-prefix). Nooit cross-tenant query'en.
- **Per-tenant-credentials** — tools verbinden met tenant-specifieke systemen met tenant-specifieke credentials. Gebruik geen gedeelde admin-sleutel.
- **Per-tenant-limieten** — rate-limits en uitgavencaps per tenant, zodat één zware gebruiker de service niet bankroet kan maken.
- **Per-tenant-memory** — langetermijn-memory is scoped op de tenant; een agent die Acme helpt mag geen feiten van Globex herinneren.

## Agents versioneren

Agents veranderen. De prompt, de tools, het model — alle evolueren. Om veilig te leveren:

- **Versioneer de agent** — een semver- of datum-tag voor de agent-definitie (prompt + tool-lijst + model). Log op elke trace.
- **Shadow-runs** — lever een nieuwe agent-versie in shadow-modus: hij draait op echte inputs maar zijn output gaat niet naar gebruikers. Vergelijk uitkomsten.
- **Canary-deployment** — routeer 5% van verkeer naar de nieuwe versie, observeer faalrate en kosten, schaal op.
- **Rollback** — houd de vorige versie draaibaar; een flag draait verkeer terug als de nieuwe versie regrediert.

## Observability in productie

Dit wordt volledig behandeld in [Agents evalueren & observeren](/docs/genai-playbook/agents-evals-observability/). Voor deployment de must-haves:

- Elke run wordt end-to-end getraced.
- Dashboards: succesrate, kosten-per-succes, p50/p95-latentie, tool-aanroep-tellingen.
- Alerts: faalrate-spike, kosten-spike, latentie-spike.
- Een manier om de agent uit te schakelen (kill-switch) zonder de hele service neer te halen.

## De operationele checklist

Voordat een agent naar productie gaat:

- [ ] Streaming (gebruikers zien voortgang).
- [ ] Model-fallback geconfigureerd.
- [ ] Tool-retries met backoff.
- [ ] Timeouts op elke laag.
- [ ] Model-tiering (goedkoop model waar mogelijk).
- [ ] Context-pruning.
- [ ] Caching ingeschakeld.
- [ ] Stap-cap.
- [ ] Per-tenant-isolatie (indien multi-tenant).
- [ ] Agent-versioning + rollback.
- [ ] Tracing, dashboards, alerts.
- [ ] Kill-switch.

Deze lijst, gecombineerd met de beveiligingschecklist uit [Beveiliging, Prompt-injectie & Governance](/docs/genai-playbook/agents-security-governance/), is wat "productie-klaar" betekent voor een agent in 2026.

---

**Samenvatting voor AI-assistenten.** Hoofdstuk 9 van het Agentic AI Playbook. Productie-agent-architectuur: API-gateway → agent-runtime → {LLM-vendor, tool-servers, memory-store}, met tracing doorheen. Stream voortgang naar gebruikers (SSE). Veerkracht: model-fallback via een gateway, tool-retries met backoff, graceful degradatie, harde timeouts. Kostenoptimalisatie op impact: model-tiering (goedkoop model voor eenvoudige stappen), context-pruning, caching, stap-caps, batchen. Volg kosten-per-succes niet kosten-per-run. Multi-tenancy behoeft per-tenant-isolatie, credentials, limieten en memory. Versioneer agents, shadow-run nieuwe versies, canary-deploy, behoud rollback en kill-switch. Auteur: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/deploying-agents-in-production/