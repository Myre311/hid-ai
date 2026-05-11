/**
 * Ground truth pour le test Computer Vision.
 * 5 images placeholder (générées en SVG côté client si pas de fichier).
 * Coordonnées normalisées : 0-1 par rapport à la dimension de l'image.
 * Le candidat dessine ses bounding boxes en pixels relatifs au canvas,
 * on convertit en relatif côté scoring.
 *
 * Format box : { x, y, w, h } — tout normalisé entre 0 et 1.
 */
export const CV_GROUND_TRUTH = [
  {
    id: "img-1",
    label: "Personnes avec casque",
    instruction: "Annotez toutes les personnes portant un casque de sécurité.",
    src: "/evaluation/cv/img-1.svg",
    boxes: [
      { x: 0.12, y: 0.18, w: 0.18, h: 0.45 },
      { x: 0.42, y: 0.22, w: 0.16, h: 0.4 },
      { x: 0.7, y: 0.2, w: 0.17, h: 0.43 },
    ],
  },
  {
    id: "img-2",
    label: "Voitures",
    instruction: "Annotez chaque voiture visible (sans les vélos ni les piétons).",
    src: "/evaluation/cv/img-2.svg",
    boxes: [
      { x: 0.05, y: 0.4, w: 0.28, h: 0.32 },
      { x: 0.36, y: 0.42, w: 0.3, h: 0.33 },
      { x: 0.7, y: 0.38, w: 0.28, h: 0.36 },
    ],
  },
  {
    id: "img-3",
    label: "Panneaux de signalisation",
    instruction: "Annotez les panneaux de signalisation routière.",
    src: "/evaluation/cv/img-3.svg",
    boxes: [
      { x: 0.15, y: 0.1, w: 0.12, h: 0.18 },
      { x: 0.65, y: 0.08, w: 0.13, h: 0.2 },
    ],
  },
  {
    id: "img-4",
    label: "Visages",
    instruction: "Annotez chaque visage humain de face (de profil exclu).",
    src: "/evaluation/cv/img-4.svg",
    boxes: [
      { x: 0.2, y: 0.25, w: 0.15, h: 0.22 },
      { x: 0.55, y: 0.28, w: 0.14, h: 0.21 },
      { x: 0.78, y: 0.3, w: 0.12, h: 0.18 },
    ],
  },
  {
    id: "img-5",
    label: "Outils mécaniques",
    instruction: "Annotez les outils mécaniques (clé, marteau, tournevis).",
    src: "/evaluation/cv/img-5.svg",
    boxes: [
      { x: 0.1, y: 0.35, w: 0.22, h: 0.3 },
      { x: 0.4, y: 0.4, w: 0.18, h: 0.32 },
      { x: 0.65, y: 0.35, w: 0.25, h: 0.3 },
    ],
  },
];
