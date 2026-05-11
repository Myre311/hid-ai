"use client";

import { Star, Code2 } from "lucide-react";
import { FormFieldText } from "@/components/forms/shared/FormFieldText";
import { FormFieldSelect } from "@/components/forms/shared/FormFieldSelect";
import { FormFieldRadio } from "@/components/forms/shared/FormFieldRadio";
import { FormFieldCheckbox } from "@/components/forms/shared/FormFieldCheckbox";

const COUNTRIES = [
  "Côte d'Ivoire",
  "Sénégal",
  "Maroc",
  "Cameroun",
  "Congo Brazzaville",
  "Bénin",
  "Togo",
  "Nigeria",
  "Tunisie",
  "Algérie",
  "France",
  "Belgique",
  "Suisse",
  "Canada",
  "Autre",
].map((c) => ({ value: c, label: c }));

const NIVEAUX = [
  { value: "bac", label: "Bac" },
  { value: "bac+2", label: "Bac+2" },
  { value: "bac+3", label: "Bac+3 / Licence" },
  { value: "bac+5", label: "Bac+5 / Master" },
  { value: "doctorat", label: "Doctorat" },
  { value: "autodidacte", label: "Autodidacte" },
];

const METIERS = [
  {
    value: "specialist",
    label: "AI Specialist",
    description: "Annotation · Labellisation · RLHF",
    icon: Star,
  },
  {
    value: "engineer",
    label: "AI Engineer",
    description: "NLP · Vision · Optimisation",
    icon: Code2,
  },
];

const COMPETENCES = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "bdd", label: "Bases de données" },
  { value: "annotation_tools", label: "Outils d'annotation (Labelbox, V7, …)" },
  { value: "nlp", label: "NLP" },
  { value: "vision", label: "Computer Vision" },
  { value: "ml", label: "Machine Learning" },
  { value: "aucune", label: "Aucune (formation prévue)" },
];

export function TalentStep1Identification({ data, errors, update }) {
  const set = (k, v) => update({ ...data, [k]: v });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="t-h3">Créez votre profil</h3>
        <p className="text-sm text-foreground/60">
          Vos informations de base pour rejoindre HID AI.
        </p>
      </div>

      <h4 className="text-xs uppercase tracking-[0.18em] text-foreground/60">
        Données personnelles
      </h4>

      <div className="grid md:grid-cols-2 gap-4">
        <FormFieldText
          label="Prénom"
          name="prenom"
          required
          autoComplete="given-name"
          value={data.prenom}
          onChange={(v) => set("prenom", v)}
          error={errors.prenom}
        />
        <FormFieldText
          label="Nom"
          name="nom"
          required
          autoComplete="family-name"
          value={data.nom}
          onChange={(v) => set("nom", v)}
          error={errors.nom}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <FormFieldText
          label="Date de naissance"
          name="date_naissance"
          type="date"
          required
          value={data.date_naissance}
          onChange={(v) => set("date_naissance", v)}
          error={errors.date_naissance}
        />
        <FormFieldText
          label="Téléphone"
          name="telephone"
          type="tel"
          required
          placeholder="+225 …"
          autoComplete="tel"
          inputMode="tel"
          hint="Format international"
          value={data.telephone}
          onChange={(v) => set("telephone", v)}
          error={errors.telephone}
        />
      </div>

      <FormFieldText
        label="E-mail"
        name="email"
        type="email"
        required
        autoComplete="email"
        value={data.email}
        onChange={(v) => set("email", v)}
        error={errors.email}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <FormFieldSelect
          label="Pays de résidence"
          name="pays"
          required
          options={COUNTRIES}
          value={data.pays}
          onChange={(v) => set("pays", v)}
          error={errors.pays}
        />
        <FormFieldText
          label="Ville"
          name="ville"
          required
          autoComplete="address-level2"
          value={data.ville}
          onChange={(v) => set("ville", v)}
          error={errors.ville}
        />
      </div>

      <FormFieldRadio
        label="Métier ciblé"
        name="metier"
        required
        variant="cards"
        cols={2}
        options={METIERS}
        value={data.metier}
        onChange={(v) => set("metier", v)}
        error={errors.metier}
      />

      <FormFieldSelect
        label="Niveau d'études"
        name="niveau_etudes"
        required
        options={NIVEAUX}
        value={data.niveau_etudes}
        onChange={(v) => set("niveau_etudes", v)}
        error={errors.niveau_etudes}
      />

      <FormFieldCheckbox
        label="Compétences techniques actuelles"
        name="competences"
        hint="Optionnel — sélectionnez celles qui s'appliquent"
        options={COMPETENCES}
        value={data.competences}
        onChange={(v) => set("competences", v)}
      />
    </div>
  );
}

export function validateTalentStep1(data) {
  const e = {};
  if (!data.prenom?.trim()) e.prenom = "Prénom requis";
  if (!data.nom?.trim()) e.nom = "Nom requis";
  if (!data.date_naissance) {
    e.date_naissance = "Date de naissance requise";
  } else {
    const d = new Date(data.date_naissance);
    const age = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (age < 18) e.date_naissance = "Vous devez avoir au moins 18 ans.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || ""))
    e.email = "E-mail invalide";
  if (!/^[+]?[\d\s().-]{6,}$/.test(data.telephone || ""))
    e.telephone = "Téléphone invalide";
  if (!data.pays) e.pays = "Pays requis";
  if (!data.ville?.trim()) e.ville = "Ville requise";
  if (!data.metier) e.metier = "Métier requis";
  if (!data.niveau_etudes) e.niveau_etudes = "Niveau requis";
  return e;
}
