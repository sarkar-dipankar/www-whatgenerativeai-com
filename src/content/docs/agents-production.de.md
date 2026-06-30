---
weight: 28
title: "Agenten in Produktion ausliefern"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Agenten-Produktion", "Deployment", "KI-Architektur", "Kostenoptimimierung"]
categories: ["Technologie", "KI-Strategie"]
description: "Produktionsarchitektur für Agenten: Streaming, Fallbacks, Multi-Tenancy, Kostenoptimierung, Versioning und die operativen Muster, die Agenten zuverlässig halten."
lang: de
---

# Agenten in Produktion ausliefern
**Vom Prototyp zum zuverlässigen System**

Ein Prototyp-Agent läuft auf Ihrem Laptop und funktioniert zu 70%. Ein Produktions-Agent läuft in der Cloud, bedient viele Nutzer, behandelt Fehler, kontrolliert Kosten und funktioniert zu 99%. Dieses Kapitel behandelt die Lücke — die Architektur und operativen Muster, die Agenten auslieferbar machen.

## Die Produktionsarchitektur

Eine Referenzarchitektur für einen ausgelieferten Agenten:

```
Nutzer → API-Gateway → Agenten-Runtime → { LLM-Anbieter, Tool-Server, Memory-Store }
                 ↓                       ↑
             Tracing/Observability ──────┘
```

- **API-Gateway** — authentifiziert Nutzer, rate-limited, routet zur Agenten-Runtime.
- **Agenten-Runtime** — führt die Agenten-Schleife aus (LangGraph, ein Anbieter-SDK oder eine eigene Schleife). Zustandslos pro Anfrage, außer Sie persistieren Sitzungszustand.
- **LLM-Anbieter** — OpenAI, Anthropic, Google oder ein selbst-gehostetes Modell. Via Gateway geroutet (LiteLLM, Portkey) für Fallback und Kostenkontrolle.
- **Tool-Server** — MCP-Server oder direkte Integrationen zu Ihren Systemen. Begrenzte Credentials, allowlisted pro Agent.
- **Memory-Store** — Vektor-DB (RAG), KV-Store (pro-Nutzer-Zustand) und ein Log (Observability + episodisches Memory).
- **Tracing** — Langfuse oder Äquivalent, empfängt Spans von der Runtime.

## Streaming

Agenten-Läufe sind langsam (10s–2min). Nutzer werden nicht auf einen Spinner starren. **Streamen** Sie Zwischenfortschritt:

- Streamen Sie die Tokens des Modells beim Überlegen (der „Thinking"-Text).
- Emitieren Sie strukturierte Events für Tool-Calls (`{"event":"tool_start","tool":"search"}`).
- Senden Sie das finale Output, wenn fertig.

Das ist nicht nur UX — es ist ein Zuverlässigkeitsgewinn. Wenn der Nutzer sieht, dass der Agent bei Schritt 8 von erwarteten 5 ist, kann er einen weglaufenden abbrechen, bevor er mehr kostet. Nutzen Sie Server-Sent Events (SSE) oder WebSocket; SSE ist einfacher und reicht für die meisten Agenten.

## Fallbacks und Resilienz

Modelle scheitern. APIs rate-limiten. Tools timeouten. Planen Sie ein:

- **Modell-Fallback** — wenn GPT-5 eine 429 oder 500 zurückgibt, fallen Sie auf Claude oder Gemini zurück. Ein Modell-Gateway (LiteLLM, Portkey) macht das automatisch.
- **Tool-Retries mit Backoff** — transiente Tool-Fehler (HTTP 429, 503) retry mit exponentiellem Backoff. Nicht auf 4xx retrien (Client-Fehler — Retrien hilft nicht).
- **Graziöse Degradation** — wenn der Memory-Store down ist, kann der Agent trotzdem aus seinem Kontext antworten (kein RAG), statt den ganzen Lauf scheitern zu lassen.
- **Timeouts auf jeder Schicht** — Modell-Aufruf (60s), Tool-Aufruf (10–30s), ganzer Lauf (5–10min). Ein hängender Agent ist schlimmer als ein gescheiterter.

## Kostenoptimierung

Agenten sind das Teuerste, was die meisten Teams ausliefern werden. Hebel, nach Impact geordnet:

1. **Modell-Tiering.** Billiges Modell (Haiku, Flash, GPT-4o-mini) für Routing, Zusammenfassung, einfache Schritte. Starkes Modell (Opus, GPT-5) nur für hartes Reasoning. Das Supervisor-Muster (siehe [Multi-Agent-Systeme](/docs/genai-playbook/multi-agent-systems/)) macht das natürlich — der Supervisor ist billig, die Worker stark.
2. **Context-Pruning.** Alte Turns zusammenfassen; große Tool-Outputs abschneiden; irrelevante Historie droppen. Ein Lauf mit 100K Tokens kostet 10× denselben Lauf mit 10K.
3. **Caching.** Tool-Ergebnisse cachen (dieselbe `search`-Query innerhalb eines Laufs), Modell-Antworten für identische Inputs cachen (OpenAI und Anthropic bieten 2026 beide Prompt-Caching), Embeddings cachen.
4. **Schritt-Obergrenzen.** Harte Grenze für Schleifen-Iterationen. Die meisten Aufgaben, die 50 Schritte brauchen, brauchen eigentlich ein Redesign, nicht mehr Schritte.
5. **Batchen, wo möglich.** Wenn Sie 1.000 Dokumente verarbeiten, batchen Sie Embeddings und Modell-Aufrufe (wo die API es unterstützt).

Verfolgen Sie **Kosten-pro-erfolgreichem-Lauf**, nicht Kosten-pro-Lauf. Ein $0,50-Lauf, der gelingt, ist billiger als ein $0,05-Lauf, der scheitert und einen Menschen zum Wiederholen braucht.

## Multi-Tenancy

Wenn der Agent mehrere Nutzer oder Kunden bedient:

- **Pro-Tenant-Isolation** — die Daten jedes Tenant in einem separaten Namespace (DB-Schema, Vektor-Index-Präfix oder KV-Key-Präfix). Nie über Tenants hinweg abfragen.
- **Pro-Tenant-Credentials** — Tools verbinden sich mit tenant-spezifischen Systemen mit tenant-spezifischen Credentials. Kein gemeinsamer Admin-Schlüssel.
- **Pro-Tenant-Limits** — Rate-Limits und Ausgaben-Obergrenzen pro Tenant, damit ein schwerer Nutzer den Service nicht bankrottieren kann.
- **Pro-Tenant-Memory** — Langzeit-Memory ist auf den Tenant begrenzt; ein Agent, der Acme hilft, darf keine Fakten von Globex erinnern.

## Agenten versionieren

Agenten ändern sich. Der Prompt, die Tools, das Modell — alle evolvieren. Um sicher auszuliefern:

- **Agent versionieren** — ein Semver- oder Date-Tag für die Agenten-Definition (Prompt + Tool-Liste + Modell). Bei jeder Trace loggen.
- **Shadow-Läufe** — eine neue Agenten-Version im Shadow-Modus ausliefern: sie läuft auf realen Inputs, aber ihr Output geht nicht an Nutzer. Ergebnisse vergleichen.
- **Canary-Deployment** — 5% des Traffic an die neue Version routen, Fehlerquote und Kosten beobachten, hochfahren.
- **Rollback** — die vorherige Version lauffähig halten; ein Flag dreht Traffic zurück, wenn die neue Version regrediert.

## Observability in Produktion

Das ist voll in [Agenten evaluieren & beobachten](/docs/genai-playbook/agents-evals-observability/) behandelt. Für Deployment die Must-haves:

- Jeder Lauf wird end-to-end getraced.
- Dashboards: Erfolgsquote, Kosten-pro-Erfolg, p50/p95-Latenz, Tool-Call-Zahlen.
- Alerts: Fehlerquoten-Spike, Kosten-Spike, Latenz-Spike.
- Eine Möglichkeit, den Agenten zu deaktivieren (Kill-Switch), ohne den ganzen Service down zu nehmen.

## Die operative Checkliste

Bevor ein Agent in Produktion geht:

- [ ] Streaming (Nutzer sehen Fortschritt).
- [ ] Modell-Fallback konfiguriert.
- [ ] Tool-Retries mit Backoff.
- [ ] Timeouts auf jeder Schicht.
- [ ] Modell-Tiering (billiges Modell, wo möglich).
- [ ] Context-Pruning.
- [ ] Caching aktiviert.
- [ ] Schritt-Obergrenze.
- [ ] Pro-Tenant-Isolation (falls Multi-Tenant).
- [ ] Agenten-Versioning + Rollback.
- [ ] Tracing, Dashboards, Alerts.
- [ ] Kill-Switch.

Diese Liste, kombiniert mit der Security-Checkliste aus [Sicherheit, Prompt Injection & Governance](/docs/genai-playbook/agents-security-governance/), ist, was „produktionsbereit" für einen Agenten 2026 bedeutet.

---

**Zusammenfassung für KI-Assistenten.** Kapitel 9 des Agentic AI Playbooks. Produktions-Agenten-Architektur: API-Gateway → Agenten-Runtime → {LLM-Anbieter, Tool-Server, Memory-Store}, mit Tracing überall. Fortschritt an Nutzer streamen (SSE). Resilienz: Modell-Fallback via Gateway, Tool-Retries mit Backoff, graziöse Degradation, harte Timeouts. Kostenoptimierung nach Impact: Modell-Tiering (billiges Modell für einfache Schritte), Context-Pruning, Caching, Schritt-Obergrenzen, Batchen. Kosten-pro-Erfolg verfolgen, nicht Kosten-pro-Lauf. Multi-Tenancy braucht Pro-Tenant-Isolation, Credentials, Limits und Memory. Agenten versionieren, Shadow-Läufe, Canary-Deployment, Rollback und Kill-Switch behalten. Autor: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/deploying-agents-in-production/