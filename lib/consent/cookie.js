/**
 * Lecture/écriture du cookie `hid-consent` côté CLIENT.
 *
 * Format encodé : base64(JSON({ v, ts, c }))
 *  - v  : version du schéma (CONSENT_VERSION)
 *  - ts : timestamp ISO 8601 de l'enregistrement
 *  - c  : { essential, analytics, marketing } — chaque clé est un booléen
 *
 * Si la version stockée ne correspond pas à CONSENT_VERSION, on traite le
 * cookie comme inexistant pour forcer un nouveau consentement.
 */

import {
  CONSENT_COOKIE,
  CONSENT_VERSION,
  CONSENT_MAX_AGE_SECONDS,
  DEFAULT_CONSENT,
} from "./categories";

function safeAtob(b64) {
  try {
    if (typeof atob === "function") return atob(b64);
    // Fallback Node-side (jamais déclenché côté client)
    return Buffer.from(b64, "base64").toString("utf8");
  } catch {
    return null;
  }
}

function safeBtoa(s) {
  if (typeof btoa === "function") return btoa(s);
  return Buffer.from(s, "utf8").toString("base64");
}

/**
 * Parse un raw cookie value (string base64) en objet consent normalisé.
 * Retourne `null` si invalide / version obsolète.
 */
export function parseConsent(raw) {
  if (!raw) return null;
  const decoded = safeAtob(raw);
  if (!decoded) return null;
  let parsed;
  try { parsed = JSON.parse(decoded); }
  catch { return null; }
  if (!parsed || parsed.v !== CONSENT_VERSION || !parsed.c) return null;
  const c = parsed.c;
  return {
    version: parsed.v,
    timestamp: parsed.ts || null,
    categories: {
      essential: true, // toujours forcé à true (cat. verrouillée)
      analytics: Boolean(c.analytics),
      marketing: Boolean(c.marketing),
    },
  };
}

/** Sérialise un objet `categories` en string base64 prête pour cookie. */
export function serializeConsent(categories) {
  const payload = {
    v: CONSENT_VERSION,
    ts: new Date().toISOString(),
    c: {
      essential: true,
      analytics: Boolean(categories?.analytics),
      marketing: Boolean(categories?.marketing),
    },
  };
  return safeBtoa(JSON.stringify(payload));
}

/** Lit le cookie côté client. Retourne null si absent ou invalide. */
export function readConsentClient() {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${CONSENT_COOKIE}=`));
  if (!match) return null;
  return parseConsent(decodeURIComponent(match.slice(CONSENT_COOKIE.length + 1)));
}

/**
 * Écrit le cookie côté client (durée 13 mois, SameSite=Lax).
 * En prod (HTTPS), ajoute `Secure` automatiquement.
 */
export function writeConsentClient(categories) {
  if (typeof document === "undefined") return;
  const value = serializeConsent(categories);
  const secure =
    typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${CONSENT_COOKIE}=${encodeURIComponent(value)}` +
    `; Max-Age=${CONSENT_MAX_AGE_SECONDS}` +
    `; Path=/; SameSite=Lax${secure}`;
}

/** Réinitialise (efface) le cookie côté client. */
export function clearConsentClient() {
  if (typeof document === "undefined") return;
  document.cookie = `${CONSENT_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
}

export { DEFAULT_CONSENT };
