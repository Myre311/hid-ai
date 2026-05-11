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

  const { data: rows } = await guard.service
    .from("inscriptions_b2b")
    .select("*")
    .order("created_at", { ascending: false });

  const csv = toCsv(rows || [], [
    { label: "Référence", value: "reference" },
    { label: "Statut", value: "status" },
    { label: "Raison sociale", value: "raison_sociale" },
    { label: "Immatriculation", value: "immatriculation" },
    { label: "Pays", value: "pays" },
    { label: "Secteur", value: (r) => (r.secteur_autre ? `${r.secteur} (${r.secteur_autre})` : r.secteur) },
    { label: "Site web", value: "site_web" },
    { label: "Signataire prénom", value: "signataire_prenom" },
    { label: "Signataire nom", value: "signataire_nom" },
    { label: "Signataire fonction", value: "signataire_fonction" },
    { label: "Signataire email", value: "signataire_email" },
    { label: "Signataire téléphone", value: "signataire_tel" },
    { label: "Prestations", value: (r) => (r.prestations || []).join("; ") },
    { label: "Typologies données", value: (r) => (r.typologies || []).join("; ") },
    { label: "Volume", value: "volume" },
    { label: "Fréquence", value: "frequence" },
    { label: "Brief", value: "brief" },
    { label: "Créneau date", value: "creneau_date" },
    { label: "Créneau heure", value: "creneau_time" },
    { label: "Mode RDV", value: "mode_rdv" },
    { label: "Langue", value: "langue" },
    { label: "Consent RGPD", value: (r) => (r.consent_rgpd ? "OUI" : "NON") },
    { label: "Consent newsletter", value: (r) => (r.consent_news ? "OUI" : "NON") },
    { label: "Reçue le", value: "created_at" },
  ]);

  const today = new Date().toISOString().slice(0, 10);
  return new Response(csv, { headers: csvHeaders(`hid-ai-b2b-${today}.csv`) });
}
