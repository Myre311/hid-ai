import { LegalLayout, LP, LUL } from "@/components/legal/LegalLayout";

export const metadata = {
  title: "Conditions Générales d'Utilisation · HID AI",
  description: "CGU — règles d'accès et d'utilisation de la plateforme HID AI.",
};

const SECTIONS = [
  {
    id: "objet",
    title: "1. Objet",
    content: (
      <>
        <LP>
          Les présentes Conditions Générales d'Utilisation (« CGU ») régissent l'accès et
          l'utilisation de la plateforme HID AI, opérée par <strong>la plate-forme HID AI
          et par la société Major Exchanges SAS</strong> (ci-après « HID AI » ou « la
          Société »), accessible à l'adresse{" "}
          <a href="https://hid-ai.com" className="underline underline-offset-4 hover:text-accent">hid-ai.com</a>.
        </LP>
        <LP>
          Toute utilisation du site implique l'acceptation pleine et entière des présentes CGU.
          Si vous n'acceptez pas ces conditions, n'utilisez pas la plateforme.
        </LP>
      </>
    ),
  },
  {
    id: "definitions",
    title: "2. Définitions",
    content: (
      <>
        <LUL>
          <li><strong>Utilisateur</strong> : toute personne accédant à la plateforme HID AI.</li>
          <li><strong>Talent</strong> : personne physique inscrite en tant que candidat à
            l'évaluation et au déploiement en mission d'annotation IA.</li>
          <li><strong>Client B2B</strong> : entreprise contractualisant avec la plate-forme
            HID AI et avec la société Major Exchanges SAS pour la livraison de prestations
            d'entraînement IA.</li>
          <li><strong>Plateforme</strong> : ensemble des services accessibles sur hid-ai.com,
            incluant inscription, évaluation, dashboard, et prestations de la plate-forme
            HID AI et de la société Major Exchanges SAS.</li>
        </LUL>
      </>
    ),
  },
  {
    id: "acces",
    title: "3. Accès à la plateforme",
    content: (
      <>
        <LP>
          L'accès à la plateforme est gratuit pour la consultation des pages publiques.
          La création d'un compte (Talent ou Client B2B) nécessite la fourniture d'informations
          exactes et à jour, et l'acceptation des présentes CGU.
        </LP>
        <LP>
          HID AI se réserve le droit, sans préavis, de suspendre ou de supprimer tout compte
          ne respectant pas les présentes CGU, ou présentant un comportement frauduleux.
        </LP>
      </>
    ),
  },
  {
    id: "comptes",
    title: "4. Comptes et authentification",
    content: (
      <>
        <LP>
          L'inscription d'un Talent nécessite :
        </LP>
        <LUL>
          <li>Un numéro de téléphone mobile pour la double authentification par SMS (OTP).</li>
          <li>Des pièces d'identité (KYC) pour la vérification d'identité.</li>
          <li>L'acceptation explicite des CGU, de la politique de confidentialité,
            et de la charte éthique.</li>
        </LUL>
        <LP>
          L'Utilisateur est seul responsable de la confidentialité de ses identifiants et de
          toutes les activités effectuées depuis son compte. Toute utilisation frauduleuse
          doit être signalée immédiatement à{" "}
          <a href="mailto:contact@hid-ai.com" className="underline underline-offset-4 hover:text-accent">contact@hid-ai.com</a>.
        </LP>
      </>
    ),
  },
  {
    id: "evaluation",
    title: "5. Plateforme d'évaluation",
    content: (
      <>
        <LP>
          Les Talents accèdent à une plateforme d'évaluation composée de 8 tests linéaires
          mesurant le score AI-Native (sur 1000). L'accès à un test est conditionné à la
          réussite du test précédent (score minimum = 60/100).
        </LP>
        <LP>
          Les résultats des tests sont confidentiels et ne sont visibles que par le Talent
          concerné et les administrateurs de la plate-forme HID AI et de la société Major
          Exchanges SAS. Toute tentative de fraude
          (utilisation d'outils tiers non autorisés, partage de réponses, multi-comptes)
          entraîne la suspension immédiate du compte.
        </LP>
        <LP>
          Un test validé (score ≥ 60/100) ne peut pas être rejoué. Un test échoué peut
          être rejoué une fois.
        </LP>
      </>
    ),
  },
  {
    id: "prestations",
    title: "6. Prestations B2B",
    content: (
      <>
        <LP>
          Les conditions commerciales (volume, fréquence, tarifs, SLA) des prestations
          d'annotation et d'entraînement IA sont définies dans un contrat séparé entre la
          plate-forme HID AI / la société Major Exchanges SAS et le Client B2B. Les CGU
          ne se substituent pas à ces dispositions contractuelles.
        </LP>
      </>
    ),
  },
  {
    id: "propriete",
    title: "7. Propriété intellectuelle",
    content: (
      <>
        <LP>
          L'ensemble des contenus de la plateforme (textes, images, vidéos, code, marques,
          logos) est protégé par le droit de la propriété intellectuelle et appartient à
          la plate-forme HID AI et à la société Major Exchanges SAS, ou à leurs partenaires.
        </LP>
        <LP>
          Les Talents conservent la propriété de leurs réponses aux tests. Les équipes de
          la plate-forme HID AI et de la société Major Exchanges SAS disposent d'un droit
          d'usage à des fins d'évaluation, d'amélioration des barèmes de scoring, et de
          communication anonymisée auprès des Clients B2B.
        </LP>
      </>
    ),
  },
  {
    id: "responsabilite",
    title: "8. Responsabilité",
    content: (
      <>
        <LP>
          HID AI met tout en œuvre pour assurer la disponibilité de la plateforme, sans
          toutefois être soumis à une obligation de résultat. La Société ne saurait être
          tenue responsable des indisponibilités temporaires, des interruptions de service,
          ou de la perte de données résultant de causes extérieures à sa volonté.
        </LP>
        <LP>
          La responsabilité de la plate-forme HID AI et de la société Major Exchanges SAS
          ne peut être engagée pour des dommages indirects
          (perte de chiffre d'affaires, perte d'opportunité, atteinte à l'image).
        </LP>
      </>
    ),
  },
  {
    id: "donnees-personnelles",
    title: "9. Données personnelles",
    content: (
      <>
        <LP>
          Le traitement des données personnelles est encadré par notre{" "}
          <a href="/privacy" className="underline underline-offset-4 hover:text-accent">Politique de confidentialité</a>
          {" "}et conforme au RGPD. Les Utilisateurs disposent de droits d'accès, de rectification,
          d'effacement et de portabilité, détaillés sur notre{" "}
          <a href="/gdpr" className="underline underline-offset-4 hover:text-accent">page RGPD</a>.
        </LP>
      </>
    ),
  },
  {
    id: "modification",
    title: "10. Modification des CGU",
    content: (
      <>
        <LP>
          Les éditeurs de la plate-forme HID AI et de la société Major Exchanges SAS se
          réservent le droit de modifier les présentes CGU à tout moment. Les
          modifications prennent effet à compter de leur publication sur le site. Les Utilisateurs
          sont informés par notification en cas de modification substantielle. La poursuite de
          l'utilisation après publication vaut acceptation des nouvelles CGU.
        </LP>
      </>
    ),
  },
  {
    id: "droit-applicable",
    title: "11. Droit applicable et juridiction",
    content: (
      <>
        <LP>
          Les présentes CGU sont régies par le droit français. Tout litige relatif à leur
          interprétation ou à leur exécution relève de la compétence exclusive des tribunaux
          français du ressort du siège social de la société Major Exchanges SAS (Toulouse),
          après tentative de résolution
          amiable.
        </LP>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      eyebrow="Documents contractuels"
      title="Conditions Générales d'Utilisation"
      lastUpdated="11 mai 2026"
      sections={SECTIONS}
    />
  );
}
