import { Container } from "@/components/ui/Container";
import { BranchChoice } from "@/components/auth/BranchChoice";

export const metadata = {
  title: "Créer un compte",
};

export default function SignupPage({ searchParams }) {
  const noAccount = searchParams?.error === "no-account";

  return (
    <section className="flex-1 flex flex-col py-16 md:py-24">
      <Container className="max-w-5xl flex flex-col gap-12">
        <header className="flex flex-col gap-4 max-w-3xl">
          <h1 className="t-h2">
            Comment souhaitez-vous rejoindre HID AI ?
          </h1>
          <p className="text-base md:text-lg text-muted leading-relaxed">
            Choisissez votre profil. Vous pourrez compléter votre dossier en
            moins de 5 minutes. Pas de frais d&rsquo;inscription.
          </p>
        </header>

        {noAccount && (
          <p className="text-sm text-foreground bg-accent/10 border border-accent/30 rounded-md px-4 py-3 max-w-3xl">
            Aucun compte n&rsquo;est associé à ce compte Google. Créez d&rsquo;abord
            votre dossier ci-dessous — la connexion Google sera ensuite disponible.
          </p>
        )}

        <BranchChoice />
      </Container>
    </section>
  );
}
