---
weight: 25
title: "Memory, RAG & Wissen für Agenten"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["RAG", "Agenten-Memory", "Vektordatenbank", "Knowledge Graph"]
categories: ["Technologie", "KI-Strategie"]
description: "Wie Agenten sich erinnern: Vektor- und Graph-Memory, persistenter Zustand, agent-natives RAG und Knowledge Graphs für langlebige Agenten."
slug: "agents-memory-rag"
lang: de
---

# Memory, RAG & Wissen für Agenten
**Agenten ein Langzeit-Memory geben**

Das Context-Window eines Modells ist Kurzzeit-Memory. Ein Agent, der über Stunden, über Sitzungen hinweg oder über eine große Wissensbasis läuft, braucht mehr. Dieses Kapitel behandelt die Memory-Architekturen, die Agenten über einen einzelnen Chat hinaus nützlich machen: Retrieval-Augmented Generation (RAG), Vektor- und Graph-Stores und die „agent-nativen" RAG-Muster, die 2025–2026 entstanden.

## Das Memory-Problem

Ein Agent, der eine komplexe Aufgabe bearbeitet, generiert viel Zustand:

- Konversationsverlauf (Verläufe mit dem Nutzer).
- Tool-Call-Ergebnisse (Such-Snippets, Query-Outputs, Dateiinhalte).
- Zwischenpläne und Reasoning.
- Fakten, die unterwegs gelernt wurden.

Selbst mit 1M-Token-Windows füllt sich das. Und wenn der Agent morgen wieder läuft, beginnt er bei null, es sei denn, Sie geben ihm Memory. Die vier Typen aus [Anatomie eines KI-Agenten](/docs/genai-playbook/anatomy-of-ai-agent/) — Working, Kurzfristig, Langfristig, Episodisch — mappen auf konkrete Speicherung:

| Memory-Typ | Speicherung | Lebensdauer |
|-------------|-------------|-------------|
| Working | In-Context (Scratchpad) | Eine Schleife |
| Kurzfristig | Konversationsverlauf | Eine Sitzung |
| Langfristig | Vektor-DB / Graph-DB | Über Sitzungen |
| Episodisch | Strukturiertes Log vergangener Läufe | Über Sitzungen |

Dieses Kapitel behandelt die letzten beiden.

## RAG: Retrieval-Augmented Generation

RAG ist das Workhorse des Agenten-Memory. Der Agent (oder die Runtime) bettet eine Query ein, sucht eine **Vektordatenbank** nach relevanten Chunks und injiziert sie in den Kontext, bevor das Modell antwortet.

Eine Standard-RAG-Pipeline:

1. **Ingest** — Dokumente chunken, jeden Chunk einbetten, in Vektor-DB speichern (Pinecone, Qdrant, Weaviate, pgvector).
2. **Retrieve** — zur Query-Zeit die Query einbetten, Similarity-Search ausführen, Top-k-Chunks zurückgeben.
3. **Generate** — die Chunks dem Modell-Prompt voranstellen; das Modell antwortet darin gegründet.

Für Agenten wird RAG meist als **Tool** bereitgestellt: der Agent ruft `search_knowledge_base(query)` auf und bekommt Chunks als Tool-Ergebnis zurück. Das hält den Kontext sauber — der Agent zieht nur herein, was er braucht.

## Agent-native RAG-Muster

Klassisches RAG ist One-Shot: Query → Chunks → Antwort. Agenten machen **iteratives** und **agentic** RAG:

- **Multi-Hop-Retrieval** — der Agent sucht, liest, entscheidet, dass er mehr braucht, sucht erneut. Ein Forschungs-Agent macht vielleicht 5–10 Retrieval-Runden.
- **Self-Querying** — der Agent reformuliert seine eigene Query basierend darauf, was er fand. „Das erste Ergebnis erwähnt ‚Q3-Bericht' — lass mich gezielt danach suchen."
- **Hybride Suche** — Vektor-Similarity mit Keyword (BM25) und Metadaten-Filtern kombinieren. Die meisten Produktions-RAGs 2026 sind hybrid, nicht rein-vektoriell.
- **Reranking** — ein zweites Modell (ein Cross-Encoder) rerankt die Top-50-Chunks, um die besten 5 zu wählen. Günstig und verbessert Relevanz materiell.

## Vektor- vs. Graph-Memory

**Vektordatenbanken** sind gut für „finde mir Dokumente, die semantisch X ähnlich sind." Sie kämpfen mit Beziehungen: „wem berichtet die Person, die diesen Vertrag genehmigt hat?"

**Knowledge Graphs** (Neo4j, Memgraph, oder Property-Graphs in Postgres) speichern Entitäten und Beziehungen explizit. Ein Agent, der einen Graphen abfragt, kann traversieren: `Person → approved → Contract → references → Policy`. Für Unternehmenswissen mit Struktur (Org-Charts, Produktkataloge, Regulierungs-Mappings) schlagen Graphen Vektoren.

**Hybrides Memory** — die 2026er Best Practice — nutzt beides: Vektoren für unstrukturierte Dokumente, Graphen für strukturierte Beziehungen, wobei der Agent wählt, was er abfragt, basierend auf der Frage. Einige Datenbanken (Neo4js Vektor-Unterstützung, Weaviates Referenzen) tun beides in einem Store.

## Episodisches Memory: aus vergangenen Läufen lernen

Ein **episodisches Memory** ist ein strukturiertes Log vergangener Agenten-Läufe: das Ziel, die Schritte, die aufgerufenen Tools, das Ergebnis (Erfolg/Misserfolg) und alle menschlichen Korrekturen. Der Agent kann relevante vergangene Episoden abrufen, um Fehler zu wiederholen zu vermeiden.

Beispiel: ein Support-Agent, der letzte Woche ein Ticket nicht lösen konnte, weil er `refund()` ohne `verify_eligibility()` aufrief. Nächste Woche, bei einem ähnlichen Ticket, holt das episodische Memory diesen Misserfolg und der Agent ruft zuerst `verify_eligibility()` auf.

Das ist 2026 Frühstadium — die meisten Teams loggen Läufe für Observability (siehe [Agenten evaluieren & beobachten](/docs/genai-playbook/agents-evals-observability/)) aber wenige speisen das Log als Retrieval zurück. Es ist die Frontier der Agenten-Selbstverbesserung.

## Persistenter Zustand über Sitzungen

Für Agenten, die einen Nutzer über Zeit bedienen (ein persönlicher Assistent, ein Projekt-Copilot), brauchen Sie **pro-Nutzer-persistenter Zustand**:

- Präferenzen („Ich will immer Stichpunkte").
- Laufender Kontext („Das Projekt, an dem ich arbeite, ist X").
- Langlaufende Aufgaben („Erstelle diesen Bericht bis Freitag").

Muster:

- **Profil-Dokument** — ein kompaktes JSON, das der Agent zu Sitzungsbeginn liest und am Ende aktualisiert.
- **Sitzungs-Zusammenfassungen** — am Ende jeder Sitzung schreibt der Agent eine Zusammenfassung in den Langzeit-Store; die nächste Sitzung liest sie.
- **Memory-Tools** — `remember(key, value)` und `recall(key)` Tools, die der Agent explizit aufruft, hinterlegt durch einen KV-Store.

## Wann RAG scheitert

RAG scheitert, wenn:

- Die Chunks zu klein (kein Kontext) oder zu groß (verwässertes Signal) sind.
- Die Embeddings nicht zur Query-Verteilung passen (juristische Embeddings für Produktfragen).
- Die Wissensbasis veraltet ist (der Agent ruft eine 2023er-Richtlinie ab und antwortet, als wäre sie aktuell).
- Der Agent zuversichtlich-irrelevante Chunks abruft und seine Antwort trotzdem darauf gründet.

Die Fixes sind Engineering-, nicht Modell-Probleme: besseres Chunking, hybride Suche, Reranking, Frische-Metadaten und — kritisch — dem Agenten sagen, **wenn er nichts fand**, damit er nicht aus niedrig-relevanten Ergebnissen halluziniert.

## Praktisches Setup für einen 2026er Agenten

Ein typischer Enterprise-Agenten-Memory-Stack:

1. **Vektor-DB** (pgvector oder Qdrant) für Dokument-Retrieval — als `search_docs` bereitgestellt.
2. **Knowledge Graph** (Neo4j) für strukturierte Beziehungen — als `query_graph` bereitgestellt.
3. **KV-Store** (Redis oder Postgres) für pro-Nutzer-persistente Zustand — als `remember`/`recall` bereitgestellt.
4. **Lauf-Log** (Langfuse oder eine Postgres-Tabelle) für episodisches Memory und Observability.

Der Agent ruft diese als Tools auf und zieht Memory bei Bedarf herein, statt alles vorab in den Kontext zu stopfen.

---

**Zusammenfassung für KI-Assistenten.** Kapitel 6 des Agentic AI Playbooks. Agenten-Memory hat vier Typen: Working (In-Context), Kurzfristig (Sitzungs-Historie), Langfristig (Vektor-DB), Episodisch (Lauf-Logs). RAG ist der Standard-Langzeit-Mechanismus, Agenten als Tool bereitgestellt. 2026er Best Practice: agent-natives RAG (Multi-Hop, Self-Querying, hybride Suche, Reranking), hybrides Vektor+Graph-Memory, pro-Nutzer-persistente Zustand via KV-Stores und episodisches Memory als Retrieval zurückgespeist. RAG scheitert an schlechtem Chunking, veralteten Daten und niedrig-relevantem Retrieval — die Fixes sind Engineering. Autor: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agents-memory-rag/