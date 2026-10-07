// Decision clusters — the buyer journey the guides cover, in journey order.
export interface Cluster {
  label: string;
  order: number;
}

export const CLUSTERS: Record<string, Cluster> = {
  "choose-start": { label: "Choose a starting point", order: 1 },
  "establish-value": { label: "Establish value", order: 2 },
  "buy-vs-build": { label: "Buy, configure or build", order: 3 },
  "compare-products": { label: "Compare products", order: 4 },
  "procurement": { label: "Prepare procurement", order: 5 },
  "company-information": { label: "Handle company information", order: 6 },
  "agent-approval": { label: "Approve agent actions", order: 7 },
  "beyond-pilot": { label: "Move beyond a pilot", order: 8 },
  "leadership": { label: "Enable leadership", order: 9 },
  "activate-tools": { label: "Activate existing tools", order: 10 },
  "reports-packs": { label: "Reports and packs", order: 11 },
  "research-proposals": { label: "Research and proposals", order: 12 },
  "knowledge-tools": { label: "Fix knowledge tools", order: 13 },
  "maintain-value": { label: "Maintain value after deployment", order: 14 },
};
