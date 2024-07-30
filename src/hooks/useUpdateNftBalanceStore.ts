import { create } from "zustand";

interface UpdateNftBalanceStore {
  factor: number;
  updateFactory: () => void;
}

export const useUpdateNftBalanceStore = create<UpdateNftBalanceStore>(
  (set) => ({
    factor: 0,
    updateFactory: () => set((state) => ({ factor: state.factor + 1 })),
  })
);
