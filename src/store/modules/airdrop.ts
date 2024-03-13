import { Invite, Twitter } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface airdropState {
  viewStatus: number;
  inviteCode: string;
  isGroupLeader: boolean;
  signature: string;
  twitterAuthCode: string;
  twitterAccessToken: string;
  depositStatus: string;
  twitter: Twitter | null;
  invite: Invite | null;
  depositL1TxHash: string;
  campaignStart: boolean;
  isActiveUser: boolean;

  depositChainId: string | number;
  depositTx: string;
}

const initialState: airdropState = {
  viewStatus: 1,
  inviteCode: "",
  isGroupLeader: false,
  signature: "",
  twitterAuthCode: "",
  twitterAccessToken: "",
  depositStatus: "",
  twitter: null,
  invite: null,
  depositL1TxHash: "",
  campaignStart: false,
  isActiveUser: false,

  depositChainId: "",
  depositTx: "",
};

export const airdrop = createSlice({
  name: "airdrop",
  initialState,
  reducers: {
    setViewStatus(state, action: PayloadAction<number>) {
      state.viewStatus = action.payload;
    },
    setInviteCode(state, action: PayloadAction<string>) {
      state.inviteCode = action.payload;
    },
    setIsGroupLeader(state, action: PayloadAction<boolean>) {
      state.isGroupLeader = action.payload;
    },
    setSignature(state, action: PayloadAction<string>) {
      state.signature = action.payload;
    },
    setTwitterAuthCode(state, action: PayloadAction<string>) {
      state.twitterAuthCode = action.payload;
    },
    setTwitterAccessToken(state, action: PayloadAction<string>) {
      state.twitterAccessToken = action.payload;
    },
    setDepositStatus(state, action: PayloadAction<string>) {
      state.depositStatus = action.payload;
    },
    setTwitter(state, action: PayloadAction<Twitter | null>) {
      state.twitter = action.payload;
    },
    setInvite(state, action: PayloadAction<Invite | null>) {
      state.invite = action.payload;
    },
    setDepositL1TxHash(state, action: PayloadAction<string | null>) {
      state.depositL1TxHash = action.payload ?? "";
    },
    setCampaignStart(state, action: PayloadAction<boolean>) {
      state.campaignStart = action.payload;
    },
    setIsActiveUser(state, action: PayloadAction<boolean>) {
      state.isActiveUser = action.payload;
    },
    setDepositChainId(state, action: PayloadAction<string>) {
      state.depositChainId = action.payload;
    },
    setDepositTx(state, action: PayloadAction<string>) {
      state.depositTx = action.payload;
    },
  },
});

export const {
  setViewStatus,
  setInviteCode,
  setIsGroupLeader,
  setSignature,
  setTwitterAuthCode,
  setTwitterAccessToken,
  setTwitter,
  setInvite,
  setDepositStatus,
  setDepositL1TxHash,
  setCampaignStart,
  setIsActiveUser,
  setDepositChainId,
  setDepositTx,
} = airdrop.actions;
export default airdrop.reducer;
