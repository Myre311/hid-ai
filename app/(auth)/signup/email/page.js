import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { EmailForm } from "@/components/auth/EmailForm";

export const metadata = { title: "Vérification e-mail" };

export default function EmailSignupPage() {
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
          <p className="text-xs uppercase tracking-[0.18em] text-accent font-medium">
            Inscription · Étape 1 sur 3
          </p>
          <h1 className="t-h3">
            Création de compte — vérifiez votre e-mail.
          </h1>
          <p className="text-base text-muted leading-relaxed">
            Nous envoyons un code à 6 chiffres par e-mail pour confirmer votre
            inscription. Pas de mot de passe, pas de spam.
          </p>
        </div>
        <EmailForm />
        <p className="text-sm text-muted text-center">
          Vous avez déjà un compte ?{" "}
          <Link href="/login" className="text-foreground underline-offset-4 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
