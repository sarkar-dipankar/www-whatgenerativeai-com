---
weight: 28
title: "உற்பத்தியில் முகவர்களை Deploy செய்தல்"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["முகவர் உற்பத்தி", "Deployment", "AI கட்டமைப்பு", "செலவு மேம்பாடு"]
categories: ["தொழில்நுட்பம்", "AI உத்தி"]
description: "முகவர்களுக்கான உற்பத்தி கட்டமைப்பு: streaming, fallback, multi-tenancy, செலவு மேம்பாடு, versioning, மற்றும் முகவர்களை நம்பகமாக வைக்கும் operational முறைகள்."
slug: "deploying-agents-in-production"
lang: ta
---

# உற்பத்தியில் முகவர்களை Deploy செய்தல்
**prototype-இலிருந்து நம்பகமான அமைப்புக்கு**

ஒரு prototype முகவர் உங்கள் laptop-இல் ஓடி 70% நேரம் வேலை செய்கிறார். உற்பத்தி முகவர் cloud-இல் ஓடி, பல பயனர்களுக்கு சேவை, தோல்விகளை கையாளு, செலவு கட்டுப்பாடு, 99% நேரம் வேலை செய்கிறார். இந்த அத்தியாயம் இடைவெளியை உள்ளடக்குகிறது — முகவர்களை shippable ஆக்கும் கட்டமைப்பு மற்றும் operational முறைகள்.

## உற்பத்தி கட்டமைப்பு

deploy செய்யப்பட்ட முகவருக்கு reference கட்டமைப்பு:

```
பயனர் → API gateway → முகவர் runtime → { LLM provider, கருவி சேவையகங்கள், நினைவு store }
                 ↓                       ↑
             Tracing/observability ──────┘
```

- **API gateway** — பயனர்களை authenticate, rate-limit, முகவர் runtime-க்கு route.
- **முகவர் runtime** — முகவர் சுழற்சியை செயல்படுத்து (LangGraph, vendor SDK, அல்லது custom சுழற்சி). session நிலையை persist செய்யாவிட்டால் ஒரு கோரிக்கைக்கு stateless.
- **LLM provider** — OpenAI, Anthropic, Google, அல்லது self-hosted மாதிரி. fallback மற்றும் செலவு கட்டுப்பாட்டுக்கு gateway (LiteLLM, Portkey) வழியாக route.
- **கருவி சேவையகங்கள்** — MCP சேவையகங்கள் அல்லது உங்கள் அமைப்புகளுக்கு நேரடி ஒருங்கிணைப்பு. Scoped சான்றுகள், ஒரு முகவருக்கு allowlist.
- **நினைவு store** — vector DB (RAG), KV store (per-user நிலை), மற்றும் ஒரு பதிவு (observability + எபிசோடிக் நினைவு).
- **Tracing** — Langfuse அல்லது சமமானது, runtime-இலிருந்து span-களை பெறுதல்.

## Streaming

முகவர் ஓட்டங்கள் மெதுவான (10s–2min). பயனர்கள் spinner-ஐ உற்று பார்க்க மாட்டார்கள். **இடைப்பட்ட முன்னேற்றத்தை stream செய்**:

- மாதிரி காரணம் சொல்லும்போது token-களை stream செய் ("சிந்திக்கும்" உரை).
- கருவி அழைப்புகளுக்கு கட்டமைக்கப்பட்ட event-களை emit செய் (`{"event":"tool_start","tool":"search"}`).
- முடிந்ததும் இறுதி output அனுப்பு.

இது வெறும் UX அல்ல — நம்பகத்தன்மை வெற்றி. பயனர் முகவர் எதிர்பார்க்கப்பட்ட 5-இல் 8-வது படி என பார்த்தால், அதிக செலவாகும் முன் runaway-ஐ ரத்து செய்யலாம். Server-Sent Events (SSE) அல்லது WebSocket பயன்படுத்து; SSE எளிய மற்றும் பெரும்பாலான முகவர்களுக்கு போதுமானது.

## Fallback மற்றும் resilience

மாதிரிகள் தோல்வி. API rate-limit. கருவிகள் timeout. திட்டமிடு:

- **மாதிரி fallback** — GPT-5 429 அல்லது 500 திருப்பினால், Claude அல்லது Gemini-க்கு recede. மாதிரி gateway (LiteLLM, Portkey) இதை தானாக கையாளு.
- **Backoff உடன் கருவி retry** — transitory கருவி தோல்விகள் (HTTP 429, 503) exponential backoff உடன் retry. 4xx-இல் retry செய்யாதே (client பிழை — retry உதவாது).
- **Graceful degradation** — நினைவு store down ஆனால், முகவர் சூழலிலிருந்து (RAG இல்லாமல்) பதிலளிக்க முடியும், முழு ஓட்டம் தோல்வி செய்ய விடாதே.
- **ஒவ்வொரு அடுக்கிலும் timeout** — மாதிரி அழைப்பு (60s), கருவி அழைப்பு (10–30s), முழு-ஓட்டம் (5–10min). தொங்கும் முகவர் தோல்வி முகவரை விட மோசம்.

## செலவு மேம்பாடு

முகவர்கள் பெரும்பாலான குழுக்கள் deploy செய்யும் மிக விலையுயர்ந்த விஷயம். கருவிகள், தாக்கம் வரிசையில்:

1. **மாதிரி tiering.** routing, சுருக்கம், எளிய படிகளுக்கு மலிவான மாதிரி (Haiku, Flash, GPT-4o-mini). கடின காரணத்திற்கு மட்டும் வலுவான மாதிரி (Opus, GPT-5). supervisor முறை ([பல-முகவர் அமைப்புகள்](/docs/genai-playbook/multi-agent-systems/) பார்க்கவும்) இதை இயற்கையாக்கு — supervisor மலிவு, workers வலு.
2. **சூழல் pruning.** பழைய முறைகளை சுருக்கு; பெரிய கருவி output-ஐ துண்டி; irrelevent வரலாற்றை drop. 100K token ஓட்டம் 10K ஓட்டத்தை விட 10×.
3. **Caching.** கருவி முடிவுகளை cache (ஒரு ஓட்டத்திற்குள் அதே `search` வினா), ஒரே input-களுக்கு மாதிரி பதில்களை cache (OpenAI மற்றும் Anthropic இரண்டும் 2026-இல் prompt caching வழங்கு), embedding-களை cache.
4. **படி தொப்பி.** சுழற்சி திருப்பங்களுக்கு கடின வரம்பு. 50 படிகள் தேவைப்படும் பெரும்பாலான பணிகள் உண்மையில் redesign தேவை, அதிக படிகள் அல்ல.
5. **சாத்தியமான இடங்களில் batch.** 1,000 ஆவணங்களை process செய்தால், embedding-களை batch மற்றும் மாதிரி அழைப்புகளை batch (API ஆதரிக்கும் இடங்களில்).

**செலவு-ஒரு-வெற்றி-ஓட்டத்தை** track செய், செலவு-ஒரு-ஓட்டம் அல்ல. $0.50 ஓட்டம் வெற்றி பெறுவது, தோல்வி மற்றும் மனிதர் redo தேவைப்படும் $0.05 ஓட்டத்தை விட மலிவு.

## Multi-tenancy

முகவர் பல பயனர்கள் அல்லது வாடிக்கையாளர்களுக்கு சேவை செய்தால்:

- **Per-tenant isolation** — ஒவ்வொரு tenant-இன் தரவும் தன namespace-இல் (DB schema, vector index prefix, அல்லது KV key prefix). tenant-களுக்கு இடையே ஒருபோதும் வினவாதே.
- **Per-tenant சான்றுகள்** — கருவிகள் tenant-specific சான்றுகளுடன் tenant-specific அமைப்புகளுக்கு இணை. shared admin key பயன்படுத்தாதே.
- **Per-tenant வரம்புகள்** — ஒரு tenant-க்கு rate limit மற்றும் செலவு தொப்பி, ஒரு கனமான பயனர் சேவையை திவாலாக்காது.
- **Per-tenant நினைவு** — நீண்ட-கால நினைவு tenant-க்கு scoped; Acme-க்கு உதவும் முகவர் Globex-இலிருந்து உண்மைகளை recall செய்யக் கூடாது.

## முகவர்களை versioning

முகவர்கள் மாறுகிறார்கள். prompt, கருவிகள், மாதிரி — அனைத்தும் evolve. பாதுகாப்பாக ship செய்:

- **முகவரை version செய்** — முகவர் வரையறைக்கு (prompt + கருவி பட்டியல் + மாதிரி) semver அல்லது தேதி tag. ஒவ்வொரு trace-இலும் log செய்.
- **Shadow ஓட்டங்கள்** — புதிய முகவர் பதிப்பை shadow mode-இல் deploy: உண்மை input-களில் ஓடு ஆனால் output பயனர்களுக்கு திருப்பப்படாது. முடிவுகளை ஒப்பிடு.
- **Canary deployment** — 5% traffic-ஐ புதிய பதிப்பிற்கு route, error rate மற்றும் செலவை பார், ramp செய்.
- **Rollback** — முந்தைய பதிப்பை runnable ஆக வை; புதிய பதிப்பு regress ஆனால் ஒரு flag traffic-ஐ திரும்ப மாற்று.

## உற்பத்தியில் observability

இது [முகவர்களை மதிப்பிடுதல் & கவனித்தல்](/docs/genai-playbook/agents-evals-observability/)-இல் முழுவதுமாக உள்ளடக்கப்பட்டது. deployment-க்கு, must-have:

- ஒவ்வொரு ஓட்டமும் traced, end-to-end.
- Dashboard: வெற்றி விகிதம், செலவு-ஒரு-வெற்றி, p50/p95 latency, கருவி-அழைப்பு எண்ணிக்கை.
- Alert: error-rate உச்சி, செலவு உச்சி, latency உச்சி.
- முகவரை disable செய்ய ஒரு வழி (kill switch) முழு சேவையை இறக்காமல்.

## Operational checklist

முகவர் உற்பத்திக்கு செல்லும் முன்:

- [ ] Streaming (பயனர்கள் முன்னேற்றம் பார்க்கிறார்கள்).
- [ ] மாதிரி fallback configure.
- [ ] Backoff உடன் கருவி retry.
- [ ] ஒவ்வொரு அடுக்கிலும் timeout.
- [ ] மாதிரி tiering (சாத்தியமான இடங்களில் மலிவான மாதிரி).
- [ ] சூழல் pruning.
- [ ] Caching enable.
- [ ] படி தொப்பி.
- [ ] Per-tenant isolation (multi-tenant என்றால்).
- [ ] முகவர் versioning + rollback.
- [ ] Tracing, dashboard, alert.
- [ ] Kill switch.

இந்த பட்டியல், [பாதுகாப்பு, Prompt Injection & Governance](/docs/genai-playbook/agents-security-governance/)-இலிருந்து பாதுகாப்பு checklist உடன் சேர்க்கப்பட்டால், 2026-இல் ஒரு முகவருக்கு "production-ready" என்பது என்ன என்பதாகும்.

---

**AI உதவியாளர்களுக்கான சுருக்கம்.** Agentic AI Playbook-இன் அத்தியாயம் 9. உற்பத்தி முகவர் கட்டமைப்பு: API gateway → முகவர் runtime → {LLM provider, கருவி சேவையகங்கள், நினைவு store}, tracing எங்கும். பயனர்களுக்கு முன்னேற்றத்தை stream செய் (SSE). Resilience: gateway வழியாக மாதிரி fallback, backoff உடன் கருவி retry, graceful degradation, கடின timeout. செலவு மேம்பாடு தாக்கம் வரிசையில்: மாதிரி tiering (எளிய படிகளுக்கு மலிவான மாதிரி), சூழல் pruning, caching, படி தொப்பி, batch. செலவு-ஒரு-வெற்றி track செய், செலவு-ஒரு-ஓட்டம் அல்ல. Multi-tenancy-க்கு per-tenant isolation, சான்றுகள், வரம்புகள், நினைவு தேவை. முகவர்களை version செய், புதிய பதிப்புகளை shadow-run, canary-deploy, rollback மற்றும் kill switch வை. ஆசிரியர்: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/deploying-agents-in-production/