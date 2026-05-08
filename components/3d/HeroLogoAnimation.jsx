"use client";

/**
 * Hero brand animation — pas de WebGL.
 * Le D triangulaire du logo HID AI s'anime en 3D (perspective + rotateY oscillant)
 * tandis que la boussole intérieure tourne en continu.
 *
 * Tout en CSS keyframes + SVG inline → léger, pas de cleanup, mobile-friendly.
 * Respecte prefers-reduced-motion (animations off).
 */
export function HeroLogoAnimation({ className }) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{ pointerEvents: "none", perspective: "900px" }}
    >
      <div className="hidai-d-twist absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-[60%] max-w-[420px] h-auto text-foreground drop-shadow-[0_0_36px_rgba(244,180,26,0.18)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          <title>HID AI — D et boussole animés</title>

          {/* D : vertical spine + 2 diagonals forming triangle outline */}
          <g fill="currentColor">
            <rect x="0" y="0" width="14" height="100" />
          </g>
          <g
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="square"
            fill="none"
          >
            <line x1="14" y1="0" x2="100" y2="50" />
            <line x1="14" y1="100" x2="100" y2="50" />
          </g>

          {/* Glow line under the diagonals — amber accent */}
          <g
            stroke="#F4B41A"
            strokeWidth="1"
            strokeLinecap="square"
            fill="none"
            opacity="0.55"
          >
            <line x1="14" y1="0" x2="100" y2="50" />
            <line x1="14" y1="100" x2="100" y2="50" />
          </g>

          {/* Compass rose — rotates continuously around its center */}
          <g
            transform="translate(38, 50)"
            className="hidai-compass"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          >
            <g fill="currentColor">
              <polygon points="0,-22 3,0 -3,0" />
              <polygon points="0,22 3,0 -3,0" />
              <polygon points="-12,0 0,-3 0,3" />
            </g>
            <g>
              <polygon points="32,0 0,-3 0,3" fill="#F4B41A" />
            </g>
            <circle cx="0" cy="0" r="5" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
            <circle cx="0" cy="0" r="2.4" fill="currentColor" />
          </g>
        </svg>
      </div>

      <style jsx>{`
        .hidai-d-twist {
          animation: hidai-twist 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          transform-style: preserve-3d;
          will-change: transform;
        }
        :global(.hidai-compass) {
          animation: hidai-compass-spin 14s linear infinite;
        }
        @keyframes hidai-twist {
          0% {
            transform: rotateY(-32deg) rotateX(4deg);
          }
          50% {
            transform: rotateY(28deg) rotateX(-4deg);
          }
          100% {
            transform: rotateY(-32deg) rotateX(4deg);
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
          .hidai-d-twist {
            animation: none;
            transform: rotateY(-12deg);
          }
          :global(.hidai-compass) {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
