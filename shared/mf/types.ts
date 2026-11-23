export type BroadCategory = "Equity" | "Debt" | "Hybrid" | "Solution" | "Index & ETF" | "Other";

export type Scheme = {
  code: string; // AMFI scheme code
  name: string;
  amc: string;
  category: BroadCategory;
  subCategory: string; // e.g. "Large Cap Fund"
  isin?: string;
  nav: number;
  navDate: string; // ISO yyyy-mm-dd
};

export type NavPoint = { date: string; nav: number };

export type Returns = {
  code: string;
  r1m: number | null;
  r6m: number | null;
  r1y: number | null;
  r3y: number | null; // CAGR
  r5y: number | null; // CAGR
};

export type SchemeWithReturns = Scheme & { returns?: Returns };

export type DataStatus = {
  source: "amfi" | "sample";
  schemes: number;
  lastRefreshed: string | null;
  message?: string;
};

export type OrderKind = "LUMPSUM" | "SIP";
export type OrderStatus = "PENDING_PAYMENT" | "SUBMITTED" | "ALLOTTED" | "CANCELLED";

export type Order = {
  id: string;
  investorId: string;
  code: string;
  schemeName: string;
  kind: OrderKind;
  amount: number;
  sipDay?: number;
  status: OrderStatus;
  createdAt: string;
  idempotencyKey?: string;
};

export type SipPlan = {
  id: string;
  investorId: string;
  orderId?: string;
  code: string;
  schemeName: string;
  amount: number;
  day: number;
  stepUpPct: number;
  status: "ACTIVE" | "PAUSED" | "STOPPED";
  nextRun: string;
  createdAt: string;
};

export type Goal = {
  id: string;
  investorId: string;
  name: string;
  kind: string;
  targetToday: number;
  years: number;
  inflationPct: number;
  returnPct: number;
  createdAt: string;
};

export type Investor = {
  id: string;
  phone: string;
  name?: string;
  createdAt: string;
};

export type Nfo = {
  id: string;
  name: string;
  amc: string;
  category: BroadCategory;
  subCategory: string;
  opens: string;
  closes: string;
  minAmount: number;
  note?: string;
};
