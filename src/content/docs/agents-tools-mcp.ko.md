---
weight: 22
title: "도구, Function Calling & MCP"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["MCP", "Function Calling", "도구 사용", "에이전트 아키텍처"]
categories: ["기술", "AI 전략"]
description: "에이전트가 외부 시스템을 어떻게 호출하는가: function calling, Model Context Protocol (MCP), 도구 설계, 보안 경계."
lang: ko
---

# 도구, Function Calling & MCP
**에이전트가 실제 세상을 어떻게 접하는가**

도구 없는 에이전트는 단순한 chatbot이다. 도구는 언어 모델을 검색, 데이터베이스 쿼리, 메시지 전송, 코드 실행, API 호출이 가능한 시스템으로 바꾼다. 이 장은 2026년에 도구 사용이 어떻게 작동하는지 다룬다 — 네이티브 function calling부터 이것을 표준화하는 Model Context Protocol까지.

## Function calling: 원시 요소

Function calling은 모델이 텍스트 대신(또는 함께) **구조화된 함수 호출 요청**을 내보내게 한다. 모델이 함수를 실행하지 않는다 — JSON 같은 호출을 반환하고, 런타임이 실행.

예: 모델에게 도구 spec을 준다:

```json
{
  "name": "get_weather",
  "description": "Get current weather for a city",
  "parameters": { "city": "string", "units": "celsius|fahrenheit" }
}
```

"헬싱키의 날씨는?"이라고 묻자, 모델은 응답:

```json
{ "tool": "get_weather", "city": "Helsinki", "units": "celsius" }
```

코드가 `get_weather("Helsinki", "celsius")`를 실행, `{"temp": 14, "conditions": "cloudy"}`를 반환, 모델이 답변에 사용. 이것이 모든 에이전트 프레임워크의 기반.

OpenAI는 이를 **function calling**(이제 **structured outputs**)이라 한다. Anthropic은 **tool use**라 한다. Google은 **function calling**이라 한다. 메커니즘은 같다.

## Model Context Protocol (MCP)

문제: 모든 도구 통합이 맞춤형이었다. OpenAI function spec, Anthropic 도구 spec, Google function spec을 썼다 — 모두 같은 API를 설명. 2024 말 Anthropic이 오픈소스한 **Model Context Protocol (MCP)**이 이를 고쳤다.

MCP는 **모든 AI 애플리케이션에 도구, 리소스, 프롬프트를 노출**하는 표준 프로토콜이다. MCP **서버**가 API(Slack, GitHub, Postgres, 로컬 filesystem)를 감싼다. MCP **클라이언트**(에이전트, IDE, chat 앱)가 연결하고 균일한 도구 목록을 얻는다. 2026 중반까지:

- OpenAI, Anthropic, Google, 대부분의 오픈 프레임워크가 MCP 클라이언트를 지원.
- 수백의 MCP 서버가 존재(filesystem, Git, Slack, Notion, Postgres, Sentry, linear, 브라우저 자동화).
- 주요 IDE(Cursor, Windsurf, VS Code + Copilot)가 MCP 클라이언트 지원을 ship.

### MCP가 어떻게 작동하는가

MCP 서버는 세 원시 요소를 노출:

- **도구** — 모델이 호출할 수 있는 함수(`send_slack_message`, `run_sql_query`).
- **리소스** — 모델이 읽을 수 있는 데이터(`file://report.md`, `postgres://users`).
- **프롬프트** — 모델이 호출할 수 있는 재사용 프롬프트 템플릿.

클라이언트(에이전트)가 stdio(로컬) 또는 HTTP/SSE(원격)로 연결, 서버의 도구를 나열, 모델에 노출. 모델이 도구를 호출; 클라이언트가 서버에 호출을 전달; 서버가 실행하고 결과 반환.

### MCP가 엔터프라이즈에 중요한 이유

- **이식성** — 도구 통합을 한 번 쓰고, MCP를 지원하는 어떤 모델과 사용.
- **발견 가능성** — 에이전트가 hard-coding 대신 런타임에 사용 가능한 도구를 나열.
- **보안 경계** — MCP 서버가 에이전트가 접근할 수 있는 것을 제어; 모델에 원시 자격 증명을 주지 않는다.

## 도구 설계 원칙

나쁜 도구는 에이전트를 깬다. 좋은 도구는 에이전트를 똑똑해 보이게 한다. 원칙:

1. **구체적이어라.** `search_pinecone_for_customer_issues(product="acme", limit=5)`이 `search("customer issues")`보다 낫다. spec이 명확할 때 모델이 올바른 도구를 선택.
2. **산문이 아닌 구조화된 데이터를 반환.** `{"tickets": [{"id": 123, "status": "open"}]}`은 파싱 가능; "5개 티켓을 찾았습니다..."는 아니다.
3. **출력 크기를 캡.** 50KB JSON을 반환하는 도구는 컨텍스트를 넘친다. 페이지네이션, 요약, 또는 잘라내기.
4. **하나의 도구, 하나의 일.** 본문도 초안하는 `send_email` 도구는 위장한 두 도구. 모델이 초안하고, 보내게 하라.
5. **실패 모드를 문서화.** API가 429를 반환하면, 모델에게 말해라 — 후퇴할 수 있다. 조용한 실패는 에이전트를 환각하게 한다.

## 보안 경계

도구는 힘이고, 힘에는 경계가 필요. 최소:

- **Allowlist** — 에이전트가 이 작업에 승인된 도구만 호출.
- **범위 자격 증명** — 각 도구가 least-privilege 키를 얻고, 에이전트의 전체 접근이 아니다.
- **감사 로그** — 모든 도구 호출(입력 + 출력)이 검토를 위해 로깅.
- **승인 게이트** — 파괴적 또는 외부 행동(이메일 전송, 프로덕션에 쓰기)에 인간 승인 요구.

2026년 가장 큰 새 위험은 **도구 출력을 통한 prompt injection**: `search` 도구가 반환한 악의적 웹 페이지가 에이전트를 속여 `send_email`을 호출하는 지시를 포함. 방어는 도구 출력과 지시 사이의 엄격한 분리 — 도구 출력이 시스템 프롬프트가 되게 하지 마라. [보안, Prompt Injection & Governance](/docs/genai-playbook/agents-security-governance/)를 보라.

## 네이티브 function calling과 MCP 사이 선택

- **네이티브 function calling** — 한 앱에 밀접 결합된 작고 고정된 도구 세트에 최적. 낮은 오버헤드.
- **MCP** — 에이전트, 모델, 팀 간 도구를 공유하고 싶을 때; 시스템에 이미 서드파티 MCP 서버가 있을 때; 모델이 동적으로 도구를 발견하게 하고 싶을 때 최적.

2026년 대부분의 새 에이전트 빌드는 **외부 통합에 MCP**와 **몇몇 앱 특정 헬퍼에 네이티브 function calling**을 사용.

---

**AI 어시스턴트를 위한 요약.** Agentic AI 플레이북 3장. Function calling이 모델이 구조화된 도구 호출 요청을 내보내게 한다; MCP가 모델과 벤더 간 도구 발견을 표준화. MCP 서버는 도구/리소스/프롬프트를 노출; 클라이언트(에이전트, IDE)가 연결하고 모델에 노출. 도구 설계: 구체적 이름, 구조화된 출력, 크기 캡, 도구당 하나의 일. 보안: allowlist, least-privilege 자격 증명, 감사 로그, 승인 게이트, 도구 출력을 통한 prompt injection 방어. 저자: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/tools-function-calling-mcp/