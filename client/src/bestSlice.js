import { createSlice } from '@reduxjs/toolkit';
import { bestInPuzzle, bestInBlitz, bestInSeries } from "./bestUsersThunk.js";

const initialState = {
    bestPuzzleUsers: [],
    bestBlitzUsers: [],
    bestSeriesUsers: [],
    status: 'none',
    error: null
};

export const bestUsers = createSlice({
    name: 'bestUsers',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(bestInPuzzle.pending, (state) => {
                state.status = "loading";
            })
            .addCase(bestInPuzzle.fulfilled, (state, action) => {
                state.bestPuzzleUsers = action.payload;
                state.status = "done";
                state.error = null;
            })
            .addCase(bestInPuzzle.rejected, (state, action) => {
                state.bestPuzzleUsers = [];
                state.status = "rejected";
                state.error = action.payload.message;
            });
        builder
            .addCase(bestInBlitz.pending, (state) => {
                state.status = "loading";
            })
            .addCase(bestInBlitz.fulfilled, (state, action) => {
                state.bestBlitzUsers = action.payload;
                state.status = "done";
                state.error = null;
            })
            .addCase(bestInBlitz.rejected, (state, action) => {
                state.bestBlitzUsers = [];
                state.status = "rejected";
                state.error = action.payload.message;
            });
        builder
            .addCase(bestInSeries.pending, (state) => {
                state.status = "loading";
            })
            .addCase(bestInSeries.fulfilled, (state, action) => {
                state.bestSeriesUsers = action.payload;
                state.status = "done";
                state.error = null;
            })
            .addCase(bestInSeries.rejected, (state, action) => {
                state.bestSeriesUsers = [];
                state.status = "rejected";
                state.error = action.payload.message;
            });
    }
});