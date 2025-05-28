import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './userSlice.js';
import { puzzleSlice } from './puzzleSlice.js';
import { blitzPuzzlesSlice } from './blitzPuzzlesSlice.js';
import { seriesPuzzlesSlice } from './seriesPuzzlesSlice.js';
import { bestUsers } from './bestSlice.js';
import { navigationSlice } from './navigationBlockSlice.js';

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        puzzle: puzzleSlice.reducer,
        puzzles: blitzPuzzlesSlice.reducer,
        seriesPuzzles: seriesPuzzlesSlice.reducer,
        bestUsers: bestUsers.reducer,
        navigation: navigationSlice.reducer
    }
});