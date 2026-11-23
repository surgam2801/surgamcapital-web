// Pure finance maths shared by the API and the app. Every rate is a percentage (12 = 12%).
import type { NavPoint, Returns } from "./types";

const pct = (x: number) => x / 100;

/** Future value of a lumpsum. */
export function fvLumpsum(amount: number, ratePct: number, years: number) {
  return amount * Math.pow(1 + pct(ratePct), years);
}

/** Future value of a monthly SIP paid at the start of each month. */
export function fvSip(monthly: number, ratePct: number, years: number) {
  const i = pct(ratePct) / 12;
  const n = Math.round(years * 12);
  if (n <= 0) return 0;
  if (i === 0) return monthly * n;
  return monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
}

/** Monthly SIP needed to reach a target, paid at the start of each month. */
export function sipForTarget(target: number, ratePct: number, years: number) {
  const i = pct(ratePct) / 12;
  const n = Math.round(years * 12);
  if (target <= 0 || n <= 0) return 0;
  if (i === 0) return target / n;
  return target / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
}

/** SIP that increases by stepUpPct every 12 months. */
export function fvStepUpSip(monthly: number, stepUpPct: number, ratePct: number, years: number) {
  const i = pct(ratePct) / 12;
  const months = Math.round(years * 12);
  let value = 0;
  let invested = 0;
  let instalment = monthly;
  for (let m = 0; m < months; m++) {
    if (m > 0 && m % 12 === 0) instalment *= 1 + pct(stepUpPct);
    value = (value + instalment) * (1 + i);
    invested += instalment;
  }
  return { value, invested, gains: value - invested };
}

export type GoalInput = {
  years: number;
  costToday: number;
  inflationPct: number;
  existing: number;
  existingReturnPct: number;
  newReturnPct: number;
  lumpsum: number;
};

export type GoalResult = {
  futureCost: number;
  existingGrowsTo: number;
  lumpsumGrowsTo: number;
  shortfall: number;
  monthlySip: number;
};

/** Generic goal planner used by education, marriage, vacation and house calculators. */
export function planGoal(g: GoalInput): GoalResult {
  const futureCost = fvLumpsum(g.costToday, g.inflationPct, g.years);
  const existingGrowsTo = fvLumpsum(g.existing, g.existingReturnPct, g.years);
  const lumpsumGrowsTo = fvLumpsum(g.lumpsum, g.newReturnPct, g.years);
  const shortfall = Math.max(0, futureCost - existingGrowsTo - lumpsumGrowsTo);
  return { futureCost, existingGrowsTo, lumpsumGrowsTo, shortfall, monthlySip: sipForTarget(shortfall, g.newReturnPct, g.years) };
}

export type RetirementInput = {
  currentAge: number;
  retireAge: number;
  lifeExpectancy: number;
  monthlyExpense: number;
  inflationPct: number;
  preReturnPct: number;
  postReturnPct: number;
  existing: number;
};

export function planRetirement(r: RetirementInput) {
  const years = Math.max(0, r.retireAge - r.currentAge);
  const retiredYears = Math.max(0, r.lifeExpectancy - r.retireAge);
  const yearlyAtRetirement = r.monthlyExpense * 12 * Math.pow(1 + pct(r.inflationPct), years);
  const real = (1 + pct(r.postReturnPct)) / (1 + pct(r.inflationPct)) - 1;
  const corpus =
    Math.abs(real) < 1e-9
      ? yearlyAtRetirement * retiredYears
      : yearlyAtRetirement * ((1 - Math.pow(1 + real, -retiredYears)) / real) * (1 + real);
  const existingGrowsTo = fvLumpsum(r.existing, r.preReturnPct, years);
  const shortfall = Math.max(0, corpus - existingGrowsTo);
  return {
    years,
    retiredYears,
    monthlyExpenseAtRetirement: yearlyAtRetirement / 12,
    corpus,
    existingGrowsTo,
    shortfall,
    monthlySip: sipForTarget(shortfall, r.preReturnPct, years),
  };
}

// ---------------------------------------------------------------------------
// Returns from a NAV series
// ---------------------------------------------------------------------------

function navOnOrBefore(series: NavPoint[], date: Date): NavPoint | null {
  // series sorted ascending by date
  const target = date.toISOString().slice(0, 10);
  let lo = 0;
  let hi = series.length - 1;
  let best: NavPoint | null = null;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (series[mid].date <= target) {
      best = series[mid];
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return best;
}

function shift(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() - months);
  return d;
}

/** Point-to-point returns. 1M/6M/1Y absolute, 3Y/5Y annualised (CAGR). */
export function computeReturns(code: string, series: NavPoint[]): Returns {
  const out: Returns = { code, r1m: null, r6m: null, r1y: null, r3y: null, r5y: null };
  if (series.length < 2) return out;
  const last = series[series.length - 1];
  const end = new Date(last.date);
  const first = series[0];
  const calc = (months: number, annualise: boolean) => {
    const from = shift(end, months);
    if (first.date > from.toISOString().slice(0, 10)) return null;
    const start = navOnOrBefore(series, from);
    if (!start || start.nav <= 0) return null;
    const ratio = last.nav / start.nav;
    const v = annualise ? Math.pow(ratio, 12 / months) - 1 : ratio - 1;
    return Math.round(v * 10000) / 100;
  };
  out.r1m = calc(1, false);
  out.r6m = calc(6, false);
  out.r1y = calc(12, false);
  out.r3y = calc(36, true);
  out.r5y = calc(60, true);
  return out;
}

/** Simulates a monthly SIP on a NAV series. */
export function sipBacktest(series: NavPoint[], monthly: number, months: number) {
  if (series.length < 2) return null;
  const end = new Date(series[series.length - 1].date);
  let units = 0;
  let invested = 0;
  for (let m = months; m >= 1; m--) {
    const p = navOnOrBefore(series, shift(end, m));
    if (!p) continue;
    units += monthly / p.nav;
    invested += monthly;
  }
  if (invested === 0) return null;
  const value = units * series[series.length - 1].nav;
  return { invested, value, gains: value - invested, absolutePct: ((value - invested) / invested) * 100 };
}

/** Lumpsum on a NAV series: value today of an amount invested `months` ago. */
export function lumpsumBacktest(series: NavPoint[], amount: number, months: number) {
  if (series.length < 2) return null;
  const end = new Date(series[series.length - 1].date);
  const start = navOnOrBefore(series, shift(end, months));
  if (!start) return null;
  const value = (amount / start.nav) * series[series.length - 1].nav;
  const years = months / 12;
  return { invested: amount, value, gains: value - amount, cagrPct: (Math.pow(value / amount, 1 / years) - 1) * 100 };
}

// ---------------------------------------------------------------------------
// Tax harvesting (equity-oriented funds, Indian rules from 23 Jul 2024)
// ---------------------------------------------------------------------------

export const LTCG_EXEMPTION = 125000;
export const LTCG_RATE_PCT = 12.5;

export type HarvestHolding = {
  name: string;
  units: number;
  avgCost: number; // per unit
  nav: number; // per unit
  heldMonths: number;
};

export function planHarvest(holdings: HarvestHolding[], alreadyBookedLtcg: number) {
  let room = Math.max(0, LTCG_EXEMPTION - alreadyBookedLtcg);
  const suggestions = holdings
    .filter((h) => h.heldMonths > 12 && h.nav > h.avgCost && h.units > 0)
    .sort((a, b) => (b.nav - b.avgCost) / b.avgCost - (a.nav - a.avgCost) / a.avgCost)
    .map((h) => {
      const gainPerUnit = h.nav - h.avgCost;
      const maxGain = gainPerUnit * h.units;
      const take = Math.min(maxGain, room);
      room -= take;
      const units = take / gainPerUnit;
      return { name: h.name, units, redeemValue: units * h.nav, gainBooked: take };
    })
    .filter((s) => s.gainBooked > 0);
  const harvested = suggestions.reduce((a, s) => a + s.gainBooked, 0);
  return { suggestions, harvested, taxSaved: (harvested * LTCG_RATE_PCT) / 100, roomLeft: room };
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

export function formatINR(value: number, opts: { compact?: boolean } = {}) {
  if (!Number.isFinite(value)) return "–";
  if (opts.compact) {
    const abs = Math.abs(value);
    if (abs >= 1e7) return `₹${(value / 1e7).toFixed(2)} Cr`;
    if (abs >= 1e5) return `₹${(value / 1e5).toFixed(2)} L`;
  }
  const rounded = Math.round(value);
  const s = Math.abs(rounded).toString();
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${rounded < 0 ? "-" : ""}₹${rest ? rest + "," : ""}${last3}`;
}

/** Percentage with an arrow, so gain/loss never relies on colour alone. */
export function formatPct(v: number | null | undefined) {
  if (v === null || v === undefined || !Number.isFinite(v)) return "–";
  const arrow = v > 0 ? "▲ " : v < 0 ? "▼ " : "";
  return `${arrow}${Math.abs(v).toFixed(2)}%`;
}

/** 1500000 -> "15,00,000" (Indian grouping, no symbol). */
export function formatIndian(value: number) {
  if (!Number.isFinite(value)) return "";
  const [int, dec] = Math.abs(value).toString().split(".");
  const last3 = int.slice(-3);
  const rest = int.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${value < 0 ? "-" : ""}${rest ? rest + "," : ""}${last3}${dec ? "." + dec : ""}`;
}

/** 1500000 -> "₹15 lakh", 25000000 -> "₹2.5 crore". */
export function amountInWords(value: number) {
  const trim = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, "").replace(/\.$/, ""));
  if (value >= 1e7) return `₹${trim(value / 1e7)} crore`;
  if (value >= 1e5) return `₹${trim(value / 1e5)} lakh`;
  if (value >= 1e3) return `₹${trim(value / 1e3)} thousand`;
  return `₹${trim(value)}`;
}

/** "2026-11-20" -> "20 Nov 2026". */
export function formatDate(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${m[1]}`;
}
