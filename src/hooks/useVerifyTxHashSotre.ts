import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_VERIFY_TX_KEY } from "@/constants";

export type VerifyState = {
  txhashes: { [address: string]: { txhash: string; rpcUrl: string }[] };
  addTxHash: (address: string, txhash: string, rpcUrl: string) => void;
};

export const useVerifyStore = create<VerifyState>()(
  persist(
    (set, get) => ({
      txhashes: {},
      addTxHash: (address: string, txhash: string, rpcUrl: string) => {
        const addressTxhashes = get().txhashes[address] || [];
        addressTxhashes.unshift({ txhash, rpcUrl });
        set({ txhashes: { ...get().txhashes, [address]: addressTxhashes } });
      },
    }),
    {
      name: STORAGE_VERIFY_TX_KEY, // name of the item in the storage (must be unique)
    }
  )
);
