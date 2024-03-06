import { Twitter } from '@/types';
import { createSlice } from '@reduxjs/toolkit';
export interface airdropState {
    inviteCode: string,
    isGroupLeader: boolean,
    signature: string,
    signatureStatus: number,
    twitter: Twitter | null
}

const initialState: airdropState = {
    inviteCode: '',
    isGroupLeader: false,
    signature: '',
    signatureStatus: 0,
    twitter: null
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
        setSignatureStatus(state, { payload }) {
            state.signatureStatus = payload;
        },
        setTwitter(state, { payload }) {
            state.twitter = payload;
        }
    },
});

export const { setInviteCode, setSignature, setSignatureStatus, setIsGroupLeader, setTwitter } = airdrop.actions;
export default airdrop.reducer;