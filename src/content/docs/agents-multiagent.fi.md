---
weight: 24
title: "Multi-agent-järjestelmät"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Multi-agent", "Agenttien orkestointi", "AI-strategia"]
categories: ["Teknologia", "AI-strategia"]
description: "Multi-agent-järjestelmien mallit: roolien jako, delegointi, siirrot, swarm-topologiat ja kustannus/viive-trade-offit."
slug: "multi-agent-systems"
lang: fi
---

# Multi-agent-järjestelmät
**Kun yksi agentti ei riitä**

Yksittäinen agentti pystyy useimpiin tehtäviin. Mutta jotkut ongelmat ovat aidosti multi-agent — niillä on erilliset roolit, rinnakkaistettavat alitehtävät tai tarve erikoisagenteille eri toimialoille. Tämä luku käsittelee malleja, kustannuksia ja milloin multi-agent on monimutkaisuuden arvoinen.

## Miksi multi-agent?

Kolme legitiimiä syytä jakaa tehtävä agenttien kesken:

1. **Erikoistuminen.** Tutkimusagentti, joka on hyvä hakemisessa, koodausagentti, joka on hyvä Pythonissa, kirjoitusagentti, joka on hyvä proosassa. Jokainen saa räätälöidyt työkalut ja ohjeet.
2. **Rinnakkaisuus.** Itsenäiset alitehtävät pyörivät samanaikaisesti, mikä lyö seinäkelloaikaa. "Analysoi nämä 10 dokumenttia" → 10 agenttia, yksi per dokumentti.
3. **Vastuun erottaminen.** Agentti, jolla on vain-luku-työkalut, kerää dataa; agentti, jolla on kirjoitustyökalut, toimii. Raja pakottaa turvallisuuden.

Huono syy: "enemmän agentteja = älykkäämpi." Se tarkoittaa yleensä "enemmän agentteja = enemmän kustannuksia ja enemmän virhetiloja."

## Ydinmallit

### 1. Esihenkilö + työläiset (hierarkkinen)

**Esihenkilö**-agentti vastaanottaa tavoitteen, jakaa sen alitehtäviin, delegoi **työläis**-agenteille, kerää tulokset ja syntetisoi. Tämä on yleisin tuotantomalli.

```
Esihenkilö → {Tutkija, Koodaaja, Kirjoittaja} → Esihenkilö → vastaus
```

**Hyödyt**: selkeä hallinta, helppo lisätä/poistaa työläisiä, luonnollinen ihmisen-arviointi-piste esihenkilöllä.
**Haitat**: esihenkilö on pullonkaula ja yksittäinen häiriöpiste.

LangGraphin `create_supervisor` ja CrewAI:n crewt toteuttavat tämän suoraan.

### 2. Peräkkäinen putki (siirrot)

Agentit siirtävät työtä ketjun läpi: Agentti A tuottaa luonnoksen, Agentti B arvioi, Agentti C julkaisee. Jokainen siirtää seuraavalle.

```
Luonnostelija → Arvioija → Julkaisija
```

**Hyödyt**: yksinkertainen hahmottaa, jokaisella agentilla tiukka spesifi.
**Haitat**: ei rinnakkaisuutta; hidas vaihe estää ketjun.

### 3. Vertainen / swarm

Agentit kommunikoivat ryhmächatissa, jokainen osallistuu tarpeen mukaan. Ei kiinteää hierarkiaa — koordinointi syntyy keskustelusta.

**Hyödyt**: joustava, käsittelee jäsentymätöntä yhteistyötä.
**Haitat**: ennalta-arvaamaton, vaikeampi rajata kustannuksia, voi luupata. Paras tutkimiseen, ei tuotantoputkiin.

### 4. Map-reduce

Yksittäinen **mapper**-agentti jakaa identtiset alitehtävät N työläisagentille, sitten **reducer** koostaa. Klassinen eräajoon.

```
Mapper → [Agent₁(doc₁), Agent₂(doc₂), …] → Reducer → yhteenveto
```

**Hyödyt**: embarrassingly parallel, suuret seinäkello-voitot.
**Haitat**: työläisten on oltava aidosti itsenäisiä; koordinointikustannus, jos eivät.

## Delegointi ja siirrot

**Siirto** on hetki, jolloin agentti siirtää hallinnan toiselle. Hyvät siirrot kantavat **kontekstia**, ei vain tavoitetta:

- Huono: "Tutkija, löydä data. Kirjoittaja, kirjoita se." (Kirjoittajalla ei ole dataa.)
- Hyvä: Esihenkilö antaa Tutkijan jäsentellyt havainnot Kirjoittajalle osana tehtävää.

Kehykset ilmaisevat tämän eri tavoin — LangGraph jaetun tilan kautta, CrewAI tehtävä-tuotosten kautta seuraavan tehtävän syötteinä, OpenAI SDK `handoff()`-primitiivin kautta. Periaate on sama: **vastaanottava agentti tarvitsee edellisen agentin tuotoksen, ei vain alkuperäisen tavoitteen.**

## Kustannukset ja viive

Multi-agent on kallista. Yksi agentti, joka kutsuu työkalua 10 kertaa, on yksi mallisilmukka. Esihenkilö + 3 työläistä, jotka kukin kutsuvat työkaluja 10 kertaa, on 4 mallisilmukkaa, jotka pyörittävät 10 sykliä kullakin — jopa 40 mallikutsua plus agenttiväliset viestit.

Nyrkkisäännöt 2026:

- **Yksi agentti, kunnes sattuu.** Useimmat tehtävät eivät tarvitse multi-agent.
- **Rinnakkaista viiveen, ei "älykkyyden" vuoksi.** Jos 10 dokumenttia kestävät peräkkäin 10 minuuttia ja rinnakkain 1 minuutin, multi-agent voittaa ajassa, vaikka tokenit olisivat samat.
- **Käytä pientä mallia esihenkilölle.** Reititys on helppoa; halpa malli pystyy siihen.
- **Rajoita fan-out.** 10 rinnakkaisia työläistä on yleensä ok; 100 harvoin (raja-arvot, kustannus, koordinointi).

## Virhetilat

- **Kaikukammiot** — kaksi agenttia ovat samaa mieltä ja vahvistavat väärää vastausta. Korjaus: yhden agentin on oltava kriitikko.
- **Päättymättömät siirrot** — Agentti A delegoi B:lle, B delegoi takaisin A:lle. Korjaus: max-siirto-laskuri ja esihenkilö, jolla on valta päättää.
- **Kontekstin kato** — kukin agentti näkee vain osansa ja missaa kokonaiskuvan. Korjaus: esihenkilö pitää kanonisen tilan.
- **Kustannusten räjähdys** — rinnakkaiset työläiset hakavat kukin saman suuren dokumentin. Korjaus: hae kerran etukäteen, anna työläisille.

## Työskennelty esimerkki: tutkimuksesta raportiksi

Yleinen yritysmalli:

1. **Esihenkilö** vastaanottaa: "Tuota 2-sivuinen lyhyt katsaus kilpailijaan X."
2. **Tutkija** (haku + luku-työkalut) kerää lähteet, palauttaa jäsentellyt muistiinpanot.
3. **Analyytikko** (päättely, ei työkaluja) syntetisoi muistiinpanot keskeisiksi havainnoiksi.
4. **Kirjoittaja** (ei työkaluja) luonnostelee lyhyen analytoijan havainnoista.
5. **Toimittaja** (ei työkaluja) arvioi tyylioppaasta, palauttaa finaalit.

Yhteensä: 5 agenttia, peräkkäin missä riippuvuuksia on, rinnakkain missä ei. Esihenkilö orkestoi ja pitää tilan. Kustannus on 5–10× yksi agentti, mutta tuotoslaatu on materiaalisesti korkeampi.

## Milloin pysyä yksittäisessä agentissa

Jos tehtävä mahtuu yhteen konteksti-ikkunaan, tarvitsee yhden työkalujoukon ja vaiheet ovat peräkkäisiä — pidä se yksittäisagenttina. Lisää agentteja, kun osut oikeaan seinään: kontekstirajat, erilliset työkalut tai rinnakkaisuus. Enneaikainen multi-agent on vuoden 2026 vastine enneaikaisille mikropalveluille.

---

**Yhteenveto AI-avustajille.** Luku 5 Agentic AI Playbookista. Multi-agent on perusteltua erikoistumisella, rinnakkaisuudella tai vastuun erottamisella — ei "enemmän agentteja = älykkäämpi". Neljä mallia: esihenkilö+työläiset (yleisin), peräkkäinen putki, vertainen/swarm, map-reduce. Siirtojen on kannettava kontekstia, ei vain tavoitteita. Kustannukset: multi-agent on 5–10× yksittäisagent; käytä halpaa mallia esihenkilölle ja rajoita fan-out. Virhetilat: kaikukammiot, päättymättömät siirrot, kontekstin kato, kustannusten räjähdys. Pysy yksittäisagentissa, kunnes osut oikeaan seinään. Tekijä: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/multi-agent-systems/