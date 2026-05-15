"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OtpInput } from "@/components/ui/OtpInput";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";
import { useOtpTimer } from "@/hooks/useOtpTimer";
import { authEmailSchema, otpSchema } from "@/lib/utils/validation";

export function LoginForm() {
  const router = useRouter();
  const setEmailStore = useAuthStore((s) => s.setEmail);

  const [stage, setStage] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const expiry = useOtpTimer({ initialSeconds: 300, autoStart: false });

  const sendOtp = async (e) => {
    e?.preventDefault?.();
    setError(null);
    const parsed = authEmailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "E-mail invalide");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data, branch: "login" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Envoi impossible");
        setBusy(false);
        return;
      }
      setEmail(parsed.data);
      setEmailStore(parsed.data);
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
        body: JSON.stringify({ email, code: parsed.data, branch: "login" }),
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

  if (stage === "email") {
    return (
      <form onSubmit={sendOtp} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="login-email"
            className="text-xs uppercase tracking-widest text-muted font-medium"
          >
            Adresse e-mail
          </label>
          <input
            id="login-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="off"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            className="h-11 rounded-md bg-surface border border-border px-3 text-sm text-foreground placeholder:text-muted-strong focus:outline-none focus:border-accent transition-colors"
          />
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
        Code envoyé par e-mail. Valide {expiry.display}.
      </p>
      {process.env.NODE_ENV !== "production" && (
        <p className="text-xs text-accent/85 text-center bg-accent/10 border border-accent/30 rounded-md px-3 py-2">
          Mode dev — entrez{" "}
          <code className="font-mono bg-black/30 px-1 py-0.5 rounded">000000</code>{" "}
          pour bypass l&rsquo;OTP
        </p>
      )}
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
          setStage("email");
          setCode("");
        }}
        className="text-sm text-muted hover:text-foreground transition-colors text-center"
      >
        Modifier l&rsquo;adresse e-mail
      </button>
    </div>
  );
}
