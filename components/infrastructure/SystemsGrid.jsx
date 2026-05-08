import { Activity, ShieldCheck, Lock, Network, BarChart3 } from "lucide-react";

const SYSTEMS = [
  {
    Icon: Activity,
    title: "Flow Manager AI",
    body: "Surveille la performance des AI Specialists et des AI Engineers et calcule les points toutes les 10 minutes.",
  },
  {
    Icon: ShieldCheck,
    title: "Chatbot Gatekeeper",
    body: "Évalue en temps réel avec la caméra activée pour éviter la tricherie.",
  },
  {
    Icon: Lock,
    title: "Data Gateway sécurisé",
    body: "Pipeline de données chiffré, conforme RGPD, audit trail immuable.",
  },
  {
    Icon: Network,
    title: "Algorithme de matching",
    body: "Mise en relation prédictive entre talents certifiés et missions client en moins de 5 secondes.",
  },
  {
    Icon: BarChart3,
    title: "Système de Scoring Dynamique",
    body: "Permet d'évaluer en situation réelle les compétences et performances des talents.",
  },
];

export function SystemsGrid() {
  return (
    <div className="grid md:grid-cols-2 gap-5 md:gap-6">
      {SYSTEMS.map((s) => (
        <article
          key={s.title}
          className="bg-surface border border-border rounded-lg p-7 md:p-8 transition-colors duration-300 hover:border-border-strong"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-surface-elevated text-accent">
            <s.Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="mt-5 t-h3 leading-tight">
            {s.title}
          </h3>
          <p className="mt-3 text-sm md:text-base text-muted leading-relaxed">
            {s.body}
          </p>
        </article>
      ))}
    </div>
  );
}
