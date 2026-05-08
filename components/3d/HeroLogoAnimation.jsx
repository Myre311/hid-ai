"use client";

/**
 * Hero brand animation — pas de WebGL.
 * Le D triangulaire du logo HID AI s'anime en 3D (perspective + rotateY oscillant)
 * tandis que la boussole intérieure tourne en continu autour du centroïde du triangle.
 *
 * Centroide du triangle (14,0)–(14,100)–(100,50) ≈ (42.66, 50) → compass x=42.66.
 *
 * Tout en CSS keyframes + SVG inline.
 * Respecte prefers-reduced-motion (animations off).
 */
export function HeroLogoAnimation({ className }) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{ pointerEvents: "none", perspective: "1100px" }}
    >
      <div className="hidai-twist relative h-full w-full flex items-center justify-center">
        {/* Soft amber halo behind the logo for depth */}
        <div
          aria-hidden="true"
          className="absolute h-[60%] w-[60%] max-h-[420px] max-w-[420px] rounded-full bg-[radial-gradient(circle,rgba(244,180,26,0.20)_0%,transparent_65%)] blur-2xl"
        />

        <svg
          viewBox="0 0 100 100"
          className="relative w-[80%] max-w-[480px] h-auto text-foreground drop-shadow-[0_0_28px_rgba(244,180,26,0.35)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          <title>HID AI — D et boussole animés</title>

          {/* D : spine vertical */}
          <rect x="0" y="0" width="14" height="100" fill="currentColor" />

          {/* D : diagonals — main stroke + amber accent layer */}
          <line x1="14" y1="0" x2="100" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
          <line x1="14" y1="100" x2="100" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
          <line x1="14" y1="0" x2="100" y2="50" stroke="#F4B41A" strokeWidth="1.4" strokeLinecap="square" opacity="0.7" />
          <line x1="14" y1="100" x2="100" y2="50" stroke="#F4B41A" strokeWidth="1.4" strokeLinecap="square" opacity="0.7" />

          {/* Compass rose — centered on the triangle centroid (42.66, 50) */}
          <g
            transform="translate(42.66, 50)"
            className="hidai-compass"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          >
            {/* Outer ring — subtle */}
            <circle cx="0" cy="0" r="22" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.18" />

            {/* Cardinal arms — N, S, W in white */}
            <polygon points="0,-22 3,0 -3,0" fill="currentColor" />
            <polygon points="0,22 3,0 -3,0" fill="currentColor" />
            <polygon points="-12,0 0,-3 0,3" fill="currentColor" />

            {/* East — amber brand accent, slightly larger */}
            <polygon points="32,0 0,-3 0,3" fill="#F4B41A" />

            {/* Inner hub */}
            <circle cx="0" cy="0" r="5.5" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
            <circle cx="0" cy="0" r="2.6" fill="currentColor" />
            <circle cx="0" cy="0" r="1" fill="#F4B41A" />
          </g>
        </svg>
      </div>

      <style jsx>{`
        .hidai-twist {
          animation: hidai-twist 7s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          transform-style: preserve-3d;
          will-change: transform;
        }
        :global(.hidai-compass) {
          animation: hidai-compass-spin 11s linear infinite;
        }
        @keyframes hidai-twist {
          0% {
            transform: rotateY(-42deg) rotateX(6deg);
          }
          50% {
            transform: rotateY(38deg) rotateX(-6deg);
          }
          100% {
            transform: rotateY(-42deg) rotateX(6deg);
          }
        }
        @keyframes hidai-compass-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hidai-twist {
            animation: none;
            transform: rotateY(-15deg);
          }
          :global(.hidai-compass) {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
