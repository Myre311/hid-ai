import { redirect } from "next/navigation";
import Link from "next/link";
import { Briefcase, LayoutGrid } from "lucide-react";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { AiNativeScoreCard } from "@/components/dashboard/AiNativeScoreCard";
import { CompletionConfetti } from "@/components/dashboard/CompletionConfetti";

export const metadata = { title: "Profil activé · HID AI" };

export default async function EvaluationCompletePage() {
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

  if (!session || session.status !== "activated") {
    redirect("/dashboard/evaluation");
  }

  const { data: tests } = await service
    .from("test_results")
    .select("*")
    .eq("session_id", session.id)
    .order("test_order");

  let inscription = null;
  if (user.email) {
    const { data } = await service
      .from("inscriptions_talents")
      .select("prenom, email")
      .eq("email", user.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    inscription = data;
  }

  return (
    <div className="max-w-3xl flex flex-col gap-8">
      <CompletionConfetti />

      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-accent">
          Profil activé
        </p>
        <h1 className="t-h1">
          Bienvenue dans l&rsquo;écosystème HID&nbsp;AI,
          {" "}
          {inscription?.prenom || "Talent"}.
        </h1>
        <p className="t-lead">
          Votre profil est officiellement référencé dans notre vivier de
          talents IA. Un email de confirmation a été envoyé à{" "}
          <strong>{inscription?.email || user.email}</strong>.
        </p>
      </header>

      <AiNativeScoreCard
        score={session.ai_native_score ?? 0}
        testResults={tests || []}
      />

      <div className="flex flex-col md:flex-row gap-3">
        <Link
          href="/dashboard/missions"
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          <Briefcase className="h-4 w-4" />
          Accéder à mes missions
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md border border-white/20 text-sm font-medium text-foreground/85 hover:bg-white/5 transition-colors"
        >
          <LayoutGrid className="h-4 w-4" />
          Retour à mon dashboard
        </Link>
      </div>
    </div>
  );
}
