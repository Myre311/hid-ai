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
export const CV_GROUND_TRUTH = [
  {
    id: "img-1",
    label: "Personnes avec casque",
    instruction:
      "Annotez toutes les personnes portant un casque de sécurité. Précisez l'attribut pour chaque box.",
    attributes: ["Casque jaune", "Casque blanc", "Sans casque", "Autre EPI"],
    expectedAttribute: "Casque jaune",
    boxes: [
      { x: 0.12, y: 0.18, w: 0.18, h: 0.45 },
      { x: 0.42, y: 0.22, w: 0.16, h: 0.4 },
      { x: 0.7, y: 0.2, w: 0.17, h: 0.43 },
    ],
  },
  {
    id: "img-2",
    label: "Voitures",
    instruction:
      "Annotez chaque voiture visible. Précisez le type pour chaque box.",
    attributes: ["Voiture", "Camion", "Vélo", "Piéton"],
    expectedAttribute: "Voiture",
    boxes: [
      { x: 0.05, y: 0.4, w: 0.28, h: 0.32 },
      { x: 0.36, y: 0.42, w: 0.3, h: 0.33 },
      { x: 0.7, y: 0.38, w: 0.28, h: 0.36 },
    ],
  },
  {
    id: "img-3",
    label: "Panneaux de signalisation",
    instruction:
      "Annotez les panneaux de signalisation routière. Précisez le type.",
    attributes: ["Stop", "Limitation vitesse", "Direction", "Autre"],
    expectedAttribute: "Stop",
    boxes: [
      { x: 0.15, y: 0.1, w: 0.12, h: 0.18 },
      { x: 0.65, y: 0.08, w: 0.13, h: 0.2 },
    ],
  },
  {
    id: "img-4",
    label: "Visages",
    instruction:
      "Annotez chaque visage humain de face. Précisez l'attribut âge.",
    attributes: ["Adulte", "Enfant", "Sénior", "Profil"],
    expectedAttribute: "Adulte",
    boxes: [
      { x: 0.2, y: 0.25, w: 0.15, h: 0.22 },
      { x: 0.55, y: 0.28, w: 0.14, h: 0.21 },
      { x: 0.78, y: 0.3, w: 0.12, h: 0.18 },
    ],
  },
  {
    id: "img-5",
    label: "Outils mécaniques",
    instruction:
      "Annotez les outils mécaniques. Précisez le type pour chaque box.",
    attributes: ["Clé", "Marteau", "Tournevis", "Autre"],
    expectedAttribute: "Clé",
    boxes: [
      { x: 0.1, y: 0.35, w: 0.22, h: 0.3 },
      { x: 0.4, y: 0.4, w: 0.18, h: 0.32 },
      { x: 0.65, y: 0.35, w: 0.25, h: 0.3 },
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
