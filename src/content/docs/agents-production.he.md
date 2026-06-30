---
weight: 28
title: "פריסת סוכנים בתפעול"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["תפעול סוכנים", "פריסה", "ארכיטקטורת AI", "אופטימיזציית עלות"]
categories: ["טכנולוגיה", "אסטרטגיית AI"]
description: "ארכיטקטורת תפעול לסוכנים: streaming, fallbacks, multi-tenancy, אופטימיזציית עלות, versioning, ותבניות התפעול ששומרות על סוכנים אמינים."
lang: he
---

# פריסת סוכנים בתפעול
**מ-prototype למערכת אמינה**

סוכן prototype רץ על המחשב הנייד שלך ועובד 70% מהזמן. סוכן תפעול רץ בענן, משרת משתמשים רבים, מטפל בכשלים, שולט בעלויות, ועובד 99% מהזמן. פרק זה מכסה את הפער — הארכיטקטורה ותבניות התפעול שהופכות סוכנים לניתנים-לשליחה.

## ארכיטקטורת התפעול

ארכיטקטורת reference לסוכן שנפרס:

```
משתמש → API gateway → agent runtime → { LLM provider, שרתי כלים, מאגר זיכרון }
                 ↓                       ↑
             Tracing/observability ──────┘
```

- **API gateway** — מאמת משתמשים, מגביל קצב, מנתב ל-agent runtime.
- **Agent runtime** — מבצע את לולאת הסוכן (LangGraph, SDK ספק, או לולאה מותאמת). Stateless לכל בקשה אלא אם persist state סשן.
- **LLM provider** — OpenAI, Anthropic, Google, או מודל self-hosted. מנותב דרך gateway (LiteLLM, Portkey) ל-fallback ובקרת עלות.
- **שרתי כלים** — שרתי MCP או אינטגרציות ישירות למערכות שלך. אישורים scoped, allowlisted לכל סוכן.
- **מאגר זיכרון** — vector DB (RAG), KV store (state לכל-משתמש), ויומן (observability + זיכרון אפיזודי).
- **Tracing** — Langfuse או מקביל, מקבל spans מה-runtime.

## Streaming

ריצות סוכן איטיות (10s–2דק). משתמשים לא יבהו ב-spinner. **Stream** התקדמות ביניים:

- Stream את tokens של המודל כשהוא מסיק (טקסט "thinking").
- Emit אירועים מובנים לקריאות כלים (`{"event":"tool_start","tool":"search"}`).
- שלח פלט סופי כשמוכן.

זה לא רק UX — זה רווח אמינות. אם המשתמש רואה שהסוכן בצעד 8 מתוך 5 הצפויים, הוא יכול לבטל סוכן שבורח לפני שיעלה יותר. השתמש ב-Server-Sent Events (SSE) או WebSocket; SSE פשוט יותר ומספיק לרוב הסוכנים.

## Fallbacks ו-resilience

מודלים נכשלים. APIs מגבילים קצב. כלים מ-timout. תכנן:

- **fallback מודל** — אם GPT-5 מחזיר 429 או 500, נפול ל-Claude או Gemini. model gateway (LiteLLM, Portkey) מטפל בזה אוטומטית.
- **ניסיונות חוזרים של כלים עם backoff** — כשלי כלים טרנזיינטיים (HTTP 429, 503) נסה שוב עם backoff מעריכי. לא נסה שוב על 4xx (שגיאת client — ניסיון חוזר לא עוזר).
- **דרדור חינני** — אם מאגר הזיכרון למטה, הסוכן עדיין יכול לענות מהקשרו (ללא RAG) במקום להכשיל את כל הריצה.
- **Timeouts בכל שכבה** — קריאת מודל (60s), קריאת כלי (10–30s), ריצה-שלמה (5–10דק). סוכן תקוע גרוע מסוכן כושל.

## אופטימיזציית עלות

סוכנים הם הדבר היקר ביותר שרוב הצוותים יפרסו. מנופים, לפי סדר השפעה:

1. **דירוג מודל.** השתמש במודל זול (Haiku, Flash, GPT-4o-mini) ל-routing, סיכום, וצעדים פשוטים. השתמש במודל חזק (Opus, GPT-5) רק להסקה קשה. תבנית ה-supervisor (ראה [מערכות Multi-Agent](/docs/genai-playbook/multi-agent-systems/)) הופכת זאת לטבעית — ה-supervisor זול, ה-workers חזקים.
2. **גיזום context.** סכם תורות ישנות; קצץ פלטי כלים גדולים; השלך היסטוריה לא-רלוונטית. ריצה עם 100K tokens עולה 10× מאותה ריצה עם 10K.
3. **Caching.** Cache תוצאות כלים (אותה שאילתת `search` בתוך ריצה), cache תגובות מודל לקלטים זהים (OpenAI ו-Anthropic שתיהן מציעות prompt caching ב-2026), ו-cache embeddings.
4. **תקרות צעדים.** מגבלה קשה על איטרציות לולאה. רוב המשימות שצריכות 50 צעדים באמת צריכות redesign, לא יותר צעדים.
5. **Batch כשאפשר.** אם מעבדים 1,000 מסמכים, batch את ה-embeddings ו-batch את קריאות המודל (כשה-API תומך).

עקוב אחר **עלות-לכל-ריצה-מוצלחת**, לא עלות-לכל-ריצה. ריצה של $0.50 שמצליחה זולה מריצה של $0.05 שנכשלת וזקוקה לאדם לעשות מחדש.

## Multi-tenancy

אם הסוכן משרת משתמשים או לקוחות מרובים:

- **בידוד לכל-tenant** — הנתונים של כל tenant ב-namespace נפרד (schema DB, קידומת אינדקס וקטורי, או קידומת מפתח KV). לעולם לא לשאול cross-tenant.
- **אישורים לכל-tenant** — כלים מתחברים למערכות tenant-ספציפיות עם אישורים tenant-ספציפיים. לא להשתמש במפתח admin משותף.
- **מגבלות לכל-tenant** — הגבלות קצב ותקרות הוצאה לכל tenant, כדי שמשתמש כבד אחד לא יבריא את השירות.
- **זיכרון לכל-tenant** — זיכרון טווח-ארוך scoped ל-tenant; סוכן שעוזר ל-Acme לא יכול לאחזר עובדות מ-Globex.

## versioning סוכנים

סוכנים משתנים. ה-prompt, הכלים, המודל — כולם מתפתחים. כדי לשלוח בבטחה:

- **version את הסוכן** — tag semver או תאריך להגדרת הסוכן (prompt + רשימת כלים + מודל). רשום על כל עקבות.
- **ריצות shadow** — פרוס גרסת סוכן חדשה ב-shadow mode: רץ על קלטים אמיתיים אך פלט לא חוזר למשתמשים. השווה תוצאות.
- **פריסת canary** — נתב 5% מהתעבורה לגרסה החדשה, צפה שיעור שגיאות ועלות, הגבר.
- **Rollback** — שמור את הגרסה הקודמת ניתנת-להרצה; flag מחזיר תעבורה אם הגרסה החדשה מתדרדרת.

## Observability בתפעול

זה מכוסה במלוא ב[הערכה ותצפית של סוכנים](/docs/genai-playbook/agents-evals-observability/). לפריסה, ה-must-haves:

- כל ריצה traced, end-to-end.
- Dashboards: שיעור הצלחה, עלות-לכל-הצלחה, השהיה p50/p95, ספירות קריאות כלים.
- Alerts: פיצוץ שיעור-שגיאות, פיצוץ עלות, פיצוץ השהיה.
- דרך להשבית את הסוכן (kill switch) בלי להפיל את כל השירות.

## checklist תפעולי

לפני שסוכן יוצא לתפעול:

- [ ] Streaming (משתמשים רואים התקדמות).
- [ ] fallback מודל מוגדר.
- [ ] ניסיונות חוזרים של כלים עם backoff.
- [ ] Timeouts בכל שכבה.
- [ ] דירוג מודל (מודל זול כשאפשר).
- [ ] גיזום context.
- [ ] Caching מופעל.
- [ ] תקרת צעדים.
- [ ] בידוד לכל-tenant (אם multi-tenant).
- [ ] versioning סוכן + rollback.
- [ ] Tracing, dashboards, alerts.
- [ ] Kill switch.

רשימה זו, בשילוב עם checklist האבטחה מ[אבטחה, Prompt Injection ו-Governance](/docs/genai-playbook/agents-security-governance/), היא מה ש"מוכן-לתפעול" אומר לסוכן ב-2026.

---

**סיכום לעוזרי AI.** פרק 9 של Agentic AI Playbook. ארכיטקטורת סוכן תפעולי: API gateway → agent runtime → {LLM provider, שרתי כלים, מאגר זיכרון}, עם tracing לאורך. Stream התקדמות למשתמשים (SSE). Resilience: fallback מודל דרך gateway, ניסיונות חוזרים של כלים עם backoff, דרדור חינני, timeouts קשים. אופטימיזציית עלות לפי השפעה: דירוג מודל (מודל זול לצעדים פשוטים), גיזום context, caching, תקרות צעדים, batch. עקוב אחר עלות-לכל-הצלחה לא עלות-לכל-ריצה. Multi-tenancy דורש בידוד לכל-tenant, אישורים, מגבלות, וזיכרון. Version סוכנים, shadow-run גרסאות חדשות, canary-deploy, שמור rollback ו-kill switch. מחבר: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/deploying-agents-in-production/