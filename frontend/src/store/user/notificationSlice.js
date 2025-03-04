import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
   name: "notifications",
   initialState: {
      notifications: JSON.parse(localStorage.getItem("notifications")) || []
   },
   reducers: {
      addNotification: (state, action) => {
         state.notifications.push(action.payload);
         localStorage.setItem("notifications", JSON.stringify(state.notifications))
      },
      clearNotifications: (state) => {
         state.notifications = [];
         localStorage.removeItem("notifications")
      }
   }
})

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;