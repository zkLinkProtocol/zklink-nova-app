import { Invite, Twitter } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface airdropState {
    inviteCode: string | null,
    isGroupLeader: boolean,
    signature: string,
    twitter: Twitter | null,
    invite: Invite | null
}

const initialState: airdropState = {
    inviteCode: null,
    isGroupLeader: false,
    signature: '',
    twitter: null,
    invite: null,
};

export const airdrop = createSlice({
    name: 'airdrop',
    initialState,
    reducers: {
        setInviteCode(state, action: PayloadAction<string>) {
            state.inviteCode = action.payload
        },
        setIsGroupLeader(state, action: PayloadAction<boolean>) {
            state.isGroupLeader = action.payload
        },
        setSignature(state, action: PayloadAction<string>) {
            state.signature = action.payload
        },
        setTwitter(state, action: PayloadAction<Twitter | null>) {
            state.twitter = action.payload
        },
        setInvite(state, action: PayloadAction<Invite | null>) {
            state.invite = action.payload;
        },
    },
});

export const { setInviteCode, setSignature, setInvite, setIsGroupLeader, setTwitter } = airdrop.actions;
export default airdrop.reducer;