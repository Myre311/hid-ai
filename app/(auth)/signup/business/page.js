import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BusinessForm } from "@/components/auth/BusinessForm";

export const metadata = { title: "Inscription entreprise" };

export default function BusinessSignupPage() {
  return (
    <section className="flex-1 flex flex-col py-12 md:py-20">
      <Container className="max-w-2xl flex flex-col gap-8">
        <header className="flex flex-col gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Choix du profil
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl tracking-tighter leading-tight">
            Création de compte entreprise.
          </h1>
          <p className="text-base text-muted leading-relaxed">
            Trois étapes : votre société, vos contacts vérifiés, vos besoins.
            Validation KYB sous 48h.
          </p>
        </header>
        <BusinessForm />
      </Container>
    </section>
  );
}
