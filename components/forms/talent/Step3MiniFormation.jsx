"use client";

import { useState } from "react";
import { CheckCircle2, PlayCircle, BookOpen, ShieldCheck, Compass, RotateCcw, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// ──────────────────────────────────────────────────────────────────────────
// Contenu pédagogique réel — 3 modules de pré-qualification.
// Chaque module : un brief structuré + un quiz à 3 questions (2/3 = validé).
// ──────────────────────────────────────────────────────────────────────────

const MODULES = [
  {
    id: "ecosysteme",
    icon: BookOpen,
    title: "Maîtrise de l'écosystème HID AI",
    duree: "~15 min",
    description:
      "Comprendre HID AI, le rôle des Talents, et le cycle de vie d'une mission.",
    content: [
      {
        h: "Qu'est-ce que HID AI ?",
        p: "HID AI est l'infrastructure humaine de l'IA opérée depuis la France par Hidea Solution, avec des hubs en Côte d'Ivoire, au Maroc et au Congo Brazzaville. Notre mission : fournir aux laboratoires de recherche et aux entreprises les données labellisées de très haute qualité dont leurs modèles ont besoin pour apprendre.",
      },
      {
        h: "Deux rôles distincts : Specialist vs Engineer",
        p: "Un AI Specialist annote, qualifie et structure des données (texte, image, dialogue, RLHF). Un AI Engineer conçoit des pipelines, fait du fine-tuning, du déploiement MLOps. Selon votre profil, vous serez orienté vers l'une ou l'autre branche après l'évaluation.",
      },
      {
        h: "Le cycle d'une mission",
        p: "Brief client → calibration sur 50 cas test (kappa Cohen > 0.7) → production à plein régime → revue qualité hebdomadaire → livraison + paiement. Un Talent type passe par 3 à 5 missions par trimestre.",
      },
      {
        h: "Standards qualité non négociables",
        p: "Tout cas litigieux est remonté immédiatement. Pas de devinette : si une instruction est ambiguë, vous demandez. Un score qualité inférieur à 92% sur deux missions consécutives déclenche une revue formation. Au-dessus de 97%, vous accédez à des missions premium mieux rémunérées.",
      },
    ],
    quiz: [
      {
        q: "Quel est le rôle principal d'un AI Specialist sur HID AI ?",
        options: [
          "Développer les modèles IA en interne",
          "Annoter et qualifier des données pour entraîner des modèles",
          "Gérer les contrats commerciaux avec les clients B2B",
        ],
        correct: 1,
      },
      {
        q: "Quel score qualité déclenche une revue formation ?",
        options: [
          "Inférieur à 92 % sur deux missions consécutives",
          "Inférieur à 80 % sur une seule mission",
          "Inférieur à 50 % sur une mission",
        ],
        correct: 0,
      },
      {
        q: "Que faites-vous si une instruction d'annotation est ambiguë ?",
        options: [
          "Vous choisissez l'interprétation la plus probable et continuez",
          "Vous remontez la question avant de poursuivre",
          "Vous laissez le cas vide et passez au suivant",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: "securite",
    icon: ShieldCheck,
    title: "Sécurité et confidentialité des données",
    duree: "~20 min",
    description:
      "RGPD, données sensibles, bonnes pratiques quotidiennes pour protéger les données clients.",
    content: [
      {
        h: "Le RGPD en une page",
        p: "Le Règlement Général sur la Protection des Données encadre le traitement des données personnelles dans l'UE. À retenir : finalité explicite, données minimales, durée de conservation justifiée, droits des personnes (accès, rectification, effacement, portabilité). Toute violation peut coûter jusqu'à 4 % du CA annuel mondial à HID AI.",
      },
      {
        h: "Données sensibles : catégorie spéciale",
        p: "Origine raciale, opinions politiques, santé, données biométriques identifiantes, orientation sexuelle. Ces données ne peuvent jamais être traitées sans base légale explicite (consentement ou texte). Si vous identifiez ce type de donnée dans un dataset, arrêt immédiat et remontée.",
      },
      {
        h: "Bonnes pratiques quotidiennes",
        p: "Travaillez uniquement depuis l'environnement HID AI fourni. Pas de copie sur disque local, pas de capture d'écran envoyée par messagerie personnelle, pas de partage de credentials. Verrouillez votre poste quand vous vous éloignez. Authentification 2FA obligatoire.",
      },
      {
        h: "Durée de conservation",
        p: "Les données client ne sont conservées que le temps strictement nécessaire à la mission, plus une période d'audit définie au contrat (3 ans maximum pour les pièces KYC, 12 mois pour les logs, durée client pour les datasets eux-mêmes). Au-delà, suppression sécurisée.",
      },
    ],
    quiz: [
      {
        q: "Vous tombez sur un dataset contenant des dossiers médicaux nominatifs. Que faites-vous ?",
        options: [
          "Vous l'annotez normalement, c'est une mission comme une autre",
          "Vous arrêtez et remontez immédiatement à HID AI pour vérification de la base légale",
          "Vous anonymisez vous-même les noms et continuez",
        ],
        correct: 1,
      },
      {
        q: "Quelle est la sanction maximale prévue par le RGPD pour une violation ?",
        options: [
          "Une amende fixe de 10 000 €",
          "Jusqu'à 4 % du chiffre d'affaires annuel mondial",
          "Une interdiction de traiter des données pendant 6 mois",
        ],
        correct: 1,
      },
      {
        q: "Quelle pratique est INTERDITE sur HID AI ?",
        options: [
          "Verrouiller votre poste avant de partir en pause",
          "Demander une clarification sur un cas d'annotation",
          "Copier un dataset client sur votre disque personnel pour aller plus vite",
        ],
        correct: 2,
      },
    ],
  },
  {
    id: "orientation",
    icon: Compass,
    title: "Orientation compétences",
    duree: "~15 min",
    description:
      "Le paysage des compétences IA 2026 : NLP, Computer Vision, RLHF, MLOps, RAG.",
    content: [
      {
        h: "Le paysage 2026 en quatre piliers",
        p: "(1) NLP — sentiment, NER, classification, fine-tuning de LLM. (2) Computer Vision — détection, segmentation, tracking, edge AI. (3) RLHF & alignment — comparer des réponses de modèles, écrire des justifications pédagogiques. (4) MLOps & RAG — déploiement, monitoring, hybrid search, retrieval augmentation.",
      },
      {
        h: "Fine-tuning vs RAG : la différence",
        p: "Le fine-tuning modifie les poids d'un modèle pour qu'il apprenne un domaine ou un style. C'est coûteux, lent, et fige les connaissances. Le RAG (Retrieval-Augmented Generation) laisse le modèle inchangé mais lui injecte du contexte au moment du prompt depuis une base documentaire. Plus rapide, moins cher, mis à jour en continu. Les deux sont complémentaires.",
      },
      {
        h: "Annotation premium : les compétences qui paient",
        p: "Les missions les mieux rémunérées exigent : langues africaines (Wolof, Lingala, Swahili, Bambara…), domaines verticaux (médical, juridique OHADA, scientifique), tâches complexes (RLHF en contexte africain, segmentation polygonale, NER fine-grained). Une certification dans ces axes peut doubler votre tarif horaire.",
      },
      {
        h: "Spécialist ou Engineer : comment choisir ?",
        p: "AI Specialist si vous aimez le travail de précision, le détail linguistique ou visuel, et que vous voulez progresser vers des rôles de Lead Annotator ou QA. AI Engineer si vous codez (Python, PyTorch, TensorFlow), aimez le déploiement et le tuning. Les deux profils peuvent évoluer vers des rôles de formation et de coordination de hub.",
      },
    ],
    quiz: [
      {
        q: "Que signifie l'acronyme RLHF ?",
        options: [
          "Reinforcement Learning from Human Feedback",
          "Rapid Learning High Frequency",
          "Random Logic for Heavy Files",
        ],
        correct: 0,
      },
      {
        q: "Quelle est la différence principale entre fine-tuning et RAG ?",
        options: [
          "Le RAG est gratuit, le fine-tuning est payant",
          "Le fine-tuning modifie les poids du modèle, le RAG ajoute du contexte au prompt",
          "Le RAG sert pour la vision, le fine-tuning pour le texte",
        ],
        correct: 1,
      },
      {
        q: "Pour annoter 10 000 phrases en wolof avec catégories de sentiment, quel profil est le plus adapté ?",
        options: [
          "AI Engineer — pour automatiser via un modèle",
          "AI Specialist — précision linguistique sur langue africaine",
          "Aucun des deux, c'est externalisé",
        ],
        correct: 1,
      },
    ],
  },
];

const PASS_THRESHOLD = 2; // 2 sur 3 minimum pour valider

// ──────────────────────────────────────────────────────────────────────────
// ModuleCard
// ──────────────────────────────────────────────────────────────────────────

function ModuleCard({ module, status, onValidate }) {
  const Icon = module.icon;
  const [opened, setOpened] = useState(false);
  const [stage, setStage] = useState("content"); // content | quiz | result
  const [answers, setAnswers] = useState({}); // { qIdx: optIdx }
  const [score, setScore] = useState(null);
  const [attempts, setAttempts] = useState(0);

  function submitQuiz() {
    let correct = 0;
    module.quiz.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });
    const attemptNum = attempts + 1;
    setAttempts(attemptNum);
    setScore(correct);
    setStage("result");
    if (correct >= PASS_THRESHOLD) {
      // Enrichit le payload pour traçabilité (au lieu d'un simple string "valide")
      onValidate({
        status: "valide",
        score: correct,
        total: module.quiz.length,
        attempts: attemptNum,
        answers: { ...answers },
        completed_at: new Date().toISOString(),
      });
    }
  }

  function retry() {
    setAnswers({});
    setScore(null);
    setStage("quiz");
  }

  return (
    <article
      className={cn(
        "rounded-lg border p-5 flex flex-col gap-4 transition-colors",
        status === "valide"
          ? "border-accent/40 bg-accent/5"
          : "border-white/10 bg-[#1A1A1A]"
      )}
    >
      <header className="flex items-start gap-4">
        <span
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-md flex-shrink-0",
            status === "valide"
              ? "bg-accent text-background"
              : "bg-surface-elevated text-accent"
          )}
        >
          {status === "valide" ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground">{module.title}</h4>
          <p className="text-xs text-foreground/55 mt-1">{module.description}</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/40 mt-2">
            Durée estimée · {module.duree} · Quiz {PASS_THRESHOLD}/3 pour valider
          </p>
        </div>
        <span
          className={cn(
            "text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full flex-shrink-0",
            status === "valide" && "bg-accent/15 text-accent",
            status !== "valide" && opened && "bg-white/5 text-foreground/70",
            status !== "valide" && !opened && "bg-white/5 text-foreground/40"
          )}
        >
          {status === "valide" ? "Validé" : opened ? "En cours" : "À démarrer"}
        </span>
      </header>

      {/* Contenu */}
      {opened && status !== "valide" && stage === "content" && (
        <div className="flex flex-col gap-4 rounded-md bg-black/40 border border-white/10 p-5">
          {module.content.map((sec, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <h5 className="text-[11px] uppercase tracking-[0.2em] text-accent">{sec.h}</h5>
              <p className="text-sm text-foreground/85 leading-relaxed">{sec.p}</p>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setStage("quiz")}
            className="mt-2 self-start inline-flex items-center gap-2 h-9 px-4 rounded-md bg-accent text-background text-xs font-medium hover:bg-accent-hover transition-colors"
          >
            <PlayCircle className="h-4 w-4" /> Passer le quiz
          </button>
        </div>
      )}

      {/* Quiz */}
      {opened && status !== "valide" && stage === "quiz" && (
        <div className="flex flex-col gap-5 rounded-md bg-black/40 border border-white/10 p-5">
          {module.quiz.map((q, qi) => (
            <fieldset key={qi} className="flex flex-col gap-2.5">
              <legend className="text-sm text-foreground font-medium">
                {qi + 1}. {q.q}
              </legend>
              <div className="flex flex-col gap-1.5">
                {q.options.map((opt, oi) => {
                  const selected = answers[qi] === oi;
                  return (
                    <label
                      key={oi}
                      className={cn(
                        "flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors text-sm",
                        selected
                          ? "border-accent bg-accent/10 text-foreground"
                          : "border-white/10 hover:border-white/25 text-foreground/85"
                      )}
                    >
                      <input
                        type="radio"
                        name={`q-${module.id}-${qi}`}
                        checked={selected}
                        onChange={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                        className="mt-0.5 accent-amber-500"
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
          <button
            type="button"
            onClick={submitQuiz}
            disabled={Object.keys(answers).length < module.quiz.length}
            className={cn(
              "self-start inline-flex items-center gap-2 h-9 px-4 rounded-md text-xs font-medium transition-colors",
              "bg-accent text-background hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            Soumettre le quiz
          </button>
        </div>
      )}

      {/* Résultat */}
      {opened && status !== "valide" && stage === "result" && score !== null && (
        <div
          className={cn(
            "flex items-start gap-3 rounded-md border p-4",
            score >= PASS_THRESHOLD ? "border-accent/40 bg-accent/5" : "border-danger/40 bg-danger/5"
          )}
        >
          {score >= PASS_THRESHOLD ? (
            <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-sm text-foreground font-medium">
              Score : {score} / {module.quiz.length}
            </p>
            <p className="text-xs text-foreground/65 mt-1">
              {score >= PASS_THRESHOLD
                ? "Module validé. Vous pouvez continuer."
                : `Score insuffisant — minimum requis ${PASS_THRESHOLD}/${module.quiz.length}. Révisez le contenu et réessayez.`}
            </p>
            {score < PASS_THRESHOLD && (
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-white/15 text-xs text-foreground hover:bg-white/5"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Réessayer le quiz
                </button>
                <button
                  type="button"
                  onClick={() => setStage("content")}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-white/15 text-xs text-foreground hover:bg-white/5"
                >
                  Revoir le contenu
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center gap-2">
        {status !== "valide" && !opened && (
          <button
            type="button"
            onClick={() => { setOpened(true); setStage("content"); }}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md border border-white/15 text-xs text-foreground/85 hover:bg-white/5"
          >
            <PlayCircle className="h-4 w-4" />
            Démarrer le module
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

/** Lit le statut d'un module quel que soit le format (string legacy ou objet enrichi). */
function moduleStatus(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && value.status) return value.status;
  return "a_demarrer";
}

export function TalentStep3MiniFormation({ data, errors, update }) {
  const modules = data.modules || {};
  const setModuleValidated = (id, detail) =>
    update({ ...data, modules: { ...modules, [id]: detail } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="t-h3">Programme de pré-qualification</h3>
        <p className="text-sm text-foreground/60">
          Trois modules de formation à compléter — chacun se valide par un quiz de 3 questions
          ({PASS_THRESHOLD}/3 minimum requis). Vous pouvez réessayer autant que nécessaire.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {MODULES.map((m) => {
          const status = moduleStatus(modules[m.id]);
          return (
            <ModuleCard
              key={m.id}
              module={m}
              status={status}
              onValidate={(detail) => setModuleValidated(m.id, detail)}
            />
          );
        })}
      </div>

      {errors.modules && <p className="text-xs text-red-400">{errors.modules}</p>}
    </div>
  );
}

export function validateTalentStep3(data) {
  const e = {};
  const modules = data.modules || {};
  const allValidated = MODULES.every((m) => moduleStatus(modules[m.id]) === "valide");
  if (!allValidated)
    e.modules = "Vous devez valider les 3 modules (quiz inclus) avant de continuer.";
  return e;
}
