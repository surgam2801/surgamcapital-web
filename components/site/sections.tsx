import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { CALCULATORS, TOP_LISTS, WAYS_TO_INVEST } from "@/shared/mf/content";
import { Button, c, Card, F, Grid, Icon, IconTile, styles as t } from "./ui";
export function WaysToInvestGrid() {
  const router = useRouter();
  return (
    <Grid min={320}>
      {WAYS_TO_INVEST.map((w, i) => (
        <Card key={w.slug} onPress={() => router.push(`/mutual-funds/${w.slug}` as never)} accessibilityLabel={w.title}>
          <IconTile icon={w.icon} tone={(["teal", "blue", "amber", "teal", "blue", "amber"] as const)[i % 6]} />
          <Text style={t.h3}>{w.title}</Text>
          <Text style={t.body}>{w.short}</Text>
          <Text style={s.more}>Learn more →</Text>
        </Card>
      ))}
    </Grid>
  );
}

export function TopListsGrid() {
  const router = useRouter();
  return (
    <Grid min={300}>
      {TOP_LISTS.map((l, i) => (
        <Card key={l.slug} onPress={() => router.push(`/mutual-funds/top/${l.slug}` as never)} accessibilityLabel={l.title}>
          <IconTile icon={["trophy-outline", "checkmark-done-outline", "shield-checkmark-outline"][i]} tone={(["teal", "blue", "amber"] as const)[i]} />
          <Text style={t.h3}>{l.title}</Text>
          <Text style={t.body}>{l.blurb}</Text>
          <View style={{ marginTop: "auto", paddingTop: 6 }}>
            <Button label="See funds" variant="secondary" icon="arrow-forward" href={`/mutual-funds/top/${l.slug}`} />
          </View>
        </Card>
      ))}
    </Grid>
  );
}

export function CalculatorStrip() {
  const router = useRouter();
  return (
    <Grid min={140} gap={12}>
      {CALCULATORS.map((x) => (
        <Card key={x.slug} onPress={() => router.push(`/calculators/${x.slug}` as never)} accessibilityLabel={`${x.title} calculator`} style={{ alignItems: "flex-start" }}>
          <IconTile icon={x.icon} />
          <Text style={t.h4}>{x.title}</Text>
          <Text style={t.small}>{x.short}</Text>
        </Card>
      ))}
    </Grid>
  );
}

const s = StyleSheet.create({
  more: { fontFamily: F, color: c.evergreen, fontWeight: "600", fontSize: 14, marginTop: "auto", paddingTop: 6 },
});