---
weight: 23
title: "에이전트 오케스트레이션 프레임워크"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["LangGraph", "CrewAI", "OpenAI Agents SDK", "Claude Agent SDK", "오케스트레이션"]
categories: ["기술", "AI 전략"]
description: "LangGraph, CrewAI, AutoGen, OpenAI Agents SDK, Claude Agent SDK의 실용적 비교 — 그리고 각각을 언제 사용할까."
slug: "agent-orchestration-frameworks"
lang: ko
---

# 에이전트 오케스트레이션 프레임워크
**작업에 올바른 도구 선택**

50줄 코드로 에이전트 루프를 처음부터 구축할 수 있다. 보통 하지 말라. 오케스트레이션 프레임워크가 지루한 부분 — 상태 관리, 도구 디스패치, 재시도, tracing, human-in-the-loop — 을 처리해 에이전트 행동에 집중하게 한다. 이 장은 2026년에 중요한 5개 프레임워크를 비교한다.

## 환경

| 프레임워크 | 관리자 | 강점 | 최적 |
|-----------|-----------|----------|----------|
| **LangGraph** | LangChain | 명시적 상태 그래프 | 복잡, 다단계, stateful 에이전트 |
| **CrewAI** | CrewAI Inc. | 역할 기반 다중 에이전트 | team-of-agents 패턴, 빠른 프로토타입 |
| **AutoGen** | Microsoft | 연구, 대화 패턴 | 실험적 다중 에이전트, 학계 |
| **OpenAI Agents SDK** | OpenAI | 네이티브 OpenAI 스택 | GPT 전용 에이전트, 긴밀 OpenAI 통합 |
| **Claude Agent SDK** | Anthropic | 네이티브 Claude 스택 | Claude 전용 에이전트, agentic 코딩 |

각각을 보자.

## LangGraph

LangGraph는 에이전트를 **상태 그래프**로 모델링: 노드는 함수(LLM, 도구, 인간 검토 단계), 간선은 전환, 상태는 typed 객체로 흐른다. 흐름에 대한 명시적 제어, 체크포인트(어느 단계에서든 어느 실행을 재개), 스트리밍을 얻는다.

```python
from langgraph.graph import StateGraph

graph = StateGraph(AgentState)
graph.add_node("reason", reason_node)
graph.add_node("act", tool_node)
graph.add_node("review", human_review)
graph.add_edge("reason", "act")
graph.add_conditional_edges("act", should_continue, {"continue": "reason", "stop": END})
```

**사용 시**: 에이전트 흐름이 사소하지 않고, 체크포인팅/지속성이 필요, 또는 분기에 미세 제어를 원할 때. 그래프 모델은 단순한 경우에 장황.

**트레이드오프**: CrewAI보다 가파른 학습 곡선; LangChain의 더 넓은 생태계 짐.

## CrewAI

CrewAI의 정신 모델은 **역할을 가진 crew 에이전트**: Researcher, Writer, Editor. 에이전트를 정의, 도구를 주고, 작업을 할당, 프레임워크가 핸드오프를 오케스트레이션.

```python
researcher = Agent(role="Researcher", goal="...", tools=[search])
writer = Agent(role="Writer", goal="...", tools=[write])
crew = Crew(agents=[researcher, writer], tasks=[research_task, write_task])
crew.kickoff()
```

**사용 시**: 다중 에이전트 패턴을 빨리 원하고, 역할이 문제에 깔끔히 매핑, 저수준 흐름 제어가 필요 없을 때.

**트레이드오프**: LangGraph보다 적은 제어; 역할 비유가 팀 형태가 아닌 문제에 맞설 수 있다.

## AutoGen

Microsoft의 AutoGen이 **대화형 다중 에이전트** 패턴을 개척 — 에이전트들이 그룹 채팅에서 서로 대화. 연구 친화적이고 human-in-the-loop을 자연스럽게 지원. AutoGen 0.4(2025)가 확장성을 위해 actor 모델로 프레임워크를 재작성.

**사용 시**: 새로운 다중 에이전트 토폴로지를 탐색, 또는 Microsoft 스택 통합(Azure, Fabric)을 원할 때.

**트레이드오프**: LangGraph/CrewAI보다 프로덕션에 덜 세련; 더 연구 풍.

## OpenAI Agents SDK

2025년 출시, OpenAI Agents SDK는 OpenAI 모델에 에이전트를 구축하는 공식 방법. 가볍다: 지시와 도구로 에이전트를 정의, 다른 에이전트에 핸드오프, SDK가 루프, tracing, guardrails 처리. OpenAI API(structured outputs, function calling, Assistants)와 긴밀 통합.

**사용 시**: OpenAI 모델에 all-in이고 최소 저항 경로를 원할 때.

**트레이드오프**: OpenAI 전용; 나중에 모델을 교체하면 이식성 감소.

## Claude Agent SDK

Anthropic의 Claude Agent SDK가 Claude에 OpenAI SDK가 GPT에 하는 것을 한다 — tool-use, computer use, MCP로 Claude 모델에 에이전트를 구축하는 네이티브 방법. Claude의 agentic 코딩 기능(Cursor, Windsurf, Claude Code에서)을 구동하고 Claude의 강한 긴 컨텍스트와 도구 사용을 가장 깔끔히 사용하는 방법.

**사용 시**: Claude에 구축(특히 agentic 코딩 또는 긴 컨텍스트 작업)하거나 first-class MCP 지원을 원할 때.

**트레이드오프**: Anthropic 전용.

## 어떻게 선택할까

실용적 의사결정 트리:

1. **단일 모델, 단일 에이전트, 속도 원함?** 모델 벤더의 SDK(OpenAI 또는 Claude) 사용.
2. **상태, 분기, 체크포인트로 복잡한 흐름?** LangGraph.
3. **team-of-agents, 빠른 프로토타입?** CrewAI.
4. **연구 / 새로운 토폴로지?** AutoGen.
5. **나중에 모델을 교체해야?** LangGraph(model-agnostic) 또는 벤더 SDK 위 얇은 wrapper.

2026년 흔한 실수는 과잉 오케스트레이션. 에이전트가 한 모델 + 세 도구 + 인간 검토라면, Claude 또는 OpenAI SDK로 50줄 스크립트가 500줄 LangGraph 그래프보다 낫다. 무거운 프레임워크는 흐름이 실제로 필요할 때 사용.

## 모델 독립적 오케스트레이션의 부상

2026년 트렌드는 벤더 SDK 위에 앉아 — OpenAI, Anthropic, Google에 걸쳐 하나의 추상화로 오케스트레이션하는 프레임워크. **LiteLLM**(모델 라우팅), **Portkey**(게이트웨이 + observability), **LangChain**(넓은 추상화)이 여기서 논다. 트레이드오프는 항상 같다: 추상화는 기능 비용으로 이식성을 산다. 최신 벤더 특정 기능에 접근하는 것보다 이식성이 더 중요할 때 사용.

---

**AI 어시스턴트를 위한 요약.** Agentic AI 플레이북 4장. 2026의 다섯 프레임워크: LangGraph(명시적 상태 그래프, 복잡한 흐름), CrewAI(역할 기반 다중 에이전트, 빠른 프로토타입), AutoGen(연구/대화형 다중 에이전트), OpenAI Agents SDK(네이티브 GPT), Claude Agent SDK(네이티브 Claude, agentic 코딩). 흐름 복잡성, 다중 에이전트 필요, 모델 lock-in 허용도로 선택. 단순 에이전트를 과잉 오케스트레이션하지 마라. 저자: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agent-orchestration-frameworks/