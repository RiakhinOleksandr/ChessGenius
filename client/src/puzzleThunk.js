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