import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * GET /api/auth/callback
 *
 * Callback OAuth (Google). Échange le code PKCE contre une session (cookies),
 * puis applique la règle "connexion uniquement" :
 *
 *  - Si l'e-mail Google correspond à un compte existant (inscription talent,
 *    inscription B2B, ou admin) → /dashboard (le middleware route les admins
 *    vers /admin).
 *  - Sinon → c'est un nouveau venu sans dossier : on déconnecte la session
 *    fraîchement créée par Supabase et on renvoie vers /signup avec un message.
 *    Google ne sert qu'à se reconnecter, pas à s'inscrire.
 *
 * Cette route est exclue du middleware (matcher) pour ne pas interférer avec
 * l'échange de code.
 */
export async function GET(request) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");

  if (oauthError || !code) {
    return NextResponse.redirect(`${origin}/login?error=oauth`);
  }

  const supabase = createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
    code
  );
  if (exchangeError) {
    return NextResponse.redirect(`${origin}/login?error=oauth`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email?.toLowerCase();

  if (!email) {
    await supabase.auth.signOut?.();
    return NextResponse.redirect(`${origin}/login?error=oauth`);
  }

  // Compte connu ? talent OU b2b OU admin.
  const service = createServiceClient();
  const [talent, b2b, admin] = await Promise.all([
    service
      .from("inscriptions_talents")
      .select("id")
      .ilike("email", email)
      .limit(1)
      .maybeSingle(),
    service
      .from("inscriptions_b2b")
      .select("id")
      .ilike("signataire_email", email)
      .limit(1)
      .maybeSingle(),
    service
      .from("admin_users")
      .select("id")
      .ilike("email", email)
      .limit(1)
      .maybeSingle(),
  ]);

  const hasAccount = Boolean(talent.data || b2b.data || admin.data);

  if (!hasAccount) {
    // Nouveau venu via Google sans dossier : pas d'inscription silencieuse.
    await supabase.auth.signOut?.();
    return NextResponse.redirect(`${origin}/signup?error=no-account`);
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
