/**
 * Catégories de cookies — conformes à la classification CNIL.
 *
 * essential  : strictement nécessaires (auth, session, sécurité). Toujours `true`.
 * analytics  : mesure d'audience (Plausible, Google Analytics…). Opt-in.
 * marketing  : tracking publicitaire, A/B testing, personnalisation. Opt-in.
 *
 * Le schéma du cookie est versionné (`v`) — si on change la liste des
 * catégories, on incrémente `CONSENT_VERSION` et le banner se ré-affiche.
 */

export const CONSENT_VERSION = 1;
export const CONSENT_COOKIE = "hid-consent";
// 13 mois — recommandation CNIL pour la durée maximale d'un cookie de consentement.
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 30 * 13;

export const CATEGORIES = [
  {
    key: "essential",
    title: "Strictement nécessaires",
    description:
      "Indispensables au fonctionnement du site : session d'authentification, sécurité, préférence de thème. Sans ces cookies, vous ne pouvez pas vous connecter.",
    locked: true,
    examples: ["sb-…-auth-token (Supabase)", "hid-consent"],
  },
  {
    key: "analytics",
    title: "Mesure d'audience",
    description:
      "Nous aident à comprendre comment les visiteurs interagissent avec le site, pour améliorer l'expérience. Données anonymisées et agrégées.",
    locked: false,
    examples: ["non utilisé pour l'instant"],
  },
  {
    key: "marketing",
    title: "Marketing et personnalisation",
    description:
      "Permettent de mesurer l'efficacité de nos campagnes et de personnaliser le contenu. HID AI n'utilise pas de cookies publicitaires tiers à ce jour.",
    locked: false,
    examples: ["non utilisé pour l'instant"],
  },
];

export const DEFAULT_CONSENT = {
  essential: true,
  analytics: false,
  marketing: false,
};

export function acceptAll() {
  return { essential: true, analytics: true, marketing: true };
}

export function essentialOnly() {
  return { ...DEFAULT_CONSENT };
}
