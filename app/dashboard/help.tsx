import { useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { ConfirmSheet, InsightCard, ListCard, PageHeader, ScreenFrame, SectionHeading, StatusPill } from "@/components/surgam/ui";
import { surgam } from "@/components/surgam/theme";

export default function HelpScreen() {
  const [sheet, setSheet] = useState<{ title: string; body: string } | null>(null);
  const { width } = useWindowDimensions();
  return (
    <ScreenFrame>
      <PageHeader eyebrow="A LITTLE SUPPORT" title="Help & profile" subtitle="Ask a question, change a preference, or simply learn at your own pace." right={<StatusPill label="Account protected" tone="green" />} />
      <View style={styles.profileCard}><View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View><View style={styles.profileCopy}><Text style={styles.profileName}>Anita Sharma</Text><Text style={styles.profileDetail}>Long-term investor · Member since 2022</Text></View><Text style={styles.profileAction} onPress={() => setSheet({ title: "Profile settings", body: "This demo keeps profile editing out of the financial flow. In the full app, your personal details and security preferences would be here." })}>Edit ›</Text></View>
      <View style={[styles.supportGrid, width < 700 && styles.supportGridStack]}><ListCard onPress={() => setSheet({ title: "Call support", body: "In the full Surgam app, this button would connect you to a trained support person. No call has been started in this demo." })}><View style={styles.supportIcon}><Text style={styles.supportIconText}>☎</Text></View><Text style={styles.supportTitle}>Talk to a person</Text><Text style={styles.supportBody}>Call support when you would rather speak than search.</Text><Text style={styles.supportLink}>Call support ›</Text></ListCard><ListCard onPress={() => setSheet({ title: "Chat support", body: "In the full Surgam app, a support chat would open here. This demo does not send a message." })}><View style={[styles.supportIcon, styles.supportIconBlue]}><Text style={[styles.supportIconText, styles.supportIconBlueText]}>•••</Text></View><Text style={styles.supportTitle}>Ask a question</Text><Text style={styles.supportBody}>Get a simple answer without needing to know finance terms.</Text><Text style={styles.supportLink}>Start a chat ›</Text></ListCard></View>
      <View style={styles.section}><SectionHeading title="Preferences" /><View style={styles.preference}><View style={styles.preferenceIcon}><Text style={styles.preferenceIconText}>🔔</Text></View><View style={styles.preferenceCopy}><Text style={styles.preferenceTitle}>Useful reminders</Text><Text style={styles.preferenceBody}>SIP dates, pending actions, and important updates</Text></View><Text style={styles.preferenceValue}>On</Text></View><View style={styles.preference}><View style={styles.preferenceIcon}><Text style={styles.preferenceIconText}>Aa</Text></View><View style={styles.preferenceCopy}><Text style={styles.preferenceTitle}>Readable text</Text><Text style={styles.preferenceBody}>Large type and clear labels are always on</Text></View><Text style={styles.preferenceValue}>On</Text></View></View>
      <InsightCard title="Learn one thing today" body="An SIP is a regular investment made on a schedule you choose. It can help you build a habit without needing to time the market." icon="document" tone="amber" />
      <View style={styles.legal}><Text style={styles.legalTitle}>Your privacy matters</Text><Text style={styles.legalBody}>Surgam uses clear explanations and asks before important actions. Demo data shown here is not connected to a real investment account.</Text><Text style={styles.legalLink} onPress={() => setSheet({ title: "Privacy & security", body: "This is a prototype trust cue. A production app would link to its full privacy policy, security details, and data controls here." })}>Read privacy details ›</Text></View>
      <ConfirmSheet visible={Boolean(sheet)} title={sheet?.title ?? "Help"} body={sheet?.body ?? ""} onClose={() => setSheet(null)} />
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  profileCard: { flexDirection: "row", alignItems: "center", gap: 13, backgroundColor: surgam.colors.surface, borderRadius: 22, borderWidth: 1, borderColor: surgam.colors.border, padding: 17 },
  avatar: { width: 52, height: 52, borderRadius: 18, backgroundColor: surgam.colors.mint, alignItems: "center", justifyContent: "center" },
  avatarText: { color: surgam.colors.evergreenDark, fontSize: 22, fontWeight: "900" },
  profileCopy: { flex: 1 },
  profileName: { color: surgam.colors.ink, fontSize: 16, fontWeight: "800" },
  profileDetail: { color: surgam.colors.muted, fontSize: 13, marginTop: 4 },
  profileAction: { color: surgam.colors.evergreen, fontSize: 14, fontWeight: "800" },
  supportGrid: { flexDirection: "row", gap: 14 },
  supportGridStack: { flexDirection: "column" },
  supportIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: surgam.colors.mintSoft, alignItems: "center", justifyContent: "center", marginBottom: 13 },
  supportIconText: { color: surgam.colors.evergreen, fontSize: 22, fontWeight: "900" },
  supportIconBlue: { backgroundColor: surgam.colors.blueSoft },
  supportIconBlueText: { color: surgam.colors.blue, fontSize: 18, letterSpacing: 1 },
  supportTitle: { color: surgam.colors.ink, fontSize: 16, fontWeight: "800" },
  supportBody: { color: surgam.colors.inkSoft, fontSize: 14, lineHeight: 20, marginTop: 6 },
  supportLink: { color: surgam.colors.evergreen, fontSize: 14, fontWeight: "800", marginTop: 15 },
  section: { gap: 14 },
  preference: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: surgam.colors.surface, borderWidth: 1, borderColor: surgam.colors.border, borderRadius: 18, padding: 14 },
  preferenceIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: surgam.colors.canvas, alignItems: "center", justifyContent: "center" },
  preferenceIconText: { color: surgam.colors.evergreenDark, fontSize: 16, fontWeight: "900" },
  preferenceCopy: { flex: 1 },
  preferenceTitle: { color: surgam.colors.ink, fontSize: 15, fontWeight: "800" },
  preferenceBody: { color: surgam.colors.muted, fontSize: 13, marginTop: 3 },
  preferenceValue: { color: surgam.colors.evergreen, fontSize: 13, fontWeight: "900" },
  legal: { padding: 18, borderRadius: 20, backgroundColor: surgam.colors.surface, borderWidth: 1, borderColor: surgam.colors.border },
  legalTitle: { color: surgam.colors.ink, fontSize: 15, fontWeight: "800" },
  legalBody: { color: surgam.colors.inkSoft, fontSize: 14, lineHeight: 20, marginTop: 6 },
  legalLink: { color: surgam.colors.evergreen, fontSize: 14, fontWeight: "800", marginTop: 12 },
});
