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
            href="/signup/phone"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Modifier le numéro
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl tracking-tighter leading-tight">
            Entrez le code reçu par SMS.
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
