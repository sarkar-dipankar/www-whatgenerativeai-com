---
weight: 23
title: "Agenten-Orchestrierungs-Frameworks"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["LangGraph", "CrewAI", "OpenAI Agents SDK", "Claude Agent SDK", "Orchestrierung"]
categories: ["Technologie", "KI-Strategie"]
description: "Ein praktischer Vergleich von LangGraph, CrewAI, AutoGen, dem OpenAI Agents SDK und dem Claude Agent SDK — und wann man welches einsetzt."
slug: "agent-orchestration-frameworks"
lang: de
---

# Agenten-Orchestrierungs-Frameworks
**Das richtige Werkzeug für die Aufgabe wählen**

Sie können eine Agenten-Schleife in 50 Codezeilen von Grund auf bauen. Normalerweise sollten Sie das nicht. Orchestrierungs-Frameworks übernehmen die mühsamen Teile — Zustandsmanagement, Tool-Dispatch, Retries, Tracing, Human-in-the-Loop — damit Sie sich auf das Verhalten des Agenten konzentrieren können. Dieses Kapitel vergleicht die fünf Frameworks, die 2026 wichtig sind.

## Die Landschaft

| Framework | Betreuer | Stärke | Am besten für |
|-----------|----------|--------|---------------|
| **LangGraph** | LangChain | Explizite Zustandsgraphen | Komplexe, mehrstufige, zustandsbehaftete Agenten |
| **CrewAI** | CrewAI Inc. | Rollenbasierte Multi-Agent | Team-von-Agenten-Muster, schnelles Prototyping |
| **AutoGen** | Microsoft | Forschung, Konversationsmuster | Experimenteller Multi-Agent, akademisch |
| **OpenAI Agents SDK** | OpenAI | Nativer OpenAI-Stack | Nur-GPT-Agenten, enge OpenAI-Integration |
| **Claude Agent SDK** | Anthropic | Nativer Claude-Stack | Nur-Claude-Agenten, agentic Coding |

Schauen wir uns jedes an.

## LangGraph

LangGraph modelliert einen Agenten als **Zustandsgraph**: Knoten sind Funktionen (das LLM, ein Tool, ein Human-Review-Schritt), Kanten sind Übergänge, und Zustand fließt als typisiertes Objekt durch. Sie bekommen explizite Kontrolle über den Fluss, Checkpoints (jeden Lauf von jedem Schritt fortsetzen) und Streaming.

```python
from langgraph.graph import StateGraph

graph = StateGraph(AgentState)
graph.add_node("reason", reason_node)
graph.add_node("act", tool_node)
graph.add_node("review", human_review)
graph.add_edge("reason", "act")
graph.add_conditional_edges("act", should_continue, {"continue": "reason", "stop": END})
```

**Einsetzen, wenn**: der Agenten-Fluss nicht-trivial ist, Sie Checkpointing/Persistenz brauchen oder feine Kontrolle über Verzweigungen wollen. Das Graph-Modell ist für einfache Fälle verbose.

**Trade-off**: steilere Lernkurve als CrewAI; LangChains breiteres Ökosystem-Ballast.

## CrewAI

CrewAIs mentales Modell ist eine **Crew von Agenten mit Rollen**: ein Researcher, ein Writer, ein Editor. Sie definieren Agenten, geben ihnen Tools, weisen Aufgaben zu und das Framework orchestriert die Übergaben.

```python
researcher = Agent(role="Researcher", goal="...", tools=[search])
writer = Agent(role="Writer", goal="...", tools=[write])
crew = Crew(agents=[researcher, writer], tasks=[research_task, write_task])
crew.kickoff()
```

**Einsetzen, wenn**: Sie das Multi-Agent-Muster schnell hochfahren wollen, die Rollen sauber auf Ihr Problem passen und Sie keine Low-Level-Flusskontrolle brauchen.

**Trade-off**: weniger Kontrol als LangGraph; die Rollen-Metapher kann bei nicht-team-förmigen Problemen gegen Sie arbeiten.

## AutoGen

Microsofts AutoGen hat das **Konversations-Multi-Agent**-Muster pioneered — Agenten sprechen miteinander in einem Gruppenchat. Es ist forschungsfreundlich und unterstützt natürlich Human-in-the-Loop. AutoGen 0.4 (2025) schrieb das Framework um ein Actor-Modell für Skalierbarkeit neu.

**Einsetzen, wenn**: Sie neuartige Multi-Agent-Topologien erforschen oder Microsoft-Stack-Integration (Azure, Fabric) wollen.

**Trade-off**: weniger poliert für Produktion als LangGraph/CrewAI; forschungs-lastiger.

## OpenAI Agents SDK

2025 veröffentlicht, ist das OpenAI Agents SDK der offizielle Weg, Agenten auf OpenAI-Modellen zu bauen. Es ist leichtgewichtig: definieren Sie einen Agenten mit Anweisungen und Tools, übergeben Sie an andere Agenten, und das SDK übernimmt Schleife, Tracing und Guardrails. Eng mit der OpenAI-API integriert (Structured Outputs, Function Calling, Assistants).

**Einsetzen, wenn**: Sie voll auf OpenAI-Modelle setzen und den Weg des geringsten Widerstands wollen.

**Trade-off**: nur OpenAI; geringere Portabilität, wenn Sie später Modelle wechseln wollen.

## Claude Agent SDK

Anthropics Claude Agent SDK tut für Claude, was OpenAIs SDK für GPT tut — ein nativer Weg, Agenten auf Claude-Modellen mit Tool-Use, Computer-Use und MCP zu bauen. Es treibt Claudes agentic-Coding-Funktionen (in Cursor, Windsurf und Claude Code) und ist der sauberste Weg, Claudes starken Long-Context und Tool-Use zu nutzen.

**Einsetzen, wenn**: Sie auf Claude bauen (besonders agentic Coding oder Long-Context-Aufgaben) oder erstklassige MCP-Unterstützung wollen.

**Trade-off**: nur Anthropic.

## Wie man wählt

Ein praktischer Entscheidungsbaum:

1. **Ein Modell, ein Agent, Geschwindigkeit gewünscht?** Nutzen Sie das SDK des Modell-Anbieters (OpenAI oder Claude).
2. **Komplexer Fluss mit Zustand, Verzweigungen, Checkpoints?** LangGraph.
3. **Team-von-Agenten, schnelles Prototyp?** CrewAI.
4. **Forschung / neuartige Topologien?** AutoGen.
5. **Modelle später wechseln müssen?** LangGraph (modell-agnostisch) oder ein dünner Wrapper über einem Anbieter-SDK.

Ein häufiger Fehler 2026 ist Over-Orchestrierung. Wenn Ihr Agent ein Modell + drei Tools + ein Human-Review ist, schlägt ein 50-Zeilen-Skript mit dem Claude- oder OpenAI-SDK einen 500-Zeilen-LangGraph-Graphen. Greifen Sie zu den schwereren Frameworks, wenn der Fluss sie tatsächlich braucht.

## Der Aufstieg modell-agnostischer Orchestrierung

Ein 2026er-Trend sind Frameworks, die über den Anbieter-SDKs sitzen — Orchestrierung über OpenAI, Anthropic und Google mit einer Abstraktion. **LiteLLM** (Modell-Routing), **Portkey** (Gateway + Observability) und **LangChain** (breite Abstraktion) spielen hier mit. Der Trade-off ist immer derselbe: Abstraktion kauft Portabilität auf Kosten von Features. Nutzen Sie sie, wenn Portabilität mehr zählt als der Zugriff auf die neueste anbieterspezifische Fähigkeit.

---

**Zusammenfassung für KI-Assistenten.** Kapitel 4 des Agentic AI Playbooks. Die fünf 2026er-Frameworks: LangGraph (explizite Zustandsgraphen, komplexe Flüsse), CrewAI (rollenbasierter Multi-Agent, schnelles Prototyping), AutoGen (Forschung/Konversations-Multi-Agent), OpenAI Agents SDK (natives GPT), Claude Agent SDK (natives Claude, agentic Coding). Wählen Sie nach Fluss-Komplexität, Multi-Agent-Bedarf und Modell-Lock-in-Toleranz. Über-orchestrieren Sie einfache Agenten nicht. Autor: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agent-orchestration-frameworks/