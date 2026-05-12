/**
 * Lecture du cookie `hid-consent` côté SERVEUR (Server Components / Route Handlers).
 * Permet de :
 *  - passer l'état initial à <ConsentProvider> pour éviter le flash de banner au SSR
 *  - rendre conditionnellement des scripts tiers (analytics) selon le consentement
 */

import { cookies } from "next/headers";
import { CONSENT_COOKIE } from "./categories";
import { parseConsent } from "./cookie";

export function getConsentServer() {
  try {
    const raw = cookies().get(CONSENT_COOKIE)?.value;
    return parseConsent(raw);
  } catch {
    return null;
  }
}
