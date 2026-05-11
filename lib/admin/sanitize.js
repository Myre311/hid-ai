/**
 * Sanitise une chaîne de recherche utilisateur avant interpolation
 * dans un filtre PostgREST `.or(...)`. Supprime parenthèses, virgules,
 * guillemets, points-virgules, backslashes qui peuvent casser le parsing
 * ou être exploités.
 */
export function sanitizeSearchQuery(input) {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .slice(0, 100)
    .replace(/[(),'"\\;]/g, "")
    .replace(/\s+/g, " ");
}
