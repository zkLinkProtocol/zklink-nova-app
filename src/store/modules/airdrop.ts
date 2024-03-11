import { Invite, Twitter } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface airdropState {
    viewStatus: number,
    inviteCode: string,
    isGroupLeader: boolean,
    signature: string,
    twitterAuthCode: string,
    twitter: Twitter | null,
    invite: Invite | null
}

const initialState: airdropState = {
    viewStatus: 0,
    inviteCode: '',
    isGroupLeader: false,
    signature: '',
    twitterAuthCode: '',
    twitter: null,
    invite: null,
};

export const airdrop = createSlice({
    name: 'airdrop',
    initialState,
    reducers: {
        setViewStatus(state, action: PayloadAction<number>) {
            state.viewStatus = action.payload
        },
        setInviteCode(state, action: PayloadAction<string>) {
            state.inviteCode = action.payload
        },
        setIsGroupLeader(state, action: PayloadAction<boolean>) {
            state.isGroupLeader = action.payload
        },
        setSignature(state, action: PayloadAction<string>) {
            state.signature = action.payload
        },
        setTwitterAuthCode(state, action: PayloadAction<string>) {
            state.twitterAuthCode = action.payload
        },
        setTwitter(state, action: PayloadAction<Twitter | null>) {
            state.twitter = action.payload
        },
        setInvite(state, action: PayloadAction<Invite | null>) {
            state.invite = action.payload;
        },
    },
});

export const { setViewStatus, setInviteCode, setIsGroupLeader, setSignature, setTwitterAuthCode, setTwitter, setInvite, } = airdrop.actions;
export default airdrop.reducer;