import { createSlice } from '@reduxjs/toolkit';
import { loginUser, signUpUser } from "./authThunk.js";
import { solvedPuzzle } from './puzzleThunk.js';

const initialState = {
    isLoggedIn: false,
    login: null,
    id: -1,
    admin: false,
    status: "none",
    error: null,
    rating: 1000,
    puzzles_solved: 0,
    two_min_record: 0,
    two_min_attempts: 0,
    five_min_record: 0,
    five_min_attempts: 0
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logOut(state) {
            state.isLoggedIn = false;
            state.login = null;
        },
        new_two_min_record(state, action) {
            state.two_min_record = action.payload;
        },
        two_min_gamed(state) {
            state.two_min_attempts += 1;
        },
        new_five_min_record(state, action) {
            state.five_min_record = action.payload;
        },
        five_min_gamed(state) {
            state.five_min_attempts += 1;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = "done";
                state.error = null;
                state.isLoggedIn = true;
                state.login = action.payload.login;
                state.id = action.payload.user_id;
                state.admin = action.payload.admin;
                state.rating = action.payload.puzzle_rating;
                state.puzzles_solved = action.payload.puzzles_solved;
                state.two_min_record = action.payload.two_min_record;
                state.two_min_attempts = action.payload.two_min_attempts;
                state.five_min_record = action.payload.five_min_record;
                state.five_min_attempts = action.payload.five_min_attempts;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload.message;
            });
        builder
            .addCase(signUpUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.status = "done";
                state.error = null;
                state.isLoggedIn = true;
                state.login = action.payload.login;
                state.id = action.payload.user_id;
                state.admin = action.payload.admin;
                state.rating = action.payload.puzzle_rating;
                state.puzzles_solved = action.payload.puzzles_solved;
                state.two_min_record = action.payload.two_min_record;
                state.two_min_attempts = action.payload.two_min_attempts;
                state.five_min_record = action.payload.five_min_record;
                state.five_min_attempts = action.payload.five_min_attempts;
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload.message;
            });
        builder
            .addCase(solvedPuzzle.pending, (state) => {
                state.status = "loading";
            })
            .addCase(solvedPuzzle.fulfilled, (state, action) => {
                state.status = "done";
                state.error = null;
                state.rating = action.payload.puzzle_rating;
                state.puzzles_solved = action.payload.puzzles_solved;
            })
            .addCase(solvedPuzzle.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload.message;
            })
    }
});

export const {logOut, new_two_min_record, two_min_gamed, new_five_min_record, five_min_gamed } = userSlice.actions;