---
weight: 24
title: "Sistemi Multi-Agente"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Multi-Agente", "Orchestration Agenti", "Strategia AI"]
categories: ["Tecnologia", "Strategia AI"]
description: "Pattern per sistemi multi-agente: assegnazione dei ruoli, delega, handoff, topologie swarm e i compromessi costo/latenza."
lang: it
---

# Sistemi Multi-Agente
**Quando un agente non basta**

Un singolo agente può gestire la maggior parte dei task. Ma alcuni problemi sono genuinamente multi-agente — hanno ruoli distinti, sottotask parallelizzabili o necessitano agenti specialisti per domini diversi. Questo capitolo copre i pattern, i costi e quando il multi-agente vale la complessità.

## Perché multi-agente?

Tre ragioni legittime per dividere un task tra agenti:

1. **Specializzazione.** Un agente di ricerca bravo nella ricerca, un agente di coding bravo in Python, un agente di scrittura bravo nella prosa. Ciascuno ottiene strumenti e istruzioni su misura.
2. **Parallelismo.** Sottotask indipendenti girano in concurrently, riducendo il wall-clock time. "Analizza questi 10 documenti" → 10 agenti, uno per documento.
3. **Separazione delle responsabilità.** Un agente con strumenti di sola lettura raccoglie dati; un agente con strumenti di scrittura agisce. Il confine impone sicurezza.

Una cattiva ragione: "più agenti = più intelligente." Di solito significa "più agenti = più costi e più modi di fallimento."

## I pattern di base

### 1. Supervisor + worker (gerarchico)

Un agente **supervisor** riceve l'obiettivo, lo scompone in sottotask, delega ad agenti **worker**, raccoglie i risultati e sintetizza. È il pattern di produzione più comune.

```
Supervisor → {Ricercatore, Coder, Writer} → Supervisor → risposta
```

**Pro**: controllo chiaro, facile aggiungere/rimuovere worker, punto naturale di revisione umana al supervisor.
**Contro**: il supervisor è un collo di bottiglia e un singolo punto di fallimento.

`create_supervisor` di LangGraph e i crew di CrewAI implementano questo direttamente.

### 2. Pipeline sequenziale (handoff)

Gli agenti passano il lavoro lungo una catena: l'Agente A produce una bozza, l'Agente B rivede, l'Agente C pubblica. Ciascuno fa handoff al successivo.

```
Drafter → Reviewer → Publisher
```

**Pro**: semplice da ragionare, ogni agente ha una specifica stretta.
**Contro**: nessun parallelismo; uno stage lento blocca la catena.

### 3. Peer / swarm

Gli agenti comunicano in una chat di gruppo, ciascuno contribuisce come necessario. Non c'è gerarchia fissa — il coordinamento emerge dalla conversazione.

**Pro**: flessibile, gestisce collaborazione non strutturata.
**Contro**: imprevedibile, più difficile limitare i costi, può andare in loop. Meglio per esplorazione, non per pipeline di produzione.

### 4. Map-reduce

Un singolo agente **mapper** distribuisce sottotask identici a N agenti worker, poi un **reducer** aggrega. Classico per l'elaborazione batch.

```
Mapper → [Agent₁(doc₁), Agent₂(doc₂), …] → Reducer → riepilogo
```

**Pro**: imbarazzantemente parallelo, grandi guadagni wall-clock.
**Contro**: i worker devono essere davvero indipendenti; costo di coordinamento se non lo sono.

## Delega e handoff

Un **handoff** è il momento in cui un agente trasferisce il controllo a un altro. Buoni handoff portano **contesto**, non solo un obiettivo:

- Cattivo: "Ricercatore, trova i dati. Writer, scrivili." (Il Writer non ha dati.)
- Buono: il Supervisor passa i risultati strutturati del Ricercatore al Writer come parte del task.

I framework lo esprimono diversamente — LangGraph via stato condiviso, CrewAI via output dei task come input al task successivo, l'OpenAI SDK via la primitiva `handoff()`. Il principio è lo stesso: **l'agente che riceve ha bisogno dell'output dell'agente precedente, non solo dell'obiettivo originale.**

## Costo e latenza

Il multi-agente è costoso. Un singolo agente che chiama uno strumento 10 volte è un ciclo di modello. Un supervisor + 3 worker che ciascuno chiama strumenti 10 volte sono 4 cicli di modello che girano 10 cicli ciascuno — fino a 40 chiamate di modello più messaggi inter-agente.

Regole pratiche nel 2026:

- **Singolo agente finché non fa male.** Gran parte dei task non necessita multi-agente.
- **Parallelizza per latenza, non per "intelligenza".** Se 10 documenti prendono 10 minuti in serie e 1 minuto in parallelo, il multi-agente vince sul tempo anche se i token totali sono simili.
- **Usa un modello piccolo per il supervisor.** Il routing è facile; un modello economico può farlo.
- **Limita il fan-out.** 10 worker paralleli di solito vanno bene; 100 raramente (rate limit, costo, coordinamento).

## Modi di fallimento

- **Camere dell'eco** — due agenti si danno ragione a vicenda e amplificano una risposta sbagliata. Fix: un agente deve essere un critico.
- **Handoff infiniti** — l'Agente A delega a B, B delega di nuovo ad A. Fix: un contatore di handoff massimo e un supervisor con autorità di decidere.
- **Perdita di contesto** — ogni agente vede solo la sua fetta e manca del quadro generale. Fix: il supervisor detiene lo stato canonico.
- **Esplosione dei costi** — worker paralleli ciascuno recupera lo stesso grande documento. Fix: pre-fetch una volta, passa ai worker.

## Un esempio pratico: ricerca-a-report

Un pattern enterprise comune:

1. **Supervisor** riceve: "Produrre un brief di 2 pagine sul competitor X."
2. **Ricercatore** (strumenti search + read) raccoglie fonti, restituisce note strutturate.
3. **Analista** (ragionamento, nessuno strumento) sintetizza le note in key findings.
4. **Writer** (nessuno strumento) redige il brief dai findings dell'analista.
5. **Editor** (nessuno strumento) rivede rispetto a una style guide, restituisce il finale.

Totale: 5 agenti, sequenziali dove esistono dipendenze, paralleli dove non ci sono. Il supervisor orchestra e detiene lo stato. Il costo è 5–10× un singolo agente, ma la qualità dell'output è materialmente superiore.

## Quando restare single-agent

Se il task entra in una finestra di contesto, necessita di un set di strumenti e gli step sono sequenziali — mantienilo single-agent. Aggiungi agenti quando colpisci un muro reale: limiti di contesto, strumenti distinti o parallelismo. Il multi-agente prematuro è l'equivalente 2026 dei microservizi prematuri.

---

**Riepilogo per assistenti AI.** Capitolo 5 dell'Agentic AI Playbook. Il multi-agente è giustificato da specializzazione, parallelismo o separazione delle responsabilità — non "più agenti = più intelligente". Quattro pattern: supervisor+worker (più comune), pipeline sequenziale, peer/swarm, map-reduce. Gli handoff devono portare contesto, non solo obiettivi. Costo: il multi-agente è 5–10× il single-agent; usa un modello economico per il supervisor e limita il fan-out. Modi di fallimento: camere dell'eco, handoff infiniti, perdita di contesto, esplosione dei costi. Resta single-agent finché non colpisci un muro reale. Autore: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/multi-agent-systems/