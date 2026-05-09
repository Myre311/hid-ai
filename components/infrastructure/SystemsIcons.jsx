/**
 * 5 icônes "3D illustration" en SVG pour le carousel SystemsCarousel.
 * - viewBox 0 0 80 80
 * - Gradients métalliques (zinc-300 → zinc-500 → zinc-700) avec touche d'accent ambre
 * - Ombres portées via SVG filter
 * - Vue isométrique 3/4
 *
 * Toutes les icônes héritent de la couleur via fill="currentColor" sur les
 * traits secondaires (lignes de connexion, etc.) — la masse principale utilise
 * les gradients pour le look métallique.
 *
 * Chaque icône a un préfixe d'ID unique pour éviter les collisions
 * dans le DOM (les IDs SVG sont globaux à la page).
 */

const METAL_STOPS = (
  <>
    <stop offset="0%" stopColor="#e4e4e7" />
    <stop offset="35%" stopColor="#a1a1aa" />
    <stop offset="65%" stopColor="#52525b" />
    <stop offset="100%" stopColor="#27272a" />
  </>
);

const ACCENT_STOPS = (
  <>
    <stop offset="0%" stopColor="#f4d066" />
    <stop offset="50%" stopColor="#c89530" />
    <stop offset="100%" stopColor="#7a5818" />
  </>
);

function Defs({ id }) {
  return (
    <defs>
      <linearGradient id={`${id}-metal`} x1="20%" y1="0%" x2="80%" y2="100%">
        {METAL_STOPS}
      </linearGradient>
      <radialGradient id={`${id}-sphere`} cx="35%" cy="30%" r="80%">
        {METAL_STOPS}
      </radialGradient>
      <linearGradient id={`${id}-accent`} x1="0%" y1="0%" x2="100%" y2="100%">
        {ACCENT_STOPS}
      </linearGradient>
      <filter id={`${id}-drop`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.6" />
        <feOffset dx="0" dy="2" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.55" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

const baseSvgProps = {
  viewBox: "0 0 80 80",
  xmlns: "http://www.w3.org/2000/svg",
  className: "w-full h-full",
  "aria-hidden": true,
};

// 1. FLOW MANAGER — réseau de 3 sphères connectées
export function FlowManagerIcon() {
  const id = "flow";
  return (
    <svg {...baseSvgProps}>
      <Defs id={id} />
      <g filter={`url(#${id}-drop)`}>
        {/* Liens (en arrière) */}
        <line x1="40" y1="22" x2="22" y2="56" stroke={`url(#${id}-metal)`} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="40" y1="22" x2="58" y2="56" stroke={`url(#${id}-metal)`} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="22" y1="56" x2="58" y2="56" stroke={`url(#${id}-metal)`} strokeWidth="1.6" strokeLinecap="round" />
        {/* Sphère du haut, accent ambre */}
        <circle cx="40" cy="22" r="9" fill={`url(#${id}-accent)`} />
        <circle cx="37" cy="19" r="2.5" fill="#fff8e0" opacity="0.7" />
        {/* Sphères basses, métalliques */}
        <circle cx="22" cy="56" r="8" fill={`url(#${id}-sphere)`} />
        <circle cx="20" cy="53" r="2" fill="#f4f4f5" opacity="0.8" />
        <circle cx="58" cy="56" r="8" fill={`url(#${id}-sphere)`} />
        <circle cx="56" cy="53" r="2" fill="#f4f4f5" opacity="0.8" />
      </g>
    </svg>
  );
}

// 2. CHATBOT GATEKEEPER — tour fortifiée avec œil de surveillance
export function ChatbotGatekeeperIcon() {
  const id = "gate";
  return (
    <svg {...baseSvgProps}>
      <Defs id={id} />
      <g filter={`url(#${id}-drop)`}>
        {/* Base de la tour (parallélogramme isométrique) */}
        <path
          d="M 22 60 L 22 32 L 40 26 L 58 32 L 58 60 L 40 66 Z"
          fill={`url(#${id}-metal)`}
        />
        {/* Toit créneau */}
        <path
          d="M 22 32 L 26 30 L 26 26 L 30 25 L 30 28 L 34 27 L 34 24 L 38 23 L 38 26 L 42 25 L 42 22 L 46 23 L 46 26 L 50 27 L 50 24 L 54 25 L 54 28 L 58 32 L 40 38 Z"
          fill={`url(#${id}-sphere)`}
        />
        {/* Face avant un peu plus claire */}
        <path
          d="M 22 32 L 22 60 L 40 66 L 40 38 Z"
          fill="#000"
          opacity="0.18"
        />
        {/* Œil au centre */}
        <ellipse cx="33" cy="48" rx="6" ry="3.2" fill="#0a0a0c" />
        <circle cx="33" cy="48" r="2.2" fill={`url(#${id}-accent)`} />
        <circle cx="32" cy="47" r="0.8" fill="#fff8e0" />
      </g>
    </svg>
  );
}

// 3. DATA GATEWAY SÉCURISÉ — portail arche avec bouclier
export function DataGatewayIcon() {
  const id = "data";
  return (
    <svg {...baseSvgProps}>
      <Defs id={id} />
      <g filter={`url(#${id}-drop)`}>
        {/* Socle isométrique */}
        <path
          d="M 16 60 L 40 70 L 64 60 L 40 50 Z"
          fill={`url(#${id}-metal)`}
        />
        {/* Arche extérieure (rectangle arrondi en haut) */}
        <path
          d="M 22 58 L 22 36 Q 22 16 40 16 Q 58 16 58 36 L 58 58 L 50 56 L 50 38 Q 50 26 40 26 Q 30 26 30 38 L 30 56 Z"
          fill={`url(#${id}-metal)`}
        />
        {/* Bouclier accent */}
        <path
          d="M 40 32 L 47 35 L 47 42 Q 47 48 40 52 Q 33 48 33 42 L 33 35 Z"
          fill={`url(#${id}-accent)`}
        />
        {/* Highlight sur le bouclier */}
        <path
          d="M 40 32 L 47 35 L 47 39 Q 43 38 40 38 Z"
          fill="#fff8e0"
          opacity="0.4"
        />
      </g>
    </svg>
  );
}

// 4. ALGORITHME DE MATCHING — deux flèches qui convergent
export function MatchingIcon() {
  const id = "match";
  return (
    <svg {...baseSvgProps}>
      <Defs id={id} />
      <g filter={`url(#${id}-drop)`}>
        {/* Disque central de connexion */}
        <ellipse cx="40" cy="40" rx="9" ry="4.5" fill={`url(#${id}-accent)`} />
        <ellipse cx="40" cy="38" rx="6" ry="2.5" fill="#fff8e0" opacity="0.55" />
        {/* Flèche gauche → centre */}
        <path
          d="M 8 40 L 22 30 L 22 36 L 32 36 L 32 44 L 22 44 L 22 50 Z"
          fill={`url(#${id}-metal)`}
        />
        {/* Flèche droite → centre */}
        <path
          d="M 72 40 L 58 30 L 58 36 L 48 36 L 48 44 L 58 44 L 58 50 Z"
          fill={`url(#${id}-sphere)`}
        />
      </g>
    </svg>
  );
}

// 5. SCORING DYNAMIQUE — jauge/cadran avec aiguille
export function ScoringIcon() {
  const id = "score";
  return (
    <svg {...baseSvgProps}>
      <Defs id={id} />
      <g filter={`url(#${id}-drop)`}>
        {/* Socle isométrique */}
        <ellipse cx="40" cy="62" rx="22" ry="5" fill={`url(#${id}-metal)`} />
        {/* Demi-cercle de la jauge (background) */}
        <path
          d="M 18 56 A 22 22 0 0 1 62 56 Z"
          fill={`url(#${id}-metal)`}
        />
        {/* Arc accent (du min au pivot) */}
        <path
          d="M 22 56 A 18 18 0 0 1 58 56"
          fill="none"
          stroke={`url(#${id}-accent)`}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Graduations */}
        <line x1="22" y1="56" x2="20" y2="58" stroke="#27272a" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="40" y1="38" x2="40" y2="35" stroke="#27272a" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="58" y1="56" x2="60" y2="58" stroke="#27272a" strokeWidth="1.2" strokeLinecap="round" />
        {/* Aiguille (vers le haut-droite) */}
        <path
          d="M 40 56 L 53 40 L 41 53 Z"
          fill={`url(#${id}-accent)`}
        />
        {/* Pivot central */}
        <circle cx="40" cy="56" r="3" fill="#27272a" />
        <circle cx="40" cy="56" r="1.5" fill={`url(#${id}-accent)`} />
      </g>
    </svg>
  );
}
