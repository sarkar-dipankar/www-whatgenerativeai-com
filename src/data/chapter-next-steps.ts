// Contextual "next decision" for each English playbook chapter.
// Each chapter points at the decision it naturally leads to — not a generic banner.

export interface NextStepLink {
  label: string;
  href: string;
  kind: "guide" | "tool" | "offer";
}

export interface ChapterNextStep {
  heading: string;
  body: string;
  links: NextStepLink[];
}

const g = (slug: string, label: string): NextStepLink => ({ label, href: `/guides/${slug}/`, kind: "guide" });
const tool = (slug: string, label: string): NextStepLink => ({ label, href: `/tools/${slug}/`, kind: "tool" });
const offer = (slug: string, label: string): NextStepLink => ({ label, href: `/work-with-us/${slug}/`, kind: "offer" });

const SCORECARD = tool("workflow-scorecard", "Score a workflow (5 min)");
const ECONOMICS = tool("workflow-economics", "Workflow economics calculator");
const BRIEF = tool("project-brief", "Build a project brief");

export const CHAPTER_NEXT_STEPS: Record<string, ChapterNextStep> = {
  "unveiling-power-generative-ai-new-era-business": {
    heading: "From concepts to a first decision",
    body: "Once the ideas are clear, the useful question is which of your workflows would actually benefit. Start with one workflow you own.",
    links: [g("where-to-start-with-ai", "Where should your business start?"), SCORECARD],
  },
  "harnessing-power-existing-genai-tools-practical-guide-businesses": {
    heading: "Already paying for AI tools?",
    body: "Licences are not adoption. Pick three workflows, agree how outputs are reviewed, and measure whether the work improves.",
    links: [g("improve-copilot-chatgpt-team-adoption", "Improving team adoption of Copilot or ChatGPT"), offer("team-workflow-activation", "Team Workflow Activation")],
  },
  "revolutionizing-business-functions-departmental-genai-integration": {
    heading: "Pick the department workflow to change first",
    body: "Score candidate workflows across departments on value, feasibility, risk and readiness before you commit budget.",
    links: [SCORECARD, g("where-to-start-with-ai", "Opportunity selection guide")],
  },
  "from-automation-to-innovation-unleashing-genai-transformative-potential": {
    heading: "Is it AI, automation, or neither?",
    body: "Many ‘AI’ opportunities are better served by existing software or deterministic automation. Decide that before you scope a build.",
    links: [g("buy-build-configure-or-do-nothing", "Buy, configure, build — or do nothing"), SCORECARD],
  },
  "structuring-data-for-genai-foundation-ai-driven-innovation": {
    heading: "Check the data before the model",
    body: "Most stalled projects are data or access problems. Establish what information the workflow needs and whether it may be used.",
    links: [g("staff-ai-internal-documents", "Can staff use AI with internal documents?"), g("why-ai-pilots-stall", "Why AI pilots stall")],
  },
  "crafting-success-building-internal-genai-use-cases": {
    heading: "Turn this chapter into a ranked shortlist",
    body: "Score one candidate workflow, price it honestly — hours released are not cash saved — and take the result into a brief.",
    links: [SCORECARD, ECONOMICS, offer("ai-opportunity-sprint", "AI Opportunity Sprint")],
  },
  "revolutionizing-hr-ai-powered-people-analytics": {
    heading: "People data needs a specific approval",
    body: "Before using AI on HR information, document the data flow, the decision it informs, and who reviews the output.",
    links: [g("staff-ai-internal-documents", "Data-use decisions for internal information"), g("agent-human-approval-design", "What should require human approval")],
  },
  "supercharging-developer-productivity-generative-ai": {
    heading: "Make coding assistants a team practice",
    body: "Adoption varies widely between developers. Agree the workflows, review gates and measures that make the gains repeatable.",
    links: [g("improve-copilot-chatgpt-team-adoption", "Improving team adoption"), offer("team-workflow-activation", "Team Workflow Activation")],
  },
  "genai-security-and-compliance-safeguarding-innovation-ai-era": {
    heading: "Approve a specific workflow, not ‘AI’ in general",
    body: "Security reviews go faster when they assess one workflow's data flow, controls and failure modes rather than a blanket policy.",
    links: [g("staff-ai-internal-documents", "Can staff use AI with internal documents?"), offer("pilot-readiness-review", "Pilot Readiness Review")],
  },
  "future-proofing-your-organization-thriving-ai-driven-future": {
    heading: "Give leadership a decision, not a trend report",
    body: "Frame AI investment as a portfolio of workflow bets with costs, alternatives and stopping conditions.",
    links: [g("board-questions-ai-investment", "What the board should ask about AI"), ECONOMICS],
  },
  "understanding-limitations-where-genai-falls-short": {
    heading: "Decide where AI should not be used",
    body: "Use these limits to rule options out early. ‘No custom AI’ is a valid and often cheaper outcome.",
    links: [g("buy-build-configure-or-do-nothing", "Buy, configure, build — or do nothing"), SCORECARD],
  },
  "from-genai-to-agentic-ai": {
    heading: "Does this workflow need an agent at all?",
    body: "Agents add autonomy and risk. Check whether a reviewed, single-step assistant or plain automation would do the job.",
    links: [g("buy-build-configure-or-do-nothing", "Buy, configure, build — or do nothing"), g("agent-human-approval-design", "Agent approval design")],
  },
  "anatomy-of-ai-agent": {
    heading: "Decide what the agent may do on its own",
    body: "Map each action the agent can take to an approval rule before anyone writes code.",
    links: [g("agent-human-approval-design", "What should require human approval?")],
  },
  "tools-function-calling-mcp": {
    heading: "Every tool is a permission",
    body: "List the tools an agent needs, the data each touches and the approval each requires — this becomes your security review input.",
    links: [g("agent-human-approval-design", "Agent approval design"), BRIEF],
  },
  "agent-orchestration-frameworks": {
    heading: "Choose a framework after you've written the brief",
    body: "Framework choice follows from the workflow's requirements, integrations and operating model — not the other way round.",
    links: [BRIEF, g("ai-implementation-brief-and-supplier-questions", "What an implementation brief should include")],
  },
  "multi-agent-systems": {
    heading: "Prove one agent works first",
    body: "Multi-agent designs multiply evaluation and failure modes. Make sure a single bounded workflow passes acceptance first.",
    links: [g("why-ai-pilots-stall", "Why AI pilots stall"), offer("pilot-readiness-review", "Pilot Readiness Review")],
  },
  "agents-memory-rag": {
    heading: "Is your knowledge assistant giving bad answers?",
    body: "Retrieval quality, stale sources and missing evaluation are the usual causes. Diagnose before you rebuild.",
    links: [g("internal-knowledge-assistant-bad-answers", "Diagnosing a bad internal knowledge assistant"), offer("pilot-readiness-review", "Pilot Readiness Review")],
  },
  "agents-evals-observability": {
    heading: "Use evaluation to make the deployment decision",
    body: "An evaluation set built from your real examples is what turns a demo into an approval. Agree the acceptance threshold first.",
    links: [g("why-ai-pilots-stall", "What production-ready actually requires"), offer("pilot-readiness-review", "Pilot Readiness Review")],
  },
  "agents-security-governance": {
    heading: "Turn governance into an approval checklist",
    body: "Document the data flow, permissions and human-approval points for the specific workflow you want to ship.",
    links: [g("agent-human-approval-design", "What should require human approval?"), g("staff-ai-internal-documents", "Data-use decisions")],
  },
  "deploying-agents-in-production": {
    heading: "Is your pilot ready for staff?",
    body: "Check evaluation, integrations, controls and support boundaries before rollout — and decide who owns the service afterwards.",
    links: [g("why-ai-pilots-stall", "Why AI pilots stall"), offer("pilot-readiness-review", "Pilot Readiness Review")],
  },
  "agents-future": {
    heading: "Keep deployed workflows honest",
    body: "Models and vendors change. Review live workflows for quality, adoption and cost — and retire the ones that stop paying back.",
    links: [g("measuring-ai-adoption-and-retiring-workflows", "Measuring adoption and retiring workflows"), offer("adoption-assurance-retainer", "Adoption & Assurance Retainer")],
  },
};
