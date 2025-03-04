import { addNotification } from '@/store/admin/notificationSlice';
import socket from '@/store/socket'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Notification = () => {
  const { user } = useSelector((state) => state.auth);
  const notifications = useSelector((state) => state.anotifications.notifications);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.role === 'admin') {
      socket.connect();
      socket.emit("join", "admin");

      socket.on("notification", (message) => {
        console.log("📩 New Admin Notification:", message);
        if (Array.isArray(message)) {
          message.forEach(notification => {
            dispatch(addNotification(notification));
          })
        }
        else {
          dispatch(addNotification(message));
        }
      });

      return () => {
        socket.off("notification");
        socket.disconnect();
      };
    }
  }, [user, dispatch]);

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <div className="w-full max-w-lg space-y-8">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
        </div>
        <div className="bg-white rounded-xl">
          <ul className="divide-y divide-gray-300 space-y-4">
            {notifications.length > 0 ? (
              notifications.map((msg, index) => (
                <li key={index} className="p-3 ring-2 ring-primary-300 shadow-md rounded-xl mb-4">{msg}</li>
              ))
            )
              : (
                <p>No new notifications</p>
              )}
          </ul>
      </div>
    </div>
  );
};
export default Notification;
