import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { surgam } from "@/components/surgam/theme";
import { formatINR } from "@/shared/mf/calc";
import { clearInvestorToken } from "@/lib/mf/session";
import { trpc } from "@/lib/trpc";

const c = surgam.colors;
const label = { PENDING_PAYMENT: "Awaiting payment", SUBMITTED: "Submitted", ALLOTTED: "Units allotted", CANCELLED: "Cancelled" } as const;

function Box({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <View style={{ backgroundColor: c.surface, borderRadius: 20, borderWidth: 1, borderColor: c.border, padding: 18, gap: 12 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <Text style={{ color: c.ink, fontSize: 17, fontWeight: "600" }}>{title}</Text>
        {action}
      </View>
      {children}
    </View>
  );
}

/** Live orders for the signed-in investor. Renders a sign-in prompt otherwise. */
export function MyOrders() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const me = trpc.investor.me.useQuery(undefined, { retry: false });
  const orders = trpc.orders.list.useQuery(undefined, { enabled: !!me.data, retry: false });
  if (!me.data)
    return (
      <Box title="Your orders">
        <Text style={{ color: c.inkSoft }}>Sign in to see the orders and SIPs you place on Surgam. The figures below are demo data.</Text>
        <Pressable accessibilityRole="button" onPress={() => router.push("/sign-in?next=/dashboard/investments" as never)}>
          <Text style={{ color: c.evergreen, fontWeight: "600" }}>Sign in ›</Text>
        </Pressable>
      </Box>
    );
  const list = orders.data ?? [];
  return (
    <Box
      title="Your orders"
      action={
        <Pressable accessibilityRole="button" onPress={async () => { await clearInvestorToken(); await utils.invalidate(); }}>
          <Text style={{ color: c.muted, fontWeight: "600" }}>Sign out</Text>
        </Pressable>
      }
    >
      <Text style={{ color: c.muted, fontSize: 13 }}>Signed in as +91 {me.data.phone}</Text>
      {list.length === 0 ? (
        <Text style={{ color: c.inkSoft }}>No orders yet. Pick a fund to make your first investment.</Text>
      ) : (
        list.map((o) => (
          <View key={o.id} style={{ borderTopWidth: 1, borderTopColor: c.border, paddingTop: 10, gap: 2 }}>
            <Text style={{ color: c.ink, fontWeight: "600" }} numberOfLines={2}>{o.schemeName}</Text>
            <Text style={{ color: c.inkSoft, fontSize: 13 }}>
              {o.kind === "SIP" ? `SIP on day ${o.sipDay}` : "One-time"} · {formatINR(o.amount)} · {label[o.status]} · {o.createdAt.slice(0, 10)}
            </Text>
          </View>
        ))
      )}
      <Pressable accessibilityRole="button" onPress={() => router.push("/mutual-funds" as never)}>
        <Text style={{ color: c.evergreen, fontWeight: "600" }}>Find a fund ›</Text>
      </Pressable>
    </Box>
  );
}

export function MySips() {
  const me = trpc.investor.me.useQuery(undefined, { retry: false });
  const utils = trpc.useUtils();
  const sips = trpc.orders.sips.useQuery(undefined, { enabled: !!me.data, retry: false });
  const set = trpc.orders.setSipStatus.useMutation({ onSuccess: () => utils.orders.sips.invalidate() });
  if (!me.data || !sips.data || sips.data.length === 0) return null;
  return (
    <Box title="Your SIPs">
      {sips.data.map((s) => (
        <View key={s.id} style={{ borderTopWidth: 1, borderTopColor: c.border, paddingTop: 10, gap: 4 }}>
          <Text style={{ color: c.ink, fontWeight: "600" }} numberOfLines={2}>{s.schemeName}</Text>
          <Text style={{ color: c.inkSoft, fontSize: 13 }}>{formatINR(s.amount)} on day {s.day} · next {s.nextRun} · {s.status.toLowerCase()}</Text>
          {s.status !== "STOPPED" ? (
            <View style={{ flexDirection: "row", gap: 16 }}>
              <Pressable accessibilityRole="button" onPress={() => set.mutate({ id: s.id, status: s.status === "ACTIVE" ? "PAUSED" : "ACTIVE" })}>
                <Text style={{ color: c.evergreen, fontWeight: "600" }}>{s.status === "ACTIVE" ? "Pause" : "Resume"}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => set.mutate({ id: s.id, status: "STOPPED" })}>
                <Text style={{ color: c.coral, fontWeight: "600" }}>Stop</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      ))}
    </Box>
  );
}
