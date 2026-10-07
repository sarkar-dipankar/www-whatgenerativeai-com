// Workflow Economics Calculator — keeps time released, cash realised and
// running costs separate. Shared by the page (method) and the client script.

import type { EconomicsResult } from "./brief";

export interface CapacityUse {
  key: string;
  label: string;
  defaultRealisationPct: number;
  note: string;
}

export const CAPACITY_USES: CapacityUse[] = [
  { key: "overtime", label: "Reduces overtime", defaultRealisationPct: 100, note: "Only up to the overtime actually being paid today." },
  { key: "contractors", label: "Reduces contractor or agency spend", defaultRealisationPct: 100, note: "Only if the contracts can actually be reduced." },
  { key: "hiring", label: "Avoids a planned hire", defaultRealisationPct: 80, note: "Real only if the hire was budgeted and is now cancelled." },
  { key: "throughput", label: "Handles more work with the same team", defaultRealisationPct: 50, note: "Counts only if there is demand for the extra output." },
  { key: "quality", label: "Improves service or quality", defaultRealisationPct: 0, note: "Valuable, but not cash. Record it as a quality benefit." },
  { key: "unused", label: "Not decided / likely unused", defaultRealisationPct: 0, note: "Released time that isn't redeployed saves nothing." },
];

export interface EconomicsInputs {
  runsPerMonth: number;
  hoursPerRun: number;
  hourlyCost: number;
  reductionLowPct: number;
  reductionBasePct: number;
  reductionHighPct: number;
  reviewMinutesPerRun: number;
  monthlySoftware: number;
  monthlySupport: number;
  oneOffCost: number;
  capacityUse: string;
  realisationPct: number;
}

export const DEFAULT_INPUTS: EconomicsInputs = {
  runsPerMonth: 40,
  hoursPerRun: 3,
  hourlyCost: 45,
  reductionLowPct: 20,
  reductionBasePct: 40,
  reductionHighPct: 60,
  reviewMinutesPerRun: 20,
  monthlySoftware: 300,
  monthlySupport: 200,
  oneOffCost: 8000,
  capacityUse: "unused",
  realisationPct: 0,
};

export interface Scenario {
  reductionPct: number;
  netHoursPerMonth: number;
  timeValuePerMonth: number;
  cashPerMonth: number;
  netCashPerMonth: number;
  yearOneNet: number;
  paybackMonths: number | null;
}

const nonNeg = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function scenario(i: EconomicsInputs, reductionPct: number, realisationPct = i.realisationPct): Scenario {
  const runs = nonNeg(i.runsPerMonth);
  const grossHours = runs * nonNeg(i.hoursPerRun) * (nonNeg(reductionPct) / 100);
  const reviewHours = runs * (nonNeg(i.reviewMinutesPerRun) / 60);
  const netHoursPerMonth = grossHours - reviewHours;
  const rate = nonNeg(i.hourlyCost);
  const timeValuePerMonth = netHoursPerMonth * rate;
  // Cash is realised only on positive released time.
  const cashPerMonth = Math.max(0, netHoursPerMonth) * rate * (Math.min(100, nonNeg(realisationPct)) / 100);
  const running = nonNeg(i.monthlySoftware) + nonNeg(i.monthlySupport);
  const netCashPerMonth = cashPerMonth - running;
  const oneOff = nonNeg(i.oneOffCost);
  const yearOneNet = netCashPerMonth * 12 - oneOff;
  const paybackMonths = netCashPerMonth > 0 ? oneOff / netCashPerMonth : null;
  return { reductionPct, netHoursPerMonth, timeValuePerMonth, cashPerMonth, netCashPerMonth, yearOneNet, paybackMonths };
}

export function capacityLabel(key: string): string {
  return CAPACITY_USES.find((c) => c.key === key)?.label ?? key;
}

export function toResult(i: EconomicsInputs): EconomicsResult {
  const base = scenario(i, i.reductionBasePct);
  return {
    netHoursPerMonth: base.netHoursPerMonth,
    timeValuePerMonth: base.timeValuePerMonth,
    cashPerMonth: base.cashPerMonth,
    runningCostPerMonth: nonNeg(i.monthlySoftware) + nonNeg(i.monthlySupport),
    oneOffCost: nonNeg(i.oneOffCost),
    yearOneNet: base.yearOneNet,
    paybackMonths: base.paybackMonths,
    capacityUse: capacityLabel(i.capacityUse),
    realisationPct: i.realisationPct,
    assumptions: [
      `${i.runsPerMonth} runs a month at ${i.hoursPerRun} hours each, loaded cost £${i.hourlyCost}/hour`,
      `Effort reduction: ${i.reductionLowPct}% low / ${i.reductionBasePct}% base / ${i.reductionHighPct}% high`,
      `Review time added: ${i.reviewMinutesPerRun} minutes per run`,
      `Running costs: software £${i.monthlySoftware}/month, support £${i.monthlySupport}/month; one-off £${i.oneOffCost}`,
    ],
  };
}
