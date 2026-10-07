// Paid engagements. Prices are starting points ("from"), not quotes — every
// engagement is scoped in writing before work starts.

export interface Offer {
  slug: string;
  name: string;
  short: string;
  situation: string;
  buyer: string;
  outputs: string[];
  acceptance: string;
  fromPriceGBP: number;
  priceSuffix?: string;
  priceNote?: string;
  duration: string;
  canConclude: string;
  notIncluded: string[];
  howItRuns: string[];
  relatedGuides: string[];
  tool?: string;
  /** Entry offers are the low-commitment first step; others are downstream paths. */
  entry: boolean;
}

export const OFFERS: Offer[] = [
  {
    slug: "ai-opportunity-sprint",
    name: "AI Opportunity Sprint",
    short: "Find the workflows worth changing, price them honestly, and pick a credible first project.",
    situation: "We have been told to adopt AI, but where should we start?",
    buyer: "COO, managing director, transformation or operations lead",
    outputs: [
      "Ranked shortlist of candidate workflows, each with an owner, volume and current effort",
      "Baseline economics per workflow — time released separated from cash removed",
      "Dependencies: data, systems, approvals and skills each option needs",
      "Recommended first project with scope, acceptance criteria and stopping conditions",
      "A portable project brief you can use with any supplier, including us",
    ],
    acceptance: "The sponsor can make a go/no-go decision on the first project and has appointed an owner.",
    fromPriceGBP: 2500,
    duration: "2–3 weeks",
    canConclude:
      "Use the software you already own, redesign the process, and do not commission custom AI. That is a successful sprint, not a failed one.",
    notIncluded: ["Building or configuring the workflow", "Vendor negotiations", "Organisation-wide AI policy"],
    howItRuns: [
      "Kick-off with the sponsor to agree the scope and the decision the sprint must support",
      "Interviews with 4–8 process owners and a review of the systems involved",
      "Scoring and economics for each candidate workflow, shared as a working draft",
      "Decision session: recommended first project, alternatives, and what would change the recommendation",
    ],
    relatedGuides: ["where-to-start-with-ai", "ai-roi-hours-are-not-cash", "buy-build-configure-or-do-nothing", "board-questions-ai-investment"],
    tool: "workflow-scorecard",
    entry: true,
  },
  {
    slug: "team-workflow-activation",
    name: "Team Workflow Activation",
    short: "Turn licences you already pay for into a few repeatable workflows your team actually uses.",
    situation: "We bought AI tools, but useful adoption is patchy.",
    buyer: "IT leader, operations leader, L&D sponsor",
    outputs: [
      "Three to five agreed workflows configured in your existing tools",
      "Working practice for each: inputs, prompts or templates, review step, and where the output goes",
      "Safe-use guidance tied to your information classes, not a generic policy",
      "Baseline and follow-up measurement of effort, quality and adoption",
      "Hand-over pack so the team can add new workflows without us",
    ],
    acceptance: "Staff can run the agreed workflows with the required review step, and the follow-up measurement has been shared with the sponsor.",
    fromPriceGBP: 6000,
    duration: "4–8 weeks",
    canConclude: "Some workflows are better left manual or handled by ordinary automation. We drop them rather than force them.",
    notIncluded: ["New tool procurement", "Custom software development", "Generic AI awareness training"],
    howItRuns: [
      "Select workflows with the team lead using the opportunity scorecard",
      "Measure the current effort and quality on real work",
      "Configure and rehearse each workflow with the people who do the work",
      "Run it for two to four weeks, then measure again and adjust",
    ],
    relatedGuides: ["improve-copilot-chatgpt-team-adoption", "research-briefs-and-proposals", "staff-ai-internal-documents", "measuring-ai-adoption-and-retiring-workflows"],
    tool: "workflow-scorecard",
    entry: true,
  },
  {
    slug: "pilot-readiness-review",
    name: "Pilot Readiness Review",
    short: "Find out what is actually blocking your AI pilot from reaching staff — and the smallest fix that would unblock it.",
    situation: "Our pilot works in a demo but is not ready for staff.",
    buyer: "CTO, product owner, engineering lead",
    outputs: [
      "Evaluation results on your own examples, with the errors observed and their causes",
      "Integration, security and data-flow gaps",
      "Risk register with an owner and a proposed control for each risk",
      "Prioritised remediation backlog with effort estimates",
      "Go / fix-then-go / stop recommendation with the evidence behind it",
    ],
    acceptance: "The buyer understands what blocks deployment, the next investment required, and the evidence that would justify it.",
    fromPriceGBP: 4000,
    duration: "2–4 weeks",
    canConclude:
      "Stop the pilot, or replace it with a simpler approach. We do not recommend rebuilding everything by default — the value is identifying the minimum justified intervention.",
    notIncluded: ["Implementing the remediation (available separately)", "Penetration testing", "Legal opinion"],
    howItRuns: [
      "Agree the deployment decision the review must inform and the acceptance threshold",
      "Build an evaluation set from real examples with the business owner",
      "Run the evaluation, review the architecture and trace the data flows",
      "Readout: findings, backlog and recommendation",
    ],
    relatedGuides: ["why-ai-pilots-stall", "internal-knowledge-assistant-bad-answers", "agent-human-approval-design", "staff-ai-internal-documents"],
    entry: true,
  },
  {
    slug: "workflow-implementation",
    name: "Workflow Implementation",
    short: "Build and hand over one bounded AI-assisted workflow with tests, controls and clear support boundaries.",
    situation: "This recurring process consumes too much time.",
    buyer: "Department head, process owner, CTO",
    outputs: [
      "Deployed workflow integrated with the agreed systems",
      "Evaluation suite and acceptance tests that run again after every change",
      "Access controls, logging and a human-review step where needed",
      "Operating runbook, hand-over and a defined support boundary",
    ],
    acceptance: "The agreed quality, security, operational and usability checks pass in the buyer's environment.",
    fromPriceGBP: 15000,
    priceNote: "Scoped per workflow after an Opportunity Sprint or an equivalent brief.",
    duration: "6–12 weeks",
    canConclude: "If the scoping shows deterministic automation is enough, we build that instead. It is usually cheaper to run.",
    notIncluded: ["Open-ended product development", "Run-time hosting costs (passed through at cost or billed to you directly)"],
    howItRuns: [
      "Written scope with acceptance criteria and a change process",
      "Build in short increments, demoed on real data",
      "Acceptance testing with the process owner",
      "Go-live, hand-over and a hypercare period",
    ],
    relatedGuides: ["automate-recurring-client-reports", "ai-implementation-brief-and-supplier-questions", "agent-human-approval-design"],
    tool: "project-brief",
    entry: false,
  },
  {
    slug: "adoption-assurance-retainer",
    name: "Adoption & Assurance Retainer",
    short: "Recurring reviews that show whether a deployed workflow is still worth running.",
    situation: "We deployed something; is it still worth running?",
    buyer: "Service owner, operations leader",
    outputs: [
      "Monthly or quarterly review of usage, quality, cost and incidents",
      "Evaluation re-run against the agreed test set after model or vendor changes",
      "Improvement backlog and agreed maintenance",
      "Retire / keep / extend recommendation at each review",
    ],
    acceptance: "The named service owner receives an actionable review and the agreed maintenance is done.",
    fromPriceGBP: 1500,
    priceSuffix: "/month",
    duration: "Rolling, 3-month minimum",
    canConclude: "Retire the workflow. When it no longer earns its keep, saying so is part of the service.",
    notIncluded: ["New workflow builds (scoped separately)", "24/7 incident response"],
    howItRuns: [
      "Agree the metrics, the review cadence and the service owner",
      "Collect usage, quality and cost data from the running workflow",
      "Review session and written findings",
      "Carry out the agreed maintenance and update the evaluation set",
    ],
    relatedGuides: ["measuring-ai-adoption-and-retiring-workflows", "internal-knowledge-assistant-bad-answers"],
    entry: false,
  },
];

export const offerBySlug = (slug?: string) => OFFERS.find((o) => o.slug === slug);

export function formatPrice(o: Offer): string {
  return `from £${o.fromPriceGBP.toLocaleString("en-GB")}${o.priceSuffix ?? ""}`;
}
