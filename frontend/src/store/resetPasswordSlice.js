import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;

export const resetPasswordRequest = createAsyncThunk('resetPassword/request',
   async ({ email }) => {
      try {
         const response = await axios.post(`${import.meta.env.BACKEND_URL}/auth/reset-password-request`, { email })         
         return response.data;
      } catch (error) {
         console.error("Failed to reset password");
      }
   })

export const resetPassword = createAsyncThunk('resetPassword',
   async ({ email, newPassword, confirmPassword, resetToken }, { rejectWithValue }) => {
      try {
         const response = await axios.post(`${import.meta.env.BACKEND_URL}/auth/reset-password`, { email, newPassword, confirmPassword, resetToken }, {withCredentials: true})
         return response.data;
      } catch (error) {
         console.error("Failed to reset password");
         return rejectWithValue(error.response?.data || "Unknown error occurred");
      }
   })

const resetPasswordSlice = createSlice({
   name: 'resetPassword',
   initialState: {
      isLoading: false,
      success: false,
      error: null
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
      .addCase(resetPasswordRequest.pending, (state) => {
         state.isLoading = true;
         state.error = null;
      })
      .addCase(resetPasswordRequest.fulfilled, (state) => {
         state.isLoading = false;
      })
      .addCase(resetPasswordRequest.rejected, (state, action) => {
         state.isLoading = false;
         state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
         state.isLoading = true;
         state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
         state.isLoading = false;
         state.success = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
         state.isLoading = false;
         state.error = action.payload;
      });
   }
})

export default resetPasswordSlice.reducer;