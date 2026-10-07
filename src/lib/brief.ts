// Client-side brief model shared by the decision tools and the project intake.
// Mirrors the demand record: organisation, workflow, constraints, decision path,
// acceptance criteria and open questions — as structured fields, not prose.
// Everything stays in the visitor's browser until they choose to send it.

export interface ScorecardResult {
  total: number;
  dims: { value: number; feasibility: number; risk: number; readiness: number };
  approach: string;
  approachSummary: string;
  dependencies: string[];
  openQuestions: string[];
}

export interface EconomicsResult {
  netHoursPerMonth: number;
  timeValuePerMonth: number;
  cashPerMonth: number;
  runningCostPerMonth: number;
  oneOffCost: number;
  yearOneNet: number;
  paybackMonths: number | null;
  capacityUse: string;
  realisationPct: number;
  assumptions: string[];
}

export interface Brief {
  organisation?: string;
  role?: string;
  workflow?: string;
  purpose?: string;
  currentProcess?: string;
  owner?: string;
  frequency?: string;
  volume?: string;
  effort?: string;
  systems?: string;
  information?: string;
  sensitivity?: string;
  review?: string;
  failureImpact?: string;
  outcome?: string;
  acceptance?: string;
  constraints?: string;
  outOfScope?: string;
  budgetStatus?: string;
  decisionProcess?: string;
  targetDate?: string;
  purchasing?: string;
  openQuestions?: string;
  scorecard?: ScorecardResult;
  economics?: EconomicsResult;
}

const DRAFT_KEY = "wgai-brief-draft";
const PREFILL_KEY = "wgai-intake-prefill";

function safeGet(store: Storage | undefined, key: string): string | null {
  try {
    return store?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function safeSet(store: Storage | undefined, key: string, value: string): void {
  try {
    store?.setItem(key, value);
  } catch {
    /* storage unavailable (private mode, blocked) — the tools still work without it */
  }
}

export function loadDraft(): Brief {
  const raw = safeGet(globalThis.localStorage, DRAFT_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Brief;
  } catch {
    return {};
  }
}

export function saveDraft(patch: Partial<Brief>): Brief {
  const next = { ...loadDraft(), ...patch };
  safeSet(globalThis.localStorage, DRAFT_KEY, JSON.stringify(next));
  return next;
}

export function clearDraft(): void {
  try {
    globalThis.localStorage?.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

export const gbp = (n: number) =>
  `${n < 0 ? "−" : ""}£${Math.round(Math.abs(n)).toLocaleString("en-GB")}`;

const line = (label: string, value?: string) => (value && value.trim() ? `- **${label}:** ${value.trim()}\n` : "");

export function scorecardMarkdown(s: ScorecardResult): string {
  return [
    `## Opportunity scorecard`,
    ``,
    `- **Overall:** ${s.total}/100`,
    `- **Value:** ${s.dims.value} · **Feasibility:** ${s.dims.feasibility} · **Risk (higher = safer):** ${s.dims.risk} · **Readiness:** ${s.dims.readiness}`,
    `- **Recommended approach:** ${s.approach} — ${s.approachSummary}`,
    ``,
    s.dependencies.length ? `### Dependencies\n${s.dependencies.map((d) => `- ${d}`).join("\n")}\n` : "",
    s.openQuestions.length ? `### Open questions\n${s.openQuestions.map((d) => `- ${d}`).join("\n")}\n` : "",
  ].join("\n");
}

export function economicsMarkdown(e: EconomicsResult): string {
  return [
    `## Workflow economics (base case)`,
    ``,
    `- **Net hours released per month:** ${e.netHoursPerMonth.toFixed(0)}`,
    `- **Value of time released (not cash):** ${gbp(e.timeValuePerMonth)}/month`,
    `- **Released capacity used for:** ${e.capacityUse} (${e.realisationPct}% realised as cash or revenue)`,
    `- **Cash or revenue realised:** ${gbp(e.cashPerMonth)}/month`,
    `- **Running costs:** ${gbp(e.runningCostPerMonth)}/month · **One-off costs:** ${gbp(e.oneOffCost)}`,
    `- **Year-one net:** ${gbp(e.yearOneNet)}`,
    `- **Payback:** ${e.paybackMonths === null ? "not reached on these assumptions" : `${e.paybackMonths.toFixed(1)} months`}`,
    ``,
    e.assumptions.length ? `### Assumptions\n${e.assumptions.map((a) => `- ${a}`).join("\n")}\n` : "",
  ].join("\n");
}

export function toMarkdown(b: Brief): string {
  const title = b.workflow?.trim() || "Untitled workflow";
  const sections: string[] = [`# Project brief: ${title}`, ""];
  const ctx =
    line("Organisation", b.organisation) +
    line("Prepared by (role)", b.role) +
    line("Process owner", b.owner) +
    line("What the workflow does", b.purpose) +
    line("How it is done today", b.currentProcess) +
    line("Frequency", b.frequency) +
    line("Volume", b.volume) +
    line("Current effort", b.effort);
  if (ctx) sections.push("## Scope and context", "", ctx);

  const sys =
    line("Systems involved", b.systems) +
    line("Information used", b.information) +
    line("Most sensitive information", b.sensitivity) +
    line("How outputs are checked today", b.review) +
    line("What happens if it goes wrong", b.failureImpact) +
    line("Constraints", b.constraints) +
    line("Out of scope", b.outOfScope);
  if (sys) sections.push("## Systems, information and constraints", "", sys);

  const success = line("Desired outcome", b.outcome) + line("Acceptance criteria", b.acceptance);
  if (success) sections.push("## Success criteria", "", success);

  const buy =
    line("Budget status", b.budgetStatus) +
    line("Decision process", b.decisionProcess) +
    line("Target date", b.targetDate) +
    line("Purchasing requirements", b.purchasing);
  if (buy) sections.push("## Decision and purchasing", "", buy);

  if (b.scorecard) sections.push(scorecardMarkdown(b.scorecard));
  if (b.economics) sections.push(economicsMarkdown(b.economics));
  if (b.openQuestions?.trim()) sections.push("## Open questions", "", b.openQuestions.trim(), "");

  sections.push(
    "---",
    `Generated with the free Project Brief Builder at https://www.whatgenerativeai.com/tools/project-brief/ on ${new Date().toISOString().slice(0, 10)}. Vendor-neutral: use it with any supplier.`,
  );
  return sections.join("\n");
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface IntakePrefill {
  situation?: string;
  offer?: string;
  workflow?: string;
  briefMarkdown?: string;
  source?: string;
}

export function handoffToIntake(prefill: IntakePrefill): void {
  safeSet(globalThis.sessionStorage, PREFILL_KEY, JSON.stringify(prefill));
  const params = new URLSearchParams();
  if (prefill.situation) params.set("situation", prefill.situation);
  if (prefill.offer) params.set("offer", prefill.offer);
  if (prefill.source) params.set("source", prefill.source);
  location.href = `/work-with-us/intake/${params.size ? `?${params}` : ""}`;
}

export function readIntakePrefill(): IntakePrefill {
  const fromQuery = Object.fromEntries(new URLSearchParams(location.search)) as IntakePrefill;
  const raw = safeGet(globalThis.sessionStorage, PREFILL_KEY);
  let stored: IntakePrefill = {};
  if (raw) {
    try {
      stored = JSON.parse(raw);
    } catch {
      stored = {};
    }
  }
  return { ...fromQuery, ...stored };
}

/** Slug-safe filename from a workflow name. */
export function fileSlug(name: string | undefined, fallback: string): string {
  const s = (name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
  return s || fallback;
}
