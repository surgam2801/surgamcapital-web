import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { SiteShell } from "@/components/site/shell";
import { FundList } from "@/components/site/fund";
import { Button, c, Card, EmptyState, Grid, Icon, IconTile, Section, styles as t } from "@/components/site/ui";
import { SAMPLE_SCHEMES, WAYS_TO_INVEST } from "@/shared/mf/content";
import { trpc } from "@/lib/trpc";

export function generateStaticParams() {
  return WAYS_TO_INVEST.map((w) => ({ way: w.slug }));
}

export default function WayDetail() {
  const { way } = useLocalSearchParams<{ way: string }>();
  const def = WAYS_TO_INVEST.find((w) => w.slug === way);
  const funds = trpc.mf.forWay.useQuery({ slug: way ?? "" }, { enabled: !!def, retry: false });
  if (!def)
    return (
      <SiteShell>
        <Section title="Page not found">
          <EmptyState title="We could not find that page." />
          <Button label="Back to mutual funds" href="/mutual-funds" />
        </Section>
      </SiteShell>
    );
  const fallback = SAMPLE_SCHEMES.filter((s) => (def.match.categories?.includes(s.category) ?? true) && (def.match.subCategoryIncludes?.some((k) => s.subCategory.includes(k)) ?? true));
  return (
    <SiteShell>
      <Section kicker="Ways to invest" title={def.title} subtitle={def.intro}>
        <Grid min={240}>
          {def.points.map((p) => (
            <Card key={p} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Icon name="checkmark-circle" size={22} color={c.evergreen} />
              <Text style={[t.h4, { flex: 1 }]}>{p}</Text>
            </Card>
          ))}
        </Grid>
      </Section>
      <Section tint kicker="Funds to consider" title={`Funds for ${def.title}`} subtitle="Ranked by three-year return within the matching categories. Past returns can change.">
        <FundList items={funds.error ? fallback : funds.data} loading={funds.isLoading} error={!!funds.error} />
      </Section>
      <Section kicker="Next step" title={def.cta === "SIP" ? "Ready to start a SIP?" : "Ready to invest?"}>
        <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <IconTile icon={def.icon} />
          <Text style={[t.body, { flex: 1, minWidth: 220 }]}>Open any fund above and choose {def.cta === "SIP" ? "Monthly SIP" : "One-time"}. You can also plan the amount with a calculator first.</Text>
          <Button label="Plan with a calculator" variant="secondary" href="/calculators" />
        </View>
      </Section>
    </SiteShell>
  );
}
