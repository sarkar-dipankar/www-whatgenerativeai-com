import type { IconName } from "./icons";

// Decision clusters — the buyer journey the guides cover, in journey order.
export interface Cluster {
  label: string;
  order: number;
  icon: IconName;
}

export const CLUSTERS: Record<string, Cluster> = {
  "choose-start": { label: "Choose a starting point", order: 1, icon: "compass" },
  "establish-value": { label: "Establish value", order: 2, icon: "chart" },
  "buy-vs-build": { label: "Buy, configure or build", order: 3, icon: "scale" },
  "compare-products": { label: "Compare products", order: 4, icon: "search" },
  "procurement": { label: "Prepare procurement", order: 5, icon: "document" },
  "company-information": { label: "Handle company information", order: 6, icon: "shield" },
  "agent-approval": { label: "Approve agent actions", order: 7, icon: "check" },
  "beyond-pilot": { label: "Move beyond a pilot", order: 8, icon: "rocket" },
  "leadership": { label: "Enable leadership", order: 9, icon: "flag" },
  "activate-tools": { label: "Activate existing tools", order: 10, icon: "sparkles" },
  "reports-packs": { label: "Reports and packs", order: 11, icon: "list" },
  "research-proposals": { label: "Research and proposals", order: 12, icon: "pen" },
  "knowledge-tools": { label: "Fix knowledge tools", order: 13, icon: "book" },
  "maintain-value": { label: "Maintain value after deployment", order: 14, icon: "gauge" },
};
