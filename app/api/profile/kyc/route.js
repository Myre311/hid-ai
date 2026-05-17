import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/profile/kyc
 * Dépôt des pièces d'identité depuis le dashboard talent. Auth requise.
 * FormData : `payload` (JSON: doc_type, antecedents?) + fichiers
 * (doc_recto, doc_verso?, selfie). Upload bucket kyc-documents puis
 * UPDATE de l'inscription du user → statut `kyc_pending` (validation
 * admin requise ensuite pour débloquer les missions).
 */
export async function POST(request) {
  const userClient = createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const email = user.email.toLowerCase();

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json(
      { error: "Expected multipart/form-data" },
      { status: 400 }
    );
  }

  let body;
  try {
    body = JSON.parse(formData.get("payload"));
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!["cni", "passeport", "permis"].includes(body.doc_type)) {
    return NextResponse.json({ error: "Type de document invalide" }, { status: 400 });
  }

  const docRecto = formData.get("doc_recto");
  const docVerso = formData.get("doc_verso");
  const selfie = formData.get("selfie");

  if (!(docRecto instanceof File))
    return NextResponse.json({ error: "Recto requis" }, { status: 400 });
  if (!(selfie instanceof File))
    return NextResponse.json({ error: "Selfie requis" }, { status: 400 });
  if (
    (body.doc_type === "cni" || body.doc_type === "permis") &&
    !(docVerso instanceof File)
  )
    return NextResponse.json({ error: "Verso requis" }, { status: 400 });

  const service = createServiceClient();

  const { data: inscription } = await service
    .from("inscriptions_talents")
    .select("id, reference, status")
    .ilike("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!inscription) {
    return NextResponse.json(
      { error: "Aucun dossier d'inscription trouvé pour ce compte." },
      { status: 404 }
    );
  }

  const uploadFile = async (file, label) => {
    const ext = (file.name?.split(".").pop() || "bin").toLowerCase();
    const path = `talent/${inscription.reference}/${label}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error } = await service.storage
      .from("kyc-documents")
      .upload(path, bytes, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
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
    console.error("[/api/profile/kyc] storage error:", err);
    return NextResponse.json(
      { error: err.message || "Upload échoué" },
      { status: 500 }
    );
  }

  const { error: updErr } = await service
    .from("inscriptions_talents")
    .update({
      doc_type: body.doc_type,
      doc_recto_path,
      doc_verso_path: doc_verso_path || null,
      selfie_path,
      antecedents: body.antecedents || null,
      // Pièces déposées → en attente de validation admin (déblocage missions).
      status: "kyc_pending",
    })
    .eq("id", inscription.id);

  if (updErr) {
    // eslint-disable-next-line no-console
    console.error("[/api/profile/kyc] update error:", updErr);
    return NextResponse.json(
      { error: updErr.message || "Mise à jour échouée" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
