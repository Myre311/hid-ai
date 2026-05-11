"use client";

import { Target, RefreshCw, Edit3, Info } from "lucide-react";
import { Calendar, DEFAULT_SLOTS_90 } from "@/components/forms/shared/Calendar";
import { FormFieldRadio } from "@/components/forms/shared/FormFieldRadio";
import { FormFieldCheckbox } from "@/components/forms/shared/FormFieldCheckbox";

const DOMAINES = [
  {
    value: "annotation",
    label: "Annotation et Labellisation",
    description: "Bounding boxes, classification sémantique",
    icon: Target,
  },
  {
    value: "rlhf",
    label: "RLHF",
    description: "Classement et affinement de réponses",
    icon: RefreshCw,
  },
  {
    value: "fine_tuning",
    label: "Fine-tuning supervisé",
    description: "Corrections de qualité pour entraînement",
    icon: Edit3,
  },
];

const PREREQUIS = [
  {
    value: "internet",
    label: "Je dispose d'une connexion internet stable",
  },
  { value: "webcam", label: "Je dispose d'une webcam fonctionnelle" },
  {
    value: "calme",
    label:
      "Je m'engage à passer le test dans un environnement calme et privé",
  },
  {
    value: "camera",
    label:
      "J'accepte l'activation de la caméra par le Chatbot Gatekeeper pendant le test",
  },
];

export function TalentStep4EvaluationTechnique({ data, errors, update }) {
  const set = (k, v) => update({ ...data, [k]: v });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="t-h3">Évaluation technique</h3>
        <p className="text-sm text-foreground/60">
          Test calibré 45-60 min — votre score d&rsquo;IA-Native dépend de votre
          persévérance.
        </p>
      </div>

      <div className="rounded-lg border border-accent/30 bg-accent/5 p-5 flex gap-3">
        <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-medium text-foreground">
            Bon à savoir avant de commencer
          </p>
          <ul className="space-y-1 text-foreground/75 text-[13px]">
            <li>· Durée minimale : <strong>45 minutes</strong> à <strong>1 heure</strong></li>
            <li>
              · Vous pouvez <strong>prolonger l&rsquo;épreuve</strong> : plus vous
              traitez de cas avec précision, plus votre score augmente
            </li>
            <li>
              · Domaines testés : Annotation/Labellisation, RLHF, Fine-tuning
              supervisé
            </li>
            <li>
              · Le <strong>Chatbot Gatekeeper</strong> sera activé avec votre{" "}
              <strong>caméra</strong> pour garantir l&rsquo;intégrité du test
            </li>
          </ul>
        </div>
      </div>

      <FormFieldRadio
        label="Domaine d'excellence prioritaire"
        name="domaine"
        required
        variant="cards"
        cols={3}
        options={DOMAINES}
        value={data.domaine}
        onChange={(v) => set("domaine", v)}
        error={errors.domaine}
      />

      <div className="flex flex-col gap-3">
        <h4 className="text-sm text-foreground/70">
          Disponibilité pour l&rsquo;évaluation
          <span className="text-red-400 ml-1">*</span>
        </h4>
        <Calendar
          value={data.creneau_test}
          onChange={(v) => set("creneau_test", v)}
          daysAhead={14}
          slots={DEFAULT_SLOTS_90}
          slotDurationLabel="1h30"
        />
        {errors.creneau_test && (
          <p className="text-xs text-red-400">{errors.creneau_test}</p>
        )}
      </div>

      <FormFieldCheckbox
        label="Pré-requis techniques (à confirmer)"
        name="prerequis"
        required
        options={PREREQUIS}
        value={data.prerequis}
        onChange={(v) => set("prerequis", v)}
        error={errors.prerequis}
      />
    </div>
  );
}

export function validateTalentStep4(data) {
  const e = {};
  if (!data.domaine) e.domaine = "Domaine requis";
  if (!data.creneau_test?.date || !data.creneau_test?.time)
    e.creneau_test = "Sélectionnez une date et un créneau horaire";
  const allChecked =
    data.prerequis?.length === PREREQUIS.length &&
    PREREQUIS.every((p) => data.prerequis.includes(p.value));
  if (!allChecked) e.prerequis = "Tous les pré-requis doivent être confirmés";
  return e;
}
