import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SiteShell } from "@/components/site/shell";
import { Card, EmptyState, Grid, Section, Skeleton, Stat, styles as t, Tag } from "@/components/site/ui";
import { formatPct } from "@/shared/mf/calc";
import { trpc } from "@/lib/trpc";

const HORIZON: Record<string, string> = {
  Overnight: "1 day to a week",
  Liquid: "Up to 3 months",
  "Ultra Short": "3 to 6 months",
  "Low Duration": "6 to 12 months",
  "Money Market": "Up to 1 year",
  "Short Duration": "1 to 3 years",
  "Banking and PSU": "2 to 3 years",
  "Corporate Bond": "2 to 3 years",
  "Medium Duration": "3 to 4 years",
  Gilt: "3 years and more",
  Dynamic: "3 years and more",
  "Credit Risk": "3 years and more, higher risk",
  "Long Duration": "7 years and more",
};

const horizonFor = (sub: string) => Object.entries(HORIZON).find(([k]) => sub.toLowerCase().includes(k.toLowerCase()))?.[1];

export default function DebtAnalyzer() {
  const router = useRouter();
  const q = trpc.mf.debt.useQuery(undefined, { retry: false });
  return (
    <SiteShell>
      <Section kicker="Explore" title="Debt fund analyzer" subtitle="Debt categories side by side, with typical holding periods and median returns of the largest funds in each.">
        {q.isLoading ? (
          <View style={{ gap: 12 }}>
            <Text style={t.small}>Working out returns across all debt categories. The first time can take up to a minute.</Text>
            <Skeleton height={300} />
          </View>
        ) : !q.data ? (
          <EmptyState title="Debt data is unavailable" body="The Surgam server could not be reached." />
        ) : (
          <View style={{ gap: 16 }}>
            <Grid min={280}>
              {q.data.map((d) => (
                <Card key={d.subCategory} onPress={() => router.push("/explore/performance" as never)} accessibilityLabel={d.subCategory}>
                  <Text style={t.h4}>{d.subCategory}</Text>
                  {horizonFor(d.subCategory) ? <Tag label={`Suits: ${horizonFor(d.subCategory)}`} tone="blue" /> : null}
                  <View style={{ flexDirection: "row", gap: 20, flexWrap: "wrap" }}>
                    <Stat label="Median 1Y" value={formatPct(d.medianR1y)} />
                    <Stat label="Median 3Y p.a." value={formatPct(d.medianR3y)} />
                  </View>
                  <Text style={t.small}>{d.schemes} schemes · median of {d.sampleSize} large funds</Text>
                </Card>
              ))}
            </Grid>
            <Text style={t.small}>Median of point-to-point returns from published NAVs. Yield, duration and credit-quality data will be added with the portfolio-disclosure import.</Text>
          </View>
        )}
      </Section>
    </SiteShell>
  );
}
