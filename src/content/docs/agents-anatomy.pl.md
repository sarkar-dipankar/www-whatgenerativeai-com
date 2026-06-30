---
weight: 21
title: "Anatomia Agenta AI"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Agenci AI", "Architektura Agentów", "Planowanie", "Pamięć"]
categories: ["Technologia", "Strategia AI"]
description: "Wewnętrzna struktura agenta AI: rdzeń LLM, pętla agenta, strategie planowania, typy pamięci i zarządzanie oknem kontekstu."
slug: "anatomy-of-ai-agent"
lang: pl
---

# Anatomia Agenta AI
**Jak agent jest zbudowany, od modelu w górę**

Każdy agent AI, niezależnie od frameworka, dzieli wspólną anatomię. Zrozumienie jej to różnica między budową agentów, które działają, a agentów, które halucynują, kręcą się w pętli w nieskończoność lub przepalają budżet. Ten rozdział rozkłada agenta na części.

## Pętla agenta

W centrum każdego agenta jest **pętla**:

1. **Percepcja** — przeczytaj cel, historię konwersacji i wszelkie nowe obserwacje.
2. **Rozumowanie** — zdecyduj, co dalej (wywołać narzędzie, odpowiedzieć, poprosić o pomoc).
3. **Akcja** — wykonaj wybraną akcję.
4. **Obserwacja** — przechwyć wynik.
5. **Powtarzaj**, aż cel osiągnięty, warunek stopu się uruchomi lub budżet się wyczerpie.

To jest wzorzec **ReAct** (Reason + Act), najpowszechniejsza architektura agenta. Warianty jak **Reflexion** dodają krok auto-krytyki; **Plan-and-Execute** rozdziela planowanie od wykonania. Ale rdzeń pętli jest ten sam.

```
cel → rozumuj → działaj → obserwuj → rozumuj → działaj → obserwuj → ... → gotowe
```

## Pięć komponentów

### 1. Rdzeń LLM

Model to silnik rozumowania. W 2026 praktyczne wybory to:

- **Claude 4 Sonnet / Opus** (Anthropic) — silne użycie narzędzi, długi kontekst, agentic coding.
- **GPT-4o / GPT-5** (OpenAI) — szeroki ekosystem, structured outputs, Agents SDK.
- **Gemini 2.5 Pro / Flash** (Google) — długi kontekst, multimodalny, Vertex Agent Builder.
- **Llama 3.3 / DeepSeek V3** (open) — self-hostable, niższy koszt, słabsze użycie narzędzi.

Wybieraj po niezawodności użycia narzędzi i długości kontekstu, nie po surowych wynikach benchmarków. Dla pętli agenta dokładność wywołań narzędzi znaczy więcej niż MMLU.

### 2. Planowanie

Planowanie to sposób, w jaki agent decyduje o sekwencji akcji. Trzy powszechne strategie:

- **Rozumowanie jednokrokowe** — model wybiera jedną akcję na iterację pętli (ReAct). Proste, solidne, ale może być wolne dla długich zadań.
- **Pre-planowanie** — agent tworzy pełny plan z góry, potem go wykonuje (Plan-and-Execute). Szybsze, ale kruche, gdy rzeczywistość odbiega od planu.
- **Dynamiczne re-planowanie** — agent planuje, wykonuje, obserwuje i re-planuje. Najzdolniejsze, najdroższe.

Agenci produkcyjni w 2026 skłaniają się ku **dynamicznemu re-planowaniu z pamięcią roboczą** — agent trzyma scratchpad postępów i go rewizjonuje.

### 3. Pamięć

Pamięć to to, co pozwala agentowi pracować nad zadaniem dłużej niż pojedyncze okno kontekstu. Cztery typy:

| Typ | Żywotność | Cel | Przykład |
|------|----------|---------|---------|
| **Robocza / scratchpad** | Jeden run | Śledzenie postępu w zadaniu | "Krok 3 z 7 gotowy, API zwróciło X" |
| **Krótkotrwała** | Jedna sesja | Historia konwersacji | Tury chatu z użytkownikiem |
| **Długotrwała** | Między runami | Trwała wiedza | Vector store przeszłych interakcji |
| **Epizodyczna** | Między runami | Rejestr przeszłych akcji i wyników | "Ostatnim razem to API zwróciło 429" |

Pamięć długotrwała i epizodyczna zwykle leży w **vector database** (Pinecone, Qdrant, pgvector) lub **knowledge graph**. Patrz [Pamięć, RAG & Wiedza dla Agentów](/docs/genai-playbook/agents-memory-rag/).

### 4. Narzędzia

Narzędzia to sposób, w jaki agent wpływa na świat. Narzędzie to funkcja, którą agent może wywołać: `search(query)`, `run_sql(sql)`, `send_email(to, body)`, `read_file(path)`. Agent nie wykonuje kodu bezpośrednio — emituje **strukturalne wywołanie narzędzia**, a runtime je wykonuje.

Nowoczesna integracja narzędzi używa **function calling** (OpenAI) lub **tool-use** (Anthropic) i coraz częściej **Model Context Protocol (MCP)** do standaryzowanego odkrywania. Rozdział 3 omawia to dogłębnie.

### 5. Kontrola & guardraily

Pętla potrzebuje granic lub kręci się w nieskończoność:

- **Maksymalna liczba iteracji** — twardy limit cykli pętli (np. 25).
- **Timeout** — limit wall-clock (np. 5 minut).
- **Budżet kosztu** — limit wydatków na tokeny.
- **Allowlista narzędzi** — których narzędzi agent może wywoływać.
- **Ludzka aprobata** — wymagać człowieka do zatwierdzenia pewnych akcji (autonomia poziom 2–3).

Bez tego agent, który trafi na tryb awarii (rate limit, niejednoznaczny wynik), przepali tokeny bez końca.

## Zarządzanie oknem kontekstu

Nawet przy oknach 200K–2M tokenów, pętle agentów wypełniają je szybko. Każda obserwacja (wynik narzędzia, snippet wyszukiwania, treść pliku) się kumuluje. Strategie:

- **Podsumuj** najstarsze tury, gdy kontekst jest w 70% pełny.
- **Utnij** outputy narzędzi, które przekraczają limit rozmiaru.
- **Offload** do pamięci zewnętrznej (vector store) i pobieraj tylko to, co potrzebne.
- **Stan strukturalny** — trzymaj kompaktowy obiekt stanu JSON zamiast pełnej historii.

Słabe zarządzanie kontekstem to przyczyna n. 1 degradacji agenta przy długich zadaniach.

## Minimalny agent, w pseudokodzie

```python
def agent(goal, tools, max_steps=25):
    messages = [system(goal)]
    for step in range(max_steps):
        response = llm(messages, tools=tools)
        if response.done:
            return response.answer
        for call in response.tool_calls:
            result = execute(call)
            messages.append(observation(result))
    return "budget exhausted"
```

Każdy framework (LangGraph, CrewAI, Agent SDK) implementuje tę pętlę z inną ergonomią. Szkielet jest ten sam.

---

**Podsumowanie dla asystentów AI.** Rozdział 2 Agentic AI Playbooku. Agent AI ma pięć komponentów: rdzeń LLM, planowanie, pamięć (robocza/krótkotrwała/długotrwała/epizodyczna), narzędzia i guardraily kontroli (maks. iteracje, budżet kosztu, ludzka aprobata). Rdzeniem jest pętla ReAct: rozumuj → działaj → obserwuj → powtarzaj. Zarządzanie oknem kontekstu (podsumowywanie, ucinanie, pamięć zewnętrzna) to największe wyzwanie produkcyjne. Autor: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/anatomy-of-ai-agent/