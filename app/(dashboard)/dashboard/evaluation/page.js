import { redirect } from "next/navigation";
import { EvaluationRoadmap } from "@/components/dashboard/EvaluationRoadmap";
import { FinalizeButton } from "@/components/dashboard/FinalizeButton";
// UpgradeEngineerButton retiré du flow (2026-06) : la bascule specialist→engineer
// n'est plus propose. Le composant existe encore en cas de réactivation future.
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { aiNativeMaxScore } from "@/lib/evaluation/aiNativeScore";

// Seuil purement informatif pour afficher "Score exceptionnel" à un specialist
// qui dépasse cette moyenne. Aucun upgrade engineer n'est proposé.
const EXCEPTIONAL_SCORE_THRESHOLD = 95;

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

  // Indicateur "score exceptionnel" pour un specialist qui dépasse 95 de moyenne
  // (purement informatif — aucun upgrade engineer n'est proposé depuis 2026-06).
  const onlySpecialist =
    tests.length === 4 && tests.every((t) => t.test_category === "specialist");
  const specialistAvg =
    onlySpecialist && completedCount === 4
      ? tests.reduce((sum, t) => sum + (t.score || 0), 0) / 4
      : 0;
  const exceptionalSpecialist =
    onlySpecialist && completedCount === 4 && specialistAvg >= EXCEPTIONAL_SCORE_THRESHOLD;

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

      {/* Badge "Score exceptionnel" pour un specialist ≥ 95 (informatif, pas d'upgrade) */}
      {exceptionalSpecialist && (
        <div className="rounded-lg border border-accent/40 bg-gradient-to-br from-accent/10 to-accent/5 p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🏆</span>
            <h2 className="text-sm font-medium text-foreground">
              Score exceptionnel — Top 5 % des AI Specialists
            </h2>
          </div>
          <p className="text-xs text-foreground/65 max-w-2xl">
            Moyenne sur vos 4 tests : <strong className="text-accent">{specialistAvg.toFixed(1)} / 100</strong>.
            Ce score est mis en avant auprès des entreprises clientes lors de votre attribution
            de missions.
          </p>
        </div>
      )}

      {/* CTA finalisation classique (toujours affiché quand tous tests done) */}
      {(allDone || activated) && (
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
