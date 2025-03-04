import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createOrder = createAsyncThunk('/order/createOrder', async (orderData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.BACKEND_URL}/user/order/create`,
      orderData
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Something went wrong');
  }
})

export const capturePayment = createAsyncThunk('/order/capturePayment', async ({ paymentId, payerId, orderId }, { rejectWithValue }) => {  
  try {
    const response = await axios.post(
      `${import.meta.env.BACKEND_URL}/user/order/capture`,
      {
        paymentId, payerId, orderId
      }
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Something went wrong');
  }
})

export const getAllOrderByUser = createAsyncThunk(
  '/order/getAllOrderByUser', async (userId) => {
    const response = await axios.get(
      `${import.meta.env.BACKEND_URL}/user/order/list/${userId}`,
    );
    return response.data;
  })

export const getOrderDetails = createAsyncThunk(
  '/order/getOrderDetails', async (id) => {
    const response = await axios.get(
      `${import.meta.env.BACKEND_URL}/user/order/details/${id}`);
    return response.data;
  })

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    approvalURL: null,
    isLoading: false,
    orders: [],
    status: 'idle',
    orderStatus: 'Pending',
    orderDetails: null
  },
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'confirmed';
        state.approvalURL = action.payload.approvalURL

        state.orders.push(action.payload.order);
        state.orderDetails = {
          orderId: action.payload.orderId
        };
        state.orderStatus = action.payload.orderStatus || state.orderStatus;
        sessionStorage.setItem('currentOrderId', JSON.stringify(action.payload.orderId))
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getAllOrderByUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrderByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.data;
      })
      .addCase(getAllOrderByUser.rejected, (state) => {
        state.isLoading = false;
        state.orders = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = {
          ...action.payload.data,
          addressInfo: action.payload.data.addressInfo || {},
        };
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
      .addCase(capturePayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(capturePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
        state.orderStatus = action.payload.data.orderStatus || state.orderStatus;
      })
      .addCase(capturePayment.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      });
  },
});

export const { resetOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;
