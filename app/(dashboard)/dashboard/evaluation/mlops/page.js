"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { TestLayout } from "@/components/evaluation/TestLayout";
import { TechnicalQuiz } from "@/components/evaluation/TechnicalQuiz";
import { getTestBySlug } from "@/lib/evaluation/tests";
import { MLOPS_DATA } from "@/lib/evaluation/data/mlops-data";

const TEST = getTestBySlug("mlops");

// Ordre initial mélangé — le candidat doit reconstituer l'ordre canonique.
const SHUFFLED = [
  "evaluation",
  "ingestion",
  "deployment",
  "validation",
  "training",
  "features",
  "registry",
  "versioning",
];

export default function MlopsPage() {
  const [quiz, setQuiz] = useState({});
  const [order, setOrder] = useState(SHUFFLED);

  const move = (idx, dir) => {
    const next = [...order];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= next.length) return;
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    setOrder(next);
  };

  const quizCount = Object.keys(quiz).length;
  const total = quizCount + 1; // l'architecture compte comme 1 cas (toujours présente)

  const canSubmit = quizCount === MLOPS_DATA.quiz.length;

  return (
    <TestLayout
      test={TEST}
      canSubmit={canSubmit}
      getAnswers={() => ({
        quiz: Object.entries(quiz).map(([id, choice]) => ({ id, choice })),
        architecture_order: order,
      })}
      casesProcessed={total}
      totalCases={MLOPS_DATA.quiz.length + 1}
    >
      <div className="flex flex-col gap-8">
        <section>
          <h2 className="t-h3 mb-2">Partie 1 — Quiz technique</h2>
          <p className="text-sm text-foreground/55 mb-4">
            10 questions sur les outils MLOps (DVC, MLflow, monitoring, Great Expectations).
          </p>
          <TechnicalQuiz
            questions={MLOPS_DATA.quiz}
            value={quiz}
            onChange={setQuiz}
          />
        </section>

        <section>
          <h2 className="t-h3 mb-2">Partie 2 — Architecture du pipeline MLOps</h2>
          <p className="text-sm text-foreground/55 mb-4">
            Réordonnez les 8 étapes pour reconstituer un pipeline MLOps canonique
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
      </div>
    </TestLayout>
  );
}
