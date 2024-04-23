import { create } from "zustand";

export type RemainMintCount = {
  remainMintCount: number;
  updateRemainMintCount: (num: number) => void;
};

export const useRemainMintCount = create<RemainMintCount>((set) => ({
  remainMintCount: 0,
  updateRemainMintCount: (num: number) => set({ remainMintCount: num }),
}));
