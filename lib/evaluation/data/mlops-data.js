/**
 * Test MLOps.
 * - quiz : 10 QCM
 * - architecture_order : ordre canonique des 8 étapes du pipeline MLOps.
 *   Le candidat doit retrouver cet ordre en glissant les étapes.
 */
export const MLOPS_DATA = {
  architecture_order: [
    "ingestion",
    "versioning",
    "validation",
    "features",
    "training",
    "evaluation",
    "registry",
    "deployment",
  ],
  // Métadata pour l'UI (pas utilisé par le scoring)
  architecture_steps: {
    ingestion: "Data ingestion",
    versioning: "Data versioning (DVC)",
    validation: "Data validation (Great Expectations)",
    features: "Feature engineering",
    training: "Model training",
    evaluation: "Model evaluation",
    registry: "Model registry (MLflow)",
    deployment: "Deployment + monitoring",
  },
  quiz: [
    {
      id: "q-01",
      question: "À quoi sert DVC dans un pipeline MLOps ?",
      options: {
        A: "Versionner datasets et artefacts ML via Git métadonnées + storage remote.",
        B: "Détecter le drift en production.",
        C: "Surveiller la consommation GPU.",
        D: "Compresser les modèles INT4.",
      },
      answer: "A",
    },
    {
      id: "q-02",
      question: "MLflow est principalement utilisé pour :",
      options: {
        A: "Tracker les expériences, versionner les modèles, déployer.",
        B: "Faire de la BI sur Excel.",
        C: "Compiler du code C++.",
        D: "Envoyer des emails marketing.",
      },
      answer: "A",
    },
    {
      id: "q-03",
      question: "Qu'est-ce que le data drift ?",
      options: {
        A: "Changement progressif de la distribution des données en production par rapport à l'entraînement.",
        B: "Une métrique de précision.",
        C: "Un type de quantification.",
        D: "Un format de fichier propriétaire.",
      },
      answer: "A",
    },
    {
      id: "q-04",
      question: "Pourquoi a-t-on besoin d'un Model Registry ?",
      options: {
        A: "Pour versionner les modèles, suivre leur stage (staging/prod), et garantir la reproductibilité.",
        B: "Pour stocker les images Docker uniquement.",
        C: "Pour exporter les jeux de données.",
        D: "Aucun intérêt, on peut juste utiliser des dossiers locaux.",
      },
      answer: "A",
    },
    {
      id: "q-05",
      question: "Quel outil sert à orchestrer des pipelines ML ?",
      options: { A: "Airflow / Prefect / Kubeflow", B: "Notion", C: "Slack", D: "Figma" },
      answer: "A",
    },
    {
      id: "q-06",
      question: "Différence CI/CD applicatif vs CI/CD ML ?",
      options: {
        A: "Le ML demande en plus le versioning du data et du modèle, et la validation continue des performances.",
        B: "C'est exactement la même chose.",
        C: "Le ML n'a pas besoin de CI/CD.",
        D: "Le CI/CD applicatif n'existe pas.",
      },
      answer: "A",
    },
    {
      id: "q-07",
      question: "Great Expectations sert à :",
      options: {
        A: "Définir des tests / contrats sur les données (schéma, distribution, valeurs).",
        B: "Faire de l'optimisation INT8.",
        C: "Générer des prompts.",
        D: "Émettre des certificats SSL.",
      },
      answer: "A",
    },
    {
      id: "q-08",
      question: "Que fait l'étape Feature Engineering ?",
      options: {
        A: "Transformer les données brutes en variables utiles au modèle (normalisation, encoding, agrégations).",
        B: "Déployer en production.",
        C: "Tracer les logs d'inférence.",
        D: "Compresser les modèles.",
      },
      answer: "A",
    },
    {
      id: "q-09",
      question: "Feature Store, à quoi ça sert ?",
      options: {
        A: "Centraliser features réutilisables, garantir cohérence training/serving, gérer le time-travel.",
        B: "C'est juste un fichier CSV partagé.",
        C: "Un outil de versionning de prompts.",
        D: "Aucune utilité, c'est marketing.",
      },
      answer: "A",
    },
    {
      id: "q-10",
      question: "Quelle pratique permet de détecter une dégradation du modèle en production ?",
      options: {
        A: "Monitoring continu (data drift, concept drift, métriques business).",
        B: "Faire des tests unitaires sur le frontend.",
        C: "Augmenter la VRAM du serveur.",
        D: "Mettre le projet en pause.",
      },
      answer: "A",
    },
  ],
};
