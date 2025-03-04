import axios from "axios"
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
   isLoading: false,
   addressList: [],
}

export const addNewAddress = createAsyncThunk('/addresses/addNewAddress', async (FormData) => {
   const response = await axios.post(`${import.meta.env.BACKEND_URL}/user/address/add`, FormData)
   return response.data;
})
 
export const editAddress = createAsyncThunk('/addresses/editAddress', async ({ userId, addressId, formData }) => {
   const response = await axios.put(`${import.meta.env.BACKEND_URL}/user/address/update/${userId}/${addressId}`, formData)
   return response.data;
})

export const fetchAllAddress = createAsyncThunk('/addresses/fetchAllAddress', async ( userId ) => {
   const response = await axios.get(`${import.meta.env.BACKEND_URL}/user/address/get/${userId}`)
   return response.data;
})

export const deleteAddress = createAsyncThunk('/addresses/deleteAddress', async ({ userId, addressId }) => {
   const response = await axios.delete(`${import.meta.env.BACKEND_URL}/user/address/delete/${userId}/${addressId}`)
   return response.data;
})

const addressSlice = createSlice({
   name: 'userAddress',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder.addCase(addNewAddress.pending, (state) => {
         state.isLoading = true;
      }) 
         .addCase(addNewAddress.fulfilled, (state, action) => {
            state.isLoading = false;
            state.addressList = action.payload.data
         })
         .addCase(addNewAddress.rejected, (state) => {
            state.isLoading = false;
            state.addressList = []
         })
         .addCase(fetchAllAddress.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(fetchAllAddress.fulfilled, (state, action) => {
            state.isLoading = false;
            state.addressList = [...action.payload.data];
         })
         .addCase(fetchAllAddress.rejected, (state) => {
            state.isLoading = false;
            state.addressList = [];
         })
         .addCase(editAddress.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(editAddress.fulfilled, (state, action) => {
            state.isLoading = false;
            state.addressList = state.addressList.map(address => 
               address._id === action.payload.data._id ? action.payload.data : address
            );
         })
         .addCase(editAddress.rejected, (state) => {
            state.isLoading = false;
         });         
   }
})

export const { setSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;