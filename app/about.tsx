import { Text, View } from "react-native";
import { SiteShell } from "@/components/site/shell";
import { Card, Container, Grid, IconTile, Notice, Section, styles as t } from "@/components/site/ui";

export default function About() {
  return (
    <SiteShell>
      <Section kicker="About us" title="About Surgam Capital" subtitle="This page is a placeholder. Our story, team and registration details will be added here.">
        <Container style={{ paddingHorizontal: 0, gap: 20 }}>
          <Notice text="Placeholder content. Replace with Surgam's approved company information before launch." />
          <Grid min={260}>
            {[
              { icon: "eye-outline", title: "Our mission", body: "Coming soon." },
              { icon: "people-outline", title: "Our team", body: "Coming soon." },
              { icon: "ribbon-outline", title: "Registrations", body: "AMFI ARN and other registration details will be listed here." },
              { icon: "mail-outline", title: "Contact", body: "Contact details coming soon." },
            ].map((x) => (
              <Card key={x.title}>
                <IconTile icon={x.icon} />
                <Text style={t.h4}>{x.title}</Text>
                <Text style={t.body}>{x.body}</Text>
              </Card>
            ))}
          </Grid>
          <View />
        </Container>
      </Section>
    </SiteShell>
  );
}
