import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function RoleSection() {
  return (
    <Section className="bg-background">
      <Container>
        <div className="flex flex-col gap-6 max-w-3xl">
          <h2 className="t-h2-md">
            Notre rôle.
          </h2>
          <p className="t-lead">
Du brief client à la livraison de la donnée d&rsquo;entraînement, nos équipes prennent en charge l&rsquo;ensemble de la chaîne — annotation, validation qualité, RLHF, fine-tuning, et certification continue des talents qui réalisent les missions.
          </p>
        </div>
      </Container>
    </Section>
  );
}
