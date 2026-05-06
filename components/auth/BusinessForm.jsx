"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StepProgress } from "@/components/auth/StepProgress";
import { OtpInput } from "@/components/ui/OtpInput";
import { useAuthStore } from "@/stores/authStore";
import {
  businessStep1Schema,
  businessStep2Schema,
  businessStep3Schema,
  SERVICE_TYPES,
  otpSchema,
} from "@/lib/utils/validation";
import { cn } from "@/lib/utils/cn";
import { useOtpTimer } from "@/hooks/useOtpTimer";

const PhoneInput = dynamic(
  () => import("react-phone-number-input").then((m) => m.default),
  { ssr: false, loading: () => <div className="h-11 rounded-md bg-surface border border-border animate-pulse" /> }
);

const SECTORS = [
  "IA / Recherche",
  "FinTech",
  "Santé / Biotech",
  "E-commerce / Marketplace",
  "Industrie",
  "Mobilité",
  "Éducation",
  "Service public",
  "Autre",
];

const SIZES = ["1-10", "11-50", "51-200", "201-1000", "1000+"];

const SERVICE_LABELS = {
  annotation: "Annotation de données",
  rlhf: "RLHF",
  recrutement: "Recrutement",
};

export function BusinessForm() {
  const router = useRouter();
  const draft = useAuthStore((s) => s.businessDraft);
  const patch = useAuthStore((s) => s.patchBusinessDraft);
  const setPhone = useAuthStore((s) => s.setPhone);

  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <StepProgress total={3} current={step} />

      {step === 0 && (
        <CompanyStep
          defaults={draft}
          onSubmit={(values) => {
            patch(values);
            setStep(1);
          }}
        />
      )}

      {step === 1 && (
        <ContactOtpStep
          defaults={draft}
          onBack={() => setStep(0)}
          onSubmit={(values) => {
            patch(values);
            setPhone(values.phone);
            setStep(2);
          }}
          otpSent={otpSent}
          setOtpSent={setOtpSent}
          otpVerified={otpVerified}
          setOtpVerified={setOtpVerified}
        />
      )}

      {step === 2 && (
        <ServicesStep
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
    setServerError(null);
    try {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branch: "business", profile: payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data?.error ?? "Erreur d'enregistrement");
        return;
      }
      router.push("/dashboard");
    } catch {
      setServerError("Erreur réseau, réessayez.");
    }
  }
}

// ─── Step 1 ────────────────────────────────────────────────────────────────
function CompanyStep({ defaults, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(businessStep1Schema), defaultValues: defaults });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Input
        label="Raison sociale"
        {...register("companyName")}
        error={errors.companyName?.message}
        autoComplete="organization"
      />
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="SIREN / N° d'enregistrement"
          {...register("registrationNumber")}
          error={errors.registrationNumber?.message}
        />
        <SelectField
          label="Secteur"
          options={SECTORS}
          {...register("sector")}
          error={errors.sector?.message}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Pays"
          {...register("country")}
          error={errors.country?.message}
          autoComplete="country-name"
        />
        <SelectField
          label="Taille"
          options={SIZES}
          {...register("size")}
          error={errors.size?.message}
        />
      </div>
      <Button type="submit" size="lg" loading={isSubmitting}>
        Continuer
      </Button>
    </form>
  );
}

// ─── Step 2 ────────────────────────────────────────────────────────────────
function ContactOtpStep({
  defaults,
  onSubmit,
  onBack,
  otpSent,
  setOtpSent,
  otpVerified,
  setOtpVerified,
}) {
  const [email, setEmail] = useState(defaults.email ?? "");
  const [phone, setPhoneVal] = useState(defaults.phone ?? "");
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const expiry = useOtpTimer({ initialSeconds: 300, autoStart: false });

  const sendOtp = async () => {
    setError(null);
    const parsed = businessStep2Schema.safeParse({ email, phone });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Champs invalides");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: parsed.data.phone, branch: "business" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Envoi impossible");
      } else {
        setOtpSent(true);
        expiry.reset();
      }
    } finally {
      setBusy(false);
    }
  };

  const verify = async (final = code) => {
    setError(null);
    const parsed = otpSchema.safeParse(final);
    if (!parsed.success) {
      setError("Code à 6 chiffres requis");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: parsed.data, branch: "business" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Code invalide");
      } else {
        setOtpVerified(true);
      }
    } finally {
      setBusy(false);
    }
  };

  const next = () => {
    if (!otpVerified) {
      setError("Vérifiez votre numéro avant de continuer.");
      return;
    }
    onSubmit({ email, phone });
  };

  return (
    <div className="flex flex-col gap-6">
      <Input
        label="E-mail professionnel"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        disabled={otpVerified}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest text-muted font-medium">
          Téléphone professionnel
        </label>
        <div className="hid-phone-input">
          <PhoneInput
            international
            countryCallingCodeEditable={false}
            defaultCountry="FR"
            value={phone}
            onChange={setPhoneVal}
            placeholder="+33 6 00 00 00 00"
            disabled={otpVerified}
          />
        </div>
      </div>

      {!otpSent && (
        <Button type="button" size="lg" onClick={sendOtp} loading={busy} disabled={busy}>
          Envoyer le code de vérification
        </Button>
      )}

      {otpSent && !otpVerified && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted text-center">
            Code envoyé. Valide {expiry.display}.
          </p>
          <OtpInput
            length={6}
            value={code}
            onChange={setCode}
            onComplete={(c) => verify(c)}
            error={Boolean(error)}
            disabled={busy}
          />
          <Button
            type="button"
            size="lg"
            onClick={() => verify()}
            disabled={busy || code.length < 6}
            loading={busy}
          >
            Vérifier
          </Button>
        </div>
      )}

      {otpVerified && (
        <p className="text-sm text-success">
          Numéro vérifié. Vous pouvez continuer.
        </p>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="lg" onClick={onBack}>
          Retour
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={next}
          disabled={!otpVerified}
          className="flex-1"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
}

// ─── Step 3 ────────────────────────────────────────────────────────────────
function ServicesStep({ defaults, onSubmit, onBack }) {
  const [serviceTypes, setServiceTypes] = useState(defaults.serviceTypes ?? []);
  const [errMsg, setErrMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const toggle = (val) => {
    setServiceTypes((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );
  };

  const handle = async (e) => {
    e.preventDefault();
    const parsed = businessStep3Schema.safeParse({ serviceTypes });
    if (!parsed.success) {
      setErrMsg("Sélectionnez au moins un service.");
      return;
    }
    setErrMsg(null);
    setSubmitting(true);
    await onSubmit(parsed.data);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handle} className="flex flex-col gap-6" noValidate>
      <p className="text-xs uppercase tracking-widest text-muted font-medium">
        Services recherchés
      </p>
      <div className="flex flex-wrap gap-2">
        {SERVICE_TYPES.map((s) => (
          <Chip
            key={s}
            active={serviceTypes.includes(s)}
            onClick={() => toggle(s)}
          >
            {SERVICE_LABELS[s]}
          </Chip>
        ))}
      </div>
      {errMsg && <p className="text-sm text-danger">{errMsg}</p>}

      <p className="text-sm text-muted bg-surface border border-border rounded-md p-4 leading-relaxed">
        Validation manuelle KYB sous 48 heures ouvrées. Vous recevrez un e-mail
        une fois votre compte activé.
      </p>

      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="lg" onClick={onBack}>
          Retour
        </Button>
        <Button type="submit" size="lg" loading={submitting} className="flex-1">
          Soumettre la demande
        </Button>
      </div>
    </form>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────
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
