"use client";

import { Pencil } from "lucide-react";
import { FormCheckboxSingle } from "@/components/forms/shared/FormFieldCheckbox";
import { frenchDate } from "@/components/forms/shared/Calendar";

const SECTOR_LABELS = {
  sante: "Santé",
  droit: "Droit",
  finance: "Finance",
  agritech: "AgriTech",
  autre: "Autre",
};

const PRESTATION_LABELS = {
  annotation: "Annotation brute de données",
  rlhf: "RLHF",
  fine_tuning: "Fine-tuning supervisé",
  recrutement: "Recrutement de talents IA",
  autre: "Autre",
};

const TYPOLOGIE_LABELS = {
  texte: "Texte (NLP)",
  image_video: "Image / Vidéo",
  audio: "Audio",
  conversationnel: "Conversationnel",
  structure: "Données structurées",
};

const VOLUME_LABELS = {
  lt_10k: "< 10 000 unités",
  "10k_100k": "10k — 100k unités",
  "100k_1m": "100k — 1M unités",
  gt_1m: "> 1 M unités",
  non_defini: "À évaluer",
};

const FREQUENCE_LABELS = {
  ponctuel: "Ponctuel",
  mensuel: "Mensuel",
  continu: "Continu",
};

const MODE_LABELS = {
  visio: "Visioconférence",
  telephone: "Téléphone",
  presentiel: "Présentiel · Paris",
};

const LANG_LABELS = { fr: "Français", en: "English" };

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

export function B2BStep4Recap({ data, errors, update, onEditStep }) {
  const set = (k, v) => update({ ...data, [k]: v });
  const cr = data.creneau;
  const dateStr = cr?.date
    ? `${frenchDate(new Date(cr.date + "T12:00"))} · ${cr.time}`
    : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="t-h3">Vérification et confirmation</h3>
        <p className="text-sm text-foreground/60">
          Vérifiez les informations avant de soumettre votre demande.
        </p>
      </div>

      <RecapBlock title="Identification" onEdit={() => onEditStep(0)}>
        <Row label="Société" value={data.raison_sociale} />
        <Row label="Immatricul." value={data.immatriculation} />
        <Row label="Pays" value={data.pays} />
        <Row
          label="Secteur"
          value={
            data.secteur === "autre"
              ? `Autre · ${data.secteur_autre || "—"}`
              : SECTOR_LABELS[data.secteur]
          }
        />
        {data.site_web && <Row label="Site web" value={data.site_web} />}
        <Row
          label="Signataire"
          value={`${data.signataire_prenom || ""} ${data.signataire_nom || ""} — ${data.signataire_fonction || ""}`}
        />
        <Row label="Email" value={data.signataire_email} />
        <Row label="Tél." value={data.signataire_tel} />
      </RecapBlock>

      <RecapBlock title="Spécifications projet" onEdit={() => onEditStep(1)}>
        <Row
          label="Prestations"
          value={
            data.prestations
              ?.map((p) =>
                p === "autre"
                  ? `Autre · ${data.prestation_autre || "—"}`
                  : PRESTATION_LABELS[p]
              )
              .join(", ") || "—"
          }
        />
        <Row
          label="Données"
          value={
            data.typologies?.map((t) => TYPOLOGIE_LABELS[t]).join(", ") || "—"
          }
        />
        <Row label="Volume" value={VOLUME_LABELS[data.volume]} />
        <Row label="Fréquence" value={FREQUENCE_LABELS[data.frequence]} />
        {data.brief && <Row label="Brief" value={data.brief} />}
      </RecapBlock>

      <RecapBlock title="Audit planifié" onEdit={() => onEditStep(2)}>
        <Row label="Créneau" value={dateStr} />
        <Row label="Mode" value={MODE_LABELS[data.mode_rdv]} />
        <Row label="Langue" value={LANG_LABELS[data.langue]} />
      </RecapBlock>

      <div className="border-t border-white/10 pt-5 flex flex-col gap-3">
        <FormCheckboxSingle
          required
          checked={data.consent_rgpd}
          onChange={(v) => set("consent_rgpd", v)}
          error={errors.consent_rgpd}
          label={
            <>
              J&rsquo;accepte que mes données soient traitées conformément au
              RGPD pour l&rsquo;analyse de ma demande.
            </>
          }
        />
        <FormCheckboxSingle
          checked={data.consent_news}
          onChange={(v) => set("consent_news", v)}
          label="Je souhaite recevoir des informations sur les services HID AI."
        />
      </div>
    </div>
  );
}

export function validateB2BStep4(data) {
  const e = {};
  if (!data.consent_rgpd)
    e.consent_rgpd = "Vous devez accepter le traitement RGPD pour soumettre.";
  return e;
}
