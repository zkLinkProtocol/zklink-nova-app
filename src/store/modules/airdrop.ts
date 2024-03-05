import { createSlice } from '@reduxjs/toolkit';

export interface airdropState {
    inviteCode: string,
    isTeamCreator: boolean,
    signature: string,
    signatureStatus: number,
}

const initialState: airdropState = {
    inviteCode: '',
    isTeamCreator: false,
    signature: '',
    signatureStatus: 0
};

export const airdrop = createSlice({
    name: 'airdrop',
    initialState,
    reducers: {
        setInviteCode(state, { payload }) {
            state.inviteCode = payload;
        },
        setIsTeamCreator(state, { payload }) {
            state.isTeamCreator = payload;
        },
        setSignature(state, { payload }) {
            state.signature = payload;
        },
        setSignatureStatus(state, { payload }) {
            state.signatureStatus = payload;
        }
    },
});

export const { setInviteCode, setSignature, setSignatureStatus, setIsTeamCreator } = airdrop.actions;
export default airdrop.reducer;