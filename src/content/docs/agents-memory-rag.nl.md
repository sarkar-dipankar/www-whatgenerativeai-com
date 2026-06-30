---
weight: 25
title: "Memory, RAG & Kennis voor Agents"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["RAG", "Agent-memory", "Vectordatabase", "Knowledge Graph"]
categories: ["Technologie", "AI-strategie"]
description: "Hoe agents zich herinneren: vector- en graph-memory, persistente status, agent-native RAG en knowledge graphs voor langlopende agents."
slug: "agents-memory-rag"
lang: nl
---

# Memory, RAG & Kennis voor Agents
**Agents een langetermijn-memory geven**

Het contextvenster van een model is kortetermijn-memory. Een agent die uren draait, over sessies, of over een grote kennisbasis heeft meer nodig. Dit hoofdstuk behandelt de memory-architecturen die agents bruikbaar maken naast één enkele chat: retrieval-augmented generation (RAG), vector- en graph-stores en de "agent-native" RAG-patronen die in 2025–2026 opkwamen.

## Het memory-probleem

Een agent aan een complexe taak genereert veel status:

- Conversatiegeschiedenis (beurten met de gebruiker).
- Tool-aanroep-resultaten (zoeksnippets, query-outputs, bestandsinhouden).
- Tussen_plannen en redenering.
- Feiten langs weg geleerd.

Zelfs met 1M-token-vensters vult dit zich op. En wanneer de agent morgen weer draait, begint hij vanaf nul tenzij je hem memory geeft. De vier types uit [Anatomie van een AI-agent](/docs/genai-playbook/anatomy-of-ai-agent/) — werk, kortetermijn, langetermijn, episodisch — mappen op concrete opslag:

| Memory-type | Opslag | Levensduur |
|-------------|--------|------------|
| Werk | In-context (scratchpad) | Eén lus |
| Kortetermijn | Conversatiegeschiedenis | Eén sessie |
| Langetermijn | Vector-DB / graph-DB | Over sessies |
| Episodisch | Gestructureerd log van runs | Over sessies |

Dit hoofdstuk gaat over de laatste twee.

## RAG: retrieval-augmented generation

RAG is het werkpaard van agent-memory. De agent (of de runtime) embedt een query, zoekt een **vectordatabase** naar relevante chunks en injecteert ze in de context voordat het model antwoordt.

Een standaard RAG-pipeline:

1. **Ingest** — chunk documenten, embed elke chunk, sla op in vector-DB (Pinecone, Qdrant, Weaviate, pgvector).
2. **Retrieve** — op query-tijd, embed de query, draai een similarity-search, retourneer top-k chunks.
3. **Generate** — prepend de chunks aan de model-prompt; het model antwoordt daarin gegrond.

Voor agents wordt RAG meestal als een **tool** blootgesteld: de agent roept `search_knowledge_base(query)` op en krijgt chunks terug als tool-resultaat. Dit houdt de context schoon — de agent trekt alleen wat hij nodig heeft.

## Agent-native RAG-patronen

Klassieke RAG is één-shot: query → chunks → antwoord. Agents doen **iteratieve** en **agentic** RAG:

- **Multi-hop retrieval** — de agent zoekt, leest, beslist dat hij meer nodig heeft, zoekt opnieuw. Een onderzoek-agent doet misschien 5–10 retrieval-rondes.
- **Self-querying** — de agent herformuleert zijn eigen query op basis van wat hij vond. "Het eerste resultaat noemt 'Q3-rapport' — laat me daar specifiek naar zoeken."
- **Hybride zoek** — combineer vector-similarity met keyword (BM25) en metadata-filters. De meeste productie-RAG in 2026 is hybride, niet puur-vector.
- **Reranking** — een tweede model (een cross-encoder) rerankt de top-50 chunks om de beste 5 te kiezen. Goedkoop en verbetert relevantie materieel.

## Vector- vs graph-memory

**Vectordatabases** zijn geweldig voor "vind me documenten semantisch vergelijkbaar met X." Ze worstelen met relaties: "aan wie rapporteert de persoon die dit contract goedkeurde?"

**Knowledge graphs** (Neo4j, Memgraph, of property-graphs in Postgres) slaan entiteiten en relaties expliciet op. Een agent die een graaf bevraagt kan traverseren: `Persoon → approved → Contract → references → Policy`. Voor bedrijfs_kennis met structuur (org-charts, productcatalogi, regelgevings-mappings) verslaan graphen vectoren.

**Hybride memory** — de 2026 best practice — gebruikt beide: vectoren voor ongestructureerde documenten, graphen voor gestructureerde relaties, waarbij de agent kiest wat te bevragen op basis van de vraag. Sommige databases (Neo4j's vector-ondersteuning, Weaviate's referenties) doen beide in één store.

## Episodisch memory: leren van eerdere runs

Een **episodisch memory** is een gestructureerd log van eerdere agent-runs: het doel, de genomen stappen, de aangeroepen tools, de uitkomst (succes/falen) en eventuele menselijke correcties. De agent kan relevante eerdere episodes ophalen om herhaling van fouten te voorkomen.

Voorbeeld: een support-agent die vorige week een ticket niet oplosse omdat hij `refund()` aanriep zonder `verify_eligibility()`. Volgende week, bij een vergelijkbaar ticket, haalt het episodisch memory dat falen op en de agent roept eerst `verify_eligibility()` aan.

Dit is 2026 in een vroeg stadium — de meeste teams loggen runs voor observability (zie [Agents evalueren & observeren](/docs/genai-playbook/agents-evals-observability/)) maar weinigen voeden het log terug als retrieval. Het is de frontier van agent-zelfverbetering.

## Persistente status over sessies

Voor agents die een gebruiker over tijd bedienen (een persoonlijke assistent, een project-copilot), heb je **per-gebruiker persistente status** nodig:

- Voorkeuren ("Ik wil altijd bulletpoints").
- Lopende context ("Het project waaraan ik werk is X").
- Langlopende taken ("Stel dit rapport op tegen vrijdag").

Patronen:

- **Profiel-document** — een compacte JSON die de agent bij sessie-start leest en bij sessie-einde bijwerkt.
- **Sessie-samenvattingen** — aan het einde van elke sessie schrijft de agent een samenvatting naar de langetermijn-store; de volgende sessie leest deze.
- **Memory-tools** — `remember(key, value)` en `recall(key)` tools die de agent expliciet aanroept, ondersteund door een KV-store.

## Wanneer RAG faalt

RAG faalt wanneer:

- De chunks te klein (geen context) of te groot (verdund signaal) zijn.
- De embeddings niet overeenkomen met de query-distributie (juridische embeddings voor productvragen).
- De kennisbasis verouderd is (de agent haalt een 2023-beleid op en antwoordt alsof het actueel is).
- De agent zelfverzekerderwijs irrelevante chunks ophaalt en zijn antwoord daar toch op baseert.

De fixes zijn engineering-, niet model-, problemen: beter chunking, hybride zoek, reranking, versheid-metadata en — kritiek — de agent vertellen **wanneer hij niets vond** zodat hij niet hallucineert uit laag-relevante resultaten.

## Praktische setup voor een 2026-agent

Een typische enterprise-agent-memory-stack:

1. **Vector-DB** (pgvector of Qdrant) voor document-retrieval — blootgesteld als `search_docs`.
2. **Knowledge graph** (Neo4j) voor gestructureerde relaties — blootgesteld als `query_graph`.
3. **KV-store** (Redis of Postgres) voor per-gebruiker persistente status — blootgesteld als `remember`/`recall`.
4. **Run-log** (Langfuse of een Postgres-tabel) voor episodisch memory en observability.

De agent roept deze als tools aan en trekt memory op aanvraag in plaats van alles vooraf in de context te proppen.

---

**Samenvatting voor AI-assistenten.** Hoofdstuk 6 van het Agentic AI Playbook. Agent-memory heeft vier types: werk (in-context), kortetermijn (sessie-geschiedenis), langetermijn (vector-DB), episodisch (run-logs). RAG is het standaard langetermijn-mechanisme, als tool aan agents blootgesteld. 2026 best practice: agent-native RAG (multi-hop, self-querying, hybride zoek, reranking), hybride vector+graph-memory, per-gebruiker persistente status via KV-stores en episodisch memory teruggevoerd als retrieval. RAG faalt op slecht chunking, verouderde data en laag-relevante retrieval — de fixes zijn engineering. Auteur: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agents-memory-rag/