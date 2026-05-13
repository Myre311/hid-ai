/**
 * Test fine-tuning NLP — contexte vertical africain (Droit OHADA / Fiscalité).
 * - Partie 1 : 10 QCM techniques (dont 4 spécifiques OHADA/Afrique)
 * - Partie 2 : 5 paires (Q,A) sur le Droit OHADA à reformater en JSONL
 * - Partie 3 : Lecture de courbe Perplexity + question livrable Dockerisé
 */
export const NLP_FINETUNING_DATA = {
  quiz: [
    // ── 4 questions contextualisées OHADA / Afrique ──
    {
      id: "q-01",
      question:
        "Pour fine-tuner un modèle sur le Droit OHADA (Organisation pour l'Harmonisation en Afrique du Droit des Affaires), quelle approche est la plus efficace ?",
      options: {
        A: "Fine-tuning d'un Mistral 7B avec LoRA sur un dataset d'instruction Q&A du Droit OHADA",
        B: "Pre-training from scratch sur tout le corpus OHADA",
        C: "Utilisation d'un modèle généraliste sans adaptation",
        D: "Annotation manuelle de chaque cas juridique",
      },
      answer: "A",
    },
    {
      id: "q-02",
      question:
        "Vous fine-tunez un modèle pour la Fiscalité de la CEMAC. Quel format de dataset est obligatoire ?",
      options: { A: "CSV avec colonnes texte", B: "Plain text séparé par lignes", C: "XML avec balises sémantiques", D: "JSONL avec champs instruction / input / output" },
      answer: "D",
    },
    {
      id: "q-03",
      question:
        "Sur un dataset de 5 000 paires Q&A sur la Fiscalité Africaine, quelle technique réduit le plus les coûts de calcul ?",
      options: { A: "Full fine-tuning sur GPU A100", B: "LoRA avec rank=8 ou QLoRA 4-bit (les deux acceptés)", C: "Inference only sans fine-tuning", D: "Pre-training from scratch" },
      answer: "B",
    },
    {
      id: "q-04",
      question:
        "Pour déployer le modèle fine-tuné OHADA en production avec la stack HID AI (PyTorch, Hugging Face, Docker, FastAPI), quel est le livrable cible ?",
      options: { A: "Notebook Jupyter avec les poids", B: "Fichier .pkl envoyé par email", C: "Modèle quantifié + API Dockerisée (FastAPI) prête à déployer", D: "Modèle publié sur HuggingFace Hub public" },
      answer: "C",
    },
    // ── 6 questions techniques classiques ──
    {
      id: "q-05",
      question: "Quelle est la différence principale entre LoRA et QLoRA ?",
      options: {
        A: "LoRA entraîne tous les poids, QLoRA n'en entraîne que la moitié.",
        B: "LoRA gèle les poids et ajoute des matrices de rang faible ; QLoRA fait la même chose mais sur un modèle quantifié 4-bit, réduisant drastiquement la VRAM.",
        C: "QLoRA est une version pour Q&A uniquement.",
        D: "Ce sont des synonymes.",
      },
      answer: "B",
    },
    {
      id: "q-06",
      question: "Que mesure la perplexity ?",
      options: {
        A: "L'incertitude du modèle sur une séquence — plus c'est bas, plus le modèle est confiant.",
        B: "Le nombre de paramètres entraînables",
        C: "La taille du modèle en GB",
        D: "Le temps de réponse moyen en ms",
      },
      answer: "A",
    },
    {
      id: "q-07",
      question: "Mistral 7B et Llama 3 sont :",
      options: {
        A: "Open weight (Apache 2.0 / Llama Community License) — utilisables pour le fine-tuning",
        B: "Closed source, payants",
        C: "Disponibles uniquement pour la recherche",
        D: "Des modèles d'images, pas de NLP",
      },
      answer: "A",
    },
    {
      id: "q-08",
      question:
        "Combien d'epochs sont généralement recommandés pour un fine-tuning d'instruction sur ~10k exemples ?",
      options: { A: "Aucun, on n'utilise pas d'epochs en fine-tuning", B: "30 à 50 epochs", C: "100 epochs minimum", D: "1 à 3 epochs" },
      answer: "D",
    },
    {
      id: "q-09",
      question: "Pourquoi le format JSONL plutôt que JSON pour les datasets ?",
      options: { A: "Le JSON ne supporte pas l'UTF-8", B: "C'est plus joli visuellement", C: "Pour streaming ligne par ligne sans tout charger en mémoire", D: "Uniquement pour les fichiers de moins de 100 lignes" },
      answer: "C",
    },
    {
      id: "q-10",
      question: "Quelle métrique est la plus fiable pour évaluer un modèle fine-tuné ?",
      options: { A: "Le nombre de paramètres", B: "Évaluation humaine + benchmark adapté à la tâche (perplexity + métriques métier)", C: "Le temps d'entraînement", D: "Le coût en kWh" },
      answer: "B",
    },
  ],

  // ── 5 paires Q&A en contexte Droit OHADA (à reformater en JSONL) ──
  qa_pairs: [
    {
      q: "Quelle est la procédure de constitution d'une SARL en zone OHADA ?",
      a: "La constitution d'une SARL OHADA requiert : 1) Statuts authentiques, 2) Capital minimum de 1 million FCFA libéré à hauteur de 50%, 3) Immatriculation au RCCM (Registre du Commerce et du Crédit Mobilier), 4) Publication d'un avis de constitution dans un journal d'annonces légales.",
    },
    {
      q: "Quel est le délai légal de paiement entre commerçants en zone OHADA ?",
      a: "Le délai de paiement entre commerçants OHADA, en l'absence de stipulation contractuelle, est fixé à trente (30) jours à compter de la réception des marchandises ou de l'exécution de la prestation. Des pénalités de retard sont dues de plein droit en cas de dépassement.",
    },
    {
      q: "Comment formaliser une cession de fonds de commerce en zone OHADA ?",
      a: "La cession d'un fonds de commerce OHADA exige un acte écrit, l'inscription d'un nantissement au RCCM, et le respect d'un délai d'opposition des créanciers de 30 jours après publication. Le prix doit être consigné chez un notaire pendant cette période.",
    },
    {
      q: "Quelles sont les obligations comptables d'une SA OHADA ?",
      a: "Une SA OHADA doit tenir une comptabilité conforme au Système Comptable OHADA (SYSCOHADA révisé), produire annuellement des états financiers (bilan, compte de résultat, annexe), et les faire certifier par un commissaire aux comptes.",
    },
    {
      q: "Quel régime de TVA s'applique aux exportations intra-CEMAC ?",
      a: "Les exportations intra-CEMAC bénéficient d'un régime de TVA à taux zéro sous condition de production de la facture, du document de transport et de la déclaration en douane. Le crédit de TVA est remboursable selon les modalités fiscales nationales.",
    },
  ],

  // ── Partie 3 — Analyse Perplexity ──
  perplexity: {
    // Données pour le graphique : 11 epochs (0 → 10)
    initialPerplexity: 45.2,
    finalPerplexity: 12.8,
    curve: [
      { epoch: 0, value: 45.2 },
      { epoch: 1, value: 38.7 },
      { epoch: 2, value: 31.4 },
      { epoch: 3, value: 26.1 },
      { epoch: 4, value: 22.5 },
      { epoch: 5, value: 19.2 },
      { epoch: 6, value: 16.8 },
      { epoch: 7, value: 15.1 },
      { epoch: 8, value: 13.9 },
      { epoch: 9, value: 13.2 },
      { epoch: 10, value: 12.8 },
    ],
    // Baisse relative attendue : (45.2 - 12.8) / 45.2 ≈ 71.7%
    expectedDropPercent: 71.7,
    // Questions
    questions: [
      {
        id: "p-01",
        question: "Quelle est la baisse relative de perplexity (en %) ?",
        type: "number",
        expected: 71.7,
        tolerance: 5, // ±5 points
      },
      {
        id: "p-02",
        question: "Cette baisse signifie que le modèle…",
        options: {
          A: "Devient plus lent",
          B: "Devient plus précis sur le domaine OHADA",
          C: "Oublie ses connaissances générales (catastrophic forgetting)",
          D: "Est sur-fitté sur le dataset",
        },
        answer: "B",
      },
      {
        id: "p-03",
        question:
          "Pour déployer ce modèle en production via la stack HID AI (PyTorch, Hugging Face, Docker, FastAPI), quel est le format de livraison final ?",
        options: {
          A: "Fichier .pkl",
          B: "API Dockerisée exposant le modèle quantifié (FastAPI)",
          C: "Script Python autonome",
          D: "Notebook Jupyter",
        },
        answer: "B",
      },
    ],
  },
};
