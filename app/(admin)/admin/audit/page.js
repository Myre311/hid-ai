import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import EmptyState from "@/components/ui/EmptyState";
import { History, AlertCircle } from "lucide-react";

export const metadata = { title: "Admin · Audit log" };
export const dynamic = "force-dynamic";

const ACTION_LABELS = {
  "talent.kyc.approve": "KYC approuvé",
  "talent.kyc.reject": "KYC rejeté",
  "talent.account.suspend": "Compte suspendu",
  "talent.account.reactivate": "Compte réactivé",
  "talent.session.reset": "Session reset",
  "talent.activate.manual": "Activation manuelle",
  "talent.email.resend": "Email d'activation renvoyé",
  "message.reply": "Réponse à un message",
  "admin.add": "Admin ajouté",
  "admin.remove": "Admin retiré",
};

const ACTION_COLORS = {
  approve: "text-success",
  reactivate: "text-success",
  activate: "text-success",
  add: "text-success",
  reject: "text-red-300",
  suspend: "text-red-300",
  reset: "text-red-300",
  remove: "text-red-300",
  resend: "text-amber-300",
  reply: "text-amber-300",
};

function colorFor(action) {
  for (const k of Object.keys(ACTION_COLORS)) {
    if (action.includes(k)) return ACTION_COLORS[k];
  }
  return "text-foreground/70";
}

export default async function AuditLogPage({ searchParams }) {
  const service = createServiceClient();
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const perPage = 30;

  let rows = null;
  let count = 0;
  let tableMissing = false;
  try {
    const { data, count: c, error } = await service
      .from("admin_audit_log")
      .select("id, admin_email, action, target_type, target_id, target_label, metadata, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);
    if (error) tableMissing = true;
    else { rows = data; count = c ?? 0; }
  } catch {
    tableMissing = true;
  }

  const totalPages = Math.max(1, Math.ceil(count / perPage));

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <header className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
          Audit · {tableMissing ? "—" : count} actions
        </p>
        <h1 className="t-h2-md flex items-center gap-2">
          <History className="h-6 w-6" /> Journal des actions admin
        </h1>
      </header>

      {tableMissing && (
        <div className="rounded-md border border-amber-400/40 bg-amber-400/5 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground/85">
            <p className="font-medium text-foreground">Migration 0007 non appliquée</p>
            <p className="mt-1 text-foreground/70">
              La table <code className="text-xs bg-black/40 px-1 py-0.5 rounded">admin_audit_log</code>{" "}
              n&rsquo;existe pas encore. Applique{" "}
              <code className="text-xs bg-black/40 px-1 py-0.5 rounded">
                supabase/migrations/0007_admin_actions.sql
              </code>{" "}
              pour activer l&rsquo;audit.
            </p>
          </div>
        </div>
      )}

      {!tableMissing && rows && rows.length === 0 && (
        <EmptyState
          Icon={History}
          title="Pas encore d'actions"
          description="Les actions admin (validation KYC, suspension, réponses…) apparaîtront ici."
        />
      )}

      {!tableMissing && rows && rows.length > 0 && (
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-foreground/55 text-[10px] uppercase tracking-[0.18em]">
              <tr>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Admin</th>
                <th className="text-left py-3 px-4">Action</th>
                <th className="text-left py-3 px-4">Cible</th>
                <th className="text-left py-3 px-4">Détails</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-foreground/55 text-xs whitespace-nowrap">
                    {new Date(r.created_at).toLocaleString("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="py-3 px-4 text-foreground/85 text-xs">
                    {r.admin_email || "—"}
                  </td>
                  <td className={`py-3 px-4 text-sm font-medium ${colorFor(r.action)}`}>
                    {ACTION_LABELS[r.action] || r.action}
                  </td>
                  <td className="py-3 px-4 text-foreground/85 text-xs">
                    {r.target_type && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] bg-white/5 text-foreground/55 mr-2">
                        {r.target_type}
                      </span>
                    )}
                    {r.target_label || "—"}
                  </td>
                  <td className="py-3 px-4 text-foreground/55 text-xs max-w-xs truncate">
                    {r.metadata && Object.keys(r.metadata).length > 0
                      ? JSON.stringify(r.metadata)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!tableMissing && totalPages > 1 && (
        <div className="flex items-center gap-2 justify-center pt-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={{ pathname: "/admin/audit", query: { page: p } }}
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
