import Link from "next/link";
import { ArrowLeft, Building2, Mail, Phone, Calendar, Globe } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { StatusChanger } from "@/components/admin/StatusChanger";

export const metadata = { title: "Admin · Détail B2B" };
export const dynamic = "force-dynamic";

const SECTOR_LABELS = {
  sante: "Santé", droit: "Droit", finance: "Finance", agritech: "AgriTech", autre: "Autre",
};
const PRESTATION_LABELS = {
  annotation: "Annotation",
  rlhf: "RLHF",
  fine_tuning: "Fine-tuning",
  recrutement: "Recrutement",
  autre: "Autre",
};

export default async function AdminB2BDetail({ params }) {
  const service = createServiceClient();
  const { data: b } = await service
    .from("inscriptions_b2b")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!b) {
    return (
      <div className="max-w-xl">
        <Link href="/admin/entreprises" className="inline-flex items-center gap-1.5 text-xs text-foreground/55 mb-4">
          <ArrowLeft className="h-3 w-3" /> Retour
        </Link>
        <p className="t-body">Inscription introuvable.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <Link href="/admin/entreprises" className="inline-flex items-center gap-1.5 text-xs text-foreground/55 hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="h-3 w-3" /> Retour à la liste
      </Link>

      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
            {b.reference}
          </p>
          <h1 className="t-h2-md flex items-center gap-3">
            <Building2 className="h-6 w-6 text-accent" />
            {b.raison_sociale}
          </h1>
          <p className="text-sm text-foreground/55">
            {SECTOR_LABELS[b.secteur] || b.secteur}
            {b.secteur_autre ? ` · ${b.secteur_autre}` : ""} · {b.pays}
          </p>
        </div>
        <StatusChanger id={b.id} currentStatus={b.status} />
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="rounded-lg border border-white/10 bg-surface p-5 flex flex-col gap-3">
          <h2 className="text-xs uppercase tracking-[0.18em] text-foreground/50">Société</h2>
          <Row label="Immatriculation" value={b.immatriculation} />
          {b.site_web && (
            <Row label="Site web" value={<a href={b.site_web} target="_blank" rel="noreferrer" className="text-accent hover:underline">{b.site_web}</a>} />
          )}
        </section>

        <section className="rounded-lg border border-white/10 bg-surface p-5 flex flex-col gap-3">
          <h2 className="text-xs uppercase tracking-[0.18em] text-foreground/50">Signataire</h2>
          <Row label="Nom" value={`${b.signataire_prenom} ${b.signataire_nom}`} />
          <Row label="Fonction" value={b.signataire_fonction} />
          <Row label="Email" value={<a href={`mailto:${b.signataire_email}`} className="text-accent hover:underline">{b.signataire_email}</a>} />
          <Row label="Téléphone" value={b.signataire_tel} />
        </section>
      </div>

      <section className="rounded-lg border border-white/10 bg-surface p-5 flex flex-col gap-3">
        <h2 className="text-xs uppercase tracking-[0.18em] text-foreground/50">Projet</h2>
        <Row label="Prestations" value={b.prestations?.map((p) => PRESTATION_LABELS[p] || p).join(", ")} />
        {b.prestation_autre && <Row label="Précisions" value={b.prestation_autre} />}
        <Row label="Données" value={b.typologies?.join(", ")} />
        <Row label="Volume" value={b.volume} />
        <Row label="Fréquence" value={b.frequence} />
        {b.brief && <Row label="Brief" value={b.brief} />}
      </section>

      <section className="rounded-lg border border-white/10 bg-surface p-5 flex flex-col gap-3">
        <h2 className="text-xs uppercase tracking-[0.18em] text-foreground/50">Audit planifié</h2>
        <Row
          label="Créneau"
          value={
            b.creneau_date
              ? `${b.creneau_date} à ${b.creneau_time}`
              : "—"
          }
        />
        <Row label="Mode" value={b.mode_rdv} />
        <Row label="Langue" value={b.langue} />
      </section>

      <section className="rounded-lg border border-white/10 bg-surface p-5 flex flex-col gap-2 text-xs text-foreground/55">
        <p>
          Inscrite le{" "}
          <strong className="text-foreground/85">
            {new Date(b.created_at).toLocaleString("fr-FR")}
          </strong>
        </p>
        <p>
          Consentements : RGPD {b.consent_rgpd ? "✓" : "✗"} · Newsletter{" "}
          {b.consent_news ? "✓" : "✗"}
        </p>
      </section>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2 text-sm">
      <span className="text-foreground/50">{label}</span>
      <span className="text-foreground/90 break-words">{value || "—"}</span>
    </div>
  );
}
