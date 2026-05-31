import { redirect } from "next/navigation";
import { EvaluationRoadmap } from "@/components/dashboard/EvaluationRoadmap";
import { FinalizeButton } from "@/components/dashboard/FinalizeButton";
import { UpgradeEngineerButton } from "@/components/dashboard/UpgradeEngineerButton";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { SPECIALIST_UPGRADE_THRESHOLD } from "@/lib/evaluation/tests";
import { aiNativeMaxScore } from "@/lib/evaluation/aiNativeScore";

export const metadata = { title: "Évaluation · HID AI" };

export default async function EvaluationIndexPage() {
  const userClient = createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user) redirect("/login");

  const service = createServiceClient();
  const { data: session } = await service
    .from("evaluation_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const tests = session
    ? (
        await service
          .from("test_results")
          .select("*")
          .eq("session_id", session.id)
          .order("test_order")
      ).data || []
    : [];

  const totalTests = tests.length; // 4 (specialist only) ou 8 (engineer / specialist upgradé)
  const completedCount = tests.filter((t) => t.status === "completed").length;
  const allDone = completedCount === totalTests && session?.status === "completed";
  const activated = session?.status === "activated";

  // Éligibilité bascule Ingénieur : 4 tests specialist tous completed, moyenne ≥ 95
  const onlySpecialist =
    tests.length === 4 && tests.every((t) => t.test_category === "specialist");
  const specialistAvg =
    onlySpecialist && completedCount === 4
      ? tests.reduce((sum, t) => sum + (t.score || 0), 0) / 4
      : 0;
  const eligibleEngineerUpgrade =
    onlySpecialist && completedCount === 4 && specialistAvg >= SPECIALIST_UPGRADE_THRESHOLD;

  return (
    <div className="max-w-4xl flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
          Évaluation · {completedCount} / {totalTests} tests
        </p>
        <h1 className="t-h2-md">
          Vos {totalTests} tests d&rsquo;évaluation
        </h1>
        <p className="t-lead max-w-2xl">
          Chaque test débloque le suivant. Vous pouvez les reprendre quand vous
          voulez, votre progression est sauvegardée.
        </p>
      </header>

      <EvaluationRoadmap tests={tests} />

      {/* Choix Specialist : monter en Ingénieur ? */}
      {eligibleEngineerUpgrade && (
        <div className="rounded-lg border border-accent/40 bg-accent/5 p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-medium text-foreground">
              🎓 Vous êtes éligible à la piste Ingénieur
            </h2>
            <p className="text-xs text-foreground/65 mt-1 max-w-2xl">
              Moyenne Specialist : <strong className="text-accent">{specialistAvg.toFixed(1)} / 100</strong>{" "}
              (≥ {SPECIALIST_UPGRADE_THRESHOLD} requis). Vous pouvez choisir de passer{" "}
              <strong>4 tests Ingénieur supplémentaires</strong> (NLP Fine-tuning,
              Vision Edge, MLOps, RAG) pour viser un AI-Native Score plus élevé,
              ou finaliser maintenant comme Specialist.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <UpgradeEngineerButton />
            <FinalizeButton />
          </div>
        </div>
      )}

      {/* CTA finalisation classique (specialist non éligible, ou engineer terminé) */}
      {(allDone || activated) && !eligibleEngineerUpgrade && (
        <div className="rounded-lg border border-accent/40 bg-accent/5 p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex-1">
            <h2 className="text-sm font-medium text-foreground">
              {activated
                ? "Votre profil est activé."
                : "Tous les tests sont validés !"}
            </h2>
            <p className="text-xs text-foreground/55 mt-1">
              {activated
                ? `Score AI-Native : ${session.ai_native_score} / ${aiNativeMaxScore(tests)}`
                : "Cliquez sur Finaliser pour calculer votre score AI-Native et recevoir l'email d'activation."}
            </p>
          </div>
          {!activated && <FinalizeButton />}
        </div>
      )}
    </div>
  );
}
