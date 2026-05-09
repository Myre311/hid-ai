"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Plus, Minus, RotateCcw } from "lucide-react";

/**
 * Carte du monde HID AI — style "néon" + zoom/pan.
 * Source TopoJSON : `world-atlas` v2 (countries-110m).
 *
 * Interactions :
 *  - Drag pour pan
 *  - Molette / pinch pour zoomer
 *  - Boutons +/-/reset overlay
 *
 * Pas de NEO, pas de Bonoua, pas de hub pilote.
 */
const TOPO_JSON_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const HIGHLIGHTED_COUNTRIES = {
  250: "direction",   // FR
  504: "operational", // MA
  384: "operational", // CI
  178: "operational", // CG (Congo Brazzaville)
};

const POINTS = [
  { id: "marseille", label: "Marseille", role: "direction", coords: [5.37, 43.30] },
  { id: "toulouse", label: "Toulouse", role: "direction", coords: [1.44, 43.60] },
  { id: "casablanca", label: "Maroc · Casablanca", role: "operational", coords: [-7.59, 33.57] },
  { id: "abidjan", label: "Côte d'Ivoire · Abidjan", role: "operational", coords: [-4.01, 5.36] },
  { id: "brazzaville", label: "Congo Brazzaville", role: "operational", coords: [15.28, -4.27] },
];

const COLORS = {
  baseFill: "#0d0d10",
  baseStroke: "#3f3f4a",
  opFill: "#2c2c34",
  opStroke: "#a6a6b3",
  dirFill: "#3a3018",
  dirStroke: "#f4b41a",
  accent: "#f4b41a",
  foreground: "#fafafa",
  tooltipBg: "#15151a",
  tooltipBorder: "#3f3f4a",
};

const INITIAL_VIEW = { coordinates: [5, 25], zoom: 1.4 };

export function WorldMap() {
  const [hover, setHover] = useState(null);
  const [view, setView] = useState(INITIAL_VIEW);

  const handleMoveEnd = (next) => setView(next);
  const zoomIn = () =>
    setView((v) => ({ ...v, zoom: Math.min(v.zoom * 1.5, 8) }));
  const zoomOut = () =>
    setView((v) => ({ ...v, zoom: Math.max(v.zoom / 1.5, 1) }));
  const reset = () => setView(INITIAL_VIEW);

  return (
    <div className="relative w-full">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 165 }}
        width={1000}
        height={500}
        className="w-full h-auto"
      >
        <defs>
          <filter id="hidai-marker-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blurred" />
            <feMerge>
              <feMergeNode in="blurred" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="hidai-country-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="blurred" />
            <feMerge>
              <feMergeNode in="blurred" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ZoomableGroup
          center={view.coordinates}
          zoom={view.zoom}
          minZoom={1}
          maxZoom={8}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={TOPO_JSON_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const id = Number(geo.id);
                const role = HIGHLIGHTED_COUNTRIES[id];
                const isHighlighted = !!role;
                const fill = !isHighlighted
                  ? COLORS.baseFill
                  : role === "direction"
                  ? COLORS.dirFill
                  : COLORS.opFill;
                const stroke = !isHighlighted
                  ? COLORS.baseStroke
                  : role === "direction"
                  ? COLORS.dirStroke
                  : COLORS.opStroke;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isHighlighted ? 0.9 : 0.5}
                    filter={isHighlighted ? "url(#hidai-country-glow)" : undefined}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {POINTS.map((p) => {
            const isDirection = p.role === "direction";
            const isHover = hover === p.id;
            const color = isDirection ? COLORS.accent : COLORS.foreground;
            // Ajustement visuel : les markers gardent leur taille apparente même en zoom élevé
            const scaleAdjust = 1 / Math.sqrt(view.zoom);
            return (
              <Marker
                key={p.id}
                coordinates={p.coords}
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}
              >
                <g transform={`scale(${scaleAdjust})`}>
                  <circle
                    r={isHover ? 18 : 14}
                    fill={color}
                    opacity={isHover ? 0.55 : 0.35}
                    filter="url(#hidai-marker-glow)"
                    style={{ transition: "all 200ms" }}
                  />
                  <circle
                    r={isHover ? 7 : 5}
                    fill={color}
                    opacity={0.55}
                    style={{ transition: "all 200ms" }}
                  />
                  <circle
                    r={isHover ? 3.2 : 2.5}
                    fill={color}
                  />
                  {isHover && (
                    <g transform="translate(0, -22)">
                      <rect
                        x={-(p.label.length * 3.5)}
                        y={-12}
                        width={p.label.length * 7}
                        height={20}
                        rx={4}
                        fill={COLORS.tooltipBg}
                        stroke={COLORS.tooltipBorder}
                        strokeWidth={0.6}
                      />
                      <text
                        textAnchor="middle"
                        y={2}
                        fontSize={10}
                        fill={COLORS.foreground}
                        style={{ pointerEvents: "none" }}
                      >
                        {p.label}
                      </text>
                    </g>
                  )}
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Contrôles de zoom */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 bg-surface/80 backdrop-blur-sm border border-border rounded-md p-1">
        <button
          type="button"
          onClick={zoomIn}
          aria-label="Zoom avant"
          className="inline-flex h-8 w-8 items-center justify-center rounded text-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={zoomOut}
          aria-label="Zoom arrière"
          className="inline-flex h-8 w-8 items-center justify-center rounded text-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Réinitialiser la vue"
          className="inline-flex h-8 w-8 items-center justify-center rounded text-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

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
        <div className="inline-flex items-center gap-2 text-muted-strong">
          <span>Cliquez-glissez pour explorer · molette pour zoomer</span>
        </div>
      </div>
    </div>
  );
}
