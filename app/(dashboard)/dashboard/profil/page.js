import { redirect } from "next/navigation";
import { User, Mail, Phone, MapPin, GraduationCap } from "lucide-react";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { KycUploadSection } from "@/components/dashboard/KycUploadSection";

export const metadata = { title: "Profil · HID AI" };

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

export default async function ProfilPage() {
  const userClient = createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();

  if (!user) redirect("/login");

  const service = createServiceClient();
  let inscription = null;
  if (user.email) {
    const { data } = await service
      .from("inscriptions_talents")
      .select("*")
      .ilike("email", user.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    inscription = data;
  }

  if (!inscription) {
    return (
      <div className="max-w-3xl">
        <h1 className="t-h2-md mb-3">Profil</h1>
        <p className="text-foreground/70">
          Aucun dossier d&rsquo;inscription trouvé pour cet email.
        </p>
      </div>
    );
  }

  // État KYC : validé (admin) / en cours (pièces déposées) / à fournir
  const kycState =
    inscription.status === "validated"
      ? "validated"
      : inscription.doc_recto_path
        ? "pending"
        : "todo";

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
          Profil candidat
        </p>
        <h1 className="t-h2-md">
          {inscription.prenom} {inscription.nom}
        </h1>
        <p className="text-sm text-foreground/55">
          Référence : {inscription.reference}
        </p>
      </header>

      <section className="rounded-lg border border-white/10 bg-surface p-5 flex flex-col gap-4">
        <h2 className="text-xs uppercase tracking-[0.18em] text-foreground/50">
          Identité & contact
        </h2>
        <Row Icon={User} label="Nom complet" value={`${inscription.prenom} ${inscription.nom}`} />
        <Row Icon={Mail} label="Email" value={inscription.email} />
        <Row Icon={Phone} label="Téléphone" value={inscription.telephone} />
        <Row
          Icon={MapPin}
          label="Localisation"
          value={`${inscription.ville} · ${inscription.pays}`}
        />
        <Row
          Icon={GraduationCap}
          label="Niveau d'études"
          value={NIVEAU_LABELS[inscription.niveau_etudes] || inscription.niveau_etudes}
        />
      </section>

      <KycUploadSection state={kycState} />

      <section className="rounded-lg border border-white/10 bg-surface p-5 flex flex-col gap-4">
        <h2 className="text-xs uppercase tracking-[0.18em] text-foreground/50">
          Statut
        </h2>
        <Row
          Icon={User}
          label="Métier ciblé"
          value={METIER_LABELS[inscription.metier]}
        />
        {inscription.competences?.length > 0 && (
          <div>
            <span className="text-xs text-foreground/40 block mb-2">
              Compétences déclarées
            </span>
            <div className="flex flex-wrap gap-2">
              {inscription.competences.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center text-xs px-2.5 py-1 rounded-full border border-white/15 bg-surface-elevated text-foreground/85"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Row({ Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-surface-elevated text-accent flex-shrink-0">
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs text-foreground/40">{label}</span>
        <span className="text-sm text-foreground/90 break-words">
          {value || "—"}
        </span>
      </div>
    </div>
  );
}
