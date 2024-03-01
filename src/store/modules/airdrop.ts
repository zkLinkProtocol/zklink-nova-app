import { createSlice } from '@reduxjs/toolkit';

export interface airdropState {
    inviteCode: string
}

const initialState: airdropState = {
    inviteCode: ''
};

export const airdrop = createSlice({
    name: 'airdrop',
    initialState,
    reducers: {

        setInviteCode(state, { payload }) {
            console.log(payload);
            state.inviteCode = payload;
        }
    },
});

export const {  setInviteCode } = airdrop.actions;
export default airdrop.reducer;