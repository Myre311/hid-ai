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
        { x: 0.6326, y: 0.1556, w: 0.0789, h: 0.2431 },
        { x: 0.416, y: 0.3437, w: 0.058, h: 0.2068 },
        { x: 0.1888, y: 0.8003, w: 0.0485, h: 0.1135 },
        { x: 0.9404, y: 0.7882, w: 0.0531, h: 0.1436 },
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
        { x: 0.7705, y: 0.1187, w: 0.0418, h: 0.1614 },
        { x: 0.2261, y: 0.2108, w: 0.0802, h: 0.1502 },
        { x: 0.298, y: 0.0019, w: 0.0435, h: 0.1569 },
        { x: 0.8428, y: 0.0106, w: 0.0599, h: 0.209 },
      ],
    },
    {
      variant: "c",
      image: "/evaluation/cv/bboxes/img-1-c.jpg",
      label: "Feux de signalisation",
      instruction: "Annotez chaque feu tricolore visible. Précisez sa position.",
      attributes: ["Mât","Suspendu","Mural","Autre"],
      expectedAttribute: "Mât",
      boxes: [
        { x: 0.7415, y: 0.1556, w: 0.0612, h: 0.2218 },
        { x: 0.2368, y: 0.3044, w: 0.0401, h: 0.1431 },
        { x: 0.1477, y: 0.3052, w: 0.0437, h: 0.1427 },
        { x: 0.6836, y: 0.1737, w: 0.0435, h: 0.1331 },
      ],
    },
    {
      variant: "d",
      image: "/evaluation/cv/bboxes/img-1-d.jpg",
      label: "Feux de signalisation",
      instruction: "Annotez chaque feu tricolore visible. Précisez sa position.",
      attributes: ["Mât","Suspendu","Mural","Autre"],
      expectedAttribute: "Mât",
      boxes: [
        { x: 0.6866, y: 0.0583, w: 0.1038, h: 0.2758 },
        { x: 0.0101, y: 0.005, w: 0.0995, h: 0.2618 },
      ],
    },
    {
      variant: "e",
      image: "/evaluation/cv/bboxes/img-1-e.jpg",
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
      variant: "f",
      image: "/evaluation/cv/bboxes/img-1-f.jpg",
      label: "Feux de signalisation",
      instruction: "Annotez chaque feu tricolore visible. Précisez sa position.",
      attributes: ["Mât","Suspendu","Mural","Autre"],
      expectedAttribute: "Mât",
      boxes: [
        { x: 0.7517, y: 0.2382, w: 0.0903, h: 0.236 },
        { x: 0.3258, y: 0.1857, w: 0.1075, h: 0.2511 },
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
        { x: 0.8377, y: 0.3479, w: 0.1113, h: 0.3986 },
        { x: 0.242, y: 0.7247, w: 0.1111, h: 0.2635 },
        { x: 0.849, y: 0.6512, w: 0.106, h: 0.2776 },
        { x: 0.1016, y: 0.4632, w: 0.0588, h: 0.1104 },
        { x: 0, y: 0.5551, w: 0.0398, h: 0.2186 },
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
        { x: 0.0016, y: 0.3704, w: 0.5441, h: 0.6068 },
        { x: 0, y: 0.3281, w: 0.3274, h: 0.0786 },
        { x: 0.9287, y: 0.5235, w: 0.0693, h: 0.0902 },
        { x: 0.4933, y: 0.3344, w: 0.5052, h: 0.2671 },
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
        { x: 0.0036, y: 0.3016, w: 0.2903, h: 0.2866 },
        { x: 0.4891, y: 0.2513, w: 0.1736, h: 0.1146 },
        { x: 0.0066, y: 0.2685, w: 0.2536, h: 0.11 },
        { x: 0.8307, y: 0.1788, w: 0.1693, h: 0.191 },
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
        { x: 0.7553, y: 0.2955, w: 0.2447, h: 0.1494 },
        { x: 0.0279, y: 0.308, w: 0.1503, h: 0.1528 },
        { x: 0.1754, y: 0.3187, w: 0.1843, h: 0.1361 },
        { x: 0.5593, y: 0.2818, w: 0.2223, h: 0.2085 },
        { x: 0.3832, y: 0.3261, w: 0.1023, h: 0.1014 },
      ],
    },
    {
      variant: "e",
      image: "/evaluation/cv/bboxes/img-2-e.jpg",
      label: "Voitures et véhicules",
      instruction: "Annotez chaque voiture visible. Précisez le type pour chaque box.",
      attributes: ["Voiture","Camion","Bus","Moto"],
      expectedAttribute: "Voiture",
      boxes: [
        { x: 0.5759, y: 0.4967, w: 0.1009, h: 0.0961 },
        { x: 0.0488, y: 0.4742, w: 0.0788, h: 0.0838 },
        { x: 0.9099, y: 0.52, w: 0.0901, h: 0.0906 },
      ],
    },
    {
      variant: "f",
      image: "/evaluation/cv/bboxes/img-2-f.jpg",
      label: "Voitures et véhicules",
      instruction: "Annotez chaque voiture visible. Précisez le type pour chaque box.",
      attributes: ["Voiture","Camion","Bus","Moto"],
      expectedAttribute: "Voiture",
      boxes: [
        { x: 0.5624, y: 0.1938, w: 0.2184, h: 0.0837 },
        { x: 0.767, y: 0.2223, w: 0.1941, h: 0.069 },
        { x: 0.2939, y: 0.1589, w: 0.1701, h: 0.0522 },
        { x: 0.3762, y: 0.2149, w: 0.2565, h: 0.0837 },
        { x: 0.1292, y: 0.1707, w: 0.2285, h: 0.0875 },
        { x: 0.8957, y: 0.1938, w: 0.1042, h: 0.0816 },
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
        { x: 0.1347, y: 0.0367, w: 0.071, h: 0.0968 },
        { x: 0.5116, y: 0.2664, w: 0.1047, h: 0.1214 },
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
        { x: 0.6842, y: 0.1942, w: 0.0662, h: 0.1054 },
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
        { x: 0.2157, y: 0.218, w: 0.0994, h: 0.2 },
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
        { x: 0.1497, y: 0.3381, w: 0.0922, h: 0.1103 },
      ],
    },
    {
      variant: "e",
      image: "/evaluation/cv/bboxes/img-3-e.jpg",
      label: "Panneau STOP",
      instruction: "Annotez le panneau STOP visible.",
      attributes: ["Stop","Limitation vitesse","Direction","Autre"],
      expectedAttribute: "Stop",
      boxes: [
        { x: 0.2567, y: 0.2038, w: 0.0625, h: 0.1062 },
      ],
    },
    {
      variant: "f",
      image: "/evaluation/cv/bboxes/img-3-f.jpg",
      label: "Panneau STOP",
      instruction: "Annotez le panneau STOP visible.",
      attributes: ["Stop","Limitation vitesse","Direction","Autre"],
      expectedAttribute: "Stop",
      boxes: [
        { x: 0.105, y: 0.4415, w: 0.0499, h: 0.1175 },
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
        { x: 0.7745, y: 0.2831, w: 0.1427, h: 0.3292 },
        { x: 0.675, y: 0.3351, w: 0.075, h: 0.2553 },
        { x: 0.06, y: 0.2607, w: 0.0495, h: 0.2181 },
        { x: 0.2903, y: 0.2485, w: 0.1001, h: 0.1132 },
        { x: 0, y: 0.563, w: 0.257, h: 0.437 },
        { x: 0.9207, y: 0.3206, w: 0.0793, h: 0.2883 },
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
        { x: 0.0554, y: 0.055, w: 0.443, h: 0.8713 },
        { x: 0.3465, y: 0.0719, w: 0.5434, h: 0.8786 },
        { x: 0.6758, y: 0.0426, w: 0.2514, h: 0.3206 },
        { x: 0.8453, y: 0, w: 0.1547, h: 0.1955 },
        { x: 0.9267, y: 0.0567, w: 0.0733, h: 0.5305 },
        { x: 0, y: 0.0307, w: 0.1205, h: 0.4799 },
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
        { x: 0.4351, y: 0.0588, w: 0.3021, h: 0.5602 },
        { x: 0, y: 0.2107, w: 0.127, h: 0.4112 },
        { x: 0.1584, y: 0.0692, w: 0.2984, h: 0.473 },
        { x: 0.7716, y: 0.2696, w: 0.2284, h: 0.5107 },
        { x: 0.0016, y: 0, w: 0.1637, h: 0.2099 },
        { x: 0.6707, y: 0.7266, w: 0.3293, h: 0.1485 },
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
        { x: 0.1375, y: 0.0753, w: 0.6278, h: 0.9247 },
        { x: 0, y: 0.3555, w: 0.0581, h: 0.0933 },
        { x: 0.0385, y: 0.3374, w: 0.0531, h: 0.0963 },
        { x: 0.8965, y: 0.4768, w: 0.1035, h: 0.5232 },
        { x: 0.0147, y: 0.3529, w: 0.0622, h: 0.0914 },
      ],
    },
    {
      variant: "e",
      image: "/evaluation/cv/bboxes/img-4-e.jpg",
      label: "Détection de personnes",
      instruction: "Annotez chaque personne visible. Précisez la pose.",
      attributes: ["Personne en pied","Personne en buste","Groupe","Profil"],
      expectedAttribute: "Personne en pied",
      boxes: [
        { x: 0.1646, y: 0.6742, w: 0.1747, h: 0.3124 },
        { x: 0.6022, y: 0.7023, w: 0.1123, h: 0.2241 },
        { x: 0.9516, y: 0.704, w: 0.0484, h: 0.1992 },
        { x: 0.0895, y: 0.7321, w: 0.089, h: 0.2154 },
        { x: 0.877, y: 0.6946, w: 0.0907, h: 0.1897 },
        { x: 0.7117, y: 0.6917, w: 0.1216, h: 0.2074 },
      ],
    },
    {
      variant: "f",
      image: "/evaluation/cv/bboxes/img-4-f.jpg",
      label: "Détection de personnes",
      instruction: "Annotez chaque personne visible. Précisez la pose.",
      attributes: ["Personne en pied","Personne en buste","Groupe","Profil"],
      expectedAttribute: "Personne en pied",
      boxes: [
        { x: 0.634, y: 0.2638, w: 0.3506, h: 0.251 },
        { x: 0.0072, y: 0.22, w: 0.3096, h: 0.3049 },
        { x: 0.3946, y: 0.3062, w: 0.1093, h: 0.0996 },
        { x: 0.0331, y: 0.2748, w: 0.1035, h: 0.1446 },
        { x: 0.9311, y: 0.3064, w: 0.0688, h: 0.1238 },
        { x: 0.5654, y: 0.3224, w: 0.0927, h: 0.0921 },
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
        { x: 0.0471, y: 0.357, w: 0.317, h: 0.3183 },
        { x: 0.6182, y: 0.3436, w: 0.0488, h: 0.1847 },
        { x: 0.8381, y: 0.3729, w: 0.1078, h: 0.1043 },
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
        { x: 0.447, y: 0.0548, w: 0.0961, h: 0.1456 },
        { x: 0.3429, y: 0.0088, w: 0.2705, h: 0.1988 },
        { x: 0.7253, y: 0, w: 0.2061, h: 0.2208 },
        { x: 0.9323, y: 0.0016, w: 0.0677, h: 0.2256 },
      ],
    },
    {
      variant: "c",
      image: "/evaluation/cv/bboxes/img-5-c.jpg",
      label: "Vélos urbains",
      instruction: "Annotez chaque vélo visible.",
      attributes: ["Vélo","VTT","Trottinette","Autre"],
      expectedAttribute: "Vélo",
      boxes: [
        { x: 0.4588, y: 0.6662, w: 0.1887, h: 0.3337 },
        { x: 0.6672, y: 0.6519, w: 0.279, h: 0.3362 },
        { x: 0.3592, y: 0.6062, w: 0.0528, h: 0.1602 },
        { x: 0.4939, y: 0.7253, w: 0.0488, h: 0.2481 },
        { x: 0.2578, y: 0.5714, w: 0.1156, h: 0.0617 },
      ],
    },
    {
      variant: "d",
      image: "/evaluation/cv/bboxes/img-5-d.jpg",
      label: "Vélos urbains",
      instruction: "Annotez chaque vélo visible.",
      attributes: ["Vélo","VTT","Trottinette","Autre"],
      expectedAttribute: "Vélo",
      boxes: [
        { x: 0.2371, y: 0.7161, w: 0.1694, h: 0.2 },
        { x: 0.6248, y: 0.6857, w: 0.1273, h: 0.205 },
      ],
    },
    {
      variant: "e",
      image: "/evaluation/cv/bboxes/img-5-e.jpg",
      label: "Vélos urbains",
      instruction: "Annotez chaque vélo visible.",
      attributes: ["Vélo","VTT","Trottinette","Autre"],
      expectedAttribute: "Vélo",
      boxes: [
        { x: 0.3966, y: 0.2431, w: 0.4493, h: 0.4832 },
        { x: 0.1766, y: 0.1572, w: 0.222, h: 0.4574 },
      ],
    },
    {
      variant: "f",
      image: "/evaluation/cv/bboxes/img-5-f.jpg",
      label: "Vélos urbains",
      instruction: "Annotez chaque vélo visible.",
      attributes: ["Vélo","VTT","Trottinette","Autre"],
      expectedAttribute: "Vélo",
      boxes: [
        { x: 0.63, y: 0.6946, w: 0.221, h: 0.1937 },
        { x: 0.7967, y: 0.6667, w: 0.2033, h: 0.2387 },
        { x: 0.5183, y: 0.7452, w: 0.1601, h: 0.13 },
      ],
    },
  ],
};

export const CV_POLYGON_POOL = [
  {
    variant: "a",
    image: "/evaluation/cv/polygon/poly-a.jpg",
    category: "airplane",
    label: "Avion sur tarmac",
    instruction: "Tracez un polygone précis qui contourne la silhouette de l'objet (au moins 6 points, idéalement 12+ pour une bonne précision).",
    quadrants: 4,
    minPoints: 6,
    referencePoints: 55,
  },
  {
    variant: "b",
    image: "/evaluation/cv/polygon/poly-b.jpg",
    category: "boat",
    label: "Bateau / embarcation",
    instruction: "Tracez un polygone précis qui contourne la silhouette de l'objet (au moins 6 points, idéalement 12+ pour une bonne précision).",
    quadrants: 4,
    minPoints: 6,
    referencePoints: 41,
  },
  {
    variant: "c",
    image: "/evaluation/cv/polygon/poly-c.jpg",
    category: "bus",
    label: "Bus urbain",
    instruction: "Tracez un polygone précis qui contourne la silhouette de l'objet (au moins 6 points, idéalement 12+ pour une bonne précision).",
    quadrants: 4,
    minPoints: 6,
    referencePoints: 40,
  },
  {
    variant: "d",
    image: "/evaluation/cv/polygon/poly-d.jpg",
    category: "elephant",
    label: "Éléphant",
    instruction: "Tracez un polygone précis qui contourne la silhouette de l'objet (au moins 6 points, idéalement 12+ pour une bonne précision).",
    quadrants: 4,
    minPoints: 6,
    referencePoints: 57,
  },
  {
    variant: "e",
    image: "/evaluation/cv/polygon/poly-e.jpg",
    category: "train",
    label: "Train",
    instruction: "Tracez un polygone précis qui contourne la silhouette de l'objet (au moins 6 points, idéalement 12+ pour une bonne précision).",
    quadrants: 4,
    minPoints: 6,
    referencePoints: 31,
  },
  {
    variant: "f",
    image: "/evaluation/cv/polygon/poly-f.jpg",
    category: "truck",
    label: "Camion",
    instruction: "Tracez un polygone précis qui contourne la silhouette de l'objet (au moins 6 points, idéalement 12+ pour une bonne précision).",
    quadrants: 4,
    minPoints: 6,
    referencePoints: 27,
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
