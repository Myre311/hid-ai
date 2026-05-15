"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/Button";
import { authEmailSchema } from "@/lib/utils/validation";

/**
 * EmailForm — collecte une adresse e-mail, valide, déclenche send-otp,
 * puis route vers /signup/verify.
 */
export function EmailForm({ redirectTo = "/signup/verify" }) {
  const router = useRouter();
  const setEmail = useAuthStore((s) => s.setEmail);
  const branch = useAuthStore((s) => s.branch);

  const [value, setValue] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const parsed = authEmailSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "E-mail invalide");
      return;
    }

    setSubmitting(true);
    setEmail(parsed.data);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data, branch }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Envoi du code impossible");
        toast.error("Envoi du code impossible", {
          description: data?.error,
        });
        setSubmitting(false);
        return;
      }
      toast.success("Code envoyé", {
        description:
          "Vérifiez votre boîte mail (ou utilisez 000000 en mode dev).",
      });
      router.push(redirectTo);
    } catch {
      setError("Erreur réseau, réessayez.");
      toast.error("Erreur réseau", { description: "Réessayez." });
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-xs uppercase tracking-widest text-muted font-medium"
        >
          Adresse e-mail
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          spellCheck={false}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="vous@exemple.com"
          aria-invalid={Boolean(error) || undefined}
          className="h-11 rounded-md bg-surface border border-border px-3 text-sm text-foreground placeholder:text-muted-strong focus:outline-none focus:border-accent transition-colors"
        />
        {error ? (
          <p className="text-sm text-danger">{error}</p>
        ) : (
          <p className="text-sm text-muted">
            Vous recevrez un code à 6 chiffres par e-mail. Pas de mot de passe.
          </p>
        )}
      </div>

      <Button type="submit" loading={submitting} disabled={submitting} size="lg">
        {submitting ? "Envoi du code…" : "Envoyer le code"}
      </Button>
    </form>
  );
}
