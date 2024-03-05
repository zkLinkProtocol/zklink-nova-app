import { STORAGE_NETWORK_KEY } from "@/constants";

import { create } from "zustand";

export type NetworkStore = {
  networkKey?: string;
  setNetworkKey: (networkKey: string) => void;
};

export const useBridgeNetworkStore = create<NetworkStore>()((set) => ({
  setNetworkKey: (networkKey: string) => {
    localStorage.setItem(STORAGE_NETWORK_KEY, networkKey);
    set({
      networkKey,
    });
  },
}));
