/**
 * Dataset Data Cleaning.
 *  - dirty : 20 lignes brutes (dates mélangées US/FR, emails invalides,
 *            doublons, fautes de frappe).
 *  - clean : la version "vraie" attendue après nettoyage.
 *
 * Format dirty row : { id, date_raw, email, name }
 * Format clean row : { id, date: "YYYY-MM-DD", email_invalid: bool,
 *                      duplicate: bool, name: "Forme propre" }
 */

const dirty = [
  { id: "r01", date_raw: "12/05/2026",     email: "alice.dupont@example.com", name: "alice  Dupont" },
  { id: "r02", date_raw: "05/12/2026",     email: "marc@",                    name: "Marc Berger" },
  { id: "r03", date_raw: "2026-05-12",     email: "alice.dupont@example.com", name: "Alice Dupont" },
  { id: "r04", date_raw: "13 avril 2026",  email: "leo.morin@ex.fr",          name: "LEO MORIN" },
  { id: "r05", date_raw: "2026/05/13",     email: "sara@invalid",             name: "sara N'Diaye" },
  { id: "r06", date_raw: "May 14 2026",    email: "paul@example.com",         name: "Paul Tremblay" },
  { id: "r07", date_raw: "14-5-2026",      email: "paul@example.com",         name: "Paul Tremblay" },
  { id: "r08", date_raw: "15.05.2026",     email: "claire@x",                 name: "Claire Petit" },
  { id: "r09", date_raw: "2026-05-16",     email: "kevin.kone@orange.ci",     name: "kévin koné" },
  { id: "r10", date_raw: "05-16-2026",     email: "kevin.kone@orange.ci",     name: "Kévin Koné" },
  { id: "r11", date_raw: "17/5/26",        email: "fadi@example.fr",          name: "Fadi Bensaïd" },
  { id: "r12", date_raw: "2026-05-18",     email: "tania@_invalid",           name: "Tania M." },
  { id: "r13", date_raw: "18/05/2026",     email: "tania@_invalid",           name: "Tania M." },
  { id: "r14", date_raw: "19 mai 2026",    email: "yves@example.com",         name: "Yves L." },
  { id: "r15", date_raw: "20/05/26",       email: "jules@example.com",        name: "jules  Mehdi" },
  { id: "r16", date_raw: "21-05-2026",     email: "marie..t@example.com",     name: "Marie Trinh" },
  { id: "r17", date_raw: "22/5/2026",      email: "sofiane@example.fr",       name: "Sofiane Ali" },
  { id: "r18", date_raw: "23/05/2026",     email: "sofiane@example.fr",       name: "Sofiane Ali" },
  { id: "r19", date_raw: "2026-5-24",      email: "amir@example.com",         name: "amir B" },
  { id: "r20", date_raw: "25-05-2026",     email: "diane@example.com",        name: "Diane Hoarau" },
];

const clean = [
  { id: "r01", date: "2026-05-12", email_invalid: false, duplicate: false, name: "Alice Dupont" },
  { id: "r02", date: "2026-12-05", email_invalid: true,  duplicate: false, name: "Marc Berger" },
  { id: "r03", date: "2026-05-12", email_invalid: false, duplicate: true,  name: "Alice Dupont" },
  { id: "r04", date: "2026-04-13", email_invalid: false, duplicate: false, name: "Leo Morin" },
  { id: "r05", date: "2026-05-13", email_invalid: true,  duplicate: false, name: "Sara N'Diaye" },
  { id: "r06", date: "2026-05-14", email_invalid: false, duplicate: false, name: "Paul Tremblay" },
  { id: "r07", date: "2026-05-14", email_invalid: false, duplicate: true,  name: "Paul Tremblay" },
  { id: "r08", date: "2026-05-15", email_invalid: true,  duplicate: false, name: "Claire Petit" },
  { id: "r09", date: "2026-05-16", email_invalid: false, duplicate: false, name: "Kévin Koné" },
  { id: "r10", date: "2026-05-16", email_invalid: false, duplicate: true,  name: "Kévin Koné" },
  { id: "r11", date: "2026-05-17", email_invalid: false, duplicate: false, name: "Fadi Bensaïd" },
  { id: "r12", date: "2026-05-18", email_invalid: true,  duplicate: false, name: "Tania M." },
  { id: "r13", date: "2026-05-18", email_invalid: true,  duplicate: true,  name: "Tania M." },
  { id: "r14", date: "2026-05-19", email_invalid: false, duplicate: false, name: "Yves L." },
  { id: "r15", date: "2026-05-20", email_invalid: false, duplicate: false, name: "Jules Mehdi" },
  { id: "r16", date: "2026-05-21", email_invalid: true,  duplicate: false, name: "Marie Trinh" },
  { id: "r17", date: "2026-05-22", email_invalid: false, duplicate: false, name: "Sofiane Ali" },
  { id: "r18", date: "2026-05-23", email_invalid: false, duplicate: true,  name: "Sofiane Ali" },
  { id: "r19", date: "2026-05-24", email_invalid: false, duplicate: false, name: "Amir B" },
  { id: "r20", date: "2026-05-25", email_invalid: false, duplicate: false, name: "Diane Hoarau" },
];

export const DATA_CLEANING_DATA = { dirty, clean };
