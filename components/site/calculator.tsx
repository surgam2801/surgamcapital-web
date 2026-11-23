import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { formatINR, fvSip, fvStepUpSip, planGoal, planRetirement } from "@/shared/mf/calc";
import type { CalculatorDef } from "@/shared/mf/content";
import { Bars } from "./chart";
import { Button, c, Card, F, NumberField, Pill, styles as t, useBreakpoint } from "./ui";

function Result({ rows, headline, headlineLabel, note }: { rows: { label: string; value: string }[]; headline: string; headlineLabel: string; note?: string }) {
  return (
    <View style={{ gap: 14 }}>
      <View style={{ backgroundColor: c.navy, borderRadius: 10, padding: 20, gap: 6 }}>
        <Text style={{ fontFamily: F, color: "#9FB0BB", fontSize: 13, fontWeight: "500" }}>{headlineLabel}</Text>
        <Text style={{ fontFamily: F, color: c.white, fontSize: 32, fontWeight: "600", letterSpacing: -0.8, fontVariant: ["tabular-nums"] }}>{headline}</Text>
      </View>
      {rows.map((r) => (
        <View key={r.label} style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, borderBottomWidth: 1, borderBottomColor: c.border, paddingBottom: 10 }}>
          <Text style={[t.body, { flex: 1 }]}>{r.label}</Text>
          <Text style={t.h4}>{r.value}</Text>
        </View>
      ))}
      {note ? <Text style={t.small}>{note}</Text> : null}
    </View>
  );
}

const NOTE = "Estimates use the rates you enter and assume steady returns. Actual returns vary with markets; this is not a promise of returns.";

export function Calculator({ def }: { def: CalculatorDef }) {
  const router = useRouter();
  const { isDesktop } = useBreakpoint();
  const [v, setV] = useState<Record<string, number>>(def.defaults);
  const set = (k: string) => (n: number) => setV((p) => ({ ...p, [k]: n }));

  let fields: React.ReactNode;
  let result: React.ReactNode;

  if (def.kind === "goal") {
    const r = planGoal({ years: v.years, costToday: v.costToday, inflationPct: v.inflationPct, existing: v.existing, existingReturnPct: v.existingReturnPct, newReturnPct: v.newReturnPct, lumpsum: v.lumpsum });
    fields = (
      <>
        <NumberField label="Years to goal" value={v.years} onChange={set("years")} min={1} max={40} suffix="yrs" />
        <NumberField label={def.costLabel ?? "Cost today"} value={v.costToday} onChange={set("costToday")} prefix="₹" step={50000} min={0} max={1e9} />
        <NumberField label="Assumed inflation" value={v.inflationPct} onChange={set("inflationPct")} suffix="%" step={0.5} min={0} max={20} />
        <NumberField label="Savings already set aside" value={v.existing} onChange={set("existing")} prefix="₹" step={10000} min={0} max={1e9} />
        <NumberField label="Return on those savings" value={v.existingReturnPct} onChange={set("existingReturnPct")} suffix="%" step={0.5} min={0} max={20} />
        <NumberField label="Expected return on new investments" value={v.newReturnPct} onChange={set("newReturnPct")} suffix="%" step={0.5} min={0} max={20} />
        <NumberField label="One-time amount you can invest now" value={v.lumpsum} onChange={set("lumpsum")} prefix="₹" step={10000} min={0} max={1e9} />
      </>
    );
    result = (
      <Result
        headlineLabel={`Monthly SIP for ${v.years} years`}
        headline={formatINR(r.monthlySip)}
        rows={[
          { label: `Goal cost in ${v.years} years`, value: formatINR(r.futureCost) },
          { label: "Your savings will grow to", value: formatINR(r.existingGrowsTo) },
          { label: "One-time amount will grow to", value: formatINR(r.lumpsumGrowsTo) },
          { label: "Still to plan for", value: formatINR(r.shortfall) },
        ]}
        note={NOTE}
      />
    );
  } else if (def.kind === "retirement") {
    const r = planRetirement({ currentAge: v.currentAge, retireAge: v.retireAge, lifeExpectancy: v.lifeExpectancy, monthlyExpense: v.monthlyExpense, inflationPct: v.inflationPct, preReturnPct: v.preReturnPct, postReturnPct: v.postReturnPct, existing: v.existing });
    fields = (
      <>
        <NumberField label="Your age today" value={v.currentAge} onChange={set("currentAge")} min={18} max={70} suffix="yrs" />
        <NumberField label="Age you want to retire" value={v.retireAge} onChange={set("retireAge")} min={v.currentAge + 1} max={80} suffix="yrs" />
        <NumberField label="Plan until age" value={v.lifeExpectancy} onChange={set("lifeExpectancy")} min={v.retireAge + 1} max={100} suffix="yrs" />
        <NumberField label="Monthly expenses today" value={v.monthlyExpense} onChange={set("monthlyExpense")} prefix="₹" step={5000} min={0} max={1e7} />
        <NumberField label="Assumed inflation" value={v.inflationPct} onChange={set("inflationPct")} suffix="%" step={0.5} min={0} max={15} />
        <NumberField label="Return before retirement" value={v.preReturnPct} onChange={set("preReturnPct")} suffix="%" step={0.5} min={0} max={20} />
        <NumberField label="Return after retirement" value={v.postReturnPct} onChange={set("postReturnPct")} suffix="%" step={0.5} min={0} max={15} />
        <NumberField label="Retirement savings so far" value={v.existing} onChange={set("existing")} prefix="₹" step={50000} min={0} max={1e10} />
      </>
    );
    result = (
      <Result
        headlineLabel={`Monthly SIP for ${r.years} years`}
        headline={formatINR(r.monthlySip)}
        rows={[
          { label: "Monthly expenses when you retire", value: formatINR(r.monthlyExpenseAtRetirement) },
          { label: "Corpus needed at retirement", value: formatINR(r.corpus, { compact: true }) },
          { label: "Your savings will grow to", value: formatINR(r.existingGrowsTo, { compact: true }) },
          { label: "Still to plan for", value: formatINR(r.shortfall, { compact: true }) },
        ]}
        note={NOTE}
      />
    );
  } else if (def.kind === "sip") {
    const value = fvSip(v.monthly, v.returnPct, v.years);
    const invested = v.monthly * 12 * v.years;
    fields = (
      <>
        <NumberField label="Monthly SIP" value={v.monthly} onChange={set("monthly")} prefix="₹" step={500} min={0} max={1e7} />
        <NumberField label="Years" value={v.years} onChange={set("years")} min={1} max={40} suffix="yrs" />
        <NumberField label="Expected return" value={v.returnPct} onChange={set("returnPct")} suffix="%" step={0.5} min={0} max={20} />
      </>
    );
    result = (
      <View style={{ gap: 16 }}>
        <Result headlineLabel={`Value after ${v.years} years`} headline={formatINR(value, { compact: true })} rows={[{ label: "Amount you invest", value: formatINR(invested) }, { label: "Estimated gains", value: formatINR(value - invested) }]} note={NOTE} />
        <Bars rows={[{ label: "Invested", value: invested }, { label: "Gains", value: value - invested }]} format={(n) => formatINR(n, { compact: true })} />
      </View>
    );
  } else {
    const r = fvStepUpSip(v.monthly, v.stepUpPct, v.returnPct, v.years);
    const flat = fvSip(v.monthly, v.returnPct, v.years);
    fields = (
      <>
        <NumberField label="Starting monthly SIP" value={v.monthly} onChange={set("monthly")} prefix="₹" step={500} min={0} max={1e7} />
        <NumberField label="Yearly step-up" value={v.stepUpPct} onChange={set("stepUpPct")} suffix="%" step={1} min={0} max={50} />
        <NumberField label="Years" value={v.years} onChange={set("years")} min={1} max={40} suffix="yrs" />
        <NumberField label="Expected return" value={v.returnPct} onChange={set("returnPct")} suffix="%" step={0.5} min={0} max={20} />
      </>
    );
    result = (
      <View style={{ gap: 16 }}>
        <Result headlineLabel={`Value after ${v.years} years`} headline={formatINR(r.value, { compact: true })} rows={[{ label: "Amount you invest", value: formatINR(r.invested) }, { label: "Estimated gains", value: formatINR(r.gains) }, { label: "Without step-up you would have", value: formatINR(flat, { compact: true }) }]} note={NOTE} />
        <Bars rows={[{ label: "With step-up", value: r.value }, { label: "Without step-up", value: flat }]} format={(n) => formatINR(n, { compact: true })} />
      </View>
    );
  }

  return (
    <View style={{ flexDirection: isDesktop ? "row" : "column", gap: 20, alignItems: "flex-start" }}>
      <Card style={{ ...(isDesktop ? { flex: 1 } : { width: "100%" }), height: undefined, gap: 16 }}>{fields}</Card>
      <Card style={{ ...(isDesktop ? { flex: 1 } : { width: "100%" }), height: undefined, gap: 16 }}>
        {result}
        <Text style={[t.body, { fontWeight: "500", color: c.ink }]}>{def.prompt}</Text>
        <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
          <Button label="Start a SIP" icon="arrow-forward" href="/mutual-funds/sip" />
          <Button label="Save as a goal" variant="secondary" onPress={() => router.push("/explore/goal-planning" as never)} />
        </View>
      </Card>
    </View>
  );
}

export function CalculatorTabs({ items, active, onSelect }: { items: CalculatorDef[]; active: string; onSelect: (slug: string) => void }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
      {items.map((x) => (
        <Pill key={x.slug} label={x.title} active={x.slug === active} onPress={() => onSelect(x.slug)} />
      ))}
    </View>
  );
}
