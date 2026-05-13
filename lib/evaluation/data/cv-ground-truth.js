/**
 * Ground truth pour le test Computer Vision — Photos COCO val2017 (CC-BY-4.0).
 *
 * Pool de plusieurs variantes par slot pour éviter qu'un candidat puisse
 * partager les réponses : chaque session pioche une variante différente
 * de façon DÉTERMINISTE depuis son session.id. Même session = même set.
 */

export const CV_GROUND_TRUTH_POOL = {
  "img-1": [
    {
      variant: "a",
      image: "/evaluation/cv/bboxes/img-1-a.jpg",
      label: "Feux de signalisation",
      instruction: "Annotez chaque feu tricolore visible. Précisez sa position.",
      attributes: ["Mât","Suspendu","Mural","Autre"],
      expectedAttribute: "Mât",
      boxes: [
        { x: 0.3931, y: 0.7216, w: 0.0978, h: 0.1717 },
        { x: 0.7453, y: 0.7342, w: 0.064, h: 0.1682 },
        { x: 0.0994, y: 0.1299, w: 0.1113, h: 0.2835 },
      ],
    },
    {
      variant: "b",
      image: "/evaluation/cv/bboxes/img-1-b.jpg",
      label: "Feux de signalisation",
      instruction: "Annotez chaque feu tricolore visible. Précisez sa position.",
      attributes: ["Mât","Suspendu","Mural","Autre"],
      expectedAttribute: "Mât",
      boxes: [
        { x: 0.4062, y: 0.4023, w: 0.1753, h: 0.2135 },
        { x: 0.6489, y: 0.1753, w: 0.2242, h: 0.6472 },
        { x: 0.2375, y: 0.6233, w: 0.3419, h: 0.2097 },
      ],
    },
  ],
  "img-2": [
    {
      variant: "a",
      image: "/evaluation/cv/bboxes/img-2-a.jpg",
      label: "Voitures et véhicules",
      instruction: "Annotez chaque voiture visible. Précisez le type pour chaque box.",
      attributes: ["Voiture","Camion","Bus","Moto"],
      expectedAttribute: "Voiture",
      boxes: [
        { x: 0.7553, y: 0.2955, w: 0.2447, h: 0.1494 },
        { x: 0.0279, y: 0.308, w: 0.1503, h: 0.1528 },
        { x: 0.1754, y: 0.3187, w: 0.1843, h: 0.1361 },
        { x: 0.5593, y: 0.2818, w: 0.2223, h: 0.2085 },
        { x: 0.3832, y: 0.3261, w: 0.1023, h: 0.1014 },
      ],
    },
    {
      variant: "b",
      image: "/evaluation/cv/bboxes/img-2-b.jpg",
      label: "Voitures et véhicules",
      instruction: "Annotez chaque voiture visible. Précisez le type pour chaque box.",
      attributes: ["Voiture","Camion","Bus","Moto"],
      expectedAttribute: "Voiture",
      boxes: [
        { x: 0.0145, y: 0.3333, w: 0.729, h: 0.6559 },
        { x: 0.002, y: 0.3137, w: 0.291, h: 0.5443 },
        { x: 0.9283, y: 0.3646, w: 0.0706, h: 0.2668 },
      ],
    },
    {
      variant: "c",
      image: "/evaluation/cv/bboxes/img-2-c.jpg",
      label: "Voitures et véhicules",
      instruction: "Annotez chaque voiture visible. Précisez le type pour chaque box.",
      attributes: ["Voiture","Camion","Bus","Moto"],
      expectedAttribute: "Voiture",
      boxes: [
        { x: 0.1732, y: 0.1757, w: 0.3114, h: 0.2529 },
        { x: 0.6503, y: 0.1751, w: 0.3058, h: 0.206 },
        { x: 0, y: 0.1355, w: 0.1005, h: 0.2742 },
      ],
    },
    {
      variant: "d",
      image: "/evaluation/cv/bboxes/img-2-d.jpg",
      label: "Voitures et véhicules",
      instruction: "Annotez chaque voiture visible. Précisez le type pour chaque box.",
      attributes: ["Voiture","Camion","Bus","Moto"],
      expectedAttribute: "Voiture",
      boxes: [
        { x: 0.9352, y: 0.5892, w: 0.0635, h: 0.2563 },
        { x: 0.8816, y: 0.581, w: 0.097, h: 0.2229 },
        { x: 0.2403, y: 0.4839, w: 0.1493, h: 0.1271 },
      ],
    },
  ],
  "img-3": [
    {
      variant: "a",
      image: "/evaluation/cv/bboxes/img-3-a.jpg",
      label: "Panneau STOP",
      instruction: "Annotez le panneau STOP visible.",
      attributes: ["Stop","Limitation vitesse","Direction","Autre"],
      expectedAttribute: "Stop",
      boxes: [
        { x: 0.2157, y: 0.218, w: 0.0994, h: 0.2 },
      ],
    },
    {
      variant: "b",
      image: "/evaluation/cv/bboxes/img-3-b.jpg",
      label: "Panneau STOP",
      instruction: "Annotez le panneau STOP visible.",
      attributes: ["Stop","Limitation vitesse","Direction","Autre"],
      expectedAttribute: "Stop",
      boxes: [
        { x: 0.4011, y: 0.4135, w: 0.1601, h: 0.5753 },
      ],
    },
    {
      variant: "c",
      image: "/evaluation/cv/bboxes/img-3-c.jpg",
      label: "Panneau STOP",
      instruction: "Annotez le panneau STOP visible.",
      attributes: ["Stop","Limitation vitesse","Direction","Autre"],
      expectedAttribute: "Stop",
      boxes: [
        { x: 0.4116, y: 0.1281, w: 0.2469, h: 0.3595 },
      ],
    },
    {
      variant: "d",
      image: "/evaluation/cv/bboxes/img-3-d.jpg",
      label: "Panneau STOP",
      instruction: "Annotez le panneau STOP visible.",
      attributes: ["Stop","Limitation vitesse","Direction","Autre"],
      expectedAttribute: "Stop",
      boxes: [
        { x: 0.6208, y: 0.0785, w: 0.3003, h: 0.396 },
      ],
    },
  ],
  "img-4": [
    {
      variant: "a",
      image: "/evaluation/cv/bboxes/img-4-a.jpg",
      label: "Détection de personnes",
      instruction: "Annotez chaque personne visible. Précisez la pose.",
      attributes: ["Personne en pied","Personne en buste","Groupe","Profil"],
      expectedAttribute: "Personne en pied",
      boxes: [
        { x: 0.0205, y: 0.041, w: 0.3674, h: 0.4157 },
        { x: 0.6875, y: 0.1104, w: 0.3125, h: 0.7635 },
        { x: 0, y: 0, w: 0.1257, h: 0.2642 },
        { x: 0.7987, y: 0, w: 0.1149, h: 0.1229 },
      ],
    },
    {
      variant: "b",
      image: "/evaluation/cv/bboxes/img-4-b.jpg",
      label: "Détection de personnes",
      instruction: "Annotez chaque personne visible. Précisez la pose.",
      attributes: ["Personne en pied","Personne en buste","Groupe","Profil"],
      expectedAttribute: "Personne en pied",
      boxes: [
        { x: 0.245, y: 0.035, w: 0.3538, h: 0.965 },
        { x: 0.0095, y: 0.2154, w: 0.2923, h: 0.7846 },
        { x: 0.1694, y: 0.239, w: 0.131, h: 0.2183 },
        { x: 0.8885, y: 0.3354, w: 0.1115, h: 0.4587 },
        { x: 0, y: 0.7258, w: 0.0548, h: 0.2731 },
      ],
    },
    {
      variant: "c",
      image: "/evaluation/cv/bboxes/img-4-c.jpg",
      label: "Détection de personnes",
      instruction: "Annotez chaque personne visible. Précisez la pose.",
      attributes: ["Personne en pied","Personne en buste","Groupe","Profil"],
      expectedAttribute: "Personne en pied",
      boxes: [
        { x: 0.9437, y: 0.3883, w: 0.0563, h: 0.3805 },
        { x: 0.8671, y: 0.7286, w: 0.1329, h: 0.2612 },
        { x: 0, y: 0, w: 0.1755, h: 0.4209 },
      ],
    },
    {
      variant: "d",
      image: "/evaluation/cv/bboxes/img-4-d.jpg",
      label: "Détection de personnes",
      instruction: "Annotez chaque personne visible. Précisez la pose.",
      attributes: ["Personne en pied","Personne en buste","Groupe","Profil"],
      expectedAttribute: "Personne en pied",
      boxes: [
        { x: 0.2991, y: 0.1305, w: 0.3319, h: 0.4666 },
        { x: 0.571, y: 0.0446, w: 0.3531, h: 0.7043 },
        { x: 0.0015, y: 0.0002, w: 0.1847, h: 0.6958 },
        { x: 0.818, y: 0.2541, w: 0.0823, h: 0.171 },
        { x: 0.8932, y: 0.2727, w: 0.1068, h: 0.2461 },
      ],
    },
  ],
  "img-5": [
    {
      variant: "a",
      image: "/evaluation/cv/bboxes/img-5-a.jpg",
      label: "Vélos urbains",
      instruction: "Annotez chaque vélo visible.",
      attributes: ["Vélo","VTT","Trottinette","Autre"],
      expectedAttribute: "Vélo",
      boxes: [
        { x: 0.447, y: 0.0548, w: 0.0961, h: 0.1456 },
        { x: 0.3429, y: 0.0088, w: 0.2705, h: 0.1988 },
        { x: 0.7253, y: 0, w: 0.2061, h: 0.2208 },
        { x: 0.9323, y: 0.0016, w: 0.0677, h: 0.2256 },
      ],
    },
    {
      variant: "b",
      image: "/evaluation/cv/bboxes/img-5-b.jpg",
      label: "Vélos urbains",
      instruction: "Annotez chaque vélo visible.",
      attributes: ["Vélo","VTT","Trottinette","Autre"],
      expectedAttribute: "Vélo",
      boxes: [
        { x: 0.4084, y: 0.4085, w: 0.3835, h: 0.1178 },
        { x: 0.4118, y: 0.3596, w: 0.3149, h: 0.0665 },
        { x: 0.4382, y: 0.4852, w: 0.3479, h: 0.1674 },
      ],
    },
  ],
};

export const CV_POLYGON_POOL = [
  {
    variant: "a",
    image: "/evaluation/cv/polygon/poly-a.jpg",
    category: "elephant",
    label: "Éléphant",
    instruction: "Tracez un polygone précis qui contourne la silhouette de l'objet (au moins 6 points, idéalement 12+ pour une bonne précision).",
    quadrants: 4,
    minPoints: 6,
    referencePoints: 57,
  },
  {
    variant: "b",
    image: "/evaluation/cv/polygon/poly-b.jpg",
    category: "airplane",
    label: "Avion sur tarmac",
    instruction: "Tracez un polygone précis qui contourne la silhouette de l'objet (au moins 6 points, idéalement 12+ pour une bonne précision).",
    quadrants: 4,
    minPoints: 6,
    referencePoints: 55,
  },
  {
    variant: "c",
    image: "/evaluation/cv/polygon/poly-c.jpg",
    category: "boat",
    label: "Bateau / embarcation",
    instruction: "Tracez un polygone précis qui contourne la silhouette de l'objet (au moins 6 points, idéalement 12+ pour une bonne précision).",
    quadrants: 4,
    minPoints: 6,
    referencePoints: 41,
  },
  {
    variant: "d",
    image: "/evaluation/cv/polygon/poly-d.jpg",
    category: "bus",
    label: "Bus urbain",
    instruction: "Tracez un polygone précis qui contourne la silhouette de l'objet (au moins 6 points, idéalement 12+ pour une bonne précision).",
    quadrants: 4,
    minPoints: 6,
    referencePoints: 40,
  },
];

// Hash FNV-1a — UUID → entier déterministe
function hashStr(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h;
}

/**
 * Sélectionne 5 scènes bbox + 1 polygone pour une session donnée.
 * Déterministe : même sessionId → toujours le même set.
 */
export function getCvSceneSetForSession(sessionId) {
  if (!sessionId) sessionId = "default-fallback-seed";
  const seed = hashStr(sessionId);

  const groundTruth = [];
  let i = 0;
  for (const [slotId, variants] of Object.entries(CV_GROUND_TRUTH_POOL)) {
    const pick = variants[(seed + i * 7919) % variants.length];
    groundTruth.push({ id: slotId, ...pick });
    i++;
  }

  const polygonTarget = {
    id: "poly-1",
    ...CV_POLYGON_POOL[(seed + 31337) % CV_POLYGON_POOL.length],
  };

  return { ground_truth: groundTruth, polygon_target: polygonTarget };
}

// Backward-compat : exports legacy (variante 'a' par défaut)
export const CV_GROUND_TRUTH = Object.entries(CV_GROUND_TRUTH_POOL).map(
  ([slotId, variants]) => ({ id: slotId, ...variants[0] })
);
export const CV_POLYGON_TARGET = { id: "poly-1", ...CV_POLYGON_POOL[0] };

export const CV_TRACKING_GROUND_TRUTH = {
  videoContext: "Surveillance urbaine — Personne traversant une rue piétonne",
  targetObjectId: "person-1",
  // bbox attendue en coordonnées normalisées (0-1)
  frames: Array.from({ length: 50 }, (_, i) => {
    // La personne se déplace de gauche à droite : x normalisé de 0.08 à 0.86
    const x = 0.08 + i * 0.0156;
    const y = 0.42;
    const w = 0.094;
    const h = 0.33;
    const isOcclusion = (i >= 14 && i <= 24) || (i >= 34 && i <= 39);
    const occlusionType = isOcclusion
      ? i <= 24
        ? "partial-pole"
        : "partial-vehicle"
      : null;
    return {
      frameNumber: i + 1,
      imagePath: `/evaluation/cv/tracking/frame-${String(i + 1).padStart(3, "0")}.svg`,
      expectedBbox: { x, y, w, h },
      isOcclusion,
      occlusionType,
    };
  }),
};
