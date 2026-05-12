"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  readConsentClient,
  writeConsentClient,
  clearConsentClient,
  DEFAULT_CONSENT,
} from "@/lib/consent/cookie";
import { acceptAll as acceptAllCats, essentialOnly as essentialOnlyCats } from "@/lib/consent/categories";

const ConsentContext = createContext(null);

/**
 * Provider du consentement cookies.
 *
 * Props :
 *  - initial : objet `consent` lu côté serveur (via getConsentServer) ou null.
 *              Évite le flash du banner au premier render.
 */
export function ConsentProvider({ initial = null, children }) {
  const [consent, setConsent] = useState(initial);
  const [openPrefs, setOpenPrefs] = useState(false);

  // Synchronisation client → si initial=null on retente une lecture après hydratation
  // (utile si le cookie a été posé par un autre onglet).
  useEffect(() => {
    if (consent) return;
    const client = readConsentClient();
    if (client) setConsent(client);
  }, [consent]);

  const acceptAll = useCallback(() => {
    const cats = acceptAllCats();
    writeConsentClient(cats);
    setConsent({ version: 1, timestamp: new Date().toISOString(), categories: cats });
    setOpenPrefs(false);
  }, []);

  const refuseNonEssential = useCallback(() => {
    const cats = essentialOnlyCats();
    writeConsentClient(cats);
    setConsent({ version: 1, timestamp: new Date().toISOString(), categories: cats });
    setOpenPrefs(false);
  }, []);

  const savePreferences = useCallback((categories) => {
    const cats = { ...DEFAULT_CONSENT, ...categories, essential: true };
    writeConsentClient(cats);
    setConsent({ version: 1, timestamp: new Date().toISOString(), categories: cats });
    setOpenPrefs(false);
  }, []);

  const reset = useCallback(() => {
    clearConsentClient();
    setConsent(null);
  }, []);

  const value = useMemo(
    () => ({
      consent,                        // objet ou null si pas encore choisi
      isResolved: consent !== null,   // true si l'utilisateur a fait un choix
      categories: consent?.categories || DEFAULT_CONSENT,
      acceptAll,
      refuseNonEssential,
      savePreferences,
      reset,
      openPrefs,
      setOpenPrefs,
    }),
    [consent, openPrefs, acceptAll, refuseNonEssential, savePreferences, reset]
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    // Permet aux composants enfants de tolérer l'absence du provider (ex. tests).
    return {
      consent: null,
      isResolved: false,
      categories: DEFAULT_CONSENT,
      acceptAll: () => {},
      refuseNonEssential: () => {},
      savePreferences: () => {},
      reset: () => {},
      openPrefs: false,
      setOpenPrefs: () => {},
    };
  }
  return ctx;
}
