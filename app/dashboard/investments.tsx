import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ConfirmSheet, InsightCard, ListCard, PageHeader, ScreenFrame, SectionHeading, StatusPill } from "@/components/surgam/ui";
import { surgam } from "@/components/surgam/theme";
import { MyOrders } from "@/components/site/orders";

const holdings = [
  { name: "Balanced Growth Fund", type: "Hybrid · Long term", value: "₹ 4,82,240", gain: "+ ₹ 62,440", gainPct: "+14.9%", tone: "green" as const, category: "Balanced" },
  { name: "Steady Bluechip Fund", type: "Equity · Large cap", value: "₹ 3,14,560", gain: "+ ₹ 41,120", gainPct: "+15.0%", tone: "green" as const, category: "Equity" },
  { name: "Short Horizon Fund", type: "Debt · Short term", value: "₹ 2,76,800", gain: "+ ₹ 18,960", gainPct: "+7.4%", tone: "blue" as const, category: "Debt" },
  { name: "Tax Saver Plan", type: "Equity · ELSS", value: "₹ 1,74,960", gain: "+ ₹ 12,680", gainPct: "+7.8%", tone: "amber" as const, category: "Tax saver" },
];
const filters = ["All", "Balanced", "Equity", "Debt", "Tax saver"];

export default function InvestmentsScreen() {
  const [filter, setFilter] = useState("All");
  const [sheet, setSheet] = useState(false);
  const visible = filter === "All" ? holdings : holdings.filter((item) => item.category === filter);
  return (
    <ScreenFrame>
      <PageHeader eyebrow="YOUR PORTFOLIO" title="Investments" subtitle="A simple view of where your money is today." right={<StatusPill label="Updated today" tone="green" />} />
      <MyOrders />
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}><Text style={styles.summaryLabel}>Current value</Text><Text style={styles.summaryValue}>₹ 12,48,560</Text><Text style={styles.summaryHint}>Across 4 investments</Text></View>
        <View style={styles.summaryCard}><Text style={styles.summaryLabel}>Overall gain</Text><Text style={[styles.summaryValue, styles.greenText]}>+ ₹ 1,35,200</Text><Text style={styles.summaryHint}>11.5% since you started</Text></View>
      </View>
      <InsightCard title="Your investments are spread out" body="A mix of balanced, equity, debt, and tax-saving funds can help your plan stay steady over time." icon="shield" tone="green" />
      <View style={styles.section}><SectionHeading title="Your investments" action="View reports" onAction={() => setSheet(true)} /><View style={styles.filters}>{filters.map((item) => <Text key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterSelected]}>{item}</Text>)}</View><View style={styles.list}>{visible.map((item) => <ListCard key={item.name} onPress={() => setSheet(true)}><View style={styles.holdingTop}><View style={styles.holdingIcon}><Text style={styles.holdingLetter}>{item.name.slice(0, 1)}</Text></View><View style={styles.holdingCopy}><Text style={styles.holdingName}>{item.name}</Text><Text style={styles.holdingType}>{item.type}</Text></View><Text style={styles.chevron}>›</Text></View><View style={styles.holdingBottom}><View><Text style={styles.holdingLabel}>Current value</Text><Text style={styles.holdingValue}>{item.value}</Text></View><View style={styles.gainWrap}><Text style={styles.holdingLabel}>Gain</Text><Text style={[styles.holdingValue, item.tone === "green" ? styles.greenText : styles.blueText]}>{item.gain}</Text><Text style={styles.gainPct}>{item.gainPct}</Text></View></View></ListCard>)}</View></View>
      <View style={styles.reportRow}><View style={styles.reportCopy}><Text style={styles.reportTitle}>Need a report?</Text><Text style={styles.reportBody}>Download a clear valuation or gain/loss summary whenever you need it.</Text></View><Text style={styles.reportAction} onPress={() => setSheet(true)}>Open reports ›</Text></View>
      <ConfirmSheet visible={sheet} title="Reports are ready" body="In the full Surgam app, this is where you would choose a valuation or gain/loss report and save it securely. This demo does not download files." onClose={() => setSheet(false)} />
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  summaryRow: { flexDirection: "row", gap: 14 },
  summaryCard: { flex: 1, backgroundColor: surgam.colors.surface, borderRadius: 20, borderWidth: 1, borderColor: surgam.colors.border, padding: 18 },
  summaryLabel: { color: surgam.colors.inkSoft, fontSize: 14, fontWeight: "700" },
  summaryValue: { color: surgam.colors.ink, fontSize: 25, fontWeight: "900", marginTop: 12 },
  summaryHint: { color: surgam.colors.muted, fontSize: 13, marginTop: 5 },
  greenText: { color: surgam.colors.evergreen },
  blueText: { color: surgam.colors.blue },
  section: { gap: 14 },
  filters: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  filter: { color: surgam.colors.inkSoft, backgroundColor: surgam.colors.surface, borderWidth: 1, borderColor: surgam.colors.border, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13, fontWeight: "700", overflow: "hidden" },
  filterSelected: { color: surgam.colors.white, backgroundColor: surgam.colors.evergreen, borderColor: surgam.colors.evergreen },
  list: { gap: 12 },
  holdingTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  holdingIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: surgam.colors.mintSoft, alignItems: "center", justifyContent: "center" },
  holdingLetter: { color: surgam.colors.evergreenDark, fontSize: 20, fontWeight: "900" },
  holdingCopy: { flex: 1 },
  holdingName: { color: surgam.colors.ink, fontSize: 16, fontWeight: "800" },
  holdingType: { color: surgam.colors.muted, fontSize: 13, marginTop: 4 },
  chevron: { color: surgam.colors.muted, fontSize: 26, marginLeft: 3 },
  holdingBottom: { borderTopWidth: 1, borderTopColor: surgam.colors.border, marginTop: 17, paddingTop: 14, flexDirection: "row", justifyContent: "space-between", gap: 12 },
  holdingLabel: { color: surgam.colors.muted, fontSize: 12, fontWeight: "700" },
  holdingValue: { color: surgam.colors.ink, fontSize: 16, fontWeight: "800", marginTop: 5 },
  gainWrap: { alignItems: "flex-end" },
  gainPct: { color: surgam.colors.muted, fontSize: 12, marginTop: 3 },
  reportRow: { backgroundColor: surgam.colors.surfaceTint, borderRadius: 20, padding: 18, flexDirection: "row", alignItems: "center", gap: 14 },
  reportCopy: { flex: 1 },
  reportTitle: { color: surgam.colors.ink, fontSize: 16, fontWeight: "800" },
  reportBody: { color: surgam.colors.inkSoft, fontSize: 14, lineHeight: 20, marginTop: 4 },
  reportAction: { color: surgam.colors.evergreen, fontSize: 14, fontWeight: "800" },
});
