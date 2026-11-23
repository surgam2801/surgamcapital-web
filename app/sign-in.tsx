import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SiteShell } from "@/components/site/shell";
import { Button, c, Card, Container, Icon, Notice, TextField, styles as t } from "@/components/site/ui";
import { setInvestorToken } from "@/lib/mf/session";
import { trpc } from "@/lib/trpc";

export default function SignIn() {
  const router = useRouter();
  const { next } = useLocalSearchParams<{ next?: string }>();
  const utils = trpc.useUtils();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [devOtp, setDevOtp] = useState<string | undefined>();
  const [info, setInfo] = useState<string | null>(null);

  const request = trpc.investor.requestOtp.useMutation({
    onSuccess: (r) => {
      if (!r.ok) {
        setInfo(`Please wait ${r.retryInSec} seconds before asking for another code.`);
        return;
      }
      setDevOtp(r.devOtp);
      setInfo(null);
      setStep("otp");
    },
  });
  const verify = trpc.investor.verifyOtp.useMutation({
    onSuccess: async (r) => {
      await setInvestorToken(r.token);
      await utils.invalidate();
      const target = typeof next === "string" && next.startsWith("/") ? next : "/dashboard";
      router.replace(target as never);
    },
  });

  const error = request.error?.message ?? verify.error?.message;

  return (
    <SiteShell>
      <Container style={{ paddingVertical: 48, alignItems: "center" }}>
        <Card style={{ width: "100%", maxWidth: 440, height: undefined, padding: 28, gap: 18 }}>
          <View style={{ gap: 6 }}>
            <Icon name="phone-portrait-outline" size={28} color={c.evergreen} />
            <Text style={t.h2} accessibilityRole="header">{step === "phone" ? "Sign in or sign up" : "Enter the code"}</Text>
            <Text style={t.body}>
              {step === "phone" ? "Use your mobile number. We will send you a 6-digit code." : `We sent a code to +91 ${phone.replace(/\D/g, "").slice(-10)}.`}
            </Text>
          </View>

          {step === "phone" ? (
            <>
              <TextField label="Mobile number" value={phone} onChange={setPhone} placeholder="10-digit mobile number" keyboardType="phone-pad" maxLength={14} autoFocus />
              <Button label="Send code" icon="arrow-forward" full loading={request.isPending} disabled={phone.replace(/\D/g, "").length < 10} onPress={() => request.mutate({ phone })} />
            </>
          ) : (
            <>
              {devOtp ? <Notice tone="amber" text={`Development mode: no SMS provider is set up, so your code is ${devOtp}.`} /> : null}
              <TextField label="6-digit code" value={otp} onChange={(v) => setOtp(v.replace(/\D/g, "").slice(0, 6))} placeholder="••••••" keyboardType="number-pad" maxLength={6} autoFocus />
              <Button label="Verify and continue" icon="arrow-forward" full loading={verify.isPending} disabled={otp.length !== 6} onPress={() => verify.mutate({ phone, otp })} />
              <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
                <Button label="Change number" variant="ghost" onPress={() => { setStep("phone"); setOtp(""); verify.reset(); }} />
                <Button label="Resend code" variant="ghost" onPress={() => request.mutate({ phone })} />
              </View>
            </>
          )}
          {info ? <Notice text={info} /> : null}
          {error ? <Notice tone="amber" text={error.includes("fetch") ? "Could not reach the Surgam server. Check that it is running and try again." : error} /> : null}
          <Text style={t.small}>By continuing you agree to Surgam's terms and privacy policy (to be published).</Text>
        </Card>
      </Container>
    </SiteShell>
  );
}
