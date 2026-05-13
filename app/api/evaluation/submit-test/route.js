import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { scoreTest, applyScoringPolicy } from "@/lib/evaluation/scoring";
import {
  getTestBySlug,
  buildEngineerTestRows,
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
  // présents dans test_results (pas encore d'upgrade engineer).
  const onlySpecialist =
    allTests &&
    allTests.length === 4 &&
    allTests.every((t) => t.test_category === "specialist");
  let unlockedNext = false;
  let upgradedToEngineer = false;

  // 1. Cas spécial : specialist vient de finir son 4e test ET il est "specialist only".
  //    Si moyenne ≥ SPECIALIST_UPGRADE_THRESHOLD (95), on AJOUTE les 4 lignes engineer.
  if (passed && isLastSpecialistTest && onlySpecialist) {
    const completedScores = (allTests || [])
      .map((t) => (t.id === testRow.id ? scoreData.score : t.score))
      .filter((s) => typeof s === "number");
    const avgScore =
      completedScores.length > 0
        ? completedScores.reduce((a, b) => a + b, 0) / completedScores.length
        : 0;
    if (avgScore >= SPECIALIST_UPGRADE_THRESHOLD) {
      const engineerRows = buildEngineerTestRows(session.id);
      await service.from("test_results").insert(engineerRows);
      upgradedToEngineer = true;
      unlockedNext = true; // le 1er engineer test (order 4) devient available
    }
  }
  // 2. Sinon, débloquer le test suivant si présent dans test_results
  else if (passed) {
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

  // 3. Statut final de la session :
  //    - 4 tests specialist completed sans upgrade → session 'completed'
  //    - 8 tests engineer completed → session 'completed'
  const totalRows = (allTests?.length || 0) + (upgradedToEngineer ? 4 : 0);
  const completedNow =
    (allTests || []).filter((t) => t.id === testRow.id || t.status === "completed").length;
  const sessionUpdate = {};
  if (passed) {
    sessionUpdate.current_test_index = Math.min(7, testDef.order + 1);
  }
  const isFinalRun =
    (isLastSpecialistTest && onlySpecialist && !upgradedToEngineer && passed) ||
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
      upgradedToEngineer,
    },
    tests,
  });
}
