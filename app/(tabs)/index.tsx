import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import {
  ConfirmSheet,
  GreetingHeader,
  InsightCard,
  MetricCard,
  PrimaryButton,
  QuickAction,
  ScreenFrame,
  SectionHeading,
  StatusPill,
  TrendChart,
} from "@/components/surgam/ui";
import { surgam } from "@/components/surgam/theme";

export default function DashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [sheet, setSheet] = useState<{ title: string; body: string } | null>(null);
  const wide = width >= 780;
  const showMessage = (title: string, body: string) => setSheet({ title, body });

  return (
    <ScreenFrame>
      <GreetingHeader onNotifications={() => showMessage("You are all caught up", "There is one reminder about your SIP this month. We will keep it here so nothing gets missed.")} />

      <View style={styles.welcomeRow}>
        <View style={styles.welcomeCopy}>
          <Text style={styles.eyebrow}>YOUR MONEY AT A GLANCE</Text>
          <Text style={styles.heroTitle}>A calmer view of your progress.</Text>
          <Text style={styles.heroBody}>Everything important is here. Take one small step whenever you are ready.</Text>
        </View>
        <View style={styles.syncCard}>
          <View style={styles.syncDot} />
          <View><Text style={styles.syncLabel}>Updated today</Text><Text style={styles.syncText}>09 Nov, 9:42 AM</Text></View>
        </View>
      </View>

      <View style={[styles.metricsRow, !wide && styles.metricsStack]}>
        <MetricCard label="Total value" value="₹ 12,48,560" hint="+ ₹ 1,84,200 overall gain" tone="green" icon="arrow-up" />
        <MetricCard label="Invested amount" value="₹ 10,64,360" hint="Across 6 investments" tone="blue" icon="document" />
        <MetricCard label="This month" value="₹ 18,000" hint="Your planned contribution" tone="amber" icon="calendar" />
      </View>

      <View style={styles.mainGrid}>
        <View style={styles.mainColumn}>
          <TrendChart />
          <View style={styles.sectionBlock}>
            <SectionHeading title="Do this next" action="See all" onAction={() => router.push("/(tabs)/plans" as never)} />
            <View style={styles.stack}>
              <QuickAction label="Add money" helper="Make an additional investment" icon="plus" onPress={() => showMessage("Add money", "This is a safe demo. In the full Surgam app, you would review the amount and confirm before anything is submitted.")} />
              <QuickAction label="View reports" helper="See valuation and gain/loss" icon="document" tone="blue" onPress={() => router.push("/(tabs)/investments" as never)} />
            </View>
          </View>
        </View>

        <View style={styles.sideColumn}>
          <View style={styles.statusCard}>
            <View style={styles.statusTop}><View><Text style={styles.statusKicker}>YOUR PLAN</Text><Text style={styles.statusTitle}>You are on track</Text></View><View style={styles.checkCircle}><Text style={styles.checkMark}>✓</Text></View></View>
            <Text style={styles.statusBody}>Your regular investments are moving steadily toward your long-term goal.</Text>
            <View style={styles.statusProgress}><View style={styles.statusProgressFill} /></View>
            <View style={styles.progressRow}><Text style={styles.progressLabel}>This year</Text><Text style={styles.progressValue}>8 of 12 months</Text></View>
          </View>

          <View style={styles.sectionBlock}>
            <SectionHeading title="Coming up" action="View plans" onAction={() => router.push("/(tabs)/plans" as never)} />
            <Pressable onPress={() => showMessage("SIP reminder", "Your ₹18,000 monthly SIP is scheduled for 15 November. You can review it before the date.")} style={({ pressed }) => [styles.upcomingCard, pressed && styles.pressed]}>
              <View style={styles.dateBadge}><Text style={styles.dateDay}>15</Text><Text style={styles.dateMonth}>NOV</Text></View>
              <View style={styles.upcomingCopy}><Text style={styles.upcomingTitle}>Monthly SIP</Text><Text style={styles.upcomingBody}>₹18,000 · Auto-invest</Text></View>
              <StatusPill label="Scheduled" tone="green" />
            </Pressable>
          </View>

          <InsightCard title="A gentle reminder" body="Markets can move up and down. Your plan is designed for the long run, so there is no need to react to every change." icon="shield" tone="blue" />
        </View>
      </View>

      <View style={styles.footerNote}><Text style={styles.footerNoteText}>Surgam is a planning space. Demo numbers are for illustration only.</Text><PrimaryButton label="Need help?" icon="chat" secondary onPress={() => router.push("/(tabs)/help" as never)} /></View>
      <ConfirmSheet visible={Boolean(sheet)} title={sheet?.title ?? "Done"} body={sheet?.body ?? ""} onClose={() => setSheet(null)} />
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  welcomeRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 20 },
  welcomeCopy: { flex: 1, maxWidth: 670 },
  eyebrow: { color: surgam.colors.evergreen, fontSize: 12, fontWeight: "800", letterSpacing: 1.4, marginBottom: 8 },
  heroTitle: { color: surgam.colors.ink, fontSize: 31, lineHeight: 38, fontWeight: "800", letterSpacing: -0.8 },
  heroBody: { color: surgam.colors.inkSoft, fontSize: 16, lineHeight: 24, marginTop: 8, maxWidth: 560 },
  syncCard: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 15, backgroundColor: surgam.colors.surface, borderWidth: 1, borderColor: surgam.colors.border },
  syncDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: surgam.colors.evergreen },
  syncLabel: { color: surgam.colors.ink, fontSize: 12, fontWeight: "800" },
  syncText: { color: surgam.colors.muted, fontSize: 12, marginTop: 2 },
  metricsRow: { flexDirection: "row", gap: 14 },
  metricsStack: { flexDirection: "column" },
  mainGrid: { flexDirection: "row", gap: 20, alignItems: "flex-start" },
  mainColumn: { flex: 1.45, gap: 28 },
  sideColumn: { flex: 1, gap: 24 },
  sectionBlock: { gap: 14 },
  stack: { gap: 12 },
  statusCard: { backgroundColor: surgam.colors.evergreenDark, borderRadius: surgam.radii.card, padding: 22 },
  statusTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  statusKicker: { color: surgam.colors.mint, fontSize: 11, fontWeight: "800", letterSpacing: 1.1 },
  statusTitle: { color: surgam.colors.white, fontSize: 22, fontWeight: "800", marginTop: 5 },
  checkCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: surgam.colors.mint, alignItems: "center", justifyContent: "center" },
  checkMark: { color: surgam.colors.evergreenDark, fontSize: 23, fontWeight: "900" },
  statusBody: { color: "#D8EFE6", fontSize: 14, lineHeight: 21, marginTop: 17 },
  statusProgress: { height: 9, borderRadius: 5, backgroundColor: "#4B9383", marginTop: 22, overflow: "hidden" },
  statusProgressFill: { height: "100%", width: "67%", backgroundColor: surgam.colors.mint, borderRadius: 5 },
  progressRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 9 },
  progressLabel: { color: "#B9DED1", fontSize: 12 },
  progressValue: { color: surgam.colors.white, fontSize: 12, fontWeight: "800" },
  upcomingCard: { backgroundColor: surgam.colors.surface, borderWidth: 1, borderColor: surgam.colors.border, borderRadius: 20, padding: 15, flexDirection: "row", alignItems: "center", gap: 12 },
  dateBadge: { width: 48, height: 52, borderRadius: 14, backgroundColor: surgam.colors.mintSoft, alignItems: "center", justifyContent: "center" },
  dateDay: { color: surgam.colors.evergreenDark, fontSize: 20, lineHeight: 22, fontWeight: "900" },
  dateMonth: { color: surgam.colors.evergreen, fontSize: 10, lineHeight: 12, fontWeight: "900", letterSpacing: 0.6 },
  upcomingCopy: { flex: 1 },
  upcomingTitle: { color: surgam.colors.ink, fontSize: 15, fontWeight: "800" },
  upcomingBody: { color: surgam.colors.muted, fontSize: 13, marginTop: 4 },
  footerNote: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12, paddingTop: 2 },
  footerNoteText: { flex: 1, color: surgam.colors.muted, fontSize: 12, lineHeight: 18 },
  pressed: { opacity: 0.72 },
});
