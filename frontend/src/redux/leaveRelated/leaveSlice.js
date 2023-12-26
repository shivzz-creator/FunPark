import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    leaveRequestsList: [],
    loading: false,
    error: null,
    response: null,
};

const leaveSlice = createSlice({
    name: 'leave',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.leaveRequestsList = action.payload;
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
        },
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
} = leaveSlice.actions;

export const leaveReducer = leaveSlice.reducer;
