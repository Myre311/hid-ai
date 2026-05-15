"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Auth store — onboarding-only state (branch choice, email, ephemeral data).
 * Authoritative session state lives in Supabase cookies; this store only tracks
 * the multi-step signup flow on the client.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      branch: null, // 'specialist' | 'engineer' | 'business'
      email: null,
      profileDraft: {},
      businessDraft: {},
      setBranch: (branch) => set({ branch }),
      setEmail: (email) => set({ email }),
      patchProfileDraft: (patch) =>
        set((state) => ({ profileDraft: { ...state.profileDraft, ...patch } })),
      patchBusinessDraft: (patch) =>
        set((state) => ({
          businessDraft: { ...state.businessDraft, ...patch },
        })),
      reset: () =>
        set({ branch: null, email: null, profileDraft: {}, businessDraft: {} }),
    }),
    {
      name: "hidai-auth",
      partialize: (state) => ({
        branch: state.branch,
        email: state.email,
        profileDraft: state.profileDraft,
        businessDraft: state.businessDraft,
      }),
    }
  )
);
