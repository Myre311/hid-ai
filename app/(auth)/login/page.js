import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { GoogleButton } from "@/components/auth/GoogleButton";

export const metadata = { title: "Connexion" };

export default function LoginPage({ searchParams }) {
  const error = searchParams?.error;

  return (
    <AuthShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="t-h3">
            Connexion.
          </h1>
          <p className="text-base text-muted leading-relaxed">
            Entrez votre adresse e-mail. Nous envoyons un code de vérification
            par e-mail.
          </p>
        </div>

        {error === "oauth" && (
          <p className="text-sm text-danger bg-danger/10 border border-danger/25 rounded-md px-3 py-2 text-center">
            La connexion Google a échoué. Réessayez ou utilisez votre e-mail.
          </p>
        )}

        <LoginForm />

        <div className="flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-[0.18em] text-muted-strong">
            ou
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <GoogleButton />

        <p className="text-sm text-muted text-center">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="text-foreground underline-offset-4 hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
