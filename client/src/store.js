import { configureStore } from '@reduxjs/toolkit';
import {userSlice} from './userSlice.js';
import {puzzleSlice} from './puzzleSlice.js';

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        puzzle: puzzleSlice.reducer
    }
});