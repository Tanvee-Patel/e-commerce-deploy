import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPassword, resetPasswordRequest } from '@/store/resetPasswordSlice';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email')

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      const response = dispatch(resetPassword({ newPassword, confirmPassword, resetToken, email })).unwrap()
      toast.success(response.data || "Redirecting to Login page");

      navigate('/auth/login');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-60 rounded-xl">
      <div className="w-full h-full max-w-lg space-y-12">
        <div className='text-center'>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-4 decoration-primary-300 decoration-3 underline-offset-4">Reset Password</h1>
        </div>
        <div className='rounded-xl shadow-sm space-y-6'>
          <form onSubmit={handleSubmit} className="space-y-7 rounded-xl shadow-sm p-8">
            <div>
              <input
                type="password"
                placeholder="Enter New Password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm New Password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm"
              />
            </div>
            <div className='flex justify-center'>
              <button
                type="submit"
                className="max-w-full flex p-8 bg-primary-50 bg-blue-400 hover:bg-blue-500 py-3 rounded-xl font-medium hover:bg-primary-600 transition duration-300">
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
