import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import type { Scheme } from "@/shared/mf/types";
import { trpc } from "@/lib/trpc";
import { c, Icon, styles as t } from "./ui";

export function FundPicker({ value, onChange }: { value: Scheme | null; onChange: (s: Scheme) => void }) {
  const [q, setQ] = useState("");
  const res = trpc.mf.search.useQuery({ q, limit: 8 }, { enabled: q.trim().length >= 2, retry: false });
  return (
    <View style={{ gap: 8 }}>
      <Text style={t.label}>Fund</Text>
      {value ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: c.mintSoft, borderRadius: 14, padding: 12 }}>
          <Icon name="checkmark-circle" size={20} color={c.evergreen} />
          <Text style={[t.h4, { flex: 1 }]} numberOfLines={2}>{value.name}</Text>
        </View>
      ) : null}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderColor: c.border, borderRadius: 14, paddingHorizontal: 12, backgroundColor: c.surface }}>
        <Icon name="search" size={18} color={c.muted} />
        <TextInput accessibilityLabel="Search for a fund" value={q} onChangeText={setQ} placeholder={value ? "Search for another fund" : "Type a fund or fund house name"} placeholderTextColor={c.muted} style={{ flex: 1, paddingVertical: 12, fontSize: 15, color: c.ink }} />
      </View>
      {q.trim().length >= 2 && res.data ? (
        <View style={{ borderWidth: 1, borderColor: c.border, borderRadius: 14, overflow: "hidden" }}>
          {res.data.items.length === 0 ? <Text style={[t.small, { padding: 12 }]}>No funds found.</Text> : null}
          {res.data.items.map((s) => (
            <Pressable key={s.code} accessibilityRole="button" onPress={() => { onChange(s); setQ(""); }} style={({ pressed }) => ({ padding: 12, borderBottomWidth: 1, borderBottomColor: c.border, backgroundColor: pressed ? c.mintSoft : c.surface })}>
              <Text style={[t.body, { color: c.ink, fontWeight: "600" }]} numberOfLines={1}>{s.name}</Text>
              <Text style={t.small}>{s.subCategory}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      {res.error ? <Text style={t.small}>Fund search needs the Surgam server to be reachable.</Text> : null}
    </View>
  );
}
