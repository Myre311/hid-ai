"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Liste partenaires — édite ici pour ajouter / retirer.
 * Mélange écoles, hubs tech, et entreprises partenaires dans un seul
 * carousel défilant. Le champ `name` est ce qui s'affiche.
 */
const PARTNERS = [
  // Écoles & hubs tech
  { name: "École · 01" },
  { name: "Hub Tech · 02" },
  { name: "École · 03" },

  // Entreprises partenaires (ajoute ici)
  { name: "Entreprise · 01" },
  { name: "Entreprise · 02" },
  { name: "Entreprise · 03" },
];

/**
 * Carousel CSS infini de logos partenaires (écoles, hubs tech, entreprises).
 * - Liste dupliquée pour boucle continue
 * - Vitesse: ~38s/cycle
 * - Pause au hover
 * - Logos en monochrome blanc (opacity 70 → 100 au hover)
 */
export function PartnersMarquee() {
  const [paused, setPaused] = useState(false);
  const doubled = [...PARTNERS, ...PARTNERS];

  return (
    <section
      className="relative overflow-hidden bg-background py-12 md:py-16"
      aria-label="Écoles, hubs tech et entreprises partenaires"
    >
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">
          Écoles, hubs tech &amp; entreprises partenaires
        </p>
      </div>

      <div
        className="mt-8 relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className={cn(
            "flex gap-16 w-max",
            "animate-[marquee_38s_linear_infinite]"
          )}
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {doubled.map((p, i) => (
            <PartnerLogo key={`${p.name}-${i}`} name={p.name} />
          ))}
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

function PartnerLogo({ name }) {
  return (
    <span
      aria-label={name}
      className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors duration-200 select-none whitespace-nowrap"
    >
      <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full border border-current" />
      <span className="text-sm tracking-[0.2em] font-medium">{name}</span>
    </span>
  );
}
