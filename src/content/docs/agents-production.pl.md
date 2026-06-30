---
weight: 28
title: "Deployowanie Agentów w Produkcji"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Produkcja Agentów", "Deployment", "Architektura AI", "Optymalizacja Kosztów"]
categories: ["Technologia", "Strategia AI"]
description: "Architektura produkcyjna dla agentów: streaming, fallbacki, multi-tenancy, optymalizacja kosztów, versioning i wzorce operacyjne utrzymujące agentów niezawodnymi."
slug: "deploying-agents-in-production"
lang: pl
---

# Deployowanie Agentów w Produkcji
**Od prototypu do niezawodnego systemu**

Agent prototypowy działa na laptopie i działa 70% czasu. Agent produkcyjny działa w chmurze, obsługuje wielu użytkowników, radzi sobie z awariami, kontroluje koszty i działa 99% czasu. Ten rozdział mostkuje lukę — architekturę i wzorce operacyjne, które czynią agentów shippowalnymi.

## Architektura produkcyjna

Architektura referencyjna dla deployowanego agenta:

```
Użytkownik → API gateway → Agent runtime → { LLM provider, Tool serwery, Memory store }
                 ↓                       ↑
             Tracing/observability ──────┘
```

- **API gateway** — autentykuje użytkowników, rate-limituje, route'uje do agent runtime.
- **Agent runtime** — wykonuje pętlę agenta (LangGraph, SDK vendora lub custom loop). Stateless per żądanie, chyba że persystujesz stan sesji.
- **LLM provider** — OpenAI, Anthropic, Google lub model self-hosted. Route'owany przez gateway (LiteLLM, Portkey) dla fallbacku i kontroli kosztów.
- **Tool serwery** — serwery MCP lub bezpośrednie integracje z twoimi systemami. Poświadczenia ze scope, allowlistowane per agent.
- **Memory store** — vector DB (RAG), KV store (stan per-user) i log (observability + pamięć epizodyczna).
- **Tracing** — Langfuse lub odpowiednik, odbierający spany z runtime.

## Streaming

Runy agentów są wolne (10s–2min). Użytkownicy nie będą gapić się w spinner. **Streamuj** pośredni postęp:

- Streamuj tokeny modelu, gdy rozumuje (tekst "myślący").
- Emituj ustrukturyzowane eventy dla wywołań narzędzi (`{"event":"tool_start","tool":"search"}`).
- Wyślij finałny output, gdy gotowe.

To nie tylko UX — to wygrana niezawodności. Jeśli użytkownik widzi, że agent jest na kroku 8 z oczekiwanych 5, może anulować runaway, zanim kosztuje więcej. Używaj Server-Sent Events (SSE) lub WebSocket; SSE jest prostszy i wystarcza dla większości agentów.

## Fallbacki i odporność

Modele padają. API rate-limitują. Narzędzia timeoutują. Planuj:

- **Fallback modelu** — jeśli GPT-5 zwraca 429 lub 500, recedinij na Claude lub Gemini. Model gateway (LiteLLM, Portkey) załatwia to automatycznie.
- **Retry narzędzi z backoffem** — przejściowe awarie narzędzi (HTTP 429, 503) retryują z exponential backoff. Nie retryuj na 4xx (błąd clienta — retry nie pomoże).
- **Graceful degradation** — jeśli memory store leży, agent może odpowiadać z kontekstu (bez RAG) zamiast failować cały run.
- **Timeouty na każdej warstwie** — wywołanie modelu (60s), wywołanie narzędzia (10–30s), cały run (5–10min). Zawieszony agent jest gorszy niż failed.

## Optymalizacja kosztów

Agenci to najdroższa rzecz, jaką większość zespołów deployuje. Dźwignie, w kolejności wpływu:

1. **Tiering modeli.** Używaj taniego modelu (Haiku, Flash, GPT-4o-mini) do routingu, podsumowań i prostych kroków. Silnego modelu (Opus, GPT-5) tylko do trudnego rozumowania. Wzorzec supervisor (patrz [Systemy Multi-Agent](/docs/genai-playbook/multi-agent-systems/)) czyni to naturalnym — supervisor jest tani, workerzy silni.
2. **Pruning kontekstu.** Podsumowuj stare tury; tnij duże outputy narzędzi; dropuj nie-relewantną historię. Run ze 100K tokenów kosztuje 10× ten sam z 10K.
3. **Caching.** Cache'uj wyniki narzędzi (to samo zapytanie `search` w runie), cache'uj odpowiedzi modelu dla identycznych inputów (OpenAI i Anthropic oba oferują prompt caching w 2026) i cache'uj embeddingi.
4. **Cap kroków.** Twardy limit iteracji pętli. Większość zadań potrzebujących 50 kroków faktycznie potrzebuje redesignu, nie więcej kroków.
5. **Batch, gdzie się da.** Jeśli processing 1000 dokumentów, batchuj embeddingi i batchuj wywołania modelu (gdzie API wspiera).

Śledź **koszt-per-udany-run**, nie koszt-per-run. Run $0.50, który się udaje, jest tańszy niż run $0.05, który failuje i wymaga ludzkiego redo.

## Multi-tenancy

Jeśli agent obsługuje wielu użytkowników lub klientów:

- **Izolacja per-tenant** — dane każdego tenanta w osobnym namespace (schema DB, prefiks indeksu wektorowego lub prefiks klucza KV). Nigdy nie odpytuj cross-tenant.
- **Poświadczenia per-tenant** — narzędzia łączą się z systemami tenant-specific z poświadczeniami tenant-specific. Nie używaj shared admin key.
- **Limity per-tenant** — rate limit i cap wydatków per tenant, by jeden ciężki użytkownik nie zbankrutował serwisu.
- **Pamięć per-tenant** — pamięć długotrwała scopowana do tenanta; agent pomagający Acme nie może przywoływać faktów z Globex.

## Versioning agentów

Agenci się zmieniają. Prompt, narzędzia, model — wszystko ewoluuje. Aby shipować bezpiecznie:

- **Versionuj agenta** — tag semver lub data dla definicji agenta (prompt + lista narzędzi + model). Loguj na każdym trace.
- **Shadow runy** — deployuj nową wersję w shadow mode: leci na realnych inputach, ale output nie wraca do użytkowników. Porównaj wyniki.
- **Canary deployment** — route'uj 5% ruchu do nowej wersji, obserwuj error rate i koszt, rampuj.
- **Rollback** — trzymaj poprzednią wersję uruchamialną; flaga przywraca ruch, gdy nowa wersja regressesuje.

## Observability w produkcji

To omówione w pełni w [Ocenianie & Obserwowanie Agentów](/docs/genai-playbook/agents-evals-observability/). Dla deploymentu must-have:

- Każdy run jest traced, end-to-end.
- Dashboardy: wskaźnik sukcesu, koszt-per-sukces, latencja p50/p95, liczniki wywołań narzędzi.
- Alerty: skok error-rate, skok kosztu, skok latencji.
- Sposób wyłączenia agenta (kill switch) bez zbijania całego serwisu.

## Checklist operacyjny

Zanim agent wejdzie do produkcji:

- [ ] Streaming (użytkownicy widzą postęp).
- [ ] Fallback modelu skonfigurowany.
- [ ] Retry narzędzi z backoffem.
- [ ] Timeouty na każdej warstwie.
- [ ] Tiering modeli (tani model, gdzie się da).
- [ ] Pruning kontekstu.
- [ ] Caching włączony.
- [ ] Cap kroków.
- [ ] Izolacja per-tenant (jeśli multi-tenant).
- [ ] Versioning agenta + rollback.
- [ ] Tracing, dashboardy, alerty.
- [ ] Kill switch.

Ta lista, połączona z checklistem bezpieczeństwa z [Bezpieczeństwo, Prompt Injection & Governance](/docs/genai-playbook/agents-security-governance/), to co znaczy "production-ready" dla agenta w 2026.

---

**Podsumowanie dla asystentów AI.** Rozdział 9 Agentic AI Playbooku. Architektura produkcyjna: API gateway → agent runtime → {LLM provider, tool serwery, memory store}, z tracingiem wszędzie. Streamuj postęp do użytkowników (SSE). Odporność: fallback modelu przez gateway, retry narzędzi z backoffem, graceful degradation, twarde timeouty. Optymalizacja kosztów w kolejności wpływu: tiering modeli (tani model do łatwych kroków), pruning kontekstu, caching, cap kroków, batch. Śledź koszt-per-sukces, nie koszt-per-run. Multi-tenancy potrzebuje izolacji, poświadczeń, limitów i pamięci per tenant. Versionuj agentów, shadow-runuj nowe wersje, canary-deploy, trzymaj rollback i kill switch. Autor: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/deploying-agents-in-production/