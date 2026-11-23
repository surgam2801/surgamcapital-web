import { useState } from "react";
import { Text, View } from "react-native";
import { NavChart } from "@/components/site/chart";
import { FundPicker } from "@/components/site/fund-picker";
import { SiteShell } from "@/components/site/shell";
import { Card, EmptyState, NumberField, Pill, Section, Skeleton, Stat, styles as t, useBreakpoint } from "@/components/site/ui";
import { formatINR, formatPct } from "@/shared/mf/calc";
import type { Scheme } from "@/shared/mf/types";
import { trpc } from "@/lib/trpc";

const PERIODS = [
  { label: "1 year", months: 12, range: "1Y" },
  { label: "3 years", months: 36, range: "3Y" },
  { label: "5 years", months: 60, range: "5Y" },
  { label: "10 years", months: 120, range: "MAX" },
] as const;

export default function ReturnAnalyzer() {
  const { isDesktop } = useBreakpoint();
  const [fund, setFund] = useState<Scheme | null>(null);
  const [mode, setMode] = useState<"SIP" | "LUMPSUM">("SIP");
  const [amount, setAmount] = useState(5000);
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>(PERIODS[1]);
  const bt = trpc.mf.backtest.useQuery({ code: fund?.code ?? "", mode, amount: Math.max(100, amount), months: period.months }, { enabled: !!fund, retry: false });
  const hist = trpc.mf.history.useQuery({ code: fund?.code ?? "", range: period.range }, { enabled: !!fund, retry: false });
  const d = bt.data;
  return (
    <SiteShell>
      <Section kicker="Explore" title="Return analyzer" subtitle="See what a SIP or one-time investment in a fund would be worth today, based on its actual NAVs.">
        <View style={{ flexDirection: isDesktop ? "row" : "column", gap: 20, alignItems: "flex-start" }}>
          <Card style={{ ...(isDesktop ? { flex: 1 } : { width: "100%" }), height: undefined, gap: 16 }}>
            <FundPicker value={fund} onChange={setFund} />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pill label="Monthly SIP" active={mode === "SIP"} onPress={() => setMode("SIP")} />
              <Pill label="One-time" active={mode === "LUMPSUM"} onPress={() => setMode("LUMPSUM")} />
            </View>
            <NumberField label={mode === "SIP" ? "Monthly amount" : "Amount invested"} prefix="₹" value={amount} onChange={setAmount} step={1000} min={100} max={1e8} />
            <View style={{ gap: 8 }}>
              <Text style={t.label}>Invested over the last</Text>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                {PERIODS.map((p) => (
                  <Pill key={p.label} label={p.label} active={p.label === period.label} onPress={() => setPeriod(p)} />
                ))}
              </View>
            </View>
          </Card>
          <Card style={{ ...(isDesktop ? { flex: 1.2 } : { width: "100%" }), height: undefined, gap: 16 }}>
            {!fund ? (
              <EmptyState title="Pick a fund to begin" body="Search by fund name or fund house on the left." />
            ) : bt.isLoading ? (
              <Skeleton height={200} />
            ) : !d ? (
              <EmptyState title="Not enough history" body="This fund does not have NAVs for the whole period. Try a shorter one." />
            ) : (
              <>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 24 }}>
                  <Stat label="You would have invested" value={formatINR(d.invested)} />
                  <Stat label="Worth today" value={formatINR(d.value)} tone={d.value >= d.invested ? "pos" : "neg"} />
                  <Stat label="Gain" value={formatINR(d.gains)} tone={d.gains >= 0 ? "pos" : "neg"} />
                  <Stat label={"cagrPct" in d ? "Annualised return" : "Absolute return"} value={formatPct("cagrPct" in d ? d.cagrPct : d.absolutePct)} />
                </View>
                {hist.data ? <NavChart points={hist.data} height={180} /> : null}
              </>
            )}
            <Text style={t.small}>Uses historical NAVs and ignores exit loads and taxes. Past performance does not guarantee future returns.</Text>
          </Card>
        </View>
      </Section>
    </SiteShell>
  );
}
