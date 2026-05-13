import Link from "next/link";
import { ArrowLeft, Mail, Phone, Clock } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { MessageReplyPanel } from "@/components/admin/MessageReplyPanel";

export const metadata = { title: "Admin · Message" };
export const dynamic = "force-dynamic";

const TYPE_LABELS = { talent: "Talent", b2b: "B2B", press: "Presse", career: "Carrière", other: "Autre" };

export default async function AdminMessageDetail({ params }) {
  const service = createServiceClient();
  const { data: m } = await service
    .from("contact_messages")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!m) {
    return (
      <div className="max-w-xl">
        <Link href="/admin/messages" className="inline-flex items-center gap-1.5 text-xs text-foreground/55 mb-4">
          <ArrowLeft className="h-3 w-3" /> Retour
        </Link>
        <p className="t-body">Message introuvable.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Link
        href="/admin/messages"
        className="inline-flex items-center gap-1.5 text-xs text-foreground/55 hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-3 w-3" /> Retour à la liste
      </Link>

      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
          {TYPE_LABELS[m.type] || m.type} · reçu le {new Date(m.created_at).toLocaleString("fr-FR")}
        </p>
        <h1 className="t-h2-md">{m.sujet}</h1>
        <div className="text-sm text-foreground/55 flex flex-wrap gap-4 mt-1">
          <span><strong className="text-foreground/85">{m.prenom} {m.nom}</strong></span>
          <span><Mail className="inline h-3.5 w-3.5 mr-1" />{m.email}</span>
          {m.telephone && <span><Phone className="inline h-3.5 w-3.5 mr-1" />{m.telephone}</span>}
          <span><Clock className="inline h-3.5 w-3.5 mr-1" />Status : <strong>{m.status}</strong></span>
        </div>
      </header>

      <section className="rounded-lg border border-white/10 bg-surface p-5">
        <h2 className="text-xs uppercase tracking-[0.18em] text-foreground/50 mb-3">Message reçu</h2>
        <pre className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap font-sans">
          {m.message}
        </pre>
      </section>

      <MessageReplyPanel message={m} />
    </div>
  );
}
