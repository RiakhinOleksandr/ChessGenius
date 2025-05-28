import { createSlice } from '@reduxjs/toolkit';
import { getPuzzlesForSeries } from "./puzzleThunk.js";

const initialState = {
    puzzles: [{
        puzzle_id: 0,
        fen: "",
        rating: 0,
        moves: [],
        moveMade: false,
        promotionMade: false,
        userMove: "",
        isWhiteMove: true
    }],
    status: "none",
    error: null
};

export const seriesPuzzlesSlice = createSlice({
    name: 'seriesPuzzles',
    initialState,
    reducers: {
        resetSeriesState(state) {
            state.puzzles = [];
            state.status = "none";
        },
        makeMoveForSeries(state, action) {
            let n = action.payload.n;
            state.puzzles[n][0].moveMade = true;
            state.puzzles[n][0].userMove = action.payload.userMove;
        },
        makePromotionForSeries(state, action) {
            let n = action.payload.n;
            state.puzzles[n][0].promotionMade = true;
            state.puzzles[n][0].userMove = action.payload.userMove;
        },
        moveIsMadeForSeries(state, action){
            let n = action.payload.n;
            state.puzzles[n][0].moveMade = false;
            state.puzzles[n][0].promotionMade = false;
            state.puzzles[n][0].userMove = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPuzzlesForSeries.pending, (state) => {
                state.status = "loading";
                state.puzzles = [];
            })
            .addCase(getPuzzlesForSeries.fulfilled, (state, action) => {
                state.puzzles = action.payload;
                for(let i = 0; i < action.payload.length; i++){
                    state.puzzles[i][0].moves = action.payload[i][0].moves.split(" ");
                    state.puzzles[i][0].isWhiteMove = action.payload[i][0].fen.split(" ")[1] === "w";
                }
                state.status = "done";
                state.error = null;
            })
            .addCase(getPuzzlesForSeries.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload.message;
                state.puzzles = [];
            });
    }
});

export const {resetSeriesState, makeMoveForSeries, makePromotionForSeries, moveIsMadeForSeries} = seriesPuzzlesSlice.actions;