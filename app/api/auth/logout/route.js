import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * POST /api/auth/logout
 *
 * Déconnexion Supabase fiable. Point clé : les cookies effacés par
 * signOut() doivent être écrits sur LA réponse renvoyée. On crée donc la
 * réponse d'abord, puis un client Supabase dont les handlers cookies
 * écrivent sur cette réponse précise. Filet de sécurité : purge explicite
 * de tout cookie `sb-*` restant.
 *
 *  - Accept: application/json  → { ok: true }   (appels fetch côté client)
 *  - sinon                      → 303 vers /login (form-submit classiques)
 */
export async function POST(request) {
  const wantsJson = (request.headers.get("accept") || "")
    .toLowerCase()
    .includes("application/json");

  const response = wantsJson
    ? NextResponse.json({ ok: true })
    : NextResponse.redirect(new URL("/login", request.nextUrl.origin), {
        status: 303,
      });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          response.cookies.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    });
    try {
      await supabase.auth.signOut();
    } catch {
      // on purge quand même les cookies ci-dessous
    }
  }

  // Filet de sécurité : supprime explicitement tout cookie de session sb-*
  for (const c of request.cookies.getAll()) {
    if (c.name.startsWith("sb-")) {
      response.cookies.set({ name: c.name, value: "", maxAge: 0, path: "/" });
    }
  }

  return response;
}
