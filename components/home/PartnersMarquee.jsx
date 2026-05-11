"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Liste des entreprises partenaires affichées dans le carousel.
 * Ajoute simplement un objet { name, alt, src } pour chaque nouvelle entreprise.
 */
const PARTNERS = [
  {
    name: "Major Exchanges",
    alt: "Major Exchanges",
    src: "/images/partners/major-exchanges.png",
  },
  {
    name: "Roder 5",
    alt: "Roder 5 — Optimizing Potential",
    src: "/images/partners/roder5.png",
  },
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

const AUTO_SCROLL_PX_PER_SEC = 38; // vitesse auto-scroll
const RESUME_AFTER_MS = 2200;       // délai avant reprise après interaction utilisateur

/**
 * Carousel partenaires : auto-scrollant ET scrollable manuellement.
 * - rAF incrémente `scrollLeft` à vitesse fixe
 * - Liste dupliquée → quand on dépasse la moitié, on wrap pour boucle infinie
 * - Pause au hover, au wheel, au touch — reprise auto après ~2s d'inactivité
 */
export function PartnersMarquee() {
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const lastTsRef = useRef(0);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const doubled = [...PARTNERS, ...PARTNERS];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const pauseAndQueueResume = () => {
      pausedRef.current = true;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        pausedRef.current = false;
      }, RESUME_AFTER_MS);
    };

    const tick = (now) => {
      if (!lastTsRef.current) lastTsRef.current = now;
      const dt = now - lastTsRef.current;
      lastTsRef.current = now;

      const halfWidth = track.scrollWidth / 2;
      let pos = track.scrollLeft;

      if (!pausedRef.current && !hovered) {
        pos += (AUTO_SCROLL_PX_PER_SEC * dt) / 1000;
      }

      // Wrap dans les deux sens
      if (halfWidth > 0) {
        if (pos >= halfWidth) pos -= halfWidth;
        else if (pos < 0) pos += halfWidth;
      }

      if (pos !== track.scrollLeft) {
        track.scrollLeft = pos;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    const onWheel = () => pauseAndQueueResume();
    const onTouchStart = () => {
      pausedRef.current = true;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
    const onTouchEnd = () => pauseAndQueueResume();

    track.addEventListener("wheel", onWheel, { passive: true });
    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      track.removeEventListener("wheel", onWheel);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchend", onTouchEnd);
    };
  }, [hovered]);

  return (
    <section
      className="relative overflow-hidden bg-background py-12 md:py-16"
      aria-label="Entreprises partenaires"
    >
      <div className="relative">
        <div
          ref={trackRef}
          className="overflow-x-auto pb-2 hide-marquee-scrollbar"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="flex items-center gap-16 md:gap-24 w-max px-8">
            {doubled.map((p, i) => (
              <PartnerLogo key={`${p.name}-${i}`} partner={p} />
            ))}
          </div>
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
      </div>

      <style jsx>{`
        .hide-marquee-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-marquee-scrollbar::-webkit-scrollbar {
          display: none;
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
        draggable="false"
        className="h-14 md:h-16 w-auto max-w-[220px] object-contain opacity-75 hover:opacity-100 transition-opacity duration-200 select-none flex-shrink-0"
      />
    );
  }

  return (
    <span
      aria-label={partner.name}
      className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors duration-200 select-none whitespace-nowrap flex-shrink-0"
    >
      <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full border border-current" />
      <span className="text-sm tracking-[0.2em] font-medium">{partner.name}</span>
    </span>
  );
}
