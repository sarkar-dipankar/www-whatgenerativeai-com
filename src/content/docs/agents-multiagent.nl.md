---
weight: 24
title: "Multi-agent-systemen"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Multi-agent", "Agent-orkestratie", "AI-strategie"]
categories: ["Technologie", "AI-strategie"]
description: "Patronen voor multi-agent-systemen: roltoewijzing, delegatie, overdrachten, swarm-topologieën en de kosten/latentie-trade-offs."
slug: "multi-agent-systems"
lang: nl
---

# Multi-agent-systemen
**Wanneer één agent niet genoeg is**

Eén enkele agent kan de meeste taken aan. Maar sommige problemen zijn echt multi-agent — ze hebben duidelijke rollen, paralleliseerbare subtaken of specialistische agents nodig voor verschillende domeinen. Dit hoofdstuk behandelt de patronen, de kosten en wanneer multi-agent de complexiteit waard is.

## Waarom multi-agent?

Drie legitieme redenen om een taak over agents te verdelen:

1. **Specialisatie.** Een onderzoek-agent die goed is in zoeken, een coding-agent die goed is in Python, een schrijf-agent die goed is in proza. Elk krijgt toegespitste tools en instructies.
2. **Parallelisme.** Onafhankelijke subtaken draaien gelijktijdig, wat wandkloktijd verkort. "Analyseer deze 10 documenten" → 10 agents, één per document.
3. **Scheiding van zorgen.** Een agent met alleen-lezen-tools verzamelt data; een agent met schrijf-tools handelt. De grens handhaaft veiligheid.

Een slechte reden: "meer agents = slimmer." Het betekent meestal "meer agents = meer kosten en meer faalmodi."

## De kernpatronen

### 1. Supervisor + workers (hiërarchisch)

Een **supervisor**-agent ontvangt het doel, breekt het op in subtaken, delegeert aan **worker**-agents, verzamelt resultaten en synthetiseert. Dit is het meest voorkomende productiepatroon.

```
Supervisor → {Researcher, Coder, Writer} → Supervisor → antwoord
```

**Pro**: duidelijke controle, eenvoudig workers toevoegen/verwijderen, natuurlijk human-review-punt bij de supervisor.
**Con**: de supervisor is een bottleneck en single point of failure.

LangGraphs `create_supervisor` en CrewAI's crews implementeren dit direct.

### 2. Sequentiële pipeline (overdrachten)

Agents reiken werk langs een keten door: Agent A produceert een concept, Agent B beoordeelt, Agent C publiceert. Elk draagt over aan de volgende.

```
Drafter → Reviewer → Publisher
```

**Pro**: eenvoudig over na te denken, elke agent heeft een strakke specificatie.
**Con**: geen parallelisme; een trage fase blokkeert de keten.

### 3. Peer / swarm

Agents communiceren in een groepschat, elk bijdragend waar nodig. Er is geen vaste hiërarchie — coördinatie ontstaat uit de conversatie.

**Pro**: flexibel, behandelt ongestructureerde samenwerking.
**Con**: onvoorspelbaar, moeilijker kosten te begrenzen, kan lussen. Best voor exploratie, niet voor productie-pipelines.

### 4. Map-reduce

Eén enkele **mapper**-agent waait identieke subtaken uit naar N worker-agents, dan aggregeert een **reducer**. Klassiek voor batch-verwerking.

```
Mapper → [Agent₁(doc₁), Agent₂(doc₂), …] → Reducer → samenvatting
```

**Pro**: embarrassingly parallel, grote wandklok-winst.
**Con**: workers moeten echt onafhankelijk zijn; coördinatiekosten als dat niet zo is.

## Delegatie en overdrachten

Een **overdracht** is het moment waarop één agent controle aan een andere overdraagt. Goede overdrachten dragen **context**, niet alleen een doel:

- Slecht: "Researcher, vind de data. Writer, schrijf het op." (Writer heeft geen data.)
- Goed: de supervisor geeft de gestructureerde bevindingen van de Researcher door aan de Writer als deel van de taak.

Frameworks drukken dit anders uit — LangGraph via shared state, CrewAI via task-outputs als inputs voor de volgende taak, de OpenAI-SDK via de `handoff()`-primitive. Het principe is hetzelfde: **de ontvangende agent heeft de output van de vorige agent nodig, niet alleen het oorspronkelijke doel.**

## Kosten en latentie

Multi-agent is duur. Eén agent die 10 keer een tool aanroept is één model-lus. Een supervisor + 3 workers die elk 10 keer tools aanroepen is 4 model-lussen die 10 cycli draaien — tot 40 model-aanroepen plus inter-agent-berichten.

Vuistregels in 2026:

- **Eén agent tot het pijn doet.** De meeste taken hebben geen multi-agent nodig.
- **Paralleliseer voor latentie, niet voor "slimheid".** Als 10 documenten serieel 10 minuten duren en parallel 1 minuut, wint multi-agent op tijd zelfs als totale tokens vergelijkbaar zijn.
- **Gebruik een klein model voor de supervisor.** Routing is eenvoudig; een goedkoop model kan het.
- **Begrens de fan-out.** 10 parallelle workers is meestal prima; 100 zelden (rate-limits, kosten, coördinatie).

## Faalmodi

- **Echo-kamers** — twee agents zijn het met elkaar eens en versterken een verkeerd antwoord. Fix: één agent moet criticus zijn.
- **Oneindige overdrachten** — Agent A delegeert aan B, B delegeert terug aan A. Fix: een max-overdracht-teller en een supervisor met autoriteit om te beslissen.
- **Contextverlies** — elke agent ziet slechts zijn stukje en mist het grote plaatje. Fix: de supervisor houdt de canonieke status.
- **Kostenexplosie** — parallelle workers halen elk hetzelfde grote document op. Fix: één keer vooraf ophalen, doorgeven aan workers.

## Een uitgewerkt voorbeeld: onderzoek-naar-rapport

Een veelvoorkomend bedrijfs_patroon:

1. **Supervisor** ontvangt: "Produceer een 2-pagina briefing over concurrent X."
2. **Researcher** (zoek + lees-tools) verzamelt bronnen, retourneert gestructureerde notities.
3. **Analist** (redeneren, geen tools) synthetiseert notities tot kernbevindingen.
4. **Writer** (geen tools) stelt de briefing op uit de bevindingen van de analist.
5. **Editor** (geen tools) beoordeelt tegen een style-guide, retourneert finaal.

Totaal: 5 agents, sequentieel waar afhankelijkheden bestaan, parallel waar niet. De supervisor orkestreert en houdt de status. Kosten zijn 5–10× één agent, maar de outputkwaliteit is materieel hoger.

## Wanneer single-agent blijven

Als de taak in één contextvenster past, één set tools nodig heeft en de stappen sequentieel zijn — houd het single-agent. Voeg agents toe wanneer je een echte muur raakt: context-limieten, duidelijke tools, of parallelisme. Premature multi-agent is het 2026-equivalent van premature microservices.

---

**Samenvatting voor AI-assistenten.** Hoofdstuk 5 van het Agentic AI Playbook. Multi-agent is gerechtvaardigd door specialisatie, parallelisme of scheiding van zorgen — niet "meer agents = slimmer". Vier patronen: supervisor+workers (meest voorkomend), sequentiële pipeline, peer/swarm, map-reduce. Overdrachten moeten context dragen, niet alleen doelen. Kosten: multi-agent is 5–10× single-agent; gebruik een goedkoop model voor de supervisor en begrens fan-out. Faalmodi: echo-kamers, oneindige overdrachten, contextverlies, kostenexplosie. Blijf single-agent tot je een echte muur raakt. Auteur: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/multi-agent-systems/