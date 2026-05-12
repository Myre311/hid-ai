import { LegalLayout, LP, LUL, LDL, LDLRow } from "@/components/legal/LegalLayout";
import { ManagePreferencesButton } from "@/components/consent/ManagePreferencesButton";

export const metadata = {
  title: "Politique de confidentialité · HID AI",
  description: "Comment HID AI collecte, traite et protège vos données personnelles, conforme RGPD.",
};

const SECTIONS = [
  {
    id: "responsable",
    title: "1. Responsable du traitement",
    content: (
      <>
        <LP>
          Le responsable du traitement est <strong>Hidea Solution</strong>, éditeur de la
          plateforme HID AI.
        </LP>
        <LDL>
          <LDLRow term="Société" value="Hidea Solution" />
          <LDLRow term="Siège" value={<span>France <em className="text-muted">[adresse à confirmer]</em></span>} />
          <LDLRow term="Contact" value={<a href="mailto:contact@hidea-solution.fr" className="underline underline-offset-4 hover:text-accent">contact@hidea-solution.fr</a>} />
          <LDLRow term="Téléphone" value="+33 6 27 67 89 31" />
        </LDL>
        <LP>
          Pour toute demande relative à vos données, vous pouvez nous contacter à{" "}
          <a href="mailto:contact@hidea-solution.fr" className="underline underline-offset-4 hover:text-accent">contact@hidea-solution.fr</a>
          {" "}ou via notre <a href="/gdpr" className="underline underline-offset-4 hover:text-accent">page RGPD</a>.
        </LP>
      </>
    ),
  },
  {
    id: "donnees-collectees",
    title: "2. Données collectées",
    content: (
      <>
        <LP>Nous collectons les catégories de données suivantes :</LP>
        <LUL>
          <li><strong>Identité</strong> : prénom, nom, date de naissance, pays, ville.</li>
          <li><strong>Contact</strong> : adresse e-mail, numéro de téléphone mobile.</li>
          <li><strong>Pièces d'identité (Talents)</strong> : copie de la pièce d'identité,
            photo selfie pour vérification KYC.</li>
          <li><strong>Données professionnelles (Talents)</strong> : niveau d'études,
            compétences déclarées, parcours, créneaux de disponibilité.</li>
          <li><strong>Données B2B</strong> : raison sociale, immatriculation, secteur,
            signataire (nom, fonction, e-mail, téléphone), volume, fréquence, prestations
            recherchées.</li>
          <li><strong>Données d'évaluation</strong> : réponses aux tests, scores, temps passé,
            tentatives, score AI-Native global.</li>
          <li><strong>Données techniques</strong> : adresse IP, type de navigateur, pages
            consultées, horodatages, cookies d'authentification.</li>
        </LUL>
      </>
    ),
  },
  {
    id: "finalites",
    title: "3. Finalités du traitement",
    content: (
      <>
        <LP>Vos données sont traitées pour les finalités suivantes :</LP>
        <LUL>
          <li>Création et gestion de votre compte (Talent ou B2B).</li>
          <li>Vérification d'identité (KYC) et lutte contre la fraude.</li>
          <li>Évaluation des compétences techniques (tests AI-Native).</li>
          <li>Mise en relation avec des missions d'annotation IA (Talents) ou avec des
            spécialistes (Clients B2B).</li>
          <li>Communications commerciales et opérationnelles (e-mails de service, notifications).</li>
          <li>Amélioration de la plateforme et des barèmes de scoring (données anonymisées).</li>
          <li>Respect de nos obligations légales et réglementaires.</li>
        </LUL>
      </>
    ),
  },
  {
    id: "base-legale",
    title: "4. Base légale",
    content: (
      <>
        <LP>Le traitement de vos données repose sur :</LP>
        <LUL>
          <li><strong>L'exécution du contrat</strong> (CGU) pour la gestion du compte,
            l'évaluation et la mise en relation.</li>
          <li><strong>Votre consentement explicite</strong> pour la collecte des pièces
            d'identité, des données sensibles, et pour les communications non opérationnelles.</li>
          <li><strong>Notre intérêt légitime</strong> pour la prévention de la fraude,
            la sécurité du système, et l'amélioration continue de la plateforme.</li>
          <li><strong>Le respect d'obligations légales</strong> pour les données
            comptables et fiscales.</li>
        </LUL>
      </>
    ),
  },
  {
    id: "destinataires",
    title: "5. Destinataires",
    content: (
      <>
        <LP>Vos données peuvent être communiquées à :</LP>
        <LUL>
          <li>Les équipes opérationnelles de Hidea Solution (administrateurs habilités, opérateurs
            en Côte d'Ivoire, Maroc, Congo Brazzaville).</li>
          <li>Nos sous-traitants techniques (hébergement, base de données, envoi d'e-mails,
            authentification SMS) — voir section « Sous-traitants ».</li>
          <li>Les Clients B2B, pour le matching avec des missions — uniquement les données
            strictement nécessaires (compétences, score AI-Native, disponibilité)
            et sans données d'identité non agrégées sauf accord exprès.</li>
          <li>Les autorités compétentes en cas d'obligation légale.</li>
        </LUL>
      </>
    ),
  },
  {
    id: "sous-traitants",
    title: "6. Sous-traitants",
    content: (
      <>
        <LP>Nous faisons appel aux sous-traitants suivants, chacun engagé par contrat
          conformément à l'art. 28 RGPD :</LP>
        <LUL>
          <li><strong>Vercel Inc.</strong> (États-Unis) — hébergement applicatif. Transferts
            encadrés par les clauses contractuelles types de la Commission européenne.</li>
          <li><strong>Supabase Inc.</strong> (Singapour) — base de données et authentification.
            Transferts encadrés par les clauses contractuelles types.</li>
          <li><strong>Resend</strong> (États-Unis) — envoi d'e-mails transactionnels.</li>
          <li><strong>Twilio Inc.</strong> (États-Unis) — envoi de SMS d'authentification (OTP).</li>
        </LUL>
      </>
    ),
  },
  {
    id: "duree",
    title: "7. Durée de conservation",
    content: (
      <>
        <LDL>
          <LDLRow term="Compte actif" value="Pendant toute la durée d'utilisation du service" />
          <LDLRow term="Compte inactif" value="3 ans après la dernière connexion, puis suppression" />
          <LDLRow term="Pièces d'identité KYC" value="3 ans après la dernière mission, conformément aux obligations LCB-FT" />
          <LDLRow term="Données de facturation" value="10 ans (obligation comptable)" />
          <LDLRow term="Logs techniques" value="12 mois maximum" />
          <LDLRow term="Cookies" value="13 mois maximum" />
        </LDL>
      </>
    ),
  },
  {
    id: "droits",
    title: "8. Vos droits",
    content: (
      <>
        <LP>Conformément au RGPD, vous disposez des droits suivants sur vos données :</LP>
        <LUL>
          <li><strong>Droit d'accès</strong> : obtenir une copie de vos données.</li>
          <li><strong>Droit de rectification</strong> : corriger des données inexactes.</li>
          <li><strong>Droit à l'effacement</strong> (« droit à l'oubli »).</li>
          <li><strong>Droit à la limitation</strong> du traitement.</li>
          <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format
            structuré.</li>
          <li><strong>Droit d'opposition</strong> au traitement, notamment pour la
            prospection commerciale.</li>
          <li><strong>Droit de retirer votre consentement</strong> à tout moment.</li>
          <li><strong>Droit de définir des directives</strong> sur le sort de vos données après
            votre décès.</li>
        </LUL>
        <LP>
          Pour exercer ces droits, rendez-vous sur notre{" "}
          <a href="/gdpr" className="underline underline-offset-4 hover:text-accent">page RGPD</a>
          {" "}ou envoyez-nous un e-mail à{" "}
          <a href="mailto:contact@hidea-solution.fr" className="underline underline-offset-4 hover:text-accent">contact@hidea-solution.fr</a>.
        </LP>
      </>
    ),
  },
  {
    id: "reclamation",
    title: "9. Droit de réclamation",
    content: (
      <>
        <LP>
          Si vous estimez que le traitement de vos données ne respecte pas le RGPD, vous
          pouvez introduire une réclamation auprès de la <strong>CNIL</strong>{" "}
          (Commission Nationale de l'Informatique et des Libertés) :
        </LP>
        <LDL>
          <LDLRow term="Adresse" value="3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07" />
          <LDLRow term="Téléphone" value="01 53 73 22 22" />
          <LDLRow term="Site" value={<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-accent">www.cnil.fr</a>} />
        </LDL>
      </>
    ),
  },
  {
    id: "securite",
    title: "10. Sécurité",
    content: (
      <>
        <LP>
          Hidea Solution met en œuvre les mesures techniques et organisationnelles appropriées
          pour assurer la sécurité de vos données : chiffrement TLS en transit, isolation
          base de données via Row-Level Security (RLS), authentification à deux facteurs (SMS OTP),
          accès admin restreint par liste blanche, audit régulier des dépendances.
        </LP>
      </>
    ),
  },
  {
    id: "cookies",
    title: "11. Cookies",
    content: (
      <>
        <LP>
          Nous utilisons uniquement des cookies <strong>strictement nécessaires</strong> au
          fonctionnement de la plateforme :
        </LP>
        <LUL>
          <li><strong>Cookies de session</strong> (Supabase Auth) — pour maintenir votre
            connexion. Durée : durée de la session + refresh tokens (max 1 an).</li>
          <li><strong>Cookies de préférences</strong> — pour mémoriser vos choix
            (thème, langue). Durée : 13 mois.</li>
        </LUL>
        <LP>
          Nous n'utilisons pas de cookies de tracking publicitaire ni de cookies d'analyse
          tierce sans votre consentement explicite.
        </LP>
        <div className="pt-2">
          <ManagePreferencesButton />
        </div>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Conformité RGPD"
      title="Politique de confidentialité"
      lastUpdated="11 mai 2026"
      sections={SECTIONS}
    />
  );
}
