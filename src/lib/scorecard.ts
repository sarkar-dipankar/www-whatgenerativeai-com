// Workflow Opportunity Scorecard — questions, weights and recommendation rules.
// Shared by the page (rendered statically, so the method is public and indexable)
// and the client script (which computes the result in the browser).

import type { ScorecardResult } from "./brief";

export type Dim = "value" | "feasibility" | "risk" | "readiness";

export interface Option {
  key: string;
  label: string;
  score: number;
}

export interface Question {
  id: string;
  dim: Dim;
  label: string;
  hint?: string;
  options: Option[];
}

export const WEIGHTS: Record<Dim, number> = { value: 0.35, feasibility: 0.25, risk: 0.2, readiness: 0.2 };

export const DIM_LABELS: Record<Dim, string> = {
  value: "Value",
  feasibility: "Feasibility",
  risk: "Risk (higher = safer)",
  readiness: "Readiness",
};

export const QUESTIONS: Question[] = [
  {
    id: "frequency", dim: "value", label: "How often does the workflow run?",
    options: [
      { key: "daily", label: "Daily or more", score: 4 },
      { key: "weekly", label: "Weekly", score: 3 },
      { key: "monthly", label: "Monthly", score: 2 },
      { key: "rare", label: "Quarterly or less", score: 0 },
    ],
  },
  {
    id: "effort", dim: "value", label: "Effort per run, all people combined",
    options: [
      { key: "4h+", label: "More than 4 hours", score: 4 },
      { key: "1-4h", label: "1–4 hours", score: 3 },
      { key: "15-60m", label: "15–60 minutes", score: 2 },
      { key: "<15m", label: "Under 15 minutes", score: 0 },
    ],
  },
  {
    id: "people", dim: "value", label: "How many people do this work?",
    options: [
      { key: "20+", label: "More than 20", score: 4 },
      { key: "6-20", label: "6–20", score: 3 },
      { key: "2-5", label: "2–5", score: 2 },
      { key: "1", label: "One person", score: 1 },
    ],
  },
  {
    id: "impact", dim: "value", label: "If it were faster or better, what would change?",
    options: [
      { key: "customer", label: "Customers, revenue or service levels would notice", score: 4 },
      { key: "decisions", label: "Internal decisions would be faster or better", score: 3 },
      { key: "time", label: "The team would get time back", score: 2 },
      { key: "little", label: "Not much, honestly", score: 0 },
    ],
  },
  {
    id: "inputs", dim: "feasibility", label: "Where do the inputs live?",
    options: [
      { key: "accessible", label: "Digital, in systems we can access", score: 4 },
      { key: "scattered", label: "Digital, but scattered across systems, inboxes or drives", score: 2 },
      { key: "offline", label: "Partly on paper or in people's heads", score: 0 },
    ],
  },
  {
    id: "shape", dim: "feasibility", label: "What do the inputs mostly look like?",
    options: [
      { key: "text", label: "Documents, emails, notes or other text", score: 4 },
      { key: "mixed", label: "A mix of text and structured data", score: 3 },
      { key: "structured", label: "Structured data: tables, forms, database fields", score: 3 },
      { key: "tacit", label: "Mostly expert judgement, little written down", score: 0 },
    ],
  },
  {
    id: "variability", dim: "feasibility", label: "How much does each run vary?",
    options: [
      { key: "same", label: "Identical steps every time", score: 1 },
      { key: "pattern", label: "Varies, but within a recognisable pattern", score: 4 },
      { key: "expert", label: "Every case is different and needs expert judgement", score: 1 },
    ],
  },
  {
    id: "checkable", dim: "feasibility", label: "Can someone check an output quickly?",
    options: [
      { key: "quick", label: "Yes — in minutes, against the sources", score: 4 },
      { key: "effort", label: "Yes, but it takes real effort", score: 2 },
      { key: "hard", label: "It's hard to tell whether an output is right", score: 0 },
    ],
  },
  {
    id: "consequence", dim: "risk", label: "If an output is wrong…",
    options: [
      { key: "minor", label: "Minor — caught and fixed internally", score: 4 },
      { key: "rework", label: "Rework and some internal embarrassment", score: 3 },
      { key: "external", label: "It could reach clients or the public", score: 1 },
      { key: "harm", label: "Financial, legal, safety or regulatory harm", score: 0 },
    ],
  },
  {
    id: "sensitivity", dim: "risk", label: "Most sensitive information involved",
    options: [
      { key: "public", label: "Public information only", score: 4 },
      { key: "internal", label: "Internal, non-confidential", score: 3 },
      { key: "confidential", label: "Confidential business or client information", score: 2 },
      { key: "personal", label: "Personal data", score: 1 },
      { key: "special", label: "Special-category or regulated data", score: 0 },
    ],
  },
  {
    id: "autonomy", dim: "risk", label: "What should the AI do?",
    options: [
      { key: "draft", label: "Draft something a person edits and sends", score: 4 },
      { key: "suggest", label: "Suggest options a person chooses from", score: 4 },
      { key: "approve", label: "Take actions in systems, with a person's approval", score: 2 },
      { key: "auto", label: "Act on its own", score: 0 },
    ],
  },
  {
    id: "owner", dim: "readiness", label: "Who owns the workflow?",
    options: [
      { key: "budget", label: "A named owner with budget", score: 4 },
      { key: "named", label: "A named owner, budget not yet agreed", score: 3 },
      { key: "sponsor", label: "An interested sponsor, but no owner", score: 1 },
      { key: "none", label: "Nobody yet", score: 0 },
    ],
  },
  {
    id: "tools", dim: "readiness", label: "What AI tools does the team already have?",
    options: [
      { key: "licensed", label: "A licensed AI assistant already rolled out", score: 4 },
      { key: "general", label: "General business software only", score: 2 },
      { key: "unsure", label: "Not sure", score: 1 },
    ],
  },
  {
    id: "baseline", dim: "readiness", label: "Do you know what the workflow costs today?",
    options: [
      { key: "measured", label: "Yes, we've measured it", score: 4 },
      { key: "estimate", label: "We have a rough estimate", score: 2 },
      { key: "unknown", label: "No", score: 0 },
    ],
  },
];

export interface Approach {
  id: string;
  label: string;
  summary: string;
  next: { label: string; href: string }[];
}

export const APPROACHES: Record<string, Approach> = {
  owner: {
    id: "owner",
    label: "Not yet — fix ownership first",
    summary: "Without an accountable owner, no tool or supplier will make this stick. Appoint one, agree the baseline, then score again.",
    next: [{ label: "Where should your business start?", href: "/guides/where-to-start-with-ai/" }],
  },
  dont: {
    id: "dont",
    label: "Don't pursue this one now",
    summary: "The likely value is too small to justify the change effort. Look for a more frequent, more effortful or higher-impact workflow.",
    next: [{ label: "Where should your business start?", href: "/guides/where-to-start-with-ai/" }],
  },
  foundations: {
    id: "foundations",
    label: "Not yet — fix the process or data first",
    summary: "The inputs aren't accessible or the outputs can't be checked. Fix that first; any AI built on top would be impossible to evaluate.",
    next: [
      { label: "Why AI pilots stall", href: "/guides/why-ai-pilots-stall/" },
      { label: "AI Opportunity Sprint", href: "/work-with-us/ai-opportunity-sprint/" },
    ],
  },
  automation: {
    id: "automation",
    label: "Deterministic automation — no generative AI needed",
    summary: "Identical steps on structured data are better served by rules, scripts, integrations or features in your existing software. They're cheaper to run and easier to test.",
    next: [{ label: "Buy, configure, build — or do nothing", href: "/guides/buy-build-configure-or-do-nothing/" }],
  },
  controls: {
    id: "controls",
    label: "AI-assisted only with strong controls — review readiness first",
    summary: "The consequences of an error, the sensitivity of the data or the level of autonomy call for a specific data-flow, approval and evaluation review before anything is deployed.",
    next: [
      { label: "What should require human approval?", href: "/guides/agent-human-approval-design/" },
      { label: "Pilot Readiness Review", href: "/work-with-us/pilot-readiness-review/" },
    ],
  },
  configure: {
    id: "configure",
    label: "Configure the tools you already have",
    summary: "This looks like a good fit for the AI assistant you already license: a defined template, a review step and a measured before/after. No new purchase needed.",
    next: [
      { label: "Improving team adoption", href: "/guides/improve-copilot-chatgpt-team-adoption/" },
      { label: "Team Workflow Activation", href: "/work-with-us/team-workflow-activation/" },
    ],
  },
  assisted: {
    id: "assisted",
    label: "AI-assisted workflow — bounded and human-reviewed",
    summary: "A good candidate for an AI-assisted workflow in which AI drafts or suggests, a person reviews, and success is measured against an agreed threshold. Next, check the economics and write the brief.",
    next: [
      { label: "Workflow economics calculator", href: "/tools/workflow-economics/" },
      { label: "AI Opportunity Sprint", href: "/work-with-us/ai-opportunity-sprint/" },
    ],
  },
};

export type Answers = Record<string, string>;

const optionFor = (qid: string, key?: string) => QUESTIONS.find((q) => q.id === qid)?.options.find((o) => o.key === key);

export function dimScores(answers: Answers): Record<Dim, number> {
  const out = {} as Record<Dim, number>;
  for (const dim of Object.keys(WEIGHTS) as Dim[]) {
    const qs = QUESTIONS.filter((q) => q.dim === dim);
    const sum = qs.reduce((acc, q) => acc + (optionFor(q.id, answers[q.id])?.score ?? 0), 0);
    out[dim] = Math.round((sum / (qs.length * 4)) * 100);
  }
  return out;
}

export function chooseApproach(a: Answers, dims: Record<Dim, number>): Approach {
  if (a.owner === "none" || a.owner === "sponsor") return APPROACHES.owner;
  if (dims.value < 35) return APPROACHES.dont;
  if (a.inputs === "offline" || a.checkable === "hard" || a.shape === "tacit") return APPROACHES.foundations;
  if (a.variability === "same" && a.shape === "structured") return APPROACHES.automation;
  if (dims.risk < 40 || a.autonomy === "auto" || a.consequence === "harm") return APPROACHES.controls;
  if (a.tools === "licensed" && (a.autonomy === "draft" || a.autonomy === "suggest")) return APPROACHES.configure;
  return APPROACHES.assisted;
}

export function evaluate(answers: Answers): ScorecardResult & { approachId: string; next: Approach["next"] } {
  const dims = dimScores(answers);
  const total = Math.round(
    (Object.keys(WEIGHTS) as Dim[]).reduce((acc, d) => acc + dims[d] * WEIGHTS[d], 0),
  );
  const approach = chooseApproach(answers, dims);
  const sensitivityLabel = optionFor("sensitivity", answers.sensitivity)?.label.toLowerCase();

  const dependencies: string[] = [];
  if (answers.inputs === "scattered") dependencies.push("Connect or consolidate the source systems the workflow draws on.");
  if (["confidential", "personal", "special"].includes(answers.sensitivity))
    dependencies.push(`Data-use approval for ${sensitivityLabel} with the intended tool, covering retention, access and contract terms.`);
  if (answers.checkable !== "quick") dependencies.push("An evaluation set of real examples with expected outputs, and a defined review step.");
  if (answers.autonomy === "approve" || answers.autonomy === "auto") dependencies.push("Approval rules and least-privilege permissions for every action the AI can take.");
  if (answers.tools !== "licensed") dependencies.push("A tool decision: existing software, a specialist product, or a platform build.");
  if (answers.shape === "structured" || answers.variability === "same") dependencies.push("Check which steps ordinary automation can handle before adding AI.");

  const openQuestions: string[] = [];
  if (answers.baseline !== "measured") openQuestions.push("What does the workflow cost today? Measure effort per run over 2–4 weeks.");
  if (answers.owner === "named") openQuestions.push("Who funds the change, and what evidence will they need to approve it?");
  if (answers.consequence === "external" || answers.consequence === "harm") openQuestions.push("Who signs off outputs before they reach clients, the public or regulators?");
  if (answers.impact === "time") openQuestions.push("What will the released time be used for? Hours released are not cash saved.");
  openQuestions.push("What acceptance threshold would make this a success, and what would make you stop?");

  return {
    total,
    dims,
    approach: approach.label,
    approachSummary: approach.summary,
    approachId: approach.id,
    next: approach.next,
    dependencies,
    openQuestions,
  };
}
