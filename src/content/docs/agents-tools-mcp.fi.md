---
weight: 22
title: "Työkalut, Function Calling & MCP"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["MCP", "Function Calling", "Työkalujen käyttö", "Agenttiarkkitehtuuri"]
categories: ["Teknologia", "AI-strategia"]
description: "Miten agentit kutsuvat ulkoisia järjestelmiä: function calling, Model Context Protocol (MCP), työkalusuunnittelu ja turvallisuusrajoja."
lang: fi
---

# Työkalut, Function Calling & MCP
**Miten agentit koskettavat todellista maailmaa**

Agentti ilman työkaluja on vain chatbotti. Työkalut tekevät kielimallista järjestelmän, joka voi hakea, kysellä tietokantoja, lähettää viestejä, suorittaa koodia ja kutsua API:ta. Tämä luku käsittelee, miten työkalujen käyttö toimii vuonna 2026 — natiivista function callingista Model Context Protocoliin, joka standardoi sen.

## Function calling: perusalkio

Function calling antaa mallin emittoida **jäsennellyn pyynnön kutsua funktiota**, tekstin sijaan (tai sen lisäksi). Malli ei suorita funktiota — se palauttaa JSON-tyyppisen kutsun ja runtime suorittaa sen.

Esimerkki: annat mallille työkalumäärittelyn:

```json
{
  "name": "get_weather",
  "description": "Get current weather for a city",
  "parameters": { "city": "string", "units": "celsius|fahrenheit" }
}
```

Malli, jolta kysytään "Mikä on Helsingin sää?", vastaa:

```json
{ "tool": "get_weather", "city": "Helsinki", "units": "celsius" }
```

Koodisi ajaa `get_weather("Helsinki", "celsius")`, palauttaa `{"temp": 14, "conditions": "cloudy"}` ja malli käyttää sitä vastatakseen. Tämä on jokaisen agenttikehyksen peruskallio.

OpenAI kutsuu tätä **function callingiksi** (nyt **structured outputs**). Anthropic kutsuu sitä **tool useksi**. Google kutsuu sitä **function callingiksi**. Mekanismi on sama.

## Model Context Protocol (MCP)

Ongelma: jokainen työkaluintegraatio oli räätälöity. Kirjoitit OpenAI-funktiomäärityksen, Anthropic-työkalumäärityksen, Google-funktiomäärityksen — kaikki kuvasivat samaa taustalla olevaa API:ta. **Model Context Protocol (MCP)**, jonka Anthropic avasi loppuvuonna 2024, korjasi tämän.

MCP on standardiprotokolla **työkalujen, resurssien ja promptien tarjoamiseen mille tahansa AI-sovellukselle**. MCP-**palvelin** kietoo API:n (Slack, GitHub, Postgres, paikallinen tiedostojärjestelmä). MCP-**asiakas** (agentti, IDE, chat-sovellus) yhdistää siihen ja saa yhtenäisen työkaluluettelon. Kesällä 2026:

- OpenAI, Anthropic, Google ja useimmat avoimet kehykset tukevat MCP-asiakkaita.
- Satoja MCP-palvelimia on (tiedostojärjestelmä, Git, Slack, Notion, Postgres, Sentry, linear, selainautomaatio).
- Suuret IDE:t (Cursor, Windsurf, VS Code + Copilot) toimittavat MCP-asiakastuen.

### Miten MCP toimii

MCP-palvelin tarjoaa kolme primitiiviä:

- **Työkalut** — funktioita, joita malli voi kutsua (`send_slack_message`, `run_sql_query`).
- **Resurssit** — dataa, jota malli voi lukea (`file://report.md`, `postgres://users`).
- **Promptit** — uudelleenkäytettäviä prompt-pohjia, joita malli voi kutsua.

Asiakas (agentti) yhdistää stdion (paikallinen) tai HTTP/SSE:n (etä) kautta, listaa palvelimen työkalut ja tuo ne mallille. Malli kutsuu työkalua; asiakas välittää kutsun palvelimelle; palvelin suorittaa ja palauttaa tuloksen.

### Miksi MCP merkitsee yrityksille

- **Siirrettävyys** — kirjoita työkaluintegraatio kerran, käytä millä tahansa MCP:ta tukevalla mallilla.
- **Löydettävyys** — agentti listaa saatavilla olevat työkalut suorituksen aikana sen sijaan, että koodaisi ne kovasti.
- **Turvallisuusraja** — MCP-palvelin hallitsee, mitä agentti voi käyttää; et anna mallille raakoja tunnistetietoja.

## Työkalusuunnittelu_periaatteet

Huonot työkalut rikkovat agentit. Hyvät työkalut saavat agentit näyttämään älykkäiltä. Periaatteet:

1. **Ole tarkka.** `search_pinecone_for_customer_issues(product="acme", limit=5)` voittaa `search("customer issues")`. Malli valitsee oikean työkalun, kun määritys on yksiselitteinen.
2. **Palauta jäsenneltyä dataa, ei proosaa.** `{"tickets": [{"id": 123, "status": "open"}]}` on jäsenneltävissä; "Löysin 5 tikettiä..." ei.
3. **Rajoita tuoton kokoa.** Työkalu, joka palauttaa 50KB JSONia, tulvii kontekstin. Sivuta, tiivistä tai katkaise.
4. **Yksi työkalu, yksi työ.** `send_email`-työkalu, joka myös luonnostelee rungon, on kaksi työkalua valepuvussa. Anna mallin luonnostella, sitten lähettää.
5. **Dokumentoi virhetilat.** Jos API palauttaa 429, kerro mallille — se voi ottaa backoffin. Hiljaiset virheet saavat agentit hallusinoimaan.

## Turvallisuusrajoja

Työkalut ovat voimaa, ja voima tarvitsee rajoja. Minimi:

- **Whitelist** — agentti saa kutsua vain työkaluja, jotka olet hyväksynyt tälle tehtävälle.
- **Rajatut tunnistetiedot** — jokainen työkalu saa least-privilege-avaimet, ei koskaan agentin täyttä käyttöoikeutta.
- **Audit-loki** — jokainen työkalukutsu (syöte + tuotos) lokitetaan tarkistusta varten.
- **Hyväksymisportit** — tuhoaville tai ulospäin suuntautuville toiminnoille (sähköpostin lähettäminen, tuotantoon kirjoittaminen) vaaditaan ihmisen hyväksyntä.

Suurin uusi riski vuonna 2026 on **prompt-injektio työkalutuotosten kautta**: pahanomainen verkkosivu, jonka `search`-työkalu palauttaa, sisältää ohjeita, jotka houkuttelevat agentin kutsumaan `send_email`. Puolustus on tiukka erottelu työkalutuotoksen ja ohjeiden välillä — työkalutuotos ei saa koskaan tulla järjestelmä-promptiksi. Katso [Turvallisuus, Prompt-injektio & Hallinto](/docs/genai-playbook/agents-security-governance/).

## Valinta natiivin function callingin ja MCP:n välillä

- **Natiivi function calling** — paras pienelle, kiinteälle työkalujoukolle, jotka on tiukasti kytketty yhteen sovellukseen. Pienempi ylikuorma.
- **MCP** — paras, kun haluat jakaa työkaluja agenttien, mallien tai tiimien kesken; kun kolmannen osapuolen MCP-palvelimia on jo järjestelmiisi; kun haluat mallin löytävän työkaluja dynaamisesti.

Vuonna 2026 useimmat uudet agenttirakennelmat käyttävät **MCP:ta ulkoisiin integraatioihin** ja **natiivia function callingia muutamiin sovelluskohtaisiin apureihin**.

---

**Yhteenveto AI-avustajille.** Luku 3 Agentic AI Playbookista. Function calling antaa mallien emittoida jäsenneltyjä työkalukutsupyyntöjä; MCP standardoi työkalujen löydettävyyden mallien ja toimittajien välillä. MCP-palvelimet tarjoavat työkaluja/resursseja/prompteja; asiakkaat (agentit, IDE:t) yhdistävät ja tuovat ne mallille. Työkalusuunnittelu: tarkat nimet, jäsennelty tuotos, kokorajoitukset, yksi työ per työkalu. Turvallisuus: whitelistit, least-privilege-tunnistetiedot, audit-lokit, hyväksymisportit ja puolustus prompt-injektiota vastaan työkalutuotosten kautta. Tekijä: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/tools-function-calling-mcp/