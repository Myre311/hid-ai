"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * SVG world map (Robinson-projection-ish, simplifié) avec points HID AI.
 * - FR (Direction): Marseille, Toulouse — accent jaune
 * - Opérationnel: Côte d'Ivoire, Maroc, Congo — gris clair
 *
 * Pas de NEO, pas de Bonoua, pas de hub pilote.
 */
const POINTS = [
  // Direction (FR)
  { id: "marseille", label: "Marseille", role: "direction", x: 506, y: 230 },
  { id: "toulouse", label: "Toulouse", role: "direction", x: 498, y: 232 },
  // Opérationnel
  { id: "maroc", label: "Maroc · Casablanca", role: "operational", x: 480, y: 260 },
  { id: "civ", label: "Côte d'Ivoire · Abidjan", role: "operational", x: 482, y: 332 },
  { id: "congo", label: "Congo Brazzaville", role: "operational", x: 528, y: 372 },
];

export function WorldMap() {
  const [hover, setHover] = useState(null);

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-auto bg-background"
        role="img"
        aria-label="Présence HID AI — Direction France, Opérationnel Côte d'Ivoire, Maroc, Congo Brazzaville"
      >
        {/* Stylised continents — simplified path */}
        <g
          fill="none"
          stroke="#26262C"
          strokeWidth="1"
          strokeLinejoin="round"
        >
          {/* Africa */}
          <path d="M 460 230 L 520 220 L 560 230 L 590 260 L 605 295 L 595 335 L 585 380 L 558 410 L 525 415 L 495 395 L 475 360 L 462 320 L 460 280 Z" />
          {/* Europe */}
          <path d="M 460 200 L 520 190 L 555 195 L 575 215 L 565 235 L 525 245 L 495 240 L 470 225 Z" />
          {/* Americas (simplified blocks) */}
          <path d="M 200 175 L 260 170 L 295 200 L 290 240 L 265 275 L 240 295 L 215 280 L 195 240 Z" />
          <path d="M 240 305 L 280 305 L 305 335 L 320 380 L 305 425 L 280 445 L 255 425 L 245 385 L 240 345 Z" />
          {/* Asia */}
          <path d="M 575 175 L 700 170 L 770 185 L 820 215 L 815 250 L 770 270 L 720 270 L 660 255 L 615 235 L 580 215 Z" />
          {/* India */}
          <path d="M 660 270 L 710 270 L 720 305 L 700 335 L 680 325 L 670 300 Z" />
          {/* Australia */}
          <path d="M 790 350 L 855 345 L 870 375 L 855 400 L 820 405 L 790 380 Z" />
        </g>

        {/* Subtle grid lines */}
        <g stroke="#1a1a1f" strokeWidth="0.5" opacity="0.6">
          <line x1="0" y1="250" x2="1000" y2="250" />
          <line x1="500" y1="0" x2="500" y2="500" />
        </g>

        {/* Points */}
        {POINTS.map((p) => {
          const isDirection = p.role === "direction";
          const isHover = hover === p.id;
          return (
            <g
              key={p.id}
              transform={`translate(${p.x}, ${p.y})`}
              onMouseEnter={() => setHover(p.id)}
              onMouseLeave={() => setHover(null)}
              className="cursor-pointer"
            >
              <circle
                r={isHover ? 12 : 9}
                fill={isDirection ? "#F4B41A" : "#FAFAFA"}
                opacity={isHover ? 0.18 : 0.12}
                className="transition-all"
              />
              <circle
                r={isHover ? 4 : 3}
                fill={isDirection ? "#F4B41A" : "#FAFAFA"}
              />
            </g>
          );
        })}
      </svg>

      {/* Floating label on hover */}
      {hover && (
        <div
          className={cn(
            "absolute pointer-events-none px-3 py-2 rounded-md border bg-surface text-xs",
            "transform -translate-x-1/2 -translate-y-full",
            "whitespace-nowrap"
          )}
          style={{
            left: `${(POINTS.find((p) => p.id === hover).x / 1000) * 100}%`,
            top: `${(POINTS.find((p) => p.id === hover).y / 500) * 100}%`,
            marginTop: "-12px",
          }}
        >
          {(() => {
            const p = POINTS.find((p) => p.id === hover);
            const isDirection = p.role === "direction";
            return (
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    isDirection ? "bg-accent" : "bg-foreground"
                  )}
                />
                <span className="text-foreground">{p.label}</span>
                <span className="text-muted">·</span>
                <span className="text-muted">
                  {isDirection ? "Direction" : "Opérationnel"}
                </span>
              </div>
            );
          })()}
        </div>
      )}

      {/* Légende */}
      <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-muted">
        <div className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span>Direction · France</span>
        </div>
        <div className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-foreground" />
          <span>Opérationnel · Côte d&rsquo;Ivoire, Maroc, Congo Brazzaville</span>
        </div>
      </div>
    </div>
  );
}
