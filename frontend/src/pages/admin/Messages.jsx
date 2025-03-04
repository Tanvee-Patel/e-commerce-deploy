import { fetchMessages } from '@/store/contactSlice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Messages = () => {
   const dispatch = useDispatch()
   const { messages, loading, error } = useSelector(state => state.contact)

   useEffect(() => {
      dispatch(fetchMessages())
   }, [dispatch])

   if (loading) return <p>Loading messages...</p>;
   if (error) return <p>Error: {error}</p>;

   return (
      <div className="w-full mx-auto p-6 bg-white shadow-md rounded-xl  ">
         <h2 className="text-2xl font-bold text-gray-800 mb-4">Messages</h2>
         {messages.length === 0 ? (
            <p className="text-gray-600 text-center">No messages found.</p>
         ) : (
            <ul className="divide-y divide-gray-200">
               {messages.map((message) => (
                  <li key={message.id} className="p-4 border rounded-xl shadow-sm mb-2 ring-2">
                     <p className="text-gray-700"><strong className="text-gray-900">{message.name}</strong> ({message.email}):</p>
                     <p className="text-gray-600 mt-1">{message.message}</p>
                  </li>
               ))}
            </ul>
         )}
      </div>
   )
}

export default Messages