import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SiteShell } from "@/components/site/shell";
import { c, Card, Icon, Section, styles as t } from "@/components/site/ui";
import { FAQS } from "@/shared/mf/content";

export default function Faqs() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <SiteShell>
      <Section kicker="Help" title="Frequently asked questions" subtitle="Plain answers to common mutual fund questions.">
        <View style={{ gap: 10, maxWidth: 820 }}>
          {FAQS.map((f, i) => (
            <Card key={f.q} style={{ height: undefined }}>
              <Pressable accessibilityRole="button" accessibilityState={{ expanded: open === i }} onPress={() => setOpen(open === i ? null : i)} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <Text style={[t.h4, { flex: 1 }]}>{f.q}</Text>
                <Icon name={open === i ? "chevron-up" : "chevron-down"} size={20} color={c.evergreen} />
              </Pressable>
              {open === i ? <Text style={t.body}>{f.a}</Text> : null}
            </Card>
          ))}
        </View>
      </Section>
    </SiteShell>
  );
}
