"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TestLayout } from "@/components/evaluation/TestLayout";
import { getTestBySlug } from "@/lib/evaluation/tests";
import { NLP_SENTIMENT_DATA } from "@/lib/evaluation/data/nlp-sentiment-data";

const TEST = getTestBySlug("nlp-sentiment");

const SENTIMENTS = [
  { value: "positif", label: "Positif" },
  { value: "negatif", label: "Négatif" },
  { value: "neutre", label: "Neutre" },
];
const URGENCES = [
  { value: "haute", label: "Haute" },
  { value: "moyenne", label: "Moyenne" },
  { value: "basse", label: "Basse" },
];
const CATEGORIES = [
  { value: "facturation", label: "Facturation" },
  { value: "technique", label: "Technique" },
  { value: "commercial", label: "Commercial" },
];

export default function NlpSentimentPage() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { id: { sentiment, urgence, categorie } }

  const phrase = NLP_SENTIMENT_DATA[idx];
  const current = answers[phrase.id] || {};

  const setField = (key, val) =>
    setAnswers((prev) => ({
      ...prev,
      [phrase.id]: { ...prev[phrase.id], [key]: val },
    }));

  const completedCount = useMemo(
    () =>
      Object.values(answers).filter(
        (a) => a.sentiment && a.urgence && a.categorie
      ).length,
    [answers]
  );

  const canSubmit = completedCount === NLP_SENTIMENT_DATA.length;

  return (
    <TestLayout
      test={TEST}
      canSubmit={canSubmit}
      getAnswers={() => ({
        answers: Object.entries(answers).map(([id, a]) => ({ id, ...a })),
      })}
      casesProcessed={completedCount}
      totalCases={NLP_SENTIMENT_DATA.length}
    >
      <div className="flex flex-col gap-5">
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-accent mb-2">
            Phrase {idx + 1} / {NLP_SENTIMENT_DATA.length}
          </p>
          <p className="text-base md:text-lg text-foreground leading-relaxed">
            {phrase.text}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <SelectField
            label="Sentiment"
            options={SENTIMENTS}
            value={current.sentiment}
            onChange={(v) => setField("sentiment", v)}
          />
          <SelectField
            label="Urgence"
            options={URGENCES}
            value={current.urgence}
            onChange={(v) => setField("urgence", v)}
          />
          <SelectField
            label="Catégorie"
            options={CATEGORIES}
            value={current.categorie}
            onChange={(v) => setField("categorie", v)}
          />
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <button
            type="button"
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-white/15 text-xs text-foreground/85 hover:bg-white/5 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédente
          </button>
          <span className="text-xs text-foreground/50">
            {completedCount} / {NLP_SENTIMENT_DATA.length} complétées
          </span>
          <button
            type="button"
            onClick={() =>
              setIdx((i) => Math.min(NLP_SENTIMENT_DATA.length - 1, i + 1))
            }
            disabled={idx === NLP_SENTIMENT_DATA.length - 1}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-white/15 text-xs text-foreground/85 hover:bg-white/5 disabled:opacity-40"
          >
            Suivante
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </TestLayout>
  );
}

function SelectField({ label, options, value, onChange }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-[0.14em] text-foreground/50">
        {label}
      </span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#1A1A1A] border border-white/10 rounded-md px-3 h-11 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
      >
        <option value="" className="bg-[#0A0A0B]">
          Choisir…
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0A0A0B]">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
