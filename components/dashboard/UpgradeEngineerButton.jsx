"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowUpRight, Loader2 } from "lucide-react";

/**
 * Bouton qui bascule un candidat Specialist (4 tests terminés avec moyenne ≥ 95)
 * sur la piste Ingénieur (ajout des 4 tests engineer).
 *
 * Pré-condition côté serveur : /api/evaluation/upgrade-engineer vérifie
 * l'éligibilité avant d'insérer les lignes. Si non éligible → 403/400.
 */
export function UpgradeEngineerButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const upgrade = async () => {
    setBusy(true);
    setError(null);
    const tId = toast.loading("Activation de la piste Ingénieur…");
    try {
      const res = await fetch("/api/evaluation/upgrade-engineer", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Échec de la bascule");
      toast.success("Piste Ingénieur activée !", {
        id: tId,
        description: "4 tests supplémentaires viennent d'apparaître.",
      });
      router.refresh();
    } catch (err) {
      setError(err.message);
      toast.error("Bascule impossible", { id: tId, description: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1.5">
      <button
        type="button"
        onClick={upgrade}
        disabled={busy}
        className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" />}
        {busy ? "Activation…" : "Passer les tests Ingénieur"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
