import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReCaptchaStore = {
  reCaptchaValue: string;
  reCaptchaTs: number;
  setReCaptchaValue: (reCaptchaValue: string) => void;
  setReCaptchaTs: (reCaptchaTs: number) => void;
};

export const useReCaptchaStore = create<ReCaptchaStore>()(
  persist(
    (set, get) => ({
      reCaptchaValue: "",
      reCaptchaTs: 0,
      setReCaptchaValue: (reCaptchaValue: string) => {
        set({ reCaptchaValue });
      },
      setReCaptchaTs: (reCaptchaTs: number) => {
        set({ reCaptchaTs });
      },
    }),
    {
      name: "ReCaptchaStore",
    }
  )
);
