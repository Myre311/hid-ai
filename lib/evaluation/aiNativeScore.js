/**
 * Score AI-Native global sur 1000.
 *
 * Pondération :
 *  - Specialist (tests 0-3) : 50% (5 × moyenne)
 *  - Engineer (tests 4-7)   : 40% (4 × moyenne)
 *  - Bonus persévérance     : jusqu'à 10% (100 points)
 *      • +50 si tous les tests > 70/100
 *      • +30 si temps moyen par test > 30 min
 *      • +20 si tous les tests complétés sans abandon
 */
export function calculateAiNativeScore(testResults) {
  if (!Array.isArray(testResults) || testResults.length === 0) return 0;

  const specialist = testResults.filter((t) => t.test_category === "specialist");
  const engineer = testResults.filter((t) => t.test_category === "engineer");

  const avg = (rows) =>
    rows.length > 0
      ? rows.reduce((s, t) => s + (t.score ?? 0), 0) / rows.length
      : 0;

  const specialistAvg = avg(specialist); // 0..100
  const engineerAvg = avg(engineer); // 0..100

  // base : 5×specAvg + 4×engAvg → max 5*100 + 4*100 = 900
  const baseScore = specialistAvg * 5 + engineerAvg * 4;

  // Bonus
  let bonus = 0;
  if (testResults.every((t) => (t.score ?? 0) > 70)) bonus += 50;
  const totalSec = testResults.reduce(
    (s, t) => s + (t.time_spent_seconds ?? 0),
    0
  );
  const avgMin = testResults.length > 0 ? totalSec / testResults.length / 60 : 0;
  if (avgMin > 30) bonus += 30;
  if (testResults.every((t) => t.status === "completed")) bonus += 20;

  return Math.max(0, Math.min(1000, Math.round(baseScore + bonus)));
}

/**
 * Niveau associé au score.
 */
export function aiNativeLevel(score) {
  if (score <= 400) return { key: "foundation", label: "Niveau Foundation" };
  if (score <= 600) return { key: "practitioner", label: "Niveau Practitioner" };
  if (score <= 800) return { key: "expert", label: "Niveau Expert" };
  return { key: "elite", label: "Niveau Elite" };
}

/**
 * Détails du score pour affichage breakdown.
 */
export function aiNativeBreakdown(testResults) {
  const specialist = testResults.filter((t) => t.test_category === "specialist");
  const engineer = testResults.filter((t) => t.test_category === "engineer");
  const avg = (rows) =>
    rows.length > 0
      ? rows.reduce((s, t) => s + (t.score ?? 0), 0) / rows.length
      : 0;
  const specialistAvg = avg(specialist);
  const engineerAvg = avg(engineer);

  let bonus = 0;
  if (testResults.every((t) => (t.score ?? 0) > 70)) bonus += 50;
  const totalSec = testResults.reduce(
    (s, t) => s + (t.time_spent_seconds ?? 0),
    0
  );
  const avgMin = testResults.length > 0 ? totalSec / testResults.length / 60 : 0;
  if (avgMin > 30) bonus += 30;
  if (testResults.every((t) => t.status === "completed")) bonus += 20;

  return {
    specialist_pts: Math.round(specialistAvg * 5),  // sur 500
    engineer_pts: Math.round(engineerAvg * 4),       // sur 400
    bonus_pts: bonus,                                // sur 100
    total: calculateAiNativeScore(testResults),
  };
}
