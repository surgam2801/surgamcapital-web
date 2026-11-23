import Ionicons from "@expo/vector-icons/Ionicons";
import { usePathname, useRouter } from "expo-router";
import type { ReactNode } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { surgam, type SurgamIconName } from "./theme";
import { LanguagePicker } from "./language-picker";
import { F } from "@/components/site/fonts";

export { LanguagePicker };

const iconMap: Record<SurgamIconName, keyof typeof Ionicons.glyphMap> = {
  home: "home-outline",
  investments: "pie-chart-outline",
  plans: "repeat-outline",
  help: "help-circle-outline",
  plus: "add",
  "arrow-up": "arrow-up",
  "arrow-down": "arrow-down",
  chevron: "chevron-forward",
  bell: "notifications-outline",
  check: "checkmark-circle-outline",
  phone: "call-outline",
  chat: "chatbubble-ellipses-outline",
  document: "document-text-outline",
  calendar: "calendar-outline",
  close: "close",
  shield: "shield-checkmark-outline",
  settings: "settings-outline",
};

export function Icon({ name, size = 22, color = surgam.colors.ink }: { name: SurgamIconName; size?: number; color?: string }) {
  return <Ionicons name={iconMap[name]} size={size} color={color} />;
}

export function SurgamMark({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.brandRow}>
      <View style={styles.mark}>
        <Text style={styles.markText}>S</Text>
      </View>
      {!compact && <Text style={styles.wordmark}>Surgam</Text>}
    </View>
  );
}

const navItems: { label: string; icon: SurgamIconName; path: string }[] = [
  { label: "Overview", icon: "home", path: "/dashboard" },
  { label: "Investments", icon: "investments", path: "/dashboard/investments" },
  { label: "Money plans", icon: "plans", path: "/dashboard/plans" },
  { label: "Help & profile", icon: "help", path: "/dashboard/help" },
];

export function DesktopRail() {
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const router = useRouter();
  if (width < 900) return null;

  return (
    <View style={styles.rail}>
      <Pressable accessibilityRole="link" accessibilityLabel="Surgam home" onPress={() => router.push("/" as never)}>
        <SurgamMark />
      </Pressable>
      <Text style={styles.railKicker}>YOUR MONEY, SIMPLIFIED</Text>
      <View style={styles.railNav}>
        {navItems.map((item) => {
          const selected = item.path === "/dashboard" ? pathname === "/dashboard" : pathname.includes(item.path.split("/").pop() ?? "");
          return (
            <Pressable
              key={item.label}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={() => router.push(item.path as never)}
              style={({ pressed }) => [styles.railItem, selected && styles.railItemSelected, pressed && styles.pressed]}
            >
              <Icon name={item.icon} size={22} color={selected ? surgam.colors.evergreen : surgam.colors.inkSoft} />
              <Text style={[styles.railLabel, selected && styles.railLabelSelected]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.railSpacer} />
      <View style={{ marginBottom: 14 }}>
        <LanguagePicker />
      </View>
      <View style={styles.railTrust}>
        <Icon name="shield" size={20} color={surgam.colors.evergreen} />
        <Text style={styles.railTrustTitle}>A calm place for your plans</Text>
        <Text style={styles.railTrustBody}>No rush. Take one step at a time.</Text>
      </View>
      <Text style={styles.railVersion}>Surgam · Demo space</Text>
    </View>
  );
}

export function ScreenFrame({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const content = (
    <View style={[styles.content, { paddingTop: Math.max(insets.top, 18), paddingBottom: Math.max(insets.bottom, 28) }]}>
      {children}
    </View>
  );
  return (
    <View style={styles.root}>
      <DesktopRail />
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, width >= 900 && styles.scrollContentWide]}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.scroll}>{content}</View>
      )}
    </View>
  );
}

export function PageHeader({ eyebrow, title, subtitle, right }: { eyebrow?: string; title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <View style={styles.pageHeader}>
      <View style={styles.pageHeaderCopy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.pageTitle}>{title}</Text>
        {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <LanguagePicker compact />
        {right ? <View style={styles.pageHeaderRight}>{right}</View> : null}
      </View>
    </View>
  );
}

export function GreetingHeader({ onNotifications }: { onNotifications?: () => void }) {
  return (
    <View style={styles.greetingHeader}>
      <View style={styles.greetingBrand}><SurgamMark compact /></View>
      <View style={styles.greetingCopy}>
        <Text style={styles.greetingSmall}>Tuesday, 9 November 2026</Text>
        <Text style={styles.greetingTitle}>Good morning, Anita</Text>
      </View>
      <LanguagePicker compact />
      <Pressable accessibilityLabel="Notifications" accessibilityRole="button" onPress={onNotifications} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
        <Icon name="bell" size={23} color={surgam.colors.ink} />
        <View style={styles.notificationDot} />
      </Pressable>
    </View>
  );
}

export function SectionHeading({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Pressable accessibilityRole="button" onPress={onAction} style={({ pressed }) => [styles.inlineAction, pressed && styles.pressed]}><Text style={styles.inlineActionText}>{action}</Text><Icon name="chevron" size={16} color={surgam.colors.evergreen} /></Pressable> : null}
    </View>
  );
}

export function MetricCard({ label, value, hint, tone = "green", icon }: { label: string; value: string; hint: string; tone?: "green" | "blue" | "amber" | "neutral"; icon?: SurgamIconName }) {
  const palette = {
    green: { bg: surgam.colors.mintSoft, accent: surgam.colors.evergreen },
    blue: { bg: surgam.colors.blueSoft, accent: surgam.colors.blue },
    amber: { bg: surgam.colors.amberSoft, accent: surgam.colors.amber },
    neutral: { bg: surgam.colors.surface, accent: surgam.colors.inkSoft },
  }[tone];
  return (
    <View style={[styles.metricCard, { backgroundColor: palette.bg }]}>
      <View style={[styles.metricAccent, { backgroundColor: palette.accent }]} />
      <View style={styles.metricTopline}><Text style={styles.metricLabel}>{label}</Text>{icon ? <Icon name={icon} size={18} color={palette.accent} /> : null}</View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricHint}>{hint}</Text>
    </View>
  );
}

export function PrimaryButton({ label, onPress, icon = "arrow-up", secondary = false, full = false }: { label: string; onPress?: () => void; icon?: SurgamIconName; secondary?: boolean; full?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.primaryButton, secondary && styles.secondaryButton, full && styles.fullButton, pressed && styles.pressed]}
    >
      <Text style={[styles.primaryButtonText, secondary && styles.secondaryButtonText]}>{label}</Text>
      <Icon name={icon} size={18} color={secondary ? surgam.colors.evergreen : surgam.colors.white} />
    </Pressable>
  );
}

export function QuickAction({ label, helper, icon, onPress, tone = "green" }: { label: string; helper: string; icon: SurgamIconName; onPress?: () => void; tone?: "green" | "blue" | "amber" }) {
  const colors = tone === "blue" ? { bg: surgam.colors.blueSoft, icon: surgam.colors.blue } : tone === "amber" ? { bg: surgam.colors.amberSoft, icon: surgam.colors.amber } : { bg: surgam.colors.mintSoft, icon: surgam.colors.evergreen };
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]}>
      <View style={[styles.quickIcon, { backgroundColor: colors.bg }]}><Icon name={icon} size={22} color={colors.icon} /></View>
      <View style={styles.quickCopy}><Text style={styles.quickLabel}>{label}</Text><Text style={styles.quickHelper}>{helper}</Text></View>
      <Icon name="chevron" size={19} color={surgam.colors.muted} />
    </Pressable>
  );
}

export function TrendChart() {
  const points = [48, 54, 51, 64, 68, 78, 82, 96];
  const max = Math.max(...points);
  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}><View><Text style={styles.chartTitle}>Your progress</Text><Text style={styles.chartSubtitle}>Portfolio value · last 6 months</Text></View><View style={styles.chartLegend}><View style={styles.legendDot} /><Text style={styles.legendText}>Value</Text></View></View>
      <View style={styles.chartArea}>
        <View style={styles.chartGrid}><View style={styles.gridLine} /><View style={styles.gridLine} /><View style={styles.gridLine} /></View>
        <View style={styles.barRow}>
          {points.map((point, index) => <View key={index} style={styles.barTrack}><View style={[styles.bar, { height: `${(point / max) * 82}%`, opacity: 0.45 + index * 0.07 }]} /><Text style={styles.barLabel}>{["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"][index]}</Text></View>)}
        </View>
      </View>
    </View>
  );
}

export function StatusPill({ label, tone = "green" }: { label: string; tone?: "green" | "amber" | "blue" | "neutral" }) {
  const colors = tone === "amber" ? { bg: surgam.colors.amberSoft, text: surgam.colors.amber } : tone === "blue" ? { bg: surgam.colors.blueSoft, text: surgam.colors.blue } : tone === "neutral" ? { bg: surgam.colors.canvas, text: surgam.colors.inkSoft } : { bg: surgam.colors.mintSoft, text: surgam.colors.evergreenDark };
  return <View style={[styles.statusPill, { backgroundColor: colors.bg }]}><Text style={[styles.statusPillText, { color: colors.text }]}>{label}</Text></View>;
}

export function ListCard({ children, onPress }: { children: ReactNode; onPress?: () => void }) {
  if (onPress) {
    return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.listCard, pressed && styles.pressed]}>{children}</Pressable>;
  }
  return <View style={styles.listCard}>{children}</View>;
}

export function ConfirmSheet({ visible, title, body, confirmLabel = "Okay, got it", onClose }: { visible: boolean; title: string; body: string; confirmLabel?: string; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetIcon}><Icon name="check" size={30} color={surgam.colors.evergreen} /></View>
          <Text style={styles.sheetTitle}>{title}</Text>
          <Text style={styles.sheetBody}>{body}</Text>
          <PrimaryButton label={confirmLabel} icon="check" onPress={onClose} full />
          <Pressable accessibilityRole="button" onPress={onClose} style={({ pressed }) => [styles.sheetCancel, pressed && styles.pressed]}><Text style={styles.sheetCancelText}>Close</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

export function InsightCard({ title, body, icon = "shield", tone = "blue" }: { title: string; body: string; icon?: SurgamIconName; tone?: "blue" | "green" | "amber" }) {
  const colors = tone === "green" ? { bg: surgam.colors.mintSoft, icon: surgam.colors.evergreen } : tone === "amber" ? { bg: surgam.colors.amberSoft, icon: surgam.colors.amber } : { bg: surgam.colors.blueSoft, icon: surgam.colors.blue };
  return <View style={[styles.insightCard, { backgroundColor: colors.bg }]}><View style={[styles.insightIcon, { backgroundColor: surgam.colors.white }]}><Icon name={icon} size={20} color={colors.icon} /></View><View style={styles.insightCopy}><Text style={styles.insightTitle}>{title}</Text><Text style={styles.insightBody}>{body}</Text></View></View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: "row", backgroundColor: surgam.colors.canvas },
  rail: { width: 248, backgroundColor: surgam.colors.surface, borderRightWidth: 1, borderRightColor: surgam.colors.border, paddingHorizontal: 24, paddingTop: 30, paddingBottom: 26 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  mark: { width: 30, height: 30, borderRadius: 6, backgroundColor: surgam.colors.evergreen, alignItems: "center", justifyContent: "center" },
  markText: { fontFamily: F, color: surgam.colors.white, fontSize: 17, fontWeight: "700" },
  wordmark: { fontFamily: F, color: surgam.colors.ink, fontSize: 20, fontWeight: "600", letterSpacing: -0.4 },
  railKicker: { color: surgam.colors.muted, fontSize: 10, letterSpacing: 1.3, fontWeight: "700", marginTop: 28, marginBottom: 16 },
  railNav: { gap: 7 },
  railItem: { minHeight: 52, borderRadius: 15, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 13 },
  railItemSelected: { backgroundColor: surgam.colors.mintSoft },
  railLabel: { color: surgam.colors.inkSoft, fontSize: 15, fontWeight: "600" },
  railLabelSelected: { color: surgam.colors.evergreenDark, fontWeight: "800" },
  railSpacer: { flex: 1 },
  railTrust: { borderRadius: 18, backgroundColor: surgam.colors.canvas, padding: 16, gap: 7 },
  railTrustTitle: { color: surgam.colors.ink, fontSize: 14, fontWeight: "800", lineHeight: 20 },
  railTrustBody: { color: surgam.colors.muted, fontSize: 13, lineHeight: 18 },
  railVersion: { color: surgam.colors.muted, fontSize: 12, marginTop: 24 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  scrollContentWide: { maxWidth: 1220, width: "100%", alignSelf: "center" },
  content: { paddingHorizontal: 20, width: "100%", maxWidth: 1040, alignSelf: "center", gap: 28 },
  greetingHeader: { flexDirection: "row", alignItems: "center", gap: 14 },
  greetingBrand: { display: "none" },
  greetingCopy: { flex: 1 },
  greetingSmall: { color: surgam.colors.muted, fontSize: 14, marginBottom: 5 },
  greetingTitle: { color: surgam.colors.ink, fontSize: 28, lineHeight: 34, fontWeight: "800", letterSpacing: -0.5 },
  iconButton: { width: 50, height: 50, borderRadius: 17, backgroundColor: surgam.colors.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: surgam.colors.border },
  notificationDot: { position: "absolute", top: 12, right: 12, width: 7, height: 7, borderRadius: 4, backgroundColor: surgam.colors.coral },
  pageHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 16 },
  pageHeaderCopy: { flex: 1 },
  eyebrow: { color: surgam.colors.evergreen, fontSize: 13, fontWeight: "800", letterSpacing: 0.4, marginBottom: 7 },
  pageTitle: { color: surgam.colors.ink, fontSize: 30, lineHeight: 36, fontWeight: "800", letterSpacing: -0.6 },
  pageSubtitle: { color: surgam.colors.inkSoft, fontSize: 16, lineHeight: 24, marginTop: 8, maxWidth: 600 },
  pageHeaderRight: { marginTop: 2 },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 14 },
  sectionTitle: { color: surgam.colors.ink, fontSize: 19, lineHeight: 25, fontWeight: "800" },
  inlineAction: { flexDirection: "row", alignItems: "center", gap: 2, minHeight: 44 },
  inlineActionText: { color: surgam.colors.evergreen, fontSize: 14, fontWeight: "800" },
  metricCard: { minHeight: 146, borderRadius: surgam.radii.card, padding: 21, position: "relative", overflow: "hidden", flex: 1, minWidth: 0 },
  metricAccent: { position: "absolute", left: 0, top: 20, bottom: 20, width: 5, borderTopRightRadius: 5, borderBottomRightRadius: 5 },
  metricTopline: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 7, paddingLeft: 3 },
  metricLabel: { color: surgam.colors.inkSoft, fontSize: 14, fontWeight: "700" },
  metricValue: { color: surgam.colors.ink, fontSize: 29, lineHeight: 36, fontWeight: "800", letterSpacing: -0.7, marginTop: 16 },
  metricHint: { color: surgam.colors.inkSoft, fontSize: 13, lineHeight: 18, marginTop: 6 },
  primaryButton: { minHeight: 52, borderRadius: 16, backgroundColor: surgam.colors.evergreen, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  fullButton: { width: "100%" },
  primaryButtonText: { color: surgam.colors.white, fontSize: 15, fontWeight: "800" },
  secondaryButton: { backgroundColor: surgam.colors.surface, borderWidth: 1, borderColor: surgam.colors.border },
  secondaryButtonText: { color: surgam.colors.evergreenDark },
  quickAction: { flex: 1, minHeight: 84, borderRadius: 20, backgroundColor: surgam.colors.surface, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: surgam.colors.border },
  quickIcon: { width: 44, height: 44, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  quickCopy: { flex: 1 },
  quickLabel: { color: surgam.colors.ink, fontSize: 15, fontWeight: "800" },
  quickHelper: { color: surgam.colors.muted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  chartCard: { backgroundColor: surgam.colors.surface, borderRadius: surgam.radii.card, padding: 22, borderWidth: 1, borderColor: surgam.colors.border },
  chartHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  chartTitle: { color: surgam.colors.ink, fontSize: 18, fontWeight: "800" },
  chartSubtitle: { color: surgam.colors.muted, fontSize: 13, marginTop: 5 },
  chartLegend: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: surgam.colors.evergreen },
  legendText: { color: surgam.colors.muted, fontSize: 12, fontWeight: "700" },
  chartArea: { height: 185, marginTop: 20, position: "relative" },
  chartGrid: { position: "absolute", top: 6, left: 0, right: 0, bottom: 26, justifyContent: "space-between" },
  gridLine: { height: 1, backgroundColor: surgam.colors.border },
  barRow: { flex: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 8, paddingHorizontal: 4 },
  barTrack: { flex: 1, height: "100%", justifyContent: "flex-end", alignItems: "center", gap: 8 },
  bar: { width: "70%", maxWidth: 38, minHeight: 18, backgroundColor: surgam.colors.evergreen, borderRadius: 8 },
  barLabel: { color: surgam.colors.muted, fontSize: 11, fontWeight: "700" },
  statusPill: { borderRadius: surgam.radii.pill, paddingHorizontal: 10, paddingVertical: 6, alignSelf: "flex-start" },
  statusPillText: { fontSize: 12, fontWeight: "800" },
  listCard: { backgroundColor: surgam.colors.surface, borderRadius: 20, borderWidth: 1, borderColor: surgam.colors.border, padding: 17 },
  insightCard: { borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "flex-start", gap: 12 },
  insightIcon: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  insightCopy: { flex: 1, gap: 4 },
  insightTitle: { color: surgam.colors.ink, fontSize: 15, fontWeight: "800" },
  insightBody: { color: surgam.colors.inkSoft, fontSize: 14, lineHeight: 20 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(16, 33, 29, 0.42)", justifyContent: "flex-end", padding: 12 },
  sheet: { backgroundColor: surgam.colors.surface, borderRadius: 28, padding: 26, paddingBottom: Platform.OS === "web" ? 26 : 34, alignItems: "center", maxWidth: 520, width: "100%", alignSelf: "center" },
  sheetHandle: { width: 42, height: 5, borderRadius: 3, backgroundColor: surgam.colors.border, marginBottom: 24 },
  sheetIcon: { width: 64, height: 64, borderRadius: 22, backgroundColor: surgam.colors.mintSoft, alignItems: "center", justifyContent: "center", marginBottom: 15 },
  sheetTitle: { color: surgam.colors.ink, fontSize: 23, fontWeight: "800", textAlign: "center" },
  sheetBody: { color: surgam.colors.inkSoft, fontSize: 16, lineHeight: 24, textAlign: "center", marginTop: 10, marginBottom: 22 },
  sheetCancel: { minHeight: 44, paddingHorizontal: 18, justifyContent: "center", alignItems: "center" },
  sheetCancelText: { color: surgam.colors.muted, fontSize: 14, fontWeight: "800" },
  pressed: { opacity: 0.72 },
});
