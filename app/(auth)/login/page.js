import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Connexion" };

export default function LoginPage() {
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
        <LoginForm />
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
