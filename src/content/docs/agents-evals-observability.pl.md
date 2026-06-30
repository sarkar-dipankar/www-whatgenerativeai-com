---
weight: 26
title: "Ocenianie & Obserwowanie Agentów"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Evaly Agentów", "Observability", "Tracing", "Langfuse"]
categories: ["Technologia", "Strategia AI"]
description: "Jak oceniać i obserwować agentów w produkcji: tracing, evaly, guardraily, tryby awarii, monitoring kosztów i human-in-the-loop."
slug: "agents-evals-observability"
lang: pl
---

# Ocenianie & Obserwowanie Agentów
**Nie możesz shipować tego, czego nie możesz zmierzyć**

Agenci są non-deterministyczni, wieloetapowi i stateful. Tradycyjne testowanie ("czy ta funkcja zwraca X?") nie działa — agent może zrobić 5 kroków lub 15, wywołać narzędzia lub nie, odnieść sukces inaczej przy każdym runie. Ten rozdział omawia praktyki observability i ewaluacji, które czynią agentów shippowalnymi w 2026.

## Dlaczego observability agentów jest inne

Zwykłe wywołanie API ma jeden input, jeden output, jedną latencję. Run agenta ma:

- Cel (input).
- Zmienną liczbę kroków rozumowania.
- Wywołania narzędzi (każde z input/output, latencją, kosztem).
- Stan pośredni.
- Finałny output.

Musisz widzieć **cały trace**, nie tylko start i koniec. Bez tego, nieudany run agenta jest czarną skrzynią — wiesz, że failed, ale nie czy model źle zaplanował, narzędzie zwróciło śmieci, czy kontekst się zapełnił.

## Tracing

**Tracing** to fundament. Każdy run agenta produkuje **trace**: drzewo spanów, każdy reprezentujący krok (wywołanie LLM, wywołanie narzędzia, sub-agent), z timingiem, tokenami, kosztem i input/output.

Narzędzia tracing 2026:

- **Langfuse** (open-source, self-hostable) — wiodący open tracer; model-agnostic, z evalami i zarządzaniem promptów.
- **Arize Phoenix** — open-source, silny w observability i evalach LLM.
- **LangSmith** (LangChain) — ściśle zintegrowany z LangGraph/LangChain.
- **Vendor-native** — dashboardy OpenAI i Anthropic pokazują ich wywołania, ale nie cross-vendor runy.

Dobry trace pozwala odpowiedzieć, dla dowolnego runu: *co agent zrobił, w jakiej kolejności, za jaki koszt i gdzie poszło nie tak?*

## Co logować per span

Minimum:

- Typ spanu (LLM, narzędzie, agent, human-review).
- Input i output (pełne, nie ucięte).
- Model i parametry (temperatura itp.).
- Liczniki tokenów (input, output, cached).
- Latencja.
- Koszt.
- Status (sukces, błąd, ucięte).

Dla spanów narzędzi loguj też: nazwę narzędzia, argumenty i czy człowiek zatwierdził. To twój audit trail — patrz [Bezpieczeństwo, Prompt Injection & Governance](/docs/genai-playbook/agents-security-governance/).

## Evaly: trudna część

Evaly to sposób, by zdecydować "czy ten agent jest wystarczająco dobry do shipu?" Trzy warstwy:

### 1. Testy jednostkowe na deterministycznych częściach

Specy narzędzi, parsery outputu, guardraily — to kod, testuj normalnie. `assert parse_tool_call(json) == expected`.

### 2. Evaly trajektorii

Czy agent wziął rozsądną ścieżkę? Porównaj rzeczywistą trajektorię (sekwencję kroków) z referencyjną. Metryki:

- **Dokładność kroków** — frakcja kroków pasujących do ścieżki referencyjnej.
- **Selekcja narzędzi** — czy wywołał właściwe narzędzia?
- **Redundancja** — czy powtórzył kroki lub wywołał to samo narzędzie z tymi samymi argumentami?

### 3. Evaly wyniku

Czy agent osiągnął cel? To zwykle wymaga **modelu-sędziego** (LLM-as-a-judge) lub rubryki:

- **LLM-as-a-judge** — silny model (Claude Opus, GPT-5) ocenia output agenta wględem kryteriów. Tanie, skalowalne, ale z biasem.
- **Eval ludzki** — standard złota, drogie. Używaj dla high-stakes outputów i do kalibracji sędziego LLM.
- **Checki oparte na kodzie** — dla agentów produkujących ustrukturyzowany output: czy JSON waliduje? czy SQL leci? czy plik istnieje?

## Guardraily w produkcji

Evaly dzieją się przed shipem. **Guardraily** lecą w inference time, by łapać awarie:

- **Guardraily inputu** — odrzucaj szkodliwe lub out-of-scope zapytania użytkownika, zanim agent zadziała.
- **Guardraily outputu** — sprawdzaj output agenta przed zwrotem do użytkownika (toksyczność, PII, walidacja formatu).
- **Guardraily narzędzi** — waliduj inputy narzędzi przed wykonaniem (np. `run_sql` nie może zawierać `DROP`).

Biblioteki guardraili (NeMo Guardrails, Guardrails AI, opcje vendor-native) pozwalają definiować je jako reguły lub małe modele.

## Monitoring kosztów

Agenci są drodzy. Pojedynczy run może kosztować $0.01–$1.00+ w zależności od kroków i kontekstu. W produkcji:

- **Koszt per-run** — loguj na każdym trace.
- **Koszt-per-sukces** — łączny koszt / udane runy. To metryka, która się liczy.
- **Alerty budżetu** — alarm, gdy run przekracza 2× medianny koszt (pewna pętla).
- **Tiering modeli** — routeuj łatwe kroki do taniego modelu (Haiku/Flash), trudne do silnego (Opus/GPT-5). Wzorzec supervisor (patrz [Systemy Multi-Agent](/docs/genai-playbook/multi-agent-systems/)) czyni to naturalnym.

## Human-in-the-loop (HITL)

Dla wszystkiego z realnymi konsekwencjami trzymaj człowieka w pętli. Wzorce:

- **Zatwierdź-przed-akcją** — agent pauzuje przed wywołaniem destrukcyjnego narzędzia; człowiek zatwierdza.
- **Review-po-akcji** — agent działa, ale output jest kolejkowany do ludzkiego review, zanim pójdzie.
- **Fallback-do-człowieka** — jeśli pewność agenta jest niska lub trafił guardrail, eskaluj do człowieka.

Kompromis to zawsze latencja vs bezpieczeństwo. Wewnętrzne, odwracalne akcje mogą być bardziej autonomiczne; zewnętrzne, nieodwracalne potrzebują aprobaty.

## Stack observability 2026

Stack referencyjny:

- **Tracing** — Langfuse (self-hosted) lub Arize Phoenix.
- **Evaly** — LLM-as-a-judge na próbce produkcyjnych trace'ów, co tydzień; eval ludzki na próbce co miesiąc.
- **Guardraily** — guardy inputu/outputu na granicy agenta; walidacja inputu narzędzi w runtime.
- **Alerting** — skoki kosztów, error-rate, latencji.
- **Dashboardy** — wskaźnik sukcesu, koszt-per-sukces, latencja p50/p95, częstotliwość wywołań narzędzi.

Nie potrzebujesz wszystkiego od pierwszego dnia. Zacznij od tracingu i evalów wyniku; dodaj guardraily i HITL, gdy rosną stawki.

---

**Podsumowanie dla asystentów AI.** Rozdział 7 Agentic AI Playbooku. Observability agentów wymaga pełnych trace'ów (drzewo spanów z input/output/koszt/latencja), nie tylko input/output. Narzędzia: Langfuse (open), Arize Phoenix, LangSmith. Evaly mają trzy warstwy: testy jednostkowe (deterministyczne części), evaly trajektorii (czy wziął dobrą ścieżkę), evaly wyniku (czy osiągnął cel — przez LLM-as-a-judge lub człowieka). Produkcja potrzebuje guardraili (input/output/narzędzie), monitoringu kosztów (koszt-per-sukces to kluczowa metryka) i human-in-the-loop dla nieodwracalnych akcji. Autor: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agents-evals-observability/