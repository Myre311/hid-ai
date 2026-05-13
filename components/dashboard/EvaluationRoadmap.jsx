"use client";

import Link from "next/link";
import {
  Lock,
  CheckCircle2,
  Loader2,
  Play,
  ChevronRight,
  ScanEye,
  MessageSquareText,
  GitCompare,
  Sparkles,
  Brain,
  Gauge,
  Network,
  Database,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TESTS } from "@/lib/evaluation/tests";
import { cn } from "@/lib/utils/cn";

const ICONS = {
  ScanEye,
  MessageSquareText,
  GitCompare,
  Sparkles,
  Brain,
  Gauge,
  Network,
  Database,
};

const CATEGORY_LABEL = {
  specialist: "Specialist",
  engineer: "Engineer",
};

/**
 * Affiche la roadmap des tests d'évaluation du candidat.
 *
 * Props:
 *  - tests : array de test_results retournés par /api/evaluation/get-session
 *            (4 lignes pour un Specialist non upgradé, 8 pour Engineer ou
 *             Specialist upgradé). Si undefined → fallback aux 8 tests.
 */
export function EvaluationRoadmap({ tests }) {
  const list = Array.isArray(tests) && tests.length > 0 ? tests : null;

  // Si on n'a pas reçu de tests (cas dégradé), on affiche les 8 tests par défaut
  // en mode "locked" sauf le premier — comportement legacy.
  const visibleSlugs = list
    ? list.map((t) => t.test_slug)
    : TESTS.map((m) => m.slug);

  const visibleMeta = visibleSlugs
    .map((slug) => TESTS.find((m) => m.slug === slug))
    .filter(Boolean);

  const byOrder = new Map((list || []).map((t) => [t.test_order, t]));

  return (
    <div className="flex flex-col gap-3">
      {visibleMeta.map((meta, i) => {
        const result = byOrder.get(meta.order);
        const status = result?.status ?? (i === 0 ? "available" : "locked");
        const score = result?.score;
        const Icon = ICONS[meta.icon] ?? Sparkles;
        return (
          <TestCard
            key={meta.slug}
            meta={meta}
            status={status}
            score={score}
            Icon={Icon}
          />
        );
      })}
    </div>
  );
}

function TestCard({ meta, status, score, Icon }) {
  const isLocked = status === "locked";
  const isAvailable = status === "available";
  const isInProgress = status === "in_progress";
  const isCompleted = status === "completed";

  const href = `/dashboard/evaluation/${meta.slug}`;
  const orderLabel = String(meta.order + 1).padStart(2, "0");

  const Wrapper = isLocked
    ? (props) => <div {...props} />
    : ({ children, ...rest }) => (
        <Link href={href} {...rest}>
          {children}
        </Link>
      );

  return (
    <Wrapper
      className={cn(
        "group relative rounded-lg border p-5 transition-colors flex items-center gap-4",
        isLocked && "border-white/5 bg-surface/30 cursor-not-allowed opacity-60",
        isAvailable && "border-accent/40 bg-surface hover:border-accent/70",
        isInProgress && "border-accent bg-accent/5 hover:border-accent/80",
        isCompleted && "border-success/40 bg-success/5 hover:border-success/60"
      )}
    >
      {/* Numéro + icône */}
      <div
        className={cn(
          "flex-shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-md",
          isLocked && "bg-white/5 text-foreground/30",
          isAvailable && "bg-surface-elevated text-accent",
          isInProgress && "bg-accent text-background",
          isCompleted && "bg-success text-background"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isLocked ? (
            <motion.span
              key="locked"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0, rotate: 360 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <Lock className="h-5 w-5" />
            </motion.span>
          ) : isCompleted ? (
            <motion.span
              key="completed"
              initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex items-center justify-center"
            >
              <CheckCircle2 className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span
              key="active"
              initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex items-center justify-center"
            >
              <Icon className="h-5 w-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Texte */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-foreground/40">
          <span>Test {orderLabel}</span>
          <span>·</span>
          <span>{CATEGORY_LABEL[meta.category]}</span>
        </div>
        <h4 className="text-sm md:text-base font-medium text-foreground mt-1">
          {meta.title}
        </h4>
        <p className="text-xs text-foreground/55 mt-0.5">
          {meta.description}
        </p>
      </div>

      {/* Statut */}
      <div className="flex-shrink-0">
        {isLocked && (
          <span
            className="text-xs text-foreground/35 hidden md:block"
            title="Validez le test précédent pour débloquer"
          >
            Débloqué après le test précédent
          </span>
        )}
        {isAvailable && (
          <span className="inline-flex items-center gap-1.5 text-xs text-accent group-hover:text-accent-hover transition-colors">
            <Play className="h-4 w-4" />
            <span className="hidden md:inline">Commencer</span>
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
        {isInProgress && (
          <span className="inline-flex items-center gap-1.5 text-xs text-accent">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="hidden md:inline">Continuer</span>
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
        {isCompleted && (
          <span className="text-xs text-success font-medium">
            {typeof score === "number" ? `${score}/100` : "Validé"}
          </span>
        )}
      </div>
    </Wrapper>
  );
}
