import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/inscription-b2b
 * Reçoit le payload JSON du B2BForm et l'insère dans inscriptions_b2b.
 * Retourne la référence générée.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // Server-side validation minimale (le client a déjà validé,
  // mais on protège contre les payloads bidons).
  const required = [
    "raison_sociale",
    "immatriculation",
    "pays",
    "secteur",
    "signataire_prenom",
    "signataire_nom",
    "signataire_fonction",
    "signataire_email",
    "signataire_tel",
    "volume",
    "frequence",
  ];
  for (const k of required) {
    if (!body[k] || (typeof body[k] === "string" && !body[k].trim())) {
      return NextResponse.json(
        { error: `Missing field: ${k}` },
        { status: 400 }
      );
    }
  }
  if (!body.consent_rgpd) {
    return NextResponse.json(
      { error: "RGPD consent required" },
      { status: 400 }
    );
  }
  if (
    !Array.isArray(body.prestations) ||
    body.prestations.length === 0
  ) {
    return NextResponse.json(
      { error: "At least one prestation required" },
      { status: 400 }
    );
  }
  if (
    !Array.isArray(body.typologies) ||
    body.typologies.length === 0
  ) {
    return NextResponse.json(
      { error: "At least one typology required" },
      { status: 400 }
    );
  }

  const reference = generateRef();
  const supabase = createServiceClient();

  const { error } = await supabase.from("inscriptions_b2b").insert({
    reference,
    raison_sociale: body.raison_sociale,
    immatriculation: body.immatriculation,
    pays: body.pays,
    secteur: body.secteur,
    secteur_autre: body.secteur_autre || null,
    site_web: body.site_web || null,
    signataire_prenom: body.signataire_prenom,
    signataire_nom: body.signataire_nom,
    signataire_fonction: body.signataire_fonction,
    signataire_email: body.signataire_email,
    signataire_tel: body.signataire_tel,
    prestations: body.prestations,
    prestation_autre: body.prestation_autre || null,
    typologies: body.typologies,
    volume: body.volume,
    frequence: body.frequence,
    brief: body.brief || null,
    creneau_date: body.creneau?.date || null,
    creneau_time: body.creneau?.time || null,
    mode_rdv: body.mode_rdv || null,
    langue: body.langue || null,
    consent_rgpd: !!body.consent_rgpd,
    consent_news: !!body.consent_news,
  });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[/api/inscription-b2b] insert error:", error);
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
  return `HID-B2B-${ymd}-${rand}`;
}

function pad(n) {
  return String(n).padStart(2, "0");
}
