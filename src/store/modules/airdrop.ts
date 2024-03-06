import { Twitter } from '@/types';
import { createSlice } from '@reduxjs/toolkit';
export interface airdropState {
    inviteCode: string,
    isGroupLeader: boolean,
    signature: string,
    twitter: Twitter | null,
    isInvitedUser: boolean,
}

const initialState: airdropState = {
    inviteCode: '',
    isGroupLeader: false,
    signature: '',
    twitter: null,
    isInvitedUser: false,
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
        setInvitedUser(state, { payload }) {
            state.isInvitedUser = payload;
        },
        setTwitter(state, { payload }) {
            state.twitter = payload;
        }
    },
});

export const { setInviteCode, setSignature, setInvitedUser, setIsGroupLeader, setTwitter } = airdrop.actions;
export default airdrop.reducer;