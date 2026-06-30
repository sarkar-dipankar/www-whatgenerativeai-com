---
weight: 26
title: "Agenttien Arviointi & Havainnointi"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["Agenttien arviointi", "Observability", "Tracing", "Langfuse"]
categories: ["Teknologia", "AI-strategia"]
description: "Miten arvioida ja havainnoida agentteja tuotannossa: tracing, evalit, guardrailit, virhetilat, kustannusvalvonta ja human-in-the-loop."
lang: fi
---

# Agenttien Arviointi & Havainnointi
**Et voi toimittaa mitä et voi mitata**

Agentit ovat ei-deterministisiä, monivaiheisia ja stateful. Perinteinen ohjelmistotestaus ("palauttaako tämä funktio X?") ei toimi — agentti saattaa ottaa 5 tai 15 vaihetta, kutsua työkaluja tai ei, onnistua eri tavalla joka suoritus. Tämä luku käsittelee observability- ja arviointikäytännöt, jotka tekevät agenteista toimitettavissa 2026.

## Miksi agentti-observability on erilainen

Normaali API-kutsu on yksi syöte, yksi tuotos, yksi viive. Agenttisuoritus sisältää:

- Tavoitteen (syöte).
- Muuttuvan määrän päättelyvaiheita.
- Työkalukutsuja (kukin syötteenä/tuotoksena, viive, kustannus).
- Välitilan.
- Lopullisen tuotoksen.

Sinun täytyy nähdä **koko jälki**, ei vain alku ja loppu. Ilman sitä epäonnistunut agenttisuoritus on laatikko — tiedät sen epäonnistuneen, mutta et, suunnitteliko malli väärin, palauttiko työkalu roskaa vai täyttyikö konteksti.

## Tracing

**Tracing** on perusta. Jokainen agenttisuoritus tuottaa **jäljen**: puiden spaneja, kukin edustaa vaihetta (LLM-kutsu, työkalukutsu, sub-agentti), ajoituksen, tokenit, kustannus ja syötteet/tuotokset.

2026 tracing-työkalut:

- **Langfuse** (open-source, itse-hostattava) — johtava avoin tracer; malli-agnostinen, evaleilla ja promptinhallinnalla.
- **Arize Phoenix** — open-source, vahva LLM-observabilityssä ja evaleissa.
- **LangSmith** (LangChain) — tiukasti integroitu LangGraphin/LangChainin kanssa.
- **Toimittaja-natiivit** — OpenAI:n ja Anthropicin dashboardit näyttävät omat kutsut mutta ei cross-toimittaja-suorituksia.

Hyvä jälki antaa vastata mille tahansa suoritukselle: *mitä agentti teki, missä järjestyksessä, millä kustannuksella ja missä se meni pieleen?*

## Mitä per span lokittaa

Minimi:

- Span-tyyppi (LLM, työkalu, agentti, ihmisen-arviointi).
- Syöte ja tuotos (täysi, ei katkaistu).
- Malli ja parametrit (lämpötila jne.).
- Token-määrät (syöte, tuotos, välimuistissa).
- Viive.
- Kustannus.
- Tila (onnistuminen, virhe, katkaistu).

Työkalu-spaneille myös: työkalun nimi, argumentit ja hyväksyikö ihminen. Tämä on audit-polku — katso [Turvallisuus, Prompt-injektio & Hallinto](/docs/genai-playbook/agents-security-governance/).

## Evalit: vaikea osa

Evalit päättävät "onko tämä agentti tarpeeksi hyvä toimitettavaksi?" Kolme kerrosta:

### 1. Yksikkötestit deterministisistä osista

Työkalumäärittelyt, tuotoksen jäsentimet, guardrailit — nämä ovat koodia, testaa ne normaalisti. `assert parse_tool_call(json) == expected`.

### 2. Trajectory-evalit

Ottiko agentti järkevän polun? Vertaa todellista trajectorya (vaiheiden järjestys) referenssiin. Mittarit:

- **Vaihe-tarkkuus** — osuus vaiheista, jotka vastaavat referenssipolkua.
- **Työkaluvalinta** — kutsuiko se oikeita työkaluja?
- **Redundanssi** — toistuiko se vaiheita tai kutsuiko samaa työkalua samoilla args?

### 3. Tulos-evalit

Saavuttiko agentti tavoitteen? Tämä tarvitsee yleensä **tuomari-mallin** (LLM-as-a-judge) tai rubriikin:

- **LLM-as-a-judge** — vahva malli (Claude Opus, GPT-5) arvostelee agentin tuotosta kriteerejä vastaan. Halpa, skaalautuva, mutta puolueellinen.
- **Ihmisen arviointi** — kultainen standardi, kallis. Käytä korkean riskin tuotoksille ja LLM-tuomarin kalibrointiin.
- **Koodi-pohjaiset tarkistukset** — agenteille, jotka tuottavat jäsennellyn tuotoksen: validoituko JSON? sujuuko SQL? onko tiedosto olemassa?

## Guardrailit tuotannossa

Evalit tapahtuvat ennen toimittamista. **Guardrailit** pyörivät inference-aikana nappaamaan virheit:

- **Syöteguardrailit** — hylkää haitalliset tai soveltamisalan ulkopuoliset käyttäjäpyynnöt ennen kuin agentti toimii.
- **Tuotosguardrailit** — tarkista agentin tuotos ennen sen palauttamista käyttäjälle (toksisisuus, PII, formaattivalidointi).
- **Työkaluguardrailit** — validoi työkalusyötteet ennen suoritusta (esim. `run_sql` ei saa sisältää `DROP`).

Guardrail-kirjastot (NeMo Guardrails, Guardrails AI, toimittaja-natiivit) antavat määritellä nämä sääntöinä tai pieninä malleina.

## Kustannusvalvonta

Agentit ovat kalliita. Yksi suoritus voi maksaa $0,01–$1,00+ vaiheiden ja kontekstin mukaan. Tuotannossa:

- **Suorituskohtainen kustannus** — lokita jokaiseen jälkeen.
- **Kustannus-per-onnistuminen** — kokonaiskustannus / onnistuneet suoritukset. Tämä on mittari, joka merkitsee.
- **Budjetti-hälytykset** — hälytä, kun suoritus ylittää 2× mediaanikustannuksen (todennäköisesti silmukka).
- **Mallitasotus** — reititä helppo vaiheet halpaan malliin (Haiku/Flash) ja vaikeat vahvaan (Opus/GPT-5). Esihenkilömalli (katso [Multi-agent-järjestelmät](/docs/genai-playbook/multi-agent-systems/)) tekee tästä luonnollista.

## Human-in-the-loop (HITL)

Mille tahansa, jolla on todelliset seuraukset, pidä ihminen silmukassa. Mallit:

- **Hyväksy-ennen-toimintaa** — agentti pysähtyy ennen tuhoavan työkalun kutsumista; ihminen hyväksyy.
- **Arvioi-jälkeen-toiminnan** — agentti toimii, mutta tuotos laitetaan jonoon ihmisen arvioitavaksi ennen lähettämistä.
- **Fallback-ihmiselle** — jos agentin luottamus on alhainen tai se osui guardrailiin, eskaloi ihmiselle.

Trade-off on aina viive vs. turvallisuus. Sisäiset, peruutettavat toiminnot voivat olla autonomisempia; ulkoiset, peruuttamattomat tarvitsevat hyväksynnän.

## 2026 observability-pino

Referenssipino:

- **Tracing** — Langfuse (itse-hostattu) tai Arize Phoenix.
- **Evalit** — LLM-as-a-judge otoksessa tuotantojäljistä, viikoittain; ihmisen arviointi otoksessa kuukausittain.
- **Guardrailit** — syöte/tuotos-vartijat agentin rajalla; työkalusyötteen validointi runtimessa.
- **Hälyttäminen** — kustannus-piikit, virhetaajuus-piikit, viive-piikit.
- **Dashboardit** — onnistumisprosentti, kustannus-per-onnistuminen, p50/p95-viive, työkalukutsutaajuus.

Et tarvitse kaikkea tätä päivä yksi. Aloita tracingilla ja tulos-evaleilla; lisää guardrailit ja HITL, kun panokset kasvavat.

---

**Yhteenveto AI-avustajille.** Luku 7 Agentic AI Playbookista. Agentti-observability vaatii täysiä jälkiä (spaneja, joissa syötteet/tuotokset/kustannus/viive), ei vain syötettä/tuotosta. Työkalut: Langfuse (avoin), Arize Phoenix, LangSmith. Evaleissa on kolme kerrosta: yksikkötestit (deterministiset osat), trajectory-evalit (ottiiko hyvän polun), tulos-evalit (saavuttiko tavoitteen — LLM-as-a-judgen tai ihmisen kautta). Tuotanto tarvitsee guardraileja (syöte/tuotos/työkalu), kustannusvalvontaa (kustannus-per-onnistuminen on avainmittari) ja human-in-the-loop peruuttamattomille toiminnoille. Tekijä: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agents-evals-observability/