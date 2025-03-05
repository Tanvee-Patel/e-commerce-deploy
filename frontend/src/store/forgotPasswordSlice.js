import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const requestOtp = createAsyncThunk('forgotPassword',
   async ({ email } , { rejectWithValue }) => {
      try {
         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/forgot-password`, { email, action: "sendOtp" });
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response?.data?.message || "Failed to send OTP");
      }
   });

export const verifyOtp = createAsyncThunk('verifyOtp',
   async ({ email, otp }, { rejectWithValue }) => {
      try {
         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/verify-otp`, { email, otp });
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response?.data?.message || "Invalid OTP");
      }
   });

const forgotPasswordSlice = createSlice({
   name: 'forgotPassword',
   initialState: {
      email: "",
      isLoading: false,
      otpSent: false,
      otpVerified: false,
      error: null
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(requestOtp.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(requestOtp.fulfilled, (state, action) => {
            state.isLoading = false;
            state.otpSent = true;
            state.email = action.meta.arg.email;
         })
         .addCase(requestOtp.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
         })
         .addCase(verifyOtp.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(verifyOtp.fulfilled, (state) => {
            state.isLoading = false;
            state.otpVerified = true;
         })
         .addCase(verifyOtp.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
         });
   }
})

export default forgotPasswordSlice.reducer;