// Surgam's own copy and catalogue definitions for the Mutual Fund site.
import type { BroadCategory, Nfo, Scheme } from "./types";

export type WayToInvest = {
  slug: string;
  title: string;
  short: string;
  icon: string; // Ionicons name
  intro: string;
  points: string[];
  // which schemes to suggest on the detail page
  match: { categories?: BroadCategory[]; subCategoryIncludes?: string[] };
  cta: "SIP" | "LUMPSUM";
};

export const WAYS_TO_INVEST: WayToInvest[] = [
  {
    slug: "smart-combos",
    title: "Smart Combos",
    short: "Ready-made fund baskets for one goal",
    icon: "layers-outline",
    intro: "A small set of funds picked to work together, so you can invest in one go instead of choosing fund by fund.",
    points: ["Two to four funds that balance each other", "One amount, split for you", "Review the mix every year"],
    match: { subCategoryIncludes: ["Multi Asset", "Flexi Cap", "Large & Mid Cap"] },
    cta: "LUMPSUM",
  },
  {
    slug: "asset-allocation",
    title: "Asset Allocation Combos",
    short: "Pick a fixed equity–debt mix",
    icon: "pie-chart-outline",
    intro: "Choose how much you want in equity and how much in debt. We map that mix to funds you can hold for years.",
    points: ["Conservative, balanced or growth mixes", "Debt part steadies the ride", "Rebalance when the mix drifts"],
    match: { categories: ["Hybrid"] },
    cta: "LUMPSUM",
  },
  {
    slug: "sip",
    title: "SIP",
    short: "Invest a fixed amount every month",
    icon: "repeat-outline",
    intro: "A Systematic Investment Plan moves a set amount from your bank to a fund on the same date each month.",
    points: ["Start from ₹500 a month", "Buys more units when prices dip", "Pause, step up or stop any time"],
    match: { subCategoryIncludes: ["Large Cap", "Flexi Cap", "Index"] },
    cta: "SIP",
  },
  {
    slug: "elss",
    title: "ELSS",
    short: "Save tax under the old regime",
    icon: "receipt-outline",
    intro: "Equity Linked Savings Schemes are equity funds with a three-year lock-in that qualify for deduction under Section 80C (old tax regime).",
    points: ["Shortest lock-in among 80C options", "Equity growth potential", "SIP or one-time"],
    match: { subCategoryIncludes: ["ELSS"] },
    cta: "SIP",
  },
  {
    slug: "instant",
    title: "Instant Access Funds",
    short: "Park money you may need soon",
    icon: "flash-outline",
    intro: "Liquid and overnight funds keep money close at hand. Some fund houses pay a part of a redemption to your bank within minutes.",
    points: ["Low volatility, short maturity", "Instant redemption where the fund offers it", "A home for your emergency fund"],
    match: { subCategoryIncludes: ["Liquid", "Overnight"] },
    cta: "LUMPSUM",
  },
  {
    slug: "gold",
    title: "Gold Accumulation Plan",
    short: "Build gold through funds, little by little",
    icon: "sparkles-outline",
    intro: "Gold funds and gold ETFs track the price of gold, so you can collect it monthly without lockers or making charges.",
    points: ["Start small, add monthly", "No storage or purity worries", "Redeem to your bank"],
    match: { subCategoryIncludes: ["Gold"] },
    cta: "SIP",
  },
];

export type TopList = {
  slug: string;
  title: string;
  blurb: string;
  categories?: BroadCategory[];
  subCategoryIncludes?: string[];
  sortBy: "r1y" | "r3y" | "r5y";
};

export const TOP_LISTS: TopList[] = [
  {
    slug: "top-equity",
    title: "Top equity funds",
    blurb: "Equity funds with the strongest three-year record in their category.",
    subCategoryIncludes: ["Large Cap", "Flexi Cap", "Mid Cap", "Large & Mid Cap"],
    sortBy: "r3y",
  },
  {
    slug: "shortlisted",
    title: "Surgam shortlist",
    blurb: "A short, diversified list across equity, hybrid and debt for first-time investors.",
    subCategoryIncludes: ["Flexi Cap", "Balanced Advantage", "Dynamic Asset", "Short Duration", "Index"],
    sortBy: "r3y",
  },
  {
    slug: "fd-alternatives",
    title: "Alternatives to a bank FD",
    blurb: "Lower-volatility debt and arbitrage funds for money you will not touch for a year or more.",
    subCategoryIncludes: ["Arbitrage", "Short Duration", "Corporate Bond", "Banking and PSU", "Money Market"],
    sortBy: "r1y",
  },
];

export type ExploreTool = { slug: string; title: string; blurb: string; icon: string };

export const EXPLORE_TOOLS: ExploreTool[] = [
  { slug: "performance", title: "Fund performance", blurb: "Compare returns across a category.", icon: "stats-chart-outline" },
  { slug: "nfo", title: "New fund offers", blurb: "Funds that are open or opening soon.", icon: "megaphone-outline" },
  { slug: "return-analyzer", title: "Return analyzer", blurb: "See what a SIP or lumpsum would have earned.", icon: "analytics-outline" },
  { slug: "industry-analyzer", title: "Industry analyzer", blurb: "How the fund industry is spread by category and fund house.", icon: "business-outline" },
  { slug: "debt-analyzer", title: "Debt fund analyzer", blurb: "Line up debt categories side by side.", icon: "shield-outline" },
  { slug: "goal-planning", title: "Goal planning", blurb: "Save several goals and the SIP each one needs.", icon: "flag-outline" },
  { slug: "tax-harvesting", title: "Tax harvesting", blurb: "Use your yearly tax-free long-term gain.", icon: "leaf-outline" },
];

export type CalculatorKind = "goal" | "retirement" | "sip" | "stepup";

export type CalculatorDef = {
  slug: string;
  title: string;
  short: string;
  icon: string;
  kind: CalculatorKind;
  costLabel?: string;
  defaults: Record<string, number>;
  prompt: string;
};

export const CALCULATORS: CalculatorDef[] = [
  {
    slug: "child-education",
    title: "Child education",
    short: "College fees, planned early",
    icon: "school-outline",
    kind: "goal",
    costLabel: "Education cost today",
    defaults: { years: 12, costToday: 1500000, inflationPct: 8, existing: 0, existingReturnPct: 7, newReturnPct: 12, lumpsum: 0 },
    prompt: "Start now and the monthly amount stays small.",
  },
  {
    slug: "child-marriage",
    title: "Child marriage",
    short: "A wedding fund without loans",
    icon: "heart-outline",
    kind: "goal",
    costLabel: "Wedding cost today",
    defaults: { years: 18, costToday: 2000000, inflationPct: 7, existing: 0, existingReturnPct: 7, newReturnPct: 12, lumpsum: 0 },
    prompt: "A long runway lets equity do more of the work.",
  },
  {
    slug: "retirement",
    title: "Retirement",
    short: "How big a corpus you need",
    icon: "sunny-outline",
    kind: "retirement",
    defaults: { currentAge: 30, retireAge: 60, lifeExpectancy: 85, monthlyExpense: 40000, inflationPct: 6, preReturnPct: 12, postReturnPct: 7, existing: 0 },
    prompt: "Your future self will thank you for every year you start earlier.",
  },
  {
    slug: "sip-wealth",
    title: "SIP wealth",
    short: "What a monthly SIP can grow to",
    icon: "trending-up-outline",
    kind: "sip",
    defaults: { monthly: 10000, years: 15, returnPct: 12 },
    prompt: "Small, regular amounts add up over time.",
  },
  {
    slug: "sip-step-up",
    title: "SIP step-up",
    short: "Raise your SIP as you earn more",
    icon: "bar-chart-outline",
    kind: "stepup",
    defaults: { monthly: 10000, stepUpPct: 10, years: 15, returnPct: 12 },
    prompt: "A yearly step-up keeps your plan in line with your income.",
  },
  {
    slug: "dream-vacation",
    title: "Dream vacation",
    short: "Travel paid for in advance",
    icon: "airplane-outline",
    kind: "goal",
    costLabel: "Trip cost today",
    defaults: { years: 3, costToday: 400000, inflationPct: 6, existing: 0, existingReturnPct: 6, newReturnPct: 9, lumpsum: 0 },
    prompt: "For short goals, hybrid and debt funds fit better than pure equity.",
  },
  {
    slug: "dream-house",
    title: "Dream house",
    short: "Your down payment, on schedule",
    icon: "home-outline",
    kind: "goal",
    costLabel: "Down payment needed today",
    defaults: { years: 7, costToday: 2500000, inflationPct: 6, existing: 0, existingReturnPct: 7, newReturnPct: 11, lumpsum: 0 },
    prompt: "Plan the down payment and keep the loan smaller.",
  },
];

export const OFFERINGS = [
  { title: "Planning", body: "Goal calculators and a risk profile so every rupee has a job.", icon: "compass-outline" },
  { title: "Transactions", body: "One-time, SIP, switch and redeem from one place.", icon: "swap-horizontal-outline" },
  { title: "Reports", body: "Valuation, capital gains and transaction statements when you need them.", icon: "document-text-outline" },
  { title: "Manage account", body: "Bank, nominee and contact details, kept up to date.", icon: "person-circle-outline" },
  { title: "Scheme research", body: "Returns, risk and portfolio facts for each fund.", icon: "search-outline" },
  { title: "Industry research", body: "Category trends to see the bigger picture.", icon: "globe-outline" },
];

export const FAQS = [
  { q: "What is a mutual fund?", a: "A mutual fund pools money from many investors and a professional fund manager invests it in shares, bonds or both. You own units, and their value (the NAV) moves with the investments." },
  { q: "How much do I need to start?", a: "Most funds accept a SIP from ₹500 a month or a one-time amount from ₹1,000 to ₹5,000, depending on the scheme." },
  { q: "What is NAV?", a: "Net Asset Value is the price of one unit of a fund. It is published by the fund house every business day." },
  { q: "Can I stop a SIP?", a: "Yes. You can pause, change or stop a SIP at any time. There is no penalty for stopping, though exit loads may apply when you redeem units early." },
  { q: "How are mutual fund gains taxed?", a: "For equity-oriented funds, gains on units held over 12 months are long-term and taxed at 12.5% above ₹1.25 lakh a year; gains within 12 months are taxed at 20%. Debt fund gains are added to your income. Rules can change, so check the current law or a tax adviser." },
  { q: "Is my money safe with Surgam?", a: "Your investment goes directly to the fund house in your name. Surgam never holds your money. Mutual funds are subject to market risk, so returns are not guaranteed." },
  { q: "What do I need to open an account?", a: "Your PAN, Aadhaar-linked mobile number, a bank account in your name and a few minutes for KYC." },
];

/** Shown only when live AMFI data cannot be reached (e.g. an offline APK). Values are illustrative. */
export const SAMPLE_SCHEMES: Scheme[] = [
  { code: "S0001", name: "Sample Large Cap Fund - Regular Growth", amc: "Sample AMC One", category: "Equity", subCategory: "Large Cap Fund", nav: 512.34, navDate: "2026-11-20" },
  { code: "S0002", name: "Sample Flexi Cap Fund - Regular Growth", amc: "Sample AMC Two", category: "Equity", subCategory: "Flexi Cap Fund", nav: 88.12, navDate: "2026-11-20" },
  { code: "S0003", name: "Sample Mid Cap Fund - Regular Growth", amc: "Sample AMC One", category: "Equity", subCategory: "Mid Cap Fund", nav: 145.9, navDate: "2026-11-20" },
  { code: "S0004", name: "Sample Tax Saver (ELSS) - Regular Growth", amc: "Sample AMC Three", category: "Equity", subCategory: "ELSS", nav: 97.45, navDate: "2026-11-20" },
  { code: "S0005", name: "Sample Balanced Advantage Fund - Regular Growth", amc: "Sample AMC Two", category: "Hybrid", subCategory: "Balanced Advantage Fund", nav: 42.8, navDate: "2026-11-20" },
  { code: "S0006", name: "Sample Multi Asset Fund - Regular Growth", amc: "Sample AMC Three", category: "Hybrid", subCategory: "Multi Asset Allocation", nav: 31.2, navDate: "2026-11-20" },
  { code: "S0007", name: "Sample Arbitrage Fund - Regular Growth", amc: "Sample AMC One", category: "Hybrid", subCategory: "Arbitrage Fund", nav: 18.6, navDate: "2026-11-20" },
  { code: "S0008", name: "Sample Liquid Fund - Regular Growth", amc: "Sample AMC Two", category: "Debt", subCategory: "Liquid Fund", nav: 3120.55, navDate: "2026-11-20" },
  { code: "S0009", name: "Sample Short Duration Fund - Regular Growth", amc: "Sample AMC Three", category: "Debt", subCategory: "Short Duration Fund", nav: 27.4, navDate: "2026-11-20" },
  { code: "S0010", name: "Sample Corporate Bond Fund - Regular Growth", amc: "Sample AMC One", category: "Debt", subCategory: "Corporate Bond Fund", nav: 34.9, navDate: "2026-11-20" },
  { code: "S0011", name: "Sample Nifty 50 Index Fund - Regular Growth", amc: "Sample AMC Two", category: "Index & ETF", subCategory: "Index Funds", nav: 24.7, navDate: "2026-11-20" },
  { code: "S0012", name: "Sample Gold Fund - Regular Growth", amc: "Sample AMC Three", category: "Other", subCategory: "Gold FoF", nav: 29.3, navDate: "2026-11-20" },
];

/** Admin-managed in production. These are placeholders until the NFO feed is wired. */
export const SAMPLE_NFOS: Nfo[] = [
  { id: "nfo-1", name: "Sample Innovation Fund", amc: "Sample AMC One", category: "Equity", subCategory: "Thematic", opens: "2026-11-25", closes: "2026-12-09", minAmount: 1000, note: "Placeholder listing" },
  { id: "nfo-2", name: "Sample Target Maturity 2031 Fund", amc: "Sample AMC Two", category: "Debt", subCategory: "Target Maturity", opens: "2026-12-01", closes: "2026-12-12", minAmount: 5000, note: "Placeholder listing" },
  { id: "nfo-3", name: "Sample Nifty Midcap 150 Index Fund", amc: "Sample AMC Three", category: "Index & ETF", subCategory: "Index Funds", opens: "2026-11-18", closes: "2026-11-29", minAmount: 500, note: "Placeholder listing" },
];

export const DISCLAIMER =
  "Mutual fund investments are subject to market risks. Read all scheme-related documents carefully before investing. Past performance does not guarantee future returns.";
