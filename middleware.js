import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Vérifie si un user_id est dans admin_users — query directe sur l'API REST
 * Supabase avec le service-role. On n'utilise pas le user-client ici parce que
 * la propagation du JWT depuis les cookies vers les requêtes PostgREST n'est
 * pas fiable dans le contexte middleware Edge (le user-client de @supabase/ssr
 * ne joint pas systématiquement l'Authorization header aux requêtes from()).
 */
async function fetchAdminRole(userId) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !userId) return null;
  try {
    const res = await fetch(
      `${url}/rest/v1/admin_users?select=role&user_id=eq.${userId}`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return Array.isArray(rows) && rows[0]?.role ? rows[0].role : null;
  } catch {
    return null;
  }
}

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];

export async function middleware(request) {
  const { response, user } = await updateSession(request);

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  // Dev-only bypass: when Supabase isn't wired yet, allow previews.
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (isProtected && !user && supabaseConfigured) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Vérifie le statut admin une seule fois pour les deux règles ci-dessous :
  //  1. /admin/*    : non-admin → redirect /?error=admin-required
  //  2. /dashboard  : admin     → redirect /admin (pas de session candidat fantôme)
  const needsAdminCheck =
    user &&
    supabaseConfigured &&
    (pathname.startsWith("/admin") || pathname === "/dashboard" || pathname.startsWith("/dashboard/"));

  if (needsAdminCheck) {
    const role = await fetchAdminRole(user.id);
    const isAdmin = Boolean(role);

    if (pathname.startsWith("/admin") && !isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("error", "admin-required");
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/dashboard") && isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api/auth/callback).*)",
  ],
};
