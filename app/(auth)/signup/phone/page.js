import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { PhoneForm } from "@/components/auth/PhoneForm";

export const metadata = { title: "Vérification téléphone" };

export default function PhoneSignupPage() {
  return (
    <AuthShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Choix du profil
          </Link>
          <h1 className="t-h3">
            Vérifions votre numéro.
          </h1>
          <p className="text-base text-muted leading-relaxed">
            Nous envoyons un code à 6 chiffres par SMS. Pas de mot de passe,
            pas de spam.
          </p>
        </div>
        <PhoneForm />
      </div>
    </AuthShell>
  );
}
