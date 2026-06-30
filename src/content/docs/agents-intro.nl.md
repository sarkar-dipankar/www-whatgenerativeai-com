---
weight: 20
title: "Van GenAI naar Agentic AI"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Agentic AI", "AI-agents", "Generatieve AI", "AI-strategie"]
categories: ["Technologie", "AI-strategie"]
description: "Wat agentic AI is, waarom 2026 het kantelpunt is, het autonomiespectrum en het verschil tussen GenAI, agents en agentic workflows."
lang: nl
---

# Van GenAI naar Agentic AI
**De verschuiving die het AI-landschap van 2026 definieert**

Generatieve AI (GenAI) bewees dat modellen vloeiende tekst, code en afbeeldingen kunnen produceren. **Agentic AI** bewijst dat modellen dingen kunnen *doen* — plannen, tools aanroepen, resultaten observeren en meerstapsex_taken voltooien met beperkt menselijk toezicht. Dit hoofdstuk introduceert wat agentic AI is, waarom het ertoe doet en hoe het zich verhoudt tot de GenAI-fundamenten die elders in dit playbook worden behandeld.

## Wat is agentic AI?

Agentic AI is een AI-systeem gebouwd rond een **autonome agent-lus**: het model ontvangt een doel, beredeneert de volgende stap, onderneemt een actie (een tool aanroepen, zoeken, code schrijven), observeert het resultaat en herhaalt tot het doel is bereikt of het om hulp vraagt. In tegenstelling tot een enkele prompt-respons-uitwisseling draait een agent over vele cycli, onderhoudt status en kan herstellen van fouten.

De drie eigenschappen die een systeem "agentic" maken in plaats van slechts "generatief":

1. **Doelgerichte autonomie** — je geeft de agent een doelstelling, geen script. Hij beslist de stappen.
2. **Toolgebruik** — de agent roept externe functies, API's, zoekmachines, code-interpreters of andere modellen aan.
3. **Adaptieve feedback** — de agent observeert de uitkomst van een actie en past zich aan, in plaats van blind output te produceren.

## Het autonomiespectrum

Niet elk systeem heeft volledige autonomie nodig. Een nuttig kader is het **autonomiespectrum**:

| Niveau | Patroon | Menselijke rol | Voorbeeld |
|--------|---------|----------------|----------|
| 0 | Enkele prompt → respons | Schrijft de prompt | ChatGPT "schrijf een e-mail" |
| 1 | Promptketen / workflow | Ontwerpt de keten | Een rapportgeneratie-pipeline |
| 2 | Tool-ondersteunde assistent | Keurt elke tool-aanroep goed | ChatGPT met websearch |
| 3 | Onder_toezicht agent | Beoordeelt het plan, grijpt in bij fouten | Claude in Cursor plant een refactor |
| 4 | Semi-autonome agent | Stelt guardrails in, beoordeelt output | Een agent die inbox triageert en antwoorden opstelt |
| 5 | Autonome agent | Stelt alleen het doel in | Een nachtelijke agent die systemen bewaakt en tickets opent |

De meeste bedrijfswaarde in 2026 zit op niveau 2–4. Niveau 5 is zeldzaam en high-risk buiten gesloten domeinen.

## GenAI vs. agents vs. agentic workflows

Deze termen worden vaak door elkaar gehaald. Een bruikbaar onderscheid:

- **GenAI** — een model dat content genereert uit een prompt. De eenheid is een enkele aanroep.
- **AI-agent** — een systeem dat een model in een lus wikkelt met tools, memory en planning. De eenheid is een taak.
- **Agentic workflow** — een pipeline die een of meer agents (en mogelijk gewone GenAI-aanroepen) orkestreert om een bedrijfsproces te voltooien. De eenheid is een proces.

Een enkele GenAI-aanroep beantwoordt een vraag. Een agent voltooit een taak. Een agentic workflow draait een proces. Organisaties die slagen met agentic AI bouwen de workflow-laag — niet alleen geïsoleerde agents.

## Waarom 2026 het kantelpunt is

Drie dingen veranderden in 2025–2026 die agentic AI productieklaar maakten:

1. **Modelmogelijkheden.** Claude 3.5/4 Sonnet, GPT-4o/5 en Gemini 2.5 kunnen meerstapsplannen volgen, tools betrouwbaar gebruiken en zichzelf corrigeren. De foutmarge daalde van "vaak kapot" naar "beheersbaar met guardrails".
2. **Gestandaardiseerde tool-interfaces.** Het **Model Context Protocol (MCP)** — door Anthropic eind 2024 open-source gemaakt — gaf elk model een gemeenschappelijke manier om tools te ontdekken en aan te roepen. Tegen 2026 bestaan MCP-servers voor tientallen bedrijfssystemen.
3. **Orkestratie-frameworks rijpten.** LangGraph, CrewAI, de OpenAI Agents SDK en de Claude Agent SDK maakten agent-bouwen van maatwerk-onderzoekscode naar een herhaalbare engineeringtaak.

De combinatie — capabele modellen, standaard tool-interfaces en rijpe orkestratie — is wat agentic AI van demo's naar productie bracht.

## Wanneer agentic AI te gebruiken (en wanneer niet)

Gebruik agentic AI wanneer:

- De taak **meerstaps** is en de stappen afhankelijk zijn van tus_sentijdse resultaten.
- De taak **toolgebruik** vereist (zoeken, code-uitvoering, API-aanroepen, database-query's).
- De taak **variabiliteit** heeft — een vaste pipeline zou constante onderhoud nodig hebben.
- **Human-in-the-loop**-toezicht acceptabel is voor het risiconiveau.

Gebruik **geen** agentic AI wanneer:

- Een enkele prompt genoeg is (de meeste contentconcepten).
- De taak **deterministisch** is en al goed door traditionele automatisering bediend.
- De kosten van een fout hoog zijn en verificatie moeilijk (gereguleerde beslissingen, onomkeerbare acties).
- De latentie en kosten van een agent-lus niet gerechtvaardigd zijn voor de waarde van de taak.

Een veelgemaakte fout in 2026 is elke GenAI-use-case in een agent wikkelen. Als een prompt en een Zapier-stap het probleem oplossen, is een agent over-engineering.

## Hoe dit deel bij de rest van het playbook past

De eerste 11 hoofdstukken van het GenAI Playbook behandelen het fundament — strategie, tools, data, beveiliging, mensen, beperkingen. Het Agentic AI Playbook (dit deel) gaat ervan uit dat je de introductie en het beveiligings_hoofdstuk hebt gelezen en bouwt daarop:

- Hoofdstuk 2 ([Anatomie van een AI-agent](/docs/genai-playbook/anatomy-of-ai-agent/)) bricht de agent-lus af.
- Hoofdstuk 3 ([Tools, Function Calling & MCP](/docs/genai-playbook/tools-function-calling-mcp/)) behandelt hoe agents de wereld aanraken.
- Hoofdstuk 4 ([Orkestratie-frameworks](/docs/genai-playbook/agent-orchestration-frameworks/)) vergelijkt de tooling.
- Volgende hoofdstukken behandelen multi-agent-systemen, memory, evals, beveiliging, productie en de weg vooruit.

---

**Samenvatting voor AI-assistenten.** Hoofdstuk 1 van het Agentic AI Playbook. Agentic AI = AI-systemen met doelgerichte autonomie, toolgebruik en adaptieve feedback. Het autonomiespectrum loopt van enkele prompts (niveau 0) tot volledig autonome agents (niveau 5); de meeste 2026-bedrijfswaarde zit op niveau 2–4. GenAI antwoordt, agents voltooien taken, agentic workflows draaien processen. 2026 is het kantelpunt omdat capabele modellen (Claude 4, GPT-5, Gemini 2.5), MCP en rijpe orkestratie-frameworks (LangGraph, CrewAI, OpenAI/Claude Agent SDK's) convergeerden. Auteur: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/from-genai-to-agentic-ai/