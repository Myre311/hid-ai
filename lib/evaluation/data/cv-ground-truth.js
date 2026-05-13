/**
 * Ground truth pour le test Computer Vision.
 *
 * 5 images en mode bounding box + 1 image polygone.
 * Coordonnées normalisées : 0-1 par rapport à la dimension de l'image.
 *
 * Chaque image définit `attributes` : la liste des labels possibles.
 * On considère l'image mono-classe — l'attribut attendu est le premier
 * label de la liste. Les autres sont des distracteurs.
 *
 * Format box : { x, y, w, h } — tout normalisé entre 0 et 1.
 */
// Note: img-2 à img-5 utilisent maintenant des vraies photos COCO val2017
// (CC-BY-4.0). img-1 conserve une illustration SVG en attendant une vraie
// scène de chantier multi-couleurs casques (en cours de génération via IA).
export const CV_GROUND_TRUTH = [
  {
    id: "img-1",
    image: "/evaluation/cv/bboxes/img-1.svg",
    label: "Personnes avec casque",
    instruction:
      "Annotez toutes les personnes portant un casque de sécurité. Précisez l'attribut pour chaque box.",
    attributes: ["Casque jaune", "Casque blanc", "Casque rouge", "Sans casque"],
    expectedAttribute: "Casque jaune",
    boxes: [
      { x: 0.12, y: 0.18, w: 0.18, h: 0.45 },
      { x: 0.42, y: 0.22, w: 0.16, h: 0.4 },
      { x: 0.7, y: 0.2, w: 0.17, h: 0.43 },
    ],
  },
  {
    id: "img-2",
    image: "/evaluation/cv/bboxes/img-2.jpg",
    label: "Voitures et véhicules",
    instruction:
      "Annotez chaque voiture visible. Précisez le type pour chaque box.",
    attributes: ["Voiture", "Camion", "Bus", "Moto"],
    expectedAttribute: "Voiture",
    boxes: [
      { x: 0.7553, y: 0.2955, w: 0.2447, h: 0.1494 },
      { x: 0.0279, y: 0.308,  w: 0.1503, h: 0.1528 },
      { x: 0.1754, y: 0.3187, w: 0.1843, h: 0.1361 },
      { x: 0.5593, y: 0.2818, w: 0.2223, h: 0.2085 },
      { x: 0.3832, y: 0.3261, w: 0.1023, h: 0.1014 },
    ],
  },
  {
    id: "img-3",
    image: "/evaluation/cv/bboxes/img-3.jpg",
    label: "Panneau STOP",
    instruction:
      "Annotez le panneau de signalisation routière. Précisez le type.",
    attributes: ["Stop", "Limitation vitesse", "Direction", "Autre"],
    expectedAttribute: "Stop",
    boxes: [
      { x: 0.2157, y: 0.218, w: 0.0994, h: 0.2 },
    ],
  },
  {
    id: "img-4",
    image: "/evaluation/cv/bboxes/img-4.jpg",
    label: "Détection de personnes",
    instruction:
      "Annotez chaque personne visible. Précisez si elle est en pied ou en buste.",
    attributes: ["Personne en pied", "Personne en buste", "Groupe", "Profil"],
    expectedAttribute: "Personne en pied",
    boxes: [
      { x: 0.0205, y: 0.041,  w: 0.3674, h: 0.4157 },
      { x: 0.6875, y: 0.1104, w: 0.3125, h: 0.7635 },
      { x: 0.0,    y: 0.0,    w: 0.1257, h: 0.2642 },
      { x: 0.7987, y: 0.0,    w: 0.1149, h: 0.1229 },
    ],
  },
  {
    id: "img-5",
    image: "/evaluation/cv/bboxes/img-5.jpg",
    label: "Vélos urbains",
    instruction:
      "Annotez chaque vélo visible. Précisez le type pour chaque box.",
    attributes: ["Vélo", "VTT", "Trottinette", "Autre"],
    expectedAttribute: "Vélo",
    boxes: [
      { x: 0.447,  y: 0.0548, w: 0.0961, h: 0.1456 },
      { x: 0.3429, y: 0.0088, w: 0.2705, h: 0.1988 },
      { x: 0.7253, y: 0.0,    w: 0.2061, h: 0.2208 },
      { x: 0.9323, y: 0.0016, w: 0.0677, h: 0.2256 },
    ],
  },
];

/**
 * Mode polygone : 1 image avec une forme à contourner.
 * On scorera simplement sur le nombre minimum de points (≥ 4)
 * et la couverture (un point dans chaque quadrant attendu).
 */
export const CV_POLYGON_TARGET = {
  id: "poly-1",
  label: "Contour bâtiment vu du ciel",
  instruction:
    "Tracez un polygone (au moins 6 points) qui contourne la forme centrale. Cliquez pour ajouter des points puis « Fermer le polygone ».",
  // Quadrants attendus : couvre au moins 4 quadrants sur 4
  quadrants: 4,
  minPoints: 6,
};

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
