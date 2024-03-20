import { STORAGE_NETWORK_KEY } from "@/constants";

import { create } from "zustand";

export type NetworkStore = {
  networkKey?: string;
  setNetworkKey: (networkKey: string) => void;
};
const nodeType = import.meta.env.VITE_NODE_TYPE;

export const useBridgeNetworkStore = create<NetworkStore>()((set) => ({
  networkKey: localStorage.getItem(STORAGE_NETWORK_KEY)
    ? localStorage.getItem(STORAGE_NETWORK_KEY)!
    : nodeType === "nexus-goerli"
    ? "goerli"
    : "ethereum",
  setNetworkKey: (networkKey: string) => {
    localStorage.setItem(STORAGE_NETWORK_KEY, networkKey);
    set({
      networkKey,
    });
  },
}));
