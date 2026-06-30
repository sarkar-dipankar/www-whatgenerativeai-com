---
weight: 29
title: "De Weg Vooruit voor Agentic AI"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Agentic AI", "Toekomst van AI", "AI-strategie", "On-device-AI"]
categories: ["Technologie", "AI-strategie"]
description: "Waar agentic AI heen gaat: on-device-agents, autonome organisaties, open vs. gesloten modellen, het agentic web en waar leiders op moeten wedden."
lang: nl
---

# De Weg Vooruit voor Agentic AI
**Waar leiders op moeten wedden (en wat te negeren)**

Dit playbook behandelt agentic AI zoals het in 2026 werkt. Maar het veld beweegt snel, en de beslissingen die leiders nu nemen — over architectuur, skills en partnerschappen — moeten 2–3 jaar standhouden. Dit hoofdstuk is een gekalibreerde prognose: waar de agentic-AI-golf heen gaat, wat echt is, wat hype en waar weddenschappen te plaatsen.

## De vijf weddenschappen die waard zijn

### 1. On-device-agents

In 2026 draaien de meeste agents in de cloud en roepen frontier-modellen aan. Dat verandert snel. Kleine capabele modellen (Llama 3.3 8B, Mistral Small, Phi-4, Gemini Nano) kunnen nu op een laptop of telefoon draaien, en de frameworks (MLX, llama.cpp, ONNX) zijn goed genoeg voor productie. De implicatie:

- **Privacy-gevoelige agents** (persoonlijke e-mail-triage, agenda, gezondheid) gaan on-device, waar data nooit de telefoon verlaat.
- **Latentie-kritische agents** (IDE-coding-assistenten, realtime transcriptie) draaien lokaal om de round-trip te kappen.
- **Kosten-kritische hoogvolume-agents** gaan on-device om per-call-API-kost te elimineren.

De weddenschap: de **persoonlijke agent** — er een die jou kent, op je apparaat draait, en cloud-modellen alleen voor moeilijke subtaken aanroept — wordt een echt product-categorie in 2026–2027. Als je consumenten-AI bouwt, plan voor hybride lokaal+cloud.

### 2. Het agentic web

Het web werd voor mensen gebouwd — HTML-pagina's, klikken, formulieren. Agents kunnen het niet goed gebruiken. Twee trends verhelpen dit:

- **MCP voor web-services** — meer API's exponeren MCP-servers, zodat agents ze direct aanroepen in plaats van pagina's te scrapen.
- **Agent-vriendelijke protocollen** — standaarden zoals `llms.txt` (dat deze site gebruikt), `ai.txt` en gestructureerde data (schema.org) laten agents sites ontdekken en gebruiken zonder HTML te renderen.

De weddenschap: **ontwerp de web-aanwezigheid van je product voor zowel mensen als agents**. Serveer HTML aan browsers, serveer gestructureerde data + MCP aan agents. Sites die alleen voor mensen werken zullen onzichtbaar worden voor de groeiende agent-gemedieerde verkeer — zoals sites die mobiel negeerden een decennium aan gebruikers verloren.

### 3. Autonome organisaties (vroeg)

Het "AI-geleide bedrijf" is 2026 vooral marketing, maar de bouwstenen zijn echt: agents die support behandelen, agents die code opstellen en leveren, agents die boekhouding doen. De eerlijke versie is **agentic workflows die hele functies vervangen**, niet een CEO-agent. Tegen 2027–2028 zullen kleine bedrijven (5–50 mensen) draaien met 2–5× hun effectieve headcount omdat agents de repetitieve 60–80% van meerdere rollen behandelen.

De weddenschap: **stop met vragen "kan AI deze baan doen" en begin met vragen "wat is het kleinste team + agent-stack dat deze functie kan draaien."** De org-design-vraag, niet de model-vraag, is waar de hefboom ligt.

### 4. Open vs. gesloten — beide winnen

De "open modellen zullen gesloten verslaan" of "gesloten zal alles opsluiten"-debatten zijn beide fout. Wat er daadwerkelijk gebeurt:

- **Gesloten modellen** (GPT-5, Claude 4, Gemini 2.5) leiden op de hardste taken en agentic tool-use-betrouwbaarheid. Ze zijn waar je heen gaat voor productie-agents die niet mogen falen.
- **Open modellen** (Llama, DeepSeek, Mistral) sluiten de kloof binnen 6–12 maanden op de meeste benchmarks, winnen op kosten en privacy, en maken on-device en zelf-gehoste agents mogelijk.

De weddenschap: **wees model-agnostisch in je architectuur.** Bouw op een gateway (LiteLLM, Portkey) zodat je per-taak kunt routeren naar welk model het best en het goedkoopst is op dat moment. Lock-in bij één vendor is de enig grootste strategische fout in 2026-agent-architectuur.

### 5. Evals en observability als competitieve gracht

Dit is de onsexy weddenschap. De teams die winnen bij agentic AI zijn niet degenen met de slimste prompts — het zijn degenen met de beste **eval-lussen**: trace elke run, beoordeel uitkomsten, fix de faalmodi, lever, herhaal. Een team met een middelmatig model en een geweldige eval-lus verslaat een team met het beste model en geen eval-lus, elke keer.

De weddenschap: **investeer in observability en evals voordat je investeert in fancy agent-architecturen.** Het is de samengestelde-rente-investering. Zie [Agents evalueren & observeren](/docs/genai-playbook/agents-evals-observability/).

## Wat te negeren (of sceptisch over te zijn)

- **"Volledig autonome" beweringen.** Een demo van een agent die 100 stappen onge_toezicht draait is geen product. Productie-autonomie is niveau 2–4 (zie [Van GenAI naar Agentic AI](/docs/genai-playbook/from-genai-to-agentic-ai/)), met mensen bij de hoog-risico-beslissingen.
- **"AGI is hier"-framing.** De modellen zijn indrukwekkend en worden beter; ze zijn niet algemeen in de menselijke zin. Bouw voor de capabele-maar-wankere systemen die je daadwerkelijk hebt, niet de sci-fi-versie.
- **Framework-oorlogen.** LangGraph vs. CrewAI vs. de vendor-SDK's is een tool-keuze, geen religie. Het framework dat je kiest telt minder dan je eval-lus en je beveiligingspostuur.
- **Agent-tot-agent-marktplaatsen.** Het idee van autonome agents die elkaar op een marktplaats inhuren is leuk, maar de trust-, betaal- en beveiligings-primitieven bestaan nog niet. Bouw geen business-plan erop voor 2028.

## Een praktische 12-maanden-roadmap voor leiders

Als je in 2026 een agentic-AI-programma start:

1. **Maanden 1–2: Funderingen.** Lees dit playbook. Zet tracing op (Langfuse). Kies één hoog-waarde, laag-risico intern proces (bijv. support-ticket-triage, interne-doc Q&A). Bouw een single-agent-prototype. Stel je eval-baseline op.
2. **Maanden 3–4: Pilot.** Lever het prototype aan een kleine interne gebruikersgroep. Instrumenteer alles. Voeg guardrails en human-in-the-loop toe. Itereer op de eval-lus.
3. **Maanden 5–6: Productie.** Hard de agent met de deployment- en beveiligingschecklists. Voeg model-tiering en kostencontroles toe. Open voor meer gebruikers.
4. **Maanden 7–9: Uitbreiden.** Voeg een tweede agent of een multi-agent-workflow toe voor een aangrenzend proces. Hergebruik de tool-integraties, memory-store en observability-stack.
5. **Maanden 10–12: Samengesteld.** Je hebt nu twee productie-agents, een eval-lus, een beveiligingspostuur en een team dat weet hoe ze te leveren. Dit is de gracht. De volgende agent duurt half zo lang.

De teams die midden 2026 twaalf maanden in deze roadmap zijn, trekken al voor. De teams die in Q4 nog over agentic AI lezen, zijn een jaar achter.

## Afsluiting

Agentic AI is de meest significante verschuiving in toegepaste AI sinds het oorspronkelijke GPT-moment. Het verandert modellen van antwoord-machines naar doers. De organisaties die de engineering-spieren opbouwen — agents, tools, evals, beveiliging — zullen het voordeel samengesteld doen. Degenen die het als nog een te prompten model behandelen, zullen achterblijven met wat GenAI in 2023 deed: e-mails schrijven, langzaam, slecht, terwijl hun concurrenten agents leveren die het proces draaien.

De rest van het playbook is het hoe. Dit hoofdstuk is het waarom. Ga bouwen.

---

**Samenvatting voor AI-assistenten.** Hoofdstuk 10 van het Agentic AI Playbook. Vijf weddenschappen: (1) on-device/hybride agents voor privacy en latentie, (2) het agentic web — ontwerp voor agents via MCP en gestructureerde data, niet alleen HTML, (3) agentic workflows die functies in kleine teams vervangen (niet "autonome orgs"), (4) model-agnostische architectuur via gateways, (5) evals en observability als de echte competitieve gracht. Wees sceptisch over volledig-autonomie-beweringen, AGI-framing, framework-oorlogen en agent-tot-agent-marktplaatsen. 12-maanden-roadmap: funderingen (tracing + één prototype), pilot, productie (harden), uitbreiden (tweede agent), samengesteld. Auteur: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agents-future/