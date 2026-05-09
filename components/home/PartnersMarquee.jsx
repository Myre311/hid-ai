"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Liste partenaires — édite ici pour ajouter / retirer.
 * - Sans `src` → rendu texte + pastille (placeholder écoles, etc.)
 * - Avec `src` → rendu image (logo entreprise réel)
 *
 * Logos hostés sur major-exchanges.com pour cette itération.
 */
const PARTNERS = [
  // Écoles & hubs tech (placeholders en attendant la liste finale)
  { name: "École · 01" },
  { name: "Hub Tech · 02" },
  { name: "École · 03" },

  // Entreprises partenaires
  {
    name: "OMC",
    alt: "OMC — Organisation Mondiale du Commerce",
    src: "https://www.major-exchanges.com/assets/img/logo_omc.png",
  },
  {
    name: "OTAN",
    alt: "OTAN — NATO · Luxembourg",
    src: "https://www.major-exchanges.com/assets/img/logo_otan.png",
  },
  {
    name: "Lafayette",
    alt: "Lafayette Psychology Center · USA",
    src: "https://www.major-exchanges.com/assets/img/logo_lafayette.png",
  },
  {
    name: "CCI Occitanie",
    alt: "CCI Occitanie — Chambre de Commerce et d'Industrie",
    src: "https://www.major-exchanges.com/assets/img/logo_cci.jpg",
  },
  {
    name: "CEA",
    alt: "CEA — Commissariat à l'Énergie Atomique",
    src: "https://www.major-exchanges.com/assets/img/logo_cea.png",
  },
  {
    name: "SUEZ",
    alt: "SUEZ Environnement",
    src: "https://www.major-exchanges.com/assets/img/logo_suez.png",
  },
  {
    name: "IRSN",
    alt: "IRSN — Institut de Radioprotection et de Sûreté Nucléaire",
    src: "https://www.major-exchanges.com/assets/img/logo_irsn.png",
  },
];

/**
 * Carousel CSS infini de logos partenaires (écoles, hubs tech, entreprises).
 * - Liste dupliquée pour boucle continue
 * - Vitesse: ~46s/cycle (un peu plus lent vu qu'il y a plus d'items)
 * - Pause au hover
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
            "flex items-center gap-12 md:gap-16 w-max",
            "animate-[marquee_46s_linear_infinite]"
          )}
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {doubled.map((p, i) => (
            <PartnerLogo key={`${p.name}-${i}`} partner={p} />
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

function PartnerLogo({ partner }) {
  if (partner.src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={partner.src}
        alt={partner.alt ?? partner.name}
        loading="lazy"
        className="h-9 md:h-10 w-auto max-w-[160px] object-contain opacity-70 hover:opacity-100 transition-opacity duration-200 select-none"
      />
    );
  }

  return (
    <span
      aria-label={partner.name}
      className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors duration-200 select-none whitespace-nowrap"
    >
      <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full border border-current" />
      <span className="text-sm tracking-[0.2em] font-medium">{partner.name}</span>
    </span>
  );
}
