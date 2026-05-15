import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { VerifyForm } from "@/components/auth/VerifyForm";

export const metadata = { title: "Vérification du code" };

export default function VerifySignupPage() {
  return (
    <AuthShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Link
            href="/signup/email"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Modifier l&rsquo;e-mail
          </Link>
          <p className="text-xs uppercase tracking-[0.18em] text-accent font-medium">
            Inscription · Étape 2 sur 3
          </p>
          <h1 className="t-h3">
            Entrez le code reçu par e-mail.
          </h1>
          <p className="text-base text-muted leading-relaxed">
            Le code expire dans 5 minutes. Vous pouvez le coller en une fois.
          </p>
        </div>
        <VerifyForm />
      </div>
    </AuthShell>
  );
}
