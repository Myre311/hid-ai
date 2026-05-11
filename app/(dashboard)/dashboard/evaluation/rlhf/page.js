"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TestLayout } from "@/components/evaluation/TestLayout";
import { getTestBySlug } from "@/lib/evaluation/tests";
import { RLHF_DATA } from "@/lib/evaluation/data/rlhf-data";
import { cn } from "@/lib/utils/cn";

const TEST = getTestBySlug("rlhf");

export default function RlhfPage() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { id: { choice, justification } }

  const pair = RLHF_DATA[idx];
  const a = answers[pair.id] || {};

  const setField = (key, val) =>
    setAnswers((prev) => ({
      ...prev,
      [pair.id]: { ...prev[pair.id], [key]: val },
    }));

  const completedCount = useMemo(
    () =>
      Object.values(answers).filter(
        (x) =>
          x.choice && typeof x.justification === "string" && x.justification.trim().length >= 50
      ).length,
    [answers]
  );

  const canSubmit = completedCount >= 8; // au moins 8 paires complétées

  return (
    <TestLayout
      test={TEST}
      canSubmit={canSubmit}
      getAnswers={() => ({
        answers: Object.entries(answers).map(([id, x]) => ({ id, ...x })),
      })}
      casesProcessed={completedCount}
      totalCases={RLHF_DATA.length}
    >
      <div className="flex flex-col gap-5">
        <p className="text-xs uppercase tracking-[0.18em] text-foreground/50">
          Paire {idx + 1} / {RLHF_DATA.length}
        </p>

        <div className="rounded-lg border border-white/10 bg-surface p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-foreground/40 mb-2">
            Question
          </p>
          <p className="text-foreground leading-relaxed">{pair.question}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <ResponseCard
            letter="A"
            text={pair.a}
            selected={a.choice === "A"}
            onClick={() => setField("choice", "A")}
          />
          <ResponseCard
            letter="B"
            text={pair.b}
            selected={a.choice === "B"}
            onClick={() => setField("choice", "B")}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-foreground/55">Votre choix :</span>
          {["A", "B", "tie"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setField("choice", c)}
              className={cn(
                "h-9 px-4 rounded-md text-xs font-medium transition-colors border",
                a.choice === c
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-white/15 text-foreground/75 hover:bg-white/5"
              )}
            >
              {c === "tie" ? "Égalité" : `Préférer ${c}`}
            </button>
          ))}
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-[0.14em] text-foreground/50">
            Justification (50 caractères min)
          </span>
          <textarea
            value={a.justification ?? ""}
            onChange={(e) => setField("justification", e.target.value)}
            rows={3}
            placeholder="Expliquez votre choix (hallucinations, précision, ton, etc.)"
            className="bg-[#1A1A1A] border border-white/10 rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent transition-colors"
          />
          <span className="text-[10px] text-foreground/40 text-right">
            {(a.justification ?? "").length} / 50 min
          </span>
        </label>

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
            {completedCount} / {RLHF_DATA.length} complétées
          </span>
          <button
            type="button"
            onClick={() => setIdx((i) => Math.min(RLHF_DATA.length - 1, i + 1))}
            disabled={idx === RLHF_DATA.length - 1}
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

function ResponseCard({ letter, text, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left rounded-lg border p-5 transition-colors min-h-[160px]",
        selected
          ? "border-accent bg-accent/5"
          : "border-white/10 bg-surface hover:border-white/25"
      )}
    >
      <p className="text-xs uppercase tracking-[0.18em] text-foreground/40 mb-2">
        Réponse {letter}
      </p>
      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
        {text}
      </p>
    </button>
  );
}
