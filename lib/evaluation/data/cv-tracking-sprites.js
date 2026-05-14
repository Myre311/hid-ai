/**
 * Sprites piéton pour le test de tracking — 10 illustrations SVG détaillées
 * (vêtements, poses, accessoires, couleurs de peau variés) qui remplacent
 * la silhouette géométrique stylisée par des personnages plus crédibles.
 *
 * Chaque sprite est une fonction renderer (cx, top, w, h, stride) → JSX
 * fragment SVG. Coords en pixels du repère parent (viewBox 640×360).
 */

// ─── Sprite 1 — Femme en manteau noir, cheveux attachés ──────────────
function sprite1({ cx, top, w, h, stride }) {
  const headR = w * 0.34;
  const headCy = top + headR + 1;
  return (
    <g>
      <ellipse cx={cx} cy={top + h - 1} rx={w * 0.42} ry={3} fill="rgba(0,0,0,0.5)" />
      {/* Jambes en jean foncé */}
      <line x1={cx - stride} y1={top + h * 0.6} x2={cx - stride * 0.6 - w * 0.13} y2={top + h - 0.5} stroke="#1a2030" strokeWidth={w * 0.2} strokeLinecap="round" />
      <line x1={cx + stride} y1={top + h * 0.6} x2={cx + stride * 0.6 + w * 0.13} y2={top + h - 0.5} stroke="#1a2030" strokeWidth={w * 0.2} strokeLinecap="round" />
      {/* Manteau noir long */}
      <path d={`M ${cx - w*0.42} ${top + h * 0.62} L ${cx - w*0.46} ${top + h * 0.32} Q ${cx - w*0.5} ${top + h*0.22}, ${cx - w*0.32} ${top + h*0.21} L ${cx + w*0.32} ${top + h*0.21} Q ${cx + w*0.5} ${top + h*0.22}, ${cx + w*0.46} ${top + h*0.32} L ${cx + w*0.42} ${top + h*0.62} Z`} fill="#0d1018" stroke="#000" strokeWidth={0.4} />
      <line x1={cx} y1={top + h * 0.22} x2={cx} y2={top + h * 0.62} stroke="#000" strokeWidth={0.6} />
      {/* Bras */}
      <line x1={cx - w*0.4} y1={top + h*0.28} x2={cx - w*0.52 + stride*0.4} y2={top + h*0.55} stroke="#0d1018" strokeWidth={w * 0.16} strokeLinecap="round" />
      <line x1={cx + w*0.4} y1={top + h*0.28} x2={cx + w*0.52 - stride*0.4} y2={top + h*0.55} stroke="#0d1018" strokeWidth={w * 0.16} strokeLinecap="round" />
      {/* Tête + cheveux attachés */}
      <circle cx={cx} cy={headCy} r={headR} fill="#e8c9a5" stroke="#1a1a1a" strokeWidth={0.5} />
      <path d={`M ${cx - headR * 0.85} ${headCy - headR * 0.4} Q ${cx} ${headCy - headR * 1.1}, ${cx + headR * 0.85} ${headCy - headR * 0.4} L ${cx + headR * 0.6} ${headCy + headR * 0.1} L ${cx - headR * 0.6} ${headCy + headR * 0.1} Z`} fill="#2a1a0d" />
      <circle cx={cx + headR * 0.95} cy={headCy} r={headR * 0.22} fill="#2a1a0d" />
    </g>
  );
}

// ─── Sprite 2 — Homme en costume gris business ──────────────────────
function sprite2({ cx, top, w, h, stride }) {
  const headR = w * 0.32;
  const headCy = top + headR + 1;
  return (
    <g>
      <ellipse cx={cx} cy={top + h - 1} rx={w * 0.4} ry={3} fill="rgba(0,0,0,0.5)" />
      <line x1={cx - stride - 1} y1={top + h * 0.6} x2={cx - stride * 0.6 - w * 0.12} y2={top + h - 0.5} stroke="#252830" strokeWidth={w * 0.2} strokeLinecap="round" />
      <line x1={cx + stride + 1} y1={top + h * 0.6} x2={cx + stride * 0.6 + w * 0.12} y2={top + h - 0.5} stroke="#252830" strokeWidth={w * 0.2} strokeLinecap="round" />
      {/* Veste costume */}
      <path d={`M ${cx - w*0.38} ${top + h * 0.62} L ${cx - w*0.42} ${top + h * 0.3} L ${cx - w*0.28} ${top + h * 0.24} L ${cx + w*0.28} ${top + h * 0.24} L ${cx + w*0.42} ${top + h * 0.3} L ${cx + w*0.38} ${top + h * 0.62} Z`} fill="#3d4253" stroke="#1a1d28" strokeWidth={0.5} />
      {/* Chemise blanche */}
      <path d={`M ${cx - w*0.1} ${top + h * 0.26} L ${cx} ${top + h * 0.38} L ${cx + w*0.1} ${top + h * 0.26} L ${cx + w*0.04} ${top + h * 0.5} L ${cx - w*0.04} ${top + h * 0.5} Z`} fill="#f0f0f0" />
      {/* Cravate rouge */}
      <path d={`M ${cx - w*0.04} ${top + h * 0.32} L ${cx} ${top + h * 0.5} L ${cx + w*0.04} ${top + h * 0.32} Z`} fill="#a52a2a" />
      {/* Bras */}
      <line x1={cx - w*0.36} y1={top + h*0.3} x2={cx - w*0.5 + stride*0.5} y2={top + h*0.58} stroke="#3d4253" strokeWidth={w * 0.16} strokeLinecap="round" />
      <line x1={cx + w*0.36} y1={top + h*0.3} x2={cx + w*0.5 - stride*0.5} y2={top + h*0.58} stroke="#3d4253" strokeWidth={w * 0.16} strokeLinecap="round" />
      <circle cx={cx} cy={headCy} r={headR} fill="#d8a878" stroke="#1a1a1a" strokeWidth={0.5} />
      {/* Cheveux courts */}
      <path d={`M ${cx - headR * 0.95} ${headCy - headR * 0.3} Q ${cx} ${headCy - headR * 1.1}, ${cx + headR * 0.95} ${headCy - headR * 0.3} L ${cx + headR * 0.7} ${headCy - headR * 0.1} L ${cx - headR * 0.7} ${headCy - headR * 0.1} Z`} fill="#3a2a1a" />
    </g>
  );
}

// ─── Sprite 3 — Adolescente, t-shirt jaune, queue de cheval ─────────
function sprite3({ cx, top, w, h, stride }) {
  const headR = w * 0.3;
  const headCy = top + headR + 1;
  return (
    <g>
      <ellipse cx={cx} cy={top + h - 1} rx={w * 0.38} ry={2.5} fill="rgba(0,0,0,0.5)" />
      <line x1={cx - stride} y1={top + h * 0.58} x2={cx - stride * 0.6 - w * 0.11} y2={top + h - 0.5} stroke="#3a4ac9" strokeWidth={w * 0.18} strokeLinecap="round" />
      <line x1={cx + stride} y1={top + h * 0.58} x2={cx + stride * 0.6 + w * 0.11} y2={top + h - 0.5} stroke="#3a4ac9" strokeWidth={w * 0.18} strokeLinecap="round" />
      {/* T-shirt jaune */}
      <path d={`M ${cx - w*0.34} ${top + h * 0.58} L ${cx - w*0.38} ${top + h * 0.32} L ${cx - w*0.22} ${top + h * 0.24} L ${cx + w*0.22} ${top + h * 0.24} L ${cx + w*0.38} ${top + h * 0.32} L ${cx + w*0.34} ${top + h * 0.58} Z`} fill="#f4d03f" stroke="#a87f0d" strokeWidth={0.4} />
      <line x1={cx - w*0.34} y1={top + h*0.32} x2={cx - w*0.5 + stride*0.5} y2={top + h*0.55} stroke="#d8a878" strokeWidth={w * 0.14} strokeLinecap="round" />
      <line x1={cx + w*0.34} y1={top + h*0.32} x2={cx + w*0.5 - stride*0.5} y2={top + h*0.55} stroke="#d8a878" strokeWidth={w * 0.14} strokeLinecap="round" />
      <circle cx={cx} cy={headCy} r={headR} fill="#e6c098" stroke="#1a1a1a" strokeWidth={0.5} />
      {/* Queue de cheval */}
      <ellipse cx={cx - headR * 0.6} cy={headCy - headR * 0.3} rx={headR * 0.45} ry={headR * 0.5} fill="#5a3a1a" />
      <path d={`M ${cx - headR * 0.8} ${headCy + headR * 0.2} Q ${cx - headR * 1.3} ${headCy + headR * 0.6}, ${cx - headR * 1.1} ${headCy + headR * 1.4}`} stroke="#5a3a1a" strokeWidth={headR * 0.35} fill="none" strokeLinecap="round" />
    </g>
  );
}

// ─── Sprite 4 — Homme en sweat à capuche orange ─────────────────────
function sprite4({ cx, top, w, h, stride }) {
  const headR = w * 0.34;
  const headCy = top + headR + 1;
  return (
    <g>
      <ellipse cx={cx} cy={top + h - 1} rx={w * 0.4} ry={3} fill="rgba(0,0,0,0.5)" />
      <line x1={cx - stride} y1={top + h * 0.6} x2={cx - stride * 0.6 - w * 0.13} y2={top + h - 0.5} stroke="#3d3d3d" strokeWidth={w * 0.2} strokeLinecap="round" />
      <line x1={cx + stride} y1={top + h * 0.6} x2={cx + stride * 0.6 + w * 0.13} y2={top + h - 0.5} stroke="#3d3d3d" strokeWidth={w * 0.2} strokeLinecap="round" />
      {/* Sweat capuche orange */}
      <path d={`M ${cx - w*0.4} ${top + h * 0.62} L ${cx - w*0.44} ${top + h * 0.28} Q ${cx - w*0.42} ${top + h * 0.18}, ${cx - w*0.2} ${top + h * 0.15} L ${cx + w*0.2} ${top + h * 0.15} Q ${cx + w*0.42} ${top + h * 0.18}, ${cx + w*0.44} ${top + h * 0.28} L ${cx + w*0.4} ${top + h * 0.62} Z`} fill="#d97a2a" stroke="#7a4313" strokeWidth={0.5} />
      {/* Capuche derrière */}
      <ellipse cx={cx} cy={top + h * 0.22} rx={headR * 1.3} ry={headR * 0.6} fill="#7a4313" />
      <line x1={cx - w*0.38} y1={top + h*0.32} x2={cx - w*0.52 + stride*0.4} y2={top + h*0.58} stroke="#d97a2a" strokeWidth={w * 0.16} strokeLinecap="round" />
      <line x1={cx + w*0.38} y1={top + h*0.32} x2={cx + w*0.52 - stride*0.4} y2={top + h*0.58} stroke="#d97a2a" strokeWidth={w * 0.16} strokeLinecap="round" />
      <circle cx={cx} cy={headCy} r={headR} fill="#caa07a" stroke="#1a1a1a" strokeWidth={0.5} />
    </g>
  );
}

// ─── Sprite 5 — Femme en robe rouge ──────────────────────────────────
function sprite5({ cx, top, w, h, stride }) {
  const headR = w * 0.3;
  const headCy = top + headR + 1;
  return (
    <g>
      <ellipse cx={cx} cy={top + h - 1} rx={w * 0.45} ry={3} fill="rgba(0,0,0,0.5)" />
      <line x1={cx - stride * 0.7} y1={top + h * 0.65} x2={cx - stride * 0.4 - w * 0.08} y2={top + h - 0.5} stroke="#e6c098" strokeWidth={w * 0.13} strokeLinecap="round" />
      <line x1={cx + stride * 0.7} y1={top + h * 0.65} x2={cx + stride * 0.4 + w * 0.08} y2={top + h - 0.5} stroke="#e6c098" strokeWidth={w * 0.13} strokeLinecap="round" />
      {/* Robe rouge évasée */}
      <path d={`M ${cx - w*0.28} ${top + h * 0.25} L ${cx + w*0.28} ${top + h * 0.25} L ${cx + w*0.5} ${top + h * 0.7} L ${cx - w*0.5} ${top + h * 0.7} Z`} fill="#c12b2b" stroke="#5a0d0d" strokeWidth={0.5} />
      <line x1={cx - w*0.26} y1={top + h*0.28} x2={cx - w*0.4 + stride*0.5} y2={top + h*0.55} stroke="#e6c098" strokeWidth={w * 0.14} strokeLinecap="round" />
      <line x1={cx + w*0.26} y1={top + h*0.28} x2={cx + w*0.4 - stride*0.5} y2={top + h*0.55} stroke="#e6c098" strokeWidth={w * 0.14} strokeLinecap="round" />
      <circle cx={cx} cy={headCy} r={headR} fill="#e6c098" stroke="#1a1a1a" strokeWidth={0.5} />
      {/* Cheveux longs */}
      <path d={`M ${cx - headR * 1.1} ${headCy - headR * 0.3} Q ${cx} ${headCy - headR * 1.2}, ${cx + headR * 1.1} ${headCy - headR * 0.3} L ${cx + headR * 0.95} ${headCy + headR * 1.2} L ${cx - headR * 0.95} ${headCy + headR * 1.2} Z`} fill="#1a0a0a" />
    </g>
  );
}

// ─── Sprite 6 — Personne avec sac à dos vert ─────────────────────────
function sprite6({ cx, top, w, h, stride }) {
  const headR = w * 0.33;
  const headCy = top + headR + 1;
  return (
    <g>
      <ellipse cx={cx} cy={top + h - 1} rx={w * 0.42} ry={3} fill="rgba(0,0,0,0.5)" />
      <line x1={cx - stride} y1={top + h * 0.6} x2={cx - stride * 0.6 - w * 0.12} y2={top + h - 0.5} stroke="#5a4a3a" strokeWidth={w * 0.2} strokeLinecap="round" />
      <line x1={cx + stride} y1={top + h * 0.6} x2={cx + stride * 0.6 + w * 0.12} y2={top + h - 0.5} stroke="#5a4a3a" strokeWidth={w * 0.2} strokeLinecap="round" />
      {/* Sac à dos vert (derrière, donc partiellement visible) */}
      <rect x={cx - w * 0.48} y={top + h * 0.28} width={w * 0.16} height={h * 0.32} rx={2} fill="#3a5c3a" stroke="#1a2a1a" strokeWidth={0.4} />
      {/* T-shirt bleu */}
      <path d={`M ${cx - w*0.32} ${top + h * 0.6} L ${cx - w*0.36} ${top + h * 0.28} L ${cx + w*0.36} ${top + h * 0.28} L ${cx + w*0.32} ${top + h * 0.6} Z`} fill="#2a4a8a" stroke="#1a2a4a" strokeWidth={0.4} />
      {/* Bretelles sac */}
      <rect x={cx - w * 0.34} y={top + h * 0.28} width={2} height={h * 0.18} fill="#1a2a1a" />
      <line x1={cx - w*0.36} y1={top + h*0.32} x2={cx - w*0.5 + stride*0.4} y2={top + h*0.58} stroke="#d8a878" strokeWidth={w * 0.14} strokeLinecap="round" />
      <line x1={cx + w*0.36} y1={top + h*0.32} x2={cx + w*0.5 - stride*0.4} y2={top + h*0.58} stroke="#d8a878" strokeWidth={w * 0.14} strokeLinecap="round" />
      <circle cx={cx} cy={headCy} r={headR} fill="#a87858" stroke="#1a1a1a" strokeWidth={0.5} />
      <path d={`M ${cx - headR * 0.95} ${headCy - headR * 0.4} Q ${cx} ${headCy - headR * 1.1}, ${cx + headR * 0.95} ${headCy - headR * 0.4} L ${cx + headR * 0.7} ${headCy - headR * 0.1} L ${cx - headR * 0.7} ${headCy - headR * 0.1} Z`} fill="#1a1a0a" />
    </g>
  );
}

// ─── Sprite 7 — Senior avec canne ────────────────────────────────────
function sprite7({ cx, top, w, h, stride }) {
  const headR = w * 0.32;
  const headCy = top + headR + 1;
  return (
    <g>
      <ellipse cx={cx} cy={top + h - 1} rx={w * 0.45} ry={3} fill="rgba(0,0,0,0.5)" />
      <line x1={cx - stride * 0.6} y1={top + h * 0.6} x2={cx - stride * 0.4 - w * 0.1} y2={top + h - 0.5} stroke="#4a4a4a" strokeWidth={w * 0.18} strokeLinecap="round" />
      <line x1={cx + stride * 0.6} y1={top + h * 0.6} x2={cx + stride * 0.4 + w * 0.1} y2={top + h - 0.5} stroke="#4a4a4a" strokeWidth={w * 0.18} strokeLinecap="round" />
      {/* Canne */}
      <line x1={cx + w * 0.55} y1={top + h * 0.3} x2={cx + w * 0.45} y2={top + h - 0.5} stroke="#8a6a3a" strokeWidth={1.2} strokeLinecap="round" />
      {/* Manteau beige */}
      <path d={`M ${cx - w*0.38} ${top + h * 0.62} L ${cx - w*0.4} ${top + h * 0.28} L ${cx + w*0.4} ${top + h * 0.28} L ${cx + w*0.38} ${top + h * 0.62} Z`} fill="#9c8060" stroke="#5a4630" strokeWidth={0.5} />
      <line x1={cx - w*0.36} y1={top + h*0.3} x2={cx - w*0.48 + stride*0.4} y2={top + h*0.55} stroke="#9c8060" strokeWidth={w * 0.16} strokeLinecap="round" />
      <line x1={cx + w*0.36} y1={top + h*0.3} x2={cx + w*0.5 - stride*0.3} y2={top + h*0.4} stroke="#9c8060" strokeWidth={w * 0.16} strokeLinecap="round" />
      <circle cx={cx} cy={headCy} r={headR} fill="#d8b898" stroke="#1a1a1a" strokeWidth={0.5} />
      {/* Cheveux blancs */}
      <path d={`M ${cx - headR * 0.9} ${headCy - headR * 0.4} Q ${cx} ${headCy - headR * 1.1}, ${cx + headR * 0.9} ${headCy - headR * 0.4} L ${cx + headR * 0.7} ${headCy - headR * 0.1} L ${cx - headR * 0.7} ${headCy - headR * 0.1} Z`} fill="#e8e8e8" />
    </g>
  );
}

// ─── Sprite 8 — Femme en parka verte ─────────────────────────────────
function sprite8({ cx, top, w, h, stride }) {
  const headR = w * 0.32;
  const headCy = top + headR + 1;
  return (
    <g>
      <ellipse cx={cx} cy={top + h - 1} rx={w * 0.4} ry={3} fill="rgba(0,0,0,0.5)" />
      <line x1={cx - stride} y1={top + h * 0.6} x2={cx - stride * 0.6 - w * 0.12} y2={top + h - 0.5} stroke="#2a2030" strokeWidth={w * 0.2} strokeLinecap="round" />
      <line x1={cx + stride} y1={top + h * 0.6} x2={cx + stride * 0.6 + w * 0.12} y2={top + h - 0.5} stroke="#2a2030" strokeWidth={w * 0.2} strokeLinecap="round" />
      {/* Parka vert kaki avec fourrure capuche */}
      <path d={`M ${cx - w*0.4} ${top + h * 0.62} L ${cx - w*0.44} ${top + h * 0.3} Q ${cx - w*0.5} ${top + h * 0.22}, ${cx - w*0.2} ${top + h * 0.2} L ${cx + w*0.2} ${top + h * 0.2} Q ${cx + w*0.5} ${top + h * 0.22}, ${cx + w*0.44} ${top + h * 0.3} L ${cx + w*0.4} ${top + h * 0.62} Z`} fill="#4a5a32" stroke="#2a3a1a" strokeWidth={0.5} />
      <ellipse cx={cx} cy={top + h * 0.2} rx={headR * 1.2} ry={headR * 0.5} fill="#3a3a2a" />
      <line x1={cx - w*0.38} y1={top + h*0.34} x2={cx - w*0.52 + stride*0.4} y2={top + h*0.58} stroke="#4a5a32" strokeWidth={w * 0.16} strokeLinecap="round" />
      <line x1={cx + w*0.38} y1={top + h*0.34} x2={cx + w*0.52 - stride*0.4} y2={top + h*0.58} stroke="#4a5a32" strokeWidth={w * 0.16} strokeLinecap="round" />
      <circle cx={cx} cy={headCy} r={headR} fill="#c89878" stroke="#1a1a1a" strokeWidth={0.5} />
    </g>
  );
}

// ─── Sprite 9 — Coursier livreur (gilet jaune fluo) ─────────────────
function sprite9({ cx, top, w, h, stride }) {
  const headR = w * 0.3;
  const headCy = top + headR + 1;
  return (
    <g>
      <ellipse cx={cx} cy={top + h - 1} rx={w * 0.4} ry={3} fill="rgba(0,0,0,0.5)" />
      <line x1={cx - stride} y1={top + h * 0.6} x2={cx - stride * 0.6 - w * 0.12} y2={top + h - 0.5} stroke="#3a3a3a" strokeWidth={w * 0.2} strokeLinecap="round" />
      <line x1={cx + stride} y1={top + h * 0.6} x2={cx + stride * 0.6 + w * 0.12} y2={top + h - 0.5} stroke="#3a3a3a" strokeWidth={w * 0.2} strokeLinecap="round" />
      {/* Gilet HV jaune avec bandes */}
      <path d={`M ${cx - w*0.36} ${top + h * 0.6} L ${cx - w*0.4} ${top + h * 0.28} L ${cx + w*0.4} ${top + h * 0.28} L ${cx + w*0.36} ${top + h * 0.6} Z`} fill="#e8d030" stroke="#6a5800" strokeWidth={0.5} />
      <rect x={cx - w*0.36} y={top + h*0.4} width={w * 0.72} height={2.5} fill="#c0c0c0" />
      <rect x={cx - w*0.36} y={top + h*0.5} width={w * 0.72} height={2.5} fill="#c0c0c0" />
      {/* Bras */}
      <line x1={cx - w*0.36} y1={top + h*0.3} x2={cx - w*0.5 + stride*0.4} y2={top + h*0.55} stroke="#e8d030" strokeWidth={w * 0.16} strokeLinecap="round" />
      <line x1={cx + w*0.36} y1={top + h*0.3} x2={cx + w*0.5 - stride*0.4} y2={top + h*0.55} stroke="#e8d030" strokeWidth={w * 0.16} strokeLinecap="round" />
      {/* Casquette */}
      <ellipse cx={cx} cy={headCy} r={headR} fill="#d8a878" stroke="#1a1a1a" strokeWidth={0.5} />
      <rect x={cx - headR * 0.85} y={headCy - headR * 0.85} width={headR * 1.7} height={headR * 0.5} fill="#1a3050" />
      <rect x={cx - headR} y={headCy - headR * 0.35} width={headR * 2.2} height={1.2} fill="#1a3050" />
    </g>
  );
}

// ─── Sprite 10 — Personne en sweat à capuche bleu marine ────────────
function sprite10({ cx, top, w, h, stride }) {
  const headR = w * 0.34;
  const headCy = top + headR + 1;
  return (
    <g>
      <ellipse cx={cx} cy={top + h - 1} rx={w * 0.4} ry={3} fill="rgba(0,0,0,0.5)" />
      <line x1={cx - stride} y1={top + h * 0.6} x2={cx - stride * 0.6 - w * 0.12} y2={top + h - 0.5} stroke="#1a1a25" strokeWidth={w * 0.2} strokeLinecap="round" />
      <line x1={cx + stride} y1={top + h * 0.6} x2={cx + stride * 0.6 + w * 0.12} y2={top + h - 0.5} stroke="#1a1a25" strokeWidth={w * 0.2} strokeLinecap="round" />
      {/* Sweat à capuche bleu marine — capuche relevée sur la tête */}
      <path d={`M ${cx - w*0.4} ${top + h * 0.62} L ${cx - w*0.44} ${top + h * 0.32} Q ${cx - w*0.42} ${top + h * 0.16}, ${cx} ${top + h * 0.1} Q ${cx + w*0.42} ${top + h * 0.16}, ${cx + w*0.44} ${top + h * 0.32} L ${cx + w*0.4} ${top + h * 0.62} Z`} fill="#1a2a4a" stroke="#0a1530" strokeWidth={0.5} />
      <line x1={cx - w*0.38} y1={top + h*0.34} x2={cx - w*0.52 + stride*0.4} y2={top + h*0.58} stroke="#1a2a4a" strokeWidth={w * 0.16} strokeLinecap="round" />
      <line x1={cx + w*0.38} y1={top + h*0.34} x2={cx + w*0.52 - stride*0.4} y2={top + h*0.58} stroke="#1a2a4a" strokeWidth={w * 0.16} strokeLinecap="round" />
      {/* Visage entrevu sous la capuche */}
      <path d={`M ${cx - headR * 0.7} ${headCy - headR * 0.15} Q ${cx} ${headCy + headR * 0.6}, ${cx + headR * 0.7} ${headCy - headR * 0.15} Q ${cx + headR * 0.4} ${headCy - headR * 0.5}, ${cx} ${headCy - headR * 0.5} Q ${cx - headR * 0.4} ${headCy - headR * 0.5}, ${cx - headR * 0.7} ${headCy - headR * 0.15} Z`} fill="#a87858" />
    </g>
  );
}

export const TRACKING_SPRITES = [
  sprite1, sprite2, sprite3, sprite4, sprite5,
  sprite6, sprite7, sprite8, sprite9, sprite10,
];

export const TRACKING_SPRITE_NAMES = [
  "Manteau noir",
  "Costume gris",
  "T-shirt jaune (ado)",
  "Sweat orange",
  "Robe rouge",
  "Sac à dos",
  "Senior + canne",
  "Parka verte",
  "Coursier HV",
  "Sweat capuche",
];
