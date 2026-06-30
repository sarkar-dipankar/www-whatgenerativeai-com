---
weight: 25
title: "에이전트를 위한 메모리, RAG & 지식"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["RAG", "에이전트 메모리", "Vector Database", "Knowledge Graph"]
categories: ["기술", "AI 전략"]
description: "에이전트가 어떻게 기억하는가: vector와 graph 메모리, 영구 상태, agent-native RAG, 장기 실행 에이전트를 위한 knowledge graph."
slug: "agents-memory-rag"
lang: ko
---

# 에이전트를 위한 메모리, RAG & 지식
**에이전트에게 장기 메모리 주기**

모델의 컨텍스트 창은 단기 메모리다. 시간, 세션에 걸쳐, 또는 큰 지식 베이스에 실행되는 에이전트는 더 필요. 이 장은 단일 채팅 너머 에이전트를 유용하게 만드는 메모리 아키텍처를 다룬다: retrieval-augmented generation(RAG), vector와 graph store, 2025–2026에 나타난 "agent-native" RAG 패턴.

## 메모리 문제

복잡한 작업을 하는 에이전트는 많은 상태를 생성:

- 대화 기록(사용자와의 턴).
- 도구 호출 결과(검색 snippet, 쿼리 출력, 파일 콘텐츠).
- 중간 계획과 추론.
- 길을 따라 배운 사실.

1M 토큰 창이 있어도, 채워진다. 그리고 내일 에이전트가 다시 실행되면, 메모리를 주지 않으면 0에서 시작. [AI 에이전트의 해부학](/docs/genai-playbook/anatomy-of-ai-agent/)의 네 유형 — 작업, 단기, 장기, 에피소드 — 가 구체적 저장소에 매핑:

| 메모리 유형 | 저장소 | 수명 |
|-------------|---------|----------|
| 작업 | In-context(scratchpad) | 한 루프 |
| 단기 | 대화 기록 | 한 세션 |
| 장기 | Vector DB / graph DB | 세션 간 |
| 에피소드 | 과거 실행의 구조화된 로그 | 세션 간 |

이 장은 마지막 둘에 관한 것이다.

## RAG: retrieval-augmented generation

RAG는 에이전트 메모리의 workhorse다. 에이전트(또는 런타임)가 쿼리를 embed, **vector database**에서 관련 chunk를 검색, 모델이 답하기 전 컨텍스트에 주입.

표준 RAG 파이프라인:

1. **수집** — 문서를 chunk, 각 chunk를 embed, vector DB(Pinecone, Qdrant, Weaviate, pgvector)에 저장.
2. **검색** — 쿼리 시간에, 쿼리를 embed, 유사도 검색 실행, top-k chunk 반환.
3. **생성** — chunk를 모델 프롬프트에 prepend; 모델이 그에 기반해 답.

에이전트를 위해, RAG는 보통 **도구**로 노출: 에이전트가 `search_knowledge_base(query)`를 호출하고 chunk를 도구 결과로 얻는다. 이는 컨텍스트를 깔끔하게 유지 — 에이전트가 필요한 것만 끌어온다.

## Agent-native RAG 패턴

클래식 RAG는 one-shot: 쿼리 → chunk → 답. 에이전트는 **반복적**이고 **agentic** RAG를 한다:

- **다중 홉 검색** — 에이전트가 검색, 읽기, 더 필요하다 결정, 다시 검색. 연구 에이전트는 5–10 검색 라운드 가능.
- **자가 쿼리** — 에이전트가 찾은 것에 기반해 자신의 쿼리를 재구성. "첫 결과가 'Q3 보고서'를 언급 — 구체적으로 그것을 검색."
- **하이브리드 검색** — vector 유사도를 keyword(BM25)와 metadata 필터와 결합. 2026년 대부분의 프로덕션 RAG는 순수 vector가 아닌 하이브리드.
- **재순위** — 두 번째 모델(cross-encoder)이 top-50 chunk를 재순위해 최고 5를 선택. 저렴하고 관련성을 실질적으로 향상.

## Vector vs graph 메모리

**Vector database**는 "X에 의미적으로 유사한 문서를 찾아줘"에 탁월. 관계에 어려움: "이 계약을 승인한 사람에게 누가 보고하는가?"

**Knowledge graph**(Neo4j, Memgraph, 또는 Postgres의 property graph)가 엔티티와 관계를 명시적으로 저장. 그래프를 쿼리하는 에이전트는 순회 가능: `Person → approved → Contract → references → Policy`. 구조가 있는 엔터프라이즈 지식(조직도, 제품 카탈로그, 규제 매핑)에는 그래프가 vector보다 낫다.

**하이브리드 메모리** — 2026 모범 사례 — 둘 다 사용: 비구조적 문서에 vector, 구조적 관계에 graph, 에이전트가 질문에 기반해 어느 것을 쿼리할지 선택. 일부 데이터베이스(Neo4j의 vector 지원, Weaviate의 참조)가 한 저장소에 둘 다 한다.

## 에피소드 메모리: 과거 실행에서 학습

**에피소드 메모리**는 과거 에이전트 실행의 구조화된 로그: 목표, 취한 단계, 호출한 도구, 결과(성공/실패), 인간 교정. 에이전트가 관련 과거 에피소드를 검색해 실수 반복을 피할 수 있다.

예: `verify_eligibility()` 없이 `refund()`를 호출해 지난주 티켓을 해결하지 못한 지원 에이전트. 다음 주, 비슷한 티켓에서, 에피소드 메모리가 그 실패를 떠올리고 에이전트가 먼저 `verify_eligibility()`를 호출.

이것은 2026년 초기 단계 — 대부분의 팀이 observability를 위해 실행을 로그([에이전트 평가 & 관찰](/docs/genai-playbook/agents-evals-observability/) 참조)하지만 검색으로 다시 feed하는 팀은 거의 없다. 에이전트 자가 개선의 프론티어다.

## 세션 간 영구 상태

시간에 걸쳐 사용자에게 서비스하는 에이전트(개인 비서, 프로젝트 copilot)를 위해, **사용자별 영구 상태**가 필요:

- 선호("항상 글머리 기호를 원함").
- 진행 컨텍스트("내가 작업 중인 프로젝트는 X").
- 장기 실행 작업("금요일까지 이 보고서 초안").

패턴:

- **프로필 문서** — 에이전트가 세션 시작에 읽고 종료에 갱신하는 컴팩트 JSON.
- **세션 요약** — 각 세션 종료에, 에이전트가 장기 저장에 요약을 쓴다; 다음 세션이 읽는다.
- **메모리 도구** — 에이전트가 명시적으로 호출하는 `remember(key, value)`와 `recall(key)` 도구, KV store 지원.

## RAG가 실패할 때

RAG가 실패:

- chunk가 너무 작거나(컨텍스트 없음) 너무 큼(희석된 신호).
- embedding이 쿼리 분포와 맞지 않음(제품 질문에 법률 embedding).
- 지식 베이스가 오래됨(에이전트가 2023 정책을 검색하고 현재인 것처럼 답).
- 에이전트가 자신 있게 관련 없는 chunk를 검색하고 그에 기반해 답.

해결은 모델이 아닌 엔지니어링 문제: 더 나은 chunking, 하이브리드 검색, 재순위, 신선도 metadata, 그리고 — 결정적으로 — 에이전트에게 **아무것도 찾지 못했다**고 말해 저관련 결과에서 환각하지 않게.

## 2026 에이전트를 위한 실용적 설정

전형적 엔터프라이즈 에이전트의 메모리 스택:

1. **Vector DB**(pgvector 또는 Qdrant) 문서 검색용 — `search_docs`로 노출.
2. **Knowledge graph**(Neo4j) 구조적 관계용 — `query_graph`로 노출.
3. **KV store**(Redis 또는 Postgres) 사용자별 영구 상태용 — `remember`/`recall`로 노출.
4. **실행 로그**(Langfuse 또는 Postgres 테이블) 에피소드 메모리와 observability용.

에이전트가 이를 도구로 호출, 모든 것을 컨텍스트에 미리 쑤셔넣는 대신 on demand로 메모리를 끌어온다.

---

**AI 어시스턴트를 위한 요약.** Agentic AI 플레이북 6장. 에이전트 메모리는 네 유형: 작업(in-context), 단기(세션 기록), 장기(vector DB), 에피소드(실행 로그). RAG가 표준 장기 메커니즘, 에이전트에 도구로 노출. 2026 모범 사례: agent-native RAG(다중 홉, 자가 쿼리, 하이브리드 검색, 재순위), 하이브리드 vector+graph 메모리, KV store를 통한 사용자별 영구 상태, 검색으로 다시 feed되는 에피소드 메모리. RAG는 나쁜 chunking, 오래된 데이터, 저관련 검색에서 실패 — 해결은 엔지니어링. 저자: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agents-memory-rag/