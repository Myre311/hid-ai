"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  RotateCcw,
  Mail,
  Sparkles,
  Loader2,
  ShieldCheck,
} from "lucide-react";

/**
 * Panneau d'actions admin sur la fiche d'un Talent.
 * - Validation KYC : Approuver / Rejeter (avec raison)
 * - Compte : Suspendre / Réactiver
 * - Session : Reset / Activer manuellement / Renvoyer email d'activation
 */
export function TalentActionsPanel({ talent, session }) {
  const router = useRouter();
  const [busy, setBusy] = useState(null);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const kycStatus = talent.kyc_status || "pending";
  const accountStatus = talent.account_status || "active";

  async function kycAction(action) {
    if (action === "reject" && !rejectMode) {
      setRejectMode(true);
      return;
    }
    if (action === "reject" && rejectReason.trim().length < 5) {
      toast.error("Raison requise (5+ caractères)");
      return;
    }

    setBusy(`kyc-${action}`);
    try {
      const res = await fetch(`/api/admin/talents/${talent.id}/kyc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          reason: action === "reject" ? rejectReason.trim() : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success(action === "approve" ? "KYC approuvé" : "KYC rejeté");
      setRejectMode(false);
      setRejectReason("");
      router.refresh();
    } catch (err) {
      toast.error("Action échouée", { description: err.message });
    } finally {
      setBusy(null);
    }
  }

  async function talentAction(action, label) {
    if (
      action === "reset_session" &&
      !confirm("Confirmer le reset complet de la session ? Les test_results seront supprimés.")
    ) {
      return;
    }
    setBusy(`act-${action}`);
    try {
      const res = await fetch(`/api/admin/talents/${talent.id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success(label + " ✓");
      router.refresh();
    } catch (err) {
      toast.error(`${label} échoué`, { description: err.message });
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="rounded-lg border border-white/10 bg-surface p-5 flex flex-col gap-5">
      <h2 className="text-xs uppercase tracking-[0.18em] text-foreground/50 flex items-center gap-2">
        <ShieldCheck className="h-3.5 w-3.5" /> Actions administrateur
      </h2>

      {/* KYC */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-foreground/85">Vérification KYC</span>
          <KycBadge status={kycStatus} />
        </div>
        {rejectMode ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Raison du refus (visible côté admin uniquement)…"
              maxLength={500}
              rows={3}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-md px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent"
            />
            <div className="flex gap-2">
              <ActionBtn
                onClick={() => kycAction("reject")}
                loading={busy === "kyc-reject"}
                variant="danger"
                icon={<XCircle className="h-3.5 w-3.5" />}
              >
                Confirmer le refus
              </ActionBtn>
              <ActionBtn
                onClick={() => { setRejectMode(false); setRejectReason(""); }}
                variant="ghost"
              >
                Annuler
              </ActionBtn>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <ActionBtn
              onClick={() => kycAction("approve")}
              loading={busy === "kyc-approve"}
              disabled={kycStatus === "approved"}
              variant="accent"
              icon={<CheckCircle2 className="h-3.5 w-3.5" />}
            >
              Approuver
            </ActionBtn>
            <ActionBtn
              onClick={() => kycAction("reject")}
              disabled={kycStatus === "rejected"}
              variant="danger"
              icon={<XCircle className="h-3.5 w-3.5" />}
            >
              Rejeter
            </ActionBtn>
          </div>
        )}
        {talent.kyc_rejection_reason && kycStatus === "rejected" && (
          <p className="text-[11px] text-red-400/85 leading-relaxed border-l-2 border-red-400/40 pl-3">
            <strong>Raison :</strong> {talent.kyc_rejection_reason}
          </p>
        )}
      </div>

      {/* Compte */}
      <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-foreground/85">Statut du compte</span>
          <AccountBadge status={accountStatus} />
        </div>
        <div className="flex flex-wrap gap-2">
          {accountStatus === "active" ? (
            <ActionBtn
              onClick={() => talentAction("suspend", "Compte suspendu")}
              loading={busy === "act-suspend"}
              variant="danger"
              icon={<Pause className="h-3.5 w-3.5" />}
            >
              Suspendre
            </ActionBtn>
          ) : (
            <ActionBtn
              onClick={() => talentAction("reactivate", "Compte réactivé")}
              loading={busy === "act-reactivate"}
              variant="accent"
              icon={<Play className="h-3.5 w-3.5" />}
            >
              Réactiver
            </ActionBtn>
          )}
        </div>
      </div>

      {/* Session d'évaluation */}
      {session && (
        <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
          <span className="text-sm text-foreground/85">Session d'évaluation</span>
          <div className="flex flex-wrap gap-2">
            <ActionBtn
              onClick={() => talentAction("activate_manual", "Profil activé manuellement")}
              loading={busy === "act-activate_manual"}
              disabled={session.status === "activated"}
              variant="accent"
              icon={<Sparkles className="h-3.5 w-3.5" />}
            >
              Activer manuellement
            </ActionBtn>
            <ActionBtn
              onClick={() => talentAction("resend_email", "Email d'activation renvoyé")}
              loading={busy === "act-resend_email"}
              disabled={session.status !== "activated"}
              variant="ghost"
              icon={<Mail className="h-3.5 w-3.5" />}
            >
              Renvoyer email
            </ActionBtn>
            <ActionBtn
              onClick={() => talentAction("reset_session", "Session reset")}
              loading={busy === "act-reset_session"}
              variant="danger"
              icon={<RotateCcw className="h-3.5 w-3.5" />}
            >
              Reset session
            </ActionBtn>
          </div>
        </div>
      )}
    </section>
  );
}

function ActionBtn({ onClick, loading, disabled, variant = "ghost", icon, children }) {
  const variants = {
    accent: "bg-accent text-background hover:bg-accent-hover",
    danger: "bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/20",
    ghost: "border border-white/15 text-foreground/85 hover:bg-white/5",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : icon}
      {children}
    </button>
  );
}

function KycBadge({ status }) {
  const map = {
    pending: { c: "bg-amber-400/15 text-amber-300", l: "En attente" },
    approved: { c: "bg-success/15 text-success", l: "Approuvé" },
    rejected: { c: "bg-red-500/15 text-red-300", l: "Rejeté" },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`text-[10px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full ${s.c}`}>
      {s.l}
    </span>
  );
}

function AccountBadge({ status }) {
  const map = {
    active: { c: "bg-success/15 text-success", l: "Actif" },
    suspended: { c: "bg-red-500/15 text-red-300", l: "Suspendu" },
  };
  const s = map[status] || map.active;
  return (
    <span className={`text-[10px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full ${s.c}`}>
      {s.l}
    </span>
  );
}
