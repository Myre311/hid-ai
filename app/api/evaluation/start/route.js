import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { buildInitialTestRows } from "@/lib/evaluation/tests";

/**
 * POST /api/evaluation/start
 * Crée (ou retourne si existante) la session d'évaluation du user courant
 * + les 8 lignes initiales test_results (1 available, 7 locked).
 *
 * Auth requise (cookie Supabase). Pas de body.
 */
export async function POST() {
  // Récupère l'utilisateur connecté via le cookie
  const userClient = createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const service = createServiceClient();

  // Cherche une session existante non terminée
  const { data: existing } = await service
    .from("evaluation_sessions")
    .select("id, status, current_test_index")
    .eq("user_id", user.id)
    .in("status", ["pending", "in_progress", "completed"])
    .maybeSingle();

  if (existing) {
    const { data: tests } = await service
      .from("test_results")
      .select("*")
      .eq("session_id", existing.id)
      .order("test_order");
    return NextResponse.json({ session: existing, tests }, { status: 200 });
  }

  // Lie à l'inscription_talent (REQUISE depuis le fix 2026-06).
  // Auparavant : fallback `metier = "engineer"` → créait 8 tests pour des talents
  // qui ne s'étaient pas inscrits, ou qui s'étaient inscrits specialist.
  // Désormais : on REFUSE de créer une session si aucune inscription n'existe.
  let inscriptionTalentId = null;
  let metier = null;
  if (user.email) {
    // ilike sans wildcard = exact match case-insensitive — Supabase lowercase
    // les emails auth alors qu'inscriptions_talents.email garde la casse saisie.
    const { data: insc } = await service
      .from("inscriptions_talents")
      .select("id, metier")
      .ilike("email", user.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (insc) {
      inscriptionTalentId = insc.id;
      metier = insc.metier === "engineer" ? "engineer" : "specialist";
    }
  }
  // Fallback supplémentaire : recherche par téléphone si pas trouvé par email
  if (!inscriptionTalentId && user.phone) {
    const phonePlus = "+" + user.phone.replace(/^\+/, "");
    const phoneNoPlus = user.phone.replace(/^\+/, "");
    const { data: insc } = await service
      .from("inscriptions_talents")
      .select("id, metier")
      .or(`telephone.eq.${phonePlus},telephone.eq.${phoneNoPlus}`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (insc) {
      inscriptionTalentId = insc.id;
      metier = insc.metier === "engineer" ? "engineer" : "specialist";
    }
  }

  // Garde-fou critique : refuse si aucune inscription trouvée. Force les
  // talents à compléter leur inscription AVANT d'accéder à l'évaluation,
  // pour éviter les sessions orphelines / mauvais métier (audit 2026-06).
  if (!inscriptionTalentId || !metier) {
    return NextResponse.json(
      {
        error: "inscription_required",
        message:
          "Aucune inscription trouvée pour ce compte. Complétez votre inscription avant de démarrer l'évaluation.",
      },
      { status: 400 }
    );
  }

  // Crée la session
  const { data: session, error: sErr } = await service
    .from("evaluation_sessions")
    .insert({
      user_id: user.id,
      inscription_talent_id: inscriptionTalentId,
      status: "in_progress",
      current_test_index: 0,
    })
    .select()
    .single();

  if (sErr) {
    return NextResponse.json(
      { error: sErr.message || "Failed to create session" },
      { status: 500 }
    );
  }

  // Crée les lignes test_results adaptées au metier (specialist=4, engineer=8)
  const rows = buildInitialTestRows(session.id, metier);
  const { data: tests, error: tErr } = await service
    .from("test_results")
    .insert(rows)
    .select();

  if (tErr) {
    return NextResponse.json(
      { error: tErr.message || "Failed to create test rows" },
      { status: 500 }
    );
  }

  return NextResponse.json({ session, tests }, { status: 201 });
}
