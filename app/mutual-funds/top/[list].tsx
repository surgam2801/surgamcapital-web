import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { SiteShell } from "@/components/site/shell";
import { FundList } from "@/components/site/fund";
import { Button, EmptyState, Pill, Section } from "@/components/site/ui";
import { useRouter } from "expo-router";
import { SAMPLE_SCHEMES, TOP_LISTS } from "@/shared/mf/content";
import { trpc } from "@/lib/trpc";

export function generateStaticParams() {
  return TOP_LISTS.map((l) => ({ list: l.slug }));
}

export default function TopList() {
  const router = useRouter();
  const { list } = useLocalSearchParams<{ list: string }>();
  const def = TOP_LISTS.find((l) => l.slug === list);
  const res = trpc.mf.topList.useQuery({ slug: list ?? "" }, { enabled: !!def, retry: false });
  if (!def)
    return (
      <SiteShell>
        <Section title="List not found">
          <EmptyState title="We could not find that list." />
          <Button label="Back to mutual funds" href="/mutual-funds" />
        </Section>
      </SiteShell>
    );
  const sortLabel = { r1y: "one-year", r3y: "three-year", r5y: "five-year" }[def.sortBy];
  const fallback = SAMPLE_SCHEMES.filter((s) => def.subCategoryIncludes?.some((k) => s.subCategory.includes(k)));
  return (
    <SiteShell>
      <Section kicker="Fund lists" title={def.title} subtitle={`${def.blurb} Sorted by ${sortLabel} return.`}>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {TOP_LISTS.map((l) => (
            <Pill key={l.slug} label={l.title} active={l.slug === def.slug} onPress={() => router.replace(`/mutual-funds/top/${l.slug}` as never)} />
          ))}
        </View>
        <FundList ranked items={res.error ? fallback : res.data?.items} loading={res.isLoading} error={!!res.error} />
      </Section>
    </SiteShell>
  );
}
