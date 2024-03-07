import { Invite, Twitter } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

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
        setInviteCode(state, { payload }) {
            state.inviteCode = payload;
        },
        setIsGroupLeader(state, { payload }) {
            state.isGroupLeader = payload;
        },
        setSignature(state, { payload }) {
            state.signature = payload;
        },
        setTwitter(state, { payload }) {
            state.twitter = payload;
        },
        setInvite(state, { payload }) {
            state.invite = payload;
        },
    },
});

export const { setInviteCode, setSignature, setInvite, setIsGroupLeader, setTwitter } = airdrop.actions;
export default airdrop.reducer;