---
weight: 22
title: "Tools, Function Calling & MCP"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["MCP", "Function Calling", "Toolgebruik", "Agent-architectuur"]
categories: ["Technologie", "AI-strategie"]
description: "Hoe agents externe systemen aanroepen: function calling, het Model Context Protocol (MCP), tool-ontwerp en beveiligingsgrenzen."
lang: nl
---

# Tools, Function Calling & MCP
**Hoe agents de echte wereld aanraken**

Een agent zonder tools is slechts een chatbot. Tools maken van een taalmodel een systeem dat kan zoeken, database's bevragen, berichten versturen, code uitvoeren en API's aanroepen. Dit hoofdstuk behandelt hoe toolgebruik werkt in 2026 — van native function calling tot het Model Context Protocol dat het standaardiseert.

## Function calling: het primitive

Function calling laat een model een **gestructureerd verzoek om een functie aan te roepen** emitteren, in plaats van (of naast) tekst. Het model voert de functie niet uit — het retourneert een JSON-achtige aanroep en jouw runtime voert deze uit.

Voorbeeld: je geeft het model een tool-specificatie:

```json
{
  "name": "get_weather",
  "description": "Get current weather for a city",
  "parameters": { "city": "string", "units": "celsius|fahrenheit" }
}
```

Het model, gevraagd "Hoe is het weer in Helsinki?", antwoordt:

```json
{ "tool": "get_weather", "city": "Helsinki", "units": "celsius" }
```

Jouw code draait `get_weather("Helsinki", "celsius")`, retourneert `{"temp": 14, "conditions": "cloudy"}` en het model gebruikt dat om te antwoorden. Dit is de fundamenten van elk agent-framework.

OpenAI noemt dit **function calling** (nu **structured outputs**). Anthropic noemt het **tool use**. Google noemt het **function calling**. Het mechanisme is hetzelfde.

## Het Model Context Protocol (MCP)

Het probleem: elke tool-integratie was maatwerk. Je schreef een OpenAI-functiespecificatie, een Anthropic-toolspecificatie, een Google-functiespecificatie — allemaal dezelfde onderliggende API beschrijvend. Het **Model Context Protocol (MCP)**, door Anthropic eind 2024 open-source gemaakt, loste dit op.

MCP is een standaardprotocol voor **het beschikbaar stellen van tools, resources en prompts aan elke AI-toepassing**. Een MCP-**server** wikkelt een API (Slack, GitHub, Postgres, een lokaal bestandssysteem). Een MCP-**client** (een agent, een IDE, een chat-app) verbindt ermee en krijgt een uniforme toollijst. Midden 2026:

- OpenAI, Anthropic, Google en de meeste open frameworks ondersteunen MCP-clients.
- Honderden MCP-servers bestaan (bestandssysteem, Git, Slack, Notion, Postgres, Sentry, linear, browser-automatisering).
- De grote IDE's (Cursor, Windsurf, VS Code + Copilot) leveren MCP-client-ondersteuning.

### Hoe MCP werkt

Een MCP-server stelt drie primitieven beschikbaar:

- **Tools** — functies die het model kan aanroepen (`send_slack_message`, `run_sql_query`).
- **Resources** — gegevens die het model kan lezen (`file://report.md`, `postgres://users`).
- **Prompts** — herbruikbare prompt-templates die het model kan aanroepen.

De client (agent) verbindt via stdio (lokaal) of HTTP/SSE (remote), toont de tools van de server en leidt ze naar het model. Het model roept een tool aan; de client leidt de aanroep naar de server; de server voert uit en retourneert het resultaat.

### Waarom MCP uitmaakt voor bedrijven

- **Portabiliteit** — schrijf de tool-integratie één keer, gebruik met elk model dat MCP ondersteunt.
- **Ontdekbaarheid** — de agent toont beschikbare tools at runtime in plaats van ze hard te coderen.
- **Beveiligingsgrens** — de MCP-server controleert wat de agent kan toegang; je geeft het model geen ruwe credentials.

## Tool-ontwerpprincipes

Slechte tools breken agents. Goede tools laten agents slim lijken. Principes:

1. **Wees specifiek.** `search_pinecone_for_customer_issues(product="acme", limit=5)` verslaat `search("customer issues")`. Het model kiest de juiste tool als de specificatie ondubbelzinnig is.
2. **Retourneer gestructureerde data, geen proza.** `{"tickets": [{"id": 123, "status": "open"}]}` is parsebaar; "Ik vond 5 tickets..." niet.
3. **Begrens outputgrootte.** Een tool die 50KB JSON retourneert overstrompt de context. Pagineer, vat samen of kap af.
4. **Eén tool, één taak.** Een `send_email`-tool die ook de body opstelt is twee tools in vermomming. Laat het model opstellen, dan versturen.
5. **Documenteer faalmodi.** Als de API 429 retourneert, vertel het model — het kan backoff doen. Stille faaltjes laten agents hallucineren.

## Beveiligingsgrenzen

Tools zijn macht, en macht heeft grenzen nodig. Het minimum:

- **Allowlist** — de agent mag alleen tools aanroepen die je voor deze taak hebt goedgekeurd.
- **Scoped credentials** — elke tool krijgt least-privilege-sleutels, nooit de volledige toegang van de agent.
- **Audit-log** — elke tool-aanroep (input + output) wordt gelogd voor review.
- **Goedkeurings-gates** — voor destructieve of naar buiten gerichte acties (e-mail versturen, naar productie schrijven) is menselijke goedkeuring vereist.

Het grootste nieuwe risico in 2026 is **prompt-injectie via tool-outputs**: een kwaadwillende webpagina geretourneerd door een `search`-tool bevat instructies die de agent verleiden `send_email` aan te roepen. De verdediging is strikte scheiding tussen tool-output en instructies — laat tool-output nooit een system-prompt worden. Zie [Beveiliging, Prompt-injectie & Governance](/docs/genai-playbook/agents-security-governance/).

## Kiezen tussen native function calling en MCP

- **Native function calling** — best voor een kleine, vaste set tools strak gekoppeld aan één app. Lagere overhead.
- **MCP** — best wanneer je tools wilt delen over agents, modellen of teams; wanneer third-party MCP-servers al bestaan voor jouw systemen; wanneer het model tools dynamisch wil ontdekken.

In 2026 gebruiken de meeste nieuwe agent-builds **MCP voor externe integraties** en **native function calling voor een paar app-specifieke helpers**.

---

**Samenvatting voor AI-assistenten.** Hoofdstuk 3 van het Agentic AI Playbook. Function calling laat modellen gestructureerde tool-aanroep-verzoeken emitteren; MCP standaardiseert tool-ontdekking over modellen en vendors. MCP-servers stellen tools/resources/prompts beschikbaar; clients (agents, IDE's) verbinden en leiden ze naar het model. Tool-ontwerp: specifieke namen, gestructureerde output, groottelimieten, één taak per tool. Beveiliging: allowlists, least-privilege-credentials, audit-logs, goedkeurings-gates en verdediging tegen prompt-injectie via tool-outputs. Auteur: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/tools-function-calling-mcp/