/**
 * Génère 50 frames SVG pour le test Computer Vision (object tracking).
 *
 * Scène : surveillance urbaine — personne traversant une rue piétonne.
 *  - Background : ciel dégradé + silhouettes bâtiments + trottoir + passage piéton.
 *  - Personne : silhouette stylisée (tête + corps + jambes).
 *  - Occlusions partielles :
 *      frames 15..25 → poteau (partial-pole) coupe la partie haute
 *      frames 35..40 → véhicule (partial-vehicle) coupe la partie basse
 *  - Mouvement : x linéaire de 0.08 à 0.86 (cohérent avec CV_TRACKING_GROUND_TRUTH).
 *
 * Usage :  node scripts/generate-cv-tracking-frames.mjs
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const W = 640;
const H = 360;
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "public", "evaluation", "cv", "tracking");
mkdirSync(OUT, { recursive: true });

// Coordonnées normalisées de la personne (alignées sur CV_TRACKING_GROUND_TRUTH)
function personBbox(i) {
  const x = 0.08 + i * 0.0156;
  return { x: x * W, y: 0.42 * H, w: 0.094 * W, h: 0.33 * H };
}

function isOcclusion(i) {
  if (i >= 14 && i <= 24) return "pole";
  if (i >= 34 && i <= 39) return "vehicle";
  return null;
}

// ──────────────────────────────────────────────────────────────────────
// Personne stylisée — tête + buste + jambes (jambes alternent par frame)
// ──────────────────────────────────────────────────────────────────────
function person(i) {
  const { x, y, w, h } = personBbox(i);
  const headR = w * 0.32;
  const cx = x + w / 2;
  const headCy = y + headR;
  const torsoTopY = headCy + headR + 2;
  const torsoBottomY = y + h * 0.62;
  // Animation de marche : alternance des jambes
  const phase = (i % 4) / 4; // 0, 0.25, 0.5, 0.75
  const stride = w * 0.18 * Math.sin(phase * Math.PI * 2);

  return `
    <!-- Personne #${i + 1} -->
    <g aria-label="person-1">
      <!-- ombre au sol -->
      <ellipse cx="${cx.toFixed(1)}" cy="${(y + h - 2).toFixed(1)}" rx="${(w * 0.4).toFixed(1)}" ry="3" fill="rgba(0,0,0,0.35)" />
      <!-- jambes -->
      <line x1="${(cx - stride).toFixed(1)}" y1="${torsoBottomY.toFixed(1)}"
            x2="${(cx - stride * 0.6 - w * 0.12).toFixed(1)}" y2="${(y + h - 4).toFixed(1)}"
            stroke="#1f2030" stroke-width="${(w * 0.18).toFixed(1)}" stroke-linecap="round"/>
      <line x1="${(cx + stride).toFixed(1)}" y1="${torsoBottomY.toFixed(1)}"
            x2="${(cx + stride * 0.6 + w * 0.12).toFixed(1)}" y2="${(y + h - 4).toFixed(1)}"
            stroke="#1f2030" stroke-width="${(w * 0.18).toFixed(1)}" stroke-linecap="round"/>
      <!-- buste -->
      <path d="M ${(cx - w * 0.32).toFixed(1)} ${torsoBottomY.toFixed(1)}
               L ${(cx - w * 0.38).toFixed(1)} ${torsoTopY.toFixed(1)}
               L ${(cx + w * 0.38).toFixed(1)} ${torsoTopY.toFixed(1)}
               L ${(cx + w * 0.32).toFixed(1)} ${torsoBottomY.toFixed(1)} Z"
            fill="#262838" stroke="#0f1018" stroke-width="0.8" />
      <!-- bras -->
      <line x1="${(cx - w * 0.36).toFixed(1)}" y1="${(torsoTopY + 4).toFixed(1)}"
            x2="${(cx - w * 0.48 + stride * 0.4).toFixed(1)}" y2="${(torsoBottomY - 4).toFixed(1)}"
            stroke="#262838" stroke-width="${(w * 0.14).toFixed(1)}" stroke-linecap="round"/>
      <line x1="${(cx + w * 0.36).toFixed(1)}" y1="${(torsoTopY + 4).toFixed(1)}"
            x2="${(cx + w * 0.48 - stride * 0.4).toFixed(1)}" y2="${(torsoBottomY - 4).toFixed(1)}"
            stroke="#262838" stroke-width="${(w * 0.14).toFixed(1)}" stroke-linecap="round"/>
      <!-- tête -->
      <circle cx="${cx.toFixed(1)}" cy="${headCy.toFixed(1)}" r="${headR.toFixed(1)}" fill="#d6b48a" stroke="#0f1018" stroke-width="0.8"/>
    </g>`;
}

// ──────────────────────────────────────────────────────────────────────
// Occluders
// ──────────────────────────────────────────────────────────────────────
function pole(i) {
  // Poteau d'éclairage urbain — fixe au milieu de la rue. Il occulte la
  // personne entre les frames 15..25 (sa position x reste constante).
  const px = W * 0.36;
  return `
    <g aria-label="pole">
      <rect x="${(px - 5).toFixed(1)}" y="60" width="10" height="${(H - 60).toFixed(1)}" fill="#1c1d28"/>
      <rect x="${(px - 22).toFixed(1)}" y="62" width="44" height="8" fill="#1c1d28"/>
      <rect x="${(px - 18).toFixed(1)}" y="50" width="36" height="14" rx="3" fill="#2a2c3a" stroke="#0f1018" stroke-width="0.8"/>
    </g>`;
}

function vehicle(i) {
  // Voiture qui passe au premier plan en bas — animée frames 35..40
  const progress = (i - 34) / 5; // 0..1
  const vx = -180 + progress * (W + 200);
  const vy = H * 0.72;
  return `
    <g aria-label="vehicle" transform="translate(${vx.toFixed(1)}, ${vy.toFixed(1)})">
      <!-- carrosserie -->
      <path d="M 0 30 L 22 8 L 90 8 L 110 0 L 165 0 L 175 30 Z" fill="#2a2c3a" stroke="#0f1018" stroke-width="1.2"/>
      <!-- vitres -->
      <path d="M 28 26 L 42 12 L 95 12 L 105 26 Z" fill="#0a0a12" opacity="0.85"/>
      <!-- bas + roues -->
      <rect x="0" y="30" width="175" height="22" fill="#1c1d28"/>
      <circle cx="35" cy="52" r="11" fill="#0f1018"/>
      <circle cx="35" cy="52" r="5" fill="#262838"/>
      <circle cx="140" cy="52" r="11" fill="#0f1018"/>
      <circle cx="140" cy="52" r="5" fill="#262838"/>
      <!-- phare -->
      <rect x="168" y="14" width="6" height="6" fill="#e8c576" rx="1"/>
    </g>`;
}

// ──────────────────────────────────────────────────────────────────────
// Background statique — ciel, bâtiments, rue
// ──────────────────────────────────────────────────────────────────────
function background() {
  return `
    <!-- Ciel -->
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1a1d2e"/>
        <stop offset="100%" stop-color="#0d0e18"/>
      </linearGradient>
      <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#16171e"/>
        <stop offset="100%" stop-color="#0a0b10"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#sky)"/>

    <!-- Silhouettes bâtiments -->
    <g opacity="0.85">
      <rect x="20"  y="80"  width="90"  height="170" fill="#13141c"/>
      <rect x="120" y="50"  width="120" height="200" fill="#15161f"/>
      <rect x="250" y="70"  width="80"  height="180" fill="#13141c"/>
      <rect x="340" y="40"  width="110" height="210" fill="#15161f"/>
      <rect x="460" y="65"  width="70"  height="185" fill="#13141c"/>
      <rect x="540" y="55"  width="90"  height="195" fill="#15161f"/>
      <!-- Fenêtres -->
      ${windows()}
    </g>

    <!-- Sol -->
    <rect x="0" y="${H - 110}" width="${W}" height="110" fill="url(#ground)"/>
    <!-- Trottoir / passage piéton -->
    <rect x="0" y="${H - 110}" width="${W}" height="3" fill="#2a2c3a"/>
    ${crosswalk()}
  `;
}

function windows() {
  // Petites fenêtres jaunes/blanches semi-aléatoires (déterministes par seed)
  const rects = [];
  const cols = [40, 70, 140, 170, 200, 270, 300, 360, 390, 420, 470, 500, 555, 585, 615];
  const rows = [100, 130, 160, 190, 220];
  let seed = 91;
  for (const x of cols) for (const y of rows) {
    seed = (seed * 9301 + 49297) % 233280;
    const lit = seed / 233280 > 0.55;
    if (!lit) continue;
    const color = seed % 7 === 0 ? "#c89530" : "#d6cba8";
    rects.push(`<rect x="${x}" y="${y}" width="6" height="8" fill="${color}" opacity="0.7"/>`);
  }
  return rects.join("");
}

function crosswalk() {
  const stripes = [];
  const y0 = H - 70;
  for (let i = 0; i < 12; i++) {
    stripes.push(`<rect x="${i * 56}" y="${y0}" width="34" height="6" fill="#1f2030"/>`);
  }
  return stripes.join("");
}

// ──────────────────────────────────────────────────────────────────────
// Assembly
// ──────────────────────────────────────────────────────────────────────
function frame(i) {
  const occ = isOcclusion(i);
  const personLayer = person(i);
  let occluderLayer = "";
  if (occ === "pole") occluderLayer = pole(i);
  else if (occ === "vehicle") occluderLayer = vehicle(i);

  // L'occluder est rendu AU-DESSUS de la personne pour produire l'occlusion partielle.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Frame ${i + 1} / 50 — surveillance urbaine">
  ${background()}
  ${personLayer}
  ${occluderLayer}
  <!-- HUD -->
  <g>
    <rect x="8" y="8" width="92" height="22" rx="3" fill="rgba(0,0,0,0.55)"/>
    <text x="14" y="23" font-family="monospace" font-size="11" fill="#e8e8ef">CAM-04 · ${String(i + 1).padStart(2, "0")}/50</text>
    ${occ ? `<rect x="${W - 110}" y="8" width="102" height="22" rx="3" fill="rgba(200,149,48,0.18)" stroke="#c89530" stroke-width="0.8"/>
    <text x="${W - 104}" y="23" font-family="monospace" font-size="10" fill="#e8c576">OCCLUSION · ${occ.toUpperCase()}</text>` : ""}
  </g>
</svg>`;
}

let written = 0;
for (let i = 0; i < 50; i++) {
  const file = `${OUT}/frame-${String(i + 1).padStart(3, "0")}.svg`;
  writeFileSync(file, frame(i), "utf8");
  written++;
}
console.log(`✅ ${written} frames generated in ${OUT}`);
