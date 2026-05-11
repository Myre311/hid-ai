"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Barre de progression multi-étapes.
 * Les numéros des étapes déjà complétées sont cliquables (retour en arrière uniquement).
 */
export function FormStepper({ steps, current, onStepClick }) {
  const total = steps.length;
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="sticky top-0 z-10 bg-[#0A0A0B]/95 backdrop-blur border-b border-white/10 px-6 md:px-8 pt-6 pb-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-[0.18em] text-foreground/50">
          Étape {current + 1} sur {total}
        </p>
        <p className="text-xs text-foreground/60">{steps[current]}</p>
      </div>

      {/* Bar */}
      <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-accent"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Step pills (compact, non-essential on mobile) */}
      <div className="hidden md:flex items-center gap-3 mt-4">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          const clickable = i < current && onStepClick;
          return (
            <button
              key={label}
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick(i)}
              className={cn(
                "inline-flex items-center gap-2 text-xs",
                clickable && "hover:text-foreground cursor-pointer",
                active && "text-foreground",
                done && "text-foreground/70",
                !active && !done && "text-foreground/30"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] border",
                  done && "bg-accent border-accent text-background",
                  active && "border-accent text-accent",
                  !active && !done && "border-white/20"
                )}
              >
                {done ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
