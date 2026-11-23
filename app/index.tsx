import { StyleSheet, Text, View } from "react-native";
import { SiteShell } from "@/components/site/shell";
import { Button, c, Container, F, Grid, IconTile, Section, styles as t, useBreakpoint } from "@/components/site/ui";
import { formatINR, fvSip } from "@/shared/mf/calc";
import { CalculatorStrip, TopListsGrid, WaysToInvestGrid } from "@/components/site/sections";
import { trpc } from "@/lib/trpc";

function NumbersStrip() {
  const status = trpc.mf.status.useQuery(undefined, { retry: false, staleTime: 10 * 60_000 });
  const industry = trpc.mf.industry.useQuery(undefined, { retry: false, staleTime: 10 * 60_000 });
  const { isPhone } = useBreakpoint();
  const live = status.data?.source === "amfi";
  const items = [
    { value: live ? status.data!.schemes.toLocaleString("en-IN") : "3,000+", label: "Funds to research" },
    { value: industry.data && live ? String(industry.data.amcCount) : "40+", label: "Fund houses" },
    { value: "₹500", label: "Minimum monthly SIP" },
    { value: "Daily", label: "NAV and returns refresh" },
  ];
  return (
    <View style={[s.numbers, isPhone && { flexDirection: "row", flexWrap: "wrap" }]}>
      {items.map((n, i) => (
        <View key={n.label} style={[s.numberItem, isPhone ? { flexBasis: "50%" } : i > 0 && s.numberDivider]}>
          <Text style={s.numberValue}>{n.value}</Text>
          <Text style={s.numberLabel}>{n.label}</Text>
        </View>
      ))}
    </View>
  );
}

function ProjectionPanel() {
  const years = [1, 3, 5, 8, 10, 12, 15];
  const values = years.map((y) => fvSip(5000, 12, y));
  const max = values[values.length - 1];
  return (
    <View style={s.panel}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <View style={{ gap: 4 }}>
          <Text style={s.panelLabel}>SIP projection</Text>
          <Text style={s.panelValue}>{formatINR(max, { compact: true })}</Text>
          <Text style={s.panelSub}>₹5,000 a month for 15 years</Text>
        </View>
        <View style={s.panelChip}>
          <Text style={s.panelChipText}>12% p.a. assumed</Text>
        </View>
      </View>
      <View style={s.bars}>
        {values.map((v, i) => (
          <View key={years[i]} style={{ flex: 1, alignItems: "center", gap: 6 }}>
            <View style={[s.bar, { height: Math.max(6, (v / max) * 120), opacity: 0.35 + (0.65 * (i + 1)) / years.length }]} />
            <Text style={s.barLabel}>{years[i]}y</Text>
          </View>
        ))}
      </View>
      <View style={s.panelRow}>
        <View>
          <Text style={s.panelLabel}>You invest</Text>
          <Text style={s.panelStat}>{formatINR(5000 * 12 * 15, { compact: true })}</Text>
        </View>
        <View>
          <Text style={s.panelLabel}>Estimated gains</Text>
          <Text style={[s.panelStat, { color: c.gain }]}>{formatINR(max - 5000 * 12 * 15, { compact: true })}</Text>
        </View>
      </View>
      <Text style={s.panelFoot}>Illustration only. Returns are not guaranteed.</Text>
    </View>
  );
}

export default function Home() {
  const { isPhone, isDesktop } = useBreakpoint();
  return (
    <SiteShell>
      <View style={[s.hero, !isDesktop && { paddingTop: 48, paddingBottom: 48 }]}>
        <Container style={[s.heroRow, !isDesktop && { flexDirection: "column", alignItems: "stretch", gap: 32 }]}>
          <View style={{ flex: 1.15, gap: 20 }}>
            <Text style={[t.kicker, { color: c.onDarkAccent }]}>Mutual fund investing</Text>
            <Text style={[t.h1, { color: c.white }, isPhone && { fontSize: 34, lineHeight: 42 }]} accessibilityRole="header">
              Grow your money with a plan you understand.
            </Text>
            <Text style={[t.lead, { color: c.onDarkBody }]}>
              Surgam helps families choose mutual funds with clear, plain-language guidance. Set a goal, start a SIP and always know where you stand.
            </Text>
            <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
              <Button label="Start investing" variant="light" size="lg" href="/sign-in" />
              <Button label="Explore mutual funds" variant="outlineLight" size="lg" href="/mutual-funds" />
            </View>
          </View>
          <View style={isDesktop ? { flex: 0.85 } : undefined}>
            <ProjectionPanel />
          </View>
        </Container>
      </View>

      <Container style={{ marginTop: isDesktop ? -40 : 24 }}>
        <NumbersStrip />
      </Container>

      <Section kicker="Products · Mutual funds" title="Ways to invest" subtitle="Choose the approach that fits how you save. You can combine more than one.">
        <WaysToInvestGrid />
      </Section>

      <Section tint kicker="Fund lists" title="A considered place to start" subtitle="Shortlists built from published fund data and refreshed every business day.">
        <TopListsGrid />
      </Section>

      <Section kicker="Why Surgam" title="Clarity over jargon">
        <Grid min={240} gap={32}>
          {[
            { icon: "chatbox-ellipses-outline", title: "Plain language", body: "Every screen explains what a number means and what you can do next." },
            { icon: "lock-closed-outline", title: "Your money stays yours", body: "Investments go straight to the fund house in your name. Surgam never holds your money." },
            { icon: "flag-outline", title: "Goal first", body: "Start from what you are saving for and let the plan work out the monthly amount." },
            { icon: "people-outline", title: "People who help", body: "Speak to a Surgam guide whenever you are unsure. No pressure, ever." },
          ].map((f) => (
            <View key={f.title} style={{ gap: 12, borderTopWidth: 1, borderTopColor: c.border, paddingTop: 20 }}>
              <IconTile icon={f.icon} />
              <Text style={t.h3}>{f.title}</Text>
              <Text style={t.body}>{f.body}</Text>
            </View>
          ))}
        </Grid>
      </Section>

      <Section kicker="Explore · Calculators" title="Plan each goal" subtitle="See the monthly amount every goal needs. No sign-in required." action={<Button label="All calculators" variant="secondary" href="/calculators" />}>
        <CalculatorStrip />
      </Section>

      <View style={s.cta}>
        <Container style={[s.ctaRow, isPhone && { flexDirection: "column", alignItems: "flex-start" }]}>
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={[t.h2, isPhone && { fontSize: 24, lineHeight: 31 }]}>Open your Surgam account</Text>
            <Text style={t.body}>One account on the web and the Surgam app. Start with ₹500 a month.</Text>
          </View>
          <Button label="Start investing" size="lg" href="/sign-in" />
        </Container>
      </View>
    </SiteShell>
  );
}

const s = StyleSheet.create({
  hero: { backgroundColor: c.navy, paddingTop: 72, paddingBottom: 104 },
  heroRow: { flexDirection: "row", alignItems: "center", gap: 56 },
  panel: { backgroundColor: c.white, borderRadius: 12, padding: 24, gap: 20, borderWidth: 1, borderColor: c.navyRule },
  panelLabel: { fontFamily: F, color: c.muted, fontSize: 12, fontWeight: "500" },
  panelValue: { fontFamily: F, color: c.ink, fontSize: 32, fontWeight: "600", letterSpacing: -0.8, fontVariant: ["tabular-nums"] },
  panelSub: { fontFamily: F, color: c.inkSoft, fontSize: 13 },
  panelChip: { borderWidth: 1, borderColor: c.border, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  panelChipText: { fontFamily: F, color: c.inkSoft, fontSize: 12, fontWeight: "500" },
  bars: { flexDirection: "row", alignItems: "flex-end", gap: 10, height: 146, borderBottomWidth: 1, borderBottomColor: c.border, paddingBottom: 4 },
  bar: { width: "70%", backgroundColor: c.evergreen, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  barLabel: { fontFamily: F, color: c.muted, fontSize: 11 },
  panelRow: { flexDirection: "row", gap: 40 },
  panelStat: { fontFamily: F, color: c.ink, fontSize: 18, fontWeight: "600", marginTop: 2, fontVariant: ["tabular-nums"] },
  panelFoot: { fontFamily: F, color: c.muted, fontSize: 12 },
  numbers: { flexDirection: "row", backgroundColor: c.surface, borderRadius: 12, borderWidth: 1, borderColor: c.border, paddingVertical: 8 },
  numberItem: { flex: 1, paddingVertical: 16, paddingHorizontal: 24, gap: 4 },
  numberDivider: { borderLeftWidth: 1, borderLeftColor: c.border },
  numberValue: { fontFamily: F, color: c.ink, fontSize: 26, fontWeight: "600", letterSpacing: -0.6, fontVariant: ["tabular-nums"] },
  numberLabel: { fontFamily: F, color: c.muted, fontSize: 13 },
  cta: { backgroundColor: c.mintSoft, borderTopWidth: 1, borderTopColor: c.mint, paddingVertical: 56 },
  ctaRow: { flexDirection: "row", alignItems: "center", gap: 24 },
});
