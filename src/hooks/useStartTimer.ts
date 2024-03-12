import { create } from "zustand";

export type StartTimerStore = {
  campaignStart: boolean;
  setCampaignStart: (start: boolean) => void;
};

export const useStartTimerStore = create<StartTimerStore>()((set) => ({
  campaignStart: false,
  setCampaignStart: (start: boolean) => {
    set({ campaignStart: start });
  },
}));
