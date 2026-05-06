"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { OtpInput } from "@/components/ui/OtpInput";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";
import { useOtpTimer } from "@/hooks/useOtpTimer";
import { phoneSchema, otpSchema } from "@/lib/utils/validation";

const PhoneInput = dynamic(
  () => import("react-phone-number-input").then((m) => m.default),
  { ssr: false, loading: () => <div className="h-11 rounded-md bg-surface border border-border animate-pulse" /> }
);

export function LoginForm() {
  const router = useRouter();
  const setPhoneStore = useAuthStore((s) => s.setPhone);

  const [stage, setStage] = useState("phone");
  const [phone, setPhone] = useState();
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const expiry = useOtpTimer({ initialSeconds: 300, autoStart: false });

  const sendOtp = async (e) => {
    e?.preventDefault?.();
    setError(null);
    const parsed = phoneSchema.safeParse(phone);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Numéro invalide");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: parsed.data, branch: "login" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Envoi impossible");
        setBusy(false);
        return;
      }
      setPhoneStore(parsed.data);
      setStage("verify");
      expiry.reset();
      setBusy(false);
    } catch {
      setError("Erreur réseau, réessayez.");
      setBusy(false);
    }
  };

  const verify = async (final = code) => {
    setError(null);
    const parsed = otpSchema.safeParse(final);
    if (!parsed.success) {
      setError("Code à 6 chiffres requis");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: parsed.data, branch: "login" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Code invalide");
        setBusy(false);
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Erreur réseau, réessayez.");
      setBusy(false);
    }
  };

  if (stage === "phone") {
    return (
      <form onSubmit={sendOtp} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-widest text-muted font-medium">
            Numéro de téléphone
          </label>
          <div className="hid-phone-input">
            <PhoneInput
              international
              countryCallingCodeEditable={false}
              defaultCountry="CI"
              value={phone}
              onChange={setPhone}
              placeholder="+225 07 07 00 00 00"
            />
          </div>
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" size="lg" loading={busy} disabled={busy}>
          Envoyer le code
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted text-center">
        Code envoyé. Valide {expiry.display}.
      </p>
      <OtpInput
        length={6}
        value={code}
        onChange={setCode}
        onComplete={(c) => verify(c)}
        error={Boolean(error)}
        disabled={busy}
      />
      {error && <p className="text-sm text-danger text-center">{error}</p>}
      <Button
        type="button"
        size="lg"
        onClick={() => verify()}
        loading={busy}
        disabled={busy || code.length < 6}
      >
        Se connecter
      </Button>
      <button
        type="button"
        onClick={() => {
          setStage("phone");
          setCode("");
        }}
        className="text-sm text-muted hover:text-foreground transition-colors text-center"
      >
        Modifier le numéro
      </button>
    </div>
  );
}
