import { createSlice } from '@reduxjs/toolkit';

export interface airdropState {
    inviteCode: string,
    signature: string
}

const initialState: airdropState = {
    inviteCode: '',
    signature: ''
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
        }
    },
});

export const { setInviteCode, setSignature } = airdrop.actions;
export default airdrop.reducer;