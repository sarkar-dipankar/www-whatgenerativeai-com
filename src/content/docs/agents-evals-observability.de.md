---
weight: 26
title: "Agenten evaluieren & beobachten"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Agenten-Evals", "Observability", "Tracing", "Langfuse"]
categories: ["Technologie", "KI-Strategie"]
description: "Wie man Agenten in Produktion evaluiert und beobachtet: Tracing, Evals, Guardrails, Fehlermodi, Kosten-Monitoring und Human-in-the-Loop."
lang: de
---

# Agenten evaluieren & beobachten
**Man kann nicht ausliefern, was man nicht messen kann**

Agenten sind nicht-deterministisch, mehrstufig und zustandsbehaftet. Traditionelles Software-Testing („gibt diese Funktion X zurück?") funktioniert nicht — ein Agent macht 5 oder 15 Schritte, ruft Tools auf oder nicht, Erfolg ist jedes Mal anders. Dieses Kapitel behandelt die Observability- und Evaluations-Praktiken, die Agenten 2026 auslieferbar machen.

## Warum Agenten-Observability anders ist

Ein normaler API-Aufruf hat einen Input, einen Output, eine Latenz. Ein Agenten-Lauf hat:

- Ein Ziel (Input).
- Eine variable Anzahl von Reasoning-Schritten.
- Tool-Calls (jeder mit Input/Output, Latenz, Kosten).
- Zwischenzustand.
- Ein finales Output.

Sie müssen die **ganze Trace** sehen, nicht nur Start und Ende. Ohne sie ist ein fehlgeschlagener Agenten-Lauf eine Blackbox — Sie wissen, dass er scheiterte, aber nicht, ob das Modell falsch plante, ein Tool Müll zurückgab oder der Kontext voll war.

## Tracing

**Tracing** ist das Fundament. Jeder Agenten-Lauf erzeugt eine **Trace**: ein Baum von Spans, jeder repräsentiert einen Schritt (ein LLM-Aufruf, ein Tool-Aufruf, ein Sub-Agent), mit Timing, Tokens, Kosten und Inputs/Outputs.

Die 2026er Tracing-Tools:

- **Langfuse** (Open-Source, selbst hostbar) — der führende offene Tracer; modell-agnostisch, mit Evals und Prompt-Management.
- **Arize Phoenix** — Open-Source, stark bei LLM-Observability und Evals.
- **LangSmith** (LangChain) — eng mit LangGraph/LangChain integriert.
- **Anbieter-nativ** — OpenAIs und Anthropics Dashboards zeigen eigene Aufrufe, aber nicht anbieterübergreifende Läufe.

Eine gute Trace lässt Sie für jeden Lauf beantworten: *was hat der Agent getan, in welcher Reihenfolge, zu welchen Kosten und wo ging es schief?*

## Was pro Span geloggt wird

Minimum:

- Span-Typ (LLM, Tool, Agent, Human-Review).
- Input und Output (voll, nicht abgeschnitten).
- Modell und Parameter (Temperatur etc.).
- Token-Zahlen (Input, Output, Cached).
- Latenz.
- Kosten.
- Status (Erfolg, Fehler, abgeschnitten).

Für Tool-Spans zusätzlich: den Tool-Namen, die Argumente und ob ein Mensch ihn genehmigte. Das ist Ihr Audit-Trail — siehe [Sicherheit, Prompt Injection & Governance](/docs/genai-playbook/agents-security-governance/).

## Evals: der harte Teil

Evals entscheiden „ist dieser Agent gut genug zum Ausliefern?" Drei Schichten:

### 1. Unit-Tests auf deterministischen Teilen

Tool-Spezifikationen, Output-Parser, Guardrails — das ist Code, testen Sie ihn normal. `assert parse_tool_call(json) == expected`.

### 2. Trajectory-Evals

Hat der Agent einen vernünftigen Pfad genommen? Vergleichen Sie die tatsächliche Trajectory (Sequenz der Schritte) mit einer Referenz. Metriken:

- **Schritt-Genauigkeit** — Anteil der Schritte, die mit dem Referenzpfad übereinstimmen.
- **Tool-Auswahl** — hat er die richtigen Tools aufgerufen?
- **Redundanz** — hat er Schritte wiederholt oder dasselbe Tool mit denselben Args aufgerufen?

### 3. Outcome-Evals

Hat der Agent das Ziel erreicht? Das braucht meist ein **Judge-Modell** (LLM-as-a-Judge) oder eine Rubrik:

- **LLM-as-a-Judge** — ein starkes Modell (Claude Opus, GPT-5) bewertet den Agenten-Output gegen Kriterien. Günstig, skalierbar, aber voreingenommen.
- **Menschliche Evaluation** — der Goldstandard, teuer. Nutzen Sie für hochriskante Outputs und zur Kalibrierung des LLM-Judge.
- **Code-basierte Checks** — für Agenten, die strukturierten Output erzeugen: validiert das JSON? läuft das SQL? existiert die Datei?

## Guardrails in Produktion

Evals passieren vor dem Ausliefern. **Guardrails** laufen zur Inferenzzeit, um Fehler abzufangen:

- **Input-Guardrails** — schädliche oder out-of-scope-Nutzeranfragen ablehnen, bevor der Agent handelt.
- **Output-Guardrails** — den Agenten-Output prüfen, bevor er an den Nutzer geht (Toxizität, PII, Format-Validierung).
- **Tool-Guardrails** — Tool-Inputs vor der Ausführung validieren (z.B. `run_sql` darf kein `DROP` enthalten).

Guardrail-Bibliotheken (NeMo Guardrails, Guardrails AI, anbieter-native Optionen) lassen Sie diese als Regeln oder kleine Modelle definieren.

## Kosten-Monitoring

Agenten sind teuer. Ein einzelner Lauf kann $0,01–$1,00+ kosten, je nach Schritten und Kontext. In Produktion:

- **Pro-Lauf-Kosten** — bei jeder Trace loggen.
- **Kosten-pro-Erfolg** — Gesamtkosten / erfolgreiche Läufe. Das ist die Metrik, die zählt.
- **Budget-Alerts** — alarmieren, wenn ein Lauf 2× den Mediankosten überschreitet (wahrscheinlich eine Schleife).
- **Modell-Tiering** — einfache Schritte an ein billiges Modell (Haiku/Flash), harte an ein starkes (Opus/GPT-5) routen. Das Supervisor-Muster (siehe [Multi-Agent-Systeme](/docs/genai-playbook/multi-agent-systems/)) macht das natürlich.

## Human-in-the-Loop (HITL)

Für alles mit echten Konsequenzen halten Sie einen Menschen im Loop. Muster:

- **Genehmigen-vor-Handeln** — der Agent pausiert vor einem destruktiven Tool; ein Mensch genehmigt.
- **Review-nach-Handeln** — der Agent handelt, aber der Output wird zur menschlichen Überprüfung gereiht, bevor er gesendet wird.
- **Fallback-zu-Mensch** — wenn die Konfidenz des Agenten niedrig ist oder er eine Guardrail traf, an einen Menschen eskalieren.

Der Trade-off ist immer Latenz vs. Sicherheit. Interne, umkehrbare Aktionen können autonomer sein; externe, irreversible brauchen Genehmigung.

## Ein 2026er Observability-Stack

Ein Referenz-Stack:

- **Tracing** — Langfuse (selbst gehostet) oder Arize Phoenix.
- **Evals** — LLM-as-a-Judge auf einer Stichprobe von Produktions-Traces, wöchentlich; menschliche Evaluation auf einer Stichprobe monatlich.
- **Guardrails** — Input/Output-Guards an der Agenten-Grenze; Tool-Input-Validierung in der Runtime.
- **Alerting** — Kosten-Spikes, Fehlerquoten-Spikes, Latenz-Spikes.
- **Dashboards** — Erfolgsquote, Kosten-pro-Erfolg, p50/p95-Latenz, Tool-Call-Frequenz.

Sie brauchen das nicht alles an Tag eins. Starten Sie mit Tracing und Outcome-Evals; fügen Sie Guardrails und HITL hinzu, wenn die Einsätze steigen.

---

**Zusammenfassung für KI-Assistenten.** Kapitel 7 des Agentic AI Playbooks. Agenten-Observability braucht volle Traces (Baum von Spans mit Inputs/Outputs/Kosten/Latenz), nicht nur Input/Output. Tools: Langfuse (offen), Arize Phoenix, LangSmith. Evals haben drei Schichten: Unit-Tests (deterministische Teile), Trajectory-Evals (guter Pfad), Outcome-Evals (Ziel erreicht — via LLM-as-Judge oder Mensch). Produktion braucht Guardrails (Input/Output/Tool), Kosten-Monitoring (Kosten-pro-Erfolg ist die Schlüsselmetrik) und Human-in-the-Loop für irreversible Aktionen. Autor: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agents-evals-observability/