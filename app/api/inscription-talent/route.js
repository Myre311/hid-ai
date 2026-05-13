import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/inscription-talent
 * Reçoit un FormData multipart : un champ `payload` (JSON) + 3 fichiers
 * (doc_recto, doc_verso?, selfie).
 *
 * Étapes :
 *  1. Parse FormData
 *  2. Validation minimale
 *  3. Upload des fichiers dans le bucket `kyc-documents` → talent/{reference}/...
 *  4. Insert dans inscriptions_talents avec les paths
 *  5. Retourne { reference }
 */
export async function POST(request) {
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json(
      { error: "Expected multipart/form-data" },
      { status: 400 }
    );
  }

  const payloadStr = formData.get("payload");
  if (!payloadStr || typeof payloadStr !== "string") {
    return NextResponse.json(
      { error: "Missing payload field" },
      { status: 400 }
    );
  }

  let body;
  try {
    body = JSON.parse(payloadStr);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in payload" },
      { status: 400 }
    );
  }

  // Validation
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
    "doc_type",
  ];
  for (const k of required) {
    if (!body[k] || (typeof body[k] === "string" && !body[k].trim())) {
      return NextResponse.json(
        { error: `Missing field: ${k}` },
        { status: 400 }
      );
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
  if (!["cni", "passeport", "permis"].includes(body.doc_type)) {
    return NextResponse.json({ error: "Invalid doc_type" }, { status: 400 });
  }

  const docRecto = formData.get("doc_recto");
  const docVerso = formData.get("doc_verso");
  const selfie = formData.get("selfie");

  if (!(docRecto instanceof File))
    return NextResponse.json({ error: "doc_recto required" }, { status: 400 });
  if (!(selfie instanceof File))
    return NextResponse.json({ error: "selfie required" }, { status: 400 });
  if ((body.doc_type === "cni" || body.doc_type === "permis") && !(docVerso instanceof File))
    return NextResponse.json({ error: "doc_verso required" }, { status: 400 });

  const reference = generateRef();
  const supabase = createServiceClient();

  // Upload helper
  const uploadFile = async (file, label) => {
    const ext = (file.name?.split(".").pop() || "bin").toLowerCase();
    const path = `talent/${reference}/${label}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage
      .from("kyc-documents")
      .upload(path, bytes, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
    if (error) throw new Error(`upload ${label}: ${error.message}`);
    return path;
  };

  let doc_recto_path, doc_verso_path, selfie_path;
  try {
    doc_recto_path = await uploadFile(docRecto, "recto");
    if (docVerso instanceof File) {
      doc_verso_path = await uploadFile(docVerso, "verso");
    }
    selfie_path = await uploadFile(selfie, "selfie");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[/api/inscription-talent] storage error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }

  const { error } = await supabase.from("inscriptions_talents").insert({
    reference,
    prenom: body.prenom,
    nom: body.nom,
    // Normalisé en lowercase pour matcher la normalisation que Supabase Auth
    // applique systématiquement aux emails (sinon mismatch case-sensitive
    // lors des lookups dashboard / /api/evaluation/start).
    email: (body.email || "").toLowerCase().trim(),
    telephone: body.telephone,
    date_naissance: body.date_naissance,
    pays: body.pays,
    ville: body.ville,
    metier: body.metier,
    niveau_etudes: body.niveau_etudes,
    competences: Array.isArray(body.competences) ? body.competences : [],
    doc_type: body.doc_type,
    doc_recto_path,
    doc_verso_path: doc_verso_path || null,
    selfie_path,
    antecedents: body.antecedents || null,
    modules_validated: body.modules || {},
    domaine: body.domaine || null,
    creneau_test_date: body.creneau_test?.date || null,
    creneau_test_time: body.creneau_test?.time || null,
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
