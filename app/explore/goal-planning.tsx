import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SiteShell } from "@/components/site/shell";
import { Button, c, Card, EmptyState, Grid, Icon, Notice, NumberField, Pill, Section, Stat, TextField, styles as t, useBreakpoint } from "@/components/site/ui";
import { formatINR, planGoal } from "@/shared/mf/calc";
import { trpc } from "@/lib/trpc";

const KINDS = ["Education", "Wedding", "Home", "Vacation", "Car", "Emergency fund", "Other"];

export default function GoalPlanning() {
  const { isDesktop } = useBreakpoint();
  const me = trpc.investor.me.useQuery(undefined, { retry: false });
  const utils = trpc.useUtils();
  const goals = trpc.goals.list.useQuery(undefined, { enabled: !!me.data, retry: false });
  const add = trpc.goals.add.useMutation({ onSuccess: () => utils.goals.list.invalidate() });
  const remove = trpc.goals.remove.useMutation({ onSuccess: () => utils.goals.list.invalidate() });

  const [name, setName] = useState("");
  const [kind, setKind] = useState(KINDS[0]);
  const [target, setTarget] = useState(1000000);
  const [years, setYears] = useState(10);
  const [inflation, setInflation] = useState(6);
  const [ret, setRet] = useState(12);

  const preview = planGoal({ years, costToday: target, inflationPct: inflation, existing: 0, existingReturnPct: 0, newReturnPct: ret, lumpsum: 0 });
  const list = goals.data ?? [];
  const totalSip = list.reduce((a, g) => a + planGoal({ years: g.years, costToday: g.targetToday, inflationPct: g.inflationPct, existing: 0, existingReturnPct: 0, newReturnPct: g.returnPct, lumpsum: 0 }).monthlySip, 0);

  return (
    <SiteShell>
      <Section kicker="Explore" title="Goal planning" subtitle="List what you are saving for. Surgam works out the monthly SIP each goal needs and the total.">
        <View style={{ flexDirection: isDesktop ? "row" : "column", gap: 20, alignItems: "flex-start" }}>
          <Card style={{ ...(isDesktop ? { flex: 1 } : { width: "100%" }), height: undefined, gap: 14 }}>
            <Text style={t.h3}>Add a goal</Text>
            <TextField label="Goal name" value={name} onChange={setName} placeholder="e.g. Aarav's college" maxLength={60} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {KINDS.map((k) => (
                <Pill key={k} label={k} active={k === kind} onPress={() => setKind(k)} />
              ))}
            </View>
            <NumberField label="Cost in today's money" prefix="₹" value={target} onChange={setTarget} step={50000} min={1000} max={1e10} />
            <NumberField label="Years away" value={years} onChange={setYears} min={1} max={50} suffix="yrs" />
            <NumberField label="Inflation" value={inflation} onChange={setInflation} suffix="%" step={0.5} min={0} max={20} />
            <NumberField label="Expected return" value={ret} onChange={setRet} suffix="%" step={0.5} min={0} max={25} />
            <Text style={t.body}>
              Needs about <Text style={{ fontWeight: "600", color: c.evergreenDark }}>{formatINR(preview.monthlySip)} a month</Text> to reach {formatINR(preview.futureCost, { compact: true })}.
            </Text>
            {me.data ? (
              <Button label="Save goal" icon="add" loading={add.isPending} disabled={!name.trim()} onPress={() => add.mutate({ name: name.trim(), kind, targetToday: target, years, inflationPct: inflation, returnPct: ret }, { onSuccess: () => setName("") })} />
            ) : (
              <Button label="Sign in to save goals" variant="secondary" href={`/sign-in?next=${encodeURIComponent("/explore/goal-planning")}`} />
            )}
            {add.error ? <Notice tone="amber" text={add.error.message} /> : null}
          </Card>

          <Card style={{ ...(isDesktop ? { flex: 1.2 } : { width: "100%" }), height: undefined, gap: 14 }}>
            <Text style={t.h3}>Your goals</Text>
            {!me.data ? (
              <EmptyState title="Sign in to see saved goals" body="You can still use the planner on the left without signing in." />
            ) : list.length === 0 ? (
              <EmptyState title="No goals yet" body="Add your first goal to see the monthly amount it needs." />
            ) : (
              <>
                <View style={{ backgroundColor: c.mintSoft, borderRadius: 16, padding: 16 }}>
                  <Stat label="Total monthly SIP for all goals" value={formatINR(totalSip)} tone="pos" />
                </View>
                <Grid min={240} gap={12}>
                  {list.map((g) => {
                    const p = planGoal({ years: g.years, costToday: g.targetToday, inflationPct: g.inflationPct, existing: 0, existingReturnPct: 0, newReturnPct: g.returnPct, lumpsum: 0 });
                    return (
                      <View key={g.id} style={{ borderWidth: 1, borderColor: c.border, borderRadius: 16, padding: 14, gap: 6 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                          <Text style={[t.h4, { flex: 1 }]}>{g.name}</Text>
                          <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${g.name}`} onPress={() => remove.mutate({ id: g.id })}>
                            <Icon name="trash-outline" size={18} color={c.muted} />
                          </Pressable>
                        </View>
                        <Text style={t.small}>{g.kind} · in {g.years} years · {formatINR(p.futureCost, { compact: true })}</Text>
                        <Text style={[t.body, { fontWeight: "600", color: c.evergreenDark }]}>{formatINR(p.monthlySip)} / month</Text>
                      </View>
                    );
                  })}
                </Grid>
                <Button label="Start a SIP for your goals" icon="arrow-forward" href="/mutual-funds/sip" />
              </>
            )}
          </Card>
        </View>
      </Section>
    </SiteShell>
  );
}
