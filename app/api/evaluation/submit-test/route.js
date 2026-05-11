import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { scoreTest } from "@/lib/evaluation/scoring";
import { getTestBySlug } from "@/lib/evaluation/tests";

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
  if (testRow.status === "completed") {
    return NextResponse.json(
      { error: "Test already completed" },
      { status: 409 }
    );
  }

  // Scoring
  let scoreData;
  try {
    scoreData = scoreTest(test_slug, raw_answers || {});
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Scoring failed" },
      { status: 500 }
    );
  }

  // Mise à jour de la ligne test_results
  const { error: updErr } = await service
    .from("test_results")
    .update({
      status: "completed",
      raw_answers: raw_answers || {},
      score: scoreData.score,
      precision_rate: scoreData.precision_rate,
      time_spent_seconds: Math.max(0, Number(time_spent_seconds) || 0),
      cases_processed: scoreData.cases_processed,
      completed_at: new Date().toISOString(),
      started_at: testRow.started_at ?? new Date().toISOString(),
    })
    .eq("id", testRow.id);

  if (updErr) {
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  // Déblocage du suivant si score suffisant + maj de l'index courant + statut session
  const passed = scoreData.score >= testDef.passing_score;
  const isLastTest = testDef.order === 7;
  let unlockedNext = false;

  if (passed && !isLastTest) {
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

  // Maj session
  const sessionUpdate = {};
  if (passed) {
    sessionUpdate.current_test_index = Math.min(7, testDef.order + 1);
  }
  if (passed && isLastTest) {
    sessionUpdate.status = "completed";
    sessionUpdate.completed_at = new Date().toISOString();
  }
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
    },
    tests,
  });
}
