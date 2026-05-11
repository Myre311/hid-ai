"use client";

import { useMemo, useState } from "react";
import { TestLayout } from "@/components/evaluation/TestLayout";
import { TechnicalQuiz } from "@/components/evaluation/TechnicalQuiz";
import { ContextCard } from "@/components/evaluation/ContextCard";
import { getTestBySlug } from "@/lib/evaluation/tests";
import { RAG_DATA } from "@/lib/evaluation/data/rag-data";

const TEST = getTestBySlug("rag");

export default function RagPage() {
  const [quiz, setQuiz] = useState({});
  const [weight, setWeight] = useState(50);

  const quizCount = Object.keys(quiz).length;
  const total = quizCount + 1;
  const canSubmit = quizCount === RAG_DATA.quiz.length;

  // Calcul du ranking en temps réel pour visualiser l'effet du curseur
  const ranking = useMemo(() => {
    const w = weight / 100;
    return [...RAG_DATA.hybrid_documents]
      .map((d) => ({
        ...d,
        combined: w * d.semantic + (1 - w) * d.lexical,
      }))
      .sort((a, b) => b.combined - a.combined);
  }, [weight]);

  return (
    <TestLayout
      test={TEST}
      canSubmit={canSubmit}
      getAnswers={() => ({
        quiz: Object.entries(quiz).map(([id, choice]) => ({ id, choice })),
        hybrid_weight: weight,
      })}
      casesProcessed={total}
      totalCases={RAG_DATA.quiz.length + 1}
    >
      <ContextCard title="RAG — Manuels d'ingénierie HID AI">
        <p>
          Vous concevez un système RAG pour indexer 50 000 pages de manuels
          d&rsquo;ingénierie (mécanique, électronique embarquée, normes
          africaines de construction). L&rsquo;exigence métier : un ingénieur
          terrain doit obtenir la bonne référence en moins de 2 secondes, sans
          hallucination. Évaluez vos choix de vector DB, de chunking et de
          poids hybride.
        </p>
      </ContextCard>

      <div className="flex flex-col gap-8">
        <section>
          <h2 className="t-h3 mb-2">Partie 1 — Quiz RAG</h2>
          <p className="text-sm text-foreground/55 mb-4">
            10 questions sur les vector databases, hybrid search et hallucinations.
          </p>
          <TechnicalQuiz
            questions={RAG_DATA.quiz}
            value={quiz}
            onChange={setQuiz}
          />
        </section>

        <section>
          <h2 className="t-h3 mb-2">Partie 2 — Hybrid Search Simulator</h2>
          <p className="text-sm text-foreground/55 mb-4">
            Pour la query ci-dessous, ajustez le poids entre recherche sémantique
            et lexicale pour obtenir le meilleur ranking (les documents les plus
            pertinents en haut).
          </p>

          <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 mb-5">
            <p className="text-xs uppercase tracking-[0.14em] text-accent mb-1">
              Query
            </p>
            <p className="text-sm text-foreground">{RAG_DATA.query}</p>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center justify-between text-xs text-foreground/55">
              <span>100% Lexical (BM25)</span>
              <span className="text-accent font-medium">
                Poids sémantique : {weight}%
              </span>
              <span>100% Sémantique</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs uppercase tracking-[0.14em] text-foreground/40 mb-1">
              Top 10 actuels (temps réel)
            </p>
            {ranking.map((d, i) => (
              <div
                key={d.id}
                className="flex items-center gap-3 rounded-md border border-white/10 bg-surface px-3 py-2 text-xs"
              >
                <span className="font-mono text-foreground/40 w-6">
                  #{i + 1}
                </span>
                <span className="flex-1 text-foreground/90 truncate">
                  {d.title}
                </span>
                <span className="text-foreground/55 font-mono">
                  sem {d.semantic.toFixed(2)} · lex {d.lexical.toFixed(2)} →{" "}
                  <span className="text-accent">
                    {d.combined.toFixed(2)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </TestLayout>
  );
}
