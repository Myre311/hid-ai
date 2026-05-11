/**
 * 10 paires de réponses LLM à comparer.
 * Pour chacune : la "meilleure" réponse selon des critères de qualité
 * (factualité, absence d'hallucination, concision, structure).
 *
 * expected: "A" | "B" | "tie"
 */
export const RLHF_DATA = [
  {
    id: "r-01",
    question:
      "Quelle est la capitale du Sénégal et quel est le fleuve qui la borde ?",
    a: "Dakar, capitale du Sénégal, est située sur la presqu'île du Cap-Vert et bordée par l'océan Atlantique (et non par un fleuve principal).",
    b: "Dakar est la capitale du Sénégal et est bordée par le fleuve Sénégal qui se jette dans l'Atlantique juste à côté de la ville.",
    expected: "A",
    hint: "Réponse B contient une hallucination (le fleuve Sénégal se jette à Saint-Louis, pas à Dakar).",
  },
  {
    id: "r-02",
    question: "Explique le concept de RLHF en une phrase.",
    a: "Le RLHF (Reinforcement Learning from Human Feedback) est une technique d'entraînement où un modèle de langage est affiné à partir de préférences humaines exprimées en classant ou évaluant ses sorties.",
    b: "RLHF est une méthode où l'on entraîne un modèle en lui montrant beaucoup d'exemples annotés et où les humains corrigent ses réponses ligne par ligne en temps réel pendant qu'il génère.",
    expected: "A",
    hint: "Réponse B confond RLHF et supervised fine-tuning.",
  },
  {
    id: "r-03",
    question: "Combien fait 2 + 2 × 3 ?",
    a: "12 — on additionne d'abord 2 et 2, puis on multiplie par 3.",
    b: "8 — par convention, la multiplication est prioritaire : 2 × 3 = 6, puis 2 + 6 = 8.",
    expected: "B",
    hint: "Réponse A ignore la priorité des opérations.",
  },
  {
    id: "r-04",
    question: "Quelle est la procédure exacte pour constituer une SARL en zone OHADA ?",
    a: "Constitution d'une SARL OHADA : 1) statuts authentiques (notariés), 2) capital social minimum de 1 000 000 FCFA libéré à 50%, 3) immatriculation au RCCM (Registre du Commerce et du Crédit Mobilier), 4) publication d'un avis légal dans un journal d'annonces. Délai 7 à 15 jours ouvrés.",
    b: "Pour créer une SARL en Afrique il faut aller chez un notaire avec de l'argent et des papiers. Ensuite tu t'inscris au registre et tu publies dans le journal. Ça prend plusieurs semaines mais ça se fait vite si tu connais les bonnes personnes.",
    expected: "A",
    hint: "Réponse B est imprécise (pas de mention du capital minimum, RCCM, ni du délai légal) et le ton ne convient pas à un contexte juridique.",
  },
  {
    id: "r-05",
    question: "Explique le mécanisme de la photosynthèse à un patient curieux, simplement.",
    a: "La photosynthèse, c'est comment les plantes fabriquent leur nourriture. Elles captent la lumière du soleil avec leurs feuilles, absorbent l'eau par les racines et le CO₂ de l'air, et transforment tout ça en sucre (leur énergie) en relâchant l'oxygène que nous respirons.",
    b: "Les plantes effectuent la photosynthèse via la chlorophylle des chloroplastes des cellules végétales eucaryotes, suivant le cycle de Calvin et la phosphorylation oxydative, transformant le CO₂ et H₂O en glucose C₆H₁₂O₆ + O₂.",
    expected: "A",
    hint: "Réponse B est techniquement correcte mais inadaptée pour un patient (jargon biochimique). A est vulgarisée sans erreurs.",
  },
  {
    id: "r-06",
    question: "Quels sont les risques principaux d'un système RAG mal calibré ?",
    a: "Hallucinations renforcées par des chunks non pertinents, latence accrue, contexte saturé qui dégrade la qualité, et dépendance à la qualité de l'embedding et du chunking.",
    b: "Le risque principal est que le modèle devienne plus intelligent que prévu et invente des concepts auxquels son entraînement ne lui donnait pas accès.",
    expected: "A",
    hint: "Réponse B ne reflète pas la réalité technique.",
  },
  {
    id: "r-07",
    question: "Comment réduire les hallucinations d'un LLM en production ?",
    a: "Grounding via RAG, contraintes de génération (function calling, JSON schema), température basse, prompt engineering explicite (cite tes sources), et garde-fous a posteriori.",
    b: "Il suffit d'augmenter la température pour que le modèle soit plus créatif et invente moins.",
    expected: "A",
    hint: "Réponse B inverse la logique de la température.",
  },
  {
    id: "r-08",
    question: "Qu'est-ce que la mécanique quantique, pour un débutant ?",
    a: "La mécanique quantique est la branche de la physique qui décrit le comportement des particules à l'échelle atomique et subatomique. Contrairement à la physique classique, à cette échelle une particule peut exister dans plusieurs états en même temps (superposition) et son comportement est probabiliste plutôt que déterministe.",
    b: "La mécanique quantique a été inventée par Einstein en 1905 pour calculer la vitesse de la lumière. Elle est utilisée dans les ordinateurs quantiques de Google qui résolvent tous les problèmes mathématiques en quelques secondes grâce aux qubits, qui sont des particules d'or pur.",
    expected: "A",
    hint: "Réponse B accumule des hallucinations majeures (Einstein/quantique faux, qubits ≠ or, c=lumière non lié, surestimation des capacités).",
  },
  {
    id: "r-09",
    question: "À quoi sert DVC dans un pipeline MLOps ?",
    a: "DVC (Data Version Control) versionne datasets et artefacts ML en couplant Git pour les métadonnées et un stockage remote (S3, GCS, Azure) pour les blobs, sans alourdir le dépôt Git.",
    b: "DVC est un outil de drift detection qui surveille la production et alerte quand les données reçues dérivent de l'entraînement.",
    expected: "A",
    hint: "Réponse B confond DVC avec un système de monitoring.",
  },
  {
    id: "r-10",
    question: "Comment annoter un dataset de bounding boxes efficacement ?",
    a: "Utiliser un outil dédié (Labelbox, V7, CVAT), définir des guidelines visuelles claires, échantillonner un golden set pour la calibration inter-annotateurs, et mettre en place une boucle de QA aléatoire.",
    b: "Le plus simple est de laisser un seul annotateur expert faire toutes les annotations sans guidelines : ça garantit la cohérence.",
    expected: "A",
    hint: "Réponse B ignore les questions de couverture et de biais.",
  },
];
