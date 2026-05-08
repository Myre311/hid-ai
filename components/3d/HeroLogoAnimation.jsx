"use client";

/**
 * Hero brand animation — pas de WebGL.
 * Le D triangulaire du logo s'anime en 3D (perspective + rotateY oscillant)
 * tandis que la boussole tourne sur elle-même au centroïde du triangle.
 *
 * Centroïde du triangle (14,0)–(14,100)–(100,50) ≈ (42.66, 50).
 *
 * Implémentation:
 *   - Les arms de la boussole sont placés en coordonnées absolues du viewBox
 *     (pas de translate parent), pour que la rotation pivote vraiment autour
 *     du centroïde via `transform-box: view-box; transform-origin: 42.66px 50px`.
 *   - L'asymétrie de la flèche est (32px) ne déplace plus la rotation.
 *
 * Respecte prefers-reduced-motion.
 */
const CX = 42.66;
const CY = 50;

export function HeroLogoAnimation({ className }) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{ pointerEvents: "none", perspective: "1100px" }}
    >
      <div className="hidai-twist relative h-full w-full flex items-center justify-center">
        {/* Soft amber halo behind the logo */}
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

          {/* Compass rose — children in viewBox absolute coords, rotates around (42.66, 50) */}
          <g
            className="hidai-compass"
            style={{
              transformBox: "view-box",
              transformOrigin: `${CX}px ${CY}px`,
            }}
          >
            {/* Outer ring */}
            <circle cx={CX} cy={CY} r="22" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.18" />

            {/* Cardinal arms — N, S, W (white) — points relative to centroid */}
            <polygon
              points={`${CX},${CY - 22} ${CX + 3},${CY} ${CX - 3},${CY}`}
              fill="currentColor"
            />
            <polygon
              points={`${CX},${CY + 22} ${CX + 3},${CY} ${CX - 3},${CY}`}
              fill="currentColor"
            />
            <polygon
              points={`${CX - 12},${CY} ${CX},${CY - 3} ${CX},${CY + 3}`}
              fill="currentColor"
            />

            {/* East — amber, longer */}
            <polygon
              points={`${CX + 32},${CY} ${CX},${CY - 3} ${CX},${CY + 3}`}
              fill="#F4B41A"
            />

            {/* Inner hub */}
            <circle cx={CX} cy={CY} r="5.5" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
            <circle cx={CX} cy={CY} r="2.6" fill="currentColor" />
            <circle cx={CX} cy={CY} r="1" fill="#F4B41A" />
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
          0% { transform: rotateY(-42deg) rotateX(6deg); }
          50% { transform: rotateY(38deg) rotateX(-6deg); }
          100% { transform: rotateY(-42deg) rotateX(6deg); }
        }
        @keyframes hidai-compass-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
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
