import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CALCULATORS, TOP_LISTS, WAYS_TO_INVEST } from "@/shared/mf/content";
import { Button, c, Card, F, Grid, Icon, IconTile, styles as t, useBreakpoint } from "./ui";

/** Cards on wide screens; compact tappable rows on phones so the list stays short. */
export function WaysToInvestGrid() {
  const router = useRouter();
  const { isPhone } = useBreakpoint();
  if (isPhone)
    return (
      <Card style={{ padding: 0, gap: 0 }}>
        {WAYS_TO_INVEST.map((w, i) => (
          <Pressable key={w.slug} accessibilityRole="link" accessibilityLabel={w.title} onPress={() => router.push(`/mutual-funds/${w.slug}` as never)} style={({ pressed }) => [s.row, i > 0 && s.rowDivider, pressed && { backgroundColor: c.surfaceTint }]}>
            <IconTile icon={w.icon} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={t.h4}>{w.title}</Text>
              <Text style={t.small}>{w.short}</Text>
            </View>
            <Icon name="chevron-forward" size={18} color={c.muted} />
          </Pressable>
        ))}
      </Card>
    );
  return (
    <Grid min={320}>
      {WAYS_TO_INVEST.map((w) => (
        <Card key={w.slug} onPress={() => router.push(`/mutual-funds/${w.slug}` as never)} accessibilityLabel={w.title}>
          <IconTile icon={w.icon} />
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
  row: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 16, minHeight: 72, paddingVertical: 12 },
  rowDivider: { borderTopWidth: 1, borderTopColor: c.border },
  more: { fontFamily: F, color: c.evergreen, fontWeight: "600", fontSize: 14, marginTop: "auto", paddingTop: 6 },
});