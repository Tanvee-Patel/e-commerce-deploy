import socket from '@/store/socket'
import { addNotification } from '@/store/user/notificationSlice';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Notifications = () => {
  const { user } = useSelector((state) => state.auth);
  const notifications = useSelector(state => state.notifications.notifications)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user && user.id) {
      socket.connect();
      socket.emit("join", user.id);

      socket.on("notification", (message) => {
        console.log("📩 New Notification:", message);
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
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-7">
      <div className="space-y-8 bg-white rounded-xl p-5 shadow">
        <div className='w-full max-w-lg '>
          <h2 className="text-xl font-bold mb-4">
            Notifications
          </h2>
          </div>
        <div className="bg-white rounded-xl shadow-xl">
          <ul className="divide-y divide-gray-300 space-y-4">
            {notifications.length > 0 ? (
              notifications.map((msg, index) => (
                <li key={index} className="p-3 ring-2 ring-primary-300 shadow-md rounded-xl mb-4">
                  {msg}
                </li>
              ))
            ) : (
              <p>No new notifications</p>
            )}
          </ul>
        </div>

        </div>
    </div>
  )
}

export default Notifications