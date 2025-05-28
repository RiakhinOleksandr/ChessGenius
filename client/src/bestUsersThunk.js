import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from './api/axios';

export const bestInPuzzle = createAsyncThunk(
    'best/getBestInPuzzle',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post('/best-puzzle', credentials);
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

export const bestInBlitz = createAsyncThunk(
    'best/getBestInBlitz',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post('/best-blitz', credentials);
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

export const bestInSeries = createAsyncThunk(
    'best/getBestInSeries',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post('/best-series', credentials);
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