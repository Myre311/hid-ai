"use client";

import { Heart, Scale, Coins, Sprout, MoreHorizontal } from "lucide-react";
import { FormFieldText } from "@/components/forms/shared/FormFieldText";
import { FormFieldSelect } from "@/components/forms/shared/FormFieldSelect";
import { FormFieldRadio } from "@/components/forms/shared/FormFieldRadio";

const COUNTRIES = [
  "France",
  "Belgique",
  "Suisse",
  "Luxembourg",
  "Côte d'Ivoire",
  "Sénégal",
  "Maroc",
  "Tunisie",
  "Algérie",
  "Cameroun",
  "Congo",
  "Royaume-Uni",
  "Allemagne",
  "Espagne",
  "Italie",
  "États-Unis",
  "Canada",
  "Autre",
].map((c) => ({ value: c, label: c }));

const SECTORS = [
  { value: "sante", label: "Santé", icon: Heart },
  { value: "droit", label: "Droit", icon: Scale },
  { value: "finance", label: "Finance", icon: Coins },
  { value: "agritech", label: "AgriTech", icon: Sprout },
  { value: "autre", label: "Autre", icon: MoreHorizontal },
];

export function B2BStep1Identification({ data, errors, update }) {
  const set = (k, v) => update({ ...data, [k]: v });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="t-h3">Identification de votre entreprise</h3>
        <p className="text-sm text-foreground/60">
          Validation administrative et juridique de votre structure.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <FormFieldText
          label="Raison sociale"
          name="raison_sociale"
          required
          value={data.raison_sociale}
          onChange={(v) => set("raison_sociale", v)}
          error={errors.raison_sociale}
          autoComplete="organization"
        />
        <FormFieldText
          label="Numéro d'immatriculation"
          name="immatriculation"
          required
          hint="SIREN, SIRET ou équivalent"
          value={data.immatriculation}
          onChange={(v) => set("immatriculation", v)}
          error={errors.immatriculation}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <FormFieldSelect
          label="Pays du siège social"
          name="pays"
          required
          options={COUNTRIES}
          value={data.pays}
          onChange={(v) => set("pays", v)}
          error={errors.pays}
        />
        <FormFieldText
          label="Site web"
          name="site_web"
          type="url"
          placeholder="https://"
          value={data.site_web}
          onChange={(v) => set("site_web", v)}
          error={errors.site_web}
        />
      </div>

      <FormFieldRadio
        label="Secteur d'activité"
        name="secteur"
        required
        variant="cards"
        cols={3}
        options={SECTORS}
        value={data.secteur}
        onChange={(v) => set("secteur", v)}
        error={errors.secteur}
      />

      {data.secteur === "autre" && (
        <FormFieldText
          label="Précisez votre secteur"
          name="secteur_autre"
          required
          value={data.secteur_autre}
          onChange={(v) => set("secteur_autre", v)}
          error={errors.secteur_autre}
        />
      )}

      {/* Représentation légale */}
      <div className="border-t border-white/10 pt-6 mt-2 flex flex-col gap-4">
        <h4 className="text-sm uppercase tracking-[0.18em] text-foreground/60">
          Représentation légale
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <FormFieldText
            label="Prénom"
            name="signataire_prenom"
            required
            autoComplete="given-name"
            value={data.signataire_prenom}
            onChange={(v) => set("signataire_prenom", v)}
            error={errors.signataire_prenom}
          />
          <FormFieldText
            label="Nom"
            name="signataire_nom"
            required
            autoComplete="family-name"
            value={data.signataire_nom}
            onChange={(v) => set("signataire_nom", v)}
            error={errors.signataire_nom}
          />
        </div>
        <FormFieldText
          label="Fonction"
          name="signataire_fonction"
          required
          placeholder="Ex. Directeur des opérations"
          value={data.signataire_fonction}
          onChange={(v) => set("signataire_fonction", v)}
          error={errors.signataire_fonction}
        />
        <div className="grid md:grid-cols-2 gap-4">
          <FormFieldText
            label="Email professionnel"
            name="signataire_email"
            type="email"
            required
            autoComplete="email"
            value={data.signataire_email}
            onChange={(v) => set("signataire_email", v)}
            error={errors.signataire_email}
          />
          <FormFieldText
            label="Téléphone professionnel"
            name="signataire_tel"
            type="tel"
            required
            placeholder="+33 …"
            inputMode="tel"
            autoComplete="tel"
            hint="Format international"
            value={data.signataire_tel}
            onChange={(v) => set("signataire_tel", v)}
            error={errors.signataire_tel}
          />
        </div>
      </div>
    </div>
  );
}

export function validateB2BStep1(data) {
  const e = {};
  if (!data.raison_sociale || data.raison_sociale.trim().length < 2)
    e.raison_sociale = "Min. 2 caractères";
  if (!data.immatriculation || data.immatriculation.trim().length < 9)
    e.immatriculation = "Min. 9 caractères";
  if (!data.pays) e.pays = "Pays requis";
  if (!data.secteur) e.secteur = "Secteur requis";
  if (data.secteur === "autre" && !data.secteur_autre?.trim())
    e.secteur_autre = "Précisez votre secteur";
  if (data.site_web && !/^https?:\/\/.+\..+/i.test(data.site_web))
    e.site_web = "URL invalide (commencer par https://)";
  if (!data.signataire_prenom?.trim())
    e.signataire_prenom = "Prénom requis";
  if (!data.signataire_nom?.trim()) e.signataire_nom = "Nom requis";
  if (!data.signataire_fonction?.trim())
    e.signataire_fonction = "Fonction requise";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.signataire_email || ""))
    e.signataire_email = "E-mail invalide";
  if (!/^[+]?[\d\s().-]{6,}$/.test(data.signataire_tel || ""))
    e.signataire_tel = "Téléphone invalide";
  return e;
}
