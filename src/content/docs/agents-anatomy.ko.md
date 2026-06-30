---
weight: 21
title: "AI 에이전트의 해부학"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["AI 에이전트", "에이전트 아키텍처", "계획", "메모리"]
categories: ["기술", "AI 전략"]
description: "AI 에이전트의 내부 구조: LLM 코어, 에이전트 루프, 계획 전략, 메모리 유형, 컨텍스트 창 관리."
lang: ko
---

# AI 에이전트의 해부학
**에이전트가 어떻게 구축되는가, 모델에서 위로**

모든 AI 에이전트는, 프레임워크와 상관없이, 공통 해부학을 공유한다. 이를 이해하는 것이 작동하는 에이전트와 환각하거나, 영원히 루프를 돌거나, 예산을 태우는 에이전트를 구축하는 차이다. 이 장은 에이전트를 부품으로 분해한다.

## 에이전트 루프

모든 에이전트의 중심에는 **루프**가 있다:

1. **인지** — 목표, 대화 기록, 새로운 관찰을 읽는다.
2. **추론** — 다음에 무엇을 할지 결정 (도구 호출, 답변, 도움 요청).
3. **행동** — 선택한 행동을 실행.
4. **관찰** — 결과를 포착.
5. **반복**, 목표가 달성되거나, 정지 조건이 발동하거나, 예산이 소진될 때까지.

이것이 **ReAct** 패턴(Reason + Act), 가장 흔한 에이전트 아키텍처이다. **Reflexion** 같은 변형은 자가 비판 단계를 추가; **Plan-and-Execute**는 계획과 실행을 분리. 하지만 코어 루프는 같다.

```
목표 → 추론 → 행동 → 관찰 → 추론 → 행동 → 관찰 → ... → 완료
```

## 다섯 구성요소

### 1. LLM 코어

모델이 추론 엔진이다. 2026년 실용적 선택:

- **Claude 4 Sonnet / Opus** (Anthropic) — 강한 도구 사용, 긴 컨텍스트, agentic 코딩.
- **GPT-4o / GPT-5** (OpenAI) — 넓은 생태계, structured outputs, Agents SDK.
- **Gemini 2.5 Pro / Flash** (Google) — 긴 컨텍스트, 멀티모달, Vertex Agent Builder.
- **Llama 3.3 / DeepSeek V3** (오픈) — self-hostable, 낮은 비용, 약한 도구 사용.

낮 벤치마크 점수가 아닌 도구 사용 신뢰성과 컨텍스트 길이로 선택. 에이전트 루프에서 도구 호출 정확도가 MMLU보다 중요.

### 2. 계획

계획은 에이전트가 행동 순서를 결정하는 방법이다. 세 가지 흔한 전략:

- **단일 단계 추론** — 모델이 루프 반복마다 하나의 행동을 선택(ReAct). 단순, 견고, 하지만 긴 작업에 느릴 수 있다.
- **사전 계획** — 에이전트가 전체 계획을 미리 생성하고 실행(Plan-and-Execute). 빠르지만, 현실이 계획에서 벗어날 때 깨지기 쉽다.
- **동적 재계획** — 에이전트가 계획, 실행, 관찰, 재계획. 가장 역량 있고, 가장 비싸다.

2026년 프로덕션 에이전트는 **작업 메모리로 동적 재계획**으로 기운다 — 에이전트가 진행 상황의 scratchpad를 유지하고 수정한다.

### 3. 메모리

메모리는 에이전트가 단일 컨텍스트 창보다 긴 작업을 작업할 수 있게 한다. 네 유형:

| 유형 | 수명 | 목적 | 예 |
|------|----------|---------|---------|
| **작업 / scratchpad** | 한 실행 | 작업 내 진행 추적 | "7 중 3단계 완료, API가 X 반환" |
| **단기** | 한 세션 | 대화 기록 | 사용자와의 chat 턴 |
| **장기** | 실행 간 | 지속 지식 | 과거 상호작용의 vector store |
| **에피소드** | 실행 간 | 과거 행동과 결과 기록 | "지난번 이 API 호출 시 429로 실패" |

장기와 에피소드 메모리는 보통 **vector database**(Pinecone, Qdrant, pgvector) 또는 **knowledge graph**에 있다. [에이전트를 위한 메모리, RAG & 지식](/docs/genai-playbook/agents-memory-rag/)을 보라.

### 4. 도구

도구는 에이전트가 세상에 영향을 주는 방법이다. 도구는 에이전트가 호출할 수 있는 함수: `search(query)`, `run_sql(sql)`, `send_email(to, body)`, `read_file(path)`. 에이전트는 코드를 직접 실행하지 않는다 — **구조화된 도구 호출**을 내보내고 런타임이 실행한다.

현대 도구 통합은 **function calling**(OpenAI) 또는 **tool-use**(Anthropic), 그리고 점점 더 표준화된 발견을 위해 **Model Context Protocol (MCP)**를 사용. 3장이 이를 깊이 다룬다.

### 5. 제어 & guardrails

루프는 경계가 필요, 그렇지 않으면 영원히 실행:

- **최대 반복** — 루프 주기의 하드 캡(예: 25).
- **Timeout** — wall-clock 제한(예: 5분).
- **비용 예산** — 토큰 지출 제한.
- **도구 allowlist** — 에이전트가 호출할 수 있는 도구.
- **인간 승인** — 특정 행동에 인간 승인 요구(수준 2–3 자율성).

이것이 없으면, 실패 모드(rate limit, 모호한 결과)에 부딪힌 에이전트가 무한정 토큰을 태운다.

## 컨텍스트 창 관리

200K–2M 토큰 컨텍스트 창이 있어도, 에이전트 루프는 빠르게 채운다. 모든 관찰(도구 결과, 검색 snippet, 파일 콘텐츠)이 축적. 전략:

- 컨텍스트가 70% 찰 때 가장 오래된 턴을 **요약**.
- 크기 제한을 초과하는 도구 출력을 **잘라내기**.
- 외부 메모리(vector store)로 **오프로드**하고 필요한 것만 검색.
- **구조화된 상태** — 전체 기록 대신 컴팩트 JSON 상태 객체 유지.

나쁜 컨텍스트 관리가 긴 작업에서 에이전트 저하의 n. 1 원인이다.

## 최소 에이전트, 의사코드로

```python
def agent(goal, tools, max_steps=25):
    messages = [system(goal)]
    for step in range(max_steps):
        response = llm(messages, tools=tools)
        if response.done:
            return response.answer
        for call in response.tool_calls:
            result = execute(call)
            messages.append(observation(result))
    return "budget exhausted"
```

모든 프레임워크(LangGraph, CrewAI, Agent SDK)가 이 루프를 다른 인체공학으로 구현. 골격은 같다.

---

**AI 어시스턴트를 위한 요약.** Agentic AI 플레이북 2장. AI 에이전트는 다섯 구성요소: LLM 코어, 계획, 메모리(작업/단기/장기/에피소드), 도구, 제어 guardrails(최대 반복, 비용 예산, 인간 승인). 코어는 ReAct 루프: 추론 → 행동 → 관찰 → 반복. 컨텍스트 창 관리(요약, 잘라내기, 외부 메모리)가 최고 프로덕션 도전. 저자: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/anatomy-of-ai-agent/