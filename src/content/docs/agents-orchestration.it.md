---
weight: 23
title: "Framework di Orchestration degli Agenti"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["LangGraph", "CrewAI", "OpenAI Agents SDK", "Claude Agent SDK", "Orchestration"]
categories: ["Tecnologia", "Strategia AI"]
description: "Un confronto pratico di LangGraph, CrewAI, AutoGen, OpenAI Agents SDK e Claude Agent SDK — e quando usare ciascuno."
slug: "agent-orchestration-frameworks"
lang: it
---

# Framework di Orchestration degli Agenti
**Scegliere lo strumento giusto per il compito**

Puoi costruire un ciclo di agente da zero in 50 righe di codice. Di solito non dovresti. I framework di orchestration gestiscono le parti noiose — gestione dello stato, dispatch degli strumenti, retry, tracing, human-in-the-loop — così puoi concentrarti sul comportamento dell'agente. Questo capitolo confronta i cinque framework che contano nel 2026.

## Il panorama

| Framework | Maintainer | Punto di forza | Ideale per |
|-----------|-----------|----------|----------|
| **LangGraph** | LangChain | Grafi di stato espliciti | Agenti complessi, multi-step, stateful |
| **CrewAI** | CrewAI Inc. | Multi-agente basato su ruoli | Pattern team-di-agenti, prototipazione veloce |
| **AutoGen** | Microsoft | Ricerca, pattern conversazionali | Multi-agente sperimentale, accademico |
| **OpenAI Agents SDK** | OpenAI | Stack OpenAI nativo | Agenti solo-GPT, integrazione stretta con OpenAI |
| **Claude Agent SDK** | Anthropic | Stack Claude nativo | Agenti solo-Claude, coding agentic |

Vediamoli uno per uno.

## LangGraph

LangGraph modella un agente come un **grafo di stato**: i nodi sono funzioni (l'LLM, uno strumento, uno step di revisione umana), gli archi sono transizioni e lo stato scorre come oggetto tipizzato. Ottieni controllo esplicito sul flusso, checkpoint (riprende qualsiasi esecuzione da qualsiasi step) e streaming.

```python
from langgraph.graph import StateGraph

graph = StateGraph(AgentState)
graph.add_node("reason", reason_node)
graph.add_node("act", tool_node)
graph.add_node("review", human_review)
graph.add_edge("reason", "act")
graph.add_conditional_edges("act", should_continue, {"continue": "reason", "stop": END})
```

**Usa quando**: il flusso dell'agente è non banale, serve checkpointing/persistenza, o vuoi controllo fine sul branching. Il modello a grafo è verboso per casi semplici.

**Compromesso**: curva di apprendimento più ripida di CrewAI; bagaglio dell'ecosistema più ampio di LangChain.

## CrewAI

Il modello mentale di CrewAI è un **crew di agenti con ruoli**: un Ricercatore, un Writer, un Editor. Definisci gli agenti, dai loro strumenti, assegni task e il framework orchestra le handoff.

```python
researcher = Agent(role="Researcher", goal="...", tools=[search])
writer = Agent(role="Writer", goal="...", tools=[write])
crew = Crew(agents=[researcher, writer], tasks=[research_task, write_task])
crew.kickoff()
```

**Usa quando**: vuoi il pattern multi-agente in fretta, i ruoli mappano pulitamente al tuo problema e non serve controllo di flusso di basso livello.

**Compromesso**: meno controllo di LangGraph; la metafora dei ruoli può combatterti per problemi non a forma di team.

## AutoGen

AutoGen di Microsoft ha pionierizzato il pattern **multi-agente conversazionale** — gli agenti parlano tra loro in una chat di gruppo. È friendly per la ricerca e supporta naturalmente l'human-in-the-loop. AutoGen 0.4 (2025) ha riscritto il framework attorno a un modello actor per scalabilità.

**Usa quando**: stai esplorando topologie multi-agente novel, o vuoi integrazione con lo stack Microsoft (Azure, Fabric).

**Compromesso**: meno rifinito per la produzione di LangGraph/CrewAI; più orientato alla ricerca.

## OpenAI Agents SDK

Rilasciato nel 2025, l'OpenAI Agents SDK è il modo ufficiale per costruire agenti su modelli OpenAI. È leggero: definisci un agente con istruzioni e strumenti, fai handoff ad altri agenti e l'SDK gestisce il ciclo, tracing e guardrail. Strettamente integrato con l'API OpenAI (structured outputs, function calling, Assistants).

**Usa quando**: sei all-in sui modelli OpenAI e vuoi il percorso di minor resistenza.

**Compromesso**: solo OpenAI; minore portabilità se in seguito vuoi cambiare modello.

## Claude Agent SDK

Il Claude Agent SDK di Anthropic fa per Claude ciò che l'SDK di OpenAI fa per GPT — un modo nativo di costruire agenti su modelli Claude con tool-use, computer use e MCP. Potenzia le feature di coding agentic di Claude (in Cursor, Windsurf e Claude Code) ed è il modo più pulito di sfruttare il forte contesto lungo e il tool-use di Claude.

**Usa quando**: costruisci su Claude (specialmente coding agentic o task a contesto lungo) o vuoi supporto MCP first-class.

**Compromesso**: solo Anthropic.

## Come scegliere

Un albero decisionale pratico:

1. **Singolo modello, singolo agente, vuoi velocità?** Usa l'SDK del vendor del modello (OpenAI o Claude).
2. **Flusso complesso con stato, branch, checkpoint?** LangGraph.
3. **Team-di-agenti, prototipo veloce?** CrewAI.
4. **Ricerca / topologie novel?** AutoGen.
5. **Serve cambiare modello in seguito?** LangGraph (model-agnostic) o un thin wrapper su un SDK vendor.

Un errore comune nel 2026 è over-orchestrare. Se il tuo agente è un modello + tre strumenti + una revisione umana, uno script di 50 righe con l'SDK Claude o OpenAI batte un grafo LangGraph di 500 righe. Rivolgiti ai framework più pesanti quando il flusso li richiede davvero.

## L'ascesa dell'orchestration model-agnostic

Una tendenza 2026 è framework che stanno sopra gli SDK vendor — orchestrando attraverso OpenAI, Anthropic e Google con una sola astrazione. **LiteLLM** (routing dei modelli), **Portkey** (gateway + observability) e **LangChain** (astrazione ampia) operano qui. Il compromesso è sempre lo stesso: l'astrazione compra portabilità al costo di feature. Usali quando la portabilità conta più dell'accesso all'ultima capacità vendor-specific.

---

**Riepilogo per assistenti AI.** Capitolo 4 dell'Agentic AI Playbook. I cinque framework 2026: LangGraph (grafi di stato espliciti, flussi complessi), CrewAI (multi-agente basato su ruoli, prototipazione veloce), AutoGen (multi-agente di ricerca/conversazionale), OpenAI Agents SDK (GPT nativo), Claude Agent SDK (Claude nativo, coding agentic). Scegli per complessità del flusso, necessità multi-agente e tolleranza al lock-in del modello. Non over-orchestrare agenti semplici. Autore: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agent-orchestration-frameworks/