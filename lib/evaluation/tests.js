/**
 * Source unique des 8 tests d'évaluation HID AI dans l'ordre LINÉAIRE.
 * - test_order : 0 → 7
 * - test_category : "specialist" (tests 0-3) ou "engineer" (tests 4-7)
 *
 * Chaque test a aussi un seuil de validation (par défaut 60/100) pour
 * débloquer le suivant. Le test 0 est `available` à la création de la
 * session, les 7 autres sont `locked`.
 */
export const TESTS = [
  {
    slug: "computer-vision",
    order: 0,
    category: "specialist",
    title: "Détection d'objets (Computer Vision)",
    description: "Annotation de bounding boxes sur 5 images",
    icon: "ScanEye",
    passing_score: 60,
    target_minutes: 25,
  },
  {
    slug: "nlp-sentiment",
    order: 1,
    category: "specialist",
    title: "Analyse de sentiment (NLP)",
    description: "Classification 3 axes sur 15 phrases",
    icon: "MessageSquareText",
    passing_score: 60,
    target_minutes: 25,
  },
  {
    slug: "rlhf",
    order: 2,
    category: "specialist",
    title: "RLHF & Ranking",
    description: "Comparaison de 10 paires de réponses",
    icon: "GitCompare",
    passing_score: 60,
    target_minutes: 25,
  },
  {
    slug: "data-cleaning",
    order: 3,
    category: "specialist",
    title: "Nettoyage de données",
    description: "Correction d'un dataset de 20 lignes",
    icon: "Sparkles",
    passing_score: 60,
    target_minutes: 25,
  },
  {
    slug: "nlp-finetuning",
    order: 4,
    category: "engineer",
    title: "Fine-tuning NLP",
    description: "Quiz + construction JSONL",
    icon: "Brain",
    passing_score: 60,
    target_minutes: 25,
  },
  {
    slug: "vision-edge",
    order: 5,
    category: "engineer",
    title: "Vision Edge Optimization",
    description: "Quiz + calcul d'optimisation",
    icon: "Gauge",
    passing_score: 60,
    target_minutes: 25,
  },
  {
    slug: "mlops",
    order: 6,
    category: "engineer",
    title: "MLOps Pipeline",
    description: "Quiz + architecture builder",
    icon: "Network",
    passing_score: 60,
    target_minutes: 25,
  },
  {
    slug: "rag",
    order: 7,
    category: "engineer",
    title: "RAG System",
    description: "Quiz + hybrid search simulator",
    icon: "Database",
    passing_score: 60,
    target_minutes: 25,
  },
];

export function getTestBySlug(slug) {
  return TESTS.find((t) => t.slug === slug);
}

export function getTestByOrder(order) {
  return TESTS.find((t) => t.order === order);
}

/**
 * Renvoie les lignes initiales test_results à insérer à la création d'une session.
 *
 * - metier === "specialist" → 4 lignes (tests 0-3 specialist uniquement).
 *   Si le candidat atteint une moyenne ≥ 95/100 sur les 4 tests specialist,
 *   les 4 tests engineer (4-7) seront ajoutés à la volée par /api/submit-test.
 *
 * - metier === "engineer" (ou autre) → 8 lignes.
 *
 * Dans tous les cas, le 1er test est `available`, les autres `locked`.
 */
export function buildInitialTestRows(sessionId, metier = "engineer") {
  const subset = metier === "specialist"
    ? TESTS.filter((t) => t.category === "specialist")
    : TESTS;
  return subset.map((t) => ({
    session_id: sessionId,
    test_slug: t.slug,
    test_category: t.category,
    test_order: t.order,
    status: t.order === 0 ? "available" : "locked",
  }));
}

/** Lignes test_results pour les 4 tests engineer (à ajouter après upgrade specialist). */
export function buildEngineerTestRows(sessionId) {
  return TESTS.filter((t) => t.category === "engineer").map((t) => ({
    session_id: sessionId,
    test_slug: t.slug,
    test_category: t.category,
    test_order: t.order,
    status: t.order === 4 ? "available" : "locked",
  }));
}

/** Moyenne (0-100) requise pour qu'un specialist débloque le track engineer. */
export const SPECIALIST_UPGRADE_THRESHOLD = 95;
