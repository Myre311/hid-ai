"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Boutons "Précédent" / "Suivant" en bas de chaque étape de form.
 */
export function FormNavigation({
  onPrev,
  onNext,
  canGoNext = true,
  canGoPrev = true,
  nextLabel = "Suivant",
  prevLabel = "Précédent",
  isFinal = false,
  isSubmitting = false,
}) {
  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoPrev || isSubmitting}
        className={cn(
          "inline-flex items-center gap-2 h-11 px-5 rounded-md border border-white/20 text-sm font-medium text-foreground/85 transition-colors",
          canGoPrev && "hover:bg-white/5 hover:border-white/40",
          !canGoPrev && "opacity-30 cursor-not-allowed"
        )}
      >
        <ArrowLeft className="h-4 w-4" />
        {prevLabel}
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext || isSubmitting}
        className={cn(
          "inline-flex items-center gap-2 h-11 px-6 rounded-md text-sm font-medium transition-all",
          canGoNext && !isSubmitting
            ? "bg-accent text-background hover:bg-accent-hover hover:scale-[1.02]"
            : "bg-white/10 text-foreground/30 cursor-not-allowed"
        )}
      >
        {isSubmitting ? "Envoi en cours…" : isFinal ? nextLabel : "Suivant"}
        {!isSubmitting && <ArrowRight className="h-4 w-4" />}
      </button>
    </div>
  );
}
