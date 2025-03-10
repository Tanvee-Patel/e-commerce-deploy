import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { requestOtp } from '@/store/forgotPasswordSlice';

function ForgotPassword() {
   const [email, setEmail] = useState('');
   const navigate = useNavigate();
   const dispatch = useDispatch()
   const { isLoading } = useSelector(state => state.forgotPassword)

   const handleForgotPassword = async (e) => {
      e.preventDefault();

      if (!email) {
         toast.error('Please provide your email.');
         return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
         toast.error('Please enter a valid email address.');
         return;
      }
      try {
         const data = await dispatch(requestOtp({ email: email, action: "sendOtp" })).unwrap()
         if (data?.message?.includes("OTP sent")) {
            toast.success('OTP sent successfully.')
            navigate(`/auth/verify-otp/${encodeURIComponent(email)}`);
         }
         else {
            toast.error(data.message || 'Failed to send OTP.');
         }
      } catch (error) {
         toast.error(error.message || 'Something went wrong.');
      }
   }

   return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-60 rounded-xl">
      <div className="w-full h-full max-w-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-4 decoration-primary-300 decoration-3 underline-offset-4">
            Forgot Password?
          </h1>
          <p className="text-xl text-white mb-2 mt-7">
            Enter your email to receive a One-Time Password (OTP) to reset your password.
          </p>
        </div>

        <div className="rounded-xl shadow-sm p-10 space-y-2">
          <form onSubmit={handleForgotPassword} className="space-y-6 p-6">
            <div>
              <input
                type="email"
                id="email"
                placeholder="Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm"
              />
            </div>
            <div className='flex justify-center'>
            <button
              type="submit"
              className={`max-w-full p-8 bg-blue-400 hover:bg-blue-500 py-3 rounded-xl font-semibold ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-base text-white">
            Remembered your password?{' '}
            <Link to="/auth/login" className="text-primary-500 hover:underline font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
   );
};
export default ForgotPassword;