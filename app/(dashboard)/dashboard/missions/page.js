import { redirect } from "next/navigation";
import Link from "next/link";
import { Briefcase, ShieldAlert, Clock } from "lucide-react";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import EmptyState from "@/components/ui/EmptyState";
import { aiNativeMaxScoreByMetier } from "@/lib/evaluation/aiNativeScore";

export const metadata = { title: "Missions · HID AI" };

export default async function MissionsPage() {
  const userClient = createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user) redirect("/login");

  const service = createServiceClient();

  // Garde KYC : l'accès aux missions exige un dossier validé par l'admin.
  let inscription = null;
  if (user.email) {
    const { data } = await service
      .from("inscriptions_talents")
      .select("status, doc_recto_path")
      .ilike("email", user.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    inscription = data;
  }

  if (!inscription || inscription.status !== "validated") {
    const hasDocs = Boolean(inscription?.doc_recto_path);
    return (
      <div className="max-w-2xl flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
            Espace candidat
          </p>
          <h1 className="t-h2-md">Vos missions</h1>
        </header>
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-8 flex flex-col items-start gap-5">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-accent/15 text-accent">
            {hasDocs ? <Clock className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
          </span>
          <h2 className="t-h3">
            {hasDocs
              ? "Dossier en cours de validation"
              : "Complétez votre dossier pour accéder aux missions"}
          </h2>
          <p className="t-lead">
            {hasDocs
              ? "Vos pièces d'identité ont bien été reçues. Notre équipe les vérifie — l'accès aux missions sera débloqué dès la validation. Vos évaluations restent accessibles entre-temps."
              : "L'accès aux missions nécessite la vérification de votre identité (KYC). Déposez vos pièces depuis votre profil. Vos évaluations restent accessibles sans cela."}
          </p>
          <Link
            href="/dashboard/profil"
            className="inline-flex h-11 items-center px-5 rounded-md bg-accent text-background text-sm font-medium hover:bg-accent-hover"
          >
            {hasDocs ? "Voir mon dossier" : "Compléter mon dossier"}
          </Link>
        </div>
      </div>
    );
  }

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
            <strong>{session?.ai_native_score ?? "—"} / {aiNativeMaxScoreByMetier(inscription?.metier)}</strong>). Notre
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
