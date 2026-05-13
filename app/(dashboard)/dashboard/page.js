import { redirect } from "next/navigation";
import {
  FileCheck2,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { buildInitialTestRows } from "@/lib/evaluation/tests";
import { EvaluationRoadmap } from "@/components/dashboard/EvaluationRoadmap";
import { AiNativeScoreCard } from "@/components/dashboard/AiNativeScoreCard";
import PageTransition from "@/components/shared/PageTransition";

export const metadata = { title: "Vue d'ensemble · HID AI" };

/**
 * Tableau de bord candidat.
 * Server component : lit la session/inscription + initialise si nécessaire,
 * puis rend la roadmap des 8 tests.
 */
export default async function DashboardHome() {
  const userClient = createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const service = createServiceClient();

  // Note: le redirect admin → /admin est géré au niveau du middleware
  // (cf middleware.js). Ici on suppose qu'on est en présence d'un candidat.

  // Inscription liée (prénom, métier, etc.) — on cherche par email
  // puis fallback par téléphone (l'auth SMS Supabase n'expose pas d'email).
  let inscription = null;
  if (user.email) {
    // ilike sans wildcard = exact match case-insensitive (Supabase lowercase
    // les emails auth, l'inscription garde la casse saisie par le candidat).
    const { data } = await service
      .from("inscriptions_talents")
      .select("id, prenom, nom, email, telephone, metier, doc_type")
      .ilike("email", user.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    inscription = data;
  }
  if (!inscription && user.phone) {
    // L'auth SMS stocke le téléphone en E.164 sans le "+" (ex: "33612345678").
    // L'inscription stocke ce que le candidat a tapé (parfois avec "+", espaces).
    // On essaie les deux variantes.
    const phoneNoPlus = user.phone.replace(/^\+/, "");
    const phonePlus = "+" + phoneNoPlus;
    const { data } = await service
      .from("inscriptions_talents")
      .select("id, prenom, nom, email, telephone, metier, doc_type")
      .or(`telephone.eq.${phonePlus},telephone.eq.${phoneNoPlus}`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    inscription = data;
  }

  // Session active
  let { data: session } = await service
    .from("evaluation_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Auto-création si pas de session
  let tests = [];
  if (!session) {
    const { data: created } = await service
      .from("evaluation_sessions")
      .insert({
        user_id: user.id,
        inscription_talent_id: inscription?.id ?? null,
        status: "in_progress",
        current_test_index: 0,
      })
      .select()
      .single();
    session = created;
    if (session) {
      const metier = inscription?.metier === "specialist" ? "specialist" : "engineer";
      const { data: createdTests } = await service
        .from("test_results")
        .insert(buildInitialTestRows(session.id, metier))
        .select()
        .order("test_order");
      tests = createdTests || [];
    }
  } else {
    const { data: existingTests } = await service
      .from("test_results")
      .select("*")
      .eq("session_id", session.id)
      .order("test_order");
    tests = existingTests || [];
  }

  const totalTests = tests.length || 8;
  const completedCount = tests.filter((t) => t.status === "completed").length;
  const firstName = inscription?.prenom || "Candidat";
  const metierLabel =
    inscription?.metier === "engineer" ? "AI Engineer" : "AI Specialist";
  const activated = session?.status === "activated";
  const allDone = completedCount === totalTests && totalTests > 0;

  return (
    <PageTransition>
    <div className="flex flex-col gap-10 max-w-5xl">
      {/* Hero personnalisé */}
      <section className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
          Espace candidat · {metierLabel}
        </p>
        <h1 className="t-h2-md">Bonjour {firstName},</h1>
        <p className="t-lead max-w-2xl">
          Bienvenue dans votre espace HID AI.
          {activated
            ? " Votre profil est activé — vos missions arrivent bientôt."
            : allDone
            ? " Tous les tests sont validés — finalisez votre profil ci-dessous."
            : ` Complétez les ${totalTests} tests d'évaluation pour activer votre profil.`}
        </p>
      </section>

      {/* Cards de progression */}
      <section className="grid md:grid-cols-3 gap-4">
        <ProgressCard
          Icon={FileCheck2}
          title="Identité"
          status={inscription?.doc_type ? "Vérification en cours" : "Non démarrée"}
          progressLabel={inscription?.doc_type ? "Documents reçus" : "À compléter"}
          progress={inscription?.doc_type ? 0.5 : 0}
        />
        <ProgressCard
          Icon={BookOpen}
          title="Mini-formation"
          status="3 modules à valider"
          progressLabel="Lancée à l'inscription"
          progress={1}
        />
        <ProgressCard
          Icon={ClipboardCheck}
          title="Évaluation"
          status={`${completedCount} / ${totalTests} tests`}
          progressLabel={
            allDone ? "Tous les tests validés" : "Test linéaire en cours"
          }
          progress={totalTests > 0 ? completedCount / totalTests : 0}
        />
      </section>

      {/* Roadmap des 8 tests */}
      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="t-h3">Roadmap d&rsquo;évaluation</h2>
            <p className="text-sm text-foreground/55 mt-1">
              Validez chaque test pour débloquer le suivant.
            </p>
          </div>
          <span className="text-xs text-foreground/40">
            {completedCount} / {totalTests} complétés
          </span>
        </div>
        <EvaluationRoadmap tests={tests} />
      </section>

      {/* Score AI-Native si activé */}
      {activated && session?.ai_native_score != null && (
        <section>
          <AiNativeScoreCard
            score={session.ai_native_score}
            testResults={tests}
          />
        </section>
      )}

      {/* Footer : statut activation */}
      <section className="rounded-lg border border-white/10 bg-surface p-5 text-sm text-foreground/70">
        {activated ? (
          <span className="text-success font-medium">
            ✓ Profil activé · Score AI-Native : {session.ai_native_score} / 1000
          </span>
        ) : allDone ? (
          <span>
            Tous les tests sont validés. Cliquez sur « Finaliser mon profil » dans
            l&rsquo;onglet Évaluation pour activer votre compte.
          </span>
        ) : (
          <span>
            Complétez tous les tests pour activer votre profil. Aucun test ne
            peut être skippé.
          </span>
        )}
      </section>
    </div>
    </PageTransition>
  );
}

function ProgressCard({ Icon, title, status, progressLabel, progress }) {
  const pct = Math.max(0, Math.min(1, Number(progress) || 0));
  return (
    <article className="rounded-lg border border-white/10 bg-surface p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-surface-elevated text-accent">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm text-foreground/85">{status}</span>
        <span className="text-xs text-foreground/40">{progressLabel}</span>
      </div>
      <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
        <span
          className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-500"
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </article>
  );
}
