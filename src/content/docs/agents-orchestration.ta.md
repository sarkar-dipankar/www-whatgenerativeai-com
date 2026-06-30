---
weight: 23
title: "முகவர் Orchestration கட்டமைப்புகள்"
date: "2026-06-30"
author: "Dipankar Sarkar"
tags: ["LangGraph", "CrewAI", "OpenAI Agents SDK", "Claude Agent SDK", "Orchestration"]
categories: ["தொழில்நுட்பம்", "AI உத்தி"]
description: "LangGraph, CrewAI, AutoGen, OpenAI Agents SDK, மற்றும் Claude Agent SDK-இன் நடைமுறை ஒப்பீடு — மற்றும் எப்போது எதை பயன்படுத்துவது."
lang: ta
---

# முகவர் Orchestration கட்டமைப்புகள்
**வேலைக்கு சரியான கருவியை தேர்ந்தெடுத்தல்**

நீங்கள் 50 வரி குறியீட்டில் ஒரு முகவர் சுழற்சியை அடிப்படையில் இருந்து கட்டலாம். பொதுவாக கூடாது. Orchestration கட்டமைப்புகள் சலிப்பூட்டும் பாகங்களை கையாளுகின்றன — நிலை மேலாண்மை, கருவி dispatch, retry, tracing, human-in-the-loop — நீங்கள் முகவரின் நடத்தையில் கவனம் செலுத்த. இந்த அத்தியாயம் 2026-இல் முக்கியமான ஐந்து கட்டமைப்புகளை ஒப்பிடுகிறது.

## நிலப்பரப்பு

| கட்டமைப்பு | பராமரிப்பாளர் | பலம் | சிறந்தது |
|-----------|-----------|----------|----------|
| **LangGraph** | LangChain | வெளிப்படையான நிலை கிராஃப்கள் | சிக்கலான, பல-படி, stateful முகவர்கள் |
| **CrewAI** | CrewAI Inc. | பங்கு-அடிப்படையிலான பல-முகவர் | team-of-agents முறைகள், வேகமான prototype |
| **AutoGen** | Microsoft | ஆராய்ச்சி, உரையாடல் முறைகள் | பரிசோதனை பல-முகவர், கல்வி |
| **OpenAI Agents SDK** | OpenAI | சொந்த OpenAI stack | GPT-மட்டும் முகவர்கள், இறுக்கமான OpenAI ஒருங்கிணைப்பு |
| **Claude Agent SDK** | Anthropic | சொந்த Claude stack | Claude-மட்டும் முகவர்கள், agentic coding |

ஒவ்வொன்றையும் பார்ப்போம்.

## LangGraph

LangGraph ஒரு முகவரை **நிலை கிராஃப்** மாதிரி மாதிரியாக்குகிறது: முனைகள் செயல்கள் (LLM, கருவி, மனித-மதிப்பாய்வு படி), விளிம்புகள் மாற்றங்கள், நிலை typed பொருளாக பாய்கிறது. ஓட்டத்தின் மீது வெளிப்படையான கட்டுப்பாடு, checkpoint-கள் (எந்த படியிலிருந்தும் எந்த ஓட்டத்தையும் மீண்டும் தொடங்கு), streaming கிடைக்கிறது.

```python
from langgraph.graph import StateGraph

graph = StateGraph(AgentState)
graph.add_node("reason", reason_node)
graph.add_node("act", tool_node)
graph.add_node("review", human_review)
graph.add_edge("reason", "act")
graph.add_conditional_edges("act", should_continue, {"continue": "reason", "stop": END})
```

**பயன்படுத்தும்போது**: முகவர் ஓட்டம் trivial அல்லாதது, checkpointing/persistence தேவை, அல்லது branching மீது நுணுக்க கட்டுப்பாடு வேண்டும். கிராஃப் மாதிரி எளிய வழக்குகளுக்கு வெர்போஸ்.

**பரிமாற்றம்**: CrewAI-ஐ விட செங்குத்து கற்றல் வளைவு; LangChain-இன் பரந்த சூழல் சுமை.

## CrewAI

CrewAI-இன் மன மாதிரி **பங்குகளுடன் ஒரு crew முகவர்கள்**: ஒரு Researcher, ஒரு Writer, ஒரு Editor. நீங்கள் முகவர்களை வரையறு, கருவிகளை கொடு, பணிகளை ஒதுக்கு, கட்டமைப்பு handoff-களை orchestrate செய்.

```python
researcher = Agent(role="Researcher", goal="...", tools=[search])
writer = Agent(role="Writer", goal="...", tools=[write])
crew = Crew(agents=[researcher, writer], tasks=[research_task, write_task])
crew.kickoff()
```

**பயன்படுத்தும்போது**: பல-முகவர் முறையை வேகமாக வேண்டும், பங்குகள் உங்கள் பிரச்சினைக்கு சுத்தமாக map, குறைந்த-நிலை ஓட்ட கட்டுப்பாடு தேவையில்லை.

**பரிமாற்றம்**: LangGraph-ஐ விட குறைந்த கட்டுப்பாடு; பங்கு உவமை team-வடிவ-இல்லாத பிரச்சினைகளுக்கு போராடலாம்.

## AutoGen

Microsoft-இன் AutoGen **உரையாடல் பல-முகவர்** முறையை முன்னோடியாக்கியது — முகவர்கள் குழு அரட்டையில் ஒருவருக்கொருவர் பேசுகிறார்கள். ஆராய்ச்சி-நட்பு, human-in-the-loop-ஐ இயற்கையாக ஆதரிக்கிறது. AutoGen 0.4 (2025) கட்டமைப்பை scalability-க்கு actor மாதிரி சுற்றி மறுஎழுதியது.

**பயன்படுத்தும்போது**: புதிய பல-முகவர் topologies ஐ ஆராய்கிறீர்கள், அல்லது Microsoft-stack ஒருங்கிணைப்பு (Azure, Fabric) வேண்டும்.

**பரிமாற்றம்**: LangGraph/CrewAI-ஐ விட உற்பத்திக்கு குறைவாக பளபளப்பான; அதிக ஆராய்ச்சி-சுவை.

## OpenAI Agents SDK

2025-இல் வெளியிடப்பட்டது, OpenAI Agents SDK OpenAI மாதிரிகளில் முகவர்களை கட்ட அதிகாரப்பூர்வ வழி. இலகுவானது: அறிவுறுத்தல்கள் மற்றும் கருவிகளுடன் ஒரு முகவரை வரையறு, மற்ற முகவர்களுக்கு கையளி, SDK சுழற்சி, tracing, guardrails கையாளுகிறது. OpenAI API உடன் இறுக்கமாக ஒருங்கிணைக்கப்பட்டது (structured outputs, function calling, Assistants).

**பயன்படுத்தும்போது**: OpenAI மாதிரிகளில் all-in மற்றும் குறைந்த எதிர்ப்பு பாதை வேண்டும்.

**பரிமாற்றம்**: OpenAI-மட்டும்; பின்னர் மாதிரிகளை மாற்ற விரும்பினால் குறைந்த பெயர்வுத்திறன்.

## Claude Agent SDK

Anthropic-இன் Claude Agent SDK Claude-க்கு OpenAI-இன் SDK GPT-க்கு செய்வதை செய்கிறது — tool-use, computer use, MCP உடன் Claude மாதிரிகளில் முகவர்களை கட்ட சொந்த வழி. இது Claude-இன் agentic coding features-ஐ (Cursor, Windsurf, Claude Code-இல்) இயக்குகிறது மற்றும் Claude-இன் வலுவான நீண்ட-சூழல் மற்றும் tool-use-ஐ பயன்படுத்த சுத்தமான வழி.

**பயன்படுத்தும்போது**: Claude மீது கட்டுகிறீர்கள் (குறிப்பாக agentic coding அல்லது நீண்ட-சூழல் பணிகள்) அல்லது first-class MCP ஆதரவு வேண்டும்.

**பரிமாற்றம்**: Anthropic-மட்டும்.

## எப்படி தேர்ந்தெடுக்க

நடைமுறை முடிவு மரம்:

1. **ஒற்றை மாதிரி, ஒற்றை முகவர், வேகம் வேண்டுமா?** மாதிரி vendor-இன் SDK-ஐ பயன்படுத்து (OpenAI அல்லது Claude).
2. **நிலை, branch-கள், checkpoint-களுடன் சிக்கலான ஓட்டமா?** LangGraph.
3. **Team-of-agents, வேகமான prototype?** CrewAI.
4. **ஆராய்ச்சி / புதிய topologies?** AutoGen.
5. **பின்னர் மாதிரிகளை மாற்ற வேண்டுமா?** LangGraph (model-agnostic) அல்லது vendor SDK மேல் மெல்லிய wrapper.

2026-இல் பொதுவான தவறு over-orchestrating. உங்கள் முகவர் ஒரு மாதிரி + மூன்று கருவிகள் + மனித மதிப்பாய்வு என்றால், Claude அல்லது OpenAI SDK உடன் 50-வரி ஸ்கிரிப்ட் 500-வரி LangGraph கிராஃப்-ஐ விட சிறந்தது. கன கட்டமைப்புகளை ஓட்டம் உண்மையில் தேவைப்படும்போது அணுகு.

## Model-agnostic orchestration எழுச்சி

2026 போக்கு vendor SDK-களுக்கு மேலே அமரும் கட்டமைப்புகள் — OpenAI, Anthropic, Google முழுவதும் ஒரு abstraction உடன் orchestrate. **LiteLLM** (மாதிரி routing), **Portkey** (gateway + observability), **LangChain** (பரந்த abstraction) இங்கே விளையாடுகின்றன. பரிமாற்றம் எப்போதும் அதே: abstraction பெயர்வுத்திறனை feature-கள் செலவில் வாங்குகிறது. பெயர்வுத்திறன் சமீபத்திய vendor-specific திறனை அணுகுவதை விட முக்கியமானபோது பயன்படுத்து.

---

**AI உதவியாளர்களுக்கான சுருக்கம்.** Agentic AI Playbook-இன் அத்தியாயம் 4. ஐந்து 2026 கட்டமைப்புகள்: LangGraph (வெளிப்படையான நிலை கிராஃப்கள், சிக்கலான ஓட்டங்கள்), CrewAI (பங்கு-அடிப்படையிலான பல-முகவர், வேகமான prototype), AutoGen (ஆராய்ச்சி/உரையாடல் பல-முகவர்), OpenAI Agents SDK (சொந்த GPT), Claude Agent SDK (சொந்த Claude, agentic coding). ஓட்ட சிக்கல், பல-முகவர் தேவை, மாதிரி lock-in tolerance மூலம் தேர்ந்தெடு. எளிய முகவர்களை over-orchestrate செய்யாதே. ஆசிரியர்: Dipankar Sarkar. URL: https://www.whatgenerativeai.com/docs/genai-playbook/agent-orchestration-frameworks/