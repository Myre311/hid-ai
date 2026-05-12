"use client";

import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { useConsent } from "./ConsentContext";

/**
 * Bandeau cookies en bas de page.
 *
 * Comportement :
 *  - Ne rend rien si l'utilisateur a déjà donné son consentement (`isResolved`).
 *  - Animation d'entrée après le mount (évite le flash de banner sur les sessions
 *    déjà consentantes via SSR).
 *  - 3 actions : Tout accepter / Tout refuser / Personnaliser.
 *  - Liens vers /privacy et /gdpr inline.
 */
export function CookieBanner() {
  const { isResolved, acceptAll, refuseNonEssential, setOpenPrefs } = useConsent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Délai très court pour laisser l'hydratation se faire avant l'animation.
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (isResolved) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 backdrop-blur-md shadow-2xl transition-transform duration-500 ease-out ${
        mounted ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-5">
        <div className="flex flex-col lg:flex-row lg:items-start gap-5">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="hidden sm:inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-surface-elevated text-accent">
              <Cookie className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-1.5">
              <p
                id="cookie-banner-title"
                className="text-xs uppercase tracking-[0.22em] text-muted-strong"
              >
                Cookies et confidentialité
              </p>
              <p
                id="cookie-banner-desc"
                className="text-sm text-foreground/85 leading-relaxed max-w-3xl"
              >
                HID AI utilise des cookies <strong>strictement nécessaires</strong>{" "}
                (authentification, sécurité) qui sont toujours actifs. Vous pouvez
                accepter ou refuser les cookies de mesure d'audience et de personnalisation.
                {" "}
                <a
                  href="/privacy"
                  className="text-muted hover:text-foreground underline underline-offset-4"
                >
                  En savoir plus
                </a>.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 lg:flex-shrink-0">
            <button
              type="button"
              onClick={() => setOpenPrefs(true)}
              className="h-10 px-4 rounded-md text-sm font-medium text-muted hover:text-foreground border border-border hover:border-border-strong transition-colors whitespace-nowrap"
            >
              Personnaliser
            </button>
            <button
              type="button"
              onClick={refuseNonEssential}
              className="h-10 px-4 rounded-md text-sm font-medium text-foreground border border-border hover:border-border-strong transition-colors whitespace-nowrap"
            >
              Tout refuser
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="h-10 px-5 rounded-md text-sm font-medium bg-accent text-background hover:bg-accent-hover transition-colors whitespace-nowrap"
            >
              Tout accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
