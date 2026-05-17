"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Bouton "Continuer avec Google" — connexion uniquement.
 * Lance le flux OAuth Supabase ; au retour, /api/auth/callback vérifie
 * que le compte existe (talent / b2b / admin) sinon renvoie vers /signup.
 */
export function GoogleButton({ label = "Continuer avec Google" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const onClick = async () => {
    setError(null);
    setBusy(true);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: { prompt: "select_account" },
        },
      });
      if (oauthError) {
        setError("Connexion Google indisponible. Réessayez.");
        setBusy(false);
      }
      // Si pas d'erreur : redirection navigateur vers Google → pas de reset.
    } catch {
      setError("Connexion Google indisponible. Réessayez.");
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className="inline-flex items-center justify-center gap-3 h-11 rounded-md border border-border bg-surface px-4 text-sm font-medium text-foreground hover:border-border-strong hover:bg-surface-elevated transition-all duration-200 disabled:opacity-50"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"
          />
        </svg>
        {busy ? "Redirection vers Google…" : label}
      </button>
      {error && <p className="text-sm text-danger text-center">{error}</p>}
    </div>
  );
}
