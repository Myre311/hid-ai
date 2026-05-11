import { requireAdmin } from "@/lib/admin/guard";
import { toCsv, csvHeaders } from "@/lib/admin/csv";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return new Response(JSON.stringify({ error: guard.error }), {
      status: guard.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Talents + leur session active (pour le score)
  const { data: talents } = await guard.service
    .from("inscriptions_talents")
    .select("*")
    .order("created_at", { ascending: false });

  const ids = (talents || []).map((t) => t.id);
  let sessionsByT = {};
  if (ids.length > 0) {
    const { data: sessions } = await guard.service
      .from("evaluation_sessions")
      .select("inscription_talent_id, status, ai_native_score, activated_at")
      .in("inscription_talent_id", ids);
    sessionsByT = (sessions || []).reduce((acc, s) => {
      acc[s.inscription_talent_id] = s;
      return acc;
    }, {});
  }

  const rows = (talents || []).map((t) => ({ ...t, _session: sessionsByT[t.id] }));

  const csv = toCsv(rows, [
    { label: "Référence", value: "reference" },
    { label: "Prénom", value: "prenom" },
    { label: "Nom", value: "nom" },
    { label: "Email", value: "email" },
    { label: "Téléphone", value: "telephone" },
    { label: "Date naissance", value: "date_naissance" },
    { label: "Métier", value: (r) => (r.metier === "engineer" ? "AI Engineer" : "AI Specialist") },
    { label: "Pays", value: "pays" },
    { label: "Ville", value: "ville" },
    { label: "Niveau études", value: "niveau_etudes" },
    { label: "Compétences", value: (r) => (r.competences || []).join("; ") },
    { label: "Type document", value: "doc_type" },
    { label: "Domaine éval", value: "domaine" },
    { label: "Statut éval", value: (r) => r._session?.status || "non démarrée" },
    { label: "Score AI-Native", value: (r) => r._session?.ai_native_score ?? "" },
    { label: "Activé le", value: (r) => r._session?.activated_at || "" },
    { label: "Consent RGPD", value: (r) => (r.consent_rgpd ? "OUI" : "NON") },
    { label: "Inscrite le", value: "created_at" },
  ]);

  const today = new Date().toISOString().slice(0, 10);
  return new Response(csv, { headers: csvHeaders(`hid-ai-talents-${today}.csv`) });
}
