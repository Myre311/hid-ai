import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function RoleSection() {
  return (
    <Section className="bg-background border-t border-border/40">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div className="flex flex-col gap-6 max-w-xl">
            <h2 className="font-serif text-4xl md:text-5xl tracking-tighter leading-[1.05]">
              Notre rôle.
            </h2>
            <p className="text-base md:text-lg text-muted leading-relaxed">
Du brief client à la livraison de la donnée d&rsquo;entraînement, nos équipes prennent en charge l&rsquo;ensemble de la chaîne — annotation, validation qualité, RLHF, fine-tuning, et certification continue des talents qui réalisent les missions.
            </p>
          </div>

          {/* Visuel placeholder — à remplacer par illustration ou capture */}
          <div className="aspect-square bg-surface border border-border rounded-lg flex items-center justify-center">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-strong">
              Illustration · à venir
            </span>
          </div>
        </div>
      </Container>
    </Section>
  );
}
