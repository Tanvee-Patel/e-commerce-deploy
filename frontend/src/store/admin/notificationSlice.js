import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchNotifications = createAsyncThunk("notifications/fetch", async (_, { rejectWithValue }) => {
   try {
     const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications`);
     console.log("API Response:", response.data); 
     return Array.isArray(response.data) ? response.data : [];
   } catch (error) {
     return rejectWithValue(error.response.data);
   }
 });

 export const markAsRead = createAsyncThunk("notifications/markAsRead", async (notificationId, { rejectWithValue }) => {
   try {
     await axios.put(`${import.meta.env.VITE_BACKEND_URL}/notifications/${notificationId}/read`);
     return notificationId;
   } catch (error) {
     return rejectWithValue(error.response.data);
   }
 });

 export const deleteNotification = createAsyncThunk("notifications/delete", async (notificationId, { rejectWithValue }) => {
   try {
     await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/notifications/${notificationId}`);
     return notificationId;
   } catch (error) {
     return rejectWithValue(error.response.data);
   }
 });

const notificationSlice = createSlice({
   name: "anotifications",
   initialState: {
      notifications: [],
      status: "idle",
      error: null
   },
   reducers: {
      addNotification: (state, action) => {
         state.notifications.push(action.payload);
      }
   },
   extraReducers: (builder) => {
      builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
         state.notifications = action.payload;
       })
       .addCase(markAsRead.fulfilled, (state, action) => {
         const notification = state.notifications.find(n => n._id === action.payload);
         if (notification) notification.isRead = true;
       })
       .addCase(deleteNotification.fulfilled, (state, action) => {
         state.notifications = state.notifications.filter(n => n._id !== action.payload);
       });
   }
})

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;