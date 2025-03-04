import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const sendContactMessage = createAsyncThunk("contact/sendMessage", async (formData, { rejectWithValue }) => {
   try {
      const { data } = await axios.post(`${import.meta.env.BACKEND_URL}/contact/contact-form`, formData);
      return data;
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
   }
});

export const fetchMessages = createAsyncThunk("contact/fetchMessages", async (_, { rejectWithValue }) => {
   try {
      const { data } = await axios.get(`${import.meta.env.BACKEND_URL}/contact/messages`);
      return data;
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch messages");
   }
});

const contactSlice = createSlice({
   name: "contact",
   initialState: {
      messages: [],
      loading: false,
      success: false,
      error: null,
   },
   reducers: {
      clearSuccess: (state) => { state.success = false; },
   },
   extraReducers: (builder) => {
      builder
         .addCase(sendContactMessage.pending, (state) => {
            state.loading = true;
         })
         .addCase(sendContactMessage.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
         })
         .addCase(sendContactMessage.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
         .addCase(fetchMessages.fulfilled, (state, action) => {
            state.messages = action.payload;
         });
   },
});

export const { clearSuccess } = contactSlice.actions;
export default contactSlice.reducer;
