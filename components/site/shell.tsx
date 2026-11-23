import { usePathname, useRouter } from "expo-router";
import { useState, type ReactNode } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SurgamMark } from "@/components/surgam/ui";
import { CALCULATORS, DISCLAIMER, EXPLORE_TOOLS, WAYS_TO_INVEST } from "@/shared/mf/content";
import { trpc } from "@/lib/trpc";
import { c, Container, F, Icon, useBreakpoint } from "./ui";

type Link = { label: string; href: string; blurb?: string };
type NavGroup = { label: string; href?: string; match: string[]; items?: Link[] };

const EXPLORE_LINKS: Link[] = [
  ...EXPLORE_TOOLS.map((t) => ({ label: t.title, href: `/explore/${t.slug}`, blurb: t.blurb })),
  { label: "Calculators", href: "/calculators", blurb: "Plan education, retirement, a home and more." },
];

const NAV: NavGroup[] = [
  { label: "Home", href: "/", match: ["/"] },
  { label: "Products", match: ["/mutual-funds", "/funds"], items: [{ label: "Mutual Funds", href: "/mutual-funds", blurb: "Research, compare and invest in over 3,000 funds." }] },
  { label: "Explore", match: ["/explore", "/calculators"], items: EXPLORE_LINKS },
  { label: "About us", href: "/about", match: ["/about"] },
];

function isActive(pathname: string, g: NavGroup) {
  return g.match.some((m) => (m === "/" ? pathname === "/" : pathname.startsWith(m)));
}

function AccountButton({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const me = trpc.investor.me.useQuery(undefined, { retry: false, staleTime: 60_000 });
  const signedIn = !!me.data;
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={signedIn ? "My account" : "Sign in"}
      onPress={() => {
        onNavigate?.();
        router.push((signedIn ? "/dashboard" : "/sign-in") as never);
      }}
      style={({ pressed }) => [s.account, pressed && { opacity: 0.85 }]}
    >
      <Text style={s.accountText}>{signedIn ? "My account" : "Sign in"}</Text>
    </Pressable>
  );
}

function Dropdown({ group, onGo, onClose }: { group: NavGroup; onGo: (href: string) => void; onClose: () => void }) {
  const items = group.items ?? [];
  const isProducts = group.label === "Products";
  return (
    <View pointerEvents="box-none" style={s.dropWrap}>
      {/* Transparent backdrop below the menu: moving onto the page or clicking it closes the menu.
          (Closing on the menu's own hover-out fired when the pointer moved onto a child item,
          which unmounted the item before the click landed.) */}
      <Pressable accessible={false} onHoverIn={onClose} onPress={onClose} style={s.backdrop} />
      <View style={[s.drop, isProducts ? { width: 560 } : { width: 620 }]}>
        {isProducts ? (
          <View style={{ flexDirection: "row", gap: 24 }}>
            <Pressable accessibilityRole="link" onPress={() => onGo("/mutual-funds")} style={({ hovered }: { hovered?: boolean }) => [s.dropFeature, hovered && { backgroundColor: c.surfaceTint }]}>
              <Text style={s.dropTitle}>Mutual Funds</Text>
              <Text style={s.dropBlurb}>{items[0]?.blurb}</Text>
              <Text style={[s.dropBlurb, { color: c.evergreen, fontWeight: "600", marginTop: 8 }]}>Overview →</Text>
            </Pressable>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={s.dropHead}>Ways to invest</Text>
              {WAYS_TO_INVEST.map((w) => (
                <Pressable key={w.slug} accessibilityRole="link" onPress={() => onGo(`/mutual-funds/${w.slug}`)} style={({ hovered }: { hovered?: boolean }) => [s.dropRow, hovered && { backgroundColor: c.surfaceTint }]}>
                  <Text style={s.dropLink}>{w.title}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {items.map((it) => (
              <Pressable key={it.href} accessibilityRole="link" onPress={() => onGo(it.href)} style={({ hovered }: { hovered?: boolean }) => [s.dropItem, hovered && { backgroundColor: c.surfaceTint }]}>
                <Text style={s.dropTitle}>{it.label}</Text>
                {it.blurb ? <Text style={s.dropBlurb} numberOfLines={2}>{it.blurb}</Text> : null}
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { isDesktop } = useBreakpoint();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const go = (href: string) => {
    setOpen(false);
    setMenu(null);
    router.push(href as never);
  };
  const activeGroup = NAV.find((g) => g.label === menu);
  return (
    <View style={s.header}>
      <Container style={s.headerRow}>
        <Pressable accessibilityRole="link" accessibilityLabel="Surgam home" onPress={() => go("/")}>
          <SurgamMark />
        </Pressable>
        {isDesktop ? (
          <View style={s.nav}>
            {NAV.map((g) => {
              const active = isActive(pathname, g);
              return (
                <Pressable
                  key={g.label}
                  accessibilityRole={g.items ? "button" : "link"}
                  accessibilityState={g.items ? { expanded: menu === g.label } : undefined}
                  onHoverIn={() => setMenu(g.items ? g.label : null)}
                  onPress={() => (g.items ? setMenu(g.label) : go(g.href!))}
                  style={s.navItem}
                >
                  <Text style={[s.navText, active && s.navTextActive]}>{g.label}</Text>
                  {g.items ? <Icon name={menu === g.label ? "chevron-up" : "chevron-down"} size={14} color={active ? c.ink : c.muted} /> : null}
                  {active ? <View style={s.navUnderline} /> : null}
                </Pressable>
              );
            })}
          </View>
        ) : null}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <AccountButton onNavigate={() => setOpen(false)} />
          {!isDesktop ? (
            <Pressable accessibilityRole="button" accessibilityLabel={open ? "Close menu" : "Open menu"} onPress={() => setOpen(!open)} style={s.menuBtn}>
              <Icon name={open ? "close" : "menu"} size={24} color={c.ink} />
            </Pressable>
          ) : null}
        </View>
      </Container>

      {isDesktop && activeGroup?.items ? <Dropdown group={activeGroup} onGo={go} onClose={() => setMenu(null)} /> : null}

      {!isDesktop && open ? (
        <View style={s.drawer}>
          {NAV.map((g) =>
            g.items ? (
              <View key={g.label}>
                <Pressable accessibilityRole="button" accessibilityState={{ expanded: expanded === g.label }} onPress={() => setExpanded(expanded === g.label ? null : g.label)} style={s.drawerItem}>
                  <Text style={[s.drawerText, isActive(pathname, g) && s.navTextActive]}>{g.label}</Text>
                  <Icon name={expanded === g.label ? "chevron-up" : "chevron-down"} size={18} color={c.muted} />
                </Pressable>
                {expanded === g.label
                  ? g.items.map((it) => (
                      <Pressable key={it.href} accessibilityRole="link" onPress={() => go(it.href)} style={s.drawerSub}>
                        <Text style={s.drawerSubText}>{it.label}</Text>
                      </Pressable>
                    ))
                  : null}
              </View>
            ) : (
              <Pressable key={g.label} accessibilityRole="link" onPress={() => go(g.href!)} style={s.drawerItem}>
                <Text style={[s.drawerText, isActive(pathname, g) && s.navTextActive]}>{g.label}</Text>
              </Pressable>
            ),
          )}
        </View>
      ) : null}
    </View>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href?: string }[] }) {
  const router = useRouter();
  return (
    <View style={{ gap: 10, flexGrow: 1, flexBasis: 150 }}>
      <Text style={s.footHead}>{title}</Text>
      {links.map((l) =>
        l.href ? (
          <Pressable key={l.label} accessibilityRole="link" onPress={() => router.push(l.href as never)}>
            <Text style={s.footLink}>{l.label}</Text>
          </Pressable>
        ) : (
          <Text key={l.label} style={[s.footLink, { opacity: 0.6 }]}>{l.label}</Text>
        ),
      )}
    </View>
  );
}

export function SiteFooter() {
  const { isPhone } = useBreakpoint();
  return (
    <View style={s.footer}>
      <Container>
        <View style={s.footTop}>
          <View style={{ gap: 14, flexGrow: 1.4, flexBasis: isPhone ? "100%" : 240 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={s.footMark}>
                <Text style={s.footMarkText}>S</Text>
              </View>
              <Text style={s.footWord}>Surgam Capital</Text>
            </View>
            <Text style={s.footBody}>A calmer way to understand and grow your long-term money plan.</Text>
          </View>
          <FooterCol title="Products" links={[{ label: "Mutual Funds", href: "/mutual-funds" }, ...WAYS_TO_INVEST.map((w) => ({ label: w.title, href: `/mutual-funds/${w.slug}` }))]} />
          <FooterCol title="Explore" links={[...EXPLORE_TOOLS.map((t) => ({ label: t.title, href: `/explore/${t.slug}` })), { label: "Calculators", href: "/calculators" }]} />
          <FooterCol title="Calculators" links={CALCULATORS.map((x) => ({ label: x.title, href: `/calculators/${x.slug}` }))} />
          <FooterCol title="Company" links={[{ label: "About us", href: "/about" }, { label: "FAQs", href: "/faqs" }, { label: "My account", href: "/dashboard" }, { label: "Contact details coming soon" }]} />
        </View>
        <View style={s.footRule} />
        <Text style={s.footSmall}>{DISCLAIMER}</Text>
        <Text style={s.footSmall}>Registration details (AMFI ARN and others) will be shown here once issued. Fund data: AMFI public NAV files.</Text>
        <Text style={[s.footSmall, { marginTop: 8 }]}>© {new Date().getFullYear()} Surgam Capital</Text>
      </Container>
    </View>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: c.canvas, paddingTop: Platform.OS === "web" ? 0 : insets.top }}>
      <SiteHeader />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexGrow: 1 }}>{children}</View>
        <SiteFooter />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { backgroundColor: c.surface, borderBottomWidth: 1, borderBottomColor: c.border, zIndex: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 64, gap: 16 },
  nav: { flexDirection: "row", gap: 8, flex: 1, justifyContent: "center", alignSelf: "stretch" },
  navItem: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, alignSelf: "stretch" },
  navText: { fontFamily: F, color: c.inkSoft, fontSize: 14, fontWeight: "500" },
  navTextActive: { color: c.ink, fontWeight: "600" },
  navUnderline: { position: "absolute", left: 12, right: 12, bottom: -1, height: 2, backgroundColor: c.evergreen },
  account: { backgroundColor: c.evergreen, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 8 },
  accountText: { fontFamily: F, color: c.white, fontSize: 14, fontWeight: "600" },
  menuBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 8 },
  dropWrap: { position: "absolute", top: 64, left: 0, right: 0, alignItems: "center", zIndex: 30 },
  backdrop: { position: "absolute", top: 0, left: 0, right: 0, height: 4000, backgroundColor: "transparent" },
  drop: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 12, padding: 12, shadowColor: c.navy, shadowOpacity: 0.1, shadowRadius: 24, shadowOffset: { width: 0, height: 12 } },
  dropFeature: { width: 220, padding: 16, borderRadius: 8, backgroundColor: c.canvas, gap: 6 },
  dropHead: { fontFamily: F, color: c.muted, fontSize: 11, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", paddingHorizontal: 10, paddingVertical: 6 },
  dropRow: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 6 },
  dropItem: { width: "50%", padding: 12, borderRadius: 8, gap: 2 },
  dropTitle: { fontFamily: F, color: c.ink, fontSize: 14, fontWeight: "600" },
  dropLink: { fontFamily: F, color: c.ink, fontSize: 14, fontWeight: "500" },
  dropBlurb: { fontFamily: F, color: c.muted, fontSize: 13, lineHeight: 18 },
  drawer: { borderTopWidth: 1, borderTopColor: c.border, paddingVertical: 6, backgroundColor: c.surface },
  drawerItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14 },
  drawerText: { fontFamily: F, color: c.ink, fontSize: 16, fontWeight: "500" },
  drawerSub: { paddingLeft: 36, paddingRight: 20, paddingVertical: 11 },
  drawerSubText: { fontFamily: F, color: c.inkSoft, fontSize: 15 },
  footer: { backgroundColor: c.navy, paddingVertical: 56 },
  footTop: { flexDirection: "row", flexWrap: "wrap", gap: 32 },
  footMark: { width: 28, height: 28, borderRadius: 6, backgroundColor: c.evergreen, alignItems: "center", justifyContent: "center" },
  footMarkText: { fontFamily: F, color: c.white, fontWeight: "600", fontSize: 15 },
  footWord: { fontFamily: F, color: c.white, fontSize: 17, fontWeight: "600", letterSpacing: -0.3 },
  footBody: { fontFamily: F, color: "#A7B4BD", fontSize: 14, lineHeight: 21, maxWidth: 300 },
  footHead: { fontFamily: F, color: c.white, fontSize: 13, fontWeight: "600", marginBottom: 4 },
  footLink: { fontFamily: F, color: "#A7B4BD", fontSize: 14 },
  footRule: { height: 1, backgroundColor: "#1E3442", marginVertical: 28 },
  footSmall: { fontFamily: F, color: "#7F8F9A", fontSize: 12, lineHeight: 18 },
});
