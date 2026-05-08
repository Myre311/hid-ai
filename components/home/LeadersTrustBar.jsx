"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

const LEADERS = [
  { name: "ATELIER" },
  { name: "NEXUS" },
  { name: "LATTICE" },
  { name: "PRISM" },
  { name: "AXIOM" },
  { name: "VERTEX" },
];

/**
 * Section "Construit pour les exigences des leaders de l'IA".
 * 6 pastilles défilantes — Scale AI dark style.
 */
export function LeadersTrustBar() {
  const [paused, setPaused] = useState(false);
  const doubled = [...LEADERS, ...LEADERS];

  return (
    <section
      className="bg-background py-20 md:py-28"
      aria-label="Construit pour les exigences des leaders de l'IA"
    >
      <Container className="flex flex-col gap-10 max-w-5xl">
        <div className="flex flex-col gap-3 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            Trust
          </p>
          <h2 className="t-h2-md">
            Construit pour les exigences des leaders de l&rsquo;IA.
          </h2>
        </div>

        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className={cn(
              "flex gap-10 md:gap-14 w-max",
              "animate-[leaders-marquee_44s_linear_infinite]"
            )}
            style={{ animationPlayState: paused ? "paused" : "running" }}
          >
            {doubled.map((l, i) => (
              <LeaderPastille key={`${l.name}-${i}`} name={l.name} />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
        </div>

        <style jsx>{`
          @keyframes leaders-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </Container>
    </section>
  );
}

function LeaderPastille({ name }) {
  return (
    <span
      aria-label={name}
      className="inline-flex items-center gap-3 px-5 h-12 rounded-full border border-white/15 text-foreground/80 hover:text-foreground hover:border-white/35 transition-colors duration-200 select-none whitespace-nowrap"
    >
      <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-current" />
      <span className="text-xs md:text-sm tracking-[0.22em] font-medium">{name}</span>
    </span>
  );
}
