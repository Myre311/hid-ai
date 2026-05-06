"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/Button";
import { phoneSchema } from "@/lib/utils/validation";

const PhoneInput = dynamic(
  () => import("react-phone-number-input").then((m) => m.default),
  { ssr: false, loading: () => <PhoneInputSkeleton /> }
);

function PhoneInputSkeleton() {
  return <div className="h-11 rounded-md bg-surface border border-border animate-pulse" />;
}

/**
 * PhoneForm — collects a phone number, validates E.164 via Zod,
 * fires send-otp API, then routes to /signup/verify.
 */
export function PhoneForm({
  redirectTo = "/signup/verify",
  defaultCountry = "CI",
}) {
  const router = useRouter();
  const setPhone = useAuthStore((s) => s.setPhone);
  const branch = useAuthStore((s) => s.branch);

  const [value, setValue] = useState();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const parsed = phoneSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Numéro invalide");
      return;
    }

    setSubmitting(true);
    setPhone(parsed.data);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: parsed.data, branch }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Envoi du code impossible");
        setSubmitting(false);
        return;
      }
      router.push(redirectTo);
    } catch (err) {
      setError("Erreur réseau, réessayez.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="phone"
          className="text-xs uppercase tracking-widest text-muted font-medium"
        >
          Numéro de téléphone
        </label>
        <div className="hid-phone-input">
          <PhoneInput
            id="phone"
            international
            countryCallingCodeEditable={false}
            defaultCountry={defaultCountry}
            value={value}
            onChange={setValue}
            placeholder="+225 07 07 00 00 00"
            aria-invalid={Boolean(error) || undefined}
          />
        </div>
        {error ? (
          <p className="text-sm text-danger">{error}</p>
        ) : (
          <p className="text-sm text-muted">
            Format international. Vous recevrez un code à 6 chiffres par SMS.
          </p>
        )}
      </div>

      <Button type="submit" loading={submitting} disabled={submitting} size="lg">
        {submitting ? "Envoi du code…" : "Envoyer le code"}
      </Button>
    </form>
  );
}
