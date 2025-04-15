// store/projectsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
    const token = Cookies.get('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data;
});

const projectsSlice = createSlice({
    name: 'projects',
    initialState: {
        items: [],
        status: 'idle',
    },
    reducers: {
        setProjects: (state, action) => {
            state.items = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchProjects.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const { setProjects } = projectsSlice.actions;
export default projectsSlice.reducer;
