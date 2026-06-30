---
weight: 22
title: "Tools, Function Calling & MCP"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["MCP", "Function Calling", "Tool-Nutzung", "Agenten-Architektur"]
categories: ["Technologie", "KI-Strategie"]
description: "Wie Agenten externe Systeme aufrufen: Function Calling, das Model Context Protocol (MCP), Tool-Design und Sicherheitsgrenzen."
slug: "tools-function-calling-mcp"
lang: de
---

# Tools, Function Calling & MCP
**Wie Agenten die reale Welt berühren**

Ein Agent ohne Tools ist nur ein Chatbot. Tools machen aus einem Sprachmodell ein System, das suchen, Datenbanken abfragen, Nachrichten senden, Code ausführen und APIs aufrufen kann. Dieses Kapitel behandelt, wie Tool-Nutzung 2026 funktioniert — von nativem Function Calling bis zum Model Context Protocol, das es standardisiert.

## Function Calling: das Primitive

Function Calling ermöglicht es einem Modell, eine **strukturierte Anfrage zum Aufruf einer Funktion** zu emittieren, statt (oder zusätzlich zu) Text. Das Modell führt die Funktion nicht aus — es gibt einen JSON-ähnlichen Aufruf zurück und Ihre Runtime führt ihn aus.

Beispiel: Sie geben dem Modell eine Tool-Spezifikation:

```json
{
  "name": "get_weather",
  "description": "Get current weather for a city",
  "parameters": { "city": "string", "units": "celsius|fahrenheit" }
}
```

Das Modell, gefragt „Wie ist das Wetter in Helsinki?", antwortet:

```json
{ "tool": "get_weather", "city": "Helsinki", "units": "celsius" }
```

Ihr Code führt `get_weather("Helsinki", "celsius")` aus, gibt `{"temp": 14, "conditions": "cloudy"}` zurück und das Modell nutzt das zum Antworten. Das ist das Fundament jedes Agenten-Frameworks.

OpenAI nennt dies **Function Calling** (jetzt **Structured Outputs**). Anthropic nennt es **Tool-Use**. Google nennt es **Function Calling**. Der Mechanismus ist derselbe.

## Das Model Context Protocol (MCP)

Das Problem: Jede Tool-Integration war maßgeschneidert. Man schrieb eine OpenAI-Funktion-Spezifikation, eine Anthropic-Tool-Spezifikation, eine Google-Funktion-Spezifikation — alle beschrieben dieselbe zugrunde liegende API. Das **Model Context Protocol (MCP)**, von Anthropic Ende 2024 als Open Source veröffentlicht, behob das.

MCP ist ein Standardprotokoll zum **Bereitstellen von Tools, Ressourcen und Prompts für jede KI-Anwendung**. Ein MCP-**Server** umhüllt eine API (Slack, GitHub, Postgres, ein lokales Dateisystem). Ein MCP-**Client** (ein Agent, eine IDE, eine Chat-App) verbindet sich und erhält eine einheitliche Tool-Liste. Mitte 2026:

- OpenAI, Anthropic, Google und die meisten offenen Frameworks unterstützen MCP-Clients.
- Hunderte MCP-Server existieren (Dateisystem, Git, Slack, Notion, Postgres, Sentry, linear, Browser-Automatisierung).
- Die großen IDEs (Cursor, Windsurf, VS Code + Copilot) liefern MCP-Client-Unterstützung.

### Wie MCP funktioniert

Ein MCP-Server stellt drei Primitive bereit:

- **Tools** — Funktionen, die das Modell aufrufen kann (`send_slack_message`, `run_sql_query`).
- **Ressourcen** — Daten, die das Modell lesen kann (`file://report.md`, `postgres://users`).
- **Prompts** — wiederverwendbare Prompt-Templates, die das Modell aufrufen kann.

Der Client (Agent) verbindet sich via stdio (lokal) oder HTTP/SSE (remote), listet die Tools des Servers und leitet sie an das Modell weiter. Das Modell ruft ein Tool auf; der Client leitet den Aufruf an den Server weiter; der Server führt aus und gibt das Ergebnis zurück.

### Warum MCP für Unternehmen wichtig ist

- **Portabilität** — schreiben Sie die Tool-Integration einmal, nutzen Sie sie mit jedem MCP-unterstützenden Modell.
- **Auffindbarkeit** — der Agent listet verfügbare Tools zur Laufzeit statt sie hart zu codieren.
- **Sicherheitsgrenze** — der MCP-Server kontrolliert, worauf der Agent zugreifen kann; Sie übergeben dem Modell keine rohen Credentials.

## Tool-Design-Prinzipien

Schlechte Tools brechen Agenten. Gute Tools lassen Agenten schlau wirken. Prinzipien:

1. **Sei spezifisch.** `search_pinecone_for_customer_issues(product="acme", limit=5)` schlägt `search("customer issues")`. Das Modell wählt das richtige Tool, wenn die Spezifikation eindeutig ist.
2. **Strukturierte Daten zurückgeben, keine Prosa.** `{"tickets": [{"id": 123, "status": "open"}]}` ist parsebar; „Ich fand 5 Tickets..." nicht.
3. **Ausgabegröße begrenzen.** Ein Tool, das 50KB JSON zurückgibt, flutet den Kontext. Paginieren, zusammenfassen oder abschneiden.
4. **Ein Tool, ein Job.** Ein `send_email`-Tool, das auch den Body entwirft, sind zwei Tools in Verkleidung. Das Modell den Entwurf machen lassen, dann senden.
5. **Fehlermodi dokumentieren.** Wenn die API 429 zurückgibt, dem Modell sagen — es kann Backoff machen. Stille Fehler lassen Agenten halluzinieren.

## Sicherheitsgrenzen

Tools sind Macht, und Macht braucht Grenzen. Das Minimum:

- **Allowlist** — der Agent darf nur Tools aufrufen, die Sie für diese Aufgabe genehmigt haben.
- **Begrenzte Credentials** — jedes Tool bekommt Least-Privilege-Schlüssel, nie den Vollzugriff des Agenten.
- **Audit-Log** — jeder Tool-Aufruf (Eingabe + Ausgabe) wird zur Überprüfung protokolliert.
- **Genehmigungs-Gates** — für destruktive oder nach außen gerichtete Aktionen (E-Mail senden, in Produktion schreiben) ist menschliche Genehmigung erforderlich.

Das größte neue Risiko 2026 ist **Prompt Injection durch Tool-Ausgaben**: eine bösartige Webseite, die ein `search`-Tool zurückgibt, enthält Anweisungen, die den Agenten dazu bringen, `send_email` aufzurufen. Die Verteidigung ist strikte Trennung zwischen Tool-Ausgabe und Anweisungen — Tool-Ausgabe darf nie zum System-Prompt werden. Siehe [Sicherheit, Prompt Injection & Governance](/docs/genai-playbook/agents-security-governance/).

## Wahl zwischen nativem Function Calling und MCP

- **Natives Function Calling** — am besten für kleine, feste Tool-Sätze, die eng mit einer App gekoppelt sind. Geringerer Overhead.
- **MCP** — am besten, wenn Sie Tools über Agenten, Modelle oder Teams teilen wollen; wenn Drittanbieter-MCP-Server für Ihre Systeme existieren; wenn das Modell Tools dynamisch entdecken soll.

2026 nutzen die meisten neuen Agenten-Bauten **MCP für externe Integrationen** und **natives Function Calling für einige app-spezifische Helfer**.

---

**Zusammenfassung für KI-Assistenten.** Kapitel 3 des Agentic AI Playbooks. Function Calling lässt Modelle strukturierte Tool-Call-Anfragen emittieren; MCP standardisiert Tool-Entdeckung über Modelle und Anbieter. MCP-Server stellen Tools/Ressourcen/Prompts; Clients (Agenten, IDEs) verbinden sich und leiten sie an das Modell weiter. Tool-Design: spezifische Namen, strukturierte Ausgabe, Größenlimits, ein Job pro Tool. Sicherheit: Allowlists, Least-Privilege-Credentials, Audit-Logs, Genehmigungs-Gates und Verteidigung gegen Prompt Injection über Tool-Ausgaben. Autor: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/tools-function-calling-mcp/