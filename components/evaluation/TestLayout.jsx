"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Layout commun à toutes les pages de test.
 *
 * Props:
 *  - test      : { slug, title, category, order, passing_score } (depuis lib/evaluation/tests)
 *  - children  : la zone d'interaction du test
 *  - canSubmit : true si l'utilisateur peut soumettre (nb min de cas atteint)
 *  - getAnswers : function() qui renvoie l'objet raw_answers à soumettre
 *  - casesProcessed : compteur de cas traités à afficher en sidebar
 *  - extraInfo : ReactNode supplémentaire dans la sidebar (ex. score temps réel)
 */
export function TestLayout({
  test,
  children,
  canSubmit = false,
  getAnswers,
  casesProcessed = 0,
  totalCases = 0,
  extraInfo,
}) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { score, passed, unlockedNext, isLastTest }
  const [error, setError] = useState(null);

  // Timer
  useEffect(() => {
    if (result) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [result]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const raw_answers = getAnswers();
      const res = await fetch("/api/evaluation/submit-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          test_slug: test.slug,
          raw_answers,
          time_spent_seconds: seconds,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Échec de la soumission");
      setResult(json.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuit = () => {
    if (
      casesProcessed > 0 &&
      !confirm(
        "Quitter le test ? Vos réponses ne seront pas sauvegardées. Vous pourrez reprendre depuis le début."
      )
    ) {
      return;
    }
    router.push("/dashboard/evaluation");
  };

  // Écran de résultat (après soumission réussie)
  if (result) {
    return (
      <ResultScreen test={test} result={result} timeSeconds={seconds} />
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-6 max-w-6xl">
      <div className="flex flex-col gap-6 min-w-0">
        <header className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
              Test {String(test.order + 1).padStart(2, "0")} ·{" "}
              {test.category === "specialist" ? "Specialist" : "Engineer"}
            </p>
            <h1 className="t-h3 truncate">{test.title}</h1>
          </div>
          <button
            type="button"
            onClick={handleQuit}
            className="inline-flex items-center gap-2 h-9 px-3 rounded-md text-xs text-foreground/65 hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <X className="h-4 w-4" />
            Quitter
          </button>
        </header>

        {/* Zone d'interaction propre à chaque test */}
        <div className="flex-1 min-w-0">{children}</div>

        {/* Footer : barre + bouton submit */}
        <footer className="sticky bottom-0 pt-4 pb-2 bg-background/95 backdrop-blur border-t border-white/10 flex flex-col gap-3">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          {totalCases > 0 && (
            <div className="flex items-center gap-3 text-xs text-foreground/55">
              <span>
                {casesProcessed} / {totalCases} cas traités
              </span>
              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <span
                  className="block h-full bg-accent transition-[width] duration-300"
                  style={{
                    width: `${Math.min(100, (casesProcessed / totalCases) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-foreground/45">
              Score minimal pour valider : <strong>{test.passing_score}/100</strong>
            </span>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className={cn(
                "inline-flex items-center gap-2 h-11 px-6 rounded-md text-sm font-medium transition-all",
                canSubmit && !submitting
                  ? "bg-accent text-background hover:bg-accent-hover"
                  : "bg-white/10 text-foreground/30 cursor-not-allowed"
              )}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {submitting ? "Soumission…" : "Soumettre mon test"}
            </button>
          </div>
        </footer>
      </div>

      {/* Sidebar droite */}
      <aside className="hidden lg:flex flex-col gap-4 sticky top-8 self-start">
        <SidebarCard label="Timer">
          <div className="flex items-center gap-2 text-2xl font-medium text-foreground tabular-nums">
            <Clock className="h-5 w-5 text-foreground/40" />
            {formatTime(seconds)}
          </div>
        </SidebarCard>
        {totalCases > 0 && (
          <SidebarCard label="Cas traités">
            <div className="text-2xl font-medium text-foreground tabular-nums">
              {casesProcessed}
              <span className="text-sm text-foreground/40"> / {totalCases}</span>
            </div>
          </SidebarCard>
        )}
        {extraInfo && <SidebarCard label="Info">{extraInfo}</SidebarCard>}
      </aside>
    </div>
  );
}

function SidebarCard({ label, children }) {
  return (
    <div className="rounded-lg border border-white/10 bg-surface p-4 flex flex-col gap-2">
      <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">
        {label}
      </span>
      {children}
    </div>
  );
}

function ResultScreen({ test, result, timeSeconds }) {
  const passed = result.passed;
  return (
    <div className="max-w-2xl flex flex-col gap-8 py-12">
      <div
        className={cn(
          "inline-flex h-16 w-16 items-center justify-center rounded-full",
          passed
            ? "bg-success/15 border-2 border-success"
            : "bg-amber-400/15 border-2 border-amber-400"
        )}
      >
        {passed ? (
          <CheckCircle2 className="h-8 w-8 text-success" />
        ) : (
          <AlertCircle className="h-8 w-8 text-amber-400" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
          Test {String(test.order + 1).padStart(2, "0")} · résultat
        </p>
        <h2 className="t-h2-md">
          {passed ? "Test validé !" : "Test non validé"}
        </h2>
        <p className="t-lead">
          {passed
            ? result.isLastTest
              ? "Tous les tests sont complétés. Rendez-vous sur l'évaluation pour finaliser votre profil."
              : result.unlockedNext
              ? "Le test suivant est débloqué."
              : "Vous pouvez continuer."
            : `Vous n'avez pas atteint le seuil de validation (${result.passing_score}/100). Vous pouvez retenter ce test autant de fois que nécessaire.`}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Score" value={`${result.score}/100`} />
        <Stat
          label="Précision"
          value={`${(result.precision_rate * 100).toFixed(1)}%`}
        />
        <Stat label="Temps" value={`${Math.floor(timeSeconds / 60)} min`} />
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        {passed ? (
          <>
            {!result.isLastTest && result.unlockedNext && (
              <a
                href="/dashboard/evaluation"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors"
              >
                Continuer vers le test suivant
              </a>
            )}
            <a
              href="/dashboard/evaluation"
              className={cn(
                "inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md text-sm font-medium transition-colors",
                !result.isLastTest && result.unlockedNext
                  ? "border border-white/20 text-foreground/85 hover:bg-white/5"
                  : "bg-accent text-background hover:bg-accent-hover"
              )}
            >
              Retour à la roadmap
            </a>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors"
            >
              Réessayer ce test
            </button>
            <a
              href="/dashboard/evaluation"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md border border-white/20 text-sm font-medium text-foreground/85 hover:bg-white/5 transition-colors"
            >
              Retour à la roadmap
            </a>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-surface p-4 flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">
        {label}
      </span>
      <span className="text-xl font-medium text-foreground tabular-nums">
        {value}
      </span>
    </div>
  );
}
