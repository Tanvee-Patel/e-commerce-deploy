import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addProductReview = createAsyncThunk('/addProductReview', 
   async (reviewData, { rejectWithValue }) => {
   try {
      const response = await axios.post(
         `${import.meta.env.VITE_BACKEND_URL}/user/review/add`,
         reviewData
      );
      return response.data;
   } catch (error) {
      return rejectWithValue(error.response?.data?.message);
   }
})

export const getProductReviews = createAsyncThunk('/getProductReviews', async (productId) => {
   const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/user/review/${productId}`,
   );
   return response.data;
})

const ReviewSlice = createSlice({
   name: 'reviewSlice',
   initialState: {
      isLoading: false,
      reviews: []
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(addProductReview.pending, (state) => {
            state.isLoading = true;
            state.error = null;
         })
         .addCase(addProductReview.fulfilled, (state, action) => {
            state.isLoading = false;
            state.reviews.push(action.payload.data); 
         })
         .addCase(addProductReview.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
         })
         .addCase(getProductReviews.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(getProductReviews.fulfilled, (state, action) => {
            state.isLoading = false;
            state.reviews = action.payload.data;
         })
         .addCase(getProductReviews.rejected, (state) => {
            state.isLoading = false;
            state.reviews = [];
         });
   }
})

export default ReviewSlice.reducer