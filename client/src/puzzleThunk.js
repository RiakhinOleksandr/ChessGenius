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
            console.log(response.data[0])
            return response.data[0]; 
        } 
        catch (error) {
            return thunkAPI.rejectWithValue({message: error.response?.data || 'Something went wrong'});
        }
    }
);