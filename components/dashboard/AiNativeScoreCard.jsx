"use client";

import { TESTS } from "@/lib/evaluation/tests";
import {
  aiNativeBreakdown,
  aiNativeLevel,
  metierLabel,
} from "@/lib/evaluation/aiNativeScore";
import { AnimatedScore } from "./AnimatedScore";

/**
 * Carte de présentation du score AI-Native global — sur /100 (cap 96).
 * Différenciée par metier (badge "AI Specialist" / "AI Engineer" / "Dual").
 */
export function AiNativeScoreCard({ score, testResults = [], metier }) {
  const breakdown = aiNativeBreakdown(testResults);
  const level = aiNativeLevel(score);

  // Détermine le metier réel à partir des testResults si non fourni
  const hasS = testResults.some((t) => t.test_category === "specialist");
  const hasE = testResults.some((t) => t.test_category === "engineer");
  const computedMetier =
    metier ?? (hasS && hasE ? "dual" : hasS ? "specialist" : hasE ? "engineer" : "specialist");
  const metierLbl = metierLabel(computedMetier);

  return (
    <div className="rounded-lg border border-accent/30 bg-gradient-to-br from-surface to-surface-elevated p-8 flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.18em] text-accent">
            AI-Native Score · {metierLbl}
          </p>
          <h3 className="text-sm text-foreground/55">
            Votre niveau global d&rsquo;activation
          </h3>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/50 bg-accent/10 text-xs font-medium text-accent">
          {level.label}
        </span>
      </div>

      <div className="flex items-baseline gap-3">
        <AnimatedScore
          value={score}
          className="font-sans text-7xl md:text-8xl tracking-tight text-foreground"
        />
        <span className="text-2xl text-foreground/35">/ 100</span>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <BreakdownCell
          label="Compétence"
          subLabel="moyenne des épreuves"
          value={breakdown.competence_pts}
          max={100}
        />
        <BreakdownCell
          label="Rigueur"
          subLabel="rythme par épreuve"
          value={breakdown.time_pts}
          max={100}
          accent
        />
      </div>

      {/* Tests passés (uniquement) */}
      <div className="grid md:grid-cols-4 gap-2 mt-2">
        {TESTS.filter((t) =>
          testResults.some((r) => r.test_slug === t.slug)
        ).map((t) => {
          const result = testResults.find((r) => r.test_slug === t.slug);
          const s = result?.score ?? null;
          return (
            <div
              key={t.slug}
              className="rounded-md border border-white/10 bg-black/30 px-3 py-2 flex items-center justify-between"
            >
              <span className="text-[10px] uppercase tracking-[0.12em] text-foreground/40">
                Test {String(t.order + 1).padStart(2, "0")}
              </span>
              <span className="text-xs text-foreground/85 tabular-nums">
                {s != null ? `${s}/100` : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BreakdownCell({ label, subLabel, value, max, accent }) {
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <div className="rounded-md border border-white/10 bg-black/30 p-3 flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">
            {label}
          </span>
          {subLabel && (
            <span className="text-[10px] text-foreground/30 mt-0.5">
              {subLabel}
            </span>
          )}
        </div>
        <span className="text-xs text-foreground tabular-nums">
          {value} / {max}
        </span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <span
          className={`absolute-block h-full ${accent ? "bg-amber-300" : "bg-accent"} block`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
}
