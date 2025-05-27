import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './userSlice.js';
import { puzzleSlice } from './puzzleSlice.js';
import { blitzPuzzlesSlice } from './blitzPuzzlesSlice.js';

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        puzzle: puzzleSlice.reducer,
        puzzles: blitzPuzzlesSlice.reducer
    }
});