"use client";

import { useRouter } from "next/navigation";
import { Sparkles, Code2, Building2, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils/cn";

const OPTIONS = [
  {
    id: "specialist",
    Icon: Sparkles,
    title: "AI Specialist",
    body: "Annotation, labellisation, RLHF. Démarrez sans prérequis technique avancé. Progression débloquée par le Flow Manager.",
    next: "/signup/phone",
  },
  {
    id: "engineer",
    Icon: Code2,
    title: "AI Engineer",
    body: "Missions techniques avancées en NLP, vision, optimisation. Passez l’évaluation du Chatbot Gatekeeper.",
    next: "/signup/phone",
  },
  {
    id: "business",
    Icon: Building2,
    title: "Entreprise",
    body: "Recrutez des talents certifiés ou lancez vos projets de données. Validation KYB sous 48h.",
    next: "/signup/business",
  },
];

export function BranchChoice() {
  const router = useRouter();
  const setBranch = useAuthStore((s) => s.setBranch);

  const choose = (opt) => {
    setBranch(opt.id);
    router.push(opt.next);
  };

  return (
    <div className="grid md:grid-cols-3 gap-4 md:gap-5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => choose(opt)}
          className={cn(
            "group flex flex-col gap-5 text-left bg-surface border border-border rounded-lg p-7 md:p-8",
            "transition-all duration-300 ease-out-expo",
            "hover:border-accent hover:-translate-y-1 hover:shadow-glow-accent",
            "focus-visible:outline-none focus-visible:border-accent focus-visible:shadow-glow-accent"
          )}
          aria-label={`Choisir ${opt.title}`}
        >
          <opt.Icon className="h-7 w-7 text-accent" aria-hidden="true" />
          <div className="flex flex-col gap-2">
            <h2 className="t-h3">
              {opt.title}
            </h2>
            <p className="text-sm md:text-base text-muted leading-relaxed">
              {opt.body}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm text-foreground mt-auto group-hover:gap-3 transition-all duration-200">
            Continuer
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>
      ))}
    </div>
  );
}
