import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const Layout = () => {
  return (
    <div className="flex w-full h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="flex flex-col md:flex-row w-full h-full border border-gray-700 rounded-xl overflow-hidden shadow-xl backdrop-blur-lg">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md p-12 text-center rounded-l-xl"
        >
          <h1 className="text-5xl font-bold text-white drop-shadow-lg font-sans">
            Welcome, Shopper!
          </h1>
          <motion.p 
            className="text-gray-300 text-xl mt-6 tracking-wide leading-relaxed"
          >
            {"Your futuristic shopping awaits.".split("").map((letter, index) => (
              <motion.span 
                key={index} 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.1 }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 flex flex-col justify-center h-full p-8 bg-white/10 backdrop-blur-md rounded-r-xl"
        >
          <div className="flex items-center justify-center">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Layout;
