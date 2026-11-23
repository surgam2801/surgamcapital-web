import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { SiteShell } from "@/components/site/shell";
import { FundList } from "@/components/site/fund";
import { Pill, Section, Skeleton, styles as t } from "@/components/site/ui";
import { SAMPLE_SCHEMES } from "@/shared/mf/content";
import { trpc } from "@/lib/trpc";

const SORTS = [
  { key: "r1y", label: "1 year" },
  { key: "r3y", label: "3 years" },
  { key: "r5y", label: "5 years" },
] as const;

export default function Performance() {
  const cats = trpc.mf.categories.useQuery(undefined, { retry: false });
  const [group, setGroup] = useState("Equity");
  const [sub, setSub] = useState<string | null>(null);
  const [sort, setSort] = useState<(typeof SORTS)[number]["key"]>("r3y");

  const groups = useMemo(() => [...new Set((cats.data ?? []).map((x) => x.category))], [cats.data]);
  const subs = useMemo(() => (cats.data ?? []).filter((x) => x.category === group), [cats.data, group]);
  const activeSub = sub ?? subs[0]?.subCategory ?? null;
  const perf = trpc.mf.performance.useQuery({ subCategory: activeSub ?? "" }, { enabled: !!activeSub, retry: false });
  const rows = useMemo(() => [...(perf.data ?? [])].sort((a, b) => (b.returns?.[sort] ?? -999) - (a.returns?.[sort] ?? -999)), [perf.data, sort]);

  return (
    <SiteShell>
      <Section kicker="Explore" title="Fund performance" subtitle="Pick a category and compare point-to-point returns for funds from the largest fund houses in it.">
        {cats.isLoading ? (
          <Skeleton height={44} />
        ) : cats.error ? (
          <FundList items={SAMPLE_SCHEMES} error />
        ) : (
          <View style={{ gap: 14 }}>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              {groups.map((g) => (
                <Pill key={g} label={g} active={g === group} onPress={() => { setGroup(g); setSub(null); }} />
              ))}
            </View>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              {subs.map((x) => (
                <Pill key={x.subCategory} label={`${x.subCategory} (${x.count})`} active={x.subCategory === activeSub} onPress={() => setSub(x.subCategory)} />
              ))}
            </View>
            <View style={{ flexDirection: "row", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <Text style={t.label}>Sort by return over</Text>
              {SORTS.map((x) => (
                <Pill key={x.key} label={x.label} active={x.key === sort} onPress={() => setSort(x.key)} />
              ))}
            </View>
            <FundList ranked items={rows} loading={perf.isLoading} error={!!perf.error} />
            <Text style={t.small}>Returns are calculated from published NAVs; 3- and 5-year figures are annualised. Past performance does not guarantee future returns.</Text>
          </View>
        )}
      </Section>
    </SiteShell>
  );
}
