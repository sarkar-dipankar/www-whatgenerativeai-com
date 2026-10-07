// Buying situations — organised by the decision being made, not by interest in AI.
// Drives the homepage, /start/, the mega menu and the project-intake select.
import type { IconName } from "./icons";

export interface Situation {
  id: string;
  quote: string;
  label: string;
  buyer: string;
  need: string;
  guide: string;
  tool?: string;
  offer: string;
  icon: IconName;
}

export const SITUATIONS: Situation[] = [
  {
    id: "where-to-start",
    icon: "compass",
    quote: "We've been told to adopt AI. Where should we start?",
    label: "Choose a starting point",
    buyer: "COO, MD, transformation lead",
    need: "A ranked shortlist with costs, dependencies and a credible first project.",
    guide: "where-to-start-with-ai",
    tool: "workflow-scorecard",
    offer: "ai-opportunity-sprint",
  },
  {
    id: "patchy-adoption",
    icon: "sparkles",
    quote: "We bought AI tools, but useful adoption is patchy.",
    label: "Activate existing tools",
    buyer: "IT, operations, L&D sponsor",
    need: "Real workflows, working practice, controls and measured adoption.",
    guide: "improve-copilot-chatgpt-team-adoption",
    tool: "workflow-scorecard",
    offer: "team-workflow-activation",
  },
  {
    id: "recurring-process",
    icon: "refresh",
    quote: "This recurring process eats too much time.",
    label: "Redesign a workflow",
    buyer: "Department head, process owner",
    need: "A redesigned workflow with measurable acceptance criteria.",
    guide: "automate-recurring-client-reports",
    tool: "workflow-economics",
    offer: "ai-opportunity-sprint",
  },
  {
    id: "data-approval",
    icon: "shield",
    quote: "We need approval before using AI with our information.",
    label: "Get a workflow approved",
    buyer: "IT, security, procurement, business sponsor",
    need: "A specific data-flow, risk and control assessment.",
    guide: "staff-ai-internal-documents",
    offer: "pilot-readiness-review",
  },
  {
    id: "stalled-pilot",
    icon: "rocket",
    quote: "Our pilot works in a demo but isn't ready for staff.",
    label: "Fix a stalled pilot",
    buyer: "CTO, product owner, engineering lead",
    need: "What's blocking it, and a practical remediation plan.",
    guide: "why-ai-pilots-stall",
    offer: "pilot-readiness-review",
  },
  {
    id: "which-product",
    icon: "scale",
    quote: "Which product should we buy?",
    label: "Compare products",
    buyer: "IT buyer, procurement, department head",
    need: "A requirements-led comparison tested against your own work.",
    guide: "evaluate-ai-tools-for-your-workflow",
    tool: "project-brief",
    offer: "ai-opportunity-sprint",
  },
  {
    id: "investment-decision",
    icon: "chart",
    quote: "Leadership needs an investment decision.",
    label: "Make the investment case",
    buyer: "CEO, CFO, board sponsor",
    need: "An investment memo with alternatives, costs, risks and stopping conditions.",
    guide: "board-questions-ai-investment",
    tool: "workflow-economics",
    offer: "ai-opportunity-sprint",
  },
  {
    id: "multi-team",
    icon: "users",
    quote: "We need to enable several teams or businesses.",
    label: "Enable many teams",
    buyer: "Group ops, portfolio ops, association, MSP",
    need: "A repeatable programme with shared materials and local implementation.",
    guide: "improve-copilot-chatgpt-team-adoption",
    offer: "team-workflow-activation",
  },
  {
    id: "still-worth-it",
    icon: "gauge",
    quote: "We deployed something. Is it still worth running?",
    label: "Review a live workflow",
    buyer: "Service owner, operations leader",
    need: "Quality, adoption, cost and maintenance evidence.",
    guide: "measuring-ai-adoption-and-retiring-workflows",
    offer: "adoption-assurance-retainer",
  },
];

export const situationById = (id?: string) => SITUATIONS.find((s) => s.id === id);
