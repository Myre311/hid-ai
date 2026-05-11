/**
 * Logique de scoring par test.
 * Chaque fonction reçoit `rawAnswers` (JSON envoyé par le client) et
 * retourne { score, precision_rate, cases_processed }.
 *
 * Pour la V1, les algos restent simples mais déterministes. Les ground
 * truths vivent dans /lib/evaluation/data/*.
 */

import { CV_GROUND_TRUTH } from "./data/cv-ground-truth";
import { NLP_SENTIMENT_DATA } from "./data/nlp-sentiment-data";
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

export function scoreComputerVision(rawAnswers) {
  const userBoxes = rawAnswers?.boxes || {}; // { imageId: [{x,y,w,h}, ...] }
  let totalIou = 0;
  let imageCount = 0;
  CV_GROUND_TRUTH.forEach((img) => {
    const truth = img.boxes;
    const user = userBoxes[img.id] || [];
    if (truth.length === 0) return;
    imageCount++;
    let bestIouSum = 0;
    truth.forEach((tBox) => {
      const best = user.reduce((max, uBox) => {
        const iou = iouBox(tBox, uBox);
        return Math.max(max, iou);
      }, 0);
      bestIouSum += best;
    });
    totalIou += bestIouSum / truth.length;
  });
  const precision = imageCount > 0 ? totalIou / imageCount : 0;
  return {
    score: clampScore(precision * 100),
    precision_rate: Number(precision.toFixed(4)),
    cases_processed: imageCount,
  };
}

// --- Test 2 : NLP Sentiment --------------------------------------------------

export function scoreNlpSentiment(rawAnswers) {
  const answers = rawAnswers?.answers || []; // [{ id, sentiment, urgence, categorie }, ...]
  let correct = 0;
  let total = 0;
  NLP_SENTIMENT_DATA.forEach((q) => {
    const a = answers.find((x) => x.id === q.id) || {};
    if (a.sentiment === q.sentiment) correct++;
    if (a.urgence === q.urgence) correct++;
    if (a.categorie === q.categorie) correct++;
    total += 3;
  });
  const ratio = total > 0 ? correct / total : 0;
  return {
    score: clampScore(ratio * 100),
    precision_rate: Number(ratio.toFixed(4)),
    cases_processed: NLP_SENTIMENT_DATA.length,
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
  const jsonl = rawAnswers?.jsonl || []; // 5 strings (JSON lines)

  // Quiz: 5 points par bonne réponse
  let quizPts = 0;
  NLP_FINETUNING_DATA.quiz.forEach((q) => {
    const a = quizAnswers.find((x) => x.id === q.id);
    if (a && a.choice === q.answer) quizPts += 5;
  });

  // JSONL: 10 points par paire correctement formatée (JSON parseable + clés instruction/input/output)
  let jsonlPts = 0;
  jsonl.slice(0, 5).forEach((line) => {
    try {
      const obj = JSON.parse(line);
      if (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.instruction === "string" &&
        typeof obj.input === "string" &&
        typeof obj.output === "string"
      ) {
        jsonlPts += 10;
      }
    } catch {}
  });

  const total = quizPts + jsonlPts; // sur 100
  return {
    score: clampScore(total),
    precision_rate: Number((total / 100).toFixed(4)),
    cases_processed: NLP_FINETUNING_DATA.quiz.length + 5,
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

  // Quiz: 50 points
  let quizPts = 0;
  MLOPS_DATA.quiz.forEach((q) => {
    const a = quizAnswers.find((x) => x.id === q.id);
    if (a && a.choice === q.answer) quizPts += 5;
  });

  // Architecture: 50 points, 6.25 par étape correcte
  const expectedOrder = MLOPS_DATA.architecture_order;
  let archPts = 0;
  archOrder.forEach((stepId, idx) => {
    if (expectedOrder[idx] === stepId) archPts += 6.25;
  });

  const total = quizPts + archPts;
  return {
    score: clampScore(total),
    precision_rate: Number((total / 100).toFixed(4)),
    cases_processed: MLOPS_DATA.quiz.length + 1,
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

export function scoreTest(testSlug, rawAnswers) {
  const fn = SCORERS[testSlug];
  if (!fn) throw new Error(`Unknown test slug: ${testSlug}`);
  return fn(rawAnswers);
}
