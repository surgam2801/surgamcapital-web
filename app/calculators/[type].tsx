import { useLocalSearchParams, useRouter } from "expo-router";
import { SiteShell } from "@/components/site/shell";
import { Calculator, CalculatorTabs } from "@/components/site/calculator";
import { Button, EmptyState, Section } from "@/components/site/ui";
import { CALCULATORS } from "@/shared/mf/content";

export function generateStaticParams() {
  return CALCULATORS.map((x) => ({ type: x.slug }));
}

export default function CalculatorPage() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: string }>();
  const def = CALCULATORS.find((x) => x.slug === type);
  if (!def)
    return (
      <SiteShell>
        <Section title="Calculator not found">
          <EmptyState title="We could not find that calculator." />
          <Button label="All calculators" href="/calculators" />
        </Section>
      </SiteShell>
    );
  return (
    <SiteShell>
      <Section kicker="Explore · Calculators" title={`${def.title} calculator`} subtitle={def.short}>
        <CalculatorTabs items={CALCULATORS} active={def.slug} onSelect={(slug) => router.replace(`/calculators/${slug}` as never)} />
        {/* key resets inputs when switching calculators */}
        <Calculator key={def.slug} def={def} />
      </Section>
    </SiteShell>
  );
}
