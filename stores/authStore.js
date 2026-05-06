"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Auth store — onboarding-only state (branch choice, phone, ephemeral data).
 * Authoritative session state lives in Supabase cookies; this store only tracks
 * the multi-step signup flow on the client.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      branch: null, // 'specialist' | 'engineer' | 'business'
      phone: null,
      profileDraft: {},
      businessDraft: {},
      setBranch: (branch) => set({ branch }),
      setPhone: (phone) => set({ phone }),
      patchProfileDraft: (patch) =>
        set((state) => ({ profileDraft: { ...state.profileDraft, ...patch } })),
      patchBusinessDraft: (patch) =>
        set((state) => ({
          businessDraft: { ...state.businessDraft, ...patch },
        })),
      reset: () =>
        set({ branch: null, phone: null, profileDraft: {}, businessDraft: {} }),
    }),
    {
      name: "hidai-auth",
      partialize: (state) => ({
        branch: state.branch,
        phone: state.phone,
        profileDraft: state.profileDraft,
        businessDraft: state.businessDraft,
      }),
    }
  )
);
