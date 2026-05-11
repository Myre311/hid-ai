"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { TestLayout } from "@/components/evaluation/TestLayout";
import { TechnicalQuiz } from "@/components/evaluation/TechnicalQuiz";
import { ContextCard } from "@/components/evaluation/ContextCard";
import { DataDriftDashboard } from "@/components/evaluation/DataDriftDashboard";
import { getTestBySlug } from "@/lib/evaluation/tests";
import { MLOPS_DATA } from "@/lib/evaluation/data/mlops-data";

const TEST = getTestBySlug("mlops");

// Ordre initial mélangé — le candidat doit reconstituer l'ordre canonique.
const SHUFFLED = [
  "evaluation",
  "ingestion",
  "deployment",
  "validation",
  "monitoring",
  "training",
  "features",
  "registry",
  "versioning",
];

export default function MlopsPage() {
  const [quiz, setQuiz] = useState({});
  const [order, setOrder] = useState(SHUFFLED);
  const [drift, setDrift] = useState({});

  const setDriftField = (id, val) =>
    setDrift((prev) => ({ ...prev, [id]: val }));

  const move = (idx, dir) => {
    const next = [...order];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= next.length) return;
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    setOrder(next);
  };

  const quizCount = Object.keys(quiz).length;
  const driftCount = Object.keys(drift).filter((k) =>
    String(drift[k] || "").length > 0
  ).length;
  const total = quizCount + 1 + driftCount; // architecture compte comme 1

  const canSubmit =
    quizCount === MLOPS_DATA.quiz.length &&
    driftCount === MLOPS_DATA.drift.questions.length;

  return (
    <TestLayout
      test={TEST}
      canSubmit={canSubmit}
      getAnswers={() => ({
        quiz: Object.entries(quiz).map(([id, choice]) => ({ id, choice })),
        architecture_order: order,
        drift,
      })}
      casesProcessed={total}
      totalCases={MLOPS_DATA.quiz.length + 1 + MLOPS_DATA.drift.questions.length}
    >
      <ContextCard title={MLOPS_DATA.scenario.title}>
        <p>{MLOPS_DATA.scenario.description}</p>
      </ContextCard>

      <div className="flex flex-col gap-10">
        <section>
          <h2 className="t-h3 mb-2">Partie 1 / 3 — Quiz technique</h2>
          <p className="text-sm text-foreground/55 mb-4">
            10 questions sur les outils MLOps et la conduite d&rsquo;un pipeline
            d&rsquo;annotation à 100 personnes.
          </p>
          <TechnicalQuiz
            questions={MLOPS_DATA.quiz}
            value={quiz}
            onChange={setQuiz}
          />
        </section>

        <section>
          <h2 className="t-h3 mb-2">
            Partie 2 / 3 — Architecture du pipeline (9 étapes)
          </h2>
          <p className="text-sm text-foreground/55 mb-4">
            Réordonnez les 9 étapes pour reconstituer un pipeline MLOps canonique
            (utilisez les flèches haut/bas).
          </p>

          <ol className="flex flex-col gap-2">
            {order.map((stepId, idx) => (
              <li
                key={stepId}
                className="flex items-center gap-3 rounded-md border border-white/10 bg-surface px-4 py-3"
              >
                <span className="text-xs font-mono text-foreground/40 w-6">
                  {idx + 1}.
                </span>
                <GripVertical className="h-4 w-4 text-foreground/30" />
                <span className="flex-1 text-sm text-foreground">
                  {MLOPS_DATA.architecture_steps[stepId]}
                </span>
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    aria-label="Monter"
                    className="text-foreground/55 hover:text-foreground disabled:opacity-25"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(idx, 1)}
                    disabled={idx === order.length - 1}
                    aria-label="Descendre"
                    className="text-foreground/55 hover:text-foreground disabled:opacity-25"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="t-h3 mb-2">
            Partie 3 / 3 — Diagnostic Data Drift (production)
          </h2>
          <p className="text-sm text-foreground/55 mb-4">
            7 jours après le déploiement, le dashboard de monitoring affiche les
            statistiques suivantes sur les 5 features. Analysez et répondez.
          </p>

          <DataDriftDashboard features={MLOPS_DATA.drift.features} />

          <div className="flex flex-col gap-5 mt-6">
            {MLOPS_DATA.drift.questions.map((q) => (
              <div
                key={q.id}
                className="rounded-lg border border-white/10 bg-surface p-4 flex flex-col gap-3"
              >
                <p className="text-sm text-foreground">{q.question}</p>
                <div className="flex flex-col gap-2">
                  {Object.entries(q.options).map(([key, label]) => {
                    const checked = drift[q.id] === key;
                    return (
                      <label
                        key={key}
                        className={`flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors border text-sm ${
                          checked
                            ? "border-accent/60 bg-accent/5"
                            : "border-white/10 bg-background hover:border-white/25"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`drift-${q.id}`}
                          value={key}
                          checked={checked}
                          onChange={() => setDriftField(q.id, key)}
                          className="sr-only"
                        />
                        <span
                          className={`h-4 w-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                            checked ? "border-accent" : "border-white/30"
                          }`}
                        >
                          {checked && (
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                          )}
                        </span>
                        <span className="text-foreground/85 leading-relaxed">
                          <strong className="text-foreground mr-1.5">
                            {key}.
                          </strong>
                          {label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </TestLayout>
  );
}
