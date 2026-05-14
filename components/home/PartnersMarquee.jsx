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

/**
 * Carousel partenaires : défilement CSS continu, non-interruptible.
 * - Animation `translateX(-50%)` infinie sur la track dupliquée → boucle invisible
 * - `pointer-events: none` empêche tout scroll, touch, hover, wheel
 * - Respecte `prefers-reduced-motion` (animation stoppée pour les sensibles)
 */
export function PartnersMarquee() {
  const doubled = [...PARTNERS, ...PARTNERS];

  return (
    <section
      className="relative overflow-hidden bg-background py-12 md:py-16"
      aria-label="Entreprises partenaires"
    >
      <div className="relative overflow-hidden" style={{ minHeight: "5rem" }}>
        <div className="hid-marquee-track flex items-center gap-10 md:gap-24 w-max">
          {doubled.map((p, i) => (
            <PartnerLogo key={`${p.name}-${i}`} partner={p} />
          ))}
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />
      </div>
    </section>
  );
}

function PartnerLogo({ partner }) {
  // Wrapper avec largeur fixe → la track conserve sa largeur même si les
  // images externes mettent du temps à charger ou échouent sur mobile.
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center h-14 md:h-16 w-[120px] md:w-[180px]"
      aria-label={partner.alt ?? partner.name}
    >
      {partner.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={partner.src}
          alt={partner.alt ?? partner.name}
          loading="eager"
          decoding="async"
          draggable="false"
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full object-contain opacity-75 select-none"
        />
      ) : (
        <span className="inline-flex items-center gap-2 text-foreground/70 select-none whitespace-nowrap">
          <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full border border-current" />
          <span className="text-sm tracking-[0.2em] font-medium">{partner.name}</span>
        </span>
      )}
    </div>
  );
}
