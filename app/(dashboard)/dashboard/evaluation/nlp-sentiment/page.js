"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TestLayout } from "@/components/evaluation/TestLayout";
import { ContextCard } from "@/components/evaluation/ContextCard";
import { getTestBySlug } from "@/lib/evaluation/tests";
import {
  NLP_SENTIMENT_DATA,
  NER_DATA,
  NER_TYPES,
} from "@/lib/evaluation/data/nlp-sentiment-data";

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
  const [ner, setNer] = useState({}); // { spanId: type }

  const phrase = NLP_SENTIMENT_DATA[idx];
  const current = answers[phrase.id] || {};

  const setField = (key, val) =>
    setAnswers((prev) => ({
      ...prev,
      [phrase.id]: { ...prev[phrase.id], [key]: val },
    }));

  const setNerSpan = (spanId, val) =>
    setNer((prev) => ({ ...prev, [spanId]: val }));

  const completedCount = useMemo(
    () =>
      Object.values(answers).filter(
        (a) => a.sentiment && a.urgence && a.categorie
      ).length,
    [answers]
  );

  const totalSpans = NER_DATA.reduce((acc, s) => acc + s.spans.length, 0);
  const tagged = Object.values(ner).filter((v) => v && v.length > 0).length;

  const canSubmit =
    completedCount === NLP_SENTIMENT_DATA.length && tagged === totalSpans;

  return (
    <TestLayout
      test={TEST}
      canSubmit={canSubmit}
      getAnswers={() => ({
        answers: Object.entries(answers).map(([id, a]) => ({ id, ...a })),
        ner,
      })}
      casesProcessed={completedCount + (tagged > 0 ? NER_DATA.length : 0)}
      totalCases={NLP_SENTIMENT_DATA.length + NER_DATA.length}
    >
      <ContextCard title="Triage des tickets support — multilingue & multi-pays">
        <p>
          Vous évaluez deux compétences NLP : (1) classer 15 messages clients
          réels selon sentiment, urgence et catégorie, et (2) extraire les
          entités nommées (personnes, organisations, lieux, montants en
          FCFA/XAF, dates) sur 5 tickets africains. Une bonne pipeline NLP doit
          gérer le français formel, les noms locaux et les devises CFA.
        </p>
      </ContextCard>

      <section>
        <h2 className="t-h3 mb-2">Partie 1 / 2 — Classification</h2>
        <p className="text-sm text-foreground/55 mb-5">
          Classifiez chacune des 15 phrases sur les trois axes.
        </p>

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
      </section>

      <section className="mt-10">
        <h2 className="t-h3 mb-2">
          Partie 2 / 2 — Named Entity Recognition (NER)
        </h2>
        <p className="text-sm text-foreground/55 mb-5">
          Pour chaque entité surlignée dans les phrases ci-dessous,
          sélectionnez le bon type. Total : {totalSpans} entités à étiqueter.
        </p>

        <div className="flex flex-col gap-5">
          {NER_DATA.map((s, i) => (
            <div
              key={s.id}
              className="rounded-lg border border-white/10 bg-surface p-5 flex flex-col gap-3"
            >
              <div className="text-xs uppercase tracking-[0.14em] text-foreground/40">
                Phrase {i + 1} / {NER_DATA.length}
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">
                <HighlightedText text={s.text} spans={s.spans} />
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mt-2">
                {s.spans.map((span) => (
                  <label
                    key={span.id}
                    className="flex items-center gap-3 rounded-md border border-white/10 bg-background px-3 py-2"
                  >
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-accent/15 border border-accent/30 text-xs text-accent font-medium truncate max-w-[160px]">
                      {span.text}
                    </span>
                    <select
                      value={ner[span.id] ?? ""}
                      onChange={(e) => setNerSpan(span.id, e.target.value)}
                      className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-md px-2 h-9 text-xs text-foreground focus:outline-none focus:border-accent"
                    >
                      <option value="" className="bg-[#0A0A0B]">
                        Type…
                      </option>
                      {NER_TYPES.map((t) => (
                        <option
                          key={t.value}
                          value={t.value}
                          className="bg-[#0A0A0B]"
                        >
                          {t.value} — {t.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-foreground/50">
          {tagged} / {totalSpans} entités étiquetées
        </p>
      </section>
    </TestLayout>
  );
}

function HighlightedText({ text, spans }) {
  // On surligne les occurrences exactes des spans dans le texte.
  // Approche simple : on construit un tableau de segments en passant
  // de gauche à droite et en repérant la première occurrence.
  const segments = [];
  let cursor = 0;
  const sorted = spans
    .map((sp) => ({ ...sp, pos: text.indexOf(sp.text) }))
    .filter((sp) => sp.pos >= 0)
    .sort((a, b) => a.pos - b.pos);

  sorted.forEach((sp) => {
    if (sp.pos > cursor) {
      segments.push({ kind: "text", value: text.slice(cursor, sp.pos) });
    }
    segments.push({ kind: "entity", value: sp.text });
    cursor = sp.pos + sp.text.length;
  });
  if (cursor < text.length) {
    segments.push({ kind: "text", value: text.slice(cursor) });
  }

  return (
    <>
      {segments.map((seg, i) =>
        seg.kind === "entity" ? (
          <mark
            key={i}
            className="bg-accent/15 text-accent rounded px-1 py-0.5 mx-0.5"
          >
            {seg.value}
          </mark>
        ) : (
          <span key={i}>{seg.value}</span>
        )
      )}
    </>
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
