import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { NavChart } from "@/components/site/chart";
import { SiteShell } from "@/components/site/shell";
import { Button, c, Card, Container, EmptyState, F, Icon, Notice, NumberField, Pill, Section, Skeleton, styles as t, Tag, Term, useBreakpoint } from "@/components/site/ui";
import { formatDate, formatINR, formatPct, fvLumpsum, fvSip } from "@/shared/mf/calc";
import { DISCLAIMER } from "@/shared/mf/content";
import type { Returns, Scheme } from "@/shared/mf/types";
import { friendlyError } from "@/lib/mf/errors";
import { trpc } from "@/lib/trpc";

const RANGES = ["1M", "6M", "1Y", "3Y", "5Y", "MAX"] as const;
const newKey = () => `k_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

function InvestSheet({ fund, visible, onClose }: { fund: Scheme; visible: boolean; onClose: () => void }) {
  const router = useRouter();
  const me = trpc.investor.me.useQuery(undefined, { retry: false });
  const utils = trpc.useUtils();
  const [mode, setMode] = useState<"SIP" | "LUMPSUM">("SIP");
  const [amount, setAmount] = useState(5000);
  const [day, setDay] = useState(5);
  // One key per attempt: double taps and retries reuse it, so only one order is ever created.
  const [key, setKey] = useState(newKey);
  const [result, setResult] = useState<{ orderId: string; paid: boolean } | null>(null);
  const place = trpc.orders.place.useMutation({ onSuccess: (r) => setResult({ orderId: r.order.id, paid: r.order.status !== "PENDING_PAYMENT" }) });
  const pay = trpc.orders.confirmPayment.useMutation({
    onSuccess: () => {
      setResult((r) => (r ? { ...r, paid: true } : r));
      void utils.orders.list.invalidate();
      void utils.orders.sips.invalidate();
    },
  });
  const min = mode === "SIP" ? 500 : 1000;
  const close = () => {
    setResult(null);
    setKey(newKey());
    place.reset();
    pay.reset();
    onClose();
  };
  const busy = place.isPending || pay.isPending;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <View style={s.backdrop}>
        <View style={s.sheet} accessibilityViewIsModal>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={t.small}>Invest in</Text>
              <Text style={t.h4}>{fund.name}</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={close} style={s.iconBtn}>
              <Icon name="close" size={22} color={c.inkSoft} />
            </Pressable>
          </View>

          {!me.data ? (
            <View style={{ gap: 12 }}>
              <Text style={t.body}>Sign in with your mobile number to invest. It takes less than a minute.</Text>
              <Button
                label="Start investing"
                full
                onPress={() => {
                  close();
                  router.push(`/sign-in?next=${encodeURIComponent(`/funds/${fund.code}`)}` as never);
                }}
              />
            </View>
          ) : result ? (
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                <Icon name={result.paid ? "checkmark-circle" : "time-outline"} size={28} color={result.paid ? c.gain : c.amber} />
                <Text style={t.h3}>{result.paid ? "Order submitted" : "One step left: payment"}</Text>
              </View>
              <Text style={t.body}>
                {result.paid
                  ? `Your ${mode === "SIP" ? "SIP" : "one-time"} order for ${formatINR(amount)} is submitted. Units are allotted at the NAV of the day your payment reaches the fund house.`
                  : `Pay ${formatINR(amount)} to submit your order.`}
              </Text>
              {!result.paid ? (
                <>
                  <Notice tone="amber" text="Payments are simulated in this build. No money will move until a payment gateway and exchange are connected." />
                  {pay.error ? <Notice tone="amber" text={friendlyError(pay.error)} /> : null}
                  <Button label={`Pay ${formatINR(amount)}`} full loading={pay.isPending} disabled={busy} onPress={() => pay.mutate({ id: result.orderId })} />
                </>
              ) : (
                <Button label="See my investments" full onPress={() => { close(); router.push("/dashboard" as never); }} />
              )}
            </View>
          ) : (
            <View style={{ gap: 14 }}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pill label="Monthly SIP" active={mode === "SIP"} onPress={() => setMode("SIP")} />
                <Pill label="One-time" active={mode === "LUMPSUM"} onPress={() => setMode("LUMPSUM")} />
              </View>
              <NumberField label={mode === "SIP" ? "Monthly amount" : "Amount"} prefix="₹" value={amount} onChange={setAmount} step={500} min={0} max={10000000} hint={amount < min ? `The minimum is ${formatINR(min)}.` : `Minimum ${formatINR(min)}`} />
              {mode === "SIP" ? <NumberField label="Date each month" value={day} onChange={(v) => setDay(Math.round(v))} min={1} max={28} hint="Pick a date soon after your salary arrives." /> : null}
              <Text style={t.small}>
                {mode === "SIP"
                  ? `At an assumed 12% a year, this SIP could grow to about ${formatINR(fvSip(amount, 12, 10), { compact: true })} in 10 years. Illustration only.`
                  : `At an assumed 12% a year, this could grow to about ${formatINR(fvLumpsum(amount, 12, 5), { compact: true })} in 5 years. Illustration only.`}
              </Text>
              {place.error ? <Notice tone="amber" text={friendlyError(place.error)} /> : null}
              <Button
                label={mode === "SIP" ? "Start SIP" : "Invest now"}
                full
                disabled={amount < min || busy}
                loading={place.isPending}
                onPress={() => place.mutate({ code: fund.code, kind: mode, amount, sipDay: mode === "SIP" ? day : undefined, idempotencyKey: key })}
              />
              <Text style={[t.small, { fontSize: 12 }]}>{DISCLAIMER}</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

function ReturnsTable({ r }: { r?: Returns }) {
  const { isPhone } = useBreakpoint();
  const rows = [
    ["1 month", r?.r1m],
    ["6 months", r?.r6m],
    ["1 year", r?.r1y],
    ["3 years (per year)", r?.r3y],
    ["5 years (per year)", r?.r5y],
  ] as const;
  const tone = (v: number | null | undefined) => (v == null ? c.muted : v >= 0 ? c.gain : c.loss);
  return (
    <Card style={{ padding: 0, gap: 0, flexDirection: isPhone ? "column" : "row" }}>
      {rows.map(([label, v], i) => (
        <View key={label} style={[isPhone ? s.retRowPhone : s.retCell, i > 0 && (isPhone ? s.retDividerTop : s.retDividerLeft)]}>
          <Text style={s.retLabel}>{label}</Text>
          <Text style={[s.retValue, { color: tone(v) }]}>{formatPct(v)}</Text>
        </View>
      ))}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.fact}>
      <Text style={[t.small, { flex: 1 }]}>{label}</Text>
      <Text style={[t.body, { color: c.ink, flexShrink: 1, textAlign: "right" }]} selectable>{value}</Text>
    </View>
  );
}

export default function FundDetail() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { isPhone } = useBreakpoint();
  const [range, setRange] = useState<(typeof RANGES)[number]>("1Y");
  const [sheet, setSheet] = useState(false);
  const fund = trpc.mf.scheme.useQuery({ code: code ?? "" }, { enabled: !!code, retry: false });
  const history = trpc.mf.history.useQuery({ code: code ?? "", range }, { enabled: !!code, retry: false, placeholderData: (p) => p });

  if (fund.isLoading)
    return (
      <SiteShell>
        <Section>
          <View style={{ gap: 12 }}>
            <Skeleton height={60} />
            <Skeleton height={240} />
          </View>
        </Section>
      </SiteShell>
    );
  if (!fund.data)
    return (
      <SiteShell>
        <Section title="Fund not available">
          <EmptyState title="We could not load this fund." body={fund.error ? friendlyError(fund.error) : "Search for it again."} />
          <Button label="Search funds" variant="secondary" href="/mutual-funds" />
        </Section>
      </SiteShell>
    );

  const f = fund.data;
  const r = f.returns;
  const investBar = isPhone ? (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <View style={{ flex: 1 }}>
        <Text style={t.small}>NAV {formatDate(f.navDate)}</Text>
        <Text style={s.barNav}>₹{f.nav.toFixed(2)}</Text>
      </View>
      <Button label="Invest" size="lg" onPress={() => setSheet(true)} />
    </View>
  ) : undefined;

  return (
    <SiteShell bottomBar={investBar}>
      <View style={{ backgroundColor: c.surface, borderBottomWidth: 1, borderBottomColor: c.border, paddingVertical: 28 }}>
        <Container style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            <Tag label={f.category} tone="neutral" />
            <Tag label={f.subCategory} tone="neutral" />
          </View>
          <Text style={[t.h2, isPhone && { fontSize: 22, lineHeight: 29 }]} accessibilityRole="header">{f.name}</Text>
          <Text style={t.small}>{f.amc} Mutual Fund</Text>
          <View style={[s.topRow, isPhone && { flexDirection: "column", alignItems: "flex-start" }]}>
            <View style={{ flexDirection: "row", gap: 32, flexWrap: "wrap" }}>
              <View style={{ gap: 4 }}>
                <Term term="nav" style={t.small}>{`NAV on ${formatDate(f.navDate)}`}</Term>
                <Text style={s.bigNum}>₹{f.nav.toFixed(2)}</Text>
              </View>
              <View style={{ gap: 4 }}>
                <Text style={t.small}>1 year</Text>
                <Text style={[s.bigNum, { color: r?.r1y == null ? c.muted : r.r1y >= 0 ? c.gain : c.loss }]}>{formatPct(r?.r1y)}</Text>
              </View>
              <View style={{ gap: 4 }}>
                <Term term="pa" style={t.small}>3 years, per year</Term>
                <Text style={[s.bigNum, { color: r?.r3y == null ? c.muted : r.r3y >= 0 ? c.gain : c.loss }]}>{formatPct(r?.r3y)}</Text>
              </View>
            </View>
            {!isPhone ? <Button label="Invest" size="lg" onPress={() => setSheet(true)} /> : null}
          </View>
        </Container>
      </View>

      <Section title="How the price has moved">
        <Card>
          <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
            {RANGES.map((x) => (
              <Pill key={x} label={x} active={x === range} onPress={() => setRange(x)} />
            ))}
          </View>
          {history.isLoading ? <Skeleton height={220} /> : <NavChart points={history.data ?? []} />}
        </Card>
      </Section>

      <Section tint title="Returns">
        <ReturnsTable r={r} />
        <View style={{ marginTop: 12 }}>
          <Term term="returns" style={t.small}>How these are worked out</Term>
        </View>
      </Section>

      <Section title="Fund details">
        <Card style={{ gap: 0, paddingVertical: 8 }}>
          <Fact label="Fund house" value={`${f.amc} Mutual Fund`} />
          <Fact label="Category" value={`${f.category} · ${f.subCategory}`} />
          <View style={s.fact}>
            <View style={{ flex: 1 }}>
              <Term term="regularGrowth" style={t.small}>Plan</Term>
            </View>
            <Text style={[t.body, { color: c.ink }]}>Regular, Growth</Text>
          </View>
          <Fact label="AMFI scheme code" value={f.code} />
          {f.isin ? <Fact label="ISIN" value={f.isin} /> : null}
        </Card>
        <Text style={[t.small, { marginTop: 16 }]}>{DISCLAIMER}</Text>
      </Section>

      <InvestSheet fund={f} visible={sheet} onClose={() => setSheet(false)} />
    </SiteShell>
  );
}

const s = StyleSheet.create({
  topRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginTop: 8 },
  bigNum: { fontFamily: F, color: c.ink, fontSize: 24, fontWeight: "600", letterSpacing: -0.4, fontVariant: ["tabular-nums"] },
  barNav: { fontFamily: F, color: c.ink, fontSize: 18, fontWeight: "600", fontVariant: ["tabular-nums"] },
  retCell: { flex: 1, padding: 20, gap: 6 },
  retRowPhone: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, minHeight: 52 },
  retDividerLeft: { borderLeftWidth: 1, borderLeftColor: c.border },
  retDividerTop: { borderTopWidth: 1, borderTopColor: c.border },
  retLabel: { fontFamily: F, color: c.muted, fontSize: 13 },
  retValue: { fontFamily: F, fontSize: 18, fontWeight: "600", fontVariant: ["tabular-nums"] },
  fact: { flexDirection: "row", alignItems: "center", gap: 16, minHeight: 48, borderBottomWidth: 1, borderBottomColor: c.border },
  iconBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  backdrop: { flex: 1, backgroundColor: "rgba(11,30,42,0.5)", alignItems: "center", justifyContent: "center", padding: 16 },
  sheet: { width: "100%", maxWidth: 460, backgroundColor: c.surface, borderRadius: 12, padding: 22, gap: 16 },
});
