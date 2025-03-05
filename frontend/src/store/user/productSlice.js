import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

const initialState = {
   isLoading: false,
   productList: [],
   productDetails: null
}

export const fetchAllFilteredProducts = createAsyncThunk('/products/fetchAllFilteredProducts', async ({ filterParams, sortParams }) => {
   const query = new URLSearchParams()
   Object.keys(filterParams).forEach(key => {
      if (Array.isArray(filterParams[key])) {
         query.append(key, filterParams[key].join(","));
      } else {
         query.append(key, filterParams[key]);
      }
   });

   query.append('sortBy', sortParams);

   const result = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/user/products/get?${query.toString()}`
   );
   return result?.data;
})

export const fetchProductDetails = createAsyncThunk('/products/fetchProductDetails', async (id) => {
   const result = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/user/products/get/${id}`,
   );
   return result?.data;
})

const UserProductSlice = createSlice({
   name: 'userProduct',
   initialState,
   reducers: {
      setProductDetails: (state) => {
         state.productDetails = null
      }
   },
   extraReducers: (builder) => {
      builder.addCase(fetchAllFilteredProducts.pending, (state, action) => {
         state.isLoading = true
      }).addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
         state.isLoading = false;
         state.productList = action.payload.data;
      }).addCase(fetchAllFilteredProducts.rejected, (state, action) => {
         state.isLoading = false;
         state.productList = [];
      }).addCase(fetchProductDetails.pending, (state, action) => {
         state.isLoading = true;
      }).addCase(fetchProductDetails.fulfilled, (state, action) => {
         state.isLoading = false;
         state.productDetails = action.payload.data;
      }).addCase(fetchProductDetails.rejected, (state, action) => {
         state.isLoading = false;
         state.productDetails = null
      })
   }
})

export const { setProductDetails } = UserProductSlice.actions;

export default UserProductSlice.reducer;