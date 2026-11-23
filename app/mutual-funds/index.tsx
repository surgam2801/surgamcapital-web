import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SiteShell } from "@/components/site/shell";
import { CalculatorStrip, TopListsGrid, WaysToInvestGrid } from "@/components/site/sections";
import { FundList } from "@/components/site/fund";
import { Button, c, Card, Container, Grid, Icon, IconTile, Pill, Section, styles as t, useBreakpoint } from "@/components/site/ui";
import { OFFERINGS, SAMPLE_SCHEMES } from "@/shared/mf/content";
import { trpc } from "@/lib/trpc";

const CATS = ["All", "Equity", "Debt", "Hybrid", "Index & ETF", "Solution", "Other"];

function FundFinder() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const res = trpc.mf.search.useQuery({ q: q || undefined, category: cat === "All" ? undefined : cat, limit: 12 }, { retry: false, placeholderData: (prev) => prev });
  const fallback = SAMPLE_SCHEMES.filter((s) => (cat === "All" || s.category === cat) && s.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <View style={{ gap: 16 }}>
      <View style={s.search}>
        <Icon name="search" size={20} color={c.muted} />
        <TextInput accessibilityLabel="Search funds" value={q} onChangeText={setQ} placeholder="Search by fund or fund house" placeholderTextColor={c.muted} style={s.searchInput} />
      </View>
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {CATS.map((x) => (
          <Pill key={x} label={x} active={cat === x} onPress={() => setCat(x)} />
        ))}
      </View>
      {res.data ? <Text style={t.small}>{res.data.total.toLocaleString("en-IN")} funds found. Showing the first {res.data.items.length}.</Text> : null}
      <FundList items={res.error ? fallback : res.data?.items} loading={res.isLoading} error={!!res.error} emptyText="No funds match your search." />
    </View>
  );
}

export default function MutualFunds() {
  const { isPhone, isDesktop } = useBreakpoint();
  return (
    <SiteShell>
      <View style={s.hero}>
        <Container style={[s.heroRow, !isDesktop && { flexDirection: "column", alignItems: "flex-start" }]}>
          <View style={{ flex: 1, gap: 14 }}>
            <Text style={[t.kicker, { color: "#8FB7BB" }]}>Products · Mutual funds</Text>
            <Text style={[t.h1, { color: c.white }, isPhone && { fontSize: 32, lineHeight: 39 }]} accessibilityRole="header">
              Mutual fund investing, made simple.
            </Text>
            <Text style={[t.lead, { color: "#B4C2CB" }]}>Research over a thousand funds, start a SIP in minutes and track every rupee in one place.</Text>
            <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
              <Button label="Invest now" variant="light" size="lg" href="/sign-in" />
              <Button label="Compare performance" variant="outlineLight" size="lg" href="/explore/performance" />
            </View>
          </View>
        </Container>
      </View>

      <Section kicker="Choose your style" title="Ways to invest in mutual funds">
        <WaysToInvestGrid />
      </Section>

      <Section tint kicker="Fund lists" title="Find top mutual funds" subtitle="Lists that narrow thousands of schemes to a few worth a closer look within each peer group.">
        <TopListsGrid />
      </Section>

      <Section kicker="Fund finder" title="Search all funds">
        <FundFinder />
      </Section>

      <Section tint kicker="What we offer" title="An easier way to invest">
        <Grid min={300}>
          {OFFERINGS.map((o) => (
            <Card key={o.title}>
              <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                <IconTile icon={o.icon} tone="blue" />
                <Text style={t.h4}>{o.title}</Text>
              </View>
              <Text style={t.body}>{o.body}</Text>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section kicker="Goal planning" title="Calculators for every goal" action={<Button label="All calculators" variant="secondary" href="/calculators" />}>
        <CalculatorStrip />
      </Section>
    </SiteShell>
  );
}

const s = StyleSheet.create({
  hero: { backgroundColor: c.navy, paddingVertical: 72 },
  heroRow: { flexDirection: "row", alignItems: "center", gap: 32 },
  search: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 8, paddingHorizontal: 14, minHeight: 48 },
  searchInput: { flex: 1, fontSize: 16, color: c.ink, paddingVertical: 12 },
});
