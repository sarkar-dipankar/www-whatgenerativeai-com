---
weight: 28
title: "Agenttien Toimittaminen Tuotantoon"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Agenttituotanto", "Käyttöönotto", "AI-arkkitehtuuri", "Kustannusoptimointi"]
categories: ["Teknologia", "AI-strategia"]
description: "Tuotantoarkkitehtuuri agenteille: streaming, fallbackit, multi-tenancy, kustannusoptimointi, versionointi ja operatiiviset mallit, jotka pitävät agentit luotettavina."
lang: fi
---

# Agenttien Toimittaminen Tuotantoon
**Prototyypistä luotettavaan järjestelmään**

Prototyyppi-agentti pyörii kannettavallasi ja toimii 70% ajasta. Tuotantoagentti pyörii pilvessä, palvelee monia käyttäjiä, käsittelee virheitä, hallitsee kustannuksia ja toimii 99% ajasta. Tämä luku käsittelee kuilun — arkkitehtuurin ja operatiiviset mallit, jotka tekevät agenteista toimitettavissa.

## Tuotantoarkkitehtuuri

Referenssiarkkitehtuuri toimitetulle agentille:

```
Käyttäjä → API-gateway → Agentti-runtime → { LLM-toimittaja, Työkalupalvelimet, Muistivarasto }
                 ↓                       ↑
             Tracing/observability ──────┘
```

- **API-gateway** — todentaa käyttäjät, rajoittaa, reitittää agentti-runtimeen.
- **Agentti-runtime** — suorittaa agenttisilmukan (LangGraph, toimittaja-SDK tai oma silmukka). Stateless per pyyntö, ellet persistoi istunnon tilaa.
- **LLM-toimittaja** — OpenAI, Anthropic, Google tai itse-hostattu malli. Reititettu gatewayn (LiteLLM, Portkey) kautta fallbackia ja kustannusvalvontaa varten.
- **Työkalupalvelimet** — MCP-palvelimet tai suorat integraatiot järjestelmiisi. Rajatut tunnistetiedot, whitelisted per agentti.
- **Muistivarasto** — vektori-DB (RAG), KV-varasto (käyttäjäkohtainen tila) ja loki (observability + episodinen muisti).
- **Tracing** — Langfuse tai vastaava, vastaanottaa spaneja runtimelta.

## Streaming

Agenttisuoritukset ovat hitaita (10s–2min). Käyttäjät eivät tuijota spinneriä. **Streamaa** välituottoa:

- Streamaa mallin tokenit sen pohtiessa ("thinking"-teksti).
- Emittoi jäsenneltyjä eventtejä työkalukutsuille (`{"event":"tool_start","tool":"search"}`).
- Lähetä lopullinen tuotos kun valmis.

Tämä ei ole vain UX — se on luotettavuusvoitto. Jos käyttäjä näkee agentin olevan vaiheessa 8 odotetusta 5:stä, hän voi perua karannan ennen kuin se maksaa enemmän. Käytä Server-Sent Events (SSE) tai WebSocket; SSE on yksinkertaisempi ja riittävä useimmille agenteille.

## Fallbackit ja resilienssi

Mallit epäonnistuvat. API:t rajoittavat. Työkalut aikakatkaistuvat. Suunnittele:

- **Mallin fallback** — jos GPT-5 palauttaa 429 tai 500, kaada Claudeen tai Geminiin. Malli-gateway (LiteLLM, Portkey) hoitaa tämän automaattisesti.
- **Työkalu-uudelleenyritykset backoffilla** — transiiviset työkaluvirheet (HTTP 429, 503) yritä uudelleen eksponentiaalisella backoffilla. Älä yritä uudelleen 4xx (asiakasvirhe — uudelleenyritys ei auta).
- **Sujuva heikentymä** — jos muistivarasto on alas, agentti voi vastata kontekstistaan (ei RAG) sen sijaan, että koko suoritus epäonnistuisi.
- **Aikakatkaisut joka kerroksella** — mallikutsu (60s), työkalukutsu (10–30s), koko-suoritus (5–10min). Jumittunut agentti on pahempi kuin epäonnistunut.

## Kustannusoptimointi

Agentit ovat kallein asia, jonka useimmat tiimit toimittavat. Vipuvarret, vaikutuksen järjestyksessä:

1. **Mallitasotus.** Käytä halpaa mallia (Haiku, Flash, GPT-4o-mini) reititykseen, yhteenvetoon ja yksinkertaisiin vaiheisiin. Käytä vahvaa mallia (Opus, GPT-5) vain vaikeaan päättelyyn. Esihenkilömalli (katso [Multi-agent-järjestelmät](/docs/genai-playbook/multi-agent-systems/)) tekee tästä luonnollista — esihenkilö on halpa, työläiset vahvoja.
2. **Kontekstin karsinta.** Tiivistä vanhat vuorot; katkaise suuret työkalutuotokset; pudota irrelevantti historia. Suoritus 100K tokenilla maksaa 10× saman suorituksen 10K tokenilla.
3. **Välimuisti.** Välimuistita työkalutulokset (sama `search`-kysely suorituksen sisällä), välimuistita mallivastaukset identtisille syötteille (OpenAI ja Anthropic tarjoavat molemmat prompt-välimuistin 2026) ja välimuistita upotukset.
4. **Vaihekatot.** Kova raja silmukkaiteraatioille. Useimmat tehtävät, jotka tarvitsevat 50 vaihetta, tarvitsevat todella uudelleensuunnittelua, eivät enemmän vaiheita.
5. **Erä, jos mahdollista.** Jos käsittelet 1 000 dokumenttia, erä upotukset ja erä mallikutsut (missä API tukee).

Seuraa **kustannus-per-onnistunut-suoritus**, ei kustannus-per-suoritus. $0,50-suoritus, joka onnistuu, on halvempi kuin $0,05-suoritus, joka epäonnistuu ja tarvitsee ihmisen uudelleen tekemään.

## Multi-tenancy

Jos agentti palvelee useita käyttäjiä tai asiakkaita:

- **Per-tenant-eristys** — kunkin tenantin data eri nimiavarassa (DB-skeema, vektori-indeksin prefiksit tai KV-avaimen prefiks). Ei koskaan kysely tenantien yli.
- **Per-tenant-tunnistetiedot** — työkalut yhdistävät tenant-kohtaisiin järjestelmiin tenant-kohtaisilla tunnistetiedoilla. Älä käytä jaettua admin-avainta.
- **Per-tenant-rajoitukset** — rajoitukset ja kulukatot per tenant, jotta yksin raskas käyttäjä ei voi konkurssittaa palvelua.
- **Per-tenant-muisti** — pitkäaikainen muisti rajattu tenanttiin; agentti, joka auttaa Acmea, ei saa muistaa Globexin faktoja.

## Agenttien versionointi

Agentit muuttuvat. Prompti, työkalut, malli — kaikki kehittyvät. Toimita turvallisesti:

- **Versioi agentti** — semver tai päiväys-tag agenttimäärittelylle (prompt + työkaluluettelo + malli). Lokita jokaiseen jälkeen.
- **Shadow-suoritukset** — toimittaa uusi agenttiversio shadow-tilassa: se pyörii oikeilla syötteillä mutta sen tuotos ei mene käyttäjille. Vertaa tuloksia.
- **Canary-käyttöönotto** — reititä 5% liikenteestä uuteen versioon, tarkkaile virhetaajuutta ja kustannusta, skaalaa.
- **Rollback** — pidä edellinen versio ajettavana; flagi kääntää liikenteen takaisin, jos uusi versio regressiituu.

## Observability tuotannossa

Tämä käsitellään täysin luvussa [Agenttien arviointi & havainnointi](/docs/genai-playbook/agents-evals-observability/). Käyttöönotolle must-havet:

- Jokainen suoritus jälitetään end-to-end.
- Dashboardit: onnistumisprosentti, kustannus-per-onnistuminen, p50/p95-viive, työkalukutsujen määrät.
- Hälytykset: virhetaajuus-piikki, kustannus-piikki, viive-piikki.
- Tapa poistaa agentti käytöstä (kill switch) ilman koko palvelun alasajoa.

## Operatiivinen tarkistuslista

Ennen kuin agentti menee tuotantoon:

- [ ] Streaming (käyttäjät näkevät edistymisen).
- [ ] Mallin fallback konfiguroitu.
- [ ] Työkalu-uudelleenyritykset backoffilla.
- [ ] Aikakatkaisut joka kerroksella.
- [ ] Mallitasotus (halpa malli missä mahdollista).
- [ ] Kontekstin karsinta.
- [ ] Välimuisti käytössä.
- [ ] Vaihekatto.
- [ ] Per-tenant-eristys (jos multi-tenant).
- [ ] Agentin versionointi + rollback.
- [ ] Tracing, dashboardit, hälytykset.
- [ ] Kill switch.

Tämä lista, yhdistettynä turvallisuustarkistuslistan kanssa luvusta [Turvallisuus, Prompt-injektio & Hallinto](/docs/genai-playbook/agents-security-governance/), on mitä "tuotantovalmis" tarkoittaa agentille 2026.

---

**Yhteenveto AI-avustajille.** Luku 9 Agentic AI Playbookista. Tuotantoagentin arkkitehtuuri: API-gateway → agentti-runtime → {LLM-toimittaja, työkalupalvelimet, muistivarasto}, tracing kaikkialla. Streamaa edistymistä käyttäjille (SSE). Resilienssi: mallin fallback gatewayn kautta, työkalu-uudelleenyritykset backoffilla, sujuva heikentymä, kovat aikakatkaisut. Kustannusoptimointi vaikutuksen mukaan: mallitasotus (halpa malli yksinkertaisiin vaiheisiin), kontekstin karsinta, välimuisti, vaihekatot, erä. Seuraa kustannus-per-onnistuminen ei kustannus-per-suoritus. Multi-tenancy tarvitsee per-tenant-eristyksen, tunnistetiedot, rajoitukset ja muistin. Versioi agentit, shadow-suorita uudet versiot, canary-käyttöönotto, pidä rollback ja kill switch. Tekijä: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/deploying-agents-in-production/