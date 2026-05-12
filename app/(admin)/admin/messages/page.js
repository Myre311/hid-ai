import Link from "next/link";
import { Search, Mail, SearchX, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { sanitizeSearchQuery } from "@/lib/admin/sanitize";
import EmptyState from "@/components/ui/EmptyState";

export const metadata = { title: "Admin · Messages" };
export const dynamic = "force-dynamic";

const TYPE_LABELS = {
  talent: "Talent",
  b2b: "B2B",
  press: "Presse",
  career: "Carrière",
  other: "Autre",
};

const TYPE_OPTIONS = [
  { value: "", label: "Tous" },
  { value: "b2b", label: "B2B" },
  { value: "talent", label: "Talent" },
  { value: "press", label: "Presse" },
  { value: "career", label: "Carrière" },
  { value: "other", label: "Autre" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Tous" },
  { value: "new", label: "Nouveau" },
  { value: "in_progress", label: "En cours" },
  { value: "answered", label: "Répondu" },
  { value: "spam", label: "Spam" },
  { value: "archived", label: "Archivé" },
];

const STATUS_COLORS = {
  new: "text-blue-300 bg-blue-500/10",
  in_progress: "text-amber-300 bg-amber-400/10",
  answered: "text-success bg-success/10",
  spam: "text-red-300 bg-red-500/10",
  archived: "text-foreground/40 bg-white/5",
};

const EMAIL_STATUS_BADGE = {
  sent: { Icon: CheckCircle2, color: "text-success", label: "Email envoyé" },
  pending: { Icon: Clock, color: "text-amber-300", label: "Email en attente" },
  failed: { Icon: AlertCircle, color: "text-red-400", label: "Email échoué" },
  skipped: { Icon: AlertCircle, color: "text-foreground/40", label: "Email non configuré" },
};

export default async function AdminMessagesPage({ searchParams }) {
  const q = sanitizeSearchQuery(searchParams?.q || "");
  const type = searchParams?.type || "";
  const status = searchParams?.status || "";
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const perPage = 20;

  const service = createServiceClient();

  let qb = service
    .from("contact_messages")
    .select(
      "id, type, prenom, nom, email, telephone, sujet, message, status, email_status, error, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (q) {
    qb = qb.or(
      `prenom.ilike.%${q}%,nom.ilike.%${q}%,email.ilike.%${q}%,sujet.ilike.%${q}%`
    );
  }
  if (type) qb = qb.eq("type", type);
  if (status) qb = qb.eq("status", status);

  qb = qb.range((page - 1) * perPage, page * perPage - 1);

  let rows = null;
  let count = 0;
  let tableMissing = false;
  try {
    const { data, count: c, error } = await qb;
    if (error) {
      // Probablement la table n'existe pas (migration 0005 pas appliquée)
      tableMissing = true;
    } else {
      rows = data;
      count = c ?? 0;
    }
  } catch {
    tableMissing = true;
  }

  const totalPages = Math.max(1, Math.ceil(count / perPage));

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
            Messages · {tableMissing ? "—" : count} reçus
          </p>
          <h1 className="t-h2-md">Messages de contact</h1>
        </div>
      </header>

      {tableMissing && (
        <div className="rounded-md border border-amber-400/40 bg-amber-400/5 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground/85">
            <p className="font-medium text-foreground">
              Migration 0005 non appliquée
            </p>
            <p className="mt-1 text-foreground/70">
              La table <code className="text-xs bg-black/40 px-1 py-0.5 rounded">contact_messages</code>{" "}
              n&rsquo;existe pas encore. Applique la migration{" "}
              <code className="text-xs bg-black/40 px-1 py-0.5 rounded">
                supabase/migrations/0005_contact_messages.sql
              </code>{" "}
              dans Supabase SQL Editor pour activer le stockage des messages.
            </p>
          </div>
        </div>
      )}

      {!tableMissing && (
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
                placeholder="Nom, email, sujet…"
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-md pl-9 pr-3 h-10 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent"
              />
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">
              Type
            </span>
            <select
              name="type"
              defaultValue={type}
              className="bg-[#1A1A1A] border border-white/10 rounded-md px-3 h-10 text-sm text-foreground"
            >
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#0A0A0B]">
                  {o.label}
                </option>
              ))}
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
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#0A0A0B]">
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="h-10 px-4 rounded-md bg-accent text-background text-sm font-medium hover:bg-accent-hover"
          >
            Filtrer
          </button>
        </form>
      )}

      {!tableMissing && rows && rows.length === 0 && (
        <EmptyState
          Icon={SearchX}
          title="Aucun message"
          description={q || type || status ? "Essaie d'élargir les filtres." : "Les messages reçus via /contact apparaîtront ici."}
        />
      )}

      {!tableMissing && rows && rows.length > 0 && (
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-foreground/55 text-[10px] uppercase tracking-[0.18em]">
              <tr>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">De</th>
                <th className="text-left py-3 px-4">Sujet</th>
                <th className="text-left py-3 px-4">Statut</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Reçu</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const emailBadge = EMAIL_STATUS_BADGE[r.email_status] || EMAIL_STATUS_BADGE.pending;
                const EmailIcon = emailBadge.Icon;
                return (
                  <tr key={r.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.16em] bg-white/5 text-foreground/70">
                        {TYPE_LABELS[r.type] || r.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      <div className="font-medium">{r.prenom} {r.nom}</div>
                      <div className="text-foreground/55 text-xs">{r.email}</div>
                    </td>
                    <td className="py-3 px-4 text-foreground/85 max-w-md truncate" title={r.sujet}>
                      {r.sujet}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.16em] ${STATUS_COLORS[r.status] || "bg-white/5 text-foreground/40"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs ${emailBadge.color}`} title={r.error || emailBadge.label}>
                        <EmailIcon className="h-3.5 w-3.5" />
                        {r.email_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground/55 text-xs">
                      {new Date(r.created_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!tableMissing && totalPages > 1 && (
        <div className="flex items-center gap-2 justify-center pt-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={{ pathname: "/admin/messages", query: { ...(q && { q }), ...(type && { type }), ...(status && { status }), page: p } }}
              className={`inline-flex items-center justify-center h-9 px-3 rounded-md text-xs font-medium ${
                p === page
                  ? "bg-accent text-background"
                  : "border border-white/15 text-foreground/70 hover:text-foreground hover:bg-white/5"
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
