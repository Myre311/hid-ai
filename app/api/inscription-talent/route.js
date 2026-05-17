import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/inscription-talent
 * Reçoit du JSON (le KYC n'est plus collecté ici — il se fait dans le
 * dashboard talent). Le talent est créé en statut `kyc_pending` sans
 * pièces ; il déposera ses documents depuis son espace, validation admin
 * requise avant l'accès aux missions.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const required = [
    "prenom",
    "nom",
    "email",
    "telephone",
    "date_naissance",
    "pays",
    "ville",
    "metier",
    "niveau_etudes",
  ];
  for (const k of required) {
    if (!body[k] || (typeof body[k] === "string" && !body[k].trim())) {
      return NextResponse.json({ error: `Missing field: ${k}` }, { status: 400 });
    }
  }
  if (!body.consent_cgu || !body.consent_rgpd || !body.consent_ethique) {
    return NextResponse.json(
      { error: "All required consents must be accepted" },
      { status: 400 }
    );
  }
  if (!["specialist", "engineer"].includes(body.metier)) {
    return NextResponse.json({ error: "Invalid metier" }, { status: 400 });
  }

  const reference = generateRef();
  const supabase = createServiceClient();

  const { error } = await supabase.from("inscriptions_talents").insert({
    reference,
    status: "kyc_pending", // KYC à déposer depuis le dashboard
    prenom: body.prenom,
    nom: body.nom,
    // Normalisé lowercase pour matcher Supabase Auth (lookups dashboard /
    // /api/evaluation/start sinon mismatch case-sensitive).
    email: (body.email || "").toLowerCase().trim(),
    telephone: body.telephone,
    date_naissance: body.date_naissance,
    pays: body.pays,
    ville: body.ville,
    metier: body.metier,
    niveau_etudes: body.niveau_etudes,
    competences: Array.isArray(body.competences) ? body.competences : [],
    doc_type: null,
    doc_recto_path: null,
    doc_verso_path: null,
    selfie_path: null,
    antecedents: null,
    modules_validated: body.modules || {},
    domaine: body.domaine || null,
    creneau_test_date: null,
    creneau_test_time: null,
    prerequis_confirmed: Array.isArray(body.prerequis) ? body.prerequis : [],
    consent_cgu: !!body.consent_cgu,
    consent_rgpd: !!body.consent_rgpd,
    consent_ethique: !!body.consent_ethique,
    consent_news: !!body.consent_news,
  });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[/api/inscription-talent] insert error:", error);
    return NextResponse.json(
      { error: error.message || "Insertion failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ reference }, { status: 201 });
}

function generateRef() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `HID-TLT-${ymd}-${rand}`;
}

function pad(n) {
  return String(n).padStart(2, "0");
}
