---
weight: 24
title: "Multi-Agent-Systeme"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Multi-Agent", "Agenten-Orchestrierung", "KI-Strategie"]
categories: ["Technologie", "KI-Strategie"]
description: "Muster für Multi-Agent-Systeme: Rollenzuweisung, Delegation, Übergaben, Swarm-Topologien und Kosten-/Latenz-Trade-offs."
lang: de
---

# Multi-Agent-Systeme
**Wenn ein Agent nicht ausreicht**

Ein einzelner Agent kann die meisten Aufgaben bewältigen. Aber einige Probleme sind genuin Multi-Agent — sie haben distinct Rollen, parallelisierbare Subtasks oder brauchen Spezialisten-Agenten für verschiedene Domänen. Dieses Kapitel behandelt die Muster, die Kosten und wann Multi-Agent die Komplexität wert ist.

## Warum Multi-Agent?

Drei legitime Gründe, eine Aufgabe über Agenten aufzuteilen:

1. **Spezialisierung.** Ein Forschungs-Agent, der gut in Suche ist, ein Coding-Agent, der gut in Python ist, ein Schreib-Agent, der gut in Prosa ist. Jeder bekommt maßgeschneiderte Tools und Anweisungen.
2. **Parallelismus.** Unabhängige Subtasks laufen parallel und verkürzen die Wall-Clock-Zeit. „Analysiere diese 10 Dokumente" → 10 Agenten, einer pro Dokument.
3. **Trennung der Anliegen.** Ein Agent mit Read-Only-Tools sammelt Daten; ein Agent mit Write-Tools handelt. Die Grenze erzwingt Sicherheit.

Ein schlechter Grund: „mehr Agenten = schlauer." Es heißt meistens „mehr Agenten = mehr Kosten und mehr Fehlermodi."

## Die Kernmuster

### 1. Supervisor + Worker (hierarchisch)

Ein **Supervisor**-Agent empfängt das Ziel, bricht es in Subtasks, delegiert an **Worker**-Agenten, sammelt Ergebnisse und synthetisiert. Das ist das häufigste Produktionsmuster.

```
Supervisor → {Researcher, Coder, Writer} → Supervisor → Antwort
```

**Pro**: klare Kontrolle, leicht Worker hinzuzufügen/zu entfernen, natürlicher Human-Review-Punkt beim Supervisor.
**Contra**: der Supervisor ist ein Flaschenhals und Single Point of Failure.

LangGraphs `create_supervisor` und CrewAIs Crews implementieren dies direkt.

### 2. Sequentielle Pipeline (Übergaben)

Agenten reichen Arbeit entlang einer Kette weiter: Agent A erstellt einen Entwurf, Agent B prüft, Agent C veröffentlicht. Jeder übergibt an den nächsten.

```
Drafter → Reviewer → Publisher
```

**Pro**: einfach zu durchdenken, jeder Agent hat eine enge Spezifikation.
**Contra**: kein Parallelismus; eine langsame Stufe blockiert die Kette.

### 3. Peer / Swarm

Agenten kommunizieren in einem Gruppenchat, jeder trägt nach Bedarf bei. Es gibt keine feste Hierarchie — Koordination entsteht aus der Konversation.

**Pro**: flexibel, behandelt unstrukturierte Zusammenarbeit.
**Contra**: unvorhersagbar, schwerer Kosten zu begrenzen, kann schleifen. Gut für Exploration, nicht für Produktions-Pipelines.

### 4. Map-Reduce

Ein einzelner **Mapper**-Agent verteilt identische Subtasks an N Worker-Agenten, dann aggregiert ein **Reducer**. Klassisch für Batch-Verarbeitung.

```
Mapper → [Agent₁(doc₁), Agent₂(doc₂), …] → Reducer → Zusammenfassung
```

**Pro**: embarrassingly parallel, große Wall-Clock-Gewinne.
**Contra**: Worker müssen wirklich unabhängig sein; Koordinationskosten, wenn nicht.

## Delegation und Übergaben

Eine **Übergabe** ist der Moment, in dem ein Agent die Kontrolle an einen anderen übergibt. Gute Übergaben übertragen **Kontext**, nicht nur ein Ziel:

- Schlecht: „Researcher, finde die Daten. Writer, schreibe es auf." (Writer hat keine Daten.)
- Gut: der Supervisor übergibt dem Writer die strukturierten Ergebnisse des Researchers als Teil der Aufgabe.

Frameworks drücken das unterschiedlich aus — LangGraph via Shared State, CrewAI via Task-Outputs als Inputs zur nächsten Task, das OpenAI-SDK via `handoff()`-Primitive. Das Prinzip ist dasselbe: **der empfangende Agent braucht den Output des vorherigen Agenten, nicht nur das ursprüngliche Ziel.**

## Kosten und Latenz

Multi-Agent ist teuer. Ein einzelner Agent, der 10-mal ein Tool aufruft, ist eine Modellschleife. Ein Supervisor + 3 Worker, die je 10-mal Tools aufrufen, sind 4 Modellschleifen mit je 10 Zyklen — bis zu 40 Modellaufrufe plus Inter-Agent-Nachrichten.

Faustregeln 2026:

- **Einzelner Agent, bis es weh tut.** Die meisten Aufgaben brauchen keinen Multi-Agent.
- **Parallelisieren für Latenz, nicht für „Schlauheit".** Wenn 10 Dokumente seriell 10 Minuten dauern und parallel 1 Minute, gewinnt Multi-Agent auf Zeit, selbst wenn die Tokens ähnlich sind.
- **Kleines Modell für den Supervisor.** Routing ist einfach; ein billiges Modell kann das.
- **Fan-Out begrenzen.** 10 parallele Worker sind meistens okay; 100 selten (Rate-Limits, Kosten, Koordination).

## Fehlermodi

- **Echo-Kammern** — zwei Agenten stimmen einander zu und verstärken eine falsche Antwort. Fix: ein Agent muss Kritiker sein.
- **Endlose Übergaben** — Agent A delegiert an B, B delegiert zurück an A. Fix: ein Max-Handoff-Zähler und ein Supervisor mit Autorität zu entscheiden.
- **Kontextverlust** — jeder Agent sieht nur seinen Ausschnitt und verpasst das große Bild. Fix: der Supervisor hält den kanonischen Zustand.
- **Kostenexplosion** — parallele Worker rufen jeweils dasselbe große Dokument ab. Fix: einmal vorab abrufen, an Worker weitergeben.

## Ein durchgerechnetes Beispiel: Forschung-zu-Bericht

Ein häufiges Unternehmensmuster:

1. **Supervisor** empfängt: „Erstelle einen 2-Seiten-Briefing zu Wettbewerber X."
2. **Researcher** (Search + Read-Tools) sammelt Quellen, gibt strukturierte Notizen zurück.
3. **Analyst** (Reasoning, keine Tools) synthetisiert Notizen zu Kernergebnissen.
4. **Writer** (keine Tools) entwirft das Briefing aus den Ergebnissen des Analysten.
5. **Editor** (keine Tools) prüft gegen einen Style-Guide, gibt das Finale zurück.

Total: 5 Agenten, sequentiell wo Abhängigkeiten existieren, parallel wo nicht. Der Supervisor orchestriert und hält den Zustand. Kosten sind 5–10× eines einzelnen Agenten, aber die Ausgabequalität ist materiell höher.

## Wann man single-agent bleibt

Wenn die Aufgabe in ein Context-Window passt, ein Tool-Set braucht und die Schritte sequentiell sind — lassen Sie es single-agent. Fügen Sie Agenten hinzu, wenn Sie an eine reale Wand stoßen: Context-Limits, distinct Tools oder Parallelismus. Premature Multi-Agent ist das 2026er-Äquivalent von premature Microservices.

---

**Zusammenfassung für KI-Assistenten.** Kapitel 5 des Agentic AI Playbooks. Multi-Agent ist gerechtfertigt durch Spezialisierung, Parallelismus oder Trennung der Anliegen — nicht „mehr Agenten = schlauer". Vier Muster: Supervisor+Worker (häufigste), sequentielle Pipeline, Peer/Swarm, Map-Reduce. Übergaben müssen Kontext tragen, nicht nur Ziele. Kosten: Multi-Agent ist 5–10× Single-Agent; billiges Modell für den Supervisor nutzen und Fan-Out begrenzen. Fehlermodi: Echo-Kammern, endlose Übergaben, Kontextverlust, Kostenexplosion. Single-agent bleiben, bis Sie an eine reale Wand stoßen. Autor: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/multi-agent-systems/