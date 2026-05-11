import { redirect } from "next/navigation";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import EmptyState from "@/components/ui/EmptyState";

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

      {activated ? (
        <div className="rounded-lg border border-white/10 bg-surface p-8 flex flex-col items-start gap-5">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-surface-elevated text-accent">
            <Briefcase className="h-6 w-6" />
          </span>
          <h2 className="t-h3">Vos premières missions arrivent.</h2>
          <p className="t-lead">
            Votre profil est activé (score AI-Native :{" "}
            <strong>{session?.ai_native_score ?? "—"} / 1000</strong>). Notre
            équipe vous notifiera par email dès qu&rsquo;une mission compatible
            avec votre niveau est disponible.
          </p>
        </div>
      ) : (
        <EmptyState
          icon={<Briefcase className="w-10 h-10 text-foreground/40" />}
          title="Missions à venir"
          description="Cette section sera disponible après l'activation de votre profil. Complétez votre évaluation pour débloquer vos premières missions."
          cta={
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center px-5 rounded-md bg-accent text-background text-sm font-medium hover:bg-accent-hover"
            >
              Voir mon évaluation
            </Link>
          }
        />
      )}
    </div>
  );
}
