import { createSlice } from '@reduxjs/toolkit';
import { getPuzzle } from "./puzzleThunk.js";

const initialState = {
    puzzle_id: 0,
    fen: "",
    rating: 0,
    moves: [],
    moveMade: false,
    promotionMade: false,
    userMove: "",
    isWhiteMove: true,
    themes: "",
    status: "none",
    error: null
};

export const puzzleSlice = createSlice({
    name: 'puzzle',
    initialState,
    reducers: {
        resetState(state) {
            state.puzzle_id = 0;
            state.fen = "";
            state.rating = 0;
            state.moves = [];
            state.moveMade = false;
            state.promotionMade = false;
            state.isWhiteMove = true;
            state.themes = "";
            state.status = "none";
            state.error = null
        },
        makeMove(state, action) {
            state.moveMade = true;
            state.userMove = action.payload;
        },
        makePromotion(state, action) {
            state.promotionMade = true;
            state.userMove = action.payload;
        },
        moveIsMade(state){
            state.moveMade = false;
            state.promotionMade = false;
            state.userMove = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPuzzle.pending, (state) => {
                state.status = "loading";
                state.moves = [];
                state.fen = "";
            })
            .addCase(getPuzzle.fulfilled, (state, action) => {
                state.puzzle_id = action.payload.puzzle_id;
                state.fen = action.payload.fen;
                state.rating = action.payload.rating;
                state.moves = action.payload.moves.split(" ");
                state.isWhiteMove = action.payload.fen.split(" ")[1] === "w";
                state.themes = action.payload.themes;
                state.status = "done";
                state.error = null;
            })
            .addCase(getPuzzle.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload.message;
                state.moves = [];
                state.fen = "";
            });
    }
});

export const {resetState, makeMove, makePromotion, moveIsMade} = puzzleSlice.actions;