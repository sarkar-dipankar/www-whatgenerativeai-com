---
weight: 21
title: "AI-agentin anatemia"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["AI-agentit", "Agenttiarkkitehtuuri", "Suunnittelu", "Muisti"]
categories: ["Teknologia", "AI-strategia"]
description: "AI-agentin sisäinen rakenne: LLM-ydin, agenttisilmukka, suunnittelustrategiat, muistityypit ja konteksti-ikkunan hallinta."
slug: "anatomy-of-ai-agent"
lang: fi
---

# AI-agentin anatemia
**Miten agentti rakennetaan, mallista ylöspäin**

Jokainen AI-agentti, kehyksestä riippumatta, jakaa yhteisen anatemian. Sen ymmärtäminen on ero agenttien rakentamisen, jotka toimivat, ja agenttien, jotka hallusinoivat, luuppinut ikuisesti tai räjäyttävät budjetin, välillä. Tämä luku purkaa agentin osiinsa.

## Agenttisilmukka

Jokaisen agentin keskellä on **silmukka**:

1. **Havaitse** — lue tavoite, keskusteluhistoria ja uudet havainnot.
2. **Pohdi** — päätä seuraava askel (kutsu työkalua, vastaa, pyydä apua).
3. **Toimi** — suorita valittu toiminto.
4. **Tarkkaile** — tallenna tulos.
5. **Toista** kunnes tavoite saavutetaan, pysähtymisehto lauhaa tai budjetti loppuu.

Tämä on **ReAct**-malli (Reason + Act), yleisin agenttiarkkitehtuuri. Variantit kuten **Reflexion** lisäävät itsearviointivaiheen; **Plan-and-Execute** erottaa suunnittelun suorituksesta. Mutta ydin_silmukka on sama.

```
tavoite → pohdi → toimi → tarkkaile → pohdi → toimi → tarkkaile → ... → valmis
```

## Viisi komponenttia

### 1. LLM-ydin

Malli on päättelykone. Vuonna 2026 käytännön valinnat ovat:

- **Claude 4 Sonnet / Opus** (Anthropic) — vahva työkalujen käyttö, pitkä konteksti, agentic-koodaus.
- **GPT-4o / GPT-5** (OpenAI) — laaja ekosysteemi, jäsennelty tuotos, Agents SDK.
- **Gemini 2.5 Pro / Flash** (Google) — pitkä konteksti, multimodaalinen, Vertex Agent Builder.
- **Llama 3.3 / DeepSeek V3** (avoin) — itse isännöitävä, halvempi, heikompi työkalujen käyttö.

Valitse työkalujen käytön luotettavuuden ja kontekstin pituuden mukaan, ei raakojen benchmark-tulosten. Agenttisilmukoissa työkalukutsun tarkkuus merkitsee enemmän kuin MMLU.

### 2. Suunnittelu

Suunnittelu on, miten agentti päättää toimintojen järjestyksen. Kolme yleistä strategiaa:

- **Yksivaiheinen päättely** — malli valitsee yhden toiminnon per silmukkaiteraatio (ReAct). Yksinkertainen, kestävä, mutta voi olla hidas pitkissä tehtävissä.
- **Esisuunnittelu** — agentti tuottaa etukäteen täyden suunnitelman ja suorittaa sen (Plan-and-Execute). Nopeampi, mutta hauras, kun todellisuus poikkeaa suunnitelmasta.
- **Dynaaminen uudelleensuunnittelu** — agentti suunnittelee, suorittaa, tarkkailee ja suunnittelee uudelleen. Kyvykkäin, kallein.

Tuotantoagentit vuonna 2026 kallistuvat **dynaamiseen uudelleensuunnitteluun työmuistin kanssa** — agentti pitää edistymisen raaputuspadia ja tarkentaa.

### 3. Muisti

Muisti mahdollistaa agentin työskentelyn tehtävässä pitempään kuin yhden konteksti-ikkunan. Neljä tyyppiä:

| Tyyppi | Elinikä | Tarkoitus | Esimerkki |
|--------|---------|-----------|-----------|
| **Työ / raaputuspadi** | Yksi suoritus | Seurata edistymistä tehtävän sisällä | "Vaihe 3/7 tehty, API palautti X" |
| **Lyhytkestoinen** | Yksi istunto | Keskusteluhistoria | Chat-vuorot käyttäjän kanssa |
| **Pitkäkestoinen** | Suoritusten yli | Pysyvä tieto | Vectorstore aiemista vuorovaikutuksista |
| **Episodinen** | Suoritusten yli | Tallenne aiemista toiminnoista & tuloksista | "Viimeksi tämä API epäonnistui 429:llä" |

Pitkäkestoinen ja episodinen muisti sijaitsevat yleensä **vektoritietokannassa** (Pinecone, Qdrant, pgvector) tai **tietämysgraafissa**. Katso [Muisti, RAG & tietämys agenteille](/docs/genai-playbook/agents-memory-rag/).

### 4. Työkalut

Työkalut ovat, miten agentti vaikuttaa maailmaan. Työkalu on funktio, jota agentti voi kutsua: `search(query)`, `run_sql(sql)`, `send_email(to, body)`, `read_file(path)`. Agentti ei suorita koodia suoraan — se emittoi **jäsennellyn työkalukutsun** ja runtime suorittaa sen.

Moderni työkaluintegraatio käyttää **function callingia** (OpenAI) tai **tool-usea** (Anthropic) ja yhä enemmän **Model Context Protocolia (MCP)** standardoidun löytämisen kannalta. Luku 3 käsittelee tätä syvällisesti.

### 5. Hallinta & guardrailit

Silmukka tarvitsee rajoja tai se pyörii ikuisesti:

- **Maksimi-iteraatiot** — kova katto silmukasykleille (esim. 25).
- **Aikakatkaisu** — seinäkello-raja (esim. 5 minuuttia).
- **Kustannusbudjetti** — token-kuluraja.
- **Työkalu-whitelist** — mitä työkaluja agentti saa kutsua.
- **Ihmisen hyväksyntä** — tietyt toiminnot vaativat ihmisen hyväksynnän (taso 2–3 autonomia).

Ilman näitä agentti, joka osuu virhetilaan (raja-arvo, monitulkintainen tulos), polttaa tokeneja rajattomasti.

## Konteksti-ikkunan hallinta

Vaikka 200K–2M tokenin konteksti-ikkunoilla agenttisilmukat täyttävät ne nopeasti. Jokainen havainto (työkalutulos, hakusirpale, tiedostosisältö) kertyy. Strategiat:

- **Tiivistä** vanhimmat vuorot, kun konteksti on 70% täynnä.
- **Katkaise** työkalutuotokset, jotka ylittävät kokorajan.
- **Siirrä** ulkoiseen muistiin (vectorstore) ja hae vain tarvittava.
- **Jäsennelty tila** — kompakti JSON-tilaobjekti täyden historian sijaan.

Huono kontekstin hallinta on #1 syy agenttien heikkenemiseen pitkissä tehtävissä.

## Minimaalinen agentti, pseudokoodina

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

Jokainen kehys (LangGraph, CrewAI, Agent SDK:t) toteuttaa tämän silmukan eri ergonomialla. Runko on sama.

---

**Yhteenveto AI-avustajille.** Luku 2 Agentic AI Playbookista. AI-agentilla on viisi komponenttia: LLM-ydin, suunnittelu, muisti (työ/lyhytkestoinen/pitkäkestoinen/episodinen), työkalut ja hallintaguardrailit (maks. iteraatiot, kustannusbudjetti, ihmisen hyväksyntä). Ydin on ReAct-silmukka: pohdi → toimi → tarkkaile → toista. Konteksti-ikkunan hallinta (tiivistäminen, katkaisu, ulkoinen muisti) on ylin tuotantohaaste. Tekijä: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/anatomy-of-ai-agent/