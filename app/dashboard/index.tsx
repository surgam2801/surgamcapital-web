import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SiteShell } from "@/components/site/shell";
import { useToast } from "@/components/site/toast";
import { Button, c, Card, ConfirmDialog, EmptyState, F, Grid, Icon, Notice, Section, Skeleton, styles as t, Tag, Term } from "@/components/site/ui";
import { formatDate, formatINR, planGoal } from "@/shared/mf/calc";
import type { Goal, Order, SipPlan } from "@/shared/mf/types";
import { friendlyError } from "@/lib/mf/errors";
import { clearInvestorToken } from "@/lib/mf/session";
import { trpc } from "@/lib/trpc";

const ORDER_STATUS: Record<Order["status"], { label: string; tone: "amber" | "teal" | "blue" | "neutral" }> = {
  PENDING_PAYMENT: { label: "Waiting for payment", tone: "amber" },
  SUBMITTED: { label: "Submitted", tone: "blue" },
  ALLOTTED: { label: "Units allotted", tone: "teal" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
};

function Summary({ orders, sips }: { orders: Order[]; sips: SipPlan[] }) {
  const active = sips.filter((s) => s.status === "ACTIVE");
  const monthly = active.reduce((a, s) => a + s.amount, 0);
  const invested = orders.filter((o) => o.status === "SUBMITTED" || o.status === "ALLOTTED").reduce((a, o) => a + o.amount, 0);
  const nextRun = active.map((s) => s.nextRun).sort()[0];
  const items = [
    { label: "Invested so far", value: formatINR(invested) },
    { label: "Monthly SIPs", value: formatINR(monthly), sub: `${active.length} active` },
    { label: "Next SIP date", value: nextRun ? formatDate(nextRun) : "–" },
  ];
  return (
    <Grid min={220} gap={12}>
      {items.map((i) => (
        <Card key={i.label}>
          <Text style={t.small}>{i.label}</Text>
          <Text style={s.big}>{i.value}</Text>
          {i.sub ? <Text style={t.small}>{i.sub}</Text> : null}
        </Card>
      ))}
    </Grid>
  );
}

function SipRow({ sip }: { sip: SipPlan }) {
  const utils = trpc.useUtils();
  const toast = useToast();
  const [confirmStop, setConfirmStop] = useState(false);
  const set = trpc.orders.setSipStatus.useMutation({
    // Optimistic: the switch flips at once; it rolls back if the server says no.
    onMutate: async ({ id, status }) => {
      await utils.orders.sips.cancel();
      const prev = utils.orders.sips.getData();
      utils.orders.sips.setData(undefined, (old) => old?.map((x) => (x.id === id ? { ...x, status } : x)));
      return { prev };
    },
    onError: (err, _v, ctx) => {
      if (ctx?.prev) utils.orders.sips.setData(undefined, ctx.prev);
      toast.show({ message: friendlyError(err) });
    },
    onSettled: () => utils.orders.sips.invalidate(),
  });
  const stopped = sip.status === "STOPPED";
  return (
    <View style={s.row}>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={t.h4} numberOfLines={2}>{sip.schemeName}</Text>
        <Text style={t.small}>
          {formatINR(sip.amount)} on the {sip.day}
          {["th", "st", "nd", "rd"][sip.day % 10 > 3 || [11, 12, 13].includes(sip.day % 100) ? 0 : sip.day % 10]} of each month
          {stopped ? "" : ` · next ${formatDate(sip.nextRun)}`}
        </Text>
      </View>
      <View style={s.rowActions}>
        <Tag label={stopped ? "Stopped" : sip.status === "PAUSED" ? "Paused" : "Active"} tone={stopped ? "neutral" : sip.status === "PAUSED" ? "amber" : "teal"} />
        {!stopped ? (
          <View style={{ flexDirection: "row", gap: 4 }}>
            <Button
              label={sip.status === "ACTIVE" ? "Pause" : "Resume"}
              variant="secondary"
              onPress={() => {
                const next = sip.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
                set.mutate({ id: sip.id, status: next });
                toast.show({ message: next === "PAUSED" ? "SIP paused. No money will be taken until you resume." : "SIP resumed." });
              }}
            />
            <Button label="Stop" variant="ghost" onPress={() => setConfirmStop(true)} />
          </View>
        ) : null}
      </View>
      <ConfirmDialog
        visible={confirmStop}
        title="Stop this SIP?"
        body={`No more ${formatINR(sip.amount)} monthly investments will be made into ${sip.schemeName}. The units you already own stay invested. You can start a new SIP any time.`}
        confirmLabel="Stop SIP"
        loading={set.isPending}
        onCancel={() => setConfirmStop(false)}
        onConfirm={() => {
          set.mutate({ id: sip.id, status: "STOPPED" }, { onSettled: () => setConfirmStop(false) });
        }}
      />
    </View>
  );
}

function OrderRow({ order }: { order: Order }) {
  const st = ORDER_STATUS[order.status];
  return (
    <View style={s.row}>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={t.h4} numberOfLines={2}>{order.schemeName}</Text>
        <Text style={t.small}>
          {order.kind === "SIP" ? "First SIP instalment" : "One-time"} · {formatDate(order.createdAt)}
        </Text>
      </View>
      <View style={[s.rowActions, { alignItems: "flex-end" }]}>
        <Text style={s.amount}>{formatINR(order.amount)}</Text>
        <Tag label={st.label} tone={st.tone} />
      </View>
    </View>
  );
}

function GoalsPanel({ goals }: { goals: Goal[] }) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const toast = useToast();
  const remove = trpc.goals.remove.useMutation({ onSettled: () => utils.goals.list.invalidate() });
  const [hidden, setHidden] = useState<string[]>([]);
  const visible = goals.filter((g) => !hidden.includes(g.id));
  if (visible.length === 0)
    return (
      <View style={{ gap: 12 }}>
        <Text style={t.body}>Add what you are saving for, and we'll show the monthly SIP each goal needs.</Text>
        <Button label="Add a goal" variant="secondary" href="/explore/goal-planning" />
      </View>
    );
  return (
    <View>
      {visible.map((g) => {
        const p = planGoal({ years: g.years, costToday: g.targetToday, inflationPct: g.inflationPct, existing: 0, existingReturnPct: 0, newReturnPct: g.returnPct, lumpsum: 0 });
        return (
          <View key={g.id} style={s.row}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={t.h4}>{g.name}</Text>
              <Text style={t.small}>{formatINR(p.futureCost, { compact: true })} in {g.years} years · needs {formatINR(p.monthlySip)} a month</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Delete goal ${g.name}`}
              onPress={() => {
                // Undo instead of "are you sure?": hide now, delete only if not undone.
                setHidden((h) => [...h, g.id]);
                toast.show({
                  message: `Goal "${g.name}" deleted.`,
                  actionLabel: "Undo",
                  onAction: () => setHidden((h) => h.filter((x) => x !== g.id)),
                  onExpire: () => remove.mutate({ id: g.id }),
                });
              }}
              style={s.iconBtn}
            >
              <Icon name="trash-outline" size={20} color={c.inkSoft} />
            </Pressable>
          </View>
        );
      })}
      <View style={{ paddingTop: 12 }}>
        <Button label="Plan another goal" variant="ghost" onPress={() => router.push("/explore/goal-planning" as never)} />
      </View>
    </View>
  );
}

export default function Dashboard() {
  const utils = trpc.useUtils();
  const me = trpc.investor.me.useQuery(undefined, { retry: false });
  const orders = trpc.orders.list.useQuery(undefined, { enabled: !!me.data, retry: false });
  const sips = trpc.orders.sips.useQuery(undefined, { enabled: !!me.data, retry: false });
  const goals = trpc.goals.list.useQuery(undefined, { enabled: !!me.data, retry: false });

  if (me.isLoading)
    return (
      <SiteShell>
        <Section>
          <Skeleton height={120} />
        </Section>
      </SiteShell>
    );

  if (!me.data)
    return (
      <SiteShell>
        <Section kicker="My account" title="Sign in to see your investments" subtitle="Your SIPs, orders and goals appear here once you sign in with your mobile number.">
          {me.error && !/UNAUTHORIZED/.test(String(me.error.data?.code)) ? <Notice tone="amber" text={friendlyError(me.error)} /> : null}
          <Button label="Start investing" href="/sign-in?next=/dashboard" />
        </Section>
      </SiteShell>
    );

  const orderList = orders.data ?? [];
  const sipList = sips.data ?? [];
  const nothingYet = !orders.isLoading && orderList.length === 0 && sipList.length === 0;

  return (
    <SiteShell>
      <Section
        kicker="My account"
        title={me.data.name ? `Hello, ${me.data.name}` : "Your investments"}
        subtitle={`Signed in as +91 ${me.data.phone}`}
        action={<Button label="Sign out" variant="ghost" onPress={async () => { await clearInvestorToken(); await utils.invalidate(); }} />}
      >
        {orders.isLoading ? (
          <Skeleton height={110} />
        ) : nothingYet ? (
          <Card style={{ alignItems: "flex-start" }}>
            <Text style={t.h3}>You haven't invested yet</Text>
            <Text style={t.body}>Pick a fund and start a SIP from ₹500 a month. It takes about two minutes.</Text>
            <Button label="Find a fund" href="/mutual-funds" />
          </Card>
        ) : (
          <Summary orders={orderList} sips={sipList} />
        )}
      </Section>

      {sipList.length > 0 ? (
        <Section tint title="Your SIPs">
          <View style={{ flexDirection: "row", marginTop: -16, marginBottom: 12 }}>
            <Term term="sip" style={t.small}>What is a SIP?</Term>
          </View>
          <Card style={{ paddingVertical: 4 }}>
            {sipList.map((x) => (
              <SipRow key={x.id} sip={x} />
            ))}
          </Card>
        </Section>
      ) : null}

      {orderList.length > 0 ? (
        <Section title="Your orders">
          <Card style={{ paddingVertical: 4 }}>
            {orderList.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </Card>
          <Text style={[t.small, { marginTop: 12 }]}>Payments are simulated in this build, so orders stop at "Submitted".</Text>
        </Section>
      ) : null}

      <Section tint title="Your goals">
        {goals.isLoading ? <Skeleton /> : goals.data ? <GoalsPanel goals={goals.data} /> : <EmptyState title="Goals could not be loaded." />}
      </Section>
    </SiteShell>
  );
}

const s = StyleSheet.create({
  big: { fontFamily: F, color: c.ink, fontSize: 24, fontWeight: "600", letterSpacing: -0.4, fontVariant: ["tabular-nums"] },
  amount: { fontFamily: F, color: c.ink, fontSize: 15, fontWeight: "600", fontVariant: ["tabular-nums"] },
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: c.border },
  rowActions: { gap: 8, alignItems: "flex-end" },
  iconBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 8 },
});
