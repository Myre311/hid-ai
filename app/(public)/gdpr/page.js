import { LegalLayout, LP, LUL, LDL, LDLRow } from "@/components/legal/LegalLayout";

export const metadata = {
  title: "RGPD — Exercer vos droits · HID AI",
  description: "Comment exercer vos droits RGPD chez HID AI : accès, rectification, effacement, portabilité.",
};

const SECTIONS = [
  {
    id: "intro",
    title: "Vos droits en un coup d'œil",
    content: (
      <>
        <LP>
          Le Règlement Général sur la Protection des Données (RGPD, en vigueur depuis le
          25 mai 2018) garantit à chaque résident de l'Union européenne un ensemble de
          droits sur ses données personnelles. Les équipes de la plate-forme HID AI et de
          la société Major Exchanges SAS s'engagent à respecter ces droits
          dans le délai légal d'un mois maximum à compter de la réception d'une demande
          recevable.
        </LP>
        <LP>
          Cette page détaille comment exercer concrètement ces droits sur la plateforme HID AI.
        </LP>
      </>
    ),
  },
  {
    id: "acces",
    title: "1. Droit d'accès",
    content: (
      <>
        <LP>
          Vous pouvez obtenir <strong>une copie complète</strong> des données personnelles
          que nous détenons sur vous : profil, données KYC, scores aux tests, historique
          de connexion, données B2B le cas échéant.
        </LP>
        <LP>
          <strong>Comment exercer ?</strong> Envoyez un e-mail à{" "}
          <a href="mailto:contact@hid-ai.com?subject=RGPD%20-%20Demande%20d'acc%C3%A8s"
             className="underline underline-offset-4 hover:text-accent">
            contact@hid-ai.com
          </a>{" "}
          avec l'objet « RGPD — Demande d'accès », en précisant l'adresse e-mail de votre compte.
          Nous vous adresserons les données dans un format structuré (JSON) sous 30 jours.
        </LP>
      </>
    ),
  },
  {
    id: "rectification",
    title: "2. Droit de rectification",
    content: (
      <>
        <LP>
          Si vos données sont inexactes ou incomplètes (changement de nom, de coordonnées,
          d'adresse e-mail…), vous pouvez demander leur correction.
        </LP>
        <LP>
          <strong>Comment exercer ?</strong> Connectez-vous à votre tableau de bord
          (<a href="/dashboard/profil" className="underline underline-offset-4 hover:text-accent">/dashboard/profil</a>)
          pour modifier directement vos informations courantes, ou contactez-nous pour les
          champs non éditables.
        </LP>
      </>
    ),
  },
  {
    id: "effacement",
    title: "3. Droit à l'effacement (« droit à l'oubli »)",
    content: (
      <>
        <LP>
          Vous pouvez demander la suppression de votre compte et de l'ensemble des données
          associées, sous réserve des obligations légales de conservation (factures,
          documents KYC pendant 3 ans, etc.).
        </LP>
        <LP>
          <strong>Comment exercer ?</strong> Envoyez un e-mail à{" "}
          <a href="mailto:contact@hid-ai.com?subject=RGPD%20-%20Demande%20d'effacement"
             className="underline underline-offset-4 hover:text-accent">
            contact@hid-ai.com
          </a>{" "}
          avec l'objet « RGPD — Demande d'effacement ». Nous traiterons votre demande sous
          30 jours et vous confirmerons par écrit les données effacées et celles éventuellement
          conservées (avec leur fondement légal).
        </LP>
      </>
    ),
  },
  {
    id: "portabilite",
    title: "4. Droit à la portabilité",
    content: (
      <>
        <LP>
          Vous pouvez récupérer vos données dans un format structuré et lisible par machine
          (JSON), et les transmettre à un autre responsable de traitement.
        </LP>
        <LP>
          <strong>Comment exercer ?</strong> Même procédure que pour le droit d'accès :
          mentionnez « RGPD — Portabilité » dans l'objet de votre e-mail.
        </LP>
      </>
    ),
  },
  {
    id: "limitation",
    title: "5. Droit à la limitation du traitement",
    content: (
      <>
        <LP>
          Vous pouvez demander la suspension du traitement de vos données dans certains
          cas : contestation de leur exactitude, opposition au traitement, ou
          traitement illicite que vous ne souhaitez pas voir effacer.
        </LP>
      </>
    ),
  },
  {
    id: "opposition",
    title: "6. Droit d'opposition",
    content: (
      <>
        <LP>
          Vous pouvez vous opposer à tout moment au traitement de vos données pour des
          motifs liés à votre situation particulière, notamment :
        </LP>
        <LUL>
          <li>Opposition à la prospection commerciale (lien de désabonnement dans chaque
            e-mail).</li>
          <li>Opposition à un traitement fondé sur notre intérêt légitime.</li>
        </LUL>
      </>
    ),
  },
  {
    id: "consentement",
    title: "7. Retrait du consentement",
    content: (
      <>
        <LP>
          Lorsque le traitement est fondé sur votre consentement (par exemple : pour la
          collecte de pièces d'identité ou pour des communications non opérationnelles),
          vous pouvez le retirer à tout moment. Le retrait n'affecte pas la licéité du
          traitement antérieur.
        </LP>
      </>
    ),
  },
  {
    id: "directives-deces",
    title: "8. Directives post-mortem",
    content: (
      <>
        <LP>
          Conformément à la loi française « Informatique et Libertés », vous pouvez définir
          des directives concernant la conservation, l'effacement et la communication de vos
          données après votre décès. Ces directives peuvent être enregistrées auprès d'un
          tiers de confiance certifié ou nous être adressées directement.
        </LP>
      </>
    ),
  },
  {
    id: "delais",
    title: "9. Délais et frais",
    content: (
      <>
        <LP>
          Nous nous engageons à répondre à toute demande RGPD dans un délai d'<strong>un mois
          maximum</strong> à compter de la réception. Ce délai peut être prolongé de deux mois
          en cas de demandes complexes ou nombreuses, avec information préalable.
        </LP>
        <LP>
          <strong>Les demandes RGPD sont gratuites</strong>, sauf en cas de demandes manifestement
          infondées ou excessives (notamment par leur caractère répétitif), pour lesquelles
          des frais raisonnables pourront être appliqués.
        </LP>
      </>
    ),
  },
  {
    id: "identite",
    title: "10. Vérification d'identité",
    content: (
      <>
        <LP>
          Pour protéger vos données, nous pourrons demander une preuve d'identité avant de
          donner suite à votre demande (notamment pour les demandes d'accès, d'effacement
          ou de portabilité).
        </LP>
      </>
    ),
  },
  {
    id: "reclamation",
    title: "11. Réclamation auprès de la CNIL",
    content: (
      <>
        <LP>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une
          réclamation auprès de la <strong>Commission Nationale de l'Informatique et des
          Libertés (CNIL)</strong> :
        </LP>
        <LDL>
          <LDLRow term="Adresse" value="3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07" />
          <LDLRow term="Téléphone" value="01 53 73 22 22" />
          <LDLRow term="Plainte en ligne" value={<a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-accent">cnil.fr/fr/plaintes</a>} />
        </LDL>
        <LP>
          Nous vous encourageons toutefois à nous contacter en premier lieu — nous mettons
          tout en œuvre pour résoudre votre demande à l'amiable.
        </LP>
      </>
    ),
  },
];

export default function GdprPage() {
  return (
    <LegalLayout
      eyebrow="Exercer vos droits"
      title="RGPD — Protection de vos données"
      lastUpdated="11 mai 2026"
      sections={SECTIONS}
    />
  );
}
