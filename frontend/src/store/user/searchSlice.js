import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getSearchResults = createAsyncThunk('/getsearchresults', async (keyword) => {
   const response = await axios.get(
      `${import.meta.env.BACKEND_URL}/user/search/${keyword}`,
   );
   return response.data;
})

const SearchSlice = createSlice({
   name: 'searchSlice',
   initialState: {
      isLoading: false,
      searchResults: []
   },
   reducers: {
      resetSearchResults: (state)=> {
         state.searchResults =[]
      }
   },
   extraReducers: (builder) => {
      builder
         .addCase(getSearchResults.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(getSearchResults.fulfilled, (state, action) => {
            state.isLoading = false;
            state.searchResults = action.payload.data;
         })
         .addCase(getSearchResults.rejected, (state) => {
            state.isLoading = false;
            state.searchResults = [];
         });
   }
})

export const {resetSearchResults} = SearchSlice.actions

export default SearchSlice.reducer