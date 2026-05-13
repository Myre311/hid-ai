"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useInscription } from "@/contexts/InscriptionContext";
import { B2BForm } from "@/components/forms/b2b/B2BForm";
import { TalentForm } from "@/components/forms/talent/TalentForm";

/**
 * Modal global qui héberge le formulaire B2B ou Talent.
 * Activé via le contexte InscriptionContext.
 */
export function InscriptionModal() {
  const { modal, closeModal } = useInscription();
  const open = modal.open;

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeModal]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overlay */}
          <button
            type="button"
            aria-label="Fermer"
            onClick={closeModal}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default"
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full md:max-w-3xl bg-[#0A0A0B] border border-white/10 md:rounded-2xl overflow-hidden flex flex-col h-full md:h-[88vh] md:min-h-[560px]"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              aria-label="Fermer le formulaire"
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex-1 overflow-y-auto">
              {modal.type === "b2b" && <B2BForm onClose={closeModal} />}
              {modal.type === "talent" && (
                <TalentForm
                  presetMetier={modal.presetMetier}
                  onClose={closeModal}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
