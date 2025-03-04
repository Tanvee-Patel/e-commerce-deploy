import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function VerifyOtp() {
  const { email } = useParams();
  const decodedEmail = decodeURIComponent(email);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!decodedEmail) {
      toast.error('Invalid or missing email.');
      navigate('/auth/forgot-password');
    }
  }, [decodedEmail, navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      toast.error('OTP must be a valid 6-digit number.');
      return;
    }

    setIsLoading(true);
    try {
      const baseURL = import.meta.env.BACKEND_URL;
      const { data } = await axios.post(`${baseURL}/auth/verify-otp`, { email: decodedEmail, otp });
      toast.success(data?.message || 'OTP verified successfully.');
      navigate(`/auth/reset-password/${encodeURIComponent(data.resetToken)}?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('Error during OTP verification:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-7 rounded-xl">
      <div className="w-full h-full max-w-lg p-11">
        <div className='text-center'>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-4 decoration-primary-300 decoration-3 underline-offset-4">Verify OTP</h1>
          <p className="text-xl text-gray-700 mb-6">
            Enter the One-Time Password (OTP) sent to your email address to verify your identity.
          </p>
          <form
            onSubmit={handleVerifyOtp}
            className="space-y-6 p-8 rounded-xl">
            <div>
              {/* <label className="block text-gray-700 font-semibold mb-2" htmlFor="otp">OTP</label> */}
              <input
                type="text"
                id="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`max-w-full p-8 bg-blue-400 hover:bg-blue-500 py-3 rounded-xl font-semibold${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn’t receive an OTP?{' '}
              <a href="/auth/forgot-password" className="text-blue-500 hover:underline font-medium">
                Resend OTP
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
