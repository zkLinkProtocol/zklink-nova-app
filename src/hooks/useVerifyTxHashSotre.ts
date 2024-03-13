import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_VERIFY_KEY } from "@/constants";

export type VerifyState = {
  txhashes: { txhash: string; rpcUrl: string }[];
  addTxHash: (txhash: string, rpcUrl: string) => void;
};

export const useVerifyStore = create<VerifyState>()(
  persist(
    (set, get) => ({
      txhashes: [],
      addTxHash: (txhash: string, rpcUrl: string) =>
        set({ txhashes: [{ txhash, rpcUrl }, ...get().txhashes] }),
    }),
    {
      name: STORAGE_VERIFY_KEY, // name of the item in the storage (must be unique)
    }
  )
);
