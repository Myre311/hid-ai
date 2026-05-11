/**
 * Test NLP — deux parties.
 *
 * Partie 1 — Sentiment / urgence / catégorie (15 phrases).
 * Partie 2 — Named Entity Recognition (NER) sur 5 phrases extraites
 *           de tickets HID AI (entreprises africaines, montants en XAF).
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

/**
 * NER (Named Entity Recognition).
 * Pour chaque phrase, le candidat doit étiqueter les `spans` listés.
 * Types : PER (personne), ORG (organisation), LOC (lieu), MONEY (montant),
 *         DATE (date), MISC (autre nommé). On accepte aussi "O" (non-entité)
 *         pour les tests de "leurres".
 */
export const NER_DATA = [
  {
    id: "n-01",
    text: "Jean Mballa, directeur de Orange Cameroun, a signé un contrat de 12 millions FCFA avec HID AI le 15 février 2026 à Douala.",
    spans: [
      { id: "n-01-a", text: "Jean Mballa", type: "PER" },
      { id: "n-01-b", text: "Orange Cameroun", type: "ORG" },
      { id: "n-01-c", text: "12 millions FCFA", type: "MONEY" },
      { id: "n-01-d", text: "HID AI", type: "ORG" },
      { id: "n-01-e", text: "15 février 2026", type: "DATE" },
      { id: "n-01-f", text: "Douala", type: "LOC" },
    ],
  },
  {
    id: "n-02",
    text: "Fatou Diop a rejoint Sonatel à Dakar le 3 janvier dernier pour piloter la transformation IA.",
    spans: [
      { id: "n-02-a", text: "Fatou Diop", type: "PER" },
      { id: "n-02-b", text: "Sonatel", type: "ORG" },
      { id: "n-02-c", text: "Dakar", type: "LOC" },
      { id: "n-02-d", text: "3 janvier", type: "DATE" },
    ],
  },
  {
    id: "n-03",
    text: "Le ticket #4521 mentionne un litige de 850 000 XAF entre BICEC et la SARL Eco-Logis à Yaoundé.",
    spans: [
      { id: "n-03-a", text: "850 000 XAF", type: "MONEY" },
      { id: "n-03-b", text: "BICEC", type: "ORG" },
      { id: "n-03-c", text: "SARL Eco-Logis", type: "ORG" },
      { id: "n-03-d", text: "Yaoundé", type: "LOC" },
    ],
  },
  {
    id: "n-04",
    text: "L'audit conduit par Aïssata Traoré pour le compte de la BCEAO sera livré avant le 30 mars 2026.",
    spans: [
      { id: "n-04-a", text: "Aïssata Traoré", type: "PER" },
      { id: "n-04-b", text: "BCEAO", type: "ORG" },
      { id: "n-04-c", text: "30 mars 2026", type: "DATE" },
    ],
  },
  {
    id: "n-05",
    text: "Le serveur basé à Abidjan est en panne depuis hier ; Kouassi Yao demande un remboursement de 1 500 000 FCFA.",
    spans: [
      { id: "n-05-a", text: "Abidjan", type: "LOC" },
      { id: "n-05-b", text: "Kouassi Yao", type: "PER" },
      { id: "n-05-c", text: "1 500 000 FCFA", type: "MONEY" },
    ],
  },
];

export const NER_TYPES = [
  { value: "PER", label: "Personne" },
  { value: "ORG", label: "Organisation" },
  { value: "LOC", label: "Lieu" },
  { value: "MONEY", label: "Montant" },
  { value: "DATE", label: "Date" },
  { value: "MISC", label: "Autre nommé" },
  { value: "O", label: "Non-entité" },
];
