"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";

export function FinalizeButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const finalize = async () => {
    setBusy(true);
    setError(null);
    const tId = toast.loading("Finalisation de votre profil…");
    try {
      const res = await fetch("/api/evaluation/finalize", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Échec de la finalisation");
      toast.success("Profil finalisé !", {
        id: tId,
        description: "Votre AI-Native Score est calculé.",
      });
      router.push("/dashboard/evaluation/complete");
    } catch (err) {
      setError(err.message);
      toast.error("Finalisation impossible", {
        id: tId,
        description: err.message,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1.5">
      <button
        type="button"
        onClick={finalize}
        disabled={busy}
        className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {busy ? "Finalisation…" : "Finaliser mon profil"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
