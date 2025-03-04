import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (

    <div className="flex w-full items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-50">
      <div className="h-[100vh] w-full bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 bg-white/60 border border-gray-300 rounded-xl text-center p-3 shadow-lg">
        <h1 className="text-6xl sm:text-4xl mt-11 font-extrabold text-gray-900 drop-shadow-lg">Welcome, shopper!</h1>
        <p className="text-gray-700 mb-6 text-base sm:text-lg mt-5">Your futuristic shopping awaits.</p>
        <Outlet />
      </div>
    </div>
  );
}; 

export default Layout;
