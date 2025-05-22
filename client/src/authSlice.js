import { createSlice } from '@reduxjs/toolkit';
import { loginUser, signUpUser } from "./authThunk.js";

const initialState = {
    isLoggedIn: false,
    status: "none",
    login: null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut(state) {
            state.isLoggedIn = false;
            state.login = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = "done";
                state.isLoggedIn = true;
                state.login = action.payload.login;
            })
            .addCase(loginUser.rejected, (state) => {
                state.status = "rejected";
            });
        builder
            .addCase(signUpUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.status = "done";
                state.isLoggedIn = true;
                state.login = action.payload.login;
            })
            .addCase(signUpUser.rejected, (state) => {
                state.status = "rejected";
            })    
    }
});

export const {logOut} = authSlice.actions;