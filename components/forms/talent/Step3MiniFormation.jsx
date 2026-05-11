"use client";

import { useState } from "react";
import { CheckCircle2, PlayCircle, BookOpen, ShieldCheck, Compass } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const MODULES = [
  {
    id: "ecosysteme",
    icon: BookOpen,
    title: "Maîtrise de l'écosystème HID AI",
    description:
      "Apprentissage de l'interface, gestion des tâches, utilisation des outils.",
    duree: "~15 min",
  },
  {
    id: "securite",
    icon: ShieldCheck,
    title: "Sécurité et confidentialité des données",
    description:
      "Protocoles de traitement des données sensibles, RGPD, normes ISO.",
    duree: "~20 min",
  },
  {
    id: "orientation",
    icon: Compass,
    title: "Orientation compétences",
    description:
      "Attentes du marché, spécificités NLP et Computer Vision.",
    duree: "~15 min",
  },
];

function ModuleCard({ module, status, onValidate }) {
  const Icon = module.icon;
  const [opened, setOpened] = useState(false);

  return (
    <article
      className={cn(
        "rounded-lg border p-5 flex flex-col gap-4 transition-colors",
        status === "valide"
          ? "border-accent/40 bg-accent/5"
          : "border-white/10 bg-[#1A1A1A]"
      )}
    >
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-md flex-shrink-0",
            status === "valide"
              ? "bg-accent text-background"
              : "bg-surface-elevated text-accent"
          )}
        >
          {status === "valide" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <Icon className="h-5 w-5" />
          )}
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground">
            {module.title}
          </h4>
          <p className="text-xs text-foreground/55 mt-1">
            {module.description}
          </p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/40 mt-2">
            Durée estimée · {module.duree}
          </p>
        </div>
        <span
          className={cn(
            "text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full flex-shrink-0",
            status === "valide" && "bg-accent/15 text-accent",
            status === "en_cours" && "bg-white/5 text-foreground/70",
            status === "a_demarrer" && "bg-white/5 text-foreground/40"
          )}
        >
          {status === "valide" && "Validé"}
          {status === "en_cours" && "En cours"}
          {status === "a_demarrer" && "À démarrer"}
        </span>
      </div>

      {opened && status !== "valide" && (
        <div className="rounded-md bg-black/40 border border-white/10 p-4 text-xs text-foreground/65 leading-relaxed">
          <p>
            <strong>Module en cours de développement.</strong> Pour cette version
            préliminaire, le contenu pédagogique réel sera intégré
            ultérieurement. Cliquez sur « Marquer comme validé » pour simuler
            l&rsquo;achèvement du module et passer à la suite.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        {status !== "valide" && !opened && (
          <button
            type="button"
            onClick={() => setOpened(true)}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md border border-white/15 text-xs text-foreground/85 hover:bg-white/5"
          >
            <PlayCircle className="h-4 w-4" />
            Démarrer le module
          </button>
        )}
        {status !== "valide" && opened && (
          <button
            type="button"
            onClick={onValidate}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-accent text-background text-xs font-medium hover:bg-accent-hover"
          >
            <CheckCircle2 className="h-4 w-4" /> Marquer comme validé
          </button>
        )}
        {status === "valide" && (
          <span className="text-xs text-accent inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> Module validé
          </span>
        )}
      </div>
    </article>
  );
}

export function TalentStep3MiniFormation({ data, errors, update }) {
  // data.modules: { ecosysteme: "valide" | "a_demarrer", ... }
  const modules = data.modules || {};
  const setStatus = (id, status) =>
    update({ ...data, modules: { ...modules, [id]: status } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="t-h3">Programme de pré-qualification</h3>
        <p className="text-sm text-foreground/60">
          Trois modules à compléter avant l&rsquo;évaluation technique.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {MODULES.map((m) => {
          const status = modules[m.id] || "a_demarrer";
          return (
            <ModuleCard
              key={m.id}
              module={m}
              status={status}
              onValidate={() => setStatus(m.id, "valide")}
            />
          );
        })}
      </div>

      {errors.modules && (
        <p className="text-xs text-red-400">{errors.modules}</p>
      )}
    </div>
  );
}

export function validateTalentStep3(data) {
  const e = {};
  const modules = data.modules || {};
  const allValidated = MODULES.every((m) => modules[m.id] === "valide");
  if (!allValidated)
    e.modules = "Vous devez valider les 3 modules avant de continuer.";
  return e;
}
