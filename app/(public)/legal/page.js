import { LegalLayout, LP, LDL, LDLRow } from "@/components/legal/LegalLayout";

export const metadata = {
  title: "Mentions légales · HID AI",
  description: "Mentions légales obligatoires — éditeur, hébergeur, propriété intellectuelle.",
};

const SECTIONS = [
  {
    id: "editeur",
    title: "Éditeur du site",
    content: (
      <>
        <LP>
          Le site <strong>hid-ai.com</strong> est édité par la société <strong>Hidea Solution</strong>.
        </LP>
        <LDL>
          <LDLRow term="Raison sociale" value="Hidea Solution" />
          <LDLRow term="Forme juridique" value={<span>SAS <em className="text-muted">[à confirmer]</em></span>} />
          <LDLRow term="Siège social" value={<span>France <em className="text-muted">[adresse postale complète à confirmer]</em></span>} />
          <LDLRow term="RCS / SIREN" value={<em className="text-muted">[à confirmer]</em>} />
          <LDLRow term="N° TVA intracom." value={<em className="text-muted">[à confirmer]</em>} />
          <LDLRow term="Directeur de la publication" value="Lucien Odzali, Président" />
          <LDLRow term="Contact" value={<a href="mailto:contact@hidea-solution.fr" className="underline underline-offset-4 hover:text-accent">contact@hidea-solution.fr</a>} />
          <LDLRow term="Téléphone" value="+33 6 27 67 89 31" />
        </LDL>
      </>
    ),
  },
  {
    id: "hebergeur",
    title: "Hébergeur",
    content: (
      <>
        <LP>
          Ce site est hébergé par <strong>Vercel Inc.</strong>
        </LP>
        <LDL>
          <LDLRow term="Société" value="Vercel Inc." />
          <LDLRow term="Adresse" value="440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis" />
          <LDLRow term="Site" value={<a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-accent">vercel.com</a>} />
        </LDL>
        <LP>
          La base de données et l'authentification sont assurées par <strong>Supabase Inc.</strong>{" "}
          (970 Toa Payoh North, #07-04, Singapore 318992).
        </LP>
      </>
    ),
  },
  {
    id: "propriete-intellectuelle",
    title: "Propriété intellectuelle",
    content: (
      <>
        <LP>
          L'ensemble des éléments figurant sur ce site (textes, images, vidéos, logos, marques,
          maquettes, code) est protégé par le droit d'auteur, le droit des marques et le droit
          des bases de données. Toute reproduction, représentation, modification, publication,
          transmission ou exploitation, totale ou partielle, sans l'autorisation expresse écrite
          de Hidea Solution est strictement interdite.
        </LP>
        <LP>
          La marque <strong>HID AI</strong> et le logo associé sont la propriété de Hidea Solution.
        </LP>
      </>
    ),
  },
  {
    id: "liens",
    title: "Liens hypertextes",
    content: (
      <>
        <LP>
          Le site peut contenir des liens vers des sites tiers. Hidea Solution n'exerce aucun
          contrôle sur ces sites et décline toute responsabilité quant à leur contenu,
          leurs conditions d'utilisation ou leur politique de confidentialité.
        </LP>
      </>
    ),
  },
  {
    id: "responsabilite",
    title: "Limitation de responsabilité",
    content: (
      <>
        <LP>
          Hidea Solution s'efforce d'assurer l'exactitude et la mise à jour des informations
          diffusées. Cependant, Hidea Solution ne peut garantir l'exactitude, la précision ou
          l'exhaustivité de ces informations et décline toute responsabilité pour toute
          interruption du site, survenance de bugs, inexactitude ou omission, et tout dommage
          résultant d'une intrusion frauduleuse d'un tiers.
        </LP>
      </>
    ),
  },
  {
    id: "donnees",
    title: "Données personnelles",
    content: (
      <>
        <LP>
          Les modalités de collecte et de traitement des données personnelles sont décrites dans
          notre <a href="/privacy" className="underline underline-offset-4 hover:text-accent">Politique de confidentialité</a>
          {" "}et notre <a href="/gdpr" className="underline underline-offset-4 hover:text-accent">page RGPD</a>.
        </LP>
      </>
    ),
  },
  {
    id: "droit-applicable",
    title: "Droit applicable",
    content: (
      <>
        <LP>
          Les présentes mentions légales sont régies par le droit français. En cas de litige et
          à défaut de résolution amiable, compétence est attribuée aux tribunaux compétents du
          ressort du siège social de Hidea Solution.
        </LP>
      </>
    ),
  },
];

export default function LegalPage() {
  return (
    <LegalLayout
      eyebrow="Informations légales"
      title="Mentions légales"
      lastUpdated="11 mai 2026"
      sections={SECTIONS}
    />
  );
}
