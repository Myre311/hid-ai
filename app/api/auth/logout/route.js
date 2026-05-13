import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/logout
 *
 * Déclenche la déconnexion Supabase (invalide le refresh token + clear cookies)
 * puis renvoie soit :
 *  - une redirection 303 vers la home (pour les form-submit classiques)
 *  - du JSON { ok: true } (pour les appels fetch côté client avec Accept: application/json)
 *
 * Le 303 force le navigateur à faire un GET sur / après le POST — c'est le
 * comportement attendu après une action form-submit (sinon il afficherait la
 * réponse JSON brute à l'écran).
 */
export async function POST(request) {
  const supabase = createClient();
  await supabase.auth.signOut?.();

  const wantsJson = (request.headers.get("accept") || "")
    .toLowerCase()
    .includes("application/json");

  if (wantsJson) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.redirect(new URL("/", request.nextUrl.origin), { status: 303 });
}
