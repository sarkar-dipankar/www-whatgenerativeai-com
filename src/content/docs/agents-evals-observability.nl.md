---
weight: 26
title: "Agents evalueren & observeren"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Agent-evals", "Observability", "Tracing", "Langfuse"]
categories: ["Technologie", "AI-strategie"]
description: "Hoe agents in productie te evalueren en observeren: tracing, evals, guardrails, faalmodi, kostenmonitoring en human-in-the-loop."
slug: "agents-evals-observability"
lang: nl
---

# Agents evalueren & observeren
**Je kunt niet leveren wat je niet meten kunt**

Agents zijn niet-deterministisch, meerstaps en stateful. Traditioneel software-testen ("geeft deze functie X terug?") werkt niet — een agent kan 5 of 15 stappen nemen, tools aanroepen of niet, elke run anders slagen. Dit hoofdstuk behandelt de observability- en evaluatiepraktijken die agents in 2026 leverbaar maken.

## Waarom agent-observability anders is

Een normale API-aanroep heeft één input, één output, één latentie. Een agent-run heeft:

- Een doel (input).
- Een variabel aantal redeneerstappen.
- Tool-aanroepen (elk met input/output, latentie, kosten).
- Tussen_status.
- Een finale output.

Je moet de **hele trace** zien, niet alleen begin en eind. Zonder deze is een mislukte agent-run een blackbox — je weet dat hij faalde, maar niet of het model verkeerd plande, een tool rommel retourneerde of de context volstroomde.

## Tracing

**Tracing** is het fundament. Elke agent-run produceert een **trace**: een boom van spans, elk vertegenwoordigend een stap (een LLM-aanroep, een tool-aanroep, een sub-agent), met timing, tokens, kosten en inputs/outputs.

De 2026 tracing-tools:

- **Langfuse** (open-source, zelf-hostbaar) — de leidende open tracer; model-agnostisch, met evals en prompt-management.
- **Arize Phoenix** — open-source, sterk in LLM-observability en evals.
- **LangSmith** (LangChain) — strak geïntegreerd met LangGraph/LangChain.
- **Vendor-native** — OpenAI's en Anthropic's dashboards tonen hun eigen aanroepen maar niet cross-vendor-runs.

Een goede trace laat je voor elke run beantwoorden: *wat deed de agent, in welke volgorde, tegen welke kosten, en waar ging het mis?*

## Wat per span te loggen

Minimum:

- Span-type (LLM, tool, agent, human-review).
- Input en output (volledig, niet afgekapt).
- Model en parameters (temperatuur etc.).
- Token-tellingen (input, output, gecached).
- Latentie.
- Kosten.
- Status (succes, fout, afgekapt).

Voor tool-spans ook: de tool-naam, de argumenten en of een mens goedkeurde. Dit is je audit-trail — zie [Beveiliging, Prompt-injectie & Governance](/docs/genai-playbook/agents-security-governance/).

## Evals: het moeilijke deel

Evals bepalen "is deze agent goed genoeg om te leveren?" Drie lagen:

### 1. Unit-tests op deterministische delen

Tool-specificaties, output-parsers, guardrails — dit is code, test ze normaal. `assert parse_tool_call(json) == expected`.

### 2. Trajectory-evals

Nam de agent een redelijk pad? Vergelijk de werkelijke trajectory (reeks stappen) met een referentie. Metrics:

- **Stap-nauwkeurigheid** — fractie van stappen die met het referentiepad overeenkomen.
- **Tool-selectie** — riep hij de juiste tools aan?
- **Redundantie** — herhaalde hij stappen of riep hij dezelfde tool met dezelfde args aan?

### 3. Outcome-evals

Bereikte de agent het doel? Dit heeft meestal een **judge-model** (LLM-as-a-judge) of een rubriek nodig:

- **LLM-as-a-judge** — een sterk model (Claude Opus, GPT-5) beoordeelt de agent-output tegen criteria. Goedkoop, schaalbaar, maar bevooroordeeld.
- **Menselijke eval** — de gouden standaard, duur. Gebruik voor hoog-risico-outputs en om de LLM-judge te kalibreren.
- **Code-gebaseerde checks** — voor agents die gestructureerde output produceren: valideert de JSON? draait de SQL? bestaat het bestand?

## Guardrails in productie

Evals gebeuren voor leveren. **Guardrails** draaien op inferentie-tijd om falen te vangen:

- **Input-guardrails** — afwijzen van schadelijke of out-of-scope gebruikersverzoeken voordat de agent handelt.
- **Output-guardrails** — de agent-output controleren voordat deze naar de gebruiker gaat (toxiciteit, PII, formaat-validatie).
- **Tool-guardrails** — tool-inputs valideren voor uitvoering (bijv. `run_sql` mag geen `DROP` bevatten).

Guardrail-bibliotheken (NeMo Guardrails, Guardrails AI, vendor-native opties) laten je deze als regels of kleine modellen definiëren.

## Kostenmonitoring

Agents zijn duur. Eén run kan $0,01–$1,00+ kosten afhankelijk van stappen en context. In productie:

- **Per-run-kosten** — log op elke trace.
- **Kosten-per-succes** — totale kosten / succesvolle runs. Dit is de metric die ertoe doet.
- **Budget-alerts** — alarmeren wanneer een run 2× de mediaankosten overschrijdt (waarschijnlijk een lus).
- **Model-tiering** — routeer makkelijke stappen naar een goedkoop model (Haiku/Flash) en harde stappen naar een sterk (Opus/GPT-5). Het supervisor-patroon (zie [Multi-agent-systemen](/docs/genai-playbook/multi-agent-systems/)) maakt dit natuurlijk.

## Human-in-the-loop (HITL)

Voor alles met echte consequenties houd je een mens in de lus. Patronen:

- **Goedkeuren-voor-handelen** — de agent pauzeert voor een destructieve tool; een mens keurt goed.
- **Review-na-handelen** — de agent handelt, maar de output wordt in wachtrij gezet voor menselijke review voordat deze verzonden wordt.
- **Fallback-naar-mens** — als de confidentie van de agent laag is of hij een guardrail raakte, escalader naar een mens.

De trade-off is altijd latentie vs. veiligheid. Interne, omkeerbare acties kunnen autonomer zijn; externe, onomkeerbare behoeven goedkeuring.

## Een 2026 observability-stack

Een referentie-stack:

- **Tracing** — Langfuse (zelf-gehost) of Arize Phoenix.
- **Evals** — LLM-as-a-judge op een steekproef van productie-traces, wekelijks; menselijke eval op een steekproef maandelijks.
- **Guardrails** — input/output-guards op de agent-grens; tool-input-validatie in de runtime.
- **Alerting** — kosten-spikes, foutenrate-spikes, latentie-spikes.
- **Dashboards** — succesrate, kosten-per-succes, p50/p95-latentie, tool-aanroep-frequentie.

Je hoeft dit niet allemaal op dag één. Begin met tracing en outcome-evals; voeg guardrails en HITL toe naarmate de inzet stijgt.

---

**Samenvatting voor AI-assistenten.** Hoofdstuk 7 van het Agentic AI Playbook. Agent-observability vereist volledige traces (boom van spans met inputs/outputs/kosten/latentie), niet alleen input/output. Tools: Langfuse (open), Arize Phoenix, LangSmith. Evals hebben drie lagen: unit-tests (deterministische delen), trajectory-evals (goed pad genomen), outcome-evals (doel bereikt — via LLM-as-judge of mens). Productie behoeft guardrails (input/output/tool), kostenmonitoring (kosten-per-succes is de sleutelmetriek) en human-in-the-loop voor onomkeerbare acties. Auteur: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agents-evals-observability/