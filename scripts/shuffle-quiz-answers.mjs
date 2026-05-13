/**
 * Rebalance la position des bonnes réponses dans les quiz MCQ.
 *
 * Pourquoi : les fichiers data avaient un biais énorme (mlops 8A/4B,
 * vision-edge 8A/2B, rag 9A/1C, nlp-finetuning 9B/2A/1C). Un candidat
 * pouvait griller un test en cliquant toujours la même lettre.
 *
 * Stratégie : pour chaque fichier, on distribue les bonnes réponses ~ uniformément
 * sur A/B/C/D (selon le nombre d'options). On préserve le sens des questions :
 * on échange le contenu des options pour que la bonne réponse arrive à la
 * lettre cible. Aucun changement du contenu pédagogique.
 *
 * Déterministe (seed = "hidai-2026") — re-exécuter produit toujours la même
 * distribution, ce qui permet aux tests E2E de rester stables.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, "..", "lib", "evaluation", "data");

// PRNG déterministe (mulberry32) — seed pour reproductibilité
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(0x4144); // "HiDA" → 0x4144 (les autres bytes sont 0)

/** Shuffle une liste avec Fisher-Yates seedé. */
function shuffled(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Génère une séquence balancée de N lettres sur K options (ABCD shuffled). */
function balancedSequence(n, letters) {
  const k = letters.length;
  // Distribution uniforme avec reste réparti
  const base = Math.floor(n / k);
  const rem = n % k;
  const pool = [];
  for (let i = 0; i < k; i++) {
    const count = base + (i < rem ? 1 : 0);
    for (let j = 0; j < count; j++) pool.push(letters[i]);
  }
  return shuffled(pool);
}

/**
 * Re-mappe une question pour que la bonne réponse soit à la lettre `targetLetter`.
 * On swap le contenu de l'option originale `answer` avec l'option à `targetLetter`.
 */
function remapQuestion(q, targetLetter) {
  if (!q || !q.options || !q.answer) return q;
  const currentLetter = q.answer;
  if (currentLetter === targetLetter) return q;
  const newOptions = { ...q.options };
  const tmp = newOptions[targetLetter];
  newOptions[targetLetter] = newOptions[currentLetter];
  newOptions[currentLetter] = tmp;
  return { ...q, options: newOptions, answer: targetLetter };
}

/**
 * Une "patch" pour un module : modifie en place le tableau de questions
 * exporté pour avoir une distribution équilibrée des bonnes réponses.
 */
function rebalance(questions, name) {
  if (!Array.isArray(questions) || questions.length === 0) return questions;
  const first = questions[0];
  if (!first.options || !first.answer) return questions;
  const letters = Object.keys(first.options).sort(); // ['A','B','C','D']
  const targets = balancedSequence(questions.length, letters);
  const before = countAnswers(questions);
  const remapped = questions.map((q, i) => remapQuestion(q, targets[i]));
  const after = countAnswers(remapped);
  console.log(`  ${name}: ${stringify(before)} → ${stringify(after)}`);
  return remapped;
}

function countAnswers(qs) {
  const c = { A: 0, B: 0, C: 0, D: 0 };
  qs.forEach((q) => {
    if (q.answer && c[q.answer] !== undefined) c[q.answer]++;
  });
  return c;
}
function stringify(c) {
  return Object.entries(c).filter(([, v]) => v > 0).map(([k, v]) => `${k}=${v}`).join(", ");
}

// ─── Lecture / écriture des fichiers data ───────────────────────────────
// Plutôt que d'éditer le source JS (qui contient du code, pas que des données),
// on remplace IN-PLACE seulement les `answer: "X"` selon le mapping calculé.
// Pour ça on lit le fichier, on extrait les questions via une eval contrôlée,
// puis on regénère ces parties.

async function processFile(name, exportName, fieldPath = null) {
  const file = resolve(DATA_DIR, `${name}.js`);
  const original = readFileSync(file, "utf8");

  // Import dynamique du module pour récupérer les questions
  const modPath = `file://${file}`;
  const mod = await import(modPath);
  const root = mod[exportName];
  if (!root) {
    console.warn(`  ! ${name}: export ${exportName} introuvable, skip`);
    return;
  }
  const questions = fieldPath ? root[fieldPath] : root;
  const rebalanced = rebalance(questions, fieldPath || name);

  // On va re-écrire le fichier : pour chaque question (par id), on remplace
  // le bloc `id: "<id>",\n      question: "..."\n      options: {...}\n      answer: "X"`
  // par la version remappée. Approche : on travaille par regex sur les blocs.
  let next = original;
  rebalanced.forEach((q) => {
    // Construit un remplacement pour les options + answer de cette question
    const optionsBlock = renderOptions(q.options, original);
    const newAnswer = `answer: "${q.answer}"`;

    // Match le bloc complet de cette question (entre son id et answer)
    const idEsc = q.id.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const blockRe = new RegExp(
      `(id:\\s*"${idEsc}"[\\s\\S]*?options:\\s*\\{[\\s\\S]*?\\})([\\s\\S]*?)(answer:\\s*"[A-D]")`,
      "m"
    );
    next = next.replace(blockRe, (match, idAndOpts, between, oldAnswer) => {
      const newOpts = match.replace(
        /options:\s*\{[\s\S]*?\}/,
        optionsBlock
      );
      // Reconstruit en gardant l'indentation
      return newOpts.replace(/answer:\s*"[A-D]"/, newAnswer);
    });
  });

  if (next !== original) {
    writeFileSync(file, next, "utf8");
    console.log(`  ✓ ${name}.js mis à jour`);
  } else {
    console.log(`  · ${name}.js inchangé`);
  }
}

/** Re-render un bloc `options: { A: "...", B: "...", ... }` en single-line
 * si le bloc original était single-line, sinon en multi-line indenté. */
function renderOptions(options, original) {
  const entries = Object.entries(options);
  const inline = entries.map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ");
  // Single-line si court (< 200 chars) — sinon multi-line
  if (inline.length < 200) {
    return `options: { ${inline} }`;
  }
  return `options: {\n        ${entries.map(([k, v]) => `${k}: ${JSON.stringify(v)},`).join("\n        ")}\n      }`;
}

// ─── Main ───────────────────────────────────────────────────────────────
console.log("🎲 Rebalance des bonnes réponses (seed=0x4144)\n");
await processFile("nlp-finetuning-data", "NLP_FINETUNING_DATA", "quiz");
await processFile("vision-edge-data", "VISION_EDGE_DATA", "quiz");
await processFile("mlops-data", "MLOPS_DATA", "quiz");
await processFile("rag-data", "RAG_DATA", "quiz");
console.log("\n✅ Terminé. Vérifie via :\n   grep -oE 'answer: \"[A-D]\"' lib/evaluation/data/*.js | sort | uniq -c");
