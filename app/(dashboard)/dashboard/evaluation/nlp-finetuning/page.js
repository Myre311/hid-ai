"use client";

import { useState } from "react";
import { TestLayout } from "@/components/evaluation/TestLayout";
import { TechnicalQuiz } from "@/components/evaluation/TechnicalQuiz";
import { ContextCard } from "@/components/evaluation/ContextCard";
import { PerplexityChart } from "@/components/evaluation/PerplexityChart";
import { getTestBySlug } from "@/lib/evaluation/tests";
import { NLP_FINETUNING_DATA } from "@/lib/evaluation/data/nlp-finetuning-data";

const TEST = getTestBySlug("nlp-finetuning");

export default function NlpFinetuningPage() {
  const [quiz, setQuiz] = useState({});
  const [jsonl, setJsonl] = useState(Array(5).fill(""));
  const [perplexity, setPerplexity] = useState({});

  const setPerpField = (id, val) =>
    setPerplexity((prev) => ({ ...prev, [id]: val }));

  const quizCount = Object.keys(quiz).length;
  const jsonlCount = jsonl.filter((l) => l.trim().length > 5).length;
  const perpCount = Object.keys(perplexity).filter((k) => {
    const v = perplexity[k];
    return v != null && String(v).trim().length > 0;
  }).length;
  const totalCount = quizCount + jsonlCount + perpCount;

  const canSubmit =
    quizCount === NLP_FINETUNING_DATA.quiz.length &&
    jsonlCount >= 3 &&
    perpCount === NLP_FINETUNING_DATA.perplexity.questions.length;

  return (
    <TestLayout
      test={TEST}
      canSubmit={canSubmit}
      getAnswers={() => ({
        quiz: Object.entries(quiz).map(([id, choice]) => ({ id, choice })),
        jsonl,
        perplexity,
      })}
      casesProcessed={totalCount}
      totalCases={
        NLP_FINETUNING_DATA.quiz.length +
        5 +
        NLP_FINETUNING_DATA.perplexity.questions.length
      }
    >
      <ContextCard title="Spécialisation IA pour le marché africain">
        <p>
          HID AI développe des modèles IA spécialisés pour les marchés africains.
          Ce test évalue votre capacité à fine-tuner un modèle Open Source
          (Mistral 7B, Llama 3) sur des domaines verticaux comme le{" "}
          <strong>Droit OHADA</strong> ou la <strong>Fiscalité Africaine</strong>,
          en utilisant LoRA/QLoRA pour optimiser les coûts de calcul.
        </p>
      </ContextCard>

      <div className="flex flex-col gap-10">
        <section>
          <h2 className="t-h3 mb-2">Partie 1 / 3 — Quiz technique</h2>
          <p className="text-sm text-foreground/55 mb-4">
            10 questions sur le fine-tuning, dont 4 contextualisées
            OHADA / Fiscalité Africaine.
          </p>
          <TechnicalQuiz
            questions={NLP_FINETUNING_DATA.quiz}
            value={quiz}
            onChange={setQuiz}
          />
        </section>

        <section>
          <h2 className="t-h3 mb-2">Partie 2 / 3 — Construction JSONL (Droit OHADA)</h2>
          <p className="text-sm text-foreground/55 mb-4">
            Convertissez chaque paire Q&amp;A ci-dessous au format JSON
            d&rsquo;instruction sur une seule ligne :{" "}
            <code className="text-xs bg-surface px-1.5 py-0.5 rounded">
              {`{"instruction":"…","input":"","output":"…"}`}
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

        <section>
          <h2 className="t-h3 mb-2">
            Partie 3 / 3 — Analyse Perplexity &amp; livraison
          </h2>
          <p className="text-sm text-foreground/55 mb-4">
            Voici la courbe de perplexity d&rsquo;un Mistral 7B fine-tuné LoRA
            sur 10 000 paires Q&amp;A du Droit OHADA, sur 10 epochs.
          </p>

          <PerplexityChart curve={NLP_FINETUNING_DATA.perplexity.curve} />

          <div className="flex flex-col gap-5 mt-6">
            {NLP_FINETUNING_DATA.perplexity.questions.map((q) => (
              <div
                key={q.id}
                className="rounded-lg border border-white/10 bg-surface p-4 flex flex-col gap-3"
              >
                <p className="text-sm text-foreground">{q.question}</p>
                {q.type === "number" ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={perplexity[q.id] ?? ""}
                      onChange={(e) => setPerpField(q.id, e.target.value)}
                      placeholder="Ex. 71.7"
                      className="bg-[#1A1A1A] border border-white/10 rounded-md px-3 h-10 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent w-40"
                    />
                    <span className="text-sm text-foreground/55">%</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {Object.entries(q.options).map(([key, label]) => {
                      const checked = perplexity[q.id] === key;
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
                            name={`perp-${q.id}`}
                            value={key}
                            checked={checked}
                            onChange={() => setPerpField(q.id, key)}
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
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </TestLayout>
  );
}
