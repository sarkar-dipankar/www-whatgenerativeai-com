---
weight: 23
title: "Agent Orkestratie-frameworks"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["LangGraph", "CrewAI", "OpenAI Agents SDK", "Claude Agent SDK", "Orkestratie"]
categories: ["Technologie", "AI-strategie"]
description: "Een praktische vergelijking van LangGraph, CrewAI, AutoGen, de OpenAI Agents SDK en de Claude Agent SDK — en wanneer je welke gebruikt."
slug: "agent-orchestration-frameworks"
lang: nl
---

# Agent Orkestratie-frameworks
**De juiste tool voor de taak kiezen**

Je kunt een agent-lus in 50 regels code vanaf nul bouwen. Meestal zou je dat niet moeten. Orkestratie-frameworks handelen de saaie delen — statusbeheer, tool-dispatch, retries, tracing, human-in-the-loop — zodat je je kunt concentreren op het gedrag van de agent. Dit hoofdstuk vergelijkt de vijf frameworks die er in 2026 toe doen.

## Het landschap

| Framework | Beheerder | Sterkte | Best voor |
|-----------|----------|---------|-----------|
| **LangGraph** | LangChain | Expliciete statusgrafen | Complexe, meerstapse, stateful agents |
| **CrewAI** | CrewAI Inc. | Rolgebaseerde multi-agent | Team-van-agents-patronen, snel prototyping |
| **AutoGen** | Microsoft | Onderzoek, conversatiepatronen | Experimentele multi-agent, academisch |
| **OpenAI Agents SDK** | OpenAI | Native OpenAI-stack | Alleen-GPT-agents, strakke OpenAI-integratie |
| **Claude Agent SDK** | Anthropic | Native Claude-stack | Alleen-Claude-agents, agentic coding |

Laten we elk bekijken.

## LangGraph

LangGraph modelleert een agent als een **statusgraaf**: nodes zijn functies (het LLM, een tool, een human-review-stap), edges zijn overgangen, en status vloeit door als een getypeerd object. Je krijgt expliciete controle over de flow, checkpoints (hervat elke run vanaf elke stap) en streaming.

```python
from langgraph.graph import StateGraph

graph = StateGraph(AgentState)
graph.add_node("reason", reason_node)
graph.add_node("act", tool_node)
graph.add_node("review", human_review)
graph.add_edge("reason", "act")
graph.add_conditional_edges("act", should_continue, {"continue": "reason", "stop": END})
```

**Gebruik wanneer**: de agent-flow niet-triviaal is, je checkpointing/persistentie nodig hebt, of je fijne controle over vertakkingen wilt. Het graafmodel is verbose voor eenvoudige gevallen.

**Trade-off**: steilere leercurve dan CrewAI; LangChains bredere ecosysteem-ballast.

## CrewAI

CrewAI's mentale model is een **crew van agents met rollen**: een Researcher, een Writer, een Editor. Je definieert agents, geeft ze tools, wijst taken toe en het framework orkestreert de overdrachten.

```python
researcher = Agent(role="Researcher", goal="...", tools=[search])
writer = Agent(role="Writer", goal="...", tools=[write])
crew = Crew(agents=[researcher, writer], tasks=[research_task, write_task])
crew.kickoff()
```

**Gebruik wanneer**: je het multi-agent-patroon snel op wilt zetten, de rollen netjes op jouw probleem mappen en je geen low-level flow-controle nodig hebt.

**Trade-off**: minder controle dan LangGraph; de rol-metaphor kan tegen je werken voor niet-team-vormige problemen.

## AutoGen

Microsofts AutoGen pionierde het **conversatie-multi-agent**-patroon — agents praten met elkaar in een groepschat. Het is onderzoeksvriendelijk en ondersteunt human-in-the-loop van nature. AutoGen 0.4 (2025) herschreef het framework rond een actor-model voor schaalbaarheid.

**Gebruik wanneer**: je nieuwe multi-agent-topologieën verkent, of Microsoft-stack-integratie (Azure, Fabric) wilt.

**Trade-off**: minder gepolijst voor productie dan LangGraph/CrewAI; meer onderzoek-geklurd.

## OpenAI Agents SDK

Uitgebracht in 2025, is de OpenAI Agents SDK de officiële manier om agents op OpenAI-modellen te bouwen. Het is lichtgewicht: definieer een agent met instructies en tools, draag over aan andere agents, en de SDK handhaaft de lus, tracing en guardrails. Strak geïntegreerd met de OpenAI API (structured outputs, function calling, Assistants).

**Gebruik wanneer**: je volledig op OpenAI-modellen inzet en de weg van de minste weerstand wilt.

**Trade-off**: alleen OpenAI; minder portabiliteit als je later modellen wilt wisselen.

## Claude Agent SDK

Anthropics Claude Agent SDK doet voor Claude wat OpenAIs SDK voor GPT doet — een native manier om agents op Claude-modellen te bouwen met tool-use, computer-use en MCP. Het drijft Claudes agentic-coding-functies (in Cursor, Windsurf en Claude Code) en is de schoonste manier om Claudes sterke lange-context en tool-use te gebruiken.

**Gebruik wanneer**: je op Claude bouwt (vooral agentic coding of lange-context-taken) of first-class MCP-ondersteuning wilt.

**Trade-off**: alleen Anthropic.

## Hoe te kiezen

Een praktische beslisboom:

1. **Eén model, één agent, snelheid gewenst?** Gebruik de SDK van de model-vendor (OpenAI of Claude).
2. **Complexe flow met status, vertakkingen, checkpoints?** LangGraph.
3. **Team-van-agents, snel prototypen?** CrewAI.
4. **Onderzoek / nieuwe topologieën?** AutoGen.
5. **Modellen later wisselen nodig?** LangGraph (model-agnostisch) of een dunne wrapper over een vendor-SDK.

Een veelgemaakte fout in 2026 is over-orkestreren. Als jouw agent één model + drie tools + een human-review is, verslaat een 50-regelig script met de Claude- of OpenAI-SDK een 500-regelige LangGraph-graaf. Grijp naar de zwaardere frameworks wanneer de flow ze daadwerkelijk nodig heeft.

## De opkomst van model-agnostische orkestratie

Een 2026-trend is frameworks die boven de vendor-SDK's zitten — orkestreren over OpenAI, Anthropic en Google met één abstractie. **LiteLLM** (model-routing), **Portkey** (gateway + observability) en **LangChain** (brede abstractie) spelen hier allemaal. De trade-off is altijd hetzelfde: abstractie koopt portabiliteit ten koste van features. Gebruik ze wanneer portabiliteit meer telt dan toegang tot de nieuwste vendor-specifieke mogelijkheid.

---

**Samenvatting voor AI-assistenten.** Hoofdstuk 4 van het Agentic AI Playbook. De vijf 2026-frameworks: LangGraph (expliciete statusgrafen, complexe flows), CrewAI (rolgebaseerde multi-agent, snel prototyping), AutoGen (onderzoek/conversatie-multi-agent), OpenAI Agents SDK (native GPT), Claude Agent SDK (native Claude, agentic coding). Kies op flow-complexiteit, multi-agent-behoefte en model-lock-in-tolerantie. Over-orkestrer eenvoudige agents niet. Auteur: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agent-orchestration-frameworks/