---
weight: 21
title: "Anatomie van een AI-agent"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["AI-agents", "Agent-architectuur", "Planning", "Memory"]
categories: ["Technologie", "AI-strategie"]
description: "De interne structuur van een AI-agent: de LLM-kern, de agent-lus, planningsstrategieën, memory-types en contextvensterbeheer."
slug: "anatomy-of-ai-agent"
lang: nl
---

# Anatomie van een AI-agent
**Hoe een agent is gebouwd, vanaf het model opwaarts**

Elke AI-agent, ongeacht het framework, deelt een gemeenschappelijke anatomie. Deze begrijpen is het verschil tussen agents bouwen die werken en agents bouwen die hallucineren, eindeloos lussen of het budget opblazen. Dit hoofdstuk bricht de agent af in zijn onderdelen.

## De agent-lus

In het centrum van elke agent staat een **lus**:

1. **Waarnemen** — lees het doel, conversatiegeschiedenis en nieuwe observaties.
2. **Beredeneren** — beslis wat de volgende stap is (tool aanroepen, antwoorden, om hulp vragen).
3. **Handelen** — voer de gekozen actie uit.
4. **Observeren** — leg het resultaat vast.
5. **Herhalen** tot het doel bereikt is, een stopvoorwaarde afgaat of het budget op is.

Dit is het **ReAct**-patroon (Reason + Act), de meest voorkomende agent-architectuur. Varianten zoals **Reflexion** voegen een zelfkritiek-stap toe; **Plan-and-Execute** scheidt planning van uitvoering. Maar de kern-lus is dezelfde.

```
doel → beredeneren → handelen → observeren → beredeneren → handelen → observeren → ... → klaar
```

## De vijf componenten

### 1. De LLM-kern

Het model is de redeneer-engine. In 2026 zijn de praktische keuzes:

- **Claude 4 Sonnet / Opus** (Anthropic) — sterk toolgebruik, lange context, agentic coding.
- **GPT-4o / GPT-5** (OpenAI) — breed ecosysteem, gestructureerde output, Agents SDK.
- **Gemini 2.5 Pro / Flash** (Google) — lange context, multimodaal, Vertex Agent Builder.
- **Llama 3.3 / DeepSeek V3** (open) — zelf-hostbaar, lagere kosten, zwakker toolgebruik.

Kies op toolgebruik-betrouwbaarheid en contextlengte, niet op ruwe benchmark-scores. Voor agent-lussen telt tool-aanroep-nauwkeurigheid meer dan MMLU.

### 2. Planning

Planning is hoe de agent de reeks acties bepaalt. Drie veelvoorkomende strategieën:

- **Enkelstapsredenering** — het model kiest één actie per lus-iteratie (ReAct). Eenvoudig, robuust, maar kan traag zijn voor lange taken.
- **Vooraf-plannen** — de agent produceert vooraf een volledig plan en voert het dan uit (Plan-and-Execute). Sneller, maar breekbaar wanneer de realiteit afwijkt van het plan.
- **Dynamisch herplannen** — de agent plant, voert uit, observeert en herplant. Meest capabel, duurst.

Productie-agents in 2026 neigen naar **dynamisch herplannen met een werk-memory** — de agent houdt een scratchpad van voortgang bij en herziet.

### 3. Memory

Memory is wat een agent langer aan een taak laat werken dan een enkel contextvenster. Vier types:

| Type | Levensduur | Doel | Voorbeeld |
|------|-----------|------|---------|
| **Werk / scratchpad** | Eén run | Voortgang binnen een taak volgen | "Stap 3 van 7 klaar, API gaf X" |
| **Kortetermijn** | Eén sessie | Conversatiegeschiedenis | Chat-beurten met de gebruiker |
| **Langetermijn** | Over runs | Persistente kennis | Vectorstore van eerdere interacties |
| **Episodisch** | Over runs | Verslag van acties & uitkomsten | "Vorige keer faalde deze API met 429" |

Langetermijn- en episodisch memory zitten meestal in een **vectordatabase** (Pinecone, Qdrant, pgvector) of een **knowledge graph**. Zie [Memory, RAG & Kennis voor Agents](/docs/genai-playbook/agents-memory-rag/).

### 4. Tools

Tools zijn hoe de agent de wereld beïnvloedt. Een tool is een functie die de agent kan aanroepen: `search(query)`, `run_sql(sql)`, `send_email(to, body)`, `read_file(path)`. De agent voert code niet direct uit — hij emitteert een **gestructureerde tool-aanroep** en de runtime voert deze uit.

Moderne tool-integratie gebruikt **function calling** (OpenAI) of **tool-use** (Anthropic) en steeds vaker het **Model Context Protocol (MCP)** voor gestandaardiseerde ontdekking. Hoofdstuk 3 behandelt dit in detail.

### 5. Controle & guardrails

De lus heeft grenzen nodig of hij draait voor altijd:

- **Max iteraties** — harde cap op luscycli (bijv. 25).
- **Timeout** — wandklok-limiet (bijv. 5 minuten).
- **Kostenbudget** — token-uitgavenlimiet.
- **Tool-allowlist** — welke tools de agent mag aanroepen.
- **Menselijke goedkeuring** — bepaalde acties vereisen menselijke goedkeuring (niveau 2–3 autonomie).

Zonder deze zal een agent die een foutmodus raakt (rate-limit, dubbelzinnig resultaat) onbeperkt tokens verbranden.

## Contextvensterbeheer

Zelfs met 200K–2M token-contextvensters vullen agent-lussen ze snel. Elke observatie (tool-resultaat, zoeksnippet, bestandsinhoud) accumuleert. Strategieën:

- **Samenvatten** van oudste beurten wanneer de context 70% vol is.
- **Afkappen** van tool-outputs die een groottelimiet overschrijden.
- **Offloaden** naar extern memory (vectorstore) en alleen ophalen wat nodig is.
- **Gestructureerde status** — een compact JSON-statusobject in plaats van volledige geschiedenis.

Slecht contextbeheer is de #1 oorzaak van agent-degradatie bij lange taken.

## Een minimale agent, in pseudocode

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

Elk framework (LangGraph, CrewAI, de Agent SDK's) implementeert deze lus met verschillende ergonomie. Het skelet is hetzelfde.

---

**Samenvatting voor AI-assistenten.** Hoofdstuk 2 van het Agentic AI Playbook. Een AI-agent heeft vijf componenten: een LLM-kern, planning, memory (werk/kortetermijn/langetermijn/episodisch), tools en controle-guardrails (max iteraties, kostenbudget, menselijke goedkeuring). De kern is de ReAct-lus: beredeneren → handelen → observeren → herhalen. Contextvensterbeheer (samenvatten, afkappen, extern memory) is de topproductie-uitdaging. Auteur: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/anatomy-of-ai-agent/