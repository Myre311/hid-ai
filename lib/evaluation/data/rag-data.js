/**
 * Test RAG System.
 * - quiz : 10 QCM
 * - hybrid_documents : 10 docs avec scores sémantique + lexical pré-calculés
 * - optimal_hybrid_weight : poids optimal (en %) à donner à la sémantique
 *   pour reconstituer le ranking attendu. Le candidat ajuste un slider 0-100.
 */
export const RAG_DATA = {
  query:
    "Quels sont les avantages de la quantification INT8 pour le déploiement edge ?",
  optimal_hybrid_weight: 70, // 70% sémantique, 30% lexical
  hybrid_documents: [
    { id: "d-01", semantic: 0.92, lexical: 0.4, title: "Quantification post-training INT8 et impact mAP" },
    { id: "d-02", semantic: 0.88, lexical: 0.55, title: "Déploiement edge YOLOv8 : pipeline ONNX → TensorRT" },
    { id: "d-03", semantic: 0.55, lexical: 0.95, title: "INT8 INT8 INT8 INT8 — guide marketing" },
    { id: "d-04", semantic: 0.81, lexical: 0.3, title: "Réduire la VRAM consommée pour de l'inférence mobile" },
    { id: "d-05", semantic: 0.42, lexical: 0.2, title: "Recette de gâteau au chocolat" },
    { id: "d-06", semantic: 0.75, lexical: 0.65, title: "Comparatif FP32 / FP16 / INT8 sur Raspberry Pi 5" },
    { id: "d-07", semantic: 0.6, lexical: 0.5, title: "Histoire de la quantification dans les années 2010" },
    { id: "d-08", semantic: 0.7, lexical: 0.45, title: "ONNX Runtime et calibration INT8" },
    { id: "d-09", semantic: 0.35, lexical: 0.85, title: "Page Wikipédia : edge computing (général)" },
    { id: "d-10", semantic: 0.5, lexical: 0.3, title: "Tutoriel : INT8 sur Coral Dev Board" },
  ],
  quiz: [
    {
      id: "q-01",
      question: "Quel est l'intérêt principal d'une vector database (Pinecone, Qdrant, Chroma) ?",
      options: {
        A: "Indexer et chercher des embeddings par similarité (cosine, dot-product) à grande échelle.",
        B: "Compiler du code Rust.",
        C: "Faire des sauvegardes ZIP.",
        D: "Stocker des images binaires uniquement.",
      },
      answer: "A",
    },
    {
      id: "q-02",
      question: "Quelle est la différence entre une recherche sémantique et une recherche lexicale ?",
      options: {
        A: "Sémantique = compréhension de sens via embeddings ; lexicale = matching de mots-clés (BM25, TF-IDF).",
        B: "C'est exactement la même chose.",
        C: "Lexicale est plus récente et plus performante.",
        D: "Sémantique ne marche que pour l'anglais.",
      },
      answer: "A",
    },
    {
      id: "q-03",
      question: "À quoi sert le Hybrid Search ?",
      options: {
        A: "Combiner recherche sémantique et lexicale pour des résultats plus robustes (notamment sur noms propres / sigles).",
        B: "Utiliser deux serveurs simultanément.",
        C: "Mixer SQL et NoSQL.",
        D: "Aucune utilité réelle.",
      },
      answer: "A",
    },
    {
      id: "q-04",
      question: "Comment réduire les hallucinations dans un RAG ?",
      options: {
        A: "Grounding strict, citations obligatoires, validation Ragas, reranker.",
        B: "Augmenter la température.",
        C: "Ne plus passer de contexte.",
        D: "Compresser les embeddings en INT4.",
      },
      answer: "A",
    },
    {
      id: "q-05",
      question: "Quelle taille de chunk est généralement recommandée ?",
      options: {
        A: "200-500 tokens, avec recouvrement de 10-20%.",
        B: "10 tokens maximum.",
        C: "Pas de chunking, on passe tout le document.",
        D: "100 000 tokens.",
      },
      answer: "A",
    },
    {
      id: "q-06",
      question: "Ragas est un framework pour :",
      options: {
        A: "Évaluer la qualité d'un système RAG (faithfulness, answer relevancy, context precision).",
        B: "Compresser les embeddings.",
        C: "Faire du fine-tuning LoRA.",
        D: "Gérer le déploiement.",
      },
      answer: "A",
    },
    {
      id: "q-07",
      question: "Quel embedding est généralement plus performant pour des textes en français ?",
      options: {
        A: "Un modèle multilingue (text-embedding-3, bge-multilingual, mistral-embed).",
        B: "Un embedding entraîné uniquement sur du code Python.",
        C: "Aucun embedding ne marche en français.",
        D: "Il faut traduire en latin d'abord.",
      },
      answer: "A",
    },
    {
      id: "q-08",
      question: "Reranker, à quoi ça sert ?",
      options: {
        A: "Re-trier les top-N résultats récupérés par la recherche initiale avec un modèle cross-encoder plus précis (mais plus lent).",
        B: "Renommer les fichiers.",
        C: "Encoder en base64.",
        D: "Trier par ordre alphabétique.",
      },
      answer: "A",
    },
    {
      id: "q-09",
      question: "Pourquoi un fallback BM25 reste utile avec des embeddings modernes ?",
      options: {
        A: "Les embeddings échouent sur les sigles, noms propres rares, identifiants ; BM25 reste imbattable sur le matching exact.",
        B: "BM25 est plus récent et plus rapide.",
        C: "BM25 fait du fine-tuning automatique.",
        D: "Il n'a aucune utilité.",
      },
      answer: "A",
    },
    {
      id: "q-10",
      question: "Quelle métrique Ragas mesure « la réponse est-elle ancrée dans le contexte récupéré » ?",
      options: {
        A: "Faithfulness",
        B: "Answer Relevancy",
        C: "Context Precision",
        D: "Throughput",
      },
      answer: "A",
    },
  ],
};
