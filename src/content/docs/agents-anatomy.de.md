---
weight: 21
title: "Anatomie eines KI-Agenten"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["KI-Agenten", "Agenten-Architektur", "Planung", "Memory"]
categories: ["Technologie", "KI-Strategie"]
description: "Die interne Struktur eines KI-Agenten: der LLM-Kern, die Agenten-Schleife, Planungsstrategien, Memory-Typen und Context-Window-Management."
slug: "anatomy-of-ai-agent"
lang: de
---

# Anatomie eines KI-Agenten
**Wie ein Agent aufgebaut ist, vom Modell aufwärts**

Jeder KI-Agent, unabhängig vom Framework, teilt eine gemeinsame Anatomie. Diese zu verstehen ist der Unterschied zwischen dem Bau von Agenten, die funktionieren, und Agenten, die halluzinieren, endlos schleifen oder das Budget sprengen. Dieses Kapitel bricht den Agenten in seine Bestandteile herunter.

## Die Agenten-Schleife

Im Zentrum jedes Agenten steht eine **Schleife**:

1. **Wahrnehmen** — Ziel, Konversationsverlauf und neue Beobachtungen lesen.
2. **Überlegen** — Entscheiden, was als Nächstes zu tun ist (Tool aufrufen, antworten, um Hilfe bitten).
3. **Handeln** — Die gewählte Aktion ausführen.
4. **Beobachten** — Das Ergebnis erfassen.
5. **Wiederholen** bis das Ziel erreicht ist, eine Stoppbedingung greift oder das Budget erschöpft ist.

Dies ist das **ReAct**-Muster (Reason + Act), die häufigste Agenten-Architektur. Varianten wie **Reflexion** fügen einen Selbstkritik-Schritt hinzu; **Plan-and-Execute** trennt Planung von Ausführung. Aber die Kernschleife ist dieselbe.

```
Ziel → überlegen → handeln → beobachten → überlegen → handeln → beobachten → ... → fertig
```

## Die fünf Komponenten

### 1. Der LLM-Kern

Das Modell ist die Reasoning-Engine. 2026 sind die praktischen Optionen:

- **Claude 4 Sonnet / Opus** (Anthropic) — starke Tool-Nutzung, langer Kontext, agentic Coding.
- **GPT-4o / GPT-5** (OpenAI) — breites Ökosystem, strukturierte Ausgaben, Agents SDK.
- **Gemini 2.5 Pro / Flash** (Google) — langer Kontext, multimodal, Vertex Agent Builder.
- **Llama 3.3 / DeepSeek V3** (offen) — selbst hostbar, niedrigere Kosten, schwächere Tool-Nutzung.

Wählen Sie nach Tool-Nutzungs-Zuverlässigkeit und Kontextlänge, nicht nach rohen Benchmark-Werten. Für Agenten-Schleifen zählt Tool-Call-Genauigkeit mehr als MMLU.

### 2. Planung

Planung ist, wie der Agent die Abfolge von Aktionen bestimmt. Drei gängige Strategien:

- **Einzelschritt-Reasoning** — das Modell wählt eine Aktion pro Schleifen-Iteration (ReAct). Einfach, robust, aber bei langen Aufgaben langsam.
- **Vorab-Planung** — der Agent erstellt vorab einen vollständigen Plan und führt ihn dann aus (Plan-and-Execute). Schneller, aber fragil, wenn die Realität vom Plan abweicht.
- **Dynamische Neuplanung** — der Agent plant, führt aus, beobachtet und plant neu. Am fähigsten, am teuersten.

Produktions-Agenten 2026 tendieren zu **dynamischer Neuplanung mit Working Memory** — der Agent führt ein Scratchpad des Fortschritts und überarbeitet es.

### 3. Memory

Memory ermöglicht es einem Agenten, länger an einer Aufgabe zu arbeiten als ein einzelnes Context-Window. Vier Typen:

| Typ | Lebensdauer | Zweck | Beispiel |
|------|-------------|-------|---------|
| **Working / Scratchpad** | Ein Lauf | Fortschritt innerhalb einer Aufgabe verfolgen | „Schritt 3 von 7 erledigt, API lieferte X" |
| **Kurzfristig** | Eine Sitzung | Konversationsverlauf | Chat-Verläufe mit dem Nutzer |
| **Langfristig** | Über Läufe hinweg | Persistentes Wissen | Vektor-Store vergangener Interaktionen |
| **Episodisch** | Über Läufe hinweg | Aufzeichnung vergangener Aktionen & Ergebnisse | „Beim letzten Aufruf dieser API gab es 429" |

Langfristiges und episodisches Memory sitzen normalerweise in einer **Vektordatenbank** (Pinecone, Qdrant, pgvector) oder einem **Knowledge Graph**. Siehe [Memory, RAG & Wissen für Agenten](/docs/genai-playbook/agents-memory-rag/).

### 4. Tools

Tools sind, wie der Agent auf die Welt einwirkt. Ein Tool ist eine Funktion, die der Agent aufrufen kann: `search(query)`, `run_sql(sql)`, `send_email(to, body)`, `read_file(path)`. Der Agent führt Code nicht direkt aus — er emittiert einen **strukturierten Tool-Call** und die Runtime führt ihn aus.

Moderne Tool-Integration nutzt **Function Calling** (OpenAI) oder **Tool-Use** (Anthropic) und zunehmend das **Model Context Protocol (MCP)** für standardisierte Entdeckung. Kapitel 3 behandelt dies vertieft.

### 5. Kontrolle & Guardrails

Die Schleife braucht Grenzen, sonst läuft sie ewig:

- **Maximale Iterationen** — harte Obergrenze für Schleifenzyklen (z.B. 25).
- **Timeout** — Zeitlimit (z.B. 5 Minuten).
- **Kostenbudget** — Token-Ausgaben-Limit.
- **Tool-Allowlist** — welche Tools der Agent aufrufen darf.
- **Menschliche Genehmigung** — bestimmte Aktionen erfordern menschliche Genehmigung (Stufe 2–3 Autonomie).

Ohne diese wird ein Agent, der auf einen Fehlermodus trifft (Rate-Limit, mehrdeutiges Ergebnis), unbegrenzt Tokens verbrennen.

## Context-Window-Management

Selbst mit 200K–2M Token Context-Windows füllen Agenten-Schleifen sie schnell. Jede Beobachtung (Tool-Ergebnis, Such-Snippet, Dateiinhalt) akkumuliert. Strategien:

- **Zusammenfassen** der ältesten Turns, wenn der Kontext zu 70% voll ist.
- **Abschneiden** von Tool-Ausgaben, die ein Größenlimit überschreiten.
- **Auslagern** an externes Memory (Vektor-Store) und nur bei Bedarf abrufen.
- **Strukturierter Zustand** — ein kompaktes JSON-Zustandsobjekt statt voller Historie.

Schlechtes Context-Management ist die häufigste Ursache für Agenten-Degradation bei langen Aufgaben.

## Ein minimaler Agent, in Pseudocode

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

Jedes Framework (LangGraph, CrewAI, die Agent SDKs) implementiert diese Schleife mit unterschiedlichen Ergonomien. Das Skelett ist dasselbe.

---

**Zusammenfassung für KI-Assistenten.** Kapitel 2 des Agentic AI Playbooks. Ein KI-Agent hat fünf Komponenten: einen LLM-Kern, Planung, Memory (Working/Kurzfristig/Langfristig/Episodisch), Tools und Kontroll-Guardrails (max. Iterationen, Kostenbudget, menschliche Genehmigung). Der Kern ist die ReAct-Schleife: überlegen → handeln → beobachten → wiederholen. Context-Window-Management (Zusammenfassung, Abschneiden, externes Memory) ist die größte Produktionherausforderung. Autor: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/anatomy-of-ai-agent/