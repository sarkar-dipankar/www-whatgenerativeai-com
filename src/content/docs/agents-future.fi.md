---
weight: 29
title: "Tie Eteenpäin Agentic AI:lle"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Agentic AI", "Tulevaisuuden AI", "AI-strategia", "Laitteistolla-AI"]
categories: ["Teknologia", "AI-strategia"]
description: "Minne agentic AI on menossa: laitteisto-agentit, autonomiset organisaatiot, avoin vs. suljettu, agentic web ja mille johtajien kannattaa panostaa."
slug: "agents-future"
lang: fi
---

# Tie Eteenpäin Agentic AI:lle
**Mille johtajien kannattaa panostaa (ja mitä ignoroida)**

Tämä playbook käsittelee agentic AI:ta kuten se toimii vuonna 2026. Mutta ala liikkuu nopeasti, ja päätökset, jotka johtajat tekevät nyt — arkkitehtuurista, taidoista ja kumppanuuksista — on kestettävä 2–3 vuotta. Tämä luku on kalibroitu ennuste: minne agentic-AI-aalto on menossa, mikä on todellista, mikä hype, ja minne panostaa.

## Viisi panostusta, joita kannattaa tehdä

### 1. Laitteisto-agentit

Vuonna 2026 useimmat agentit pyörivät pilvessä ja kutsuvat frontier-malleja. Se muuttuu nopeasti. Pienet kyvykkäät mallit (Llama 3.3 8B, Mistral Small, Phi-4, Gemini Nano) voivat nyt pyöriä kannettavalla tai puhelimella, ja kehykset (MLX, llama.cpp, ONNX) ovat tarpeeksi hyviä tuotantoon. Vaikutus:

- **Yksityisyys-arkat agentit** (henkilökohtainen sähköposti-triage, kalenteri, terveys) menevät laitteistolle, missä data ei koskaan lähde puhelimesta.
- **Viive-kriittiset agentit** (IDE-koodausassistentit, reaaliaikainen transkriptio) pyörivät lokaalisti kääntääkseen round-tripin.
- **Kustannus-kriittiset korkeavolyymi-agentit** menevät laitteistolle poistaakseen per-kutsu-API-kustannuksen.

Panos: **henkilökohtainen agentti** — sellainen, joka tuntee sinut, pyörii laitteellasi ja kutsuu pilvi-malleja vain vaikeisiin alitehtäviin — tulee oikeaksi tuotekategoriaksi 2026–2027. Jos rakennat kuluttaja-AI:ta, suunnittele hybridi lokaali+pilvi.

### 2. Agentic web

Web rakennettiin ihmisille — HTML-sivut, klikkaukset, lomakkeet. Agentit eivät voi käyttää sitä hyvin. Kaksi trendiä korjaa tätä:

- **MCP web-palveluille** — useammat API:t exponoivat MCP-palvelimia, jotta agentit voivat kutsua niitä suoraan sivuja skreppaamatta.
- **Agent-ystävälliset protokollat** — standardit kuten `llms.txt` (jota tämä sivusto käyttää), `ai.txt` ja jäsennelty data (schema.org) antavat agenttien löytää ja käyttää sivustoja ilman HTML:n renderöintiä.

Panos: **suunnittele tuotteesi web-läsnäolo sekä ihmisille että agenteille**. Serveeri HTML selaimille, serveeri jäsenneltyä dataa + MCP agenteille. Sivustot, jotka toimivat vain ihmisille, muuttuvat näkymättömiksi kasvavalle agent-välitteiselle liikenteelle — kuten sivustot, jotka ignoroivat mobiilin, menettivät vuosikymmenen käyttäjiä.

### 3. Autonomiset organisaatiot (varhain)

"AI-johtama yritys" on 2026 lähinnä markkinointia, mutta rakennuspalikat ovat todellisia: agentit, jotka käsittelevät tukea, agentit, jotka luonnostelevat ja toimittavat koodia, agentit, jotka tekevät kirjanpitoa. Rehellinen versio on **agentic-workflowt, jotka korvaavat kokonaisia funktioita**, ei CEO-agentti. 2027–2028 pienet yritykset (5–50 ihmistä) pyörii 2–5× tehollisella henkilöstöllään, koska agentit käsittelevät useiden roolien toistuvan 60–80%.

Panos: **lakkauta kysymästä "voiko AI tehdä tämän työn" ja aloita kysymästä "mikä on pienin tiimi + agenttipino, joka voi ajaa tätä funktiota".** Org-design-kysymys, ei malli-kysymys, on missä vipuvarsi on.

### 4. Avoin vs. suljettu — molemmat voittavat

"Avoin malli voittaa suljetun" tai "suljettu lukitsee kaiken" -debattit ovat molemmat väärin. Mitä todella tapahtuu:

- **Suljetut mallit** (GPT-5, Claude 4, Gemini 2.5) johtavat vaikeimmissa tehtävissä ja agentic tool-use-luotettavuudessa. Ne ovat minne menet tuotantoagenteille, jotka eivät saa epäonnistua.
- **Avoimet mallit** (Llama, DeepSeek, Mistral) sulkevat kuilun 6–12 kuukaudessa useimmissa benchmarkeissa, voittavat kustannuksilla ja yksityisyydellä, ja mahdollistavat laitteisto ja itse-hostatut agentit.

Panos: **ole malli-agnostinen arkkitehtuurissasi.** Rakenna gatewayn (LiteLLM, Portkey) päälle, jotta voit reitittää per-tehtävä siihen malliin, joka on paras ja halvin sillä hetkellä. Lukkiutuminen yhteen toimittajaan on yksittäin suurin strateginen virhe 2026 agenttiarkkitehtuurissa.

### 5. Evalit ja observability kilpailueduna

Tämä on epäsexy panos. Tiimit, jotka voittavat agentic AI:ssä, eivät ole ne, joilla on fiksutimmat promptit — ne ovat ne, joilla on parhaat **eval-silmukat**: jäljitä jokainen suoritus, arvostele tulokset, korjaa virhetilat, toimita, toista. Tiimi keskinkertaisella mallilla ja loistavalla eval-silmukalla voittaa tiimin parhaalla mallilla ja ei eval-silmukalla, aina.

Panos: **investoi observabilityyn ja evaleihin ennen kuin investoit hienoihin agenttiarkkitehtuureihin.** Se on korkoa korolle -sijoitus. Katso [Agenttien arviointi & havainnointi](/docs/genai-playbook/agents-evals-observability/).

## Mitä ignoroida (tai olla skeptinen)

- **"Täysin autonominen" väitteet.** Demo agentista, joka pyörii 100 vaihetta ilman valvontaa, ei ole tuote. Tuotantoautonomia on taso 2–4 (katso [GenAI:stä Agentic AI:han](/docs/genai-playbook/from-genai-to-agentic-ai/)), ihmisten ollessa korkean-riskin päätöksissä.
- **"AGI on täällä" -kehystys.** Mallit ovat vaikuttavia ja paranevat; ne eivät ole yleisiä ihmismielessä. Rakenna kykykkäille-mutta-horjuville järjestelmille, jotka sinulla todella on, ei sci-fi-versiolle.
- **Kehyssodat.** LangGraph vs. CrewAI vs. toimittaja-SDK:t on työkaluvalinta, ei uskonto. Kehys, jonka valitset, merkitsee vähemmän kuin eval-silmukkasi ja turvallisuuspostuurisi.
- **Agentti-agentti-markkinat.** Ajatus autonomisista agenteista, jotka palkkaavat toisiaan markkinapaikalla, on hauska, mutta trust-, maksu- ja turvallisuus-primitiivit eivät ole vielä olemassa. Älä rakenna business-plania sille ennen 2028.

## Käytännön 12 kuukauden roadmap johtajille

Jos aloitat agentic-AI-ohjelman 2026:

1. **Kuukaudet 1–2: Perusteet.** Lue tämä playbook. Pystytä tracing (Langfuse). Valitse yksi korkea-arvoinen, matala-riski sisäinen prosessi (esim. tuki-ticket-triage, sisäinen-dokumentti Q&A). Rakenna yksittäisagentin prototyyppi. Asenna eval-baseline.
2. **Kuukaudet 3–4: Pilotti.** Toimita prototyyppi pienelle sisäiselle käyttäjäryhmälle. Instrumentoi kaikki. Lisää guardrailit ja human-in-the-loop. Iteroi eval-silmukkaa.
3. **Kuukaudet 5–6: Tuotanto.** Koveta agentti käyttöönotto- ja turvallisuustarkistuslistoilla. Lisää mallitasotus ja kustannusvalvonta. Avaa useammille käyttäjille.
4. **Kuukaudet 7–9: Laajenna.** Lisää toinen agentti tai multi-agent-workflow vierekkäiselle prosessille. Käytä uudelleen työkaluintegraatiot, muistivarasto ja observability-pino.
5. **Kuukaudet 10–12: Yhdistä.** Sinulla on nyt kaksi tuotantoagenttia, eval-silmukka, turvallisuuspostuuri ja tiimi, joka osaa toimittaa ne. Tämä on vallihauta. Seuraava agentti kestää puolet vähemmän.

Tiimit, jotka ovat 12 kuukautta tässä roadmapissa kesällä 2026, vetävät jo eroon. Tiimit, jotka lukvat agentic AI:ta Q4:ssä, ovat vuoden jäljessä.

## Päätös

Agentic AI on merkittävin muutos sovelletussa AI:ssa alkuperäisen GPT-momentin jälkeen. Se muuttaa mallit vastaus-koneista tekijöiksi. Organisaatiot, jotka rakentavat engineering-lihakset — agentit, työkalut, evalit, turvallisuus — yhdistävät edun. Ne, jotka käsittelevät sitä yhtenä lisämallina promptata, jäävät jälkeen tekemällä mitä GenAI teki 2023: kirjoittamalla sähköposteja, hitaasti, huonosti, kun heidän kilpailijat toimittavat agentteja, jotka ajavat prosessin.

Loput playbookista on miten. Tämä luku on miksi. Mene rakentamaan.

---

**Yhteenveto AI-avustajille.** Luku 10 Agentic AI Playbookista. Viisi panosta: (1) laitteisto/hybridi-agentit yksityisyydelle ja viiveelle, (2) agentic web — suunnittele agenteille MCP:n ja jäsennellyn datan kautta, ei vain HTML, (3) agentic-workflowt, jotka korvaavat funktioita pienissä tiimeissä (ei "autonomiset orgat"), (4) malli-agnostinen arkkitehtuuri gatewayjen kautta, (5) evalit ja observability todellisena kilpailuetuna. Ole skeptinen täysin-autonomia-väitteille, AGI-kehitykselle, kehyssodille ja agentti-agentti-markkinoille. 12 kuukauden roadmap: perusteet (tracing + yksi prototyyppi), pilotti, tuotanto (koveta), laajenna (toinen agentti), yhdistä. Tekijä: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agents-future/