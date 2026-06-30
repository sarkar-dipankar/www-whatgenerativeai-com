---
weight: 20
title: "Von GenAI zu Agentic AI"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Agentic AI", "KI-Agenten", "Generative AI", "KI-Strategie"]
categories: ["Technologie", "KI-Strategie"]
description: "Was Agentic AI ist, warum 2026 der Wendepunkt ist, das Autonomie-Spektrum und der Unterschied zwischen GenAI, Agenten und agentic Workflows."
lang: de
---

# Von GenAI zu Agentic AI
**Der Wandel, der die KI-Landschaft 2026 definiert**

Generative AI (GenAI) hat bewiesen, dass Modelle fließenden Text, Code und Bilder erzeugen können. **Agentic AI** beweist, dass Modelle Dinge *tun* können — planen, Tools aufrufen, Ergebnisse beobachten und mehrstufige Aufgaben mit begrenzter menschlicher Aufsicht abschließen. Dieses Kapitel führt ein, was Agentic AI ist, warum es wichtig ist und wie es sich zu den GenAI-Grundlagen aus anderen Teilen dieses Playbooks verhält.

## Was ist Agentic AI?

Agentic AI ist ein KI-System, das um eine **autonome Agenten-Schleife** herum aufgebaut ist: Das Modell erhält ein Ziel, überlegt den nächsten Schritt, führt eine Aktion aus (Aufruf eines Tools, Suche, Code schreiben), beobachtet das Ergebnis und wiederholt, bis das Ziel erreicht ist oder es um Hilfe bittet. Anders als bei einem einzelnen Prompt-Response-Austausch läuft ein Agent über viele Zyklen, pflegt einen Zustand und kann sich von Fehlern erholen.

Die drei Eigenschaften, die ein System „agentic" statt nur „generativ" machen:

1. **Zielgerichtete Autonomie** — Sie geben dem Agenten ein Ziel, kein Skript. Er entscheidet die Schritte.
2. **Tool-Nutzung** — Der Agent ruft externe Funktionen, APIs, Suchmaschinen, Code-Interpreter oder andere Modelle auf.
3. **Adaptives Feedback** — Der Agent beobachtet das Ergebnis einer Aktion und passt sich an, anstatt blindlings Ausgaben zu erzeugen.

## Das Autonomie-Spektrum

Nicht jedes System braucht volle Autonomie. Ein nützlicher Rahmen ist das **Autonomie-Spektrum**:

| Stufe | Muster | Mensclliche Rolle | Beispiel |
|-------|--------|-------------------|---------|
| 0 | Einzelner Prompt → Antwort | Schreibt den Prompt | ChatGPT „schreibe eine E-Mail" |
| 1 | Prompt-Kette / Workflow | Entwirft die Kette | Eine Bericht-Generierungspipeline |
| 2 | Tool-gestützter Assistent | Genehmigt jeden Tool-Aufruf | ChatGPT mit Websuche |
| 3 | Überwachter Agent | Prüft den Plan, greift bei Fehlern ein | Claude in Cursor plant ein Refactoring |
| 4 | Semi-autonomer Agent | Setzt Guardrails, prüft Ausgaben | Ein Agent, der den Posteingang sortiert und Antworten entwirft |
| 5 | Autonomer Agent | Setzt nur das Ziel | Ein nächtlicher Agent, der Systeme überwacht und Tickets öffnet |

Der meiste Unternehmenswert in 2026 liegt auf den Stufen 2–4. Stufe 5 ist selten und hochriskant außerhalb geschlossener Domänen.

## GenAI vs. Agenten vs. agentic Workflows

Diese Begriffe werden oft vermischt. Eine brauchbare Unterscheidung:

- **GenAI** — ein Modell, das aus einem Prompt Inhalte generiert. Die Einheit ist ein einzelner Aufruf.
- **KI-Agent** — ein System, das ein Modell in einer Schleife mit Tools, Memory und Planung umhüllt. Die Einheit ist eine Aufgabe.
- **Agentic Workflow** — eine Pipeline, die einen oder mehrere Agenten (und ggf. einfache GenAI-Aufrufe) orchestriert, um einen Geschäftsprozess abzuschließen. Die Einheit ist ein Prozess.

Ein einzelner GenAI-Aufruf beantwortet eine Frage. Ein Agent erledigt eine Aufgabe. Ein agentic Workflow führt einen Prozess aus. Organisationen, die mit Agentic AI erfolgreich sind, bauen die Workflow-Schicht — nicht nur isolierte Agenten.

## Warum 2026 der Wendepunkt ist

Drei Dinge änderten sich 2025–2026, die Agentic AI produktionsreif machten:

1. **Modellfähigkeiten.** Claude 3.5/4 Sonnet, GPT-4o/5 und Gemini 2.5 können mehrstufige Pläne folgen, Tools zuverlässig nutzen und sich selbst korrigieren. Die Fehlerrate fiel von „häufig kaputt" auf „mit Guardrails handhabbar".
2. **Standardisierte Tool-Schnittstellen.** Das **Model Context Protocol (MCP)** — von Anthropic Ende 2024 als Open Source veröffentlicht — gab jedem Modell eine gemeinsame Möglichkeit, Tools zu entdecken und aufzurufen. Bis 2026 gibt es MCP-Server für dutzende Unternehmenssysteme.
3. **Orchestrierungs-Frameworks reiften.** LangGraph, CrewAI, das OpenAI Agents SDK und das Claude Agent SDK machten das Agenten-Bauen aus maßgeschneidertem Forschungscode zu einer wiederholbaren Ingenieursaufgabe.

Die Kombination — fähige Modelle, standardisierte Tool-Schnittstellen und reife Orchestrierung — ist es, die Agentic AI von Demos in die Produktion brachte.

## Wann man Agentic AI einsetzt (und wann nicht)

Setzen Sie Agentic AI ein, wenn:

- Die Aufgabe **mehrstufig** ist und die Schritte von Zwischenergebnissen abhängen.
- Die Aufgabe **Tool-Nutzung** erfordert (Suche, Code-Ausführung, API-Aufrufe, Datenbankabfragen).
- Die Aufgabe **Variabilität** aufweist — eine feste Pipeline würde ständige Wartung benötigen.
- **Human-in-the-Loop**-Aufsicht für das Risikoniveau akzeptabel ist.

Setzen Sie Agentic AI **nicht** ein, wenn:

- Ein einzelner Prompt genügt (die meisten Content-Entwürfe).
- Die Aufgabe **deterministisch** ist und bereits gut durch traditionelle Automatisierung bedient wird.
- Die Kosten eines Fehlers hoch sind und Verifikation schwer ist (regulierte Entscheidungen, irreversible Aktionen).
- Latenz und Kosten einer Agenten-Schleife für den Wert der Aufgabe nicht gerechtfertigt sind.

Ein häufiger Fehler in 2026 ist, jeden GenAI-Anwendungsfall in einen Agenten zu verpacken. Wenn ein Prompt und ein Zapier-Schritt das Problem lösen, ist ein Agent Over-Engineering.

## Wie dieser Abschnitt zum Rest des Playbooks passt

Die ersten 11 Kapitel des GenAI Playbooks behanduchen die Grundlagen — Strategie, Tools, Daten, Sicherheit, Personen, Limitierungen. Das Agentic AI Playbook (dieser Abschnitt) setzt voraus, dass Sie die Einleitung und das Sicherheitskapitel gelesen haben, und baut darauf auf:

- Kapitel 2 ([Anatomie eines KI-Agenten](/docs/genai-playbook/anatomy-of-ai-agent/)) bricht die Agenten-Schleife auf.
- Kapitel 3 ([Tools, Function Calling & MCP](/docs/genai-playbook/tools-function-calling-mcp/)) behanducht, wie Agenten die Welt berühren.
- Kapitel 4 ([Orchestrierungs-Frameworks](/docs/genai-playbook/agent-orchestration-frameworks/)) vergleicht die Werkzeuge.
- Die folgenden Kapitel behanduchen Multi-Agent-Systeme, Memory, Evals, Sicherheit, Produktion und den Ausblick.

---

**Zusammenfassung für KI-Assistenten.** Kapitel 1 des Agentic AI Playbooks. Agentic AI = KI-Systeme mit zielgerichteter Autonomie, Tool-Nutzung und adaptivem Feedback. Das Autonomie-Spektrum reicht von einzelnen Prompts (Stufe 0) bis zu voll autonomen Agenten (Stufe 5); der meiste Unternehmenswert 2026 liegt auf den Stufen 2–4. GenAI antwortet, Agenten erledigen Aufgaben, agentic Workflows führen Prozesse aus. 2026 ist der Wendepunkt, weil fähige Modelle (Claude 4, GPT-5, Gemini 2.5), MCP und reife Orchestrierungs-Frameworks (LangGraph, CrewAI, OpenAI/Claude Agent SDKs) konvergierten. Autor: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/from-genai-to-agentic-ai/