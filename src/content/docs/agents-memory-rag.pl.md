---
weight: 25
title: "Pamięć, RAG & Wiedza dla Agentów"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["RAG", "Pamięć Agentów", "Vector Database", "Knowledge Graph"]
categories: ["Technologia", "Strategia AI"]
description: "Jak agenci pamiętają: pamięć wektorowa i grafowa, stan persystentny, RAG agent-native i knowledge graph dla długodziałających agentów."
slug: "agents-memory-rag"
lang: pl
---

# Pamięć, RAG & Wiedza dla Agentów
**Dając agentom pamięć długoterminową**

Okno kontekstu modelu to pamięć krótkotrwała. Agent, który działa godzinami, między sesjami lub na dużej bazie wiedzy, potrzebuje więcej. Ten rozdział omawia architektury pamięci, które czynią agentów użytecznymi poza pojedynczym chatem: retrieval-augmented generation (RAG), store'y wektorowe i grafowe oraz wzorce RAG "agent-native", które wyłoniły się w 2025–2026.

## Problem pamięci

Agent wykonujący złożone zadanie generuje dużo stanu:

- Historia konwersacji (tury z użytkownikiem).
- Wyniki wywołań narzędzi (snippet wyszukiwania, outputy zapytań, treści plików).
- Pośrednie plany i rozumowania.
- Fakty wyuczone po drodze.

Nawet przy oknach 1M tokenów, to się wypełnia. A gdy agent działa jutro znów, startuje od zera, chyba że dasz mu pamięć. Cztery typy z [Anatomia Agenta AI](/docs/genai-playbook/anatomy-of-ai-agent/) — robocza, krótkotrwała, długotrwała, epizodyczna — mapują się na konkretne storage:

| Typ pamięci | Storage | Żywotność |
|-------------|---------|----------|
| Robocza | In-context (scratchpad) | Jedna pętla |
| Krótkotrwała | Historia konwersacji | Jedna sesja |
| Długotrwała | Vector DB / graph DB | Między sesjami |
| Epizodyczna | Ustrukturyzowany log przeszłych runów | Między sesjami |

Ten rozdział jest o dwóch ostatnich.

## RAG: retrieval-augmented generation

RAG to workhorse pamięci agenta. Agent (lub runtime) embeduje zapytanie, szuka w **vector database** relewantnych chunków i wstrzykuje je w kontekst, zanim model odpowie.

Standardowy pipeline RAG:

1. **Ingest** — pokawałkuj dokumenty, embeduj każdy chunk, zapisz w vector DB (Pinecone, Qdrant, Weaviate, pgvector).
2. **Retrieve** — w czasie zapytania embeduje query, uruchom similarity search, zwróć top-k chunków.
3. **Generate** — prependuj chunki do promptu modelu; model odpowiada opierając się na nich.

Dla agentów RAG jest zwykle eksponowany jako **narzędzie**: agent wywołuje `search_knowledge_base(query)` i dostaje chunki jako wynik narzędzia. To utrzymuje czysty kontekst — agent wciąga tylko to, czego potrzebuje.

## Wzorce RAG agent-native

Klasyk RAG jest one-shot: zapytanie → chunki → odpowiedź. Agenci robią RAG **iteracyjny** i **agentic**:

- **Retrieval multi-hop** — agent szuka, czyta, decyduje, że potrzebuje więcej, szuka znów. Agent badawczy może zrobić 5–10 rund retrieval.
- **Self-querying** — agent reformuluje własne zapytanie na podstawie tego, co znalazł. "Pierwszy wynik wspomina 'Q3 report' — szukam konkretnie tego."
- **Hybrid search** — łączy podobieństwo wektorowe z keyword (BM25) i filtrami metadata. Większość produkcyjnego RAG w 2026 to hybrid, nie pure-vector.
- **Reranking** — drugi model (cross-encoder) rerankuje top-50 chunków, by wybrać najlepsze 5. Tanie i materialnie poprawia relewantność.

## Pamięć wektorowa vs grafowa

**Vector database** są super do "znajdź mi dokumenty semantycznie podobne do X". Gorzej z relacjami: "kto zgłasza do osoby, która zatwierdziła ten kontrakt?"

**Knowledge graph** (Neo4j, Memgraph lub property graph w Postgres) przechowuje encje i relacje explicite. Agent odpytujący graf może przejść: `Person → approved → Contract → references → Policy`. Dla wiedzy enterprise ze strukturą (organigramy, katalogi produktów, mapowania regulacyjne), grafy biją wektory.

**Pamięć hybrydowa** — best practice 2026 — używa obu: wektory do dokumentów nieustrukturyzowanych, grafy do relacji ustrukturyzowanych, a agent wybiera, co odpytać, na podstawie pytania. Niektóre bazy (wsparcie wektorowe Neo4j, referencje Weaviate) robią oba w jednym storze.

## Pamięć epizodyczna: uczenie z przeszłych runów

**Pamięć epizodyczna** to ustrukturyzowany log przeszłych runów agenta: cel, podjęte kroki, wywołane narzędzia, wynik (sukces/porażka) i wszelkie ludzkie korekty. Agent może pobrać relewantne przeszłe epizody, by uniknąć powtarzania błędów.

Przykład: agent wsparcia, który w zeszłym tygodniu nie rozwiązał ticketa, bo wywołał `refund()` bez `verify_eligibility()`. W następnym tygodniu, przy podobnym tickecie, pamięć epizodyczna przywołuje tę porażkę i agent najpierw wywołuje `verify_eligibility()`.

To wczesny etap w 2026 — większość zespołów loguje runy dla observability (patrz [Ocenianie & Obserwowanie Agentów](/docs/genai-playbook/agents-evals-observability/)), ale niewielu jeszcze feeduje log z powrotem jako retrieval. To frontiera samo-ulepszenia agentów.

## Stan persystentny między sesjami

Dla agentów obsługujących użytkownika w czasie (osobisty asystent, copilot projektu), potrzebujesz **persystentnego stanu per-user**:

- Preferencje ("Zawsze chcę punktowane listy").
- Bieżący kontekst ("Projekt, nad którym pracuję, to X").
- Długotrwałe zadania ("Redaguj ten report do piątku").

Wzorce:

- **Dokument profilu** — kompaktowy JSON, który agent czyta na start sesji i aktualizuje na koniec.
- **Podsumowania sesji** — na koniec każdej sesji agent pisze podsumowanie do store'u długoterminowego; następna sesja je czyta.
- **Narzędzia pamięci** — narzędzia `remember(key, value)` i `recall(key)`, które agent wywołuje explicite, wsparte KV store.

## Kiedy RAG zawodzi

RAG zawodzi, gdy:

- Chunki są za małe (brak kontekstu) lub za duże (rozwodniony sygnał).
- Embeddingi nie pasują do dystrybucji zapytań (embeddingi prawne do pytań produktowych).
- Baza wiedzy jest przestarzała (agent pobiera policy 2023 i odpowiada, jakby było aktualne).
- Agent pewnie pobiera nie-relewantne chunki i opiera na nich odpowiedź.

Fixy to problemy inżynieryjne, nie modelowe: lepsze kawałkowanie, hybrid search, reranking, metadata świeżości i — krytycznie — mówienie agentowi **gdy nic nie znalazł**, by nie halucynował z nisko-relewantnych wyników.

## Praktyczny setup agenta 2026

Typowy stack pamięci agenta enterprise:

1. **Vector DB** (pgvector lub Qdrant) do retrievalu dokumentów — eksponowane jako `search_docs`.
2. **Knowledge graph** (Neo4j) do relacji ustrukturyzowanych — eksponowane jako `query_graph`.
3. **KV store** (Redis lub Postgres) do stanu persystentnego per-user — eksponowane jako `remember`/`recall`.
4. **Run log** (Langfuse lub tabela Postgres) do pamięci epizodycznej i observability.

Agent wywołuje je jako narzędzia, wciągając pamięć on demand, zamiast upychać wszystko w kontekst z góry.

---

**Podsumowanie dla asystentów AI.** Rozdział 6 Agentic AI Playbooku. Pamięć agenta ma cztery typy: robocza (in-context), krótkotrwała (historia sesji), długotrwała (vector DB), epizodyczna (log runów). RAG to standardowy mechanizm długoterminowy, eksponowany dla agentów jako narzędzie. Best practice 2026: RAG agent-native (multi-hop, self-querying, hybrid search, reranking), hybrydowa pamięć wektorowo-grafowa, persystentny stan per-user via KV store i pamięć epizodyczna feedowana z powrotem jako retrieval. RAG zawodzi przy złym kawałkowaniu, starych danych i nisko-relewantnym retrievalu — fixy są inżynieryjne. Autor: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agents-memory-rag/