/**
 * Génère 5 scènes SVG pour le test bbox (CV) + 1 scène polygone.
 *
 * Chaque scène contient les objets aux positions exactes du ground truth
 * (lib/evaluation/data/cv-ground-truth.js) pour que le candidat puisse
 * les identifier visuellement et dessiner les bounding boxes correspondantes.
 *
 * Style : illustrations vectorielles minimales mais reconnaissables.
 * Format : 800×600 viewBox 0-1 (coordonnées normalisées du ground truth ×
 * dimensions). Bg neutre, palette sobre cohérente avec le test tracking.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const W = 800;
const H = 600;
const OUT_BBOX = resolve(dirname(fileURLToPath(import.meta.url)), "..", "public", "evaluation", "cv", "bboxes");
const OUT_POLY = resolve(dirname(fileURLToPath(import.meta.url)), "..", "public", "evaluation", "cv", "polygon");
mkdirSync(OUT_BBOX, { recursive: true });
mkdirSync(OUT_POLY, { recursive: true });

const BG = `<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a1d2e"/>
      <stop offset="100%" stop-color="#0d0e18"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>`;

function svgFrame(content, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
  ${BG}
  ${content}
  <g>
    <rect x="8" y="8" width="200" height="22" rx="3" fill="rgba(0,0,0,0.6)"/>
    <text x="14" y="23" font-family="monospace" font-size="11" fill="#e8e8ef">${label}</text>
  </g>
</svg>`;
}

// ──────────────────────────────────────────────────────────────────────
// Personne stylisée à une position normalisée (x,y,w,h) avec casque jaune
// ──────────────────────────────────────────────────────────────────────
function person({ x, y, w, h }, helmet = "#F4B41A") {
  const X = x * W, Y = y * H, BW = w * W, BH = h * H;
  const cx = X + BW / 2;
  const headR = BW * 0.25;
  const headCy = Y + headR + BH * 0.06;
  return `
    <g>
      <!-- corps -->
      <path d="M ${(cx - BW * 0.3).toFixed(1)} ${(Y + BH).toFixed(1)}
               L ${(cx - BW * 0.35).toFixed(1)} ${(Y + BH * 0.45).toFixed(1)}
               L ${(cx + BW * 0.35).toFixed(1)} ${(Y + BH * 0.45).toFixed(1)}
               L ${(cx + BW * 0.3).toFixed(1)} ${(Y + BH).toFixed(1)} Z"
            fill="#3a3d4d" stroke="#0f1018" stroke-width="0.8"/>
      <!-- cou -->
      <rect x="${(cx - BW * 0.08).toFixed(1)}" y="${(Y + BH * 0.38).toFixed(1)}"
            width="${(BW * 0.16).toFixed(1)}" height="${(BH * 0.08).toFixed(1)}" fill="#d6b48a"/>
      <!-- tête -->
      <circle cx="${cx.toFixed(1)}" cy="${headCy.toFixed(1)}" r="${headR.toFixed(1)}" fill="#d6b48a" stroke="#0f1018" stroke-width="0.8"/>
      <!-- casque (demi-cercle au-dessus) -->
      <path d="M ${(cx - headR * 1.1).toFixed(1)} ${headCy.toFixed(1)}
               a ${(headR * 1.1).toFixed(1)} ${(headR * 0.9).toFixed(1)} 0 0 1 ${(headR * 2.2).toFixed(1)} 0 Z"
            fill="${helmet}" stroke="#0f1018" stroke-width="0.8"/>
      <rect x="${(cx - headR * 1.15).toFixed(1)}" y="${headCy.toFixed(1)}"
            width="${(headR * 2.3).toFixed(1)}" height="3" fill="${helmet}" stroke="#0f1018" stroke-width="0.4"/>
    </g>`;
}

// ──────────────────────────────────────────────────────────────────────
// Voiture vue de côté
// ──────────────────────────────────────────────────────────────────────
function car({ x, y, w, h }) {
  const X = x * W, Y = y * H, BW = w * W, BH = h * H;
  return `
    <g transform="translate(${X.toFixed(1)} ${Y.toFixed(1)})">
      <path d="M 0 ${(BH * 0.7).toFixed(1)}
               L ${(BW * 0.12).toFixed(1)} ${(BH * 0.25).toFixed(1)}
               L ${(BW * 0.5).toFixed(1)} ${(BH * 0.15).toFixed(1)}
               L ${(BW * 0.75).toFixed(1)} ${(BH * 0.25).toFixed(1)}
               L ${BW.toFixed(1)} ${(BH * 0.7).toFixed(1)} Z"
            fill="#3a4060" stroke="#0f1018" stroke-width="0.8"/>
      <path d="M ${(BW * 0.18).toFixed(1)} ${(BH * 0.3).toFixed(1)}
               L ${(BW * 0.28).toFixed(1)} ${(BH * 0.45).toFixed(1)}
               L ${(BW * 0.58).toFixed(1)} ${(BH * 0.45).toFixed(1)}
               L ${(BW * 0.68).toFixed(1)} ${(BH * 0.3).toFixed(1)} Z"
            fill="#0a0a12" opacity="0.85"/>
      <rect x="0" y="${(BH * 0.7).toFixed(1)}" width="${BW.toFixed(1)}" height="${(BH * 0.2).toFixed(1)}" fill="#2a2c3a"/>
      <circle cx="${(BW * 0.22).toFixed(1)}" cy="${(BH * 0.92).toFixed(1)}" r="${(BH * 0.13).toFixed(1)}" fill="#0f1018"/>
      <circle cx="${(BW * 0.78).toFixed(1)}" cy="${(BH * 0.92).toFixed(1)}" r="${(BH * 0.13).toFixed(1)}" fill="#0f1018"/>
    </g>`;
}

// ──────────────────────────────────────────────────────────────────────
// Panneau STOP octogonal
// ──────────────────────────────────────────────────────────────────────
function stopSign({ x, y, w, h }) {
  const X = x * W, Y = y * H, BW = w * W, BH = h * H;
  const cx = X + BW / 2;
  const cy = Y + BH * 0.4;
  const r = Math.min(BW, BH) * 0.4;
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 8) + (i * Math.PI / 4);
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `
    <g>
      <rect x="${(cx - 2).toFixed(1)}" y="${cy.toFixed(1)}" width="4" height="${(BH * 0.5).toFixed(1)}" fill="#3a3d4d"/>
      <polygon points="${pts.join(" ")}" fill="#c8211a" stroke="#fafafa" stroke-width="2"/>
      <text x="${cx.toFixed(1)}" y="${(cy + 4).toFixed(1)}" text-anchor="middle" font-family="sans-serif" font-size="${(r * 0.55).toFixed(1)}" font-weight="700" fill="#fafafa">STOP</text>
    </g>`;
}

// ──────────────────────────────────────────────────────────────────────
// Visage
// ──────────────────────────────────────────────────────────────────────
function face({ x, y, w, h }) {
  const X = x * W, Y = y * H, BW = w * W, BH = h * H;
  const cx = X + BW / 2;
  const cy = Y + BH / 2;
  const r = Math.min(BW, BH) * 0.45;
  return `
    <g>
      <ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${r.toFixed(1)}" ry="${(r * 1.15).toFixed(1)}" fill="#d6b48a" stroke="#0f1018" stroke-width="0.8"/>
      <ellipse cx="${(cx - r * 0.32).toFixed(1)}" cy="${(cy - r * 0.15).toFixed(1)}" rx="${(r * 0.1).toFixed(1)}" ry="${(r * 0.08).toFixed(1)}" fill="#1f2030"/>
      <ellipse cx="${(cx + r * 0.32).toFixed(1)}" cy="${(cy - r * 0.15).toFixed(1)}" rx="${(r * 0.1).toFixed(1)}" ry="${(r * 0.08).toFixed(1)}" fill="#1f2030"/>
      <path d="M ${(cx - r * 0.25).toFixed(1)} ${(cy + r * 0.35).toFixed(1)} Q ${cx.toFixed(1)} ${(cy + r * 0.5).toFixed(1)}, ${(cx + r * 0.25).toFixed(1)} ${(cy + r * 0.35).toFixed(1)}" stroke="#1f2030" stroke-width="1.5" fill="none"/>
      <path d="M ${(cx - r * 0.5).toFixed(1)} ${(cy - r * 0.6).toFixed(1)} Q ${cx.toFixed(1)} ${(cy - r * 0.9).toFixed(1)}, ${(cx + r * 0.5).toFixed(1)} ${(cy - r * 0.6).toFixed(1)} L ${(cx + r * 0.5).toFixed(1)} ${(cy - r * 0.3).toFixed(1)} L ${(cx - r * 0.5).toFixed(1)} ${(cy - r * 0.3).toFixed(1)} Z" fill="#3a2a1a"/>
    </g>`;
}

// ──────────────────────────────────────────────────────────────────────
// Outil (clé à molette stylisée)
// ──────────────────────────────────────────────────────────────────────
function wrench({ x, y, w, h }) {
  const X = x * W, Y = y * H, BW = w * W, BH = h * H;
  return `
    <g transform="translate(${X.toFixed(1)} ${Y.toFixed(1)})">
      <rect x="${(BW * 0.15).toFixed(1)}" y="${(BH * 0.4).toFixed(1)}" width="${(BW * 0.7).toFixed(1)}" height="${(BH * 0.18).toFixed(1)}" fill="#9a9eaa" stroke="#0f1018" stroke-width="0.8" rx="3"/>
      <circle cx="${(BW * 0.12).toFixed(1)}" cy="${(BH * 0.49).toFixed(1)}" r="${(BH * 0.22).toFixed(1)}" fill="#9a9eaa" stroke="#0f1018" stroke-width="0.8"/>
      <circle cx="${(BW * 0.12).toFixed(1)}" cy="${(BH * 0.49).toFixed(1)}" r="${(BH * 0.1).toFixed(1)}" fill="#0d0e18"/>
      <circle cx="${(BW * 0.88).toFixed(1)}" cy="${(BH * 0.49).toFixed(1)}" r="${(BH * 0.25).toFixed(1)}" fill="#9a9eaa" stroke="#0f1018" stroke-width="0.8"/>
      <rect x="${(BW * 0.72).toFixed(1)}" y="${(BH * 0.3).toFixed(1)}" width="${(BW * 0.18).toFixed(1)}" height="${(BH * 0.05).toFixed(1)}" fill="#0d0e18"/>
    </g>`;
}

// ──────────────────────────────────────────────────────────────────────
// Génération des 5 scènes bbox + 1 polygone
// ──────────────────────────────────────────────────────────────────────

const SCENES = [
  {
    file: "img-1.svg",
    label: "Personnes avec casque",
    boxes: [
      { x: 0.12, y: 0.18, w: 0.18, h: 0.45 },
      { x: 0.42, y: 0.22, w: 0.16, h: 0.4 },
      { x: 0.7, y: 0.2, w: 0.17, h: 0.43 },
    ],
    render: (b) => person(b, "#F4B41A"),
  },
  {
    file: "img-2.svg",
    label: "Voitures",
    boxes: [
      { x: 0.05, y: 0.4, w: 0.28, h: 0.32 },
      { x: 0.36, y: 0.42, w: 0.3, h: 0.33 },
      { x: 0.7, y: 0.38, w: 0.28, h: 0.36 },
    ],
    render: car,
  },
  {
    file: "img-3.svg",
    label: "Panneaux de signalisation",
    boxes: [
      { x: 0.15, y: 0.1, w: 0.12, h: 0.18 },
      { x: 0.65, y: 0.08, w: 0.13, h: 0.2 },
    ],
    render: stopSign,
  },
  {
    file: "img-4.svg",
    label: "Visages",
    boxes: [
      { x: 0.2, y: 0.25, w: 0.15, h: 0.22 },
      { x: 0.55, y: 0.28, w: 0.14, h: 0.21 },
      { x: 0.78, y: 0.3, w: 0.12, h: 0.18 },
    ],
    render: face,
  },
  {
    file: "img-5.svg",
    label: "Outils mécaniques",
    boxes: [
      { x: 0.1, y: 0.35, w: 0.22, h: 0.3 },
      { x: 0.4, y: 0.4, w: 0.18, h: 0.32 },
      { x: 0.65, y: 0.35, w: 0.25, h: 0.3 },
    ],
    render: wrench,
  },
];

let n = 0;
for (const scene of SCENES) {
  const content = scene.boxes.map(scene.render).join("\n");
  writeFileSync(`${OUT_BBOX}/${scene.file}`, svgFrame(content, scene.label), "utf8");
  n++;
}

// ──────────────────────────────────────────────────────────────────────
// Polygone — bâtiment vu du ciel (forme L)
// ──────────────────────────────────────────────────────────────────────
const polygonScene = `
  <!-- Sol / terrain -->
  <rect x="0" y="0" width="${W}" height="${H}" fill="#1c1e2a"/>
  <rect x="60" y="60" width="${W - 120}" height="${H - 120}" fill="#28293a" opacity="0.5"/>

  <!-- Bâtiment principal (forme L) -->
  <g>
    <path d="M ${W * 0.22} ${H * 0.2}
             L ${W * 0.62} ${H * 0.2}
             L ${W * 0.62} ${H * 0.5}
             L ${W * 0.78} ${H * 0.5}
             L ${W * 0.78} ${H * 0.78}
             L ${W * 0.22} ${H * 0.78} Z"
          fill="#4a5070" stroke="#fafafa" stroke-width="0.5" stroke-dasharray="3,2"/>
    <!-- Détails toiture -->
    <line x1="${W * 0.22}" y1="${H * 0.49}" x2="${W * 0.62}" y2="${H * 0.49}" stroke="#2a2c3a" stroke-width="1"/>
    <line x1="${W * 0.42}" y1="${H * 0.2}" x2="${W * 0.42}" y2="${H * 0.78}" stroke="#2a2c3a" stroke-width="1"/>
    <!-- Ombre côté -->
    <rect x="${W * 0.62}" y="${H * 0.2}" width="6" height="${H * 0.3}" fill="rgba(0,0,0,0.4)"/>
    <rect x="${W * 0.22}" y="${H * 0.78}" width="${W * 0.56}" height="4" fill="rgba(0,0,0,0.4)"/>
  </g>

  <!-- Végétation autour pour contexte -->
  <circle cx="${W * 0.12}" cy="${H * 0.35}" r="22" fill="#2e3a28" opacity="0.7"/>
  <circle cx="${W * 0.88}" cy="${H * 0.3}" r="18" fill="#2e3a28" opacity="0.7"/>
  <circle cx="${W * 0.12}" cy="${H * 0.7}" r="20" fill="#2e3a28" opacity="0.7"/>
  <circle cx="${W * 0.88}" cy="${H * 0.85}" r="22" fill="#2e3a28" opacity="0.7"/>
`;

writeFileSync(`${OUT_POLY}/poly-1.svg`, svgFrame(polygonScene, "Vue aérienne — bâtiment forme L"), "utf8");
n++;

console.log(`✅ ${n} scènes générées :`);
console.log(`   ${OUT_BBOX}/img-{1..5}.svg`);
console.log(`   ${OUT_POLY}/poly-1.svg`);
