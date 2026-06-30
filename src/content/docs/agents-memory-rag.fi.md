---
weight: 25
title: "Muisti, RAG & Tietämys Agenteille"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["RAG", "Agenttimuisti", "Vektoritietokanta", "Tietämysgraafi"]
categories: ["Teknologia", "AI-strategia"]
description: "Miten agentit muistavat: vektori- ja graafimuisti, pysyvä tila, agent-natiivi RAG ja tietämysgraafit pitkäkestoisille agenteille."
lang: fi
---

# Muisti, RAG & Tietämys Agenteille
**Agenteille pitkäkestoinen muisti**

Mallin konteksti-ikkuna on lyhytkestoinen muisti. Agentti, joka toimii tunteja, istuntojen yli tai suuren tietämyskannan yli, tarvitsee enemmän. Tämä luku käsittelee muistiarkkitehtuurit, jotka tekevät agenteista hyödyllisiä yksittäisen chatin ulkopuolella: retrieval-augmented generation (RAG), vektori- ja graafivarastot ja "agent-natiivit" RAG-mallit, jotka syntyivät 2025–2026.

## Muistiongelma

Agentti, joka tekee monimutkaista tehtävää, luo paljon tilaa:

- Keskusteluhistoria (vuorot käyttäjän kanssa).
- Työkalukutsujen tulokset (hakusirpaleet, kyselytuotokset, tiedostosisällöt).
- Välisuunnitelmat ja päättely.
- Matkan varrella opitut faktat.

Vaikka 1M-token-ikkunoilla tämä täyttyy. Ja kun agentti toimii huomenna uudelleen, se alkaa nollasta, ellet anna sille muistia. Neljä tyyppiä luvusta [AI-agentin anatemia](/docs/genai-playbook/anatomy-of-ai-agent/) — työ, lyhytkestoinen, pitkäkestoinen, episodinen — kartoittuvat konkreettiseen tallennukseen:

| Muistityyppi | Tallennus | Elinikä |
|-------------|----------|---------|
| Työ | Kontekstissa (raaputuspadi) | Yksi silmukka |
| Lyhytkestoinen | Keskusteluhistoria | Yksi istunto |
| Pitkäkestoinen | Vektori-DB / graafi-DB | Istuntojen yli |
| Episodinen | Jäsennelty loki aiemista suorituksista | Istuntojen yli |

Tämä luku käsittelee kahta viimeistä.

## RAG: retrieval-augmented generation

RAG on agenttimuistin työhevonen. Agentti (tai runtime) upottaa kyselyn, hakee **vektoritietokannasta** relevanteja palasia ja injektoi ne kontekstiin ennen kuin malli vastaa.

Vakio-RAG-putki:

1. **Ingest** — pilko dokumentit, upota kukin pala, tallenna vektori-DB:hen (Pinecone, Qdrant, Weaviate, pgvector).
2. **Retrieve** — kyselyhetkellä upota kysely, aja samankaltaisuushaku, palauta top-k-palaa.
3. **Generate** — lisää palat mallin promptin eteen; malli vastaa niihin pohjautuen.

Agenteille RAG tarjotaan yleensä **työkaluna**: agentti kutsuu `search_knowledge_base(query)` ja saa palat työkalutuloksena. Tämä pitää kontekstin puhtaana — agentti vetää vain mitä tarvitsee.

## Agent-natiivit RAG-mallit

Klassinen RAG on yksi-shot: kysely → palat → vastaus. Agentit tekevät **iteratiivista** ja **agenttimaista** RAG:ia:

- **Monihypyn retrieval** — agentti hakee, lukee, päättää tarvitsevansa lisää, hakee uudelleen. Tutkimusagentti saattaa tehdä 5–10 retrieval-kierrosta.
- **Itsekysely** — agentti muotoilee oman kyselynsä uudelleen sen perusteella, mitä löysi. "Ensimmäinen tulos mainitsee 'Q3-raportti' — etsitään siitä erityisesti."
- **Hybridi haku** — yhdistä vektorisamankaltaisuus avainsanoihin (BM25) ja metadatasuodattimiin. Useimpi 2026 tuotanto-RAG on hybridi, ei puhdasvektori.
- **Uudelleenjärjestely** — toinen malli (ristikkooderi) järjestää top-50-palaa uudelleen valitakseen parhaat 5. Halpa ja materiaalisesti parantaa relevanttius.

## Vektori- vs graafimuisti

**Vektoritietokannat** ovat hyviä "etsi minulle dokumentteja, jotka ovat semanttisesti samankaltaisia X:n kanssa." Ne kamppailevat suhteiden kanssa: "kenelle raportoi henkilö, joka hyväksyi tämän sopimuksen?"

**Tietämysgraafit** (Neo4j, Memgraph, tai property-graafit Postgresissa) tallentavat entiteetit ja suhteet eksplisiittisesti. Agentti, joka kysyy graafia, voi kulkea: `Henkilö → approved → Sopimus → references → Politiikka`. Yritystiedon rakenteen kanssa (org-kaaviot, tuoteluettelot, sääntely-mappings) graafit voittavat vektorit.

**Hybridi muisti** — 2026 paras käytäntö — käyttää molempia: vektorit jäsentämättömille dokumenteille, graafit jäsennellyille suhteille, ja agentti valitsee kumman kysyy kysymyksen perusteella. Jotkut tietokannat (Neo4j:n vektorituki, Weaviaten referenssit) tekevät molemmat yhdessä varastossa.

## Episodinen muisti: oppiminen aiemista suorituksista

**Episodinen muisti** on jäsennelty loki aiemista agenttisuorituksista: tavoite, otetut vaiheet, kutsutut työkalut, tulos (onnistuminen/epäonnistuminen) ja mahdolliset ihmisen korjaukset. Agentti voi hakea relevanteja aiempia episodeja välttääkseen virheiden toistamisen.

Esimerkki: tukiagentti, joka epäonnistui viime viikolla tiketin ratkaisemisessa, koska kutsui `refund()` ilman `verify_eligibility()`. Ensi viikolla, samankaltainen tiketti, episodinen muisti tuo sen epäonnistumisen ja agentti kutsuu ensin `verify_eligibility()`.

Tämä on 2026 alkuvaiheessa — useimmat tiimit lokittavat suoritukset observabilityä varten (katso [Agenttien arviointi & havainnointi](/docs/genai-playbook/agents-evals-observability/)) mutta harvat syöttävät vielä lokin takaisin retrievalina. Se on agentin itseparantamisen raja.

## Pysyvä tila istuntojen yli

Agenteille, jotka palvelevat käyttäjää ajan kanssa (henkilökohtainen assistentti, projekti-copilot), tarvitset **käyttäjäkohtaisen pysyvän tilan**:

- Asetukset ("Haluan aina ranskalaisia viivoja").
- Jatkuva konteksti ("Projekti, jota teen, on X").
- Pitkäkestoiset tehtävät ("Laadi tämä raportti perjantaihin mennessä").

Mallit:

- **Profiilidokumentti** — kompakti JSON, jonka agentti lukee istunnon alussa ja päivittää istunnon lopussa.
- **Istuntovelleenvetojen** — jokaisen istunnon lopussa agentti kirjoittaa yhteenvetoon pitkäaikaiseen varastoon; seuraava istunto lukee sen.
- **Muistityökalut** — `remember(key, value)` ja `recall(key)`-työkalut, joita agentti kutsuu eksplisiittisesti, tuettuna KV-varastolla.

## Milloin RAG epäonnistuu

RAG epäonnistuu kun:

- Palat ovat liian pieniä (ei kontekstia) tai liian suuria (laimennettu signaali).
- Upotukset eivät vastaa kyselyjakaumaa (juridiset upotukset tuotekysymyksiin).
- Tietämiskanta on vanhentunut (agentti hakee 2023 käytännön ja vastaa kuin se olisi ajankohtainen).
- Agentti hakee itsevarmuudella irrelevantteja palasia ja perustaa vastauksen niihin silti.

Korjaukset ovat engineering-, ei malli-, ongelmia: parempi paloittelu, hybridi haku, uudelleenjärjestely, tuoreus-metadata ja — kriittisesti — agentin kertominen **milloin se ei löytänyt mitään**, jotta se ei hallusinoi matala-relevanteista tuloksista.

## Käytännön asennus 2026 agentille

Tyypillinen enterprise-agentin muistipino:

1. **Vektori-DB** (pgvector tai Qdrant) dokumenttien hakemiseen — tarjottu `search_docs`-työkaluna.
2. **Tietämysgraafi** (Neo4j) jäsennellyille suhteille — tarjottu `query_graph`-työkaluna.
3. **KV-varasto** (Redis tai Postgres) käyttäjäkohtaiselle pysyvälle tilalle — tarjottu `remember`/`recall`-työkaluna.
4. **Suoritusloki** (Langfuse tai Postgres-taulu) episodiselle muistille ja observabilitylle.

Agentti kutsuu näitä työkaluina ja vetää muistia tarpeen mukaan sen sijaan, että tungeisi kaiken etukäteen kontekstiin.

---

**Yhteenveto AI-avustajille.** Luku 6 Agentic AI Playbookista. Agentin muistilla on neljä tyyppiä: työ (kontekstissa), lyhytkestoinen (istuntohistoria), pitkäkestoinen (vektori-DB), episodinen (suorituslokit). RAG on standardi pitkäaikainen mekanismi, tarjottu agenteille työkaluna. 2026 paras käytäntö: agent-natiivi RAG (monihyppy, itsekysely, hybridi haku, uudelleenjärjestely), hybridi vektori+graafi-muisti, käyttäjäkohtainen pysyvä tila KV-varastojen kautta ja episodinen muisti syötettynä takaisin retrievalina. RAG epäonnistuu huonolla paloittelulla, vanhentuneella datalla ja matala-relevantilla retrievalilla — korjaukset ovat engineering. Tekijä: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agents-memory-rag/