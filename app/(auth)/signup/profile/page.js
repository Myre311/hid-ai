import { Container } from "@/components/ui/Container";
import { ProfileForm } from "@/components/auth/ProfileForm";

export const metadata = { title: "Compléter votre profil" };

export default function ProfileSignupPage() {
  return (
    <section className="flex-1 flex flex-col py-12 md:py-20">
      <Container className="max-w-2xl flex flex-col gap-8">
        <header className="flex flex-col gap-3">
          <h1 className="font-serif text-3xl md:text-4xl tracking-tighter leading-tight">
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
