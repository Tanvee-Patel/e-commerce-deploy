import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addFeatureImage = createAsyncThunk('addFeatureImage', async (image) => {
   const response = await axios.post(
      `${import.meta.env.BACKEND_URL}/common/feature/add`,
      {image}
   );
   return response.data;
})

export const getFeatureImages = createAsyncThunk('getFeatureImage', async () => {
   const response = await axios.get(
      `${import.meta.env.BACKEND_URL}/common/feature/get`,
   );
   return response.data;
})

export const deleteFeatureImage = createAsyncThunk('deleteFeatureImage', async(imageId)=>{
   const response = await axios.delete(`${import.meta.env.BACKEND_URL}/common/feature/delete/${imageId}`)
   return response.data;
})

const commonSlice = createSlice({
   name: 'commonSlice',
   initialState: {
      isLoading: false,
      featureImageList: []
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(getFeatureImages.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(getFeatureImages.fulfilled, (state, action) => {
            state.isLoading = false;
            state.featureImageList = action.payload.data;
         })
         .addCase(getFeatureImages.rejected, (state) => {
            state.isLoading = false;
            state.reviews = [];
         })
         .addCase(deleteFeatureImage.fulfilled, (state, action) => {
            state.featureImageList = state.featureImageList.filter(image => image._id !== action.meta.arg);
         });
   }
})

export default commonSlice.reducer