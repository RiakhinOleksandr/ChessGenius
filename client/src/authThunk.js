import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from './api/axios';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post('/login', credentials);
            if(response.data.error){
                return thunkAPI.rejectWithValue({message: response.data.error});
            }
            return response.data.user; 
        } 
        catch (error) {
            return thunkAPI.rejectWithValue({message: error.response?.data || 'Something went wrong'});
        }
    }
);

export const signUpUser = createAsyncThunk(
    'auth/signUpUser',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post('/register', credentials);
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