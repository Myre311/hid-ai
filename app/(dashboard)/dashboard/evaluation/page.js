import { redirect } from "next/navigation";
import { EvaluationRoadmap } from "@/components/dashboard/EvaluationRoadmap";
import { FinalizeButton } from "@/components/dashboard/FinalizeButton";
import { createClient, createServiceClient } from "@/lib/supabase/server";

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

  const completedCount = tests.filter((t) => t.status === "completed").length;
  const allDone = completedCount === 8 && session?.status === "completed";
  const activated = session?.status === "activated";

  return (
    <div className="max-w-4xl flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
          Évaluation · {completedCount} / 8 tests
        </p>
        <h1 className="t-h2-md">Vos 8 tests d&rsquo;évaluation</h1>
        <p className="t-lead max-w-2xl">
          Chaque test débloque le suivant. Vous pouvez les reprendre quand vous
          voulez, votre progression est sauvegardée.
        </p>
      </header>

      <EvaluationRoadmap tests={tests} />

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
                ? `Score AI-Native : ${session.ai_native_score} / 1000`
                : "Cliquez sur Finaliser pour calculer votre score AI-Native et recevoir l'email d'activation."}
            </p>
          </div>
          {!activated && <FinalizeButton />}
        </div>
      )}
    </div>
  );
}
