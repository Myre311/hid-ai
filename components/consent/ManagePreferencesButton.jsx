"use client";

import { useConsent } from "./ConsentContext";

/**
 * Bouton inline qui ré-ouvre la modale de préférences cookies.
 * Utilisé sur /privacy et /gdpr pour que l'utilisateur déjà consentant
 * puisse modifier ses choix.
 */
export function ManagePreferencesButton({ children = "Gérer mes préférences cookies" }) {
  const { setOpenPrefs } = useConsent();
  return (
    <button
      type="button"
      onClick={() => setOpenPrefs(true)}
      className="inline-flex items-center gap-2 h-10 px-4 rounded-md text-sm font-medium border border-accent text-accent hover:bg-accent hover:text-background transition-colors"
    >
      {children}
    </button>
  );
}
