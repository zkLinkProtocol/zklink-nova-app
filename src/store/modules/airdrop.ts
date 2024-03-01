import { createSlice } from '@reduxjs/toolkit';

export interface airdropState {
    currentStatus: number;
    inviteCode: string
}

const initialState: airdropState = {
    currentStatus: 0,
    inviteCode: ''
};

export const airdrop = createSlice({
    name: 'airdrop',
    initialState,
    reducers: {
        setCurrentStatus(state, { payload }) {
            console.log(payload);
            state.currentStatus = payload;
        },
        setInviteCode(state, { payload }) {
            console.log(payload);
            state.inviteCode = payload;
        }
    },
});

export const { setCurrentStatus, setInviteCode } = airdrop.actions;
export default airdrop.reducer;