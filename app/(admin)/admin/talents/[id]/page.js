import Link from "next/link";
import { ArrowLeft, FileText, Calendar, MapPin } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { TESTS } from "@/lib/evaluation/tests";
import { TalentActionsPanel } from "@/components/admin/TalentActionsPanel";

export const metadata = { title: "Admin · Détail talent" };
export const dynamic = "force-dynamic";

const METIER_LABELS = { specialist: "AI Specialist", engineer: "AI Engineer" };
const DOC_LABELS = {
  cni: "Carte nationale d'identité",
  passeport: "Passeport",
  permis: "Permis de conduire",
};
const NIVEAU_LABELS = {
  bac: "Bac",
  "bac+2": "Bac+2",
  "bac+3": "Bac+3 / Licence",
  "bac+5": "Bac+5 / Master",
  doctorat: "Doctorat",
  autodidacte: "Autodidacte",
};

export default async function AdminTalentDetail({ params }) {
  const service = createServiceClient();
  const { data: t } = await service
    .from("inscriptions_talents")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!t) {
    return (
      <div className="max-w-xl">
        <Link href="/admin/talents" className="inline-flex items-center gap-1.5 text-xs text-foreground/55 mb-4">
          <ArrowLeft className="h-3 w-3" /> Retour à la liste
        </Link>
        <p className="t-body">Candidat introuvable.</p>
      </div>
    );
  }

  const { data: session } = await service
    .from("evaluation_sessions")
    .select("*")
    .eq("inscription_talent_id", t.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let tests = [];
  if (session) {
    const { data: tr } = await service
      .from("test_results")
      .select("*")
      .eq("session_id", session.id)
      .order("test_order");
    tests = tr || [];
  }

  // Signed URLs pour les documents KYC (1h)
  async function signed(path) {
    if (!path) return null;
    const { data } = await service.storage
      .from("kyc-documents")
      .createSignedUrl(path, 60 * 60);
    return data?.signedUrl || null;
  }
  const rectoUrl = await signed(t.doc_recto_path);
  const versoUrl = await signed(t.doc_verso_path);
  const selfieUrl = await signed(t.selfie_path);

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <Link href="/admin/talents" className="inline-flex items-center gap-1.5 text-xs text-foreground/55 hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="h-3 w-3" /> Retour à la liste
      </Link>

      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
            {t.reference} · {METIER_LABELS[t.metier]}
          </p>
          <h1 className="t-h2-md">{t.prenom} {t.nom}</h1>
          <p className="text-sm text-foreground/55 flex items-center gap-4 flex-wrap">
            <span><FileText className="h-3.5 w-3.5 inline mr-1" />{t.email}</span>
            <span>{t.telephone}</span>
            <span><MapPin className="h-3.5 w-3.5 inline mr-1" />{t.ville}, {t.pays}</span>
            <span><Calendar className="h-3.5 w-3.5 inline mr-1" />Inscrit le {new Date(t.created_at).toLocaleDateString("fr-FR")}</span>
          </p>
        </div>
        {session?.status === "activated" && (
          <div className="rounded-lg border border-accent/40 bg-accent/5 px-5 py-3 text-center">
            <p className="text-[10px] uppercase tracking-[0.18em] text-accent">AI-Native Score</p>
            <p className="text-3xl font-medium text-foreground tabular-nums">{session.ai_native_score} <span className="text-sm text-foreground/40">/ 1000</span></p>
          </div>
        )}
      </header>

      {/* Panneau d'actions admin (KYC, compte, session) */}
      <TalentActionsPanel talent={t} session={session} />

      <div className="grid md:grid-cols-2 gap-6">
        <section className="rounded-lg border border-white/10 bg-surface p-5 flex flex-col gap-3">
          <h2 className="text-xs uppercase tracking-[0.18em] text-foreground/50">Identité</h2>
          <Row label="Date de naissance" value={t.date_naissance} />
          <Row label="Niveau d'études" value={NIVEAU_LABELS[t.niveau_etudes] || t.niveau_etudes} />
          {t.competences?.length > 0 && <Row label="Compétences" value={t.competences.join(", ")} />}
          {t.antecedents && <Row label="Antécédents" value={t.antecedents} />}
        </section>

        <section className="rounded-lg border border-white/10 bg-surface p-5 flex flex-col gap-3">
          <h2 className="text-xs uppercase tracking-[0.18em] text-foreground/50">Vérification KYC</h2>
          <Row label="Type document" value={DOC_LABELS[t.doc_type]} />
          <div className="flex flex-wrap gap-2 mt-2">
            {rectoUrl && (
              <a href={rectoUrl} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline">
                Recto ↗
              </a>
            )}
            {versoUrl && (
              <a href={versoUrl} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline">
                Verso ↗
              </a>
            )}
            {selfieUrl && (
              <a href={selfieUrl} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline">
                Selfie ↗
              </a>
            )}
          </div>
          <p className="text-[10px] text-foreground/40 mt-1">Liens signés valides 1 heure.</p>
        </section>
      </div>

      <section className="rounded-lg border border-white/10 bg-surface p-5 flex flex-col gap-4">
        <h2 className="text-xs uppercase tracking-[0.18em] text-foreground/50">
          Évaluation · {session?.status || "non démarrée"}
        </h2>
        {tests.length === 0 ? (
          <p className="text-sm text-foreground/55">Pas encore commencée.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.14em] text-foreground/40">
                <th className="text-left py-2">Test</th>
                <th className="text-left py-2">Catégorie</th>
                <th className="text-left py-2">Statut</th>
                <th className="text-right py-2">Score</th>
                <th className="text-right py-2">Précision</th>
                <th className="text-right py-2">Temps</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((tr) => {
                const meta = TESTS.find((m) => m.slug === tr.test_slug);
                return (
                  <tr key={tr.id} className="border-t border-white/5">
                    <td className="py-2.5">{meta?.title || tr.test_slug}</td>
                    <td className="py-2.5 text-foreground/70">{tr.test_category}</td>
                    <td className="py-2.5"><span className="text-foreground/85">{tr.status}</span></td>
                    <td className="py-2.5 text-right tabular-nums">
                      {tr.score != null ? `${tr.score}/100` : "—"}
                    </td>
                    <td className="py-2.5 text-right tabular-nums">
                      {tr.precision_rate != null ? `${(tr.precision_rate * 100).toFixed(1)}%` : "—"}
                    </td>
                    <td className="py-2.5 text-right tabular-nums">
                      {tr.time_spent_seconds ? `${Math.floor(tr.time_spent_seconds / 60)} min` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2 text-sm">
      <span className="text-foreground/50">{label}</span>
      <span className="text-foreground/90">{value || "—"}</span>
    </div>
  );
}
