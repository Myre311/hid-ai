import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase server client (App Router server components / route handlers).
 * Reads cookies via next/headers and writes them through.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const cookieStore = cookies();

  if (!url || !key) {
    return makeStub();
  }

  return createServerClient(url, key, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Server components cannot set cookies — silently ignored.
        }
      },
      remove(name, options) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // ignored
        }
      },
    },
  });
}

/** Service-role client for trusted server operations (OTP write, etc.). */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return makeStub();

  return createServerClient(url, serviceKey, {
    cookies: { get() {}, set() {}, remove() {} },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function makeStub() {
  const fail = async () => ({
    data: null,
    error: { message: "Supabase not configured" },
  });
  return {
    auth: {
      getSession: fail,
      getUser: fail,
      signOut: fail,
    },
    from: () => ({
      select: () => ({
        eq: () => ({ single: fail, maybeSingle: fail }),
        single: fail,
        maybeSingle: fail,
      }),
      insert: fail,
      update: () => ({ eq: fail }),
      upsert: fail,
      delete: () => ({ eq: fail }),
    }),
  };
}
