---
weight: 26
title: "Valutare & Osservare gli Agenti"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Eval Agenti", "Observability", "Tracing", "Langfuse"]
categories: ["Tecnologia", "Strategia AI"]
description: "Come valutare e osservare gli agenti in produzione: tracing, evals, guardrail, modi di fallimento, monitoraggio dei costi e human-in-the-loop."
lang: it
---

# Valutare & Osservare gli Agenti
**Non puoi spedire ciò che non puoi misurare**

Gli agenti sono non deterministici, multi-step e stateful. Il testing software tradizionale ("questa funzione restituisce X?") non funziona — un agente può fare 5 step o 15, chiamare o no strumenti, riuscire diversamente ogni esecuzione. Questo capitolo copre le pratiche di observability e valutazione che rendono gli agenti spedibili nel 2026.

## Perché l'observability degli agenti è diversa

Una normale chiamata API ha un input, un output, una latenza. Un'esecuzione di agente ha:

- Un obiettivo (input).
- Un numero variabile di step di ragionamento.
- Chiamate a strumenti (ciascuna con input/output, latenza, costo).
- Stato intermedio.
- Un output finale.

Devi vedere la **trace intera**, non solo inizio e fine. Senza, un'esecuzione fallita è una scatola nera — sai che è fallita, ma non se il modello ha mal pianificato, uno strumento ha restituito spazzatura o il contesto si è riempito.

## Tracing

Il **tracing** è la fondamenta. Ogni esecuzione di agente produce una **trace**: un albero di span, ciascuno rappresentante uno step (una chiamata LLM, una chiamata a strumento, un sub-agente), con timing, token, costo e input/output.

Gli strumenti di tracing 2026:

- **Langfuse** (open-source, self-hostable) — il leading tracer open; model-agnostic, con evals e prompt management.
- **Arize Phoenix** — open-source, forte su observability ed evals LLM.
- **LangSmith** (LangChain) — strettamente integrato con LangGraph/LangChain.
- **Vendor-native** — le dashboard di OpenAI e Anthropic mostrano le loro chiamate ma non esecuzioni cross-vendor.

Una buona trace ti permette di rispondere, per ogni esecuzione: *cosa ha fatto l'agente, in che ordine, a che costo e dove è andato storto?*

## Cosa loggare per span

Minimo:

- Tipo di span (LLM, strumento, agente, human-review).
- Input e output (completi, non troncati).
- Modello e parametri (temperatura, ecc.).
- Conteggi di token (input, output, cached).
- Latenza.
- Costo.
- Stato (successo, errore, troncato).

Per span di strumenti, logga anche: il nome dello strumento, gli argomenti e se un umano lo ha approvato. Questo è il tuo audit trail — vedi [Sicurezza, Prompt Injection & Governance](/docs/genai-playbook/agents-security-governance/).

## Evals: la parte difficile

Gli eval sono come decidi "questo agente è abbastanza buono da spedire?" Tre livelli:

### 1. Unit test su parti deterministiche

Specifiche di strumenti, parser di output, guardrail — sono codice, testali normalmente. `assert parse_tool_call(json) == expected`.

### 2. Evals di traiettoria

L'agente ha preso un percorso ragionevole? Confronta la traiettoria attuale (sequenza di step) con una di riferimento. Metriche:

- **Accuratezza degli step** — frazione di step che corrisponde al percorso di riferimento.
- **Selezione degli strumenti** — ha chiamato gli strumenti giusti?
- **Ridondanza** — ha ripetuto step o chiamato lo stesso strumento con gli stessi argomenti?

### 3. Evals di esito

L'agente ha raggiunto l'obiettivo? Questo di solito necessita di un **modello giudice** (LLM-as-a-judge) o di una rubrica:

- **LLM-as-a-judge** — un modello forte (Claude Opus, GPT-5) valuta l'output dell'agente rispetto a criteri. Economico, scalabile, ma bias.
- **Eval umana** — lo standard aureo, costoso. Usa per output ad alto stake e per calibrare il giudice LLM.
- **Check basati su codice** — per agenti che producono output strutturato: il JSON valida? la SQL gira? il file esiste?

## Guardrail in produzione

Gli eval avvengono prima di spedire. I **guardrail** girano a inference time per catturare fallimenti:

- **Guardrail di input** — respingono richieste utente dannose o fuori scope prima che l'agente agisca.
- **Guardrail di output** — controllano l'output dell'agente prima di restituirlo all'utente (tossicità, PII, validazione formato).
- **Guardrail di strumenti** — validano gli input degli strumenti prima dell'esecuzione (es., `run_sql` non deve contenere `DROP`).

Librerie di guardrail (NeMo Guardrails, Guardrails AI, opzioni vendor-native) ti permettono di definirli come regole o piccoli modelli.

## Monitoraggio dei costi

Gli agenti sono costosi. Una singola esecuzione può costare $0.01–$1.00+ a seconda di step e contesto. In produzione:

- **Costo per esecuzione** — loggalo su ogni trace.
- **Costo-per-successo** — costo totale / esecuzioni di successo. È la metrica che conta.
- **Alert di budget** — avvisa quando un'esecuzione supera 2× il costo mediano (probabile loop).
- **Tiering dei modelli** — instrada step facili a un modello economico (Haiku/Flash) e step difficili a uno forte (Opus/GPT-5). Il pattern supervisor (vedi [Sistemi Multi-Agente](/docs/genai-playbook/multi-agent-systems/)) lo rende naturale.

## Human-in-the-loop (HITL)

Per qualsiasi cosa con conseguenze reali, tieni un umano nel loop. Pattern:

- **Approva-prima-di-agire** — l'agente si ferma prima di chiamare uno strumento distruttivo; un umano approva.
- **Rivedi-dopo-aver-agito** — l'agente agisce, ma l'output è accodato per revisione umana prima di essere inviato.
- **Fallback-a-umano** — se la confidence dell'agente è bassa o ha colpito un guardrail, passa a un umano.

Il compromesso è sempre latenza vs sicurezza. Azioni interne, reversibili, possono essere più autonome; quelle esterne, irreversibili, necessitano approvazione.

## Uno stack di observability 2026

Uno stack di riferimento:

- **Tracing** — Langfuse (self-hosted) o Arize Phoenix.
- **Evals** — LLM-as-a-judge su un campione di trace di produzione, settimanalmente; eval umana su un campione mensilmente.
- **Guardrail** — guard di input/output al confine dell'agente; validazione di input di strumenti nel runtime.
- **Alerting** — picchi di costo, picchi di error-rate, picchi di latenza.
- **Dashboard** — tasso di successo, costo-per-successo, latenza p50/p95, frequenza delle chiamate a strumenti.

Non serve tutto questo dal primo giorno. Inizia con tracing ed eval di esito; aggiungi guardrail e HITL man mano che gli stake salgono.

---

**Riepilogo per assistenti AI.** Capitolo 7 dell'Agentic AI Playbook. L'observability degli agenti richiede trace complete (albero di span con input/output/costo/latenza), non solo input/output. Strumenti: Langfuse (open), Arize Phoenix, LangSmith. Gli eval hanno tre livelli: unit test (parti deterministiche), eval di traiettoria (ha preso un buon percorso), eval di esito (ha raggiunto l'obiettivo — via LLM-as-a-judge o umano). La produzione necessita guardrail (input/output/strumento), monitoraggio dei costi (costo-per-successo è la metrica chiave) e human-in-the-loop per azioni irreversibili. Autore: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agents-evals-observability/