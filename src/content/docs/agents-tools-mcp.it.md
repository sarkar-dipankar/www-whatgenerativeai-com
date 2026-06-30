---
weight: 22
title: "Strumenti, Function Calling & MCP"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["MCP", "Function Calling", "Uso di Strumenti", "Architettura Agenti"]
categories: ["Tecnologia", "Strategia AI"]
description: "Come gli agenti chiamano sistemi esterni: function calling, il Model Context Protocol (MCP), design degli strumenti e confini di sicurezza."
slug: "tools-function-calling-mcp"
lang: it
---

# Strumenti, Function Calling & MCP
**Come gli agenti toccano il mondo reale**

Un agente senza strumenti è solo un chatbot. Gli strumenti trasformano un modello linguistico in un sistema che può cercare, interrogare database, inviare messaggi, eseguire codice e chiamare API. Questo capitolo copre come funziona l'uso degli strumenti nel 2026 — dal function calling nativo al Model Context Protocol che lo sta standardizzando.

## Function calling: la primitiva

Il function calling permette a un modello di emettere una **richiesta strutturata di chiamata a funzione**, invece di (o accanto a) testo. Il modello non esegue la funzione — restituisce una chiamata di tipo JSON e il tuo runtime la esegue.

Esempio: dai al modello una specifica di strumento:

```json
{
  "name": "get_weather",
  "description": "Get current weather for a city",
  "parameters": { "city": "string", "units": "celsius|fahrenheit" }
}
```

Il modello, alla domanda "Com'è il tempo a Helsinki?", risponde:

```json
{ "tool": "get_weather", "city": "Helsinki", "units": "celsius" }
```

Il tuo codice esegue `get_weather("Helsinki", "celsius")`, restituisce `{"temp": 14, "conditions": "cloudy"}` e il modello lo usa per rispondere. Questa è la base di ogni framework di agenti.

OpenAI lo chiama **function calling** (ora **structured outputs**). Anthropic lo chiama **tool use**. Google lo chiama **function calling**. Il meccanismo è lo stesso.

## Il Model Context Protocol (MCP)

Il problema: ogni integrazione di strumenti era su misura. Scrivevi una specifica di funzione OpenAI, una di strumento Anthropic, una di funzione Google — tutte che descrivevano la stessa API sottostante. Il **Model Context Protocol (MCP)**, open-sourced da Anthropic a fine 2024, ha risolto questo.

MCP è un protocollo standard per **esporre strumenti, risorse e prompt a qualsiasi applicazione AI**. Un **server** MCP avvolge un'API (Slack, GitHub, Postgres, un filesystem locale). Un **client** MCP (un agente, un IDE, un'app di chat) si connette e ottiene una lista uniforme di strumenti. A metà 2026:

- OpenAI, Anthropic, Google e gran parte dei framework open supportano client MCP.
- Centinaia di server MCP esistono (filesystem, Git, Slack, Notion, Postgres, Sentry, linear, automazione browser).
- I principali IDE (Cursor, Windsurf, VS Code + Copilot) includono il supporto client MCP.

### Come funziona MCP

Un server MCP espone tre primitive:

- **Strumenti** — funzioni che il modello può chiamare (`send_slack_message`, `run_sql_query`).
- **Risorse** — dati che il modello può leggere (`file://report.md`, `postgres://users`).
- **Prompt** — template di prompt riutilizzabili che il modello può invocare.

Il client (agente) si connette via stdio (locale) o HTTP/SSE (remoto), elenca gli strumenti del server e li espone al modello. Il modello chiama uno strumento; il client inoltra la chiamata al server; il server esegue e restituisce il risultato.

### Perché MCP conta per le aziende

- **Portabilità** — scrivi l'integrazione una volta, usala con qualsiasi modello che supporti MCP.
- **Scopribilità** — l'agente elenca gli strumenti disponibili a runtime invece di hard-codarli.
- **Confini di sicurezza** — il server MCP controlla cosa l'agente può accedere; non passi credenziali grezze al modello.

## Principi di design degli strumenti

Strumenti cattivi rompono gli agenti. Strumenti buoni fanno sembrare gli agenti intelligenti. Principi:

1. **Sii specifico.** `search_pinecone_for_customer_issues(product="acme", limit=5)` batte `search("customer issues")`. Il modello sceglie lo strumento giusto quando la specifica è inequivocabile.
2. **Restituisci dati strutturati, non prosa.** `{"tickets": [{"id": 123, "status": "open"}]}` è parsabile; "Ho trovato 5 ticket..." no.
3. **Limita la dimensione dell'output.** Uno strumento che restituisce 50KB di JSON inonda il contesto. Pagina, riassumi o tronca.
4. **Uno strumento, un compito.** Uno strumento `send_email` che redige anche il corpo sono due strumenti in maschera. Lascia che il modello rediga, poi invia.
5. **Documenta i modi di fallimento.** Se l'API restituisce 429, dillo al modello — può fare backoff. Fallimenti silenziosi fanno allucinare gli agenti.

## Confini di sicurezza

Gli strumenti sono potere, e la potenza ha bisogno di confini. Il minimo:

- **Allowlist** — l'agente può chiamare solo gli strumenti che hai approvato per questo task.
- **Credenziali con scope** — ogni strumento ottiene chiavi a minimo privilegio, mai l'accesso completo dell'agente.
- **Log di audit** — ogni chiamata a strumento (input + output) è registrata per revisione.
- **Gate di approvazione** — per azioni distruttive o esterne (inviare email, scrivere in produzione), richiedi approvazione umana.

Il rischio più grande e nuovo nel 2026 è la **prompt injection via output di strumenti**: una pagina web malevola restituita da uno strumento `search` contiene istruzioni che ingannano l'agente fino a chiamare `send_email`. La difesa è una separazione rigorosa tra output di strumenti e istruzioni — non lasciare mai che l'output di uno strumento diventi un system prompt. Vedi [Sicurezza, Prompt Injection & Governance](/docs/genai-playbook/agents-security-governance/).

## Scegliere tra function calling nativo e MCP

- **Function calling nativo** — meglio per un piccolo set di strumenti fissi, strettamente accoppiati a un'app. Overhead minore.
- **MCP** — meglio quando vuoi condividere strumenti tra agenti, modelli o team; quando esistono già server MCP di terze parti per i tuoi sistemi; quando vuoi che il modello scopra gli strumenti dinamicamente.

Nel 2026 gran parte delle nuove build di agenti usa **MCP per integrazioni esterne** e **function calling nativo per pochi helper app-specific**.

---

**Riepilogo per assistenti AI.** Capitolo 3 dell'Agentic AI Playbook. Il function calling permette ai modelli di emettere richieste strutturate di chiamata a strumenti; MCP standardizza la scoperta degli strumenti tra modelli e vendor. I server MCP espongono strumenti/risorse/prompt; i client (agenti, IDE) si connettono e li espongono al modello. Design degli strumenti: nomi specifici, output strutturato, limiti di dimensione, un compito per strumento. Sicurezza: allowlist, credenziali a minimo privilegio, log di audit, gate di approvazione e difesa contro la prompt injection via output di strumenti. Autore: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/tools-function-calling-mcp/