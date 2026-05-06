"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StepProgress } from "@/components/auth/StepProgress";
import { useAuthStore } from "@/stores/authStore";
import {
  profileStep1Schema,
  profileStep2Schema,
  profileStep3EngineerSchema,
  ENGINEER_SKILLS,
} from "@/lib/utils/validation";
import { cn } from "@/lib/utils/cn";

const COUNTRIES = [
  "Côte d'Ivoire",
  "Sénégal",
  "Maroc",
  "Cameroun",
  "République du Congo",
  "Nigeria",
  "Bénin",
  "Togo",
  "France",
  "Autre",
];

const LANGUAGES = ["Français", "Anglais", "Wolof", "Bambara", "Lingala", "Swahili"];

/**
 * Multi-step profile form.
 * Steps depend on the branch (specialist = 2, engineer = 3).
 */
export function ProfileForm() {
  const router = useRouter();
  const branch = useAuthStore((s) => s.branch) ?? "specialist";
  const draft = useAuthStore((s) => s.profileDraft);
  const patch = useAuthStore((s) => s.patchProfileDraft);

  const stepCount = branch === "engineer" ? 3 : 2;
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  return (
    <div className="flex flex-col gap-8">
      <StepProgress total={stepCount} current={step} />

      {step === 0 && (
        <Step1
          defaults={draft}
          onSubmit={(values) => {
            patch(values);
            setStep(1);
          }}
        />
      )}

      {step === 1 && (
        <Step2
          defaults={draft}
          onBack={() => setStep(0)}
          onSubmit={async (values) => {
            patch(values);
            if (branch === "engineer") {
              setStep(2);
            } else {
              await finalize({ ...draft, ...values });
            }
          }}
          ctaLabel={branch === "engineer" ? "Continuer" : "Terminer l'inscription"}
        />
      )}

      {step === 2 && branch === "engineer" && (
        <Step3
          defaults={draft}
          onBack={() => setStep(1)}
          onSubmit={async (values) => {
            patch(values);
            await finalize({ ...draft, ...values });
          }}
        />
      )}

      {serverError && <p className="text-sm text-danger">{serverError}</p>}
    </div>
  );

  async function finalize(payload) {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branch, profile: payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data?.error ?? "Erreur lors de l'enregistrement");
        setSubmitting(false);
        return;
      }
      router.push("/dashboard");
    } catch {
      setServerError("Erreur réseau, réessayez.");
      setSubmitting(false);
    }
  }
}

// ──────────────────────────────────────────────────────────────────────────
function Step1({ defaults, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileStep1Schema),
    defaultValues: defaults,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Prénom"
          {...register("firstName")}
          error={errors.firstName?.message}
          autoComplete="given-name"
        />
        <Input
          label="Nom"
          {...register("lastName")}
          error={errors.lastName?.message}
          autoComplete="family-name"
        />
      </div>
      <Input
        label="Date de naissance"
        type="date"
        {...register("dob")}
        error={errors.dob?.message}
        autoComplete="bday"
      />
      <div className="grid md:grid-cols-[1fr_1fr] gap-4">
        <SelectField
          label="Pays de résidence"
          {...register("country")}
          error={errors.country?.message}
          options={COUNTRIES}
        />
        <Input
          label="Ville"
          {...register("city")}
          error={errors.city?.message}
          autoComplete="address-level2"
        />
      </div>
      <Button type="submit" size="lg" loading={isSubmitting}>
        Continuer
      </Button>
    </form>
  );
}

function Step2({ defaults, onSubmit, onBack, ctaLabel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileStep2Schema),
    defaultValues: defaults,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Input
        label="Dernier diplôme"
        placeholder="Master en informatique, Licence en mathématiques…"
        {...register("lastDiploma")}
        error={errors.lastDiploma?.message}
      />
      <Input
        label="Établissement"
        placeholder="Université, école d'ingénieurs…"
        {...register("institution")}
        error={errors.institution?.message}
      />
      <Input
        label="Année d'obtention"
        type="number"
        min={1960}
        max={new Date().getFullYear() + 1}
        {...register("graduationYear", { valueAsNumber: true })}
        error={errors.graduationYear?.message}
      />
      <div className="flex items-center gap-3 mt-2">
        <Button type="button" variant="ghost" size="lg" onClick={onBack}>
          Retour
        </Button>
        <Button type="submit" size="lg" loading={isSubmitting} className="flex-1">
          {ctaLabel}
        </Button>
      </div>
    </form>
  );
}

function Step3({ defaults, onSubmit, onBack }) {
  const [skills, setSkills] = useState(defaults.skills ?? []);
  const [languages, setLanguages] = useState(defaults.languages ?? []);
  const [yearsXp, setYearsXp] = useState(defaults.yearsXp ?? 0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const toggle = (list, setList, value) => {
    if (list.includes(value)) setList(list.filter((v) => v !== value));
    else setList([...list, value]);
  };

  const handle = async (e) => {
    e.preventDefault();
    const payload = { skills, languages, yearsXp: Number(yearsXp) };
    const parsed = profileStep3EngineerSchema.safeParse(payload);
    if (!parsed.success) {
      const map = {};
      parsed.error.issues.forEach((i) => (map[i.path[0]] = i.message));
      setErrors(map);
      return;
    }
    setErrors({});
    setSubmitting(true);
    await onSubmit(parsed.data);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handle} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-widest text-muted font-medium">
          Compétences déclarées
        </p>
        <div className="flex flex-wrap gap-2">
          {ENGINEER_SKILLS.map((s) => (
            <Chip
              key={s}
              active={skills.includes(s)}
              onClick={() => toggle(skills, setSkills, s)}
            >
              {s}
            </Chip>
          ))}
        </div>
        {errors.skills && <p className="text-sm text-danger">{errors.skills}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-widest text-muted font-medium">
          Langues parlées
        </p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <Chip
              key={l}
              active={languages.includes(l)}
              onClick={() => toggle(languages, setLanguages, l)}
            >
              {l}
            </Chip>
          ))}
        </div>
        {errors.languages && <p className="text-sm text-danger">{errors.languages}</p>}
      </div>

      <Input
        label="Années d'expérience"
        type="number"
        min={0}
        max={60}
        value={yearsXp}
        onChange={(e) => setYearsXp(e.target.value)}
        error={errors.yearsXp}
      />

      <div className="flex items-center gap-3 mt-2">
        <Button type="button" variant="ghost" size="lg" onClick={onBack}>
          Retour
        </Button>
        <Button type="submit" size="lg" loading={submitting} className="flex-1">
          Terminer l&rsquo;inscription
        </Button>
      </div>
    </form>
  );
}

// ──────────────────────────────────────────────────────────────────────────
function SelectField({ label, options, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs uppercase tracking-widest text-muted font-medium">
        {label}
      </label>
      <select
        className={cn(
          "h-11 px-3 rounded-md bg-surface text-foreground border border-border",
          "focus:border-accent focus:outline-none transition-colors duration-200",
          error && "border-danger"
        )}
        {...props}
      >
        <option value="">Sélectionner…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "px-3.5 h-9 rounded-full border text-sm transition-all duration-200",
        active
          ? "bg-accent-muted border-accent text-accent"
          : "bg-surface border-border text-foreground/80 hover:border-border-strong"
      )}
    >
      {children}
    </button>
  );
}
