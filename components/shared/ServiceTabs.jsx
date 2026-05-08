"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

/**
 * Tabs réutilisables avec contenu animé (fade + slight slide).
 * Props:
 *  - services: [{ id, label, content: ReactNode }]
 *  - defaultId?: string (id par défaut)
 */
export function ServiceTabs({ services, defaultId }) {
  const [activeId, setActiveId] = useState(defaultId ?? services[0]?.id);
  const active = services.find((s) => s.id === activeId);

  return (
    <div className="flex flex-col gap-8">
      <div
        role="tablist"
        aria-label="Sélecteur de service"
        className="inline-flex flex-wrap gap-2 p-1.5 rounded-lg bg-surface border border-border self-start"
      >
        {services.map((s) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setActiveId(s.id)}
              className={cn(
                "h-10 px-5 md:px-7 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-black text-foreground border border-white/25"
                  : "text-muted hover:text-foreground hover:bg-surface-elevated"
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="min-h-[24rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            {active?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
