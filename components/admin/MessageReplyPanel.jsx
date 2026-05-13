"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

export function MessageReplyPanel({ message }) {
  const router = useRouter();
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);

  const alreadyAnswered = message.status === "answered";

  async function send() {
    if (reply.trim().length < 10) {
      toast.error("Réponse trop courte (10 caractères minimum)");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/messages/${message.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reply.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Réponse envoyée", {
        description: `À ${message.email}`,
      });
      setReply("");
      router.refresh();
    } catch (err) {
      toast.error("Envoi impossible", { description: err.message });
    } finally {
      setBusy(false);
    }
  }

  if (alreadyAnswered) {
    return (
      <div className="rounded-md border border-success/30 bg-success/5 p-4 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-success">
          Réponse envoyée le {new Date(message.replied_at).toLocaleString("fr-FR")}
        </p>
        <pre className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap font-sans">
          {message.reply_message}
        </pre>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-white/10 bg-surface p-4 flex flex-col gap-3">
      <label className="text-xs uppercase tracking-[0.18em] text-foreground/50">
        Répondre à {message.prenom} {message.nom} ({message.email})
      </label>
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder={`Bonjour ${message.prenom},\n\nMerci pour votre message…`}
        rows={8}
        maxLength={10000}
        className="w-full bg-[#1A1A1A] border border-white/10 rounded-md px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent leading-relaxed"
      />
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-foreground/40">{reply.length}/10000</span>
        <button
          type="button"
          onClick={send}
          disabled={busy || reply.trim().length < 10}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {busy ? "Envoi…" : "Envoyer la réponse"}
        </button>
      </div>
    </div>
  );
}
