import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from './api/axios';

export const getPuzzle = createAsyncThunk(
    'puzzle/getPuzzle',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post('/puzzle', credentials);
            if(response.data.error){
                return thunkAPI.rejectWithValue({message: response.data.error});
            }
            return response.data; 
        } 
        catch (error) {
            return thunkAPI.rejectWithValue({message: error.response?.data || 'Something went wrong'});
        }
    }
);

export const solvedPuzzle = createAsyncThunk(
    'puzzle/setPuzzleSolved',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post('/puzzle-solved', credentials);
            if(response.data.error){
                return thunkAPI.rejectWithValue({message: response.data.error});
            }
            return response.data[0]; 
        } 
        catch (error) {
            return thunkAPI.rejectWithValue({message: error.response?.data || 'Something went wrong'});
        }
    }
);

export const getPuzzles = createAsyncThunk(
    'puzzle/getPuzzles',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post('/puzzles', credentials);
            if(response.data.error){
                return thunkAPI.rejectWithValue({message: response.data.error});
            }
            return response.data; 
        } 
        catch (error) {
            return thunkAPI.rejectWithValue({message: error.response?.data || 'Something went wrong'});
        }
    }
);

export const solvedBlitz = createAsyncThunk(
    'puzzle/setBlitzSolved',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post('/blitz-solved', credentials);
            if(response.data.error){
                return thunkAPI.rejectWithValue({message: response.data.error});
            }
            return response.data[0]; 
        } 
        catch (error) {
            return thunkAPI.rejectWithValue({message: error.response?.data || 'Something went wrong'});
        }
    }
);

export const getPuzzlesForSeries = createAsyncThunk(
    'puzzle/getSeriesPuzzles',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post('/puzzles', credentials);
            if(response.data.error){
                return thunkAPI.rejectWithValue({message: response.data.error});
            }
            return response.data; 
        } 
        catch (error) {
            return thunkAPI.rejectWithValue({message: error.response?.data || 'Something went wrong'});
        }
    }
);

export const solvedSeries = createAsyncThunk(
    'puzzle/setSeriesSolved',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post('/series-solved', credentials);
            if(response.data.error){
                return thunkAPI.rejectWithValue({message: response.data.error});
            }
            return response.data[0]; 
        } 
        catch (error) {
            return thunkAPI.rejectWithValue({message: error.response?.data || 'Something went wrong'});
        }
    }
);