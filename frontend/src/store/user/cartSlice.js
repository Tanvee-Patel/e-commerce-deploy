import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
   cartItems: [],
   isLoading: false
}

export const addToCart = createAsyncThunk('/cart/addToCart',async ({userId, productId, quantity})=>{
   const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/user/cart/add`,
      {
         userId, productId, quantity
      }
    );
    return response.data;
})

export const fetchCartItems = createAsyncThunk('/cart/fetchCartItems',async (userId)=>{
   const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/user/cart/get/${userId}`,
    );
    return response.data;
})

export const updateCartItemQuantity = createAsyncThunk('/cart/updateCartItemQuantity',async ({userId, items})=>{
   const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/user/cart/update-cart`,
      {
         userId, items
      }
    );
    return response.data;
})

export const deleteCartItem = createAsyncThunk('/cart/deleteCartItems',async ({userId, productId})=>{
   const response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/user/cart/${userId}/${productId}`,
    );
    return response.data;
})
 
const userCartSlice = createSlice({
   name: 'userCart',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder.addCase(addToCart.pending, (state) => {
         state.isLoading = true;
       })
       .addCase(addToCart.fulfilled, (state, action) => {
         state.isLoading = false;
         state.cartItems = action.payload.data;
       })
       .addCase(addToCart.rejected, (state) => {
         state.isLoading = false;
         state.cartItems = [];
       })
       .addCase(fetchCartItems.pending, (state) => {
         state.isLoading = true;
       })
       .addCase(fetchCartItems.fulfilled, (state, action) => {
         state.isLoading = false;
         state.cartItems = action.payload.data;
       })
       .addCase(fetchCartItems.rejected, (state) => {
         state.isLoading = false;
         state.cartItems = [];
       })
       .addCase(updateCartItemQuantity.pending, (state) => {
         state.isLoading = true;
       })
       .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
         state.isLoading = false;
         state.cartItems = action.payload.data;
       })
       .addCase(updateCartItemQuantity.rejected, (state) => {
         state.isLoading = false;
         state.cartItems = [];
       })
       .addCase(deleteCartItem.pending, (state) => {
         state.isLoading = true;
       })
       .addCase(deleteCartItem.fulfilled, (state, action) => {
         state.isLoading = false;
         state.cartItems = action.payload.data;
       })
       .addCase(deleteCartItem.rejected, (state) => {
         state.isLoading = false;
         state.cartItems = [];
       });
   }
})

export default userCartSlice.reducer;