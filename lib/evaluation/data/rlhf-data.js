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
    question: "Comment optimiser le temps d'inférence d'un modèle LLM ?",
    a: "Plusieurs leviers : quantification (INT8/INT4), batching dynamique, mise en cache des prompts récurrents, distillation vers un modèle plus petit, et choix du moteur d'inférence adapté (vLLM, TensorRT-LLM).",
    b: "Il faut augmenter la taille du modèle pour qu'il soit plus rapide et utiliser un GPU plus puissant.",
    expected: "A",
    hint: "Réponse B est techniquement fausse (plus gros = plus lent).",
  },
  {
    id: "r-05",
    question: "Quelle est la différence entre une fonction et une closure en JavaScript ?",
    a: "Une fonction est un bloc de code réutilisable. Une closure est une fonction qui capture les variables de son scope environnant et conserve l'accès à ces variables même après la sortie du scope parent.",
    b: "Une fonction et une closure, c'est la même chose en JavaScript moderne, le terme closure est juste une appellation académique sans implication technique.",
    expected: "A",
    hint: "Réponse B est fausse.",
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
    question: "Quel est le principe d'un transformer ?",
    a: "Le transformer repose sur le mécanisme d'attention (self-attention) qui permet de relier chaque token à tous les autres tokens d'une séquence, avec un encodage positionnel pour conserver l'ordre.",
    b: "Le transformer est un réseau de neurones récurrent qui traite les séquences mot par mot dans l'ordre, comme les LSTM mais en plus rapide.",
    expected: "A",
    hint: "Réponse B confond transformer et RNN/LSTM.",
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
