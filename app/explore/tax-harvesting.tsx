import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SiteShell } from "@/components/site/shell";
import { Button, c, Card, EmptyState, Icon, Notice, NumberField, Section, Stat, TextField, styles as t, useBreakpoint } from "@/components/site/ui";
import { formatINR, LTCG_EXEMPTION, LTCG_RATE_PCT, planHarvest, type HarvestHolding } from "@/shared/mf/calc";

const blank = (): HarvestHolding => ({ name: "", units: 100, avgCost: 50, nav: 80, heldMonths: 18 });

export default function TaxHarvesting() {
  const { isDesktop } = useBreakpoint();
  const [holdings, setHoldings] = useState<HarvestHolding[]>([{ name: "Equity fund A", units: 2000, avgCost: 40, nav: 95, heldMonths: 30 }, { name: "Equity fund B", units: 1500, avgCost: 60, nav: 82, heldMonths: 20 }]);
  const [booked, setBooked] = useState(0);
  const plan = planHarvest(holdings, booked);
  const update = (i: number, patch: Partial<HarvestHolding>) => setHoldings((h) => h.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  return (
    <SiteShell>
      <Section kicker="Explore" title="Tax harvesting" subtitle={`Long-term gains on equity funds up to ${formatINR(LTCG_EXEMPTION)} a year are tax-free. Booking gains up to that limit, and reinvesting, raises your cost and lowers future tax.`}>
        <View style={{ flexDirection: isDesktop ? "row" : "column", gap: 20, alignItems: "flex-start" }}>
          <View style={{ ...(isDesktop ? { flex: 1.3 } : { width: "100%" }), gap: 14 }}>
            <Card style={{ height: undefined }}>
              <NumberField label="Long-term gains already booked this financial year" prefix="₹" value={booked} onChange={setBooked} step={5000} min={0} max={1e9} />
            </Card>
            {holdings.map((h, i) => (
              <Card key={i} style={{ height: undefined, gap: 12 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <Text style={t.h4}>Holding {i + 1}</Text>
                  <Pressable accessibilityRole="button" accessibilityLabel={`Remove holding ${i + 1}`} onPress={() => setHoldings((x) => x.filter((_, j) => j !== i))}>
                    <Icon name="trash-outline" size={18} color={c.muted} />
                  </Pressable>
                </View>
                <TextField label="Fund name" value={h.name} onChange={(v) => update(i, { name: v })} />
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                  <View style={{ flex: 1, minWidth: 150 }}><NumberField label="Units" value={h.units} onChange={(v) => update(i, { units: v })} step={50} /></View>
                  <View style={{ flex: 1, minWidth: 150 }}><NumberField label="Months held" value={h.heldMonths} onChange={(v) => update(i, { heldMonths: Math.round(v) })} max={600} /></View>
                  <View style={{ flex: 1, minWidth: 150 }}><NumberField label="Average cost / unit" prefix="₹" value={h.avgCost} onChange={(v) => update(i, { avgCost: v })} step={1} /></View>
                  <View style={{ flex: 1, minWidth: 150 }}><NumberField label="Current NAV" prefix="₹" value={h.nav} onChange={(v) => update(i, { nav: v })} step={1} /></View>
                </View>
              </Card>
            ))}
            <Button label="Add a holding" variant="secondary" icon="add" onPress={() => setHoldings((x) => [...x, blank()])} />
          </View>
          <Card style={{ ...(isDesktop ? { flex: 1 } : { width: "100%" }), height: undefined, gap: 14 }}>
            <Text style={t.h3}>Suggestion</Text>
            <View style={{ flexDirection: "row", gap: 24, flexWrap: "wrap" }}>
              <Stat label="Gains to book" value={formatINR(plan.harvested)} tone="pos" />
              <Stat label="Future tax saved" value={formatINR(plan.taxSaved)} tone="pos" />
            </View>
            {plan.suggestions.length === 0 ? (
              <EmptyState title="Nothing to harvest" body="Only units held over 12 months with a gain qualify, and only while your yearly limit is not used up." />
            ) : (
              plan.suggestions.map((sg) => (
                <View key={sg.name} style={{ borderWidth: 1, borderColor: c.border, borderRadius: 14, padding: 12, gap: 4 }}>
                  <Text style={t.h4}>{sg.name || "Unnamed fund"}</Text>
                  <Text style={t.body}>Redeem {sg.units.toFixed(3)} units (about {formatINR(sg.redeemValue)}) and reinvest.</Text>
                  <Text style={t.small}>Books {formatINR(sg.gainBooked)} of long-term gain.</Text>
                </View>
              ))
            )}
            <Notice tone="amber" text={`Assumes the rules from 23 July 2024: ${LTCG_RATE_PCT}% tax on equity long-term gains above ${formatINR(LTCG_EXEMPTION)} a year. Uses average cost, while tax law applies first-in, first-out. Check exit loads and talk to a tax adviser before acting.`} />
          </Card>
        </View>
      </Section>
    </SiteShell>
  );
}
