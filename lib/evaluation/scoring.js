/**
 * Logique de scoring par test.
 * Chaque fonction reçoit `rawAnswers` (JSON envoyé par le client) et
 * retourne { score, precision_rate, cases_processed }.
 *
 * Pour la V1, les algos restent simples mais déterministes. Les ground
 * truths vivent dans /lib/evaluation/data/*.
 */

import {
  CV_GROUND_TRUTH as DEFAULT_CV_GROUND_TRUTH,
  CV_POLYGON_TARGET as DEFAULT_CV_POLYGON_TARGET,
  CV_TRACKING_GROUND_TRUTH as DEFAULT_CV_TRACKING,
  getCvSceneSetForSession,
  getCvTrackingSetForSession,
} from "./data/cv-ground-truth";
import { NLP_SENTIMENT_DATA, NER_DATA } from "./data/nlp-sentiment-data";
import { RLHF_DATA } from "./data/rlhf-data";
import { DATA_CLEANING_DATA } from "./data/data-cleaning-data";
import { NLP_FINETUNING_DATA } from "./data/nlp-finetuning-data";
import { VISION_EDGE_DATA } from "./data/vision-edge-data";
import { MLOPS_DATA } from "./data/mlops-data";
import { RAG_DATA } from "./data/rag-data";

// --- Helpers -----------------------------------------------------------------

function clampScore(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Cap maximum atteignable. 100/100 est volontairement IMPOSSIBLE :
 * - récompense la performance sans valider de "score parfait"
 * - laisse une marge pour la marge d'incertitude des annotations
 */
export const MAX_REACHABLE_SCORE = 96;

/**
 * Calcule un facteur multiplicatif basé sur le temps passé vs cible :
 *   ≤ 50% du temps cible →  1.00 (rapide & efficace)
 *   = 100% du temps cible →  0.95 (correct)
 *   = 150% du temps cible →  0.85 (lent)
 *   > 150% du temps cible →  0.85 (floor — pas de pénalité au-delà)
 *
 * `targetMinutes` provient de TESTS[].target_minutes.
 */
export function timeFactor(timeSpentSeconds, targetMinutes) {
  const seconds = Math.max(0, Number(timeSpentSeconds) || 0);
  const target = Math.max(60, (Number(targetMinutes) || 25) * 60);
  const ratio = seconds / target;

  if (ratio <= 0.5) return 1.0;
  if (ratio <= 1.0) {
    // 0.5 → 1.0, lerp 1.00 → 0.95
    return 1.0 - (ratio - 0.5) * 0.1;
  }
  if (ratio <= 1.5) {
    // 1.0 → 1.5, lerp 0.95 → 0.85
    return 0.95 - (ratio - 1.0) * 0.2;
  }
  return 0.85;
}

/**
 * Applique la politique de scoring HID AI à un score brut :
 *  1. Multiplie par le facteur temps
 *  2. Cape à MAX_REACHABLE_SCORE (96)
 *  3. Arrondit et clamp entre 0 et 100
 *
 * Retourne le score final pour stockage.
 */
export function applyScoringPolicy(rawScore, timeSpentSeconds, targetMinutes) {
  const factor = timeFactor(timeSpentSeconds, targetMinutes);
  const adjusted = (Number(rawScore) || 0) * factor;
  return Math.max(0, Math.min(MAX_REACHABLE_SCORE, Math.round(adjusted)));
}

function iouBox(a, b) {
  // a, b = { x, y, w, h }
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const union = a.w * a.h + b.w * b.h - inter;
  return union > 0 ? inter / union : 0;
}

// --- Test 1 : Computer Vision -----------------------------------------------

export function scoreComputerVision(rawAnswers, { sessionId } = {}) {
  const userBoxes = rawAnswers?.boxes || {};
  const polygon = rawAnswers?.polygon || [];
  const userTracking = rawAnswers?.tracking || {};

  // Récupère les scènes correspondant à la session (déterministe sur sessionId).
  // Sans sessionId : fallback aux variantes par défaut (legacy).
  const sceneSet = sessionId
    ? getCvSceneSetForSession(sessionId)
    : { ground_truth: DEFAULT_CV_GROUND_TRUTH, polygon_target: DEFAULT_CV_POLYGON_TARGET };
  const CV_GROUND_TRUTH = sceneSet.ground_truth;
  const CV_POLYGON_TARGET = sceneSet.polygon_target;
  const CV_TRACKING_GROUND_TRUTH = sessionId
    ? getCvTrackingSetForSession(sessionId)
    : DEFAULT_CV_TRACKING;

  // IoU bounding boxes (35 points)
  // Courbe douce : un IoU de 0.7 (box correctement dessinée à la souris)
  // vaut déjà le crédit plein. Inutile d'atteindre 1.0, irréaliste à la main.
  let totalIou = 0;
  let imageCount = 0;
  CV_GROUND_TRUTH.forEach((img) => {
    const truth = img.boxes;
    const user = userBoxes[img.id] || [];
    if (truth.length === 0) return;
    imageCount++;
    let creditSum = 0;
    truth.forEach((tBox) => {
      const bestIou = user.reduce((max, uBox) => {
        const iou = iouBox(tBox, uBox);
        return Math.max(max, iou);
      }, 0);
      creditSum += Math.min(1, bestIou / 0.7);
    });
    totalIou += creditSum / truth.length;
  });
  const iouRatio = imageCount > 0 ? totalIou / imageCount : 0;
  const iouPts = iouRatio * 35;

  // Attributs (15 points) — ratio de boxes avec l'attribut attendu
  let attrCorrect = 0;
  let attrTotal = 0;
  CV_GROUND_TRUTH.forEach((img) => {
    const user = userBoxes[img.id] || [];
    user.forEach((b) => {
      attrTotal++;
      if (b && b.attr === img.expectedAttribute) attrCorrect++;
    });
  });
  const attrRatio = attrTotal > 0 ? attrCorrect / attrTotal : 0;
  const attrPts = attrRatio * 15;

  // Polygone (15 points) — qualité du tracé de la silhouette.
  // L'ancien barème notait la couverture des quadrants de L'IMAGE, ce qui
  // était mathématiquement ingagnable pour un objet hors-centre. Nouveau
  // barème : forme fermée valide + densité de points + aire réaliste.
  let polyPts = 0;
  if (Array.isArray(polygon) && polygon.length >= CV_POLYGON_TARGET.minPoints) {
    polyPts += 5; // tracé fermé avec le minimum de points
    if (polygon.length >= 12) polyPts += 5; // densité suffisante pour épouser la silhouette
    // Aire (shoelace) en fraction de l'image normalisée 1×1.
    let area2 = 0;
    for (let i = 0; i < polygon.length; i++) {
      const p = polygon[i];
      const q = polygon[(i + 1) % polygon.length];
      area2 += p.x * q.y - q.x * p.y;
    }
    const area = Math.abs(area2) / 2;
    // Une vraie silhouette occupe entre ~1.5 % et ~80 % de l'image :
    // ni un point dégénéré, ni le cadre entier.
    if (area >= 0.015 && area <= 0.8) polyPts += 5;
  }

  // Object tracking (35 points) — 50 frames à suivre.
  // 0.7 pt par frame avec objectId correct et IoU >= 0.4.
  // 50 frames bien suivies = 35 pts (plus aucune dépendance aux occlusions,
  // qui n'existent plus dans les vraies vidéos).
  let trackingRaw = 0;
  const { targetObjectId, frames: gtFrames } = CV_TRACKING_GROUND_TRUTH;
  gtFrames.forEach((gtFrame, i) => {
    const userAnn = userTracking[i];
    if (!userAnn) return;
    const iouScore = iouBox(userAnn.bbox, gtFrame.expectedBbox);
    if (userAnn.objectId === targetObjectId && iouScore >= 0.4) {
      trackingRaw += 0.7;
    }
  });
  const trackingPts = Math.min(35, trackingRaw);

  const total = iouPts + attrPts + polyPts + trackingPts;
  return {
    score: clampScore(total),
    precision_rate: Number((total / 100).toFixed(4)),
    cases_processed:
      imageCount +
      (polygon.length > 0 ? 1 : 0) +
      (Object.keys(userTracking).length > 0 ? 1 : 0),
  };
}

// --- Test 2 : NLP Sentiment --------------------------------------------------

export function scoreNlpSentiment(rawAnswers) {
  const answers = rawAnswers?.answers || []; // [{ id, sentiment, urgence, categorie }, ...]
  const nerAnswers = rawAnswers?.ner || {}; // { "n-01-a": "PER", ... }

  // Partie 1 — sentiment (70 points)
  let sentCorrect = 0;
  let sentTotal = 0;
  NLP_SENTIMENT_DATA.forEach((q) => {
    const a = answers.find((x) => x.id === q.id) || {};
    if (a.sentiment === q.sentiment) sentCorrect++;
    if (a.urgence === q.urgence) sentCorrect++;
    if (a.categorie === q.categorie) sentCorrect++;
    sentTotal += 3;
  });
  const sentRatio = sentTotal > 0 ? sentCorrect / sentTotal : 0;
  const sentPts = sentRatio * 70;

  // Partie 2 — NER (30 points)
  let nerCorrect = 0;
  let nerTotal = 0;
  NER_DATA.forEach((s) => {
    s.spans.forEach((span) => {
      nerTotal++;
      if (nerAnswers[span.id] === span.type) nerCorrect++;
    });
  });
  const nerRatio = nerTotal > 0 ? nerCorrect / nerTotal : 0;
  const nerPts = nerRatio * 30;

  const total = sentPts + nerPts;
  return {
    score: clampScore(total),
    precision_rate: Number((total / 100).toFixed(4)),
    cases_processed: NLP_SENTIMENT_DATA.length + NER_DATA.length,
  };
}

// --- Test 3 : RLHF -----------------------------------------------------------

export function scoreRlhf(rawAnswers) {
  const answers = rawAnswers?.answers || []; // [{ id, choice: 'A'|'B'|'tie', justification }]
  let pts = 0;
  const maxPerQ = 10;
  RLHF_DATA.forEach((q) => {
    const a = answers.find((x) => x.id === q.id);
    if (!a) return;
    if (a.choice === q.expected) pts += 7;
    if (typeof a.justification === "string" && a.justification.trim().length >= 50)
      pts += 3;
  });
  const maxTotal = RLHF_DATA.length * maxPerQ;
  const ratio = maxTotal > 0 ? pts / maxTotal : 0;
  return {
    score: clampScore(ratio * 100),
    precision_rate: Number(ratio.toFixed(4)),
    cases_processed: RLHF_DATA.length,
  };
}

// --- Test 4 : Data Cleaning -------------------------------------------------

export function scoreDataCleaning(rawAnswers) {
  const rows = rawAnswers?.rows || {}; // { rowId: { date, email, name, marked_duplicate, marked_invalid_email } }
  let correct = 0;
  let total = 0;
  DATA_CLEANING_DATA.dirty.forEach((row, i) => {
    const clean = DATA_CLEANING_DATA.clean[i];
    const user = rows[row.id] || {};
    // Date
    if ((user.date || "").trim() === clean.date) correct++;
    total++;
    // Email validation flag
    const expectedInvalid = clean.email_invalid === true;
    if (!!user.marked_invalid_email === expectedInvalid) correct++;
    total++;
    // Duplicate flag
    const expectedDup = clean.duplicate === true;
    if (!!user.marked_duplicate === expectedDup) correct++;
    total++;
    // Name (forgiving: case-insensitive trim)
    if ((user.name || "").trim().toLowerCase() === clean.name.toLowerCase())
      correct++;
    total++;
  });
  const ratio = total > 0 ? correct / total : 0;
  return {
    score: clampScore(ratio * 100),
    precision_rate: Number(ratio.toFixed(4)),
    cases_processed: DATA_CLEANING_DATA.dirty.length,
  };
}

// --- Test 5 : NLP Fine-tuning -----------------------------------------------

export function scoreNlpFinetuning(rawAnswers) {
  const quizAnswers = rawAnswers?.quiz || []; // [{ id, choice }]
  const jsonl = rawAnswers?.jsonl || []; // 5 strings
  const perplexityAnswers = rawAnswers?.perplexity || {}; // { "p-01": "71.7", "p-02": "B", "p-03": "B" }

  // Quiz: 50 points (5 points par bonne réponse × 10 questions)
  let quizPts = 0;
  NLP_FINETUNING_DATA.quiz.forEach((q) => {
    const a = quizAnswers.find((x) => x.id === q.id);
    if (a && a.choice === q.answer) quizPts += 5;
  });

  // JSONL: 30 points (6 par paire correctement formatée × 5)
  let jsonlPts = 0;
  jsonl.slice(0, 5).forEach((line) => {
    try {
      const obj = JSON.parse(line);
      if (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.instruction === "string" &&
        typeof obj.input === "string" &&
        typeof obj.output === "string" &&
        obj.instruction.trim().length > 0 &&
        obj.output.trim().length > 0
      ) {
        jsonlPts += 6;
      }
    } catch {}
  });

  // Partie 3 — Perplexity (20 points)
  let perplexityPts = 0;
  NLP_FINETUNING_DATA.perplexity.questions.forEach((q) => {
    const userAnswer = perplexityAnswers[q.id];
    if (q.type === "number") {
      const num = Number(userAnswer);
      if (!Number.isNaN(num) && Math.abs(num - q.expected) <= (q.tolerance ?? 5)) {
        perplexityPts += 8;
      }
    } else if (userAnswer === q.answer) {
      perplexityPts += 6;
    }
  });

  const total = quizPts + jsonlPts + perplexityPts; // sur 100
  return {
    score: clampScore(total),
    precision_rate: Number((total / 100).toFixed(4)),
    cases_processed:
      NLP_FINETUNING_DATA.quiz.length + 5 + NLP_FINETUNING_DATA.perplexity.questions.length,
  };
}

// --- Test 6 : Vision Edge ---------------------------------------------------

export function scoreVisionEdge(rawAnswers) {
  const quizAnswers = rawAnswers?.quiz || [];
  const sizeUserMb = Number(rawAnswers?.calc?.size_mb);
  const fpsUser = Number(rawAnswers?.calc?.fps);
  const justification = rawAnswers?.calc?.justification || "";

  // Quiz: 50 points (5 par bonne réponse)
  let quizPts = 0;
  VISION_EDGE_DATA.quiz.forEach((q) => {
    const a = quizAnswers.find((x) => x.id === q.id);
    if (a && a.choice === q.answer) quizPts += 5;
  });

  // Calculs: 30 points (15 pour la taille, 15 pour le FPS, tolérance ±15%)
  let calcPts = 0;
  const sizeOk =
    !Number.isNaN(sizeUserMb) &&
    Math.abs(sizeUserMb - VISION_EDGE_DATA.expected_size_mb) /
      VISION_EDGE_DATA.expected_size_mb <=
      0.15;
  if (sizeOk) calcPts += 15;
  const fpsOk =
    !Number.isNaN(fpsUser) &&
    Math.abs(fpsUser - VISION_EDGE_DATA.expected_fps) /
      VISION_EDGE_DATA.expected_fps <=
      0.15;
  if (fpsOk) calcPts += 15;

  // Justification: 20 points si ≥ 100 caractères
  const justifPts = justification.trim().length >= 100 ? 20 : 0;

  const total = quizPts + calcPts + justifPts;
  return {
    score: clampScore(total),
    precision_rate: Number((total / 100).toFixed(4)),
    cases_processed: VISION_EDGE_DATA.quiz.length + 1,
  };
}

// --- Test 7 : MLOps ---------------------------------------------------------

export function scoreMlops(rawAnswers) {
  const quizAnswers = rawAnswers?.quiz || [];
  const archOrder = rawAnswers?.architecture_order || []; // array of step ids in user order
  const driftAnswers = rawAnswers?.drift || {}; // { "d-01": "B", "d-02": "B" }

  // Quiz: 50 points (5 × 10)
  let quizPts = 0;
  MLOPS_DATA.quiz.forEach((q) => {
    const a = quizAnswers.find((x) => x.id === q.id);
    if (a && a.choice === q.answer) quizPts += 5;
  });

  // Architecture: 30 points — 9 étapes, ~3.33 pts chacune
  const expectedOrder = MLOPS_DATA.architecture_order;
  let archPts = 0;
  const archStepValue = 30 / expectedOrder.length;
  archOrder.forEach((stepId, idx) => {
    if (expectedOrder[idx] === stepId) archPts += archStepValue;
  });

  // Drift: 20 points — 2 questions × 10
  let driftPts = 0;
  MLOPS_DATA.drift.questions.forEach((q) => {
    if (driftAnswers[q.id] === q.answer) driftPts += 10;
  });

  const total = quizPts + archPts + driftPts;
  return {
    score: clampScore(total),
    precision_rate: Number((total / 100).toFixed(4)),
    cases_processed:
      MLOPS_DATA.quiz.length + 1 + MLOPS_DATA.drift.questions.length,
  };
}

// --- Test 8 : RAG -----------------------------------------------------------

export function scoreRag(rawAnswers) {
  const quizAnswers = rawAnswers?.quiz || [];
  const hybridWeight = Number(rawAnswers?.hybrid_weight); // 0-100 (% sémantique)

  // Quiz: 60 points (6 par bonne réponse, 10 questions)
  let quizPts = 0;
  RAG_DATA.quiz.forEach((q) => {
    const a = quizAnswers.find((x) => x.id === q.id);
    if (a && a.choice === q.answer) quizPts += 6;
  });

  // Hybrid search: 40 points, proximité du poids optimal (tolérance large)
  let hybridPts = 0;
  if (!Number.isNaN(hybridWeight)) {
    const delta = Math.abs(hybridWeight - RAG_DATA.optimal_hybrid_weight);
    if (delta <= 5) hybridPts = 40;
    else if (delta <= 10) hybridPts = 30;
    else if (delta <= 20) hybridPts = 20;
    else if (delta <= 35) hybridPts = 10;
  }

  const total = quizPts + hybridPts;
  return {
    score: clampScore(total),
    precision_rate: Number((total / 100).toFixed(4)),
    cases_processed: RAG_DATA.quiz.length + 1,
  };
}

// --- Dispatch ---------------------------------------------------------------

export const SCORERS = {
  "computer-vision": scoreComputerVision,
  "nlp-sentiment": scoreNlpSentiment,
  rlhf: scoreRlhf,
  "data-cleaning": scoreDataCleaning,
  "nlp-finetuning": scoreNlpFinetuning,
  "vision-edge": scoreVisionEdge,
  mlops: scoreMlops,
  rag: scoreRag,
};

export function scoreTest(testSlug, rawAnswers, ctx = {}) {
  const fn = SCORERS[testSlug];
  if (!fn) throw new Error(`Unknown test slug: ${testSlug}`);
  return fn(rawAnswers, ctx);
}
