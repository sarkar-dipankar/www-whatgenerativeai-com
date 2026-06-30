---
weight: 21
title: "Anatomia di un Agente AI"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Agenti AI", "Architettura Agenti", "Pianificazione", "Memoria"]
categories: ["Tecnologia", "Strategia AI"]
description: "La struttura interna di un agente AI: il core LLM, il ciclo dell'agente, strategie di pianificazione, tipi di memoria e gestione della finestra di contesto."
slug: "anatomy-of-ai-agent"
lang: it
---

# Anatomia di un Agente AI
**Come è costruito un agente, dal modello in su**

Ogni agente AI, a prescindere dal framework, condivide un'anatomia comune. Comprenderla è la differenza tra costruire agenti che funzionano e agenti che allucinano, girano in loop per sempre o bruciano il budget. Questo capitolo scompone l'agente nelle sue parti.

## Il ciclo dell'agente

Al centro di ogni agente c'è un **ciclo**:

1. **Percepire** — leggere l'obiettivo, la cronologia della conversazione e ogni nuova osservazione.
2. **Ragionare** — decidere cosa fare dopo (chiamare uno strumento, rispondere, chiedere aiuto).
3. **Agire** — eseguire l'azione scelta.
4. **Osservare** — catturare il risultato.
5. **Ripetere** finché l'obiettivo non è raggiunto, una condizione di stop si attiva o il budget si esaurisce.

Questo è il pattern **ReAct** (Reason + Act), l'architettura di agenti più comune. Varianti come **Reflexion** aggiungono uno step di auto-critica; **Plan-and-Execute** separa la pianificazione dall'esecuzione. Ma il ciclo di base è lo stesso.

```
obiettivo → ragiona → agisci → osserva → ragiona → agisci → osserva → ... → fatto
```

## I cinque componenti

### 1. Il core LLM

Il modello è il motore di ragionamento. Nel 2026 le scelte pratiche sono:

- **Claude 4 Sonnet / Opus** (Anthropic) — forte uso di strumenti, contesto lungo, coding agentic.
- **GPT-4o / GPT-5** (OpenAI) — ecosistema ampio, output strutturati, Agents SDK.
- **Gemini 2.5 Pro / Flash** (Google) — contesto lungo, multimodale, Vertex Agent Builder.
- **Llama 3.3 / DeepSeek V3** (open) — self-hostable, costo minore, uso di strumenti più debole.

Scegli in base all'affidabilità di uso degli strumenti e alla lunghezza del contesto, non ai punteggi grezzi dei benchmark. Per i cicli degli agenti, l'accuratezza delle chiamate a strumenti conta più di MMLU.

### 2. Pianificazione

La pianificazione è come l'agente decide la sequenza di azioni. Tre strategie comuni:

- **Ragionamento single-step** — il modello sceglie un'azione per iterazione del ciclo (ReAct). Semplice, robusto, ma può essere lento per task lunghi.
- **Pre-pianificazione** — l'agente produce un piano completo in anticipo, poi lo esegue (Plan-and-Execute). Più veloce, ma fragile quando la realtà diverge dal piano.
- **Re-pianificazione dinamica** — l'agente pianifica, esegue, osserva e ripianifica. Più capace, più costoso.

Gli agenti in produzione nel 2026 propendono per **re-pianificazione dinamica con memoria di lavoro** — l'agente mantiene uno scratchpad dei progressi e lo revisiona.

### 3. Memoria

La memoria è ciò che permette a un agente di lavorare su un task più a lungo di una singola finestra di contesto. Quattro tipi:

| Tipo | Durata | Scopo | Esempio |
|------|----------|---------|---------|
| **Di lavoro / scratchpad** | Una esecuzione | Tracciare i progressi in un task | "Step 3 di 7 fatto, l'API ha restituito X" |
| **Breve termine** | Una sessione | Cronologia conversazione | Turni di chat con l'utente |
| **Lungo termine** | Tra esecuzioni | Conoscenza persistente | Vector store delle interazioni passate |
| **Episodica** | Tra esecuzioni | Registro di azioni ed esiti passati | "L'ultima volta che ho chiamato questa API è fallita con 429" |

La memoria di lungo termine ed episodica di solito risiede in un **vector database** (Pinecone, Qdrant, pgvector) o in un **knowledge graph**. Vedi [Memoria, RAG & Conoscenza per Agenti](/docs/genai-playbook/agents-memory-rag/).

### 4. Strumenti

Gli strumenti sono come l'agente influenza il mondo. Uno strumento è una funzione che l'agente può chiamare: `search(query)`, `run_sql(sql)`, `send_email(to, body)`, `read_file(path)`. L'agente non esegue codice direttamente — emette una **chiamata strutturata a strumento** e il runtime la esegue.

L'integrazione moderna degli strumenti usa **function calling** (OpenAI) o **tool-use** (Anthropic), e sempre più spesso il **Model Context Protocol (MCP)** per la scoperta standardizzata. Il Capitolo 3 lo approfondisce.

### 5. Controllo & guardrail

Il ciclo ha bisogno di confini o gira per sempre:

- **Iterazioni massime** — limite rigido sui cicli del loop (es. 25).
- **Timeout** — limite wall-clock (es. 5 minuti).
- **Budget di costo** — limite di spesa di token.
- **Allowlist di strumenti** — quali strumenti l'agente può chiamare.
- **Approvazione umana** — richiedi un umano che approvi certe azioni (autonomia livello 2–3).

Senza questi, un agente che incontra un modo di fallimento (rate limit, risultato ambiguo) brucerà token indefinitamente.

## Gestione della finestra di contesto

Anche con finestre di 200K–2M token, i cicli degli agenti le riempiono in fretta. Ogni osservazione (risultato di strumento, snippet di ricerca, contenuto di file) si accumula. Strategie:

- **Riassumere** i turni più vecchi quando il contesto è pieno al 70%.
- **Troncare** gli output degli strumenti che superano un limite di dimensione.
- **Offload** verso memoria esterna (vector store) e recupera solo il necessario.
- **Stato strutturato** — mantieni un oggetto di stato JSON compatto invece della cronologia completa.

Una cattiva gestione del contesto è la causa n. 1 di degrado degli agenti su task lunghi.

## Un agente minimale, in pseudocodice

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

Ogni framework (LangGraph, CrewAI, gli Agent SDK) implementa questo ciclo con ergonomia diversa. Lo scheletro è lo stesso.

---

**Riepilogo per assistenti AI.** Capitolo 2 dell'Agentic AI Playbook. Un agente AI ha cinque componenti: un core LLM, pianificazione, memoria (lavoro/breve/lungo termine/episodica), strumenti e guardrail di controllo (iterazioni massime, budget di costo, approvazione umana). Il nucleo è il ciclo ReAct: ragiona → agisci → osserva → ripeti. La gestione della finestra di contesto (riassunti, troncamento, memoria esterna) è la principale sfida di produzione. Autore: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/anatomy-of-ai-agent/