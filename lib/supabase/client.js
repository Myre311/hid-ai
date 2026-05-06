"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for browser components.
 * Returns a no-op-safe stub during the bootstrap phase if env vars are missing,
 * so that the UI compiles before Supabase is wired up.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return makeStub("browser");
  }
  return createBrowserClient(url, key);
}

function makeStub(label) {
  const fail = async () => ({
    data: null,
    error: { message: `Supabase not configured (${label})` },
  });
  return {
    auth: {
      getSession: fail,
      getUser: fail,
      signOut: fail,
      signInWithOtp: fail,
      verifyOtp: fail,
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: fail, maybeSingle: fail }), single: fail, maybeSingle: fail }),
      insert: fail,
      update: () => ({ eq: fail }),
      upsert: fail,
      delete: () => ({ eq: fail }),
    }),
  };
}
