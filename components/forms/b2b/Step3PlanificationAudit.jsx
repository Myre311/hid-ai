"use client";

import { Calendar } from "@/components/forms/shared/Calendar";
import { FormFieldRadio } from "@/components/forms/shared/FormFieldRadio";

const MODES_RDV = [
  { value: "visio", label: "Visioconférence (lien envoyé après confirmation)" },
  { value: "telephone", label: "Téléphone" },
  { value: "presentiel", label: "Présentiel à Paris" },
];

const LANGUES = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
];

export function B2BStep3PlanificationAudit({ data, errors, update }) {
  const set = (k, v) => update({ ...data, [k]: v });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="t-h3">Planifions votre audit</h3>
        <p className="text-sm text-foreground/60">
          Réservez un créneau avec nos ingénieurs pour analyser vos données
          (heure de Paris).
        </p>
      </div>

      <Calendar
        value={data.creneau}
        onChange={(v) => set("creneau", v)}
        daysAhead={14}
      />
      {errors.creneau && (
        <p className="text-xs text-red-400">{errors.creneau}</p>
      )}

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <FormFieldRadio
          label="Mode de RDV"
          name="mode_rdv"
          required
          options={MODES_RDV}
          value={data.mode_rdv}
          onChange={(v) => set("mode_rdv", v)}
          error={errors.mode_rdv}
        />
        <FormFieldRadio
          label="Langue préférée"
          name="langue"
          required
          options={LANGUES}
          value={data.langue}
          onChange={(v) => set("langue", v)}
          error={errors.langue}
        />
      </div>
    </div>
  );
}

export function validateB2BStep3(data) {
  const e = {};
  if (!data.creneau?.date || !data.creneau?.time)
    e.creneau = "Sélectionnez une date et un créneau horaire";
  if (!data.mode_rdv) e.mode_rdv = "Mode de RDV requis";
  if (!data.langue) e.langue = "Langue requise";
  return e;
}
