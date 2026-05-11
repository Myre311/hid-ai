/**
 * 15 phrases françaises à classer sur 3 axes :
 *  - sentiment : "positif" | "negatif" | "neutre"
 *  - urgence   : "haute" | "moyenne" | "basse"
 *  - categorie : "facturation" | "technique" | "commercial"
 */
export const NLP_SENTIMENT_DATA = [
  {
    id: "s-01",
    text: "Ma facture du mois dernier comporte une erreur et je n'arrive plus à me connecter à mon espace client !",
    sentiment: "negatif",
    urgence: "haute",
    categorie: "facturation",
  },
  {
    id: "s-02",
    text: "Bonjour, je voulais vous remercier pour votre support technique rapide et professionnel.",
    sentiment: "positif",
    urgence: "basse",
    categorie: "technique",
  },
  {
    id: "s-03",
    text: "Pourriez-vous m'envoyer le devis pour 50 licences supplémentaires d'ici la fin de semaine ?",
    sentiment: "neutre",
    urgence: "moyenne",
    categorie: "commercial",
  },
  {
    id: "s-04",
    text: "Service injoignable depuis 3 heures, c'est inadmissible — mes équipes sont bloquées !",
    sentiment: "negatif",
    urgence: "haute",
    categorie: "technique",
  },
  {
    id: "s-05",
    text: "Je suis très satisfait de la nouvelle interface, beaucoup plus claire que la précédente.",
    sentiment: "positif",
    urgence: "basse",
    categorie: "technique",
  },
  {
    id: "s-06",
    text: "Bonjour, pouvez-vous me confirmer le montant prélevé le 12 mars ?",
    sentiment: "neutre",
    urgence: "moyenne",
    categorie: "facturation",
  },
  {
    id: "s-07",
    text: "Je souhaiterais discuter d'une remise volume avant signature du contrat annuel.",
    sentiment: "neutre",
    urgence: "moyenne",
    categorie: "commercial",
  },
  {
    id: "s-08",
    text: "Erreur 500 sur l'API depuis ce matin, impossible de déclencher nos pipelines de production !",
    sentiment: "negatif",
    urgence: "haute",
    categorie: "technique",
  },
  {
    id: "s-09",
    text: "Petite question : où trouve-t-on l'historique de facturation détaillé dans le portail ?",
    sentiment: "neutre",
    urgence: "basse",
    categorie: "facturation",
  },
  {
    id: "s-10",
    text: "Excellent rapport qualité-prix, je recommande sans hésiter à mes confrères DRH.",
    sentiment: "positif",
    urgence: "basse",
    categorie: "commercial",
  },
  {
    id: "s-11",
    text: "Le double prélèvement de mars n'a toujours pas été remboursé, je vous l'avais signalé il y a 2 semaines.",
    sentiment: "negatif",
    urgence: "haute",
    categorie: "facturation",
  },
  {
    id: "s-12",
    text: "Pourriez-vous nous proposer un créneau pour la démo du module avancé ?",
    sentiment: "neutre",
    urgence: "moyenne",
    categorie: "commercial",
  },
  {
    id: "s-13",
    text: "Le webhook n'envoie plus rien depuis hier soir, est-ce de votre côté ou du nôtre ?",
    sentiment: "neutre",
    urgence: "haute",
    categorie: "technique",
  },
  {
    id: "s-14",
    text: "Merci pour le geste commercial, c'est très apprécié.",
    sentiment: "positif",
    urgence: "basse",
    categorie: "commercial",
  },
  {
    id: "s-15",
    text: "Pouvez-vous m'expliquer la ligne « usage variable » sur ma facture ?",
    sentiment: "neutre",
    urgence: "moyenne",
    categorie: "facturation",
  },
];
