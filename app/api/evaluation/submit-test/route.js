import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { scoreTest, applyScoringPolicy } from "@/lib/evaluation/scoring";
import {
  getTestBySlug,
  SPECIALIST_UPGRADE_THRESHOLD,
} from "@/lib/evaluation/tests";

/**
 * POST /api/evaluation/submit-test
 * Body : { test_slug, raw_answers, time_spent_seconds }
 *
 * 1. Vérifie auth + ownership de la session.
 * 2. Vérifie que le test est `available` ou `in_progress`.
 * 3. Calcule le score via lib/evaluation/scoring.
 * 4. Marque le test `completed`. Si score >= passing_score, débloque
 *    le test suivant (locked → available) et avance current_test_index.
 * 5. Si c'est le dernier test (order 7) ET passé : session.status = completed.
 *
 * Retourne le résultat du test scoré + l'état mis à jour des tests.
 */
export async function POST(request) {
  const userClient = createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { test_slug, raw_answers, time_spent_seconds } = body || {};
  if (!test_slug || typeof test_slug !== "string") {
    return NextResponse.json({ error: "Missing test_slug" }, { status: 400 });
  }
  const testDef = getTestBySlug(test_slug);
  if (!testDef) {
    return NextResponse.json({ error: "Unknown test slug" }, { status: 400 });
  }

  const service = createServiceClient();

  // Récupère la session active du user
  const { data: session } = await service
    .from("evaluation_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!session) {
    return NextResponse.json({ error: "No active session" }, { status: 404 });
  }

  // Récupère la ligne test_results correspondante
  const { data: testRow } = await service
    .from("test_results")
    .select("*")
    .eq("session_id", session.id)
    .eq("test_slug", test_slug)
    .maybeSingle();

  if (!testRow) {
    return NextResponse.json({ error: "Test row not found" }, { status: 404 });
  }
  if (testRow.status === "locked") {
    return NextResponse.json(
      { error: "Test is locked. Complete previous tests first." },
      { status: 403 }
    );
  }
  // Si le test a déjà été complété :
  //  - score ≥ passing_score  → on bloque (test validé, pas de re-passage)
  //  - score < passing_score  → on autorise le retry (réécrit la ligne)
  if (testRow.status === "completed") {
    if ((testRow.score ?? 0) >= testDef.passing_score) {
      return NextResponse.json(
        { error: "Test already passed — no retry allowed" },
        { status: 409 }
      );
    }
    // sinon on passe : c'est un retry après échec
  }

  // Scoring brut
  let scoreData;
  try {
    scoreData = scoreTest(test_slug, raw_answers || {});
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Scoring failed" },
      { status: 500 }
    );
  }

  // Politique HID AI : facteur temps + cap à 96 (100/100 impossible).
  // Le score envoyé en DB est le score AJUSTÉ.
  const seconds = Math.max(0, Number(time_spent_seconds) || 0);
  const finalScore = applyScoringPolicy(scoreData.score, seconds, testDef.target_minutes);
  scoreData = { ...scoreData, score: finalScore };

  // Mise à jour de la ligne test_results
  const { error: updErr } = await service
    .from("test_results")
    .update({
      status: "completed",
      raw_answers: raw_answers || {},
      score: scoreData.score,
      precision_rate: scoreData.precision_rate,
      time_spent_seconds: seconds,
      cases_processed: scoreData.cases_processed,
      completed_at: new Date().toISOString(),
      started_at: testRow.started_at ?? new Date().toISOString(),
    })
    .eq("id", testRow.id);

  if (updErr) {
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  // Récupère TOUS les tests de la session pour décider de la suite.
  const { data: allTests } = await service
    .from("test_results")
    .select("id, test_slug, test_category, test_order, status, score")
    .eq("session_id", session.id)
    .order("test_order");

  const passed = scoreData.score >= testDef.passing_score;
  const isFinalEngineerTest = testDef.order === 7;
  const isLastSpecialistTest = testDef.order === 3;
  // Le candidat est "specialist only" si SEULS les 4 tests specialist sont
  // présents dans test_results (pas encore de bascule vers engineer).
  const onlySpecialist =
    allTests &&
    allTests.length === 4 &&
    allTests.every((t) => t.test_category === "specialist");

  let unlockedNext = false;
  let eligibleForEngineer = false; // ← le candidat CHOISIT ensuite via /api/evaluation/upgrade-engineer

  // Débloque le test suivant SAUF si on est sur le 4e specialist (decision point)
  if (passed && !(isLastSpecialistTest && onlySpecialist)) {
    const { data: nextRow } = await service
      .from("test_results")
      .select("id, status")
      .eq("session_id", session.id)
      .eq("test_order", testDef.order + 1)
      .maybeSingle();
    if (nextRow && nextRow.status === "locked") {
      await service
        .from("test_results")
        .update({ status: "available" })
        .eq("id", nextRow.id);
      unlockedNext = true;
    }
  }

  // Calcule la moyenne specialist après ce submit pour signaler l'éligibilité.
  if (passed && isLastSpecialistTest && onlySpecialist) {
    const scores = (allTests || [])
      .map((t) => (t.id === testRow.id ? scoreData.score : t.score))
      .filter((s) => typeof s === "number");
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    eligibleForEngineer = avg >= SPECIALIST_UPGRADE_THRESHOLD;
  }

  // Statut final session :
  //  - 4 tests specialist completed (avec ou sans éligibilité engineer) → 'completed'
  //  - 8 tests engineer completed → 'completed'
  const sessionUpdate = {};
  if (passed) {
    sessionUpdate.current_test_index = Math.min(7, testDef.order + 1);
  }
  const isFinalRun =
    (isLastSpecialistTest && onlySpecialist && passed) ||
    (isFinalEngineerTest && passed);
  if (isFinalRun) {
    sessionUpdate.status = "completed";
    sessionUpdate.completed_at = new Date().toISOString();
  }
  const isLastTest = isFinalRun;
  if (Object.keys(sessionUpdate).length > 0) {
    await service
      .from("evaluation_sessions")
      .update(sessionUpdate)
      .eq("id", session.id);
  }

  // Retourne la session + tests à jour
  const { data: tests } = await service
    .from("test_results")
    .select("*")
    .eq("session_id", session.id)
    .order("test_order");

  return NextResponse.json({
    result: {
      score: scoreData.score,
      precision_rate: scoreData.precision_rate,
      cases_processed: scoreData.cases_processed,
      passed,
      passing_score: testDef.passing_score,
      unlockedNext,
      isLastTest,
      eligibleForEngineer,
    },
    tests,
  });
}
