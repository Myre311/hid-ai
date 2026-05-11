"use client";

import { FileText, Eye, Mic, MessageSquare, BarChart3 } from "lucide-react";
import { FormFieldCheckbox } from "@/components/forms/shared/FormFieldCheckbox";
import { FormFieldRadio } from "@/components/forms/shared/FormFieldRadio";
import { FormFieldText } from "@/components/forms/shared/FormFieldText";

const PRESTATIONS = [
  { value: "annotation", label: "Annotation brute de données" },
  { value: "rlhf", label: "RLHF (Reinforcement Learning from Human Feedback)" },
  { value: "fine_tuning", label: "Fine-tuning supervisé" },
  { value: "recrutement", label: "Recrutement de talents IA" },
  { value: "autre", label: "Autre (préciser)" },
];

const TYPOLOGIES = [
  { value: "texte", label: "Texte (NLP)", icon: FileText },
  { value: "image_video", label: "Image / Vidéo (Computer Vision)", icon: Eye },
  { value: "audio", label: "Audio", icon: Mic },
  { value: "conversationnel", label: "Conversationnel (chatbots)", icon: MessageSquare },
  { value: "structure", label: "Données structurées", icon: BarChart3 },
];

const VOLUMES = [
  { value: "lt_10k", label: "< 10 000 unités" },
  { value: "10k_100k", label: "10 000 — 100 000 unités" },
  { value: "100k_1m", label: "100 000 — 1 M unités" },
  { value: "gt_1m", label: "> 1 M unités" },
  { value: "non_defini", label: "Non défini / À évaluer ensemble" },
];

const FREQUENCES = [
  { value: "ponctuel", label: "Ponctuel" },
  { value: "mensuel", label: "Mensuel" },
  { value: "continu", label: "Continu" },
];

export function B2BStep2Specifications({ data, errors, update }) {
  const set = (k, v) => update({ ...data, [k]: v });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="t-h3">Spécifications de votre projet</h3>
        <p className="text-sm text-foreground/60">
          Définition des données et du périmètre de prestation.
        </p>
      </div>

      <FormFieldCheckbox
        label="Type de prestation requise"
        name="prestations"
        required
        options={PRESTATIONS}
        value={data.prestations}
        onChange={(v) => set("prestations", v)}
        error={errors.prestations}
      />

      {data.prestations?.includes("autre") && (
        <FormFieldText
          label="Précisez la prestation souhaitée"
          name="prestation_autre"
          required
          value={data.prestation_autre}
          onChange={(v) => set("prestation_autre", v)}
          error={errors.prestation_autre}
        />
      )}

      <FormFieldCheckbox
        label="Typologie des données à traiter"
        name="typologies"
        required
        variant="cards"
        cols={2}
        options={TYPOLOGIES}
        value={data.typologies}
        onChange={(v) => set("typologies", v)}
        error={errors.typologies}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <FormFieldRadio
          label="Volume estimé"
          name="volume"
          required
          options={VOLUMES}
          value={data.volume}
          onChange={(v) => set("volume", v)}
          error={errors.volume}
        />
        <FormFieldRadio
          label="Fréquence du besoin"
          name="frequence"
          required
          options={FREQUENCES}
          value={data.frequence}
          onChange={(v) => set("frequence", v)}
          error={errors.frequence}
        />
      </div>

      <FormFieldText
        label="Brief libre (optionnel)"
        name="brief"
        textarea
        rows={5}
        maxLength={1000}
        placeholder="Décrivez en quelques lignes le contexte de votre projet et vos objectifs (optionnel)"
        value={data.brief}
        onChange={(v) => set("brief", v)}
        error={errors.brief}
      />
    </div>
  );
}

export function validateB2BStep2(data) {
  const e = {};
  if (!data.prestations || data.prestations.length === 0)
    e.prestations = "Sélectionnez au moins une prestation";
  if (data.prestations?.includes("autre") && !data.prestation_autre?.trim())
    e.prestation_autre = "Précisez la prestation";
  if (!data.typologies || data.typologies.length === 0)
    e.typologies = "Sélectionnez au moins une typologie";
  if (!data.volume) e.volume = "Volume requis";
  if (!data.frequence) e.frequence = "Fréquence requise";
  return e;
}
