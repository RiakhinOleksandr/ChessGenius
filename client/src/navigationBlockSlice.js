import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    navigationBlocked: false
};

export const navigationSlice = createSlice({
    name: 'navigationBlocker',
    initialState,
    reducers: {
        blockNavigation(state) {
            state.navigationBlocked = true
        },
        unblockNavigation(state) {
            state.navigationBlocked = false
        }
    }
});

export const {blockNavigation, unblockNavigation} = navigationSlice.actions;