import Link from "next/link";
import { Search } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin · Entreprises" };
export const dynamic = "force-dynamic";

const STATUS_OPTIONS = [
  { value: "", label: "Tous" },
  { value: "new", label: "Nouveau" },
  { value: "contacted", label: "Contacté" },
  { value: "demo_scheduled", label: "Démo planifiée" },
  { value: "won", label: "Converti" },
  { value: "lost", label: "Perdu" },
];

const STATUS_COLORS = {
  new: "text-blue-300 bg-blue-500/10",
  contacted: "text-amber-300 bg-amber-400/10",
  demo_scheduled: "text-accent bg-accent/10",
  won: "text-success bg-success/10",
  lost: "text-foreground/40 bg-white/5",
};

export default async function AdminB2BPage({ searchParams }) {
  const q = (searchParams?.q || "").trim();
  const status = searchParams?.status || "";
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const perPage = 20;

  const service = createServiceClient();

  let qb = service
    .from("inscriptions_b2b")
    .select(
      "id, reference, raison_sociale, secteur, signataire_prenom, signataire_nom, signataire_email, prestations, volume, status, creneau_date, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (q) {
    qb = qb.or(
      `raison_sociale.ilike.%${q}%,signataire_email.ilike.%${q}%,reference.ilike.%${q}%`
    );
  }
  if (status) qb = qb.eq("status", status);

  qb = qb.range((page - 1) * perPage, page * perPage - 1);
  const { data: rows, count } = await qb;
  const totalPages = Math.max(1, Math.ceil((count || 0) / perPage));

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
            Entreprises · {count ?? 0} inscriptions
          </p>
          <h1 className="t-h2-md">Demandes B2B</h1>
        </div>
        <Link
          href="/api/admin/export/b2b"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-md border border-white/15 text-xs text-foreground/85 hover:bg-white/5"
        >
          Exporter CSV
        </Link>
      </header>

      <form method="GET" className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
          <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">
            Recherche
          </span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Société, email, référence…"
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-md pl-9 pr-3 h-10 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent"
            />
          </div>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">
            Statut
          </span>
          <select
            name="status"
            defaultValue={status}
            className="bg-[#1A1A1A] border border-white/10 rounded-md px-3 h-10 text-sm text-foreground"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#0A0A0B]">
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-accent text-background text-xs font-medium hover:bg-accent-hover"
        >
          Filtrer
        </button>
      </form>

      <div className="rounded-lg border border-white/10 bg-surface overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.14em] text-foreground/40 bg-surface-elevated">
              <th className="text-left py-3 px-4">Référence</th>
              <th className="text-left py-3 px-4">Société</th>
              <th className="text-left py-3 px-4">Signataire</th>
              <th className="text-left py-3 px-4">Secteur</th>
              <th className="text-left py-3 px-4">Statut</th>
              <th className="text-left py-3 px-4">RDV</th>
              <th className="text-left py-3 px-4">Reçue</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {(!rows || rows.length === 0) && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-foreground/50">
                  Aucune inscription B2B trouvée.
                </td>
              </tr>
            )}
            {(rows || []).map((r) => (
              <tr key={r.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                <td className="py-3 px-4 font-mono text-xs text-foreground/70">{r.reference}</td>
                <td className="py-3 px-4 text-foreground">{r.raison_sociale}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-foreground/85">{r.signataire_prenom} {r.signataire_nom}</span>
                    <span className="text-xs text-foreground/55">{r.signataire_email}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-foreground/70">{r.secteur}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.14em] font-medium ${
                      STATUS_COLORS[r.status] || "text-foreground/50 bg-white/5"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-foreground/70 text-xs">
                  {r.creneau_date
                    ? new Date(r.creneau_date).toLocaleDateString("fr-FR")
                    : "—"}
                </td>
                <td className="py-3 px-4 text-foreground/55 text-xs">
                  {new Date(r.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="py-3 px-4">
                  <Link href={`/admin/entreprises/${r.id}`} className="text-xs text-accent hover:text-accent-hover">
                    Détail →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`?${new URLSearchParams({ q, status, page: String(p) }).toString()}`}
              className={`inline-flex h-9 min-w-9 items-center justify-center px-3 rounded-md text-xs ${
                p === page
                  ? "bg-accent text-background"
                  : "border border-white/15 text-foreground/70 hover:bg-white/5"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
