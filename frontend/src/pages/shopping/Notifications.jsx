import socket from '@/store/socket'
import { addNotification, deleteNotification, fetchNotifications, markAsRead } from '@/store/user/notificationSlice';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'



const Notifications = () => {
  const { user } = useSelector((state) => state.auth);
  const notifications = useSelector(state => state.notifications.notifications)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch]);  

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <div className="w-full max-w-lg space-y-8">
        <h2 className="text-xl font-bold mb-4">Notifications</h2>
      </div>
      <div className="bg-white rounded-xl">
        <ul className="divide-y divide-gray-300 space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <li key={notif._id} className={`p-3 ring-2 ring-primary-300 shadow-md rounded-xl mb-4 ${notif.isRead ? "opacity-50" : ""}`}>
                {notif.message}
                <div className="mt-2 flex gap-3">
                  {!notif.isRead && (
                    <button onClick={() => dispatch(markAsRead(notif._id))} className="text-blue-500">Mark as Read</button>
                  )}
                  <button onClick={() => dispatch(deleteNotification(notif._id))} className="text-red-500">Delete</button>
                </div>
              </li>
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
export default Notifications;
