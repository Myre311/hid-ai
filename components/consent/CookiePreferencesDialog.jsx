"use client";

import { useEffect, useRef, useState } from "react";
import { X, Lock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useConsent } from "./ConsentContext";
import { CATEGORIES } from "@/lib/consent/categories";

/**
 * Modale de gestion granulaire du consentement.
 * Affichée quand l'utilisateur clique sur "Personnaliser" depuis le banner,
 * ou sur "Gérer mes préférences cookies" depuis /privacy.
 */
export function CookiePreferencesDialog() {
  const { openPrefs, setOpenPrefs, categories, savePreferences, refuseNonEssential, acceptAll } = useConsent();
  const dialogRef = useRef(null);

  // État local pour les toggles — on commit uniquement au "Enregistrer".
  const [local, setLocal] = useState(categories);
  useEffect(() => {
    if (openPrefs) setLocal(categories);
  }, [openPrefs, categories]);

  // ESC + focus trap minimal
  useEffect(() => {
    if (!openPrefs) return;
    function onKey(e) {
      if (e.key === "Escape") setOpenPrefs(false);
    }
    document.addEventListener("keydown", onKey);
    // Focus le premier bouton focusable après ouverture
    const t = setTimeout(() => {
      const el = dialogRef.current?.querySelector("[data-autofocus]");
      el?.focus();
    }, 30);
    return () => { document.removeEventListener("keydown", onKey); clearTimeout(t); };
  }, [openPrefs, setOpenPrefs]);

  if (!openPrefs) return null;

  const toggle = (key) => setLocal((c) => ({ ...c, [key]: !c[key] }));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-prefs-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={() => setOpenPrefs(false)}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-surface shadow-2xl"
      >
        <header className="sticky top-0 flex items-start justify-between gap-4 px-6 pt-6 pb-4 bg-surface border-b border-border">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-strong">
              Préférences cookies
            </p>
            <h2 id="cookie-prefs-title" className="t-h3 mt-2">
              Choisissez ce que vous acceptez
            </h2>
          </div>
          <button
            type="button"
            data-autofocus
            onClick={() => setOpenPrefs(false)}
            aria-label="Fermer la fenêtre"
            className="flex-shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="px-6 py-5 flex flex-col gap-5 text-sm text-foreground/85">
          <p>
            Vous pouvez accepter, refuser ou personnaliser l'usage des cookies sur HID AI.
            Votre choix est conservé 13 mois et peut être modifié à tout moment depuis la
            page <a href="/privacy" className="underline underline-offset-4 hover:text-accent">Politique de confidentialité</a>.
          </p>

          <ul className="flex flex-col gap-3">
            {CATEGORIES.map((cat) => (
              <li
                key={cat.key}
                className={cn(
                  "rounded-md border border-border bg-background/40 p-4",
                  cat.locked && "opacity-90"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">{cat.title}</h3>
                      {cat.locked && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-muted-strong">
                          <Lock className="h-3 w-3" /> Toujours actif
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted leading-relaxed">{cat.description}</p>
                    {cat.examples && cat.examples.length > 0 && (
                      <p className="text-[11px] text-muted-strong mt-1">
                        Exemples : {cat.examples.join(", ")}
                      </p>
                    )}
                  </div>

                  <ToggleSwitch
                    label={`Activer ${cat.title}`}
                    checked={cat.locked ? true : Boolean(local[cat.key])}
                    disabled={cat.locked}
                    onChange={() => !cat.locked && toggle(cat.key)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <footer className="sticky bottom-0 px-6 py-4 bg-surface border-t border-border flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={refuseNonEssential}
              className="h-10 px-4 rounded-md text-sm font-medium text-muted hover:text-foreground border border-border hover:border-border-strong transition-colors"
            >
              Tout refuser
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="h-10 px-4 rounded-md text-sm font-medium text-foreground border border-border hover:border-border-strong transition-colors"
            >
              Tout accepter
            </button>
          </div>
          <button
            type="button"
            onClick={() => savePreferences(local)}
            className="h-10 px-6 rounded-md text-sm font-medium bg-accent text-background hover:bg-accent-hover transition-colors"
          >
            Enregistrer mes choix
          </button>
        </footer>
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, disabled, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-6 w-10 flex-shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-accent" : "bg-surface-elevated border border-border",
        disabled && "cursor-not-allowed opacity-70"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
          checked ? "translate-x-5" : "translate-x-1"
        )}
      />
    </button>
  );
}
