"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

/**
 * Écran de confirmation après soumission d'un formulaire.
 *
 * Props:
 *  - title
 *  - message (string OR ReactNode)
 *  - reference (e.g. "HID-B2B-20260510-0421")
 *  - actions (array of {label, href?, onClick?, primary?})
 */
export function FormConfirmation({ title, message, reference, actions = [] }) {
  return (
    <div className="px-6 md:px-10 py-12 md:py-16 flex flex-col items-center text-center gap-6">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-accent/15 border-2 border-accent"
      >
        <Check className="h-10 w-10 text-accent" strokeWidth={2.5} />
      </motion.div>

      <h3 className="t-h2-md">
        {title}
      </h3>

      <div className="t-lead max-w-lg">
        {message}
      </div>

      {reference && (
        <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-white/15 bg-[#1A1A1A] px-3 py-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50">
            Référence
          </span>
          <span className="font-mono text-xs text-foreground">
            {reference}
          </span>
        </div>
      )}

      {actions.length > 0 && (
        <div className="flex flex-col md:flex-row gap-3 mt-4">
          {actions.map((a) => {
            const className = a.primary
              ? "inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors"
              : "inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md border border-white/20 text-sm font-medium text-foreground/85 hover:bg-white/5 hover:border-white/40 transition-colors";
            if (a.href) {
              return (
                <a key={a.label} href={a.href} className={className}>
                  {a.label}
                </a>
              );
            }
            return (
              <button
                key={a.label}
                type="button"
                onClick={a.onClick}
                className={className}
              >
                {a.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
