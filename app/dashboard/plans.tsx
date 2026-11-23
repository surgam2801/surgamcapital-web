import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ConfirmSheet, ListCard, PageHeader, PrimaryButton, ScreenFrame, SectionHeading, StatusPill } from "@/components/surgam/ui";
import { surgam } from "@/components/surgam/theme";
import { MySips } from "@/components/site/orders";

const plans = [
  { type: "SIP", name: "Monthly Growth Plan", amount: "₹18,000 / month", next: "15 Nov 2026", detail: "Balanced Growth Fund", tone: "green" as const, label: "On track" },
  { type: "STP", name: "Steady Move Plan", amount: "₹10,000 / month", next: "01 Dec 2026", detail: "Moving from Short Horizon Fund", tone: "blue" as const, label: "Active" },
  { type: "SWP", name: "Monthly Support Plan", amount: "₹8,000 / month", next: "05 Dec 2026", detail: "To your linked bank account", tone: "amber" as const, label: "Active" },
];

export default function PlansScreen() {
  const [sheet, setSheet] = useState(false);
  return (
    <ScreenFrame>
      <PageHeader eyebrow="YOUR ROUTINES" title="Money plans" subtitle="Small, regular actions can make long-term money feel simpler." right={<PrimaryButton label="New plan" icon="plus" onPress={() => setSheet(true)} />} />
      <MySips />
      <View style={styles.planBanner}><View style={styles.bannerIcon}><Text style={styles.bannerIconText}>↗</Text></View><View style={styles.bannerCopy}><Text style={styles.bannerTitle}>Keep your routine comfortable</Text><Text style={styles.bannerBody}>Your next contribution is planned. You can review or change a plan before its next date.</Text></View></View>
      <View style={styles.section}><SectionHeading title="Your active plans" /><View style={styles.list}>{plans.map((plan) => <ListCard key={plan.name} onPress={() => setSheet(true)}><View style={styles.planTop}><View style={styles.typeBadge}><Text style={styles.typeText}>{plan.type}</Text></View><View style={styles.planCopy}><Text style={styles.planName}>{plan.name}</Text><Text style={styles.planDetail}>{plan.detail}</Text></View><StatusPill label={plan.label} tone={plan.tone} /></View><View style={styles.planBottom}><View><Text style={styles.label}>Amount</Text><Text style={styles.value}>{plan.amount}</Text></View><View><Text style={styles.label}>Next date</Text><Text style={styles.value}>{plan.next}</Text></View><Text style={styles.chevron}>›</Text></View></ListCard>)}</View></View>
      <View style={styles.section}><SectionHeading title="Helpful options" /><View style={styles.optionRow}><View style={styles.optionCopy}><Text style={styles.optionTitle}>Step-up SIP</Text><Text style={styles.optionBody}>Increase your monthly amount gently as your income grows.</Text></View><Text style={styles.optionAction} onPress={() => setSheet(true)}>Explore ›</Text></View><View style={styles.optionRow}><View style={styles.optionCopy}><Text style={styles.optionTitle}>Set a trigger</Text><Text style={styles.optionBody}>Get a reminder when the market moves, so you can decide calmly.</Text></View><Text style={styles.optionAction} onPress={() => setSheet(true)}>Explore ›</Text></View></View>
      <ConfirmSheet visible={sheet} title="Let's set this up gently" body="In the full Surgam app, this next step would guide you through a one-time mandate and a clear review screen before anything is activated. This demo keeps the flow safe and does not create a real plan." onClose={() => setSheet(false)} />
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  planBanner: { flexDirection: "row", gap: 14, padding: 18, borderRadius: 22, backgroundColor: surgam.colors.evergreenDark },
  bannerIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: surgam.colors.mint, alignItems: "center", justifyContent: "center" },
  bannerIconText: { color: surgam.colors.evergreenDark, fontSize: 24, fontWeight: "900" },
  bannerCopy: { flex: 1 },
  bannerTitle: { color: surgam.colors.white, fontSize: 16, fontWeight: "800" },
  bannerBody: { color: "#D8EFE6", fontSize: 14, lineHeight: 20, marginTop: 5 },
  section: { gap: 14 },
  list: { gap: 12 },
  planTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  typeBadge: { width: 48, height: 46, borderRadius: 14, backgroundColor: surgam.colors.surfaceTint, alignItems: "center", justifyContent: "center" },
  typeText: { color: surgam.colors.evergreenDark, fontSize: 13, fontWeight: "900" },
  planCopy: { flex: 1 },
  planName: { color: surgam.colors.ink, fontSize: 16, fontWeight: "800" },
  planDetail: { color: surgam.colors.muted, fontSize: 13, marginTop: 4 },
  planBottom: { borderTopWidth: 1, borderTopColor: surgam.colors.border, marginTop: 17, paddingTop: 14, flexDirection: "row", alignItems: "flex-end", gap: 28 },
  label: { color: surgam.colors.muted, fontSize: 12, fontWeight: "700" },
  value: { color: surgam.colors.ink, fontSize: 14, fontWeight: "800", marginTop: 5 },
  chevron: { color: surgam.colors.muted, fontSize: 26, marginLeft: "auto" },
  optionRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: surgam.colors.surface, borderWidth: 1, borderColor: surgam.colors.border, borderRadius: 20, padding: 17 },
  optionCopy: { flex: 1 },
  optionTitle: { color: surgam.colors.ink, fontSize: 15, fontWeight: "800" },
  optionBody: { color: surgam.colors.inkSoft, fontSize: 14, lineHeight: 20, marginTop: 4 },
  optionAction: { color: surgam.colors.evergreen, fontSize: 14, fontWeight: "800" },
});
