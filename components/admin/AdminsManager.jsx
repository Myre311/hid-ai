"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, UserPlus, Loader2, ShieldCheck } from "lucide-react";

export function AdminsManager({ admins, canEdit, currentUserId }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [busy, setBusy] = useState(false);
  const [removeId, setRemoveId] = useState(null);

  async function addAdmin(e) {
    e.preventDefault();
    if (!canEdit) return;
    if (!email.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Admin ajouté", { description: email });
      setEmail("");
      router.refresh();
    } catch (err) {
      toast.error("Ajout impossible", { description: err.message });
    } finally {
      setBusy(false);
    }
  }

  async function removeAdmin(adminId, adminEmail) {
    if (!canEdit) return;
    if (!confirm(`Retirer ${adminEmail} de la whitelist admin ?`)) return;
    setRemoveId(adminId);
    try {
      const res = await fetch(`/api/admin/admins/${adminId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Admin retiré");
      router.refresh();
    } catch (err) {
      toast.error("Suppression impossible", { description: err.message });
    } finally {
      setRemoveId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Liste */}
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-foreground/55 text-[10px] uppercase tracking-[0.18em]">
            <tr>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Rôle</th>
              <th className="text-left py-3 px-4">Ajouté le</th>
              {canEdit && <th className="text-right py-3 px-4 w-24"></th>}
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan={canEdit ? 4 : 3} className="py-6 px-4 text-center text-foreground/50">
                  Aucun admin enregistré.
                </td>
              </tr>
            ) : (
              admins.map((a) => (
                <tr key={a.id} className="border-t border-white/5">
                  <td className="py-3 px-4 text-foreground">{a.email}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full ${
                      a.role === "super_admin"
                        ? "bg-accent/15 text-accent"
                        : "bg-white/5 text-foreground/70"
                    }`}>
                      {a.role === "super_admin" && <ShieldCheck className="h-3 w-3" />}
                      {a.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground/55 text-xs">
                    {new Date(a.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  {canEdit && (
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => removeAdmin(a.id, a.email)}
                        disabled={a.user_id === currentUserId || removeId === a.id}
                        title={a.user_id === currentUserId ? "Vous ne pouvez pas vous retirer vous-même" : "Retirer"}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-md text-red-300/70 hover:bg-red-500/10 hover:text-red-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {removeId === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Ajout (super_admin only) */}
      {canEdit && (
        <form onSubmit={addAdmin} className="rounded-lg border border-white/10 bg-surface p-5 flex flex-col gap-4">
          <h2 className="text-xs uppercase tracking-[0.18em] text-foreground/50">Ajouter un admin</h2>
          <p className="text-xs text-foreground/55 leading-relaxed">
            Le futur admin doit s&rsquo;être connecté au moins une fois sur le site
            (un compte <code className="text-[10px] bg-black/40 px-1 rounded">auth.users</code> doit exister
            avec cet email).
          </p>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@hidea-solution.fr"
              className="flex-1 h-10 px-3 rounded-md bg-[#1A1A1A] border border-white/10 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-10 px-3 rounded-md bg-[#1A1A1A] border border-white/10 text-sm text-foreground"
            >
              <option value="admin" className="bg-[#0A0A0B]">admin</option>
              <option value="super_admin" className="bg-[#0A0A0B]">super_admin</option>
            </select>
            <button
              type="submit"
              disabled={busy || !email.trim()}
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              {busy ? "Ajout…" : "Ajouter"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
