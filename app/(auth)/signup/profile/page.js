import { Container } from "@/components/ui/Container";
import { ProfileForm } from "@/components/auth/ProfileForm";

export const metadata = { title: "Compléter votre profil" };

export default function ProfileSignupPage() {
  return (
    <section className="flex-1 flex flex-col py-12 md:py-20">
      <Container className="max-w-2xl flex flex-col gap-8">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.18em] text-accent font-medium">
            Inscription · Étape 3 sur 3
          </p>
          <h1 className="t-h3">
            Complétons votre profil.
          </h1>
          <p className="text-base text-muted leading-relaxed">
            Quelques informations pour adapter votre parcours. Vous pourrez
            modifier ces données depuis votre dashboard.
          </p>
        </header>
        <ProfileForm />
      </Container>
    </section>
  );
}
