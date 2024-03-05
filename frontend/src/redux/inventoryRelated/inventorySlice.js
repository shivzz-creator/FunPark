import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    inventoryList: [],
    loading: false,
    error: null,
    response: null,
};

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.complainsList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError
} = inventorySlice.actions;

export const inventoryReducer = inventorySlice.reducer;