/**
 * Test fine-tuning NLP.
 * - Partie 1 : 10 QCM techniques (answer = lettre A/B/C/D)
 * - Partie 2 : 5 paires (Q,A) à transformer en JSONL d'instruction.
 *   Le scoring vérifie juste que c'est un JSON parseable avec
 *   { instruction, input, output } string.
 */
export const NLP_FINETUNING_DATA = {
  quiz: [
    {
      id: "q-01",
      question: "Quelle est la différence principale entre LoRA et QLoRA ?",
      options: {
        A: "LoRA gèle les poids et ajoute des matrices de rang faible ; QLoRA fait la même chose mais sur un modèle quantifié en 4-bit, réduisant drastiquement la VRAM nécessaire.",
        B: "LoRA entraîne tous les poids, QLoRA n'en entraîne que la moitié.",
        C: "QLoRA est une version pour Q&A uniquement, LoRA est généraliste.",
        D: "Ce sont des synonymes.",
      },
      answer: "A",
    },
    {
      id: "q-02",
      question: "Quel format est le standard de facto pour le fine-tuning d'instruction ?",
      options: {
        A: "CSV avec colonnes prompt/response",
        B: "JSONL avec champs instruction / input / output",
        C: "Markdown structuré",
        D: "Parquet binaire",
      },
      answer: "B",
    },
    {
      id: "q-03",
      question: "Quel hyperparamètre influence le plus la convergence en fine-tuning ?",
      options: {
        A: "La taille du dataset",
        B: "Le learning rate",
        C: "La couleur du logo du modèle",
        D: "Le nom du fichier",
      },
      answer: "B",
    },
    {
      id: "q-04",
      question: "Que mesure la perplexity ?",
      options: {
        A: "La taille du modèle en GB",
        B: "Le nombre de paramètres entraînables",
        C: "L'incertitude du modèle face à une séquence — plus c'est bas, plus le modèle est confiant.",
        D: "Le temps de réponse moyen en ms",
      },
      answer: "C",
    },
    {
      id: "q-05",
      question: "Mistral 7B est-il un modèle open weight ou closed source ?",
      options: {
        A: "Closed source, payant",
        B: "Open weight sous licence Apache 2.0",
        C: "Closed source mais gratuit",
        D: "Open source uniquement pour la recherche",
      },
      answer: "B",
    },
    {
      id: "q-06",
      question: "Combien d'epochs sont généralement recommandés pour un fine-tuning d'instruction sur ~10k exemples ?",
      options: {
        A: "1 à 3 epochs",
        B: "30 à 50 epochs",
        C: "100 epochs minimum",
        D: "Aucun, le fine-tuning n'utilise pas d'epochs",
      },
      answer: "A",
    },
    {
      id: "q-07",
      question: "Quel est l'effet d'un batch size trop grand ?",
      options: {
        A: "Pas d'effet, c'est juste de la vitesse en plus",
        B: "Risque de moins bien généraliser et d'avoir besoin de plus de VRAM",
        C: "Le modèle se compresse automatiquement",
        D: "Le learning rate s'ajuste tout seul",
      },
      answer: "B",
    },
    {
      id: "q-08",
      question: "Quelle bibliothèque Hugging Face est utilisée pour le fine-tuning ?",
      options: {
        A: "Transformers + Datasets + TRL / PEFT",
        B: "Pandas + Numpy uniquement",
        C: "Scikit-learn + XGBoost",
        D: "OpenCV",
      },
      answer: "A",
    },
    {
      id: "q-09",
      question: "Pourquoi le format JSONL plutôt que JSON pour les datasets ?",
      options: {
        A: "Le JSON ne supporte pas l'UTF-8",
        B: "Pour permettre un streaming ligne par ligne sans tout charger en mémoire",
        C: "C'est plus joli visuellement",
        D: "C'est uniquement pour les fichiers de moins de 100 lignes",
      },
      answer: "B",
    },
    {
      id: "q-10",
      question: "Quelle métrique est la plus fiable pour évaluer un modèle fine-tuné ?",
      options: {
        A: "Le nombre de paramètres",
        B: "Une évaluation humaine + une éval automatique sur un benchmark adapté à la tâche",
        C: "Le temps d'entraînement",
        D: "Le coût en kWh",
      },
      answer: "B",
    },
  ],
  // Les 5 paires que le candidat doit reformater en JSONL.
  // (Pas utilisé directement par le scoring — juste pour info contextuelle côté UI.)
  qa_pairs: [
    {
      q: "Comment réinitialiser mon mot de passe ?",
      a: "Cliquez sur 'Mot de passe oublié' depuis la page de connexion, puis suivez les instructions reçues par email.",
    },
    {
      q: "Quels sont les horaires du support ?",
      a: "Le support est joignable du lundi au vendredi, de 9h à 18h (heure de Paris).",
    },
    {
      q: "Comment exporter mes données ?",
      a: "Allez dans Paramètres > Confidentialité > Exporter mes données pour télécharger une archive ZIP.",
    },
    {
      q: "Le service est-il conforme au RGPD ?",
      a: "Oui, nous sommes pleinement conformes au RGPD et hébergeons toutes les données en Europe.",
    },
    {
      q: "Comment supprimer mon compte ?",
      a: "Depuis Paramètres > Compte > Supprimer mon compte. La suppression est définitive après 30 jours.",
    },
  ],
};
