/**
 * Test MLOps — scénario HID AI.
 *
 * Scénario : 100 AI Specialists annotent quotidiennement des tickets support
 * technique pour entraîner un modèle de classification multi-classes.
 *
 * Sections :
 * - quiz : 10 QCM
 * - architecture_order : 9 étapes canoniques d'un pipeline MLOps complet
 *   (ingestion → versioning → validation → features → training → evaluation
 *   → registry → deployment → monitoring)
 * - drift : 5 features avec stats (KS, mean shift) + 2 questions de diagnostic
 */
export const MLOPS_DATA = {
  scenario: {
    title: "Pipeline MLOps — 100 annotateurs HID AI",
    description:
      "Sur la plateforme HID AI, 100 AI Specialists annotent quotidiennement des tickets support technique pour entraîner un modèle de classification multi-classes (10 catégories). Volume : 5 000 tickets / jour, 80 langues, et un modèle redéployé chaque semaine.",
  },
  architecture_order: [
    "annotation",
    "kappa_validation",
    "ingestion",
    "versioning",
    "validation",
    "features",
    "training",
    "evaluation",
    "registry",
    "deployment",
  ],
  architecture_steps: {
    annotation: "Annotation par 100 AI Specialists HID AI",
    kappa_validation: "Validation inter-annotateur (κ de Cohen)",
    ingestion: "Data ingestion (5 000 tickets / jour, S3 + Airbyte)",
    versioning: "Data versioning (DVC)",
    validation: "Data validation (Great Expectations)",
    features: "Feature engineering (embeddings, langue, longueur)",
    training: "Model training (XGBoost + DistilBERT)",
    evaluation: "Model evaluation (F1 macro, par catégorie)",
    registry: "Model registry (MLflow → staging/prod)",
    deployment: "Deployment + monitoring (canary + Prometheus)",
  },
  // Tableau de Data Drift — distributions production vs entraînement.
  // ks = statistique de Kolmogorov-Smirnov (0 = aucun drift, 1 = drift total).
  drift: {
    features: [
      {
        id: "ticket_length",
        name: "Longueur du ticket (caractères)",
        reference_mean: 245,
        production_mean: 268,
        ks: 0.08,
        status: "ok",
      },
      {
        id: "language",
        name: "Langue détectée",
        reference_mean: "fr 62 % / en 28 %",
        production_mean: "fr 41 % / en 38 % / sw 12 %",
        ks: 0.42,
        status: "alert",
      },
      {
        id: "category_priority",
        name: "Priorité ticket (1-5)",
        reference_mean: 2.8,
        production_mean: 2.9,
        ks: 0.05,
        status: "ok",
      },
      {
        id: "embedding_norm",
        name: "Norme L2 des embeddings",
        reference_mean: 0.82,
        production_mean: 0.81,
        ks: 0.04,
        status: "ok",
      },
      {
        id: "client_tier",
        name: "Tier client (free/pro/ent)",
        reference_mean: "free 70 % / pro 25 %",
        production_mean: "free 70 % / pro 25 %",
        ks: 0.02,
        status: "ok",
      },
    ],
    questions: [
      {
        id: "d-01",
        question:
          "Quelle feature montre un drift significatif justifiant une alerte ?",
        options: {
          A: "ticket_length",
          B: "language",
          C: "category_priority",
          D: "embedding_norm",
        },
        answer: "B",
      },
      {
        id: "d-02",
        question:
          "Que recommandez-vous quand le drift est confirmé sur la langue (KS = 0.42) ?",
        options: {
          A: "Ignorer — la dérive sur la langue n'a pas d'impact business.",
          B: "Déclencher un retraining avec un nouvel échantillon représentatif (incluant Swahili) et redéployer en canary.",
          C: "Supprimer la feature langue du modèle.",
          D: "Couper la production le temps de comprendre.",
        },
        answer: "B",
      },
    ],
  },
  quiz: [
    {
      id: "q-01",
      question: "À quoi sert DVC dans un pipeline MLOps ?",
      options: { A: "Surveiller la consommation GPU.", B: "Détecter le drift en production.", C: "Versionner datasets et artefacts ML via Git métadonnées + storage remote.", D: "Compresser les modèles INT4." },
      answer: "C",
    },
    {
      id: "q-02",
      question: "MLflow est principalement utilisé pour :",
      options: { A: "Tracker les expériences, versionner les modèles, déployer.", B: "Faire de la BI sur Excel.", C: "Compiler du code C++.", D: "Envoyer des emails marketing." },
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
      question:
        "Sur HID AI : 100 annotateurs produisent 5 000 tickets / jour. Quelle stratégie de retraining est la plus saine ?",
      options: {
        A: "Retraining quotidien complet sur tout l'historique, sans contrôle qualité.",
        B: "Retraining hebdomadaire incrémental, validé par F1 macro + revue d'un sous-ensemble de prédictions.",
        C: "Pas de retraining tant que la précision globale reste > 50 %.",
        D: "Retraining manuel uniquement quand un client se plaint.",
      },
      answer: "B",
    },
    {
      id: "q-05",
      question: "Quel outil sert à orchestrer des pipelines ML ?",
      options: { A: "Notion", B: "Airflow / Prefect / Kubeflow", C: "Slack", D: "Figma" },
      answer: "B",
    },
    {
      id: "q-06",
      question: "Différence CI/CD applicatif vs CI/CD ML ?",
      options: {
        A: "Le CI/CD applicatif n'existe pas.",
        B: "C'est exactement la même chose.",
        C: "Le ML n'a pas besoin de CI/CD.",
        D: "Le ML demande en plus le versioning du data et du modèle, et la validation continue des performances.",
      },
      answer: "D",
    },
    {
      id: "q-07",
      question:
        "Avec 100 annotateurs, l'inter-annotator agreement (kappa de Cohen) chute à 0.42. Que faire ?",
      options: {
        A: "Rien, c'est normal.",
        B: "Changer de modèle.",
        C: "Doubler le nombre d'annotateurs.",
        D: "Re-clarifier les guidelines d'annotation, faire un calibration round, et exclure les annotateurs systématiquement divergents.",
      },
      answer: "D",
    },
    {
      id: "q-08",
      question: "Que fait l'étape Feature Engineering ?",
      options: {
        A: "Tracer les logs d'inférence.",
        B: "Déployer en production.",
        C: "Transformer les données brutes en variables utiles au modèle (normalisation, encoding, agrégations).",
        D: "Compresser les modèles.",
      },
      answer: "C",
    },
    {
      id: "q-09",
      question: "Pourquoi un Model Registry est-il indispensable à grande échelle ?",
      options: {
        A: "Pour versionner les modèles, suivre leur stage (staging/prod), garantir la reproductibilité et permettre le rollback.",
        B: "Pour stocker les images Docker uniquement.",
        C: "Pour exporter les jeux de données.",
        D: "Aucun intérêt, on peut juste utiliser des dossiers locaux.",
      },
      answer: "A",
    },
    {
      id: "q-10",
      question:
        "Quelle pratique permet de détecter une dégradation du modèle en production avant les utilisateurs ?",
      options: {
        A: "Faire des tests unitaires sur le frontend.",
        B: "Monitoring continu (data drift, concept drift, métriques business) avec alerting Prometheus.",
        C: "Augmenter la VRAM du serveur.",
        D: "Mettre le projet en pause.",
      },
      answer: "B",
    },
  ],
};
