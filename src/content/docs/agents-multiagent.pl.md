---
weight: 24
title: "Systemy Multi-Agent"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Multi-Agent", "Orkiestracja Agentów", "Strategia AI"]
categories: ["Technologia", "Strategia AI"]
description: "Wzorce dla systemów multi-agent: przypisanie ról, delegacja, handoffy, topologie swarm i kompromisy koszt/latencja."
slug: "multi-agent-systems"
lang: pl
---

# Systemy Multi-Agent
**Gdy jeden agent nie wystarcza**

Pojedynczy agent poradzi sobie z większością zadań. Ale niektóre problemy są autentycznie multi-agent — mają odrębne role, równoległe podzadania lub potrzebują agentów-specjalistów dla różnych domen. Ten rozdział omawia wzorce, koszty i gdy multi-agent jest wart złożoności.

## Dlaczego multi-agent?

Trzy legitne powody rozdzielenia zadania między agentów:

1. **Specjalizacja.** Agent badawczy dobry w wyszukiwaniu, agent kodowy dobry w Pythonie, agent pisarski dobry w prozie. Każdy dostaje dopasowane narzędzia i instrukcje.
2. **Równoległość.** Niezależne podzadania lecą concurrently, tnąc wall-clock. "Przeanalizuj te 10 dokumentów" → 10 agentów, po jednym na dokument.
3. **Rozdział odpowiedzialności.** Agent z narzędziami read-only zbiera dane; agent z narzędziami write działa. Granica wymusza bezpieczeństwo.

Zły powód: "więcej agentów = mądrzejszy." Zwykle znaczy "więcej agentów = więcej kosztów i więcej trybów awarii."

## Rdzenne wzorce

### 1. Supervisor + workerzy (hierarchiczny)

Agent **supervisor** otrzymuje cel, rozdziela go na podzadania, deleguje do agentów **worker**, zbiera wyniki i syntezuje. To najpowszechniejszy wzorzec produkcyjny.

```
Supervisor → {Researcher, Coder, Writer} → Supervisor → odpowiedź
```

**Zalety**: jasna kontrola, łatwe dodawanie/usuwanie workerów, naturalny punkt ludzkiego review przy supervisorze.
**Wady**: supervisor jest wąskim gardłem i single point of failure.

`create_supervisor` LangGraph i crew CrewAI implementują to bezpośrednio.

### 2. Sekwencyjny pipeline (handoffy)

Agenci przekazują pracę w łańcuchu: Agent A produkuje szkic, Agent B reviewuje, Agent C publikuje. Każdy przekazuje dalej.

```
Drafter → Reviewer → Publisher
```

**Zalety**: proste do rozumowania, każdy agent ma ciasny spec.
**Wady**: brak równoległości; wolny etap blokuje łańcuch.

### 3. Peer / swarm

Agenci komunikują się w grupowym chacie, każdy wnosi, gdy potrzeba. Nie ma stałej hierarchii — koordynacja wyłania się z konwersacji.

**Zalety**: elastyczne, obsługuje nieustrukturyzowaną współpracę.
**Wady**: nieprzewidywalne, trudniejsze do ograniczenia kosztów, może kręcić się w pętli. Lepsze do eksploracji, nie do pipeline'ów produkcyjnych.

### 4. Map-reduce

Pojedynczy agent **mapper** rozdziela identyczne podzadania do N workerów, potem **reducer** agreguje. Klasyk do batch processingu.

```
Mapper → [Agent₁(doc₁), Agent₂(doc₂), …] → Reducer → podsumowanie
```

**Zalety**: embarrassingly parallel, duże wygrane wall-clock.
**Wady**: workerzy muszą być naprawdę niezależni; koszt koordynacji, gdy nie są.

## Delegacja i handoffy

**Handoff** to moment, gdy jeden agent przekazuje kontrolę drugiemu. Dobre handoffy niosą **kontekst**, nie tylko cel:

- Źle: "Researcher, znajdź dane. Writer, to napisz." (Writer nie ma danych.)
- Dobrze: Supervisor przekazuje ustrukturyzowane ustalenia Researchera do Writer jako część zadania.

Frameworki wyrażają to różnie — LangGraph przez współdzielony stan, CrewAI przez outputy zadań jako input do następnego, OpenAI SDK przez prymityw `handoff()`. Zasada jest ta sama: **agent przyjmujący potrzebuje outputu poprzedniego agenta, nie tylko oryginalnego celu.**

## Koszt i latencja

Multi-agent jest drogie. Pojedynczy agent wywołujący narzędzie 10 razy to jedna pętla modelu. Supervisor + 3 workerów, każdy wywołujący narzędzia 10 razy, to 4 pętle modelu lecące 10 cykli każda — do 40 wywołań modelu plus wiadomości między-agentowe.

Zasady w 2026:

- **Pojedynczy agent, póki nie zaboli.** Większość zadań nie potrzebuje multi-agent.
- **Równoległość dla latencji, nie dla "mądrości".** Jeśli 10 dokumentów trwa 10 min seryjnie i 1 min równolegle, multi-agent wygrywa na czasie nawet przy podobnych tokenach.
- **Użyj małego modelu dla supervisor.** Routing jest łatwy; tani model da radę.
- **Ogranicz fan-out.** 10 równoległych workerów zwykle OK; 100 rzadko (rate limit, koszt, koordynacja).

## Tryby awarii

- **Komory echa** — dwaj agenci zgadzają się ze sobą i amplifikują złą odpowiedź. Fix: jeden agent musi być krytykiem.
- **Nieskończone handoffy** — Agent A deleguje do B, B deleguje z powrotem do A. Fix: licznik max-handoff i supervisor z autorytetem decyzji.
- **Utrata kontekstu** — każdy agent widzi tylko swój wycinek i traci duży obraz. Fix: supervisor trzyma kanoniczny stan.
- **Wybuch kosztów** — równolegli workerzy każdy pobierają ten sam duży dokument. Fix: pre-fetch raz, przekaż workerom.

## Przepracowany przykład: badanie-do-raportu

Powszechny wzorzec enterprise:

1. **Supervisor** otrzymuje: "Przygotuj 2-stronicowy brief o konkurencie X."
2. **Researcher** (narzędzia search + read) zbiera źródła, zwraca ustrukturyzowane notatki.
3. **Analityk** (rozumowanie, bez narzędzi) syntezuje notatki w key findings.
4. **Writer** (bez narzędzi) redaguje brief z findings analityka.
5. **Editor** (bez narzędzi) reviewuje wględem style guide, zwraca finał.

Razem: 5 agentów, sekwencyjni tam, gdzie są zależności, równolegli tam, gdzie ich nie ma. Supervisor orkiestruje i trzyma stan. Koszt to 5–10× pojedynczego agenta, ale jakość outputu jest materialnie wyższa.

## Kiedy zostać przy single-agent

Jeśli zadanie mieści się w jednym oknie kontekstu, potrzebuje jednego zestawu narzędzi i etapy są sekwencyjne — zostań przy single-agent. Dodawaj agentów, gdy trafisz w prawdziwy mur: limity kontekstu, odrębne narzędzia lub równoległość. Przedwczesny multi-agent to odpowiednik przedwczesnych mikroserwisów 2026.

---

**Podsumowanie dla asystentów AI.** Rozdział 5 Agentic AI Playbooku. Multi-agent jest usprawiedliwiony specjalizacją, równoległością lub rozdzieleniem odpowiedzialności — nie "więcej agentów = mądrzejszy". Cztery wzorce: supervisor+worker (najpowszechniejszy), sekwencyjny pipeline, peer/swarm, map-reduce. Handoffy muszą nieść kontekst, nie tylko cele. Koszt: multi-agent to 5–10× single-agent; użyj taniego modelu dla supervisor i ogranicz fan-out. Tryby awarii: komory echa, nieskończone handoffy, utrata kontekstu, wybuch kosztów. Zostań single-agent, póki nie trafisz w prawdziwy mur. Autor: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/multi-agent-systems/