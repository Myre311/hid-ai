import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  buildEngineerTestRows,
  SPECIALIST_UPGRADE_THRESHOLD,
} from "@/lib/evaluation/tests";

/**
 * POST /api/evaluation/upgrade-engineer
 *
 * ⚠️ FONCTIONNALITÉ DÉSACTIVÉE (2026-06).
 *
 * Décision produit : un AI Specialist ne peut plus basculer vers AI Engineer
 * via la plateforme. Les 2 métiers restent distincts, choix fait à l'inscription.
 * La route retourne désormais 410 Gone — le code conserve la logique d'origine
 * en dessous au cas où on rouvrirait cette fonctionnalité plus tard.
 *
 * Logique historique conservée pour référence (ne s'exécute plus) :
 *  - L'utilisateur a une session active
 *  - La session contient exactement 4 lignes test_results, toutes specialist + completed
 *  - La moyenne des 4 scores ≥ SPECIALIST_UPGRADE_THRESHOLD (95)
 *  - INSERT les 4 lignes test_results engineer (nlp-finetuning, vision-edge, mlops, rag)
 *  - Remet la session en 'in_progress', current_test_index = 4
 */
export async function POST() {
  // Désactivation : refuse l'upgrade pour tous les talents.
  return NextResponse.json(
    {
      error: "feature_disabled",
      message:
        "La bascule AI Specialist vers AI Engineer n'est plus disponible. Votre profil reste AI Specialist.",
    },
    { status: 410 }
  );

  // ⚠️ Code mort sous ce return — gardé volontairement pour ré-activation future.
  // eslint-disable-next-line no-unreachable
  const userClient = createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const service = createServiceClient();

  const { data: session } = await service
    .from("evaluation_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!session) {
    return NextResponse.json({ error: "No session" }, { status: 404 });
  }

  const { data: tests } = await service
    .from("test_results")
    .select("*")
    .eq("session_id", session.id)
    .order("test_order");

  const onlySpecialist =
    tests && tests.length === 4 && tests.every((t) => t.test_category === "specialist");

  if (!onlySpecialist) {
    return NextResponse.json(
      { error: "L'upgrade n'est disponible que pour les candidats Specialist." },
      { status: 400 }
    );
  }

  const allCompleted = tests.every((t) => t.status === "completed");
  if (!allCompleted) {
    return NextResponse.json(
      { error: "Vous devez terminer les 4 tests Specialist avant l'upgrade." },
      { status: 400 }
    );
  }

  const scores = tests.map((t) => t.score).filter((s) => typeof s === "number");
  const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

  if (avg < SPECIALIST_UPGRADE_THRESHOLD) {
    return NextResponse.json(
      {
        error: `Moyenne actuelle ${avg.toFixed(1)}/100 — minimum ${SPECIALIST_UPGRADE_THRESHOLD} requis pour passer Ingénieur.`,
      },
      { status: 403 }
    );
  }

  // Insert engineer rows + reset session to in_progress
  const engineerRows = buildEngineerTestRows(session.id);
  const { error: insertErr } = await service.from("test_results").insert(engineerRows);
  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  await service
    .from("evaluation_sessions")
    .update({
      status: "in_progress",
      current_test_index: 4,
      completed_at: null,
    })
    .eq("id", session.id);

  const { data: updatedTests } = await service
    .from("test_results")
    .select("*")
    .eq("session_id", session.id)
    .order("test_order");

  return NextResponse.json({
    ok: true,
    avg_specialist: Number(avg.toFixed(1)),
    tests: updatedTests,
  });
}
