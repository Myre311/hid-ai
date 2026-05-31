/**
 * Score AI-Native — v4 — note unifiée sur /100 (cap 96).
 *
 * Pourquoi /100 ?
 *   Pour comparer un AI Specialist (4 tests max 400) et un AI Engineer
 *   (4 tests max 400) ou un Dual (8 tests max 800) sur la même échelle.
 *
 * Pourquoi cap à 96 ?
 *   Le 100 doit rester inatteignable par design — pas de score "parfait".
 *
 * Composantes :
 *   - COMPÉTENCE (85%)
 *       = (somme tests / max_atteignable_brut) × 100
 *       max_atteignable_brut : 400 (Spec seul), 400 (Eng seul), 800 (Dual)
 *
 *   - TEMPS (15%)
 *       Score sur le rythme moyen par test :
 *         < 5 min   → 0    (suspect, bâclage)
 *         5-15 min  → 0 → 60  (linéaire)
 *         15-25 min → 60 → 100 (zone idéale)
 *         25-45 min → 100 → 80 (un peu lent)
 *         > 45 min  → 80      (perte d'attention)
 *
 *   note_brute = (compétence × 0.85) + (temps × 0.15)
 *   NOTE FINALE = MIN(96, round(note_brute))
 */

const SCORE_CAP = 96;
const WEIGHT_COMPETENCE = 0.85;
const WEIGHT_TIME = 0.15;

/**
 * Score final affiché — sur /100 cappé à 96.
 */
export function calculateAiNativeScore(testResults) {
  if (!Array.isArray(testResults) || testResults.length === 0) return 0;
  const competence = competenceScore(testResults);
  const time = timeScore(testResults);
  const raw = competence * WEIGHT_COMPETENCE + time * WEIGHT_TIME;
  return Math.max(0, Math.min(SCORE_CAP, Math.round(raw)));
}

/**
 * Composante compétence (0-100) — somme brute des tests rapportée au max.
 */
export function competenceScore(testResults) {
  if (!Array.isArray(testResults) || testResults.length === 0) return 0;
  const sum = (cat) =>
    testResults.filter((t) => t.test_category === cat).reduce((s, t) => s + (t.score ?? 0), 0);
  const raw = sum("specialist") + sum("engineer");
  const max = maxBrutScore(testResults);
  if (max === 0) return 0;
  return Math.round((raw / max) * 100);
}

/**
 * Composante temps (0-100) — note sur le rythme moyen par test.
 */
export function timeScore(testResults) {
  if (!Array.isArray(testResults) || testResults.length === 0) return 0;
  const totalSec = testResults.reduce((s, t) => s + (t.time_spent_seconds ?? 0), 0);
  const avgMin = totalSec / testResults.length / 60;

  if (avgMin < 5) return 0;
  if (avgMin <= 15) {
    // 5→15 min : 0 → 60 (linéaire)
    return Math.round(((avgMin - 5) / 10) * 60);
  }
  if (avgMin <= 25) {
    // 15→25 min : 60 → 100 (linéaire)
    return Math.round(60 + ((avgMin - 15) / 10) * 40);
  }
  if (avgMin <= 45) {
    // 25→45 min : 100 → 80 (linéaire descendante)
    return Math.round(100 - ((avgMin - 25) / 20) * 20);
  }
  return 80; // > 45 min
}

/**
 * Max BRUT (avant normalisation) — uniquement pour la composante compétence.
 */
function maxBrutScore(testResults) {
  const hasS = testResults.some((t) => t.test_category === "specialist");
  const hasE = testResults.some((t) => t.test_category === "engineer");
  if (hasS && hasE) return 800;
  if (hasS || hasE) return 400;
  return 800;
}

/**
 * Max final affiché — toujours 100 (mais le score est cappé à 96).
 * Conservé pour compatibilité avec les composants existants.
 */
export function aiNativeMaxScore(_testResults) {
  return 100;
}

/**
 * Variante par metier (avant que les tests soient passés).
 */
export function aiNativeMaxScoreByMetier(_metier) {
  return 100;
}

/**
 * Niveau atteint — sur l'échelle /100.
 *
 *   < 30 → Foundation
 *   < 60 → Practitioner
 *   < 90 → Expert
 *   ≥ 90 → Elite
 *
 * Le score étant cappé à 96, "Elite" est atteignable mais 100 ne l'est pas.
 */
export function aiNativeLevel(score, _maxScore = 100) {
  if (score < 30) return { key: "foundation", label: "Niveau Foundation" };
  if (score < 60) return { key: "practitioner", label: "Niveau Practitioner" };
  if (score < 90) return { key: "expert", label: "Niveau Expert" };
  return { key: "elite", label: "Niveau Elite" };
}

/**
 * Détail des composantes pour affichage carte / email.
 */
export function aiNativeBreakdown(testResults) {
  return {
    competence_pts: competenceScore(testResults), // sur 100
    time_pts: timeScore(testResults),             // sur 100
    total: calculateAiNativeScore(testResults),   // sur 100 (cap 96)
  };
}

/**
 * Label metier humain.
 */
export function metierLabel(metier) {
  if (metier === "engineer") return "AI Engineer";
  if (metier === "specialist") return "AI Specialist";
  return "AI Specialist + Engineer";
}
