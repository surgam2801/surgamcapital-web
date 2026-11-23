import { useRouter } from "expo-router";
import { Text } from "react-native";
import { SiteShell } from "@/components/site/shell";
import { CalculatorStrip } from "@/components/site/sections";
import { Card, Grid, IconTile, Section, styles as t } from "@/components/site/ui";
import { EXPLORE_TOOLS } from "@/shared/mf/content";

export default function Explore() {
  const router = useRouter();
  const tools = [...EXPLORE_TOOLS, { slug: "calculators", title: "Calculators", blurb: "Plan education, retirement, a home and more.", icon: "calculator-outline" }];
  return (
    <SiteShell>
      <Section kicker="Explore" title="Research and planning tools" subtitle="Compare funds, study categories, and plan your goals and taxes.">
        <Grid min={260}>
          {tools.map((x) => (
            <Card key={x.slug} onPress={() => router.push((x.slug === "calculators" ? "/calculators" : `/explore/${x.slug}`) as never)} accessibilityLabel={x.title}>
              <IconTile icon={x.icon} />
              <Text style={t.h3}>{x.title}</Text>
              <Text style={t.body}>{x.blurb}</Text>
            </Card>
          ))}
        </Grid>
      </Section>
      <Section tint kicker="Explore · Calculators" title="Goal planning calculators">
        <CalculatorStrip />
      </Section>
    </SiteShell>
  );
}
