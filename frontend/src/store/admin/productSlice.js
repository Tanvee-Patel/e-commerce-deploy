import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

const initialState = {
   isLoading: false,
   productList: []
} 

export const addNewProduct = createAsyncThunk('/products/addnewproduct',async (formData)=>{
   const result = await axios.post(
      `${import.meta.env.BACKEND_URL}/admin/products/add`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data;
})

export const fetchAllProducts = createAsyncThunk('/products/fetchAllProducts',async ()=>{
   const result = await axios.get(
      `${import.meta.env.BACKEND_URL}/admin/products/get`,
    );
    return result?.data;
})

export const editProduct = createAsyncThunk('/products/editProduct',async ({id, formData})=>{
   const result = await axios.put(
      `${import.meta.env.BACKEND_URL}/admin/products/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data;
})

export const deleteProduct = createAsyncThunk('/products/deleteProduct',async (id)=>{
   const result = await axios.delete(
      `${import.meta.env.BACKEND_URL}/admin/products/delete/${id}`
    );
    return result?.data;
})

const AdminProductSlice = createSlice({
   name: 'adminProducts',
   initialState,
   reducers: {},
   extraReducers : (builder)=>{
      builder.addCase(fetchAllProducts.pending,(state)=>{
         state.isLoading= true;
      }).addCase(fetchAllProducts.fulfilled,(state,action)=>{
         state.isLoading= false;
         state.productList = action.payload.data;
      }).addCase(fetchAllProducts.rejected,(state,action)=>{
         state.isLoading= false
         state.productList=[]
      }).addCase(editProduct.fulfilled, (state, action)=>{
         state.isLoading = false;
         const updatedProduct = action.payload.data;
         const index = state.productList.findIndex((product)=>product.id === updatedProduct.id)
         if(index !== -1){
            state.productList[index] = updatedProduct
         }
      }) .addCase(editProduct.rejected, (state) => {
         state.isLoading = false;
         toast.error('Failed to edit the product');
       });
   }
})

export default AdminProductSlice.reducer;