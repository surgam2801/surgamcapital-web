import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { formatPct } from "@/shared/mf/calc";
import type { SchemeWithReturns } from "@/shared/mf/types";
import { c, Card, EmptyState, F, Icon, Notice, Skeleton, Tag, useBreakpoint } from "./ui";

const toneFor = (_cat: string) => "neutral" as const;

function Ret({ label, v }: { label: string; v: number | null | undefined }) {
  return (
    <View style={{ alignItems: "flex-end", minWidth: 64 }}>
      <Text style={s.retLabel}>{label}</Text>
      <Text style={[s.retValue, v != null && v < 0 ? { color: c.loss } : v != null ? { color: c.gain } : null]}>{formatPct(v)}</Text>
    </View>
  );
}

export function FundRow({ fund, rank }: { fund: SchemeWithReturns; rank?: number }) {
  const router = useRouter();
  const { isPhone } = useBreakpoint();
  const r = fund.returns;
  return (
    <Card onPress={() => router.push(`/funds/${fund.code}` as never)} accessibilityLabel={`${fund.name}, open fund details`} style={{ height: undefined }}>
      <View style={[s.row, isPhone && { flexDirection: "column", alignItems: "stretch" }]}>
        <View style={{ flexDirection: "row", gap: 12, flex: 1, alignItems: "center" }}>
          {rank ? (
            <View style={s.rank}>
              <Text style={s.rankText}>{rank}</Text>
            </View>
          ) : (
            <View style={s.avatar}>
              <Text style={s.avatarText}>{fund.amc.slice(0, 1)}</Text>
            </View>
          )}
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={s.name} numberOfLines={2}>{fund.name}</Text>
            <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              <Tag label={fund.subCategory} tone={toneFor(fund.category)} />
              <Text style={s.meta}>{fund.amc}</Text>
            </View>
          </View>
        </View>
        <View style={[s.rets, isPhone && { justifyContent: "space-between" }]}>
          <View style={{ alignItems: "flex-end", minWidth: 72 }}>
            <Text style={s.retLabel}>NAV</Text>
            <Text style={s.retValue}>₹{fund.nav.toFixed(2)}</Text>
          </View>
          {r !== undefined ? (
            <>
              <Ret label="1Y" v={r?.r1y} />
              <Ret label="3Y p.a." v={r?.r3y} />
              {!isPhone ? <Ret label="5Y p.a." v={r?.r5y} /> : null}
            </>
          ) : null}
          {!isPhone ? <Icon name="chevron-forward" size={18} color={c.muted} /> : null}
        </View>
      </View>
    </Card>
  );
}

export function FundList({ items, loading, error, ranked, emptyText = "No funds match yet." }: { items?: SchemeWithReturns[]; loading?: boolean; error?: boolean; ranked?: boolean; emptyText?: string }) {
  if (loading)
    return (
      <View style={{ gap: 12 }}>
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} />
        ))}
      </View>
    );
  return (
    <View style={{ gap: 12 }}>
      {error ? <Notice tone="amber" text="Live fund data could not be reached, so sample funds are shown. Figures are illustrative." /> : null}
      {!items || items.length === 0 ? <EmptyState title={emptyText} /> : items.map((f, i) => <FundRow key={f.code} fund={f} rank={ranked ? i + 1 : undefined} />)}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 16 },
  rank: { width: 32, height: 32, borderRadius: 6, borderWidth: 1, borderColor: c.border, alignItems: "center", justifyContent: "center" },
  rankText: { fontFamily: F, color: c.inkSoft, fontWeight: "600", fontSize: 13, fontVariant: ["tabular-nums"] },
  avatar: { width: 36, height: 36, borderRadius: 6, backgroundColor: c.surfaceTint, alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: F, color: c.inkSoft, fontWeight: "600", fontSize: 14 },
  name: { fontFamily: F, color: c.ink, fontSize: 15, fontWeight: "600", lineHeight: 21 },
  meta: { fontFamily: F, color: c.muted, fontSize: 12 },
  rets: { flexDirection: "row", alignItems: "center", gap: 18 },
  retLabel: { fontFamily: F, color: c.muted, fontSize: 11, fontWeight: "500" },
  retValue: { fontFamily: F, color: c.ink, fontSize: 15, fontWeight: "600", fontVariant: ["tabular-nums"] },
});
