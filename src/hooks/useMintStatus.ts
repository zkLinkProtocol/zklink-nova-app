import { create } from "zustand";

export type MintStatus = {
  refreshBalanceId: number;
  updateRefreshBalanceId: () => void;
};

export const useMintStatus = create<MintStatus>((set, get) => ({
  refreshBalanceId: 0,
  updateRefreshBalanceId: () =>
    set({ refreshBalanceId: get().refreshBalanceId + 1 }),
}));
