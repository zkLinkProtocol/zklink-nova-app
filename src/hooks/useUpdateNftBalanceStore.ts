import { create } from "zustand";

interface UpdateNftBalanceStore {
  factor: number;
  updateFactor: () => void;
}

export const useUpdateNftBalanceStore = create<UpdateNftBalanceStore>(
  (set) => ({
    factor: 0,
    updateFactor: () => set((state) => ({ factor: state.factor + 1 })),
  })
);
