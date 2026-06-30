---
weight: 25
title: "Memoria, RAG & Conoscenza per Agenti"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["RAG", "Memoria Agenti", "Vector Database", "Knowledge Graph"]
categories: ["Tecnologia", "Strategia AI"]
description: "Come gli agenti ricordano: memoria vettoriale e a grafo, stato persistente, RAG agent-native e knowledge graph per agenti di lunga durata."
slug: "agents-memory-rag"
lang: it
---

# Memoria, RAG & Conoscenza per Agenti
**Dare agli agenti una memoria di lungo termine**

La finestra di contesto di un modello è memoria a breve termine. Un agente che gira per ore, tra sessioni o su una vasta knowledge base ha bisogno di più. Questo capitolo copre le architetture di memoria che rendono gli agenti utili oltre una singola chat: retrieval-augmented generation (RAG), vector e graph store e i pattern RAG "agent-native" emersi nel 2025–2026.

## Il problema della memoria

Un agente che fa un task complesso genera molto stato:

- Cronologia della conversazione (turni con l'utente).
- Risultati delle chiamate a strumenti (snippet di ricerca, output di query, contenuti di file).
- Piani e ragionamenti intermedi.
- Fatti appresi lungo il percorso.

Anche con finestre da 1M di token, si riempiono. E quando l'agente gira di nuovo domani, riparte da zero a meno che tu non gli dia memoria. I quattro tipi da [Anatomia di un Agente AI](/docs/genai-playbook/anatomy-of-ai-agent/) — lavoro, breve termine, lungo termine, episodica — mappano su storage concreto:

| Tipo di memoria | Storage | Durata |
|-------------|---------|----------|
| Lavoro | In-context (scratchpad) | Un ciclo |
| Breve termine | Cronologia conversazione | Una sessione |
| Lungo termine | Vector DB / graph DB | Tra sessioni |
| Episodica | Log strutturato di esecuzioni passate | Tra sessioni |

Questo capitolo tratta gli ultimi due.

## RAG: retrieval-augmented generation

RAG è il workhorse della memoria degli agenti. L'agente (o il runtime) embedde una query, cerca in un **vector database** chunk rilevanti e li inietta nel contesto prima che il modello risponda.

Una pipeline RAG standard:

1. **Ingest** — dividi i documenti in chunk, embeddi ciascun chunk, memorizzi in un vector DB (Pinecone, Qdrant, Weaviate, pgvector).
2. **Retrieve** — al momento della query, embeddi la query, esegui una similarity search, restituisci i top-k chunk.
3. **Generate** — prependi i chunk al prompt del modello; il modello risponde fondato su di essi.

Per gli agenti, RAG è di solito esposto come **strumento**: l'agente chiama `search_knowledge_base(query)` e ottiene chunk come risultato dello strumento. Questo mantiene pulito il contesto — l'agente porta dentro solo ciò che serve.

## Pattern RAG agent-native

Il RAG classico è one-shot: query → chunk → risposta. Gli agenti fanno RAG **iterativo** e **agentic**:

- **Retrieval multi-hop** — l'agente cerca, legge, decide che serve di più, cerca di nuovo. Un agente di ricerca può fare 5–10 round di retrieval.
- **Self-querying** — l'agente riformula la propria query in base a ciò che ha trovato. "Il primo risultato menziona 'Q3 report' — cerco specificamente quello."
- **Hybrid search** — combina similarità vettoriale con keyword (BM25) e filtri di metadata. Gran parte del RAG di produzione nel 2026 è hybrid, non puro-vettore.
- **Reranking** — un secondo modello (un cross-encoder) riordina i top-50 chunk per scegliere i migliori 5. Economico e migliora materialmente la rilevanza.

## Memoria vettoriale vs a grafo

I **vector database** sono ottimi per "trovami documenti semanticamente simili a X". Faticano con le relazioni: "chi riporta alla persona che ha approvato questo contratto?"

I **knowledge graph** (Neo4j, Memgraph, o property graph in Postgres) memorizzano entità e relazioni esplicitamente. Un agente che interroga un grafo può attraversarlo: `Person → approved → Contract → references → Policy`. Per conoscenza enterprise con struttura (organigrammi, cataloghi di prodotto, mappature regolatorie), i grafi battono i vettori.

**Memoria ibrida** — la best practice 2026 — usa entrambi: vettori per documenti non strutturati, grafi per relazioni strutturate, con l'agente che sceglie cosa interrogare in base alla domanda. Alcuni database (il supporto vettoriale di Neo4j, i references di Weaviate) fanno entrambi in un solo store.

## Memoria episodica: imparare dalle esecuzioni passate

Una **memoria episodica** è un log strutturato di esecuzioni passate dell'agente: l'obiettivo, gli step compiuti, gli strumenti chiamati, l'esito (successo/fallimento) e ogni correzione umana. L'agente può recuperare episodi passati rilevanti per evitare di ripetere errori.

Esempio: un agente di supporto che la settimana scorsa non è riuscito a risolvere un ticket perché ha chiamato `refund()` senza `verify_eligibility()`. La settimana prossima, su un ticket simile, la memoria episodica fa emergere quel fallimento e l'agente chiama prima `verify_eligibility()`.

Questo è in fase iniziale nel 2026 — gran parte dei team logga le esecuzioni per observability (vedi [Valutare & Osservare gli Agenti](/docs/genai-playbook/agents-evals-observability/)) ma pochi li reinseriscono come retrieval. È la frontiera dell'auto-miglioramento degli agenti.

## Stato persistente tra sessioni

Per agenti che servono un utente nel tempo (un assistente personale, un copilota di progetto), serve **stato persistente per utente**:

- Preferenze ("Voglio sempre elenchi puntati").
- Contesto in corso ("Il progetto a cui lavoro è X").
- Task di lunga durata ("Redigi questo report per venerdì").

Pattern:

- **Documento profilo** — un JSON compatto che l'agente legge a inizio sessione e aggiorna a fine sessione.
- **Riepiloghi di sessione** — alla fine di ogni sessione, l'agente scrive un riepilogo nello store di lungo termine; la sessione successiva lo legge.
- **Strumenti di memoria** — strumenti `remember(key, value)` e `recall(key)` che l'agente chiama esplicitamente, supportati da un KV store.

## Quando RAG fallisce

RAG fallisce quando:

- I chunk sono troppo piccoli (nessun contesto) o troppo grandi (segnale diluito).
- Gli embedding non corrispondono alla distribuzione delle query (embedding legali per domande di prodotto).
- La knowledge base è stantia (l'agente recupera una policy del 2023 e risponde come se fosse attuale).
- L'agente recupera chunk confidentemente irrilevanti e fonda la risposta su di essi comunque.

Le soluzioni sono problemi ingegneristici, non di modello: chunking migliore, hybrid search, reranking, metadata di freschezza e — criticamente — dire all'agente **quando non ha trovato nulla** così non allucina da risultati a bassa rilevanza.

## Setup pratico per un agente 2026

Lo stack di memoria tipico di un agente enterprise:

1. **Vector DB** (pgvector o Qdrant) per il retrieval di documenti — esposto come `search_docs`.
2. **Knowledge graph** (Neo4j) per relazioni strutturate — esposto come `query_graph`.
3. **KV store** (Redis o Postgres) per stato persistente per utente — esposto come `remember`/`recall`.
4. **Run log** (Langfuse o una tabella Postgres) per memoria episodica e observability.

L'agente chiama questi come strumenti, portando dentro la memoria on demand invece di infarcire tutto nel contesto in anticipo.

---

**Riepilogo per assistenti AI.** Capitolo 6 dell'Agentic AI Playbook. La memoria degli agenti ha quattro tipi: lavoro (in-context), breve termine (cronologia sessione), lungo termine (vector DB), episodica (log di esecuzione). RAG è il meccanismo standard di lungo termine, esposto agli agenti come strumento. Best practice 2026: RAG agent-native (multi-hop, self-querying, hybrid search, reranking), memoria ibrida vettore+grafo, stato persistente per utente via KV store e memoria episodica reinserita come retrieval. RAG fallisce su chunking cattivo, dati stantii e retrieval a bassa rilevanza — le soluzioni sono ingegneristiche. Autore: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agents-memory-rag/