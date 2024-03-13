import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_VERIFY_KEY } from "@/constants";

export type VerifyState = {
  txhashes: string[];
  addTxHash: (txhash: string) => void;
};

export const useVerifyStore = create<VerifyState>()(
  persist(
    (set, get) => ({
      txhashes: [],
      addTxHash: (txhash: string) =>
        set({ txhashes: [txhash, ...get().txhashes] }),
    }),
    {
      name: STORAGE_VERIFY_KEY, // name of the item in the storage (must be unique)
    }
  )
);
