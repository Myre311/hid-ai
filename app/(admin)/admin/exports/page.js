import { Download, Users, Building2, Sparkles } from "lucide-react";

export const metadata = { title: "Admin · Exports" };

const EXPORTS = [
  {
    title: "Tous les candidats Talent",
    description:
      "Référence, identité, contact, métier, score AI-Native, statut d'évaluation, consentements.",
    Icon: Users,
    href: "/api/admin/export/talents",
  },
  {
    title: "Toutes les inscriptions B2B",
    description:
      "Société, signataire, prestations souhaitées, créneau d'audit, consentements RGPD.",
    Icon: Building2,
    href: "/api/admin/export/b2b",
  },
];

export default function AdminExportsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
          Exports
        </p>
        <h1 className="t-h2-md">Téléchargements CSV</h1>
        <p className="t-body">
          Fichiers UTF-8 prêts pour Excel, Numbers ou Google Sheets. Le BOM
          est inclus pour préserver les accents.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        {EXPORTS.map((e) => (
          <a
            key={e.href}
            href={e.href}
            download
            className="rounded-lg border border-white/10 bg-surface p-5 flex flex-col gap-3 hover:border-accent/40 transition-colors group"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-surface-elevated text-accent">
              <e.Icon className="h-5 w-5" />
            </span>
            <h2 className="text-sm font-medium text-foreground">{e.title}</h2>
            <p className="text-xs text-foreground/60 leading-relaxed">
              {e.description}
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs text-accent mt-2 group-hover:text-accent-hover">
              <Download className="h-3.5 w-3.5" />
              Télécharger
            </span>
          </a>
        ))}
      </div>

      <section className="rounded-md border border-white/10 bg-surface/40 p-5 text-sm text-foreground/55 flex gap-3">
        <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5 text-accent" />
        <div>
          <p className="text-foreground/85 font-medium mb-1">À venir</p>
          <p>
            Export filtré (par date, statut), export des résultats détaillés
            d&rsquo;évaluation par test, statistiques mensuelles agrégées.
          </p>
        </div>
      </section>
    </div>
  );
}
