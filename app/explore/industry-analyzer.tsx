import { Text, View } from "react-native";
import { Bars } from "@/components/site/chart";
import { SiteShell } from "@/components/site/shell";
import { Card, EmptyState, Grid, Section, Skeleton, Stat, styles as t } from "@/components/site/ui";
import { trpc } from "@/lib/trpc";

export default function IndustryAnalyzer() {
  const q = trpc.mf.industry.useQuery(undefined, { retry: false });
  const status = trpc.mf.status.useQuery(undefined, { retry: false });
  return (
    <SiteShell>
      <Section kicker="Explore" title="Industry analyzer" subtitle="How India's open-ended mutual fund schemes are spread across categories and fund houses (Regular Growth plans).">
        {q.isLoading ? (
          <Skeleton height={300} />
        ) : !q.data ? (
          <EmptyState title="Industry data is unavailable" body="The Surgam server could not be reached." />
        ) : (
          <View style={{ gap: 20 }}>
            <Card style={{ height: undefined, flexDirection: "row", flexWrap: "wrap", gap: 32 }}>
              <Stat label="Schemes tracked" value={q.data.total.toLocaleString("en-IN")} />
              <Stat label="Fund houses" value={String(q.data.amcCount)} />
              <Stat label="Sub-categories" value={String(q.data.subCategories.length)} />
              <Stat label="Data as of" value={status.data?.lastRefreshed?.slice(0, 10) ?? "–"} />
            </Card>
            <Grid min={340}>
              <Card>
                <Text style={t.h4}>Schemes by category</Text>
                <Bars rows={q.data.byCategory.map((x) => ({ label: x.category, value: x.schemes }))} />
              </Card>
              <Card>
                <Text style={t.h4}>Fund houses with the most schemes</Text>
                <Bars rows={q.data.topAmcs.slice(0, 10).map((x) => ({ label: x.amc, value: x.schemes }))} />
              </Card>
            </Grid>
            <Card style={{ height: undefined }}>
              <Text style={t.h4}>Largest sub-categories</Text>
              <Bars rows={q.data.subCategories.slice(0, 15).map((x) => ({ label: `${x.subCategory} · ${x.category}`, value: x.schemes }))} />
            </Card>
            <Text style={t.small}>Counts come from AMFI's daily NAV file. Assets under management by category will be added when the AMFI monthly data import is connected.</Text>
          </View>
        )}
      </Section>
    </SiteShell>
  );
}
