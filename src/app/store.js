import { create } from "zustand";

export const useAppStore = create((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
  mood: "",
  setMood: (m) => set({ mood: m }),
}));
