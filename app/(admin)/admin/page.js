import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";

export const metadata = { title: "Admin · Vue d'ensemble" };
export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const service = createServiceClient();

  // Compteurs
  const [
    { count: totalTalents },
    { count: totalB2B },
    { count: activatedTalents },
    { data: avgScoreData },
  ] = await Promise.all([
    service.from("inscriptions_talents").select("id", { count: "exact", head: true }),
    service.from("inscriptions_b2b").select("id", { count: "exact", head: true }),
    service.from("evaluation_sessions").select("id", { count: "exact", head: true }).eq("status", "activated"),
    service.from("evaluation_sessions").select("ai_native_score").eq("status", "activated"),
  ]);
  const scores = (avgScoreData || []).map((s) => s.ai_native_score).filter((n) => typeof n === "number");
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null;

  // 10 dernières activités (mix Talent + B2B)
  const { data: recentTalents } = await service
    .from("inscriptions_talents")
    .select("id, reference, prenom, nom, email, metier, created_at")
    .order("created_at", { ascending: false })
    .limit(8);
  const { data: recentB2B } = await service
    .from("inscriptions_b2b")
    .select("id, reference, raison_sociale, signataire_email, secteur, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  const recent = [
    ...(recentTalents || []).map((r) => ({
      type: "Talent",
      ref: r.reference,
      name: `${r.prenom} ${r.nom}`,
      email: r.email,
      sub: r.metier === "engineer" ? "AI Engineer" : "AI Specialist",
      date: r.created_at,
      href: `/admin/talents/${r.id}`,
    })),
    ...(recentB2B || []).map((r) => ({
      type: "B2B",
      ref: r.reference,
      name: r.raison_sociale,
      email: r.signataire_email,
      sub: r.secteur,
      date: r.created_at,
      href: `/admin/entreprises/${r.id}`,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <div className="flex flex-col gap-10 max-w-6xl">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
          Vue d&rsquo;ensemble
        </p>
        <h1 className="t-h2-md">Tableau de bord admin</h1>
      </header>

      <section className="grid md:grid-cols-4 gap-4">
        <AdminStatsCard
          label="Candidats inscrits"
          value={totalTalents ?? 0}
          hint="Total Talent"
        />
        <AdminStatsCard
          label="Profils activés"
          value={activatedTalents ?? 0}
          hint="évaluation complète"
          accent
        />
        <AdminStatsCard
          label="Score AI-Native moyen"
          value={avgScore != null ? `${avgScore}` : "—"}
          hint={avgScore != null ? "/ 1000" : "Aucune donnée"}
        />
        <AdminStatsCard
          label="Inscriptions B2B"
          value={totalB2B ?? 0}
          hint="Demandes entreprises"
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <h2 className="t-h3">Activité récente</h2>
          <span className="text-xs text-foreground/40">10 dernières inscriptions</span>
        </div>
        <div className="rounded-lg border border-white/10 bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.14em] text-foreground/40 bg-surface-elevated">
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Référence</th>
                <th className="text-left py-3 px-4">Nom</th>
                <th className="text-left py-3 px-4 hidden md:table-cell">Email</th>
                <th className="text-left py-3 px-4 hidden md:table-cell">Détail</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-foreground/50">
                    Aucune inscription pour le moment.
                  </td>
                </tr>
              )}
              {recent.map((r) => (
                <tr
                  key={`${r.type}-${r.ref}`}
                  className="border-t border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.14em] font-medium ${
                        r.type === "Talent"
                          ? "bg-accent/15 text-accent"
                          : "bg-blue-500/15 text-blue-300"
                      }`}
                    >
                      {r.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-foreground/70">{r.ref}</td>
                  <td className="py-3 px-4 text-foreground">{r.name}</td>
                  <td className="py-3 px-4 hidden md:table-cell text-foreground/70">{r.email}</td>
                  <td className="py-3 px-4 hidden md:table-cell text-foreground/60">{r.sub}</td>
                  <td className="py-3 px-4 text-foreground/55 text-xs">
                    {new Date(r.date).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={r.href}
                      className="text-xs text-accent hover:text-accent-hover"
                    >
                      Voir →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
