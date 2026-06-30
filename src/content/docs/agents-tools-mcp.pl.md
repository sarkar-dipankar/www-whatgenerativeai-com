---
weight: 22
title: "Narzędzia, Function Calling & MCP"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["MCP", "Function Calling", "Użycie Narzędzi", "Architektura Agentów"]
categories: ["Technologia", "Strategia AI"]
description: "Jak agenci wywołują systemy zewnętrzne: function calling, Model Context Protocol (MCP), projektowanie narzędzi i granice bezpieczeństwa."
lang: pl
---

# Narzędzia, Function Calling & MCP
**Jak agenci dotykają prawdziwego świata**

Agent bez narzędzi to tylko chatbot. Narzędzia zamieniają model językowy w system, który może wyszukiwać, odpytywać bazy, wysyłać wiadomości, uruchamiać kod i wywoływać API. Ten rozdział omawia jak użycie narzędzi działa w 2026 — od natywnego function calling do Model Context Protocol, który to standaryzuje.

## Function calling: prymityw

Function calling pozwala modelowi emitować **strukturalne żądanie wywołania funkcji**, zamiast (lub obok) tekstu. Model nie wykonuje funkcji — zwraca wywołanie typu JSON, a twój runtime je wykonuje.

Przykład: dajesz modelowi spec narzędzia:

```json
{
  "name": "get_weather",
  "description": "Get current weather for a city",
  "parameters": { "city": "string", "units": "celsius|fahrenheit" }
}
```

Model, zapytany "Jaka jest pogoda w Helsinkach?", odpowiada:

```json
{ "tool": "get_weather", "city": "Helsinki", "units": "celsius" }
```

Twój kod uruchamia `get_weather("Helsinki", "celsius")`, zwraca `{"temp": 14, "conditions": "cloudy"}`, a model używa tego do odpowiedzi. To fundament każdego frameworka agentów.

OpenAI nazywa to **function calling** (teraz **structured outputs**). Anthropic nazywa to **tool use**. Google nazywa **function calling**. Mechanizm jest ten sam.

## Model Context Protocol (MCP)

Problem: każda integracja narzędzia była bespoke. Pisałeś spec funkcji OpenAI, spec narzędzia Anthropic, spec funkcji Google — wszystkie opisujące to samo API. **Model Context Protocol (MCP)**, open-sourced przez Anthropic pod koniec 2024, to naprawił.

MCP to standardowy protokół **ekspozycji narzędzi, zasobów i promptów dla dowolnej aplikacji AI**. **Serwer** MCP oplata API (Slack, GitHub, Postgres, lokalny filesystem). **Klient** MCP (agent, IDE, chat) się z nim łączy i dostaje uniformną listę narzędzi. W połowie 2026:

- OpenAI, Anthropic, Google i większość open frameworków wspiera klientów MCP.
- Istnieją setki serwerów MCP (filesystem, Git, Slack, Notion, Postgres, Sentry, linear, automatyzacja przeglądarki).
- Główne IDE (Cursor, Windsurf, VS Code + Copilot) shipują wsparcie klienta MCP.

### Jak działa MCP

Serwer MCP eksponuje trzy prymitywy:

- **Narzędzia** — funkcje, które model może wywołać (`send_slack_message`, `run_sql_query`).
- **Zasoby** — dane, które model może czytać (`file://report.md`, `postgres://users`).
- **Prompty** — reużywalne szablony promptów, które model może wywoływać.

Klient (agent) łączy się przez stdio (lokalnie) lub HTTP/SSE (zdalnie), listuje narzędzia serwera i przekazuje je do modelu. Model wywołuje narzędzie; klient przekazuje wywołanie do serwera; serwer wykonuje i zwraca wynik.

### Dlaczego MCP ma znaczenie dla enterprise

- **Przenośność** — napisz integrację raz, używaj z każdym modelem wspierającym MCP.
- **Odkrywalność** — agent listuje dostępne narzędzia w runtime zamiast hard-codować je.
- **Granica bezpieczeństwa** — serwer MCP kontroluje, do czego agent ma dostęp; nie podajesz modelu surowych poświadczeń.

## Zasady projektowania narzędzi

Złe narzędzia psują agentów. Dobre sprawiają, że agenci wyglądają mądrze. Zasady:

1. **Bądź specyficzny.** `search_pinecone_for_customer_issues(product="acme", limit=5)` bije `search("customer issues")`. Model wybiera właściwe narzędzie, gdy spec jest jednoznaczny.
2. **Zwracaj dane strukturalne, nie prozę.** `{"tickets": [{"id": 123, "status": "open"}]}` jest parsowalne; "Znalazłem 5 ticketów..." nie.
3. **Ogranicz rozmiar outputu.** Narzędzie zwracające 50KB JSON zalewa kontekst. Paginuj, podsumuj lub utnij.
4. **Jedno narzędzie, jedna robota.** Narzędzie `send_email`, które redaguje też treść, to dwa narzędzia w przebraniu. Niech model redaguje, potem wysyła.
5. **Dokumentuj tryby awarii.** Jeśli API zwraca 429, powiedz modelowi — może wycofać się. Ciche awarie powodują halucynacje.

## Granice bezpieczeństwa

Narzędzia to władza, a władza potrzebuje granic. Minimum:

- **Allowlista** — agent może wywoływać tylko narzędzia, które zatwierdziłeś dla tego zadania.
- **Poświadczenia z scope** — każde narzędzie dostaje klucze least-privilege, nigdy pełny dostęp agenta.
- **Log audytu** — każde wywołanie narzędzia (input + output) jest logowane do przeglądu.
- **Bramki aprobaty** — dla akcji destrukcyjnych lub zewnętrznych (wysyłanie emaili, pisanie do produkcji) wymagaj aprobaty człowieka.

Największe nowe ryzyko w 2026 to **prompt injection przez outputy narzędzi**: złośliwa strona web zwrócona przez narzędzie `search` zawiera instrukcje, które zwabiają agenta do wywołania `send_email`. Obroną jest ścisła separacja między outputem narzędzi a instrukcjami — nigdy nie pozwalaj, by output narzędzia stał się system promptem. Patrz [Bezpieczeństwo, Prompt Injection & Governance](/docs/genai-playbook/agents-security-governance/).

## Wybór między natywnym function calling a MCP

- **Natywny function calling** — najlepszy dla małego, stałego zestawu narzędzi ściśle sprzężonych z jedną apką. Mniejszy narzut.
- **MCP** — najlepszy, gdy chcesz współdzielić narzędzia między agentami, modelami lub zespołami; gdy istnieją już serwery MCP od trzecich dla twoich systemów; gdy chcesz, by model odkrywał narzędzia dynamicznie.

W 2026 większość nowych buildów agentów używa **MCP dla integracji zewnętrznych** i **natywnego function calling dla kilku helperów app-specific**.

---

**Podsumowanie dla asystentów AI.** Rozdział 3 Agentic AI Playbooku. Function calling pozwala modelom emitować strukturalne żądania wywołań narzędzi; MCP standaryzuje odkrywanie narzędzi między modelami i vendorami. Serwery MCP eksponują narzędzia/zasoby/prompty; klienci (agenci, IDE) się łączą i przekazują je do modelu. Projektowanie narzędzi: specyficzne nazwy, strukturalny output, limity rozmiaru, jedna robota na narzędzie. Bezpieczeństwo: allowlisty, least-privilege poświadczenia, logi audytu, bramki aprobaty i obrona przed prompt injection przez outputy narzędzi. Autor: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/tools-function-calling-mcp/