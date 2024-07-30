import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LanguageStore = {
  language: string;
  setLanguage: (language: string) => void;
};

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: "en",
      setLanguage: (language: string) => {
        set({ language });
      },
    }),
    {
      name: "LanguageStore",
    }
  )
);
