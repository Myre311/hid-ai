import Link from "next/link";
import { Search } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin · Talents" };
export const dynamic = "force-dynamic";

const METIER_LABELS = { specialist: "AI Specialist", engineer: "AI Engineer" };

export default async function AdminTalentsPage({ searchParams }) {
  const q = (searchParams?.q || "").trim();
  const metier = searchParams?.metier || "";
  const status = searchParams?.status || "";
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const perPage = 20;

  const service = createServiceClient();

  let qb = service
    .from("inscriptions_talents")
    .select("id, reference, prenom, nom, email, telephone, metier, pays, created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false });

  if (q) {
    qb = qb.or(
      `email.ilike.%${q}%,prenom.ilike.%${q}%,nom.ilike.%${q}%,telephone.ilike.%${q}%,reference.ilike.%${q}%`
    );
  }
  if (metier) qb = qb.eq("metier", metier);

  // Filtrage par statut éval : on charge les sessions séparément si demandé.
  qb = qb.range((page - 1) * perPage, page * perPage - 1);
  const { data: inscriptions, count } = await qb;

  // Joindre les sessions pour le score / status
  const ids = (inscriptions || []).map((i) => i.id);
  let sessionsByInscription = {};
  if (ids.length > 0) {
    const { data: sessions } = await service
      .from("evaluation_sessions")
      .select("inscription_talent_id, status, ai_native_score")
      .in("inscription_talent_id", ids);
    sessionsByInscription = (sessions || []).reduce((acc, s) => {
      acc[s.inscription_talent_id] = s;
      return acc;
    }, {});
  }

  // Filtrage status post-fetch (RLS friendly)
  let rows = (inscriptions || []).map((i) => {
    const s = sessionsByInscription[i.id];
    return {
      ...i,
      status: s?.status || "non_demarre",
      ai_native_score: s?.ai_native_score ?? null,
    };
  });
  if (status) rows = rows.filter((r) => r.status === status);

  const totalPages = Math.max(1, Math.ceil((count || 0) / perPage));

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
            Talents · {count ?? 0} inscrits
          </p>
          <h1 className="t-h2-md">Liste des candidats</h1>
        </div>
        <Link
          href="/api/admin/export/talents"
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
              placeholder="Nom, email, téléphone, référence…"
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-md pl-9 pr-3 h-10 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent"
            />
          </div>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">
            Métier
          </span>
          <select
            name="metier"
            defaultValue={metier}
            className="bg-[#1A1A1A] border border-white/10 rounded-md px-3 h-10 text-sm text-foreground"
          >
            <option value="" className="bg-[#0A0A0B]">Tous</option>
            <option value="specialist" className="bg-[#0A0A0B]">AI Specialist</option>
            <option value="engineer" className="bg-[#0A0A0B]">AI Engineer</option>
          </select>
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
            <option value="" className="bg-[#0A0A0B]">Tous</option>
            <option value="non_demarre" className="bg-[#0A0A0B]">Non démarré</option>
            <option value="in_progress" className="bg-[#0A0A0B]">En cours</option>
            <option value="completed" className="bg-[#0A0A0B]">Complété</option>
            <option value="activated" className="bg-[#0A0A0B]">Activé</option>
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
              <th className="text-left py-3 px-4">Candidat</th>
              <th className="text-left py-3 px-4">Métier</th>
              <th className="text-left py-3 px-4">Pays</th>
              <th className="text-left py-3 px-4">Statut</th>
              <th className="text-right py-3 px-4">Score</th>
              <th className="text-left py-3 px-4">Inscription</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-foreground/50">
                  Aucun candidat trouvé.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                <td className="py-3 px-4 font-mono text-xs text-foreground/70">{r.reference}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-foreground">{r.prenom} {r.nom}</span>
                    <span className="text-xs text-foreground/55">{r.email}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-foreground/85">{METIER_LABELS[r.metier]}</td>
                <td className="py-3 px-4 text-foreground/70">{r.pays}</td>
                <td className="py-3 px-4">
                  <StatusBadge status={r.status} />
                </td>
                <td className="py-3 px-4 text-right">
                  {r.ai_native_score != null ? (
                    <span className="text-accent font-medium tabular-nums">{r.ai_native_score}</span>
                  ) : (
                    <span className="text-foreground/30">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-foreground/55 text-xs">
                  {new Date(r.created_at).toLocaleDateString("fr-FR", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </td>
                <td className="py-3 px-4">
                  <Link
                    href={`/admin/talents/${r.id}`}
                    className="text-xs text-accent hover:text-accent-hover"
                  >
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
              href={`?${new URLSearchParams({ q, metier, status, page: String(p) }).toString()}`}
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

const STATUS_LABELS = {
  non_demarre: "Non démarré",
  pending: "En attente",
  in_progress: "En cours",
  completed: "Tests complétés",
  activated: "Activé",
};
const STATUS_COLORS = {
  non_demarre: "text-foreground/50 bg-white/5",
  pending: "text-foreground/50 bg-white/5",
  in_progress: "text-amber-300 bg-amber-400/10",
  completed: "text-blue-300 bg-blue-500/10",
  activated: "text-success bg-success/10",
};
function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.14em] font-medium ${
        STATUS_COLORS[status] || "text-foreground/50 bg-white/5"
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
