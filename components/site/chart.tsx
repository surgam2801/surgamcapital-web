import { useState } from "react";
import { Text, View, type LayoutChangeEvent } from "react-native";
import Svg, { Defs, LinearGradient, Line, Path, Stop } from "react-native-svg";
import type { NavPoint } from "@/shared/mf/types";
import { c, F } from "./ui";

export function NavChart({ points, height = 220 }: { points: NavPoint[]; height?: number }) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  if (points.length < 2) {
    return (
      <View style={{ height, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: c.muted }}>No NAV history available for this range.</Text>
      </View>
    );
  }
  const values = points.map((p) => p.nav);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.08 || 1;
  const lo = min - pad;
  const hi = max + pad;
  const x = (i: number) => (i / (points.length - 1)) * width;
  const y = (v: number) => height - ((v - lo) / (hi - lo)) * height;
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.nav).toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const up = values[values.length - 1] >= values[0];
  const stroke = up ? c.evergreen : c.loss;
  return (
    <View onLayout={onLayout} style={{ height }} accessibilityLabel={`NAV chart from ${points[0].date} to ${points[points.length - 1].date}, ${up ? "up" : "down"} ${(((values[values.length - 1] - values[0]) / values[0]) * 100).toFixed(1)} percent`}>
      {width > 0 ? (
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={stroke} stopOpacity={0.18} />
              <Stop offset="1" stopColor={stroke} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          {[0.25, 0.5, 0.75].map((f) => (
            <Line key={f} x1={0} x2={width} y1={height * f} y2={height * f} stroke={c.border} strokeDasharray="4 6" />
          ))}
          <Path d={area} fill="url(#fill)" />
          <Path d={line} stroke={stroke} strokeWidth={2.2} fill="none" strokeLinejoin="round" />
        </Svg>
      ) : null}
    </View>
  );
}

/** Simple horizontal bars for category comparisons. */
export function Bars({ rows, format = (v: number) => String(v) }: { rows: { label: string; value: number }[]; format?: (v: number) => string }) {
  const max = Math.max(...rows.map((r) => Math.abs(r.value)), 1);
  return (
    <View style={{ gap: 10 }}>
      {rows.map((r) => (
        <View key={r.label} style={{ gap: 4 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <Text style={{ fontFamily: F, color: c.ink, fontSize: 14, fontWeight: "500", flex: 1 }} numberOfLines={1}>{r.label}</Text>
            <Text style={{ fontFamily: F, color: c.inkSoft, fontSize: 14, fontWeight: "600", fontVariant: ["tabular-nums"] }}>{format(r.value)}</Text>
          </View>
          <View style={{ height: 6, borderRadius: 3, backgroundColor: c.surfaceTint, overflow: "hidden" }}>
            <View style={{ width: `${(Math.abs(r.value) / max) * 100}%`, height: "100%", backgroundColor: r.value < 0 ? c.loss : c.evergreen, borderRadius: 3 }} />
          </View>
        </View>
      ))}
    </View>
  );
}
