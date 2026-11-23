import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View, type StyleProp, type ViewStyle } from "react-native";
import { surgam } from "@/components/surgam/theme";
import { F } from "./fonts";

export { F };

export const c = surgam.colors;
export const MAX_W = 1160;

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  return { width, isPhone: width < 640, isTablet: width >= 640 && width < 1000, isDesktop: width >= 1000 };
}

export type IconName = keyof typeof Ionicons.glyphMap;

export function Icon({ name, size = 20, color = c.ink }: { name: string; size?: number; color?: string }) {
  return <Ionicons name={name as IconName} size={size} color={color} />;
}

export function Container({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { isPhone } = useBreakpoint();
  return <View style={[{ width: "100%", maxWidth: MAX_W, alignSelf: "center", paddingHorizontal: isPhone ? 16 : 28 }, style]}>{children}</View>;
}

export function Section({ kicker, title, subtitle, children, tint = false, action }: { kicker?: string; title?: string; subtitle?: string; children?: ReactNode; tint?: boolean; action?: ReactNode }) {
  const { isPhone } = useBreakpoint();
  return (
    <View style={[{ paddingVertical: isPhone ? 40 : 72 }, tint && { backgroundColor: c.surface, borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.border }]}>
      <Container>
        {(title || kicker) && (
          <View style={[styles.sectionHead, isPhone && { flexDirection: "column", alignItems: "flex-start" }]}>
            <View style={{ flex: 1, gap: 6 }}>
              {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
              {title ? <Text style={[styles.h2, isPhone && { fontSize: 24, lineHeight: 31 }]} accessibilityRole="header">{title}</Text> : null}
              {subtitle ? <Text style={styles.lead}>{subtitle}</Text> : null}
            </View>
            {action}
          </View>
        )}
        {children}
      </Container>
    </View>
  );
}

export function Grid({ children, min = 260, gap = 16 }: { children: ReactNode; min?: number; gap?: number }) {
  const { width } = useBreakpoint();
  const inner = Math.min(width, MAX_W) - (width < 640 ? 32 : 56);
  const cols = Math.max(1, Math.floor((inner + gap) / (min + gap)));
  const items = Array.isArray(children) ? children.flat() : [children];
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap }}>
      {items.map((child, i) => (
        <View key={i} style={{ width: cols === 1 ? "100%" : Math.floor((inner - gap * (cols - 1)) / cols) }}>
          {child}
        </View>
      ))}
    </View>
  );
}

export function Card({ children, onPress, style, accessibilityLabel }: { children: ReactNode; onPress?: () => void; style?: ViewStyle; accessibilityLabel?: string }) {
  if (!onPress) return <View style={[styles.card, style]}>{children}</View>;
  return (
    <Pressable accessibilityRole="link" accessibilityLabel={accessibilityLabel} onPress={onPress} style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => [styles.card, hovered && styles.cardHover, pressed && { opacity: 0.85 }, style]}>
      {children}
    </Pressable>
  );
}

export function IconTile({ icon, tone = "teal" }: { icon: string; tone?: "teal" | "blue" | "amber" | "coral" }) {
  // Quiet, single-colour icon mark; tone kept for API compatibility but intentionally restrained.
  const fg = tone === "coral" ? c.coral : c.evergreen;
  return (
    <View style={styles.iconTile}>
      <Icon name={icon} size={20} color={fg} />
    </View>
  );
}

export function Button({ label, onPress, href, variant = "primary", icon, disabled, loading, full, size = "md" }: { label: string; onPress?: () => void; href?: string; variant?: "primary" | "secondary" | "ghost" | "light" | "outlineLight"; icon?: string; disabled?: boolean; loading?: boolean; full?: boolean; size?: "md" | "lg" }) {
  const router = useRouter();
  const v = {
    primary: { bg: c.evergreen, fg: c.white, border: c.evergreen },
    secondary: { bg: c.surface, fg: c.ink, border: c.border },
    ghost: { bg: "transparent", fg: c.evergreen, border: "transparent" },
    light: { bg: c.white, fg: c.navy, border: c.white },
    outlineLight: { bg: "transparent", fg: c.white, border: "rgba(255,255,255,0.35)" },
  }[variant];
  return (
    <Pressable
      accessibilityRole={href ? "link" : "button"}
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled || loading}
      onPress={() => (href ? router.push(href as never) : onPress?.())}
      style={({ pressed }) => [
        styles.btn,
        size === "lg" && { paddingVertical: 15, paddingHorizontal: 24 },
        { backgroundColor: v.bg, borderColor: v.border },
        full && { alignSelf: "stretch" },
        (disabled || loading) && { opacity: 0.5 },
        pressed && { opacity: 0.8 },
      ]}
    >
      {loading ? <ActivityIndicator size="small" color={v.fg} /> : null}
      <Text style={[styles.btnText, { color: v.fg }]}>{label}</Text>
      {icon && !loading ? <Icon name={icon} size={18} color={v.fg} /> : null}
    </Pressable>
  );
}

export function Pill({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: !!active }} onPress={onPress} style={[styles.pill, active && styles.pillActive]}>
      <Text style={[styles.pillText, active && { color: c.white }]}>{label}</Text>
    </Pressable>
  );
}

export function Tag({ label, tone = "teal" }: { label: string; tone?: "teal" | "blue" | "amber" | "coral" | "neutral" }) {
  const map = { teal: [c.mintSoft, c.evergreenDark], blue: [c.blueSoft, c.blue], amber: [c.amberSoft, c.amber], coral: [c.coralSoft, c.coral], neutral: [c.canvas, c.inkSoft] } as const;
  const [bg, fg] = map[tone];
  return (
    <View style={[styles.tag, { backgroundColor: bg }]}>
      <Text style={[styles.tagText, { color: fg }]}>{label}</Text>
    </View>
  );
}

export function NumberField({ label, value, onChange, prefix, suffix, min = 0, max = 1e10, step = 1, hint }: { label: string; value: number; onChange: (v: number) => void; prefix?: string; suffix?: string; min?: number; max?: number; step?: number; hint?: string }) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label} nativeID={`lbl-${label}`}>{label}</Text>
      <View style={styles.inputRow}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Decrease ${label}`} onPress={() => onChange(clamp(Number((value - step).toFixed(2))))} style={styles.stepBtn}>
          <Icon name="remove" size={18} color={c.evergreen} />
        </Pressable>
        {prefix ? <Text style={styles.affix}>{prefix}</Text> : null}
        <TextInput
          accessibilityLabelledBy={`lbl-${label}`}
          accessibilityLabel={label}
          value={Number.isFinite(value) ? String(value) : ""}
          onChangeText={(t) => {
            const n = Number(t.replace(/[^0-9.]/g, ""));
            onChange(Number.isFinite(n) ? clamp(n) : min);
          }}
          keyboardType="numeric"
          inputMode="decimal"
          style={styles.input}
        />
        {suffix ? <Text style={styles.affix}>{suffix}</Text> : null}
        <Pressable accessibilityRole="button" accessibilityLabel={`Increase ${label}`} onPress={() => onChange(clamp(Number((value + step).toFixed(2))))} style={styles.stepBtn}>
          <Icon name="add" size={18} color={c.evergreen} />
        </Pressable>
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export function TextField({ label, value, onChange, placeholder, keyboardType, maxLength, autoFocus }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; keyboardType?: "default" | "phone-pad" | "number-pad"; maxLength?: number; autoFocus?: boolean }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput accessibilityLabel={label} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={c.muted} keyboardType={keyboardType} maxLength={maxLength} autoFocus={autoFocus} style={[styles.inputRow, styles.inputText]} />
    </View>
  );
}

export function Stat({ label, value, tone }: { label: string; value: string; tone?: "pos" | "neg" }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, tone === "pos" && { color: c.gain }, tone === "neg" && { color: c.loss }]}>{value}</Text>
    </View>
  );
}

export function Notice({ text, tone = "blue" }: { text: string; tone?: "blue" | "amber" }) {
  return (
    <View style={[styles.notice, { backgroundColor: tone === "amber" ? c.amberSoft : c.blueSoft }]}>
      <Icon name="information-circle-outline" size={18} color={tone === "amber" ? c.amber : c.blue} />
      <Text style={[styles.noticeText, { color: tone === "amber" ? c.amber : c.blue }]}>{text}</Text>
    </View>
  );
}

export function Skeleton({ height = 72 }: { height?: number }) {
  return <View style={{ height, borderRadius: 16, backgroundColor: c.border, opacity: 0.5 }} />;
}

export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <View style={{ padding: 28, alignItems: "center", gap: 6 }}>
      <Icon name="file-tray-outline" size={28} color={c.muted} />
      <Text style={styles.h4}>{title}</Text>
      {body ? <Text style={[styles.body, { textAlign: "center" }]}>{body}</Text> : null}
    </View>
  );
}

export const styles = StyleSheet.create({
  sectionHead: { flexDirection: "row", alignItems: "flex-end", gap: 16, marginBottom: 32 },
  kicker: { fontFamily: F, color: c.muted, fontSize: 12, fontWeight: "600", letterSpacing: 1.2, textTransform: "uppercase" },
  h1: { fontFamily: F, color: c.ink, fontSize: 46, lineHeight: 54, fontWeight: "600", letterSpacing: -1.2 },
  h2: { fontFamily: F, color: c.ink, fontSize: 30, lineHeight: 38, fontWeight: "600", letterSpacing: -0.6 },
  h3: { fontFamily: F, color: c.ink, fontSize: 18, lineHeight: 26, fontWeight: "600", letterSpacing: -0.2 },
  h4: { fontFamily: F, color: c.ink, fontSize: 15, lineHeight: 22, fontWeight: "600" },
  lead: { fontFamily: F, color: c.inkSoft, fontSize: 17, lineHeight: 27, maxWidth: 680 },
  body: { fontFamily: F, color: c.inkSoft, fontSize: 15, lineHeight: 24 },
  small: { fontFamily: F, color: c.muted, fontSize: 13, lineHeight: 20 },
  card: { backgroundColor: c.surface, borderRadius: 12, borderWidth: 1, borderColor: c.border, padding: 24, gap: 10, flexGrow: 1 },
  cardHover: { borderColor: "#C5CFD7", transform: [{ translateY: -2 }], shadowColor: c.navy, shadowOpacity: 0.06, shadowRadius: 16, shadowOffset: { width: 0, height: 6 } },
  iconTile: { width: 40, height: 40, borderRadius: 8, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, alignItems: "center", justifyContent: "center" },
  btn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 11, paddingHorizontal: 18, borderRadius: 8, borderWidth: 1, minHeight: 44, alignSelf: "flex-start" },
  btnText: { fontFamily: F, fontSize: 15, fontWeight: "600" },
  pill: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface },
  pillActive: { backgroundColor: c.ink, borderColor: c.ink },
  pillText: { fontFamily: F, color: c.inkSoft, fontSize: 13, fontWeight: "500" },
  tag: { alignSelf: "flex-start", borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontFamily: F, fontSize: 12, fontWeight: "500" },
  label: { fontFamily: F, color: c.inkSoft, fontSize: 13, fontWeight: "500" },
  inputRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: c.border, borderRadius: 8, backgroundColor: c.surface, minHeight: 46, paddingHorizontal: 4 },
  inputText: { fontFamily: F, paddingHorizontal: 12, color: c.ink, fontSize: 15, fontWeight: "500" },
  input: { fontFamily: F, flex: 1, minWidth: 40, color: c.ink, fontSize: 15, fontWeight: "600", paddingVertical: 10, paddingHorizontal: 4, textAlign: "center", fontVariant: ["tabular-nums"] },
  affix: { fontFamily: F, color: c.muted, fontSize: 14, fontWeight: "500" },
  stepBtn: { width: 34, height: 34, borderRadius: 6, alignItems: "center", justifyContent: "center", backgroundColor: c.surfaceTint },
  hint: { fontFamily: F, color: c.muted, fontSize: 12 },
  statLabel: { fontFamily: F, color: c.muted, fontSize: 12, fontWeight: "500" },
  statValue: { fontFamily: F, color: c.ink, fontSize: 20, fontWeight: "600", fontVariant: ["tabular-nums"], letterSpacing: -0.3 },
  notice: { flexDirection: "row", gap: 8, alignItems: "flex-start", borderRadius: 8, padding: 12 },
  noticeText: { fontFamily: F, flex: 1, fontSize: 13, lineHeight: 19, fontWeight: "500" },
});
