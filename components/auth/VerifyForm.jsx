"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OtpInput } from "@/components/ui/OtpInput";
import { Button } from "@/components/ui/Button";
import { useOtpTimer } from "@/hooks/useOtpTimer";
import { useAuthStore } from "@/stores/authStore";
import { otpSchema } from "@/lib/utils/validation";

const RESEND_AFTER_S = 30;

/**
 * VerifyForm — 6-digit OTP entry tied to the phone stored in authStore.
 * Calls /api/auth/verify-otp; on success routes to /signup/profile or /dashboard.
 */
export function VerifyForm({ onSuccessRedirect = "/signup/profile" }) {
  const router = useRouter();
  const phone = useAuthStore((s) => s.phone);
  const branch = useAuthStore((s) => s.branch);

  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resentAt, setResentAt] = useState(null);

  const expiry = useOtpTimer({ initialSeconds: 300 });
  const cooldown = useOtpTimer({ initialSeconds: RESEND_AFTER_S });

  const verify = async (final = code) => {
    setError(null);
    const parsed = otpSchema.safeParse(final);
    if (!parsed.success) {
      setError("Code à 6 chiffres requis");
      return;
    }
    if (!phone) {
      setError("Téléphone manquant — recommencez l'inscription");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: parsed.data, branch }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Code invalide");
        setSubmitting(false);
        return;
      }
      router.push(onSuccessRedirect);
    } catch {
      setError("Erreur réseau, réessayez.");
      setSubmitting(false);
    }
  };

  const resend = async () => {
    if (cooldown.running || resending || !phone) return;
    setResending(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, branch }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Impossible de renvoyer le code");
      } else {
        setResentAt(Date.now());
        cooldown.reset();
        expiry.reset();
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        verify();
      }}
      className="flex flex-col gap-7"
      noValidate
    >
      <OtpInput
        length={6}
        value={code}
        onChange={setCode}
        onComplete={(c) => verify(c)}
        disabled={submitting}
        error={Boolean(error)}
        autoFocus
      />

      {process.env.NODE_ENV !== "production" && (
        <p className="text-xs text-accent/85 text-center bg-accent/10 border border-accent/30 rounded-md px-3 py-2">
          Mode dev — entrez{" "}
          <code className="font-mono bg-black/30 px-1 py-0.5 rounded">000000</code>{" "}
          pour bypass l&rsquo;OTP
        </p>
      )}

      {error ? (
        <p className="text-sm text-danger text-center">{error}</p>
      ) : (
        <p className="text-sm text-muted text-center">
          {expiry.secondsLeft > 0
            ? `Code valide ${expiry.display}`
            : "Code expiré, demandez-en un nouveau."}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={submitting || code.length < 6}
        loading={submitting}
      >
        Vérifier
      </Button>

      <div className="text-center text-sm text-muted">
        {cooldown.running ? (
          <span>Renvoyer dans {cooldown.secondsLeft}s</span>
        ) : (
          <button
            type="button"
            onClick={resend}
            disabled={resending}
            className="text-foreground underline-offset-4 hover:underline"
          >
            {resending ? "Envoi…" : resentAt ? "Renvoyer le code" : "Renvoyer le code"}
          </button>
        )}
      </div>
    </form>
  );
}
