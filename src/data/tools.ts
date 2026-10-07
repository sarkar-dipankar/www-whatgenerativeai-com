export interface Tool {
  slug: string;
  name: string;
  short: string;
  produces: string;
  minutes: number;
}

export const TOOLS: Tool[] = [
  {
    slug: "workflow-scorecard",
    name: "Workflow Opportunity Scorecard",
    short: "Score one workflow on value, feasibility, risk and readiness, and get a recommended approach — which can be “no AI needed”.",
    produces: "A score, a recommended approach, dependencies and open questions",
    minutes: 5,
  },
  {
    slug: "workflow-economics",
    name: "Workflow Economics Calculator",
    short: "Separate hours released from cash removed, add running costs, and see payback across low, base and high cases.",
    produces: "Annual net value, payback and a sensitivity table",
    minutes: 4,
  },
  {
    slug: "project-brief",
    name: "Project Brief Builder",
    short: "Turn your workflow into a portable brief covering scope, systems, constraints, success criteria and purchasing needs.",
    produces: "A Markdown brief you can send to any supplier",
    minutes: 10,
  },
];

export const toolBySlug = (slug?: string) => TOOLS.find((t) => t.slug === slug);
