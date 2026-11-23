import { SiteShell } from "@/components/site/shell";
import { CalculatorStrip } from "@/components/site/sections";
import { Section } from "@/components/site/ui";

export default function Calculators() {
  return (
    <SiteShell>
      <Section kicker="Explore" title="Calculators" subtitle="Work out what each goal will cost and the monthly SIP that gets you there. Results are estimates based on the rates you choose.">
        <CalculatorStrip />
      </Section>
    </SiteShell>
  );
}
