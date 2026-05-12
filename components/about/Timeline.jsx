import Link from "next/link";

const ENTRIES = [
  {
    year: "2024",
    description:
      "Premiers cadrages méthodologiques et mise en place de formation multidimensionnelle des talents africains au développement informatique et à l'Intelligence Artificielle.",
  },
  {
    year: "2025",
    description:
      "Structuration des hubs opérationnels en Côte d'Ivoire, au Maroc et au Congo Brazzaville. Recrutement des premiers conseillers et formateurs.",
  },
  {
    year: "2026",
    description: (
      <>
        Mise sur le marché de la Plateforme HID AI avec plus de 500 AI
        Specialists & 50 AI Engineers
        <Link
          href="/talents"
          className="text-accent hover:underline"
          aria-label="Plus d'informations sur les talents (lien)"
        >
          *
        </Link>
      </>
    ),
  },
];

export function Timeline() {
  return (
    <ul className="flex flex-col gap-10">
      {ENTRIES.map((e) => (
        <li
          key={e.year}
          className="grid grid-cols-[88px_1fr] md:grid-cols-[140px_1fr] gap-6 items-baseline"
        >
          <span className="font-sans text-3xl md:text-4xl tracking-tight text-accent">
            {e.year}
          </span>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            {e.description}
          </p>
        </li>
      ))}
    </ul>
  );
}
