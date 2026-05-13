"use client";

import { Pencil } from "lucide-react";
import { FormCheckboxSingle } from "@/components/forms/shared/FormFieldCheckbox";

const METIER_LABELS = {
  specialist: "AI Specialist",
  engineer: "AI Engineer",
};

const NIVEAU_LABELS = {
  bac: "Bac",
  "bac+2": "Bac+2",
  "bac+3": "Bac+3 / Licence",
  "bac+5": "Bac+5 / Master",
  doctorat: "Doctorat",
  autodidacte: "Autodidacte",
};

const DOC_LABELS = {
  cni: "Carte nationale d'identité",
  passeport: "Passeport",
  permis: "Permis de conduire",
};

const DOMAINE_LABELS = {
  annotation: "Annotation et Labellisation",
  rlhf: "RLHF",
  fine_tuning: "Fine-tuning supervisé",
};

function RecapBlock({ title, onEdit, children }) {
  return (
    <div className="rounded-lg bg-[#1A1A1A] border border-white/10 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs uppercase tracking-[0.18em] text-foreground/60">
          {title}
        </h4>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
        >
          <Pencil className="h-3 w-3" />
          Modifier
        </button>
      </div>
      <div className="text-sm text-foreground/85 flex flex-col gap-1">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-2">
      <span className="text-foreground/50">{label}</span>
      <span className="text-foreground/90 break-words">{value || "—"}</span>
    </div>
  );
}

export function TalentStep5Activation({ data, errors, update, onEditStep }) {
  const set = (k, v) => update({ ...data, [k]: v });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="t-h3">Finalisation de votre inscription</h3>
        <p className="text-sm text-foreground/60">
          Vérifiez vos informations avant l&rsquo;activation de votre profil.
        </p>
      </div>

      <RecapBlock title="Identification" onEdit={() => onEditStep(0)}>
        <Row label="Nom" value={`${data.prenom || ""} ${data.nom || ""}`} />
        <Row label="E-mail" value={data.email} />
        <Row label="Téléphone" value={data.telephone} />
        <Row
          label="Localisation"
          value={[data.ville, data.pays].filter(Boolean).join(" · ")}
        />
        <Row label="Métier" value={METIER_LABELS[data.metier]} />
        <Row label="Études" value={NIVEAU_LABELS[data.niveau_etudes]} />
        {data.competences?.length > 0 && (
          <Row label="Compétences" value={data.competences.join(", ")} />
        )}
      </RecapBlock>

      <RecapBlock title="Vérification d'identité (KYC)" onEdit={() => onEditStep(1)}>
        <Row label="Document" value={DOC_LABELS[data.doc_type]} />
        <Row label="Recto" value={data.doc_recto?.name} />
        {data.doc_verso && <Row label="Verso" value={data.doc_verso.name} />}
        <Row label="Selfie" value={data.selfie?.name} />
        {data.antecedents && (
          <Row label="Antécédents" value={data.antecedents} />
        )}
      </RecapBlock>

      <RecapBlock title="Pré-qualification" onEdit={() => onEditStep(2)}>
        <Row label="Modules" value="3 / 3 validés" />
      </RecapBlock>

      <RecapBlock title="Évaluation technique" onEdit={() => onEditStep(3)}>
        <Row label="Domaine" value={DOMAINE_LABELS[data.domaine]} />
      </RecapBlock>

      <div className="border-t border-white/10 pt-5 flex flex-col gap-3">
        <FormCheckboxSingle
          required
          checked={data.consent_cgu}
          onChange={(v) => set("consent_cgu", v)}
          error={errors.consent_cgu}
          label="J'accepte les Conditions Générales d'Utilisation de la plateforme HID AI."
        />
        <FormCheckboxSingle
          required
          checked={data.consent_rgpd}
          onChange={(v) => set("consent_rgpd", v)}
          error={errors.consent_rgpd}
          label="J'accepte que mes données personnelles soient traitées conformément au RGPD."
        />
        <FormCheckboxSingle
          required
          checked={data.consent_ethique}
          onChange={(v) => set("consent_ethique", v)}
          error={errors.consent_ethique}
          label="Je m'engage à respecter les standards de qualité et d'éthique de HID AI."
        />
        <FormCheckboxSingle
          checked={data.consent_news}
          onChange={(v) => set("consent_news", v)}
          label="Je souhaite recevoir les actualités et opportunités HID AI."
        />
      </div>
    </div>
  );
}

export function validateTalentStep5(data) {
  const e = {};
  if (!data.consent_cgu) e.consent_cgu = "Acceptation des CGU requise";
  if (!data.consent_rgpd) e.consent_rgpd = "Acceptation RGPD requise";
  if (!data.consent_ethique)
    e.consent_ethique = "Engagement éthique requis";
  return e;
}
