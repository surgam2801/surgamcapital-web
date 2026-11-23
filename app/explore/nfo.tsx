import { Text, View } from "react-native";
import { SiteShell } from "@/components/site/shell";
import { Card, Grid, Notice, Section, Skeleton, styles as t, Tag } from "@/components/site/ui";
import { formatINR } from "@/shared/mf/calc";
import { SAMPLE_NFOS } from "@/shared/mf/content";
import { trpc } from "@/lib/trpc";

function status(opens: string, closes: string) {
  const today = new Date().toISOString().slice(0, 10);
  if (today < opens) return { label: "Opening soon", tone: "blue" as const };
  if (today > closes) return { label: "Closed", tone: "neutral" as const };
  return { label: "Open now", tone: "teal" as const };
}

export default function Nfo() {
  const q = trpc.mf.nfos.useQuery(undefined, { retry: false });
  const items = q.data ?? (q.error ? SAMPLE_NFOS : undefined);
  return (
    <SiteShell>
      <Section kicker="Explore" title="New fund offers" subtitle="New schemes collecting money before they start trading at a daily NAV.">
        <View style={{ gap: 16 }}>
          <Notice tone="amber" text="These listings are placeholders until the Surgam NFO feed is connected." />
          {!items ? (
            <Skeleton height={160} />
          ) : (
            <Grid min={300}>
              {items.map((n) => {
                const st = status(n.opens, n.closes);
                return (
                  <Card key={n.id}>
                    <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
                      <Tag label={st.label} tone={st.tone} />
                      <Tag label={n.subCategory} tone="neutral" />
                    </View>
                    <Text style={t.h4}>{n.name}</Text>
                    <Text style={t.small}>{n.amc}</Text>
                    <Text style={t.body}>Open {n.opens} to {n.closes}</Text>
                    <Text style={t.body}>Minimum {formatINR(n.minAmount)}</Text>
                  </Card>
                );
              })}
            </Grid>
          )}
          <Text style={t.small}>Read the scheme information document before investing in any new fund offer.</Text>
        </View>
      </Section>
    </SiteShell>
  );
}
