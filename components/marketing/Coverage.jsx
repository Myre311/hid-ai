import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "./Reveal";

/**
 * Stylised Africa silhouette with hub markers. Hand-drawn simplified path
 * — readable as Africa, no fake satellite cartography.
 */
const HUBS = [
  { name: "Bonoua (NEO)", x: 26, y: 56, pilot: true },
  { name: "Abidjan", x: 25, y: 54 },
  { name: "Casablanca", x: 22, y: 18 },
  { name: "Brazzaville", x: 50, y: 65 },
  { name: "Pointe-Noire", x: 47, y: 67 },
  { name: "Dakar", x: 8, y: 44 },
  { name: "Lagos", x: 38, y: 56 },
];

const AFRICA_PATH =
  "M 30 5 L 50 5 L 65 8 L 80 12 L 82 22 L 75 32 L 68 38 L 70 48 L 65 58 L 60 70 L 55 80 L 50 92 L 45 95 L 40 88 L 32 78 L 26 68 L 22 58 L 18 50 L 15 42 L 12 32 L 8 22 L 12 14 L 20 8 Z";

export function Coverage() {
  return (
    <Section className="border-t border-border">
      <Container>
        <div className="grid md:grid-cols-[3fr_2fr] gap-12 md:gap-16 items-center">
          <Reveal>
            <div className="bg-surface border border-border rounded-lg p-6 md:p-10 relative">
              <Legend />
              <svg
                viewBox="0 0 90 100"
                className="w-full h-auto"
                role="img"
                aria-labelledby="coverage-title"
              >
                <title id="coverage-title">
                  Couverture africaine — 7 hubs Major Exchanges
                </title>
                <defs>
                  <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F4B41A" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#F4B41A" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* Continent shape */}
                <path
                  d={AFRICA_PATH}
                  fill="rgba(244, 180, 26, 0.04)"
                  stroke="rgba(244, 180, 26, 0.30)"
                  strokeWidth="0.3"
                  strokeLinejoin="round"
                />
                {/* Hubs */}
                {HUBS.map((h) => (
                  <g key={h.name}>
                    {h.pilot && (
                      <circle
                        cx={h.x}
                        cy={h.y}
                        r="3.6"
                        fill="url(#hub-glow)"
                        className="hid-pulse"
                      />
                    )}
                    <circle
                      cx={h.x}
                      cy={h.y}
                      r={h.pilot ? 1 : 0.7}
                      fill={h.pilot ? "#F4B41A" : "#FAFAFA"}
                    />
                    <text
                      x={h.x + 1.6}
                      y={h.y + 0.4}
                      fontSize="2.1"
                      fill={h.pilot ? "#F4B41A" : "rgba(250,250,250,0.7)"}
                      style={{
                        fontFamily:
                          "var(--font-inter), system-ui, sans-serif",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {h.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="flex flex-col gap-5">
              <h2 className="font-serif text-3xl md:text-5xl tracking-tighter leading-[1.05]">
                Présents là où le talent émerge.
              </h2>
              <p className="text-base text-muted leading-relaxed">
                Hub pilote NEO Bonoua en Côte d&rsquo;Ivoire, en cours de
                déploiement sur Abidjan, Casablanca, Brazzaville et
                Pointe-Noire. Lagos et Dakar suivent dans la roadmap 2027.
              </p>
              <p className="text-sm text-muted-strong leading-relaxed">
                Une présence physique d&rsquo;ancrage dans chaque marché,
                doublée d&rsquo;une capacité virtuelle pour les profils en
                télétravail certifiés.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function Legend() {
  return (
    <div className="absolute right-4 top-4 md:right-6 md:top-6 flex flex-col gap-2 text-[11px] text-muted">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span>Hub pilote</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-foreground/70" />
        <span>Hubs en ouverture</span>
      </div>
    </div>
  );
}
