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
      options: { A: "× 4", B: "× 2", C: "× 8", D: "Aucune réduction" },
      answer: "A",
    },
    {
      id: "q-02",
      question: "Quel runtime est typiquement utilisé pour déployer un modèle PyTorch sur NVIDIA edge ?",
      options: { A: "Excel", B: "TensorRT", C: "Apache Spark", D: "Kafka" },
      answer: "B",
    },
    {
      id: "q-03",
      question: "Différence principale YOLOv8 vs YOLOv5 ?",
      options: {
        A: "Aucune différence, ce sont des alias.",
        B: "YOLOv8 ne supporte que les images carrées.",
        C: "YOLOv5 est plus récent.",
        D: "YOLOv8 est anchor-free et offre généralement de meilleures performances à taille égale.",
      },
      answer: "D",
    },
    {
      id: "q-04",
      question: "ONNX permet :",
      options: {
        A: "De ne supporter que les CPU Intel.",
        B: "De compresser les modèles en perdant 90% de leur qualité.",
        C: "Uniquement de visualiser un modèle.",
        D: "D'exporter un modèle dans un format inter-opérable entre PyTorch, TF, ONNX Runtime, TensorRT, etc.",
      },
      answer: "D",
    },
    {
      id: "q-05",
      question: "Quelle métrique distingue inférence latence et débit (throughput) ?",
      options: { A: "Latence = temps d'une inférence ; throughput = nb d'inférences/sec.", B: "C'est la même chose.", C: "Latence se mesure en MB.", D: "Throughput se mesure en degrés Celsius." },
      answer: "A",
    },
    {
      id: "q-06",
      question: "Pour déployer sur mobile (iOS), quel format est le plus adapté ?",
      options: { A: "ZIP", B: "CoreML", C: "PNG", D: "DOCX" },
      answer: "B",
    },
    {
      id: "q-07",
      question: "Quel impact a la quantification INT8 sur la précision (mAP) ?",
      options: {
        A: "Légère dégradation (typiquement < 1-2 points de mAP) après calibration.",
        B: "Aucun, c'est toujours équivalent au FP32.",
        C: "Perte massive de 30 points minimum.",
        D: "Augmentation systématique de la précision.",
      },
      answer: "A",
    },
    {
      id: "q-08",
      question: "Quelle technique sert à réduire un modèle en s'inspirant d'un modèle plus grand ?",
      options: { A: "Réplication", B: "Distillation", C: "Sérialisation", D: "Compilation JIT" },
      answer: "B",
    },
    {
      id: "q-09",
      question: "Calibration INT8 : pourquoi a-t-on besoin d'un dataset représentatif ?",
      options: { A: "Pour des raisons légales.", B: "Pour réentraîner le modèle from scratch.", C: "Pour calculer les bonnes plages dynamiques par tenseur.", D: "Pour générer le manifest ONNX." },
      answer: "C",
    },
    {
      id: "q-10",
      question: "Sur Raspberry Pi 5 sans accélérateur, quel ordre de grandeur de FPS espérer pour un YOLOv8n quantifié INT8 ?",
      options: { A: "Aucune inférence possible", B: "200+ FPS", C: "Quelques FPS (3-10)", D: "1000 FPS minimum" },
      answer: "C",
    },
  ],
};
