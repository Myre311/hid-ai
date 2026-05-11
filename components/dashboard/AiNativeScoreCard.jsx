"use client";

import { TESTS } from "@/lib/evaluation/tests";
import { aiNativeBreakdown, aiNativeLevel } from "@/lib/evaluation/aiNativeScore";

/**
 * Carte de présentation du score AI-Native global.
 */
export function AiNativeScoreCard({ score, testResults = [] }) {
  const breakdown = aiNativeBreakdown(testResults);
  const level = aiNativeLevel(score);

  return (
    <div className="rounded-lg border border-accent/30 bg-gradient-to-br from-surface to-surface-elevated p-8 flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.18em] text-accent">
            AI-Native Score
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
        <span className="font-sans text-7xl md:text-8xl tracking-tight text-foreground tabular-nums">
          {score}
        </span>
        <span className="text-2xl text-foreground/35">/ 1000</span>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <BreakdownCell
          label="Specialist"
          value={breakdown.specialist_pts}
          max={500}
        />
        <BreakdownCell
          label="Engineer"
          value={breakdown.engineer_pts}
          max={400}
        />
        <BreakdownCell
          label="Bonus"
          value={breakdown.bonus_pts}
          max={100}
          accent
        />
      </div>

      <div className="grid md:grid-cols-4 gap-2 mt-2">
        {TESTS.map((t) => {
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

function BreakdownCell({ label, value, max, accent }) {
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <div className="rounded-md border border-white/10 bg-black/30 p-3 flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">
          {label}
        </span>
        <span className="text-xs text-foreground tabular-nums">
          {value} / {max}
        </span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <span
          className={`absolute-block h-full ${
            accent ? "bg-amber-300" : "bg-accent"
          } block`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
}
