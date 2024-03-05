import { createSlice } from '@reduxjs/toolkit';

export interface airdropState {
    inviteCode: string,
    signature: string,
    signatureStatus: number
}

const initialState: airdropState = {
    inviteCode: '',
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
        setSignature(state, { payload }) {
            state.signature = payload;
        },
        setSignatureStatus(state, { payload }) {
            state.signatureStatus = payload;
        }
    },
});

export const { setInviteCode, setSignature, setSignatureStatus } = airdrop.actions;
export default airdrop.reducer;