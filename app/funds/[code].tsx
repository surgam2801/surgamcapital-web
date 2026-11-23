import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { NavChart } from "@/components/site/chart";
import { SiteShell } from "@/components/site/shell";
import { Button, c, Card, Container, EmptyState, Icon, Notice, NumberField, Pill, Section, Skeleton, Stat, styles as t, Tag, useBreakpoint } from "@/components/site/ui";
import { formatINR, formatPct, fvLumpsum, fvSip } from "@/shared/mf/calc";
import { DISCLAIMER } from "@/shared/mf/content";
import type { Scheme } from "@/shared/mf/types";
import { trpc } from "@/lib/trpc";

const RANGES = ["1M", "6M", "1Y", "3Y", "5Y", "MAX"] as const;

function InvestSheet({ fund, visible, onClose }: { fund: Scheme; visible: boolean; onClose: () => void }) {
  const router = useRouter();
  const me = trpc.investor.me.useQuery(undefined, { retry: false });
  const utils = trpc.useUtils();
  const [mode, setMode] = useState<"SIP" | "LUMPSUM">("SIP");
  const [amount, setAmount] = useState(5000);
  const [day, setDay] = useState(5);
  const [result, setResult] = useState<{ orderId: string; paid: boolean } | null>(null);
  const place = trpc.orders.place.useMutation({ onSuccess: (r) => setResult({ orderId: r.order.id, paid: false }) });
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
    place.reset();
    pay.reset();
    onClose();
  };
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <View style={s.backdrop}>
        <View style={s.sheet} accessibilityViewIsModal>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={t.small}>Invest in</Text>
              <Text style={t.h4}>{fund.name}</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={close} style={{ padding: 6 }}>
              <Icon name="close" size={22} color={c.inkSoft} />
            </Pressable>
          </View>

          {!me.data ? (
            <View style={{ gap: 12 }}>
              <Text style={t.body}>Sign in with your mobile number to place an order. It takes less than a minute.</Text>
              <Button
                label="Sign in to invest"
                icon="arrow-forward"
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
                <Icon name={result.paid ? "checkmark-circle" : "time-outline"} size={28} color={result.paid ? c.evergreen : c.amber} />
                <Text style={t.h3}>{result.paid ? "Order submitted" : "Order created"}</Text>
              </View>
              <Text style={t.body}>
                {result.paid
                  ? `Your ${mode === "SIP" ? "SIP" : "one-time"} order for ${formatINR(amount)} is submitted. Units are allotted at the NAV of the day your payment reaches the fund house.`
                  : "Complete the payment to submit your order."}
              </Text>
              {!result.paid ? (
                <>
                  <Notice tone="amber" text="Payments are simulated in this build. No money will move until a payment gateway and exchange are connected." />
                  <Button label={`Pay ${formatINR(amount)} (simulated)`} full loading={pay.isPending} onPress={() => pay.mutate({ id: result.orderId })} />
                </>
              ) : (
                <Button label="View my orders" icon="arrow-forward" full onPress={() => { close(); router.push("/dashboard/investments" as never); }} />
              )}
            </View>
          ) : (
            <View style={{ gap: 14 }}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pill label="Monthly SIP" active={mode === "SIP"} onPress={() => setMode("SIP")} />
                <Pill label="One-time" active={mode === "LUMPSUM"} onPress={() => setMode("LUMPSUM")} />
              </View>
              <NumberField label={mode === "SIP" ? "Monthly amount" : "Amount"} prefix="₹" value={amount} onChange={setAmount} step={500} min={0} max={10000000} hint={`Minimum ${formatINR(min)}`} />
              {mode === "SIP" ? <NumberField label="SIP date (day of month)" value={day} onChange={(v) => setDay(Math.round(v))} min={1} max={28} /> : null}
              <Text style={t.small}>
                {mode === "SIP"
                  ? `At an assumed 12% a year, this SIP could grow to about ${formatINR(fvSip(amount, 12, 10), { compact: true })} in 10 years. Illustration only.`
                  : `At an assumed 12% a year, this could grow to about ${formatINR(fvLumpsum(amount, 12, 5), { compact: true })} in 5 years. Illustration only.`}
              </Text>
              {place.error ? <Notice tone="amber" text={place.error.message} /> : null}
              <Button label={mode === "SIP" ? "Start SIP" : "Invest now"} icon="arrow-forward" full disabled={amount < min} loading={place.isPending} onPress={() => place.mutate({ code: fund.code, kind: mode, amount, sipDay: mode === "SIP" ? day : undefined })} />
              <Text style={[t.small, { fontSize: 11 }]}>{DISCLAIMER}</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
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
          <EmptyState title="We could not load this fund." body="Check your connection, or search for it again." />
          <Button label="Search funds" href="/mutual-funds" />
        </Section>
      </SiteShell>
    );

  const f = fund.data;
  const r = f.returns;
  return (
    <SiteShell>
      <View style={{ backgroundColor: c.surface, borderBottomWidth: 1, borderBottomColor: c.border, paddingVertical: 28 }}>
        <Container style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            <Tag label={f.category} />
            <Tag label={f.subCategory} tone="blue" />
          </View>
          <Text style={[t.h2, isPhone && { fontSize: 24, lineHeight: 30 }]} accessibilityRole="header">{f.name}</Text>
          <Text style={t.body}>{f.amc} Mutual Fund · AMFI code {f.code}{f.isin ? ` · ISIN ${f.isin}` : ""}</Text>
          <View style={[s.topRow, isPhone && { flexDirection: "column", alignItems: "flex-start" }]}>
            <View style={{ flexDirection: "row", gap: 28, flexWrap: "wrap" }}>
              <Stat label={`NAV on ${f.navDate}`} value={`₹${f.nav.toFixed(4)}`} />
              <Stat label="1Y return" value={formatPct(r?.r1y)} tone={r?.r1y != null ? (r.r1y >= 0 ? "pos" : "neg") : undefined} />
              <Stat label="3Y (p.a.)" value={formatPct(r?.r3y)} tone={r?.r3y != null ? (r.r3y >= 0 ? "pos" : "neg") : undefined} />
            </View>
            <Button label="Invest" icon="arrow-forward" size="lg" onPress={() => setSheet(true)} />
          </View>
        </Container>
      </View>

      <Section title="NAV history">
        <Card style={{ height: undefined }}>
          <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
            {RANGES.map((x) => (
              <Pill key={x} label={x} active={x === range} onPress={() => setRange(x)} />
            ))}
          </View>
          {history.isLoading ? <Skeleton height={220} /> : <NavChart points={history.data ?? []} />}
        </Card>
      </Section>

      <Section tint title="Returns">
        <View style={s.retGrid}>
          {([["1 month", r?.r1m], ["6 months", r?.r6m], ["1 year", r?.r1y], ["3 years p.a.", r?.r3y], ["5 years p.a.", r?.r5y]] as const).map(([label, v]) => (
            <Card key={label} style={{ minWidth: 140, flex: 1, height: undefined }}>
              <Stat label={label} value={formatPct(v)} tone={v != null ? (v >= 0 ? "pos" : "neg") : undefined} />
            </Card>
          ))}
        </View>
        <Text style={[t.small, { marginTop: 12 }]}>Point-to-point returns calculated from published NAVs. Periods over one year are annualised. {DISCLAIMER}</Text>
      </Section>

      <InvestSheet fund={f} visible={sheet} onClose={() => setSheet(false)} />
    </SiteShell>
  );
}

const s = StyleSheet.create({
  topRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginTop: 8 },
  retGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  backdrop: { flex: 1, backgroundColor: "rgba(16,32,31,0.45)", alignItems: "center", justifyContent: "center", padding: 16 },
  sheet: { width: "100%", maxWidth: 460, backgroundColor: c.surface, borderRadius: 24, padding: 22, gap: 16 },
});
