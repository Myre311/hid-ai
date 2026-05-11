/**
 * Test Vision Edge Optimization.
 * - quiz: 10 QCM techniques
 * - calc: paramètres d'un modèle YOLOv8 + valeurs attendues
 *
 * Énoncé du calcul :
 *   "Un modèle YOLOv8 fait 250 MB en FP32 et tourne à 12 FPS sur CPU.
 *    Quelle sera sa taille après quantification INT8 ?
 *    Quel FPS estimé après optimisation (INT8 + ONNX Runtime) ?"
 *
 * Réponses attendues :
 *   - taille INT8 : ~62.5 MB (4× réduction, tolérance ±15%)
 *   - FPS estimé  : ~35 FPS (gain typique 2-3×, tolérance ±15%)
 */
export const VISION_EDGE_DATA = {
  scenario: {
    model: "YOLOv8m",
    initial_size_mb: 250,
    initial_fps: 12,
  },
  expected_size_mb: 62.5,
  expected_fps: 35,
  quiz: [
    {
      id: "q-01",
      question: "La quantification INT8 réduit la taille d'un modèle FP32 d'un facteur :",
      options: { A: "× 2", B: "× 4", C: "× 8", D: "Aucune réduction" },
      answer: "B",
    },
    {
      id: "q-02",
      question: "Quel runtime est typiquement utilisé pour déployer un modèle PyTorch sur NVIDIA edge ?",
      options: { A: "TensorRT", B: "Excel", C: "Apache Spark", D: "Kafka" },
      answer: "A",
    },
    {
      id: "q-03",
      question: "Différence principale YOLOv8 vs YOLOv5 ?",
      options: {
        A: "YOLOv8 est anchor-free et offre généralement de meilleures performances à taille égale.",
        B: "YOLOv8 ne supporte que les images carrées.",
        C: "YOLOv5 est plus récent.",
        D: "Aucune différence, ce sont des alias.",
      },
      answer: "A",
    },
    {
      id: "q-04",
      question: "ONNX permet :",
      options: {
        A: "D'exporter un modèle dans un format inter-opérable entre PyTorch, TF, ONNX Runtime, TensorRT, etc.",
        B: "De compresser les modèles en perdant 90% de leur qualité.",
        C: "Uniquement de visualiser un modèle.",
        D: "De ne supporter que les CPU Intel.",
      },
      answer: "A",
    },
    {
      id: "q-05",
      question: "Quelle métrique distingue inférence latence et débit (throughput) ?",
      options: {
        A: "Latence = temps d'une inférence ; throughput = nb d'inférences/sec.",
        B: "C'est la même chose.",
        C: "Latence se mesure en MB.",
        D: "Throughput se mesure en degrés Celsius.",
      },
      answer: "A",
    },
    {
      id: "q-06",
      question: "Pour déployer sur mobile (iOS), quel format est le plus adapté ?",
      options: { A: "CoreML", B: "ZIP", C: "PNG", D: "DOCX" },
      answer: "A",
    },
    {
      id: "q-07",
      question: "Quel impact a la quantification INT8 sur la précision (mAP) ?",
      options: {
        A: "Aucun, c'est toujours équivalent au FP32.",
        B: "Légère dégradation (typiquement < 1-2 points de mAP) après calibration.",
        C: "Perte massive de 30 points minimum.",
        D: "Augmentation systématique de la précision.",
      },
      answer: "B",
    },
    {
      id: "q-08",
      question: "Quelle technique sert à réduire un modèle en s'inspirant d'un modèle plus grand ?",
      options: { A: "Distillation", B: "Réplication", C: "Sérialisation", D: "Compilation JIT" },
      answer: "A",
    },
    {
      id: "q-09",
      question: "Calibration INT8 : pourquoi a-t-on besoin d'un dataset représentatif ?",
      options: {
        A: "Pour calculer les bonnes plages dynamiques par tenseur.",
        B: "Pour réentraîner le modèle from scratch.",
        C: "Pour des raisons légales.",
        D: "Pour générer le manifest ONNX.",
      },
      answer: "A",
    },
    {
      id: "q-10",
      question: "Sur Raspberry Pi 5 sans accélérateur, quel ordre de grandeur de FPS espérer pour un YOLOv8n quantifié INT8 ?",
      options: { A: "Quelques FPS (3-10)", B: "200+ FPS", C: "Aucune inférence possible", D: "1000 FPS minimum" },
      answer: "A",
    },
  ],
};
