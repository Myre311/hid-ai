import { Container } from "@/components/ui/Container";
import { BranchChoice } from "@/components/auth/BranchChoice";

export const metadata = {
  title: "Créer un compte",
};

export default function SignupPage() {
  return (
    <section className="flex-1 flex flex-col py-16 md:py-24">
      <Container className="max-w-5xl flex flex-col gap-12">
        <header className="flex flex-col gap-4 max-w-3xl">
          <h1 className="font-serif text-4xl md:text-6xl tracking-tighter leading-[1.05] text-balance">
            Comment souhaitez-vous rejoindre HID AI ?
          </h1>
          <p className="text-base md:text-lg text-muted leading-relaxed">
            Choisissez votre profil. Vous pourrez compléter votre dossier en
            moins de 5 minutes. Pas de frais d&rsquo;inscription.
          </p>
        </header>

        <BranchChoice />
      </Container>
    </section>
  );
}
