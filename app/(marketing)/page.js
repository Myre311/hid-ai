import { Container, Section, Badge, Button } from "@/components/ui";

export const metadata = {
  title: "L'infrastructure humaine de l'IA, depuis l'Afrique",
};

export default function HomePage() {
  return (
    <main>
      <Section size="lg" className="hid-grid">
        <Container className="flex flex-col items-start gap-10">
          <Badge variant="accent" pulse>
            Hub NEO Bonoua · Lancement pilote 2026
          </Badge>
          <h1 className="font-serif text-5xl md:text-7xl tracking-tighter text-foreground max-w-5xl text-balance">
            L&rsquo;infrastructure humaine de l&rsquo;IA, depuis l&rsquo;Afrique.
          </h1>
          <p className="text-base md:text-lg text-muted max-w-2xl">
            Hidea Solution connecte les meilleurs AI Specialists et AI Engineers
            du continent avec les laboratoires et entreprises qui construisent
            l&rsquo;avenir de l&rsquo;intelligence artificielle.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg">Rejoindre comme talent</Button>
            <Button variant="ghost" size="lg">
              Pour les entreprises
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
