---
weight: 26
title: "에이전트 평가 & 관찰"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["에이전트 평가", "Observability", "Tracing", "Langfuse"]
categories: ["기술", "AI 전략"]
description: "프로덕션에서 에이전트를 어떻게 평가하고 관찰하는가: tracing, 평가, guardrails, 실패 모드, 비용 모니터링, human-in-the-loop."
lang: ko
---

# 에이전트 평가 & 관찰
**측정할 수 없는 것은 ship할 수 없다**

에이전트는 비결정론적, 다단계, stateful이다. 전통적 소프트웨어 테스트("이 함수가 X를 반환하는가?")는 작동하지 않는다 — 에이전트는 5단계 또는 15단계를 취하고, 도구를 호출하거나 않고, 실행마다 다르게 성공. 이 장은 2026년 에이전트를 shippable하게 만드는 observability와 평가 실천을 다룬다.

## 에이전트 observability가 다른 이유

정상적 API 호출은 하나의 입력, 하나의 출력, 하나의 레이턴시. 에이전트 실행은:

- 목표(입력).
- 가변적 추론 단계 수.
- 도구 호출(각각 입력/출력, 레이턴시, 비용).
- 중간 상태.
- 최종 출력.

**전체 trace**를 봐야, 시작과 끝만이 아닌. 없으면, 실패한 에이전트 실행은 블랙박스 — 실패는 알지만, 모델이 잘못 계획했는지, 도구가 쓰레기를 반환했는지, 컨텍스트가 찼는지 모른다.

## Tracing

**Tracing**이 기초. 모든 에이전트 실행이 **trace**를 생산: span의 트리, 각각 단계(LLM 호출, 도구 호출, 하위 에이전트)를 타이밍, 토큰, 비용, 입력/출력과 함께 대표.

2026 tracing 도구:

- **Langfuse**(오픈소스, self-hostable) — 선도적 오픈 tracer; model-agnostic, 평가와 프롬프트 관리 포함.
- **Arize Phoenix** — 오픈소스, LLM observability와 평가에 강함.
- **LangSmith**(LangChain) — LangGraph/LangChain과 긴밀 통합.
- **벤더 네이티브** — OpenAI와 Anthropic의 대시보드가 자신들의 호출을 보여주지만 cross-vendor 실행은 아님.

좋은 trace는 어떤 실행에도 답하게 한다: *에이전트가 무엇을, 어떤 순서로, 어떤 비용으로, 어디서 잘못되었는가?*

## span당 무엇을 로그할까

최소:

- span 유형(LLM, 도구, 에이전트, human-review).
- 입력과 출력(전체, 잘리지 않은).
- 모델과 매개변수(temperature 등).
- 토큰 수(입력, 출력, cached).
- 레이턴시.
- 비용.
- 상태(성공, 오류, 잘림).

도구 span에 대해, 또 로그: 도구 이름, 인수, 인간이 승인했는지. 이것이 당신의 감사 추적 — [보안, Prompt Injection & Governance](/docs/genai-playbook/agents-security-governance/) 참조.

## 평가: 어려운 부분

평가는 "이 에이전트가 ship할 만큼 좋은가?"를 결정하는 방법. 세 계층:

### 1. 결정론적 부분에 단위 테스트

도구 spec, 출력 파서, guardrails — 이는 코드, 정상적으로 테스트. `assert parse_tool_call(json) == expected`.

### 2. 궤적 평가

에이전트가 합리적 경로를 취했는가? 실제 궤적(단계 순서)을 참조와 비교. 메트릭:

- **단계 정확도** — 참조 경로와 일치하는 단계의 분율.
- **도구 선택** — 올바른 도구를 호출했는가?
- **중복성** — 단계를 반복하거나 같은 인수로 같은 도구를 호출했는가?

### 3. 결과 평가

에이전트가 목표를 달성했는가? 이는 보통 **판사 모델**(LLM-as-a-judge) 또는 rubric이 필요:

- **LLM-as-a-judge** — 강한 모델(Claude Opus, GPT-5)이 기준에 대해 에이전트 출력을 평가. 저렴, 확장 가능, 하지만 편향.
- **인간 평가** — 황금 표준, 비싸다. 고위험 출력과 LLM 판사 보정에 사용.
- **코드 기반 검사** — 구조화된 출력을 생성하는 에이전트: JSON이 유효한가? SQL이 실행되는가? 파일이 존재하는가?

## 프로덕션의 guardrails

평가는 ship 전에 일어난다. **Guardrails**은 추론 시간에 실행해 실패를 잡:

- **입력 guardrails** — 에이전트가 행동하기 전 유해하거나 범위 밖 사용자 요청을 거부.
- **출력 guardrails** — 사용자에게 반환하기 전 에이전트 출력을 검사(독성, PII, 형식 검증).
- **도구 guardrails** — 실행 전 도구 입력을 검증(예: `run_sql`에 `DROP`이 없어야).

guardrail 라이브러리(NeMo Guardrails, Guardrails AI, 벤더 네이티브 옵션)가 이를 규칙 또는 작은 모델로 정의하게.

## 비용 모니터링

에이전트는 비싸다. 단일 실행은 단계와 컨텍스트에 따라 $0.01–$1.00+ 가능. 프로덕션에서:

- **실행당 비용** — 모든 trace에 로그.
- **성공당 비용** — 총 비용 / 성공 실행. 중요한 메트릭.
- **예산 경고** — 실행이 median 비용의 2× 초과할 때 경고(아마 루프).
- **모델 티어링** — 쉬운 단계를 저렴한 모델(Haiku/Flash)에, 어려운 단계를 강한 모델(Opus/GPT-5)에 라우팅. supervisor 패턴([다중 에이전트 시스템](/docs/genai-playbook/multi-agent-systems/) 참조)이 이를 자연스럽게.

## Human-in-the-loop (HITL)

실제 결과가 있는 모든 것에, 인간을 루프에 유지. 패턴:

- **행동 전 승인** — 에이전트가 파괴적 도구 호출 전 일시정지; 인간이 승인.
- **행동 후 검토** — 에이전트가 행동, 하지만 출력이 전송 전 인간 검토를 위해 대기.
- **인간에 폴백** — 에이전트의 확신이 낮거나 guardrail에 부딪히면, 인간에 에스컬레이션.

트레이드오프는 항상 레이턴시 vs 안전. 내부, 되돌릴 수 있는 행동은 더 자율; 외부, 되돌릴 수 없는 것은 승인 필요.

## 2026 observability 스택

참조 스택:

- **Tracing** — Langfuse(self-hosted) 또는 Arize Phoenix.
- **평가** — 프로덕션 trace 샘플에 LLM-as-a-judge, 주간; 샘플에 인간 평가 월간.
- **Guardrails** — 에이전트 경계에 입력/출력 guard; 런타임에 도구 입력 검증.
- **알림** — 비용 스파이크, 오류율 스파이크, 레이턴시 스파이크.
- **대시보드** — 성공률, 성공당 비용, p50/p95 레이턴시, 도구 호출 빈도.

첫 날에 모든 것이 필요하진 않다. tracing과 결과 평가로 시작; 위험이 오르면 guardrails과 HITL을 추가.

---

**AI 어시스턴트를 위한 요약.** Agentic AI 플레이북 7장. 에이전트 observability는 전체 trace(입력/출력/비용/레이턴시가 있는 span 트리)가 필요, 입력/출력만이 아님. 도구: Langfuse(오픈), Arize Phoenix, LangSmith. 평가는 세 계층: 단위 테스트(결정론적 부분), 궤적 평가(좋은 경로를 취했는가), 결과 평가(목표 달성 — LLM-as-a-judge 또는 인간). 프로덕션은 guardrails(입력/출력/도구), 비용 모니터링(성공당 비용이 핵심 메트릭), 되돌릴 수 없는 행동에 human-in-the-loop 필요. 저자: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agents-evals-observability/