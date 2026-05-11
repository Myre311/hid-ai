"use client";

import { cn } from "@/lib/utils/cn";

/**
 * QCM réutilisable pour les tests Engineer.
 *
 * questions : [{ id, question, options: { A, B, C, D }, answer (private) }]
 * value     : { [id]: "A" | "B" | "C" | "D" }
 * onChange  : (newValue) => void
 */
export function TechnicalQuiz({ questions, value, onChange }) {
  const setChoice = (qid, choice) => onChange({ ...value, [qid]: choice });

  return (
    <div className="flex flex-col gap-6">
      {questions.map((q, idx) => (
        <fieldset
          key={q.id}
          className="rounded-lg border border-white/10 bg-surface p-5 flex flex-col gap-3"
        >
          <legend className="text-xs uppercase tracking-[0.18em] text-foreground/40 mb-1">
            Question {idx + 1} / {questions.length}
          </legend>
          <p className="text-sm md:text-base text-foreground">{q.question}</p>
          <div className="grid md:grid-cols-2 gap-2 mt-2">
            {Object.entries(q.options).map(([key, label]) => {
              const checked = value[q.id] === key;
              return (
                <label
                  key={key}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors border text-sm",
                    checked
                      ? "border-accent/60 bg-accent/5"
                      : "border-white/10 bg-background hover:border-white/25"
                  )}
                >
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={key}
                    checked={checked}
                    onChange={() => setChoice(q.id, key)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "h-4 w-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center",
                      checked ? "border-accent" : "border-white/30"
                    )}
                  >
                    {checked && (
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    )}
                  </span>
                  <span className="text-foreground/85 leading-relaxed">
                    <strong className="text-foreground mr-1.5">{key}.</strong>
                    {label}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
