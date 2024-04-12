import { create } from "zustand";

export type MintStatus = {
  remainDrawCount: number;
  updateRemainDrawCount: (num: number) => void;
};

export const useRemainDrawCount = create<MintStatus>()((set) => ({
  remainDrawCount: 0,
  updateRemainDrawCount: (num: number) => {
    set({ remainDrawCount: num });
  },
}));
