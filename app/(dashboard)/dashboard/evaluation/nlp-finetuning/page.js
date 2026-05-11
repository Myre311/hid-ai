"use client";

import { useMemo, useState } from "react";
import { TestLayout } from "@/components/evaluation/TestLayout";
import { TechnicalQuiz } from "@/components/evaluation/TechnicalQuiz";
import { getTestBySlug } from "@/lib/evaluation/tests";
import { NLP_FINETUNING_DATA } from "@/lib/evaluation/data/nlp-finetuning-data";

const TEST = getTestBySlug("nlp-finetuning");

export default function NlpFinetuningPage() {
  const [quiz, setQuiz] = useState({});
  const [jsonl, setJsonl] = useState(Array(5).fill(""));

  const quizCount = Object.keys(quiz).length;
  const jsonlCount = jsonl.filter((l) => l.trim().length > 5).length;
  const totalCount = quizCount + jsonlCount;

  const canSubmit = quizCount === NLP_FINETUNING_DATA.quiz.length && jsonlCount >= 3;

  return (
    <TestLayout
      test={TEST}
      canSubmit={canSubmit}
      getAnswers={() => ({
        quiz: Object.entries(quiz).map(([id, choice]) => ({ id, choice })),
        jsonl,
      })}
      casesProcessed={totalCount}
      totalCases={NLP_FINETUNING_DATA.quiz.length + 5}
    >
      <div className="flex flex-col gap-8">
        <section>
          <h2 className="t-h3 mb-2">Partie 1 — Quiz technique</h2>
          <p className="text-sm text-foreground/55 mb-4">
            10 questions sur le fine-tuning, formats de données et hyperparamètres.
          </p>
          <TechnicalQuiz
            questions={NLP_FINETUNING_DATA.quiz}
            value={quiz}
            onChange={setQuiz}
          />
        </section>

        <section>
          <h2 className="t-h3 mb-2">Partie 2 — Construction JSONL</h2>
          <p className="text-sm text-foreground/55 mb-4">
            Convertissez chaque paire Q&amp;A ci-dessous au format JSON d&rsquo;instruction
            sur une seule ligne :{" "}
            <code className="text-xs bg-surface px-1.5 py-0.5 rounded">
              {`{"instruction":"…","input":"…","output":"…"}`}
            </code>
          </p>
          <div className="flex flex-col gap-4">
            {NLP_FINETUNING_DATA.qa_pairs.map((qa, i) => (
              <div
                key={i}
                className="rounded-lg border border-white/10 bg-surface p-4 flex flex-col gap-2"
              >
                <div className="text-xs uppercase tracking-[0.14em] text-foreground/40">
                  Paire {i + 1}
                </div>
                <p className="text-sm text-foreground/80">
                  <strong>Q :</strong> {qa.q}
                </p>
                <p className="text-sm text-foreground/80">
                  <strong>A :</strong> {qa.a}
                </p>
                <textarea
                  rows={3}
                  value={jsonl[i]}
                  onChange={(e) => {
                    const next = [...jsonl];
                    next[i] = e.target.value;
                    setJsonl(next);
                  }}
                  placeholder='{"instruction":"…","input":"","output":"…"}'
                  spellCheck={false}
                  className="font-mono text-xs bg-[#1A1A1A] border border-white/10 rounded-md px-3 py-2 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent resize-y"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </TestLayout>
  );
}
