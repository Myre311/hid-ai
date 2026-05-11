import { redirect } from "next/navigation";
import Link from "next/link";
import { Briefcase, ArrowRight } from "lucide-react";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export const metadata = { title: "Missions · HID AI" };

export default async function MissionsPage() {
  const userClient = createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user) redirect("/login");

  const service = createServiceClient();
  const { data: session } = await service
    .from("evaluation_sessions")
    .select("status, ai_native_score")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const activated = session?.status === "activated";

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
          Espace candidat
        </p>
        <h1 className="t-h2-md">Vos missions</h1>
      </header>

      <div className="rounded-lg border border-white/10 bg-surface p-8 flex flex-col items-start gap-5">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-surface-elevated text-accent">
          <Briefcase className="h-6 w-6" />
        </span>

        {activated ? (
          <>
            <h2 className="t-h3">Vos premières missions arrivent.</h2>
            <p className="t-lead">
              Votre profil est activé (score AI-Native :{" "}
              <strong>{session?.ai_native_score ?? "—"} / 1000</strong>). Notre
              équipe vous notifiera par email dès qu&rsquo;une mission compatible
              avec votre niveau est disponible.
            </p>
          </>
        ) : (
          <>
            <h2 className="t-h3">Cette section sera disponible après votre activation.</h2>
            <p className="t-lead">
              Complétez les 8 tests d&rsquo;évaluation pour activer votre profil
              et accéder à vos premières missions.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-black border border-white/25 text-sm font-medium text-foreground hover:border-white/60 hover:bg-surface-elevated transition-colors"
            >
              Compléter mon évaluation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
